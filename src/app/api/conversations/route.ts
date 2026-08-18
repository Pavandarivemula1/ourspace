import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: { include: { profile: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const formatted = conversations.map((c) => {
      const otherParticipant = c.participants.find((p) => p.userId !== user.id)?.user;
      return {
        id: c.id,
        type: c.type,
        title: c.title || otherParticipant?.name || 'Direct Chat',
        partner: otherParticipant,
        lastMessage: c.messages[0] || null,
        lastMessageAt: c.lastMessageAt,
      };
    });

    return NextResponse.json({ conversations: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
