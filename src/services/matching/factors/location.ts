import { CandidateContext, RequestContext, FactorScore } from '../types';

export function evaluateLocation(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  const reqCity = (req.locationCity || 'Hyderabad').toLowerCase().trim();
  const candCity = (candidate.locationCity || 'Hyderabad').toLowerCase().trim();

  let score = 0;
  let explanation = '';

  if (reqCity === candCity) {
    score = 1.0;
    explanation = `Same city (${candidate.locationCity}${candidate.neighborhood ? `, ${candidate.neighborhood}` : ''}) +${Math.round(weight * score)}`;
  } else {
    score = 0.3; // Remote/different city
    explanation = `Different city (${candidate.locationCity} vs ${req.locationCity}) +${Math.round(weight * score)}`;
  }

  return {
    name: 'location',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation,
  };
}
