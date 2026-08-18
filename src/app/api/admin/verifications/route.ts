import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { logAuditAction } from '@/services/audit/logger';

export async function GET() {
  try {
    await requireAdmin();

    const pendingVenues = await prisma.venue.findMany({
      include: { owner: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const pendingUsers = await prisma.user.findMany({
      include: { profile: true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      venues: pendingVenues,
      users: pendingUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { entityType, entityId, isVerified } = await req.json();

    if (entityType === 'VENUE') {
      const updated = await prisma.venue.update({
        where: { id: entityId },
        data: { isVerified: Boolean(isVerified) },
      });

      await logAuditAction({
        actorId: admin.id,
        action: isVerified ? 'VENUE_VERIFIED' : 'VENUE_UNVERIFIED',
        entityType: 'Venue',
        entityId,
        details: { venueName: updated.name },
      });

      return NextResponse.json({ success: true, entity: updated });
    }

    if (entityType === 'USER') {
      const updated = await prisma.profile.update({
        where: { userId: entityId },
        data: { verificationLevel: isVerified ? 'ECOSYSTEM_VERIFIED' : 'UNVERIFIED' },
      });

      await logAuditAction({
        actorId: admin.id,
        action: isVerified ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
        entityType: 'User',
        entityId,
      });

      return NextResponse.json({ success: true, entity: updated });
    }

    return NextResponse.json({ error: 'Unknown entity type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
