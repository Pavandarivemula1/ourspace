import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, requireAuth } from '@/lib/auth';
import { logAuditAction } from '@/services/audit/logger';

export async function GET() {
  try {
    await requireAdmin();

    const reports = await prisma.report.findMany({
      include: {
        reporter: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { targetType, targetId, reason, details } = await req.json();

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        targetType: targetType.toUpperCase(),
        targetId,
        reason: reason.toUpperCase(),
        details: details || 'Flagged for moderation',
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { reportId, status, actionTaken, adminNotes } = await req.json();

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        actionTaken: actionTaken || 'NONE',
        adminNotes: adminNotes || null,
      },
    });

    // If action is user suspension
    if (actionTaken === 'USER_SUSPENDED' && report.targetType === 'USER') {
      await prisma.user.update({
        where: { id: report.targetId },
        data: { status: 'SUSPENDED' },
      });
    }

    await logAuditAction({
      actorId: admin.id,
      action: 'REPORT_RESOLVED',
      entityType: 'Report',
      entityId: reportId,
      details: { actionTaken, status },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
