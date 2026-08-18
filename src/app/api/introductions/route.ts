import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendIntroductionRequest } from '@/services/collaborations/service';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const received = await prisma.introductionRequest.findMany({
      where: { recipientId: user.id },
      include: {
        requester: { include: { profile: true } },
        request: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const sent = await prisma.introductionRequest.findMany({
      where: { requesterId: user.id },
      include: {
        recipient: { include: { profile: true } },
        request: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ received, sent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { recipientId, requestId, reason, context } = await req.json();

    if (!recipientId || !reason) {
      return NextResponse.json({ error: 'Recipient and introduction reason are required' }, { status: 400 });
    }

    if (recipientId === user.id) {
      return NextResponse.json({ error: 'You cannot request an introduction to yourself' }, { status: 400 });
    }

    const intro = await sendIntroductionRequest({
      requesterId: user.id,
      recipientId,
      requestId,
      reason,
      context,
    });

    return NextResponse.json({
      success: true,
      intro,
      message: 'Introduction request sent! Direct messaging will unlock once accepted.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
