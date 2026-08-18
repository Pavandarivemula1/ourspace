import { CandidateContext, RequestContext, FactorScore } from '../types';

export function evaluateExpertise(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  const reqSkills = req.requirements || [];
  const candSkills = candidate.skills || [];

  if (reqSkills.length === 0) {
    return {
      name: 'expertise',
      score: 0.9,
      weight,
      weightedPoints: Math.round(0.9 * weight),
      explanation: `Relevant domain background +${Math.round(0.9 * weight)}`,
    };
  }

  const matches = reqSkills.filter((reqSkill) =>
    candSkills.some((candSkill) => candSkill.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(candSkill.toLowerCase()))
  );

  const score = Math.min(1.0, Math.max(0.5, matches.length / reqSkills.length));

  return {
    name: 'expertise',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation: `Strong expertise overlap in ${candSkills.slice(0, 3).join(', ')} +${Math.round(score * weight)}`,
  };
}

export function evaluateCategory(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  const reqCat = (req.category || 'General').toLowerCase();
  const candCat = (candidate.category || candidate.industry || 'General').toLowerCase();

  let score = 0.6;
  if (reqCat === candCat || candCat.includes(reqCat) || reqCat.includes(candCat)) {
    score = 1.0;
  }

  return {
    name: 'category',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation: `Category alignment (${candidate.category || candidate.industry || 'Tech'}) +${Math.round(score * weight)}`,
  };
}

export function evaluateReputation(req: RequestContext, candidate: CandidateContext, weight: number): FactorScore {
  const repScore = candidate.reputationScore || 4.8;
  const isVerified = candidate.isVerified ?? true;

  const normalized = Math.min(1.0, repScore / 5.0);
  const bonus = isVerified ? 0.05 : 0;
  const score = Math.min(1.0, normalized + bonus);

  return {
    name: 'reputation',
    score,
    weight,
    weightedPoints: Math.round(score * weight),
    explanation: `${isVerified ? 'Ecosystem verified' : 'Active'} provider with ${repScore.toFixed(1)}/5.0 rating +${Math.round(score * weight)}`,
  };
}
