import { prisma } from '@/lib/prisma';
import { getPolicyForType } from './policies';
import { evaluateMatch } from './scoring';
import { CandidateContext, RequestContext } from './types';

export async function computeMatchesForRequest(requestId: string) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: { include: { profile: true } } },
  });

  if (!request) return [];

  let requirements: string[] = [];
  try {
    requirements = JSON.parse(request.requirements || '[]');
  } catch {
    requirements = [];
  }

  const reqContext: RequestContext = {
    id: request.id,
    type: request.requestType as any,
    title: request.title,
    locationCity: request.locationCity,
    targetDate: request.targetDate || undefined,
    targetTimeSlot: request.targetTimeSlot || undefined,
    capacityNeeded: request.capacityNeeded || undefined,
    requirements,
    category: request.category,
    budgetType: request.budgetType || undefined,
  };

  const policy = getPolicyForType(request.requestType);
  const results = [];

  // Match Venues
  if (request.requestType === 'VENUE') {
    const venues = await prisma.venue.findMany({
      where: { ownerId: { not: request.userId } },
      include: { owner: { include: { profile: true } } },
    });

    for (const v of venues) {
      let facilities: string[] = [];
      try {
        facilities = JSON.parse(v.facilities || '[]');
      } catch {
        facilities = [];
      }

      const candContext: CandidateContext = {
        id: v.id,
        name: v.name,
        locationCity: v.locationCity,
        neighborhood: v.neighborhood,
        capacity: v.capacity,
        facilities,
        reputationScore: v.rating,
        isVerified: v.isVerified,
        pricingType: v.pricingType,
        isAvailableOnDate: true,
      };

      const evalResult = evaluateMatch(reqContext, candContext, policy);
      if (evalResult.totalScore >= policy.minThreshold) {
        // Save or update match
        const existing = await prisma.match.findFirst({
          where: { requestId: request.id, matchedVenueId: v.id },
        });

        const matchRecord = existing
          ? await prisma.match.update({
              where: { id: existing.id },
              data: {
                totalScore: evalResult.totalScore,
                factors: JSON.stringify(evalResult.factors),
                explanation: JSON.stringify(evalResult.explanations),
              },
            })
          : await prisma.match.create({
              data: {
                requestId: request.id,
                matchedVenueId: v.id,
                matchedUserId: v.ownerId,
                matchType: 'VENUE',
                totalScore: evalResult.totalScore,
                factors: JSON.stringify(evalResult.factors),
                explanation: JSON.stringify(evalResult.explanations),
                status: 'SUGGESTED',
              },
            });

        results.push({
          match: matchRecord,
          venue: v,
          score: evalResult.totalScore,
          factors: evalResult.factors,
          explanations: evalResult.explanations,
        });
      }
    }
  } else {
    // Match Users & Offers
    const users = await prisma.user.findMany({
      where: { id: { not: request.userId }, status: 'ACTIVE' },
      include: { profile: true, offers: true },
    });

    for (const u of users) {
      let skills: string[] = [];
      let canOffer: string[] = [];
      try {
        skills = JSON.parse(u.profile?.skills || '[]');
        canOffer = JSON.parse(u.profile?.canOffer || '[]');
      } catch {}

      const candContext: CandidateContext = {
        id: u.id,
        name: u.name,
        locationCity: u.profile?.locationCity || 'Hyderabad',
        skills: [...skills, ...canOffer],
        experienceYears: u.profile?.experienceYears || 3,
        reputationScore: u.profile?.speakerScore || u.profile?.collaboratorScore || 4.8,
        isVerified: u.profile?.verificationLevel !== 'UNVERIFIED',
        isAvailableOnDate: true,
      };

      const evalResult = evaluateMatch(reqContext, candContext, policy);
      if (evalResult.totalScore >= policy.minThreshold) {
        const matchingOffer = u.offers.find((o) => o.status === 'ACTIVE');

        const existing = await prisma.match.findFirst({
          where: { requestId: request.id, matchedUserId: u.id },
        });

        const matchRecord = existing
          ? await prisma.match.update({
              where: { id: existing.id },
              data: {
                totalScore: evalResult.totalScore,
                factors: JSON.stringify(evalResult.factors),
                explanation: JSON.stringify(evalResult.explanations),
                offerId: matchingOffer?.id || null,
              },
            })
          : await prisma.match.create({
              data: {
                requestId: request.id,
                matchedUserId: u.id,
                offerId: matchingOffer?.id || null,
                matchType: request.requestType,
                totalScore: evalResult.totalScore,
                factors: JSON.stringify(evalResult.factors),
                explanation: JSON.stringify(evalResult.explanations),
                status: 'SUGGESTED',
              },
            });

        results.push({
          match: matchRecord,
          user: u,
          score: evalResult.totalScore,
          factors: evalResult.factors,
          explanations: evalResult.explanations,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
