import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ userAId: user.id }, { userBId: user.id }],
        status: 'ACTIVE',
      },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
        collaborations: {
          include: { outcomes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = connections.map((c) => {
      const partner = c.userAId === user.id ? c.userB : c.userA;
      return {
        id: c.id,
        relationshipType: c.relationshipType,
        source: c.source,
        connectedSince: c.createdAt,
        partner,
        collaborations: c.collaborations,
      };
    });

    return NextResponse.json({ connections: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
