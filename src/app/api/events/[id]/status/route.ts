import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { logAuditAction } from '@/services/audit/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { status } = await req.json();

    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.organizerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to change event status' }, { status: 403 });
    }

    const updated = await prisma.event.update({
      where: { id: event.id },
      data: { status },
    });

    await logAuditAction({
      actorId: user.id,
      action: 'EVENT_STATE_CHANGED',
      entityType: 'Event',
      entityId: event.id,
      details: { previousStatus: event.status, newStatus: status },
    });

    return NextResponse.json({
      success: true,
      event: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
