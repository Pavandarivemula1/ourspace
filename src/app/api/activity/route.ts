import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const [requests, offers, sentIntros, receivedIntros, bookings, collabs, events] = await Promise.all([
      prisma.request.findMany({
        where: { userId: user.id },
        include: { matches: { take: 3 } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.offer.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.introductionRequest.findMany({
        where: { requesterId: user.id },
        include: { recipient: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.introductionRequest.findMany({
        where: { recipientId: user.id },
        include: { requester: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.venueBookingRequest.findMany({
        where: {
          OR: [{ requesterId: user.id }, { venue: { ownerId: user.id } }],
        },
        include: { venue: true, requester: { include: { profile: true } }, event: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.collaboration.findMany({
        where: {
          OR: [{ userAId: user.id }, { userBId: user.id }],
        },
        include: {
          userA: { include: { profile: true } },
          userB: { include: { profile: true } },
          outcomes: { include: { reviews: true } },
        },
        orderBy: { startedAt: 'desc' },
        take: 10,
      }),
      prisma.event.findMany({
        where: { organizerId: user.id },
        include: { requirements: true, venue: true, registrations: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      requests,
      offers,
      sentIntros,
      receivedIntros,
      bookings,
      collabs,
      events,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
