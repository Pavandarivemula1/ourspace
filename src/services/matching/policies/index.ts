import { MatchingPolicy, MatchType } from '../types';

export const venuePolicy: MatchingPolicy = {
  type: 'VENUE',
  weights: {
    location: 30,
    availability: 25,
    capacity: 20,
    facilities: 15,
    category: 5,
    reputation: 5,
  },
  minThreshold: 50,
};

export const speakerPolicy: MatchingPolicy = {
  type: 'SPEAKER',
  weights: {
    expertise: 35,
    availability: 20,
    location: 15,
    experience: 15,
    category: 10,
    reputation: 5,
  },
  minThreshold: 50,
};

export const partnershipPolicy: MatchingPolicy = {
  type: 'PARTNER',
  weights: {
    industry: 25,
    expertise: 25,
    stage: 15,
    category: 15,
    location: 10,
    reputation: 10,
  },
  minThreshold: 45,
};

export const mentorPolicy: MatchingPolicy = {
  type: 'MENTOR',
  weights: {
    expertise: 35,
    experience: 20,
    availability: 15,
    location: 15,
    category: 10,
    reputation: 5,
  },
  minThreshold: 50,
};

export const resourcePolicy: MatchingPolicy = {
  type: 'RESOURCE',
  weights: {
    category: 30,
    location: 25,
    facilities: 20,
    availability: 15,
    reputation: 10,
  },
  minThreshold: 40,
};

export function getPolicyForType(type: string): MatchingPolicy {
  switch (type.toUpperCase()) {
    case 'VENUE':
      return venuePolicy;
    case 'SPEAKER':
      return speakerPolicy;
    case 'PARTNER':
    case 'FOUNDER':
      return partnershipPolicy;
    case 'MENTOR':
      return mentorPolicy;
    case 'RESOURCE':
    case 'SPONSOR':
    case 'DEVELOPER':
    case 'DESIGNER':
    default:
      return resourcePolicy;
  }
}
