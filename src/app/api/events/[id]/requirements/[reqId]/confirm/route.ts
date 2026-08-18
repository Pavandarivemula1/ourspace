import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { confirmRequirement } from '@/services/events/workflow';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  try {
    const user = await requireAuth();
    const { reqId } = await params;
    const { userId, venueId } = await req.json();

    const confirmed = await confirmRequirement(reqId, { userId, venueId });

    return NextResponse.json({
      success: true,
      requirement: confirmed,
      message: 'Event requirement confirmed and workflow state updated!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
