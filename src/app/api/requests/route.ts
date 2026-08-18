import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { computeMatchesForRequest } from '@/services/matching/engine';
import { logAuditAction } from '@/services/audit/logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (type) where.requestType = type.toUpperCase();
    if (city) where.locationCity = { contains: city };
    if (category) where.category = category;
    if (userId) where.userId = userId;

    const requests = await prisma.request.findMany({
      where,
      include: {
        user: { include: { profile: true } },
        org: true,
        community: true,
        matches: {
          orderBy: { totalScore: 'desc' },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      requestType,
      title,
      description,
      locationCity,
      targetDate,
      targetTimeSlot,
      budgetType,
      budgetAmount,
      capacityNeeded,
      requirements,
      category,
      orgId,
      communityId,
    } = body;

    if (!requestType || !title || !description) {
      return NextResponse.json(
        { error: 'Request type, title, and description are required' },
        { status: 400 }
      );
    }

    const newRequest = await prisma.request.create({
      data: {
        userId: user.id,
        orgId: orgId || null,
        communityId: communityId || null,
        requestType: requestType.toUpperCase(),
        title,
        description,
        locationCity: locationCity || user.profile?.locationCity || 'Hyderabad',
        targetDate: targetDate || null,
        targetTimeSlot: targetTimeSlot || null,
        budgetType: budgetType || 'FREE',
        budgetAmount: budgetAmount || null,
        capacityNeeded: capacityNeeded ? parseInt(capacityNeeded, 10) : null,
        requirements: JSON.stringify(requirements || []),
        category: category || 'General',
        status: 'PUBLISHED',
      },
      include: { user: { include: { profile: true } } },
    });

    // Auto-trigger matching engine
    const matches = await computeMatchesForRequest(newRequest.id);

    await logAuditAction({
      actorId: user.id,
      action: 'REQUEST_CREATED',
      entityType: 'Request',
      entityId: newRequest.id,
      details: { title, requestType, matchCount: matches.length },
    });

    return NextResponse.json({
      request: newRequest,
      matches,
      message: `Request published! Found ${matches.length} matching candidates.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
