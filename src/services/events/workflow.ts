import { prisma } from '@/lib/prisma';
import { dispatchNotification } from '../notifications/dispatcher';
import { logAuditAction } from '../audit/logger';

export const EVENT_STATUSES = [
  'DRAFT',
  'SEEKING_RESOURCES',
  'PARTIALLY_FULFILLED',
  'RESOURCES_FULFILLED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'LIVE',
  'COMPLETED',
  'OUTCOME_PENDING',
  'OUTCOME_RECORDED',
  'CANCELLED',
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export async function recalculateEventStatus(eventId: string): Promise<string> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      requirements: true,
      organizer: true,
    },
  });

  if (!event) throw new Error('Event not found');

  // Don't auto-downgrade terminal / manual states
  if (['COMPLETED', 'OUTCOME_PENDING', 'OUTCOME_RECORDED', 'CANCELLED'].includes(event.status)) {
    return event.status;
  }

  const reqs = event.requirements;
  if (reqs.length === 0) {
    if (event.status === 'DRAFT' || event.status === 'SEEKING_RESOURCES') {
      const updated = await prisma.event.update({
        where: { id: eventId },
        data: { status: 'REGISTRATION_OPEN' },
      });
      return updated.status;
    }
    return event.status;
  }

  const requiredReqs = reqs.filter((r) => r.required);
  const confirmedReqs = reqs.filter((r) => r.status === 'CONFIRMED');
  const allRequiredConfirmed = requiredReqs.every((r) => r.status === 'CONFIRMED');

  let newStatus = event.status;

  if (allRequiredConfirmed) {
    newStatus = 'REGISTRATION_OPEN'; // Or RESOURCES_FULFILLED
  } else if (confirmedReqs.length > 0) {
    newStatus = 'PARTIALLY_FULFILLED';
  } else {
    newStatus = 'SEEKING_RESOURCES';
  }

  if (newStatus !== event.status) {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: newStatus },
    });

    await logAuditAction({
      actorId: event.organizerId,
      action: 'EVENT_STATE_CHANGED',
      entityType: 'Event',
      entityId: eventId,
      details: { previousStatus: event.status, newStatus },
    });

    if (newStatus === 'REGISTRATION_OPEN') {
      await dispatchNotification({
        userId: event.organizerId,
        type: 'EVENT_REGISTRATION',
        title: `🚀 "${event.title}" is now Confirmed!`,
        message: 'All required resources (venue & speakers) have been confirmed. Registrations are now open to attendees.',
        link: `/events/${event.slug || event.id}`,
      });
    }
  }

  return newStatus;
}

export async function confirmRequirement(
  requirementId: string,
  data: { userId?: string; venueId?: string }
) {
  const req = await prisma.eventRequirement.findUnique({
    where: { id: requirementId },
    include: { event: true },
  });

  if (!req) throw new Error('Requirement not found');

  const updatedReq = await prisma.eventRequirement.update({
    where: { id: requirementId },
    data: {
      status: 'CONFIRMED',
      fulfilledByUserId: data.userId || null,
      fulfilledByVenueId: data.venueId || null,
      confirmedAt: new Date(),
    },
  });

  // If this requirement was a venue, also link the venue to the event directly
  if (data.venueId) {
    await prisma.event.update({
      where: { id: req.eventId },
      data: { venueId: data.venueId },
    });
  }

  // Recalculate event workflow status
  await recalculateEventStatus(req.eventId);

  return updatedReq;
}
