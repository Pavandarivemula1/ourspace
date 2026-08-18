import { prisma } from '@/lib/prisma';

export async function recalculateUserReputation(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId },
  });

  if (reviews.length === 0) return;

  const dimensionGroups: Record<string, number[]> = {
    ORGANIZER: [],
    VENUE: [],
    SPEAKER: [],
    COLLABORATOR: [],
    COMMUNITY: [],
  };

  reviews.forEach((r) => {
    if (dimensionGroups[r.dimension]) {
      dimensionGroups[r.dimension].push(r.rating);
    }
  });

  const getAvg = (ratings: number[], defaultVal: number = 5.0) => {
    if (ratings.length === 0) return defaultVal;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return Math.round((sum / ratings.length) * 100) / 100;
  };

  const collabsCount = await prisma.collaboration.count({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
      status: 'COMPLETED',
    },
  });

  await prisma.profile.updateMany({
    where: { userId },
    data: {
      organizerScore: getAvg(dimensionGroups.ORGANIZER, 5.0),
      venueScore: getAvg(dimensionGroups.VENUE, 5.0),
      speakerScore: getAvg(dimensionGroups.SPEAKER, 5.0),
      collaboratorScore: getAvg(dimensionGroups.COLLABORATOR, 5.0),
      communityScore: getAvg(dimensionGroups.COMMUNITY, 5.0),
      reviewCount: reviews.length,
      collaborationsCount: collabsCount,
    },
  });
}

export async function recalculateVenueReputation(venueId: string) {
  const reviews = await prisma.review.findMany({
    where: { outcome: { event: { venueId } } },
  });

  if (reviews.length === 0) return;

  const sum = reviews.reduce((a, b) => a + b.rating, 0);
  const avg = Math.round((sum / reviews.length) * 100) / 100;

  await prisma.venue.update({
    where: { id: venueId },
    data: {
      rating: avg,
      reviewCount: reviews.length,
    },
  });
}
