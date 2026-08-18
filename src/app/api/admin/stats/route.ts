import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalOrgs,
      totalCommunities,
      totalVenues,
      totalEvents,
      totalRequests,
      totalOffers,
      totalMatches,
      totalConnections,
      totalCollaborations,
      totalOutcomes,
      totalReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.community.count(),
      prisma.venue.count(),
      prisma.event.count(),
      prisma.request.count(),
      prisma.offer.count(),
      prisma.match.count(),
      prisma.connection.count(),
      prisma.collaboration.count(),
      prisma.outcome.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ]);

    const activeUsers = await prisma.user.count({ where: { status: 'ACTIVE' } });
    const verifiedVenues = await prisma.venue.count({ where: { isVerified: true } });
    const completedCollabs = await prisma.collaboration.count({ where: { status: 'COMPLETED' } });

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeUsers,
        totalOrgs,
        totalCommunities,
        totalVenues,
        verifiedVenues,
        totalEvents,
        totalRequests,
        totalOffers,
        totalMatches,
        totalConnections,
        totalCollaborations,
        completedCollabs,
        totalOutcomes,
        pendingReports: totalReports,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
