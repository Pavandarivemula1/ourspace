import { CandidateContext, RequestContext, FactorScore } from '../types';

export function evaluateCapacity(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  const needed = req.capacityNeeded || 40;
  const venueCap = candidate.capacity || 50;

  let score = 0;
  let explanation = '';

  if (venueCap >= needed && venueCap <= needed * 3) {
    // Perfect fit
    score = 1.0;
    explanation = `Capacity compatible (${venueCap} seats fits ${needed} attendees perfectly) +${Math.round(weight * score)}`;
  } else if (venueCap > needed * 3) {
    // Much larger venue, but usable
    score = 0.8;
    explanation = `Large venue capacity (${venueCap} seats for ${needed} attendees) +${Math.round(weight * score)}`;
  } else if (venueCap >= needed * 0.8) {
    // Slightly tight fit
    score = 0.6;
    explanation = `Tight capacity fit (${venueCap} seats vs ${needed} needed) +${Math.round(weight * score)}`;
  } else {
    // Too small
    score = 0.2;
    explanation = `Capacity under required (${venueCap} seats vs ${needed} needed) +${Math.round(weight * score)}`;
  }

  return {
    name: 'capacity',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation,
  };
}
