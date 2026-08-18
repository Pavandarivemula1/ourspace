import { CandidateContext, RequestContext, FactorScore } from '../types';

export function evaluateAvailability(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  let score = 0.8; // Default flexible availability
  let explanation = `Flexible availability +${Math.round(weight * score)}`;

  if (candidate.isAvailableOnDate === true) {
    score = 1.0;
    explanation = `Available on requested date (${req.targetDate || 'target date'}) +${Math.round(weight * score)}`;
  } else if (candidate.isAvailableOnDate === false) {
    score = 0.2;
    explanation = `Busy or partial availability on ${req.targetDate} +${Math.round(weight * score)}`;
  }

  return {
    name: 'availability',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation,
  };
}
