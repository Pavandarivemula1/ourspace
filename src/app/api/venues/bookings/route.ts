import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createVenueBooking } from '@/services/venues/bookingService';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter'); // 'received' or 'sent'

    const where: any = {};
    if (filter === 'received' || user.role === 'VENUE') {
      where.venue = { ownerId: user.id };
    } else {
      where.requesterId = user.id;
    }

    const bookings = await prisma.venueBookingRequest.findMany({
      where,
      include: {
        venue: true,
        requester: { include: { profile: true } },
        event: true,
        eventRequirement: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      venueId,
      eventId,
      eventRequirementId,
      targetDate,
      timeSlot,
      attendeeCount,
      purpose,
      specialRequirements,
    } = body;

    if (!venueId || !targetDate || !timeSlot || !purpose) {
      return NextResponse.json(
        { error: 'Venue, target date, time slot, and purpose are required' },
        { status: 400 }
      );
    }

    const booking = await createVenueBooking({
      venueId,
      requesterId: user.id,
      eventId,
      eventRequirementId,
      targetDate,
      timeSlot,
      attendeeCount: attendeeCount ? parseInt(attendeeCount, 10) : 40,
      purpose,
      specialRequirements,
    });

    return NextResponse.json({
      booking,
      message: 'Venue booking request submitted! The venue manager has been notified.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
