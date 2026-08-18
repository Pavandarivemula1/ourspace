import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { email: id }],
      },
      include: {
        profile: true,
        orgMemberships: { include: { org: true } },
        commMemberships: { include: { community: true } },
        venues: true,
        requests: { where: { status: 'PUBLISHED' }, take: 5 },
        offers: { where: { status: 'ACTIVE' }, take: 5 },
        eventsOrganized: { take: 5, orderBy: { createdAt: 'desc' } },
        reviewsReceived: {
          include: { reviewer: { include: { profile: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    // Check if connected
    let isConnected = false;
    let hasPendingIntro = false;

    if (currentUser && currentUser.id !== user.id) {
      const conn = await prisma.connection.findFirst({
        where: {
          OR: [
            { userAId: currentUser.id, userBId: user.id },
            { userAId: user.id, userBId: currentUser.id },
          ],
          status: 'ACTIVE',
        },
      });
      isConnected = Boolean(conn);

      const intro = await prisma.introductionRequest.findFirst({
        where: {
          requesterId: currentUser.id,
          recipientId: user.id,
          status: 'PENDING',
        },
      });
      hasPendingIntro = Boolean(intro);
    }

    return NextResponse.json({
      user,
      isConnected,
      hasPendingIntro,
      isOwnProfile: currentUser?.id === user.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth();
    const { id } = await params;
    if (authUser.id !== id && authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to edit this profile' }, { status: 403 });
    }

    const body = await req.json();
    const { headline, bio, building, lookingFor, canOffer, skills, experienceYears, websiteUrl, linkedinUrl, twitterUrl, githubUrl } = body;

    const updated = await prisma.profile.upsert({
      where: { userId: id },
      update: {
        headline,
        bio,
        building,
        lookingFor: JSON.stringify(lookingFor || []),
        canOffer: JSON.stringify(canOffer || []),
        skills: JSON.stringify(skills || []),
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : 0,
        websiteUrl,
        linkedinUrl,
        twitterUrl,
        githubUrl,
      },
      create: {
        userId: id,
        headline,
        bio,
        building,
        lookingFor: JSON.stringify(lookingFor || []),
        canOffer: JSON.stringify(canOffer || []),
        skills: JSON.stringify(skills || []),
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
