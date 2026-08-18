import { prisma } from '@/lib/prisma';
import { confirmRequirement } from '../events/workflow';
import { dispatchNotification } from '../notifications/dispatcher';
import { logAuditAction } from '../audit/logger';

export interface CreateBookingInput {
  venueId: string;
  requesterId: string;
  eventId?: string;
  eventRequirementId?: string;
  targetDate: string;
  timeSlot: string;
  attendeeCount: number;
  purpose: string;
  specialRequirements?: string;
}

export async function createVenueBooking(input: CreateBookingInput) {
  const venue = await prisma.venue.findUnique({
    where: { id: input.venueId },
    include: { owner: true },
  });

  if (!venue) throw new Error('Venue not found');

  const booking = await prisma.venueBookingRequest.create({
    data: {
      venueId: input.venueId,
      requesterId: input.requesterId,
      eventId: input.eventId || null,
      eventRequirementId: input.eventRequirementId || null,
      targetDate: input.targetDate,
      timeSlot: input.timeSlot,
      attendeeCount: input.attendeeCount,
      purpose: input.purpose,
      specialRequirements: input.specialRequirements || null,
      status: 'PENDING',
    },
  });

  // Notify venue owner
  await dispatchNotification({
    userId: venue.ownerId,
    type: 'VENUE_REQUEST',
    title: `📍 New Booking Inquiry for ${venue.name}`,
    message: `${input.purpose} (${input.attendeeCount} attendees) on ${input.targetDate}.`,
    link: `/venues/requests`,
  });

  return booking;
}

export async function approveVenueBooking(bookingId: string, actorId: string, responseNotes?: string) {
  const booking = await prisma.venueBookingRequest.findUnique({
    where: { id: bookingId },
    include: { venue: true, requester: true, event: true },
  });

  if (!booking) throw new Error('Booking request not found');
  if (booking.venue.ownerId !== actorId) {
    const adminCheck = await prisma.user.findUnique({ where: { id: actorId } });
    if (adminCheck?.role !== 'ADMIN') {
      throw new Error('Unauthorized to approve this venue booking');
    }
  }

  const updatedBooking = await prisma.venueBookingRequest.update({
    where: { id: bookingId },
    data: {
      status: 'APPROVED',
      responseNotes: responseNotes || 'Approved. Looking forward to hosting your event.',
      respondedAt: new Date(),
    },
  });

  // If connected to an event requirement, auto-fulfill it!
  if (booking.eventRequirementId) {
    await confirmRequirement(booking.eventRequirementId, { venueId: booking.venueId });
  } else if (booking.eventId) {
    // If directly linked to event, update event's venue
    await prisma.event.update({
      where: { id: booking.eventId },
      data: { venueId: booking.venueId },
    });
  }

  // Notify requester and reveal address
  await dispatchNotification({
    userId: booking.requesterId,
    type: 'VENUE_APPROVED',
    title: `🎉 Venue Approved: ${booking.venue.name}`,
    message: `Your booking for ${booking.targetDate} is confirmed! Venue Address: ${booking.venue.addressSecret}`,
    link: booking.eventId ? `/events/${booking.eventId}` : `/venues/${booking.venueId}`,
  });

  await logAuditAction({
    actorId,
    action: 'VENUE_APPROVED',
    entityType: 'VenueBookingRequest',
    entityId: bookingId,
    details: { venueId: booking.venueId, requesterId: booking.requesterId },
  });

  return updatedBooking;
}

export async function rejectVenueBooking(bookingId: string, actorId: string, reason?: string) {
  const booking = await prisma.venueBookingRequest.findUnique({
    where: { id: bookingId },
    include: { venue: true },
  });

  if (!booking) throw new Error('Booking request not found');
  if (booking.venue.ownerId !== actorId) {
    const adminCheck = await prisma.user.findUnique({ where: { id: actorId } });
    if (adminCheck?.role !== 'ADMIN') {
      throw new Error('Unauthorized to reject this venue booking');
    }
  }

  const updatedBooking = await prisma.venueBookingRequest.update({
    where: { id: bookingId },
    data: {
      status: 'REJECTED',
      responseNotes: reason || 'Unfortunately unavailable for the requested slot.',
      respondedAt: new Date(),
    },
  });

  await dispatchNotification({
    userId: booking.requesterId,
    type: 'VENUE_REQUEST',
    title: `Venue Booking Update: ${booking.venue.name}`,
    message: `Your booking request was declined: ${reason || 'Slot unavailable'}.`,
    link: `/venues/${booking.venueId}`,
  });

  return updatedBooking;
}
