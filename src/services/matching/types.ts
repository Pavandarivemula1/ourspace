export type MatchType = 'VENUE' | 'SPEAKER' | 'SPONSOR' | 'MENTOR' | 'PARTNER' | 'RESOURCE';

export interface FactorWeights {
  location?: number;
  availability?: number;
  capacity?: number;
  facilities?: number;
  expertise?: number;
  industry?: number;
  stage?: number;
  experience?: number;
  reputation?: number;
  category?: number;
}

export interface MatchingPolicy {
  type: MatchType;
  weights: FactorWeights;
  minThreshold: number; // Minimum total score to be considered a match (e.g. 50)
}

export interface CandidateContext {
  id: string;
  name: string;
  locationCity: string;
  neighborhood?: string;
  capacity?: number;
  facilities?: string[];
  skills?: string[];
  industry?: string;
  stage?: string;
  experienceYears?: number;
  reputationScore?: number;
  category?: string;
  isAvailableOnDate?: boolean;
  isVerified?: boolean;
  pricingType?: string;
}

export interface RequestContext {
  id: string;
  type: MatchType;
  title: string;
  locationCity: string;
  targetDate?: string;
  targetTimeSlot?: string;
  capacityNeeded?: number;
  requirements?: string[];
  category?: string;
  budgetType?: string;
}

export interface FactorScore {
  name: string;
  score: number; // 0-1 normalized
  weight: number; // Percentage contribution (e.g., 30 for 30%)
  weightedPoints: number; // (score * weight)
  explanation: string;
}

export interface MatchEvaluationResult {
  totalScore: number; // 0-100 integer
  factors: Record<string, number>;
  explanations: string[];
  candidateId: string;
  matchType: MatchType;
}
