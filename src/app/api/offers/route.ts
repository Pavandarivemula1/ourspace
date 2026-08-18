import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { logAuditAction } from '@/services/audit/logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const pricing = searchParams.get('pricing');

    const where: any = { status: 'ACTIVE' };
    if (type) where.offerType = type.toUpperCase();
    if (city) where.locationCity = { contains: city };
    if (category) where.category = category;
    if (pricing) where.pricingType = pricing.toUpperCase();

    const offers = await prisma.offer.findMany({
      where,
      include: {
        user: { include: { profile: true } },
        org: true,
        community: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      offerType,
      title,
      description,
      locationCity,
      availability,
      capacity,
      requirements,
      pricingType,
      pricingDetails,
      category,
      orgId,
      communityId,
    } = body;

    if (!offerType || !title || !description) {
      return NextResponse.json({ error: 'Offer type, title, and description are required' }, { status: 400 });
    }

    const newOffer = await prisma.offer.create({
      data: {
        userId: user.id,
        orgId: orgId || null,
        communityId: communityId || null,
        offerType: offerType.toUpperCase(),
        title,
        description,
        locationCity: locationCity || user.profile?.locationCity || 'Hyderabad',
        availability: availability || 'FLEXIBLE',
        capacity: capacity ? parseInt(capacity, 10) : null,
        requirements: JSON.stringify(requirements || []),
        pricingType: pricingType || 'FREE',
        pricingDetails: pricingDetails || null,
        category: category || 'General',
        status: 'ACTIVE',
      },
      include: { user: { include: { profile: true } } },
    });

    await logAuditAction({
      actorId: user.id,
      action: 'OFFER_CREATED',
      entityType: 'Offer',
      entityId: newOffer.id,
      details: { title, offerType },
    });

    return NextResponse.json({
      offer: newOffer,
      message: 'Offer published successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
