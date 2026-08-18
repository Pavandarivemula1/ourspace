import { CandidateContext, RequestContext, MatchingPolicy, MatchEvaluationResult, FactorScore } from './types';
import { evaluateLocation } from './factors/location';
import { evaluateAvailability } from './factors/availability';
import { evaluateCapacity } from './factors/capacity';
import { evaluateFacilities } from './factors/facilities';
import { evaluateExpertise, evaluateCategory, evaluateReputation } from './factors/expertise';

export function evaluateMatch(
  req: RequestContext,
  candidate: CandidateContext,
  policy: MatchingPolicy
): MatchEvaluationResult {
  const scores: FactorScore[] = [];
  const factors: Record<string, number> = {};
  const explanations: string[] = [];

  const weights = policy.weights;

  if (weights.location) {
    const s = evaluateLocation(req, candidate, weights.location);
    scores.push(s);
    factors.location = s.weightedPoints;
    explanations.push(s.explanation);
  }

  if (weights.availability) {
    const s = evaluateAvailability(req, candidate, weights.availability);
    scores.push(s);
    factors.availability = s.weightedPoints;
    explanations.push(s.explanation);
  }

  if (weights.capacity) {
    const s = evaluateCapacity(req, candidate, weights.capacity);
    scores.push(s);
    factors.capacity = s.weightedPoints;
    explanations.push(s.explanation);
  }

  if (weights.facilities) {
    const s = evaluateFacilities(req, candidate, weights.facilities);
    scores.push(s);
    factors.facilities = s.weightedPoints;
    explanations.push(s.explanation);
  }

  if (weights.expertise) {
    const s = evaluateExpertise(req, candidate, weights.expertise);
    scores.push(s);
    factors.expertise = s.weightedPoints;
    explanations.push(s.explanation);
  }

  if (weights.category || weights.industry) {
    const w = (weights.category || 0) + (weights.industry || 0);
    const s = evaluateCategory(req, candidate, w);
    scores.push(s);
    factors.category = s.weightedPoints;
    explanations.push(s.explanation);
  }

  if (weights.reputation) {
    const s = evaluateReputation(req, candidate, weights.reputation);
    scores.push(s);
    factors.reputation = s.weightedPoints;
    explanations.push(s.explanation);
  }

  const rawSum = scores.reduce((sum, item) => sum + item.weightedPoints, 0);
  const totalScore = Math.min(99, Math.max(10, Math.round(rawSum)));

  return {
    totalScore,
    factors,
    explanations,
    candidateId: candidate.id,
    matchType: policy.type,
  };
}
