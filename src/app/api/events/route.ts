import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { recalculateEventStatus } from '@/services/events/workflow';
import { logAuditAction } from '@/services/audit/logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const status = searchParams.get('status');
    const organizerId = searchParams.get('organizerId');

    const where: any = {};
    if (category) where.category = category;
    if (city) where.locationCity = { contains: city };
    if (status) where.status = status;
    if (organizerId) where.organizerId = organizerId;

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: { include: { profile: true } },
        venue: true,
        community: true,
        org: true,
        requirements: {
          include: {
            linkedRequest: {
              include: {
                matches: {
                  orderBy: { totalScore: 'desc' },
                  take: 3,
                },
              },
            },
          },
        },
        registrations: {
          include: { user: { include: { profile: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      locationCity,
      capacity,
      requirements, // Array of { requirementType, title, description, required }
      communityId,
      orgId,
      coverImage,
    } = body;

    if (!title || !description || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Title, description, date, and timings are required' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        category: category || 'AI',
        organizerId: user.id,
        communityId: communityId || null,
        orgId: orgId || null,
        date,
        startTime,
        endTime,
        locationCity: locationCity || user.profile?.locationCity || 'Hyderabad',
        capacity: capacity ? parseInt(capacity, 10) : 40,
        status: requirements && requirements.length > 0 ? 'SEEKING_RESOURCES' : 'REGISTRATION_OPEN',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
        registrations: {
          create: {
            userId: user.id,
            status: 'REGISTERED',
          },
        },
      },
    });

    // Create requirements and linked Requests so matching engine discovers matches immediately
    if (requirements && Array.isArray(requirements)) {
      for (const reqItem of requirements) {
        // Create underlying Request
        const linkedReq = await prisma.request.create({
          data: {
            userId: user.id,
            requestType: reqItem.requirementType.toUpperCase(),
            title: reqItem.title || `Need ${reqItem.requirementType} for "${title}"`,
            description: reqItem.description || `Required for event on ${date}`,
            locationCity: event.locationCity,
            targetDate: date,
            targetTimeSlot: 'EVENING',
            capacityNeeded: event.capacity,
            requirements: JSON.stringify([category || 'Tech', reqItem.requirementType]),
            category: category || 'General',
            status: 'PUBLISHED',
          },
        });

        await prisma.eventRequirement.create({
          data: {
            eventId: event.id,
            requirementType: reqItem.requirementType.toUpperCase(),
            title: reqItem.title || `Need ${reqItem.requirementType}`,
            description: reqItem.description || '',
            required: reqItem.required ?? true,
            status: 'PENDING',
            linkedRequestId: linkedReq.id,
          },
        });
      }
    }

    // Run state recalculation
    await recalculateEventStatus(event.id);

    const completeEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: {
        requirements: { include: { linkedRequest: true } },
        organizer: { include: { profile: true } },
      },
    });

    await logAuditAction({
      actorId: user.id,
      action: 'EVENT_CREATED',
      entityType: 'Event',
      entityId: event.id,
      details: { title, status: event.status, requirementCount: requirements?.length || 0 },
    });

    return NextResponse.json({
      event: completeEvent,
      message: 'Event created successfully and seeking resources.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
