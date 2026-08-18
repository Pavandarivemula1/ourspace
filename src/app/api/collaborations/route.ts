import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createCollaboration } from '@/services/collaborations/service';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { connectionId, partnerId, title, description, category } = await req.json();

    if (!partnerId || !title || !description) {
      return NextResponse.json({ error: 'Partner, title, and description are required' }, { status: 400 });
    }

    const collaboration = await createCollaboration({
      connectionId,
      userAId: user.id,
      userBId: partnerId,
      title,
      description,
      category,
    });

    return NextResponse.json({
      success: true,
      collaboration,
      message: 'Collaboration initiated!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
