import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        owner: { include: { profile: true } },
        org: true,
        eventsHosted: {
          take: 5,
          orderBy: { date: 'desc' },
        },
        bookingRequests: {
          where: currentUser ? { requesterId: currentUser.id } : { id: 'none' },
        },
      },
    });

    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });

    // Address Privacy: reveal exact address only if user is owner, admin, or has an approved booking!
    const isOwner = currentUser?.id === venue.ownerId || currentUser?.role === 'ADMIN';
    const hasApprovedBooking = venue.bookingRequests.some((b) => b.status === 'APPROVED');
    const canSeeAddress = isOwner || hasApprovedBooking;

    const sanitizedVenue = {
      ...venue,
      address: canSeeAddress ? venue.addressSecret : `${venue.neighborhood}, ${venue.locationCity} (Exact address unlocked upon approved booking)`,
      isAddressRevealed: canSeeAddress,
    };

    return NextResponse.json({ venue: sanitizedVenue, isOwner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
