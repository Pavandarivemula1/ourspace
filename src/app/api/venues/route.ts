import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAuth } from '@/lib/auth';
import { logAuditAction } from '@/services/audit/logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const minCapacity = searchParams.get('capacity');
    const pricing = searchParams.get('pricing');
    const ownerId = searchParams.get('ownerId');

    const where: any = {};
    if (city) where.locationCity = { contains: city };
    if (pricing) where.pricingType = pricing.toUpperCase();
    if (ownerId) where.ownerId = ownerId;
    if (minCapacity) where.capacity = { gte: parseInt(minCapacity, 10) };

    const venues = await prisma.venue.findMany({
      where,
      include: {
        owner: { include: { profile: true } },
        org: true,
        bookingRequests: {
          where: { status: 'APPROVED' },
          select: { targetDate: true },
        },
      },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json({ venues });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      name,
      description,
      locationCity,
      neighborhood,
      addressSecret,
      capacity,
      pricingType,
      priceDetails,
      facilities,
      eventTypes,
      operatingHours,
      rules,
      photos,
      orgId,
    } = body;

    if (!name || !description || !addressSecret || !capacity) {
      return NextResponse.json({ error: 'Name, description, address, and capacity are required' }, { status: 400 });
    }

    const venue = await prisma.venue.create({
      data: {
        ownerId: user.id,
        orgId: orgId || null,
        name,
        description,
        locationCity: locationCity || 'Hyderabad',
        neighborhood: neighborhood || 'Hitec City',
        addressSecret,
        capacity: parseInt(capacity, 10),
        pricingType: pricingType || 'FREE',
        priceDetails: priceDetails || null,
        facilities: JSON.stringify(facilities || ['High-speed Wi-Fi', 'AC']),
        eventTypes: JSON.stringify(eventTypes || ['Meetups', 'Workshops']),
        operatingHours: operatingHours || '09:00 - 21:00',
        rules: JSON.stringify(rules || { cleanup: 'Leave space tidy', cancellation: '24hr notice' }),
        photos: JSON.stringify(photos || ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800']),
        isVerified: user.role === 'ADMIN',
        rating: 5.0,
      },
    });

    await logAuditAction({
      actorId: user.id,
      action: 'VENUE_CREATED',
      entityType: 'Venue',
      entityId: venue.id,
      details: { name, capacity },
    });

    return NextResponse.json({ venue, message: 'Venue created successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
