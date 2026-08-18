import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { recordOutcomeAndCompleteCollab } from '@/services/collaborations/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { outcomeType, title, description, metrics, eventId } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required for recording an outcome' }, { status: 400 });
    }

    const outcome = await recordOutcomeAndCompleteCollab({
      collaborationId: id !== 'none' ? id : undefined,
      eventId: eventId || undefined,
      outcomeType: outcomeType || 'PARTNERSHIP_CREATED',
      title,
      description,
      metrics,
      actorId: user.id,
    });

    return NextResponse.json({
      success: true,
      outcome,
      message: 'Outcome successfully recorded and collaboration completed! Reviews are now open.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
