import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { approveVenueBooking } from '@/services/venues/bookingService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const approved = await approveVenueBooking(id, user.id, body.responseNotes);

    return NextResponse.json({
      success: true,
      booking: approved,
      message: 'Booking approved! Event requirements have been fulfilled and address unlocked.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
