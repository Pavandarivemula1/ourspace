import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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
                  take: 5,
                },
              },
            },
          },
        },
        registrations: {
          include: { user: { include: { profile: true } } },
        },
        outcomes: {
          include: { reviews: { include: { reviewer: true } } },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const isOrganizer = currentUser?.id === event.organizerId || currentUser?.role === 'ADMIN';
    const isRegistered = currentUser ? event.registrations.some((r) => r.userId === currentUser.id) : false;

    return NextResponse.json({
      event,
      isOrganizer,
      isRegistered,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
