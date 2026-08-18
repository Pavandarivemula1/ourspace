import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const city = searchParams.get('city');

    if (!q.trim()) {
      return NextResponse.json({
        people: [],
        venues: [],
        events: [],
        requests: [],
        offers: [],
        communities: [],
      });
    }

    const query = q.trim();

    const [people, venues, events, requests, offers, communities] = await Promise.all([
      prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: query } },
            { profile: { headline: { contains: query } } },
            { profile: { bio: { contains: query } } },
            { profile: { building: { contains: query } } },
            { profile: { skills: { contains: query } } },
          ],
        },
        include: { profile: true },
        take: 8,
      }),
      prisma.venue.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { facilities: { contains: query } },
            { neighborhood: { contains: query } },
          ],
        },
        include: { owner: { include: { profile: true } } },
        take: 8,
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
          ],
        },
        include: { organizer: true, venue: true },
        take: 8,
      }),
      prisma.request.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { requirements: { contains: query } },
            { category: { contains: query } },
          ],
        },
        include: { user: { include: { profile: true } } },
        take: 8,
      }),
      prisma.offer.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { requirements: { contains: query } },
          ],
        },
        include: { user: { include: { profile: true } } },
        take: 8,
      }),
      prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { categories: { contains: query } },
          ],
        },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      people,
      venues,
      events,
      requests,
      offers,
      communities,
      totalCount: people.length + venues.length + events.length + requests.length + offers.length + communities.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
