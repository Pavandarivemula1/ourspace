import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { respondToIntroduction } from '@/services/collaborations/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { accept, declineReason } = await req.json();

    const result = await respondToIntroduction(id, user.id, Boolean(accept), declineReason);

    return NextResponse.json({
      success: true,
      result,
      message: accept
        ? 'Introduction accepted! You are now connected and can message directly.'
        : 'Introduction declined.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
