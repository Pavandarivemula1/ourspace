import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Strict participant verification
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId: user.id },
    });

    if (!participant && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to view this conversation' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: {
        sender: { include: { profile: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId: user.id },
    });

    if (!participant && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to send messages in this conversation' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: user.id,
        content: content.trim(),
        isRead: false,
      },
      include: {
        sender: { include: { profile: true } },
      },
    });

    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
