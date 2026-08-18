import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        members: { include: { user: { include: { profile: true } } } },
        events: { take: 3, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { memberCount: 'desc' },
    });

    return NextResponse.json({ communities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { name, description, locationCity, categories, logoUrl, bannerUrl } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        locationCity: locationCity || 'Hyderabad',
        categories: JSON.stringify(categories || ['Tech', 'AI']),
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
        memberCount: 1,
        isVerified: user.role === 'ADMIN',
        members: {
          create: {
            userId: user.id,
            role: 'ORGANIZER',
          },
        },
      },
    });

    return NextResponse.json({ community, message: 'Community created successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
