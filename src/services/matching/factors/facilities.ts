import { CandidateContext, RequestContext, FactorScore } from '../types';

export function evaluateFacilities(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  const reqFacilities = req.requirements || [];
  const candFacilities = candidate.facilities || [];

  if (reqFacilities.length === 0) {
    return {
      name: 'facilities',
      score: 1.0,
      weight,
      weightedPoints: weight,
      explanation: `Full facility compatibility +${weight}`,
    };
  }

  const matches = reqFacilities.filter((reqFac) =>
    candFacilities.some((candFac) => candFac.toLowerCase().includes(reqFac.toLowerCase()) || reqFac.toLowerCase().includes(candFac.toLowerCase()))
  );

  const score = Math.max(0.4, matches.length / reqFacilities.length);
  const matchedCount = matches.length;

  return {
    name: 'facilities',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation: `Matches ${matchedCount}/${reqFacilities.length} requested facilities (${candFacilities.slice(0, 3).join(', ')}) +${Math.round(score * weight)}`,
  };
}
