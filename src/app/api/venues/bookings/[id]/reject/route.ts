import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { rejectVenueBooking } from '@/services/venues/bookingService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { reason } = await req.json().catch(() => ({}));

    const rejected = await rejectVenueBooking(id, user.id, reason);

    return NextResponse.json({
      success: true,
      booking: rejected,
      message: 'Booking request rejected.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
