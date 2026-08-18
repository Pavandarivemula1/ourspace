import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { dispatchNotification } from '@/services/notifications/dispatcher';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { registrations: true, organizer: true },
    });

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const existingReg = event.registrations.find((r) => r.userId === user.id);

    if (existingReg) {
      // Toggle / Cancel registration
      await prisma.eventRegistration.delete({ where: { id: existingReg.id } });
      return NextResponse.json({ registered: false, message: 'RSVP cancelled' });
    }

    const regCount = event.registrations.filter((r) => r.status === 'REGISTERED').length;
    const isWaitlist = regCount >= event.capacity;

    const reg = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        userId: user.id,
        status: isWaitlist ? 'WAITLISTED' : 'REGISTERED',
      },
    });

    await dispatchNotification({
      userId: event.organizerId,
      type: 'EVENT_REGISTRATION',
      title: `🎟️ New RSVP for ${event.title}`,
      message: `${user.name} registered for your event.`,
      link: `/events/${event.slug}`,
    });

    return NextResponse.json({
      registered: true,
      status: reg.status,
      message: isWaitlist ? 'Added to event waitlist.' : 'RSVP confirmed! See you at the event.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
