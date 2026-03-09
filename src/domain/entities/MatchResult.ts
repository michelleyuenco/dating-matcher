import { Member } from './Member';

export interface MatchBreakdown {
  mbtiScore: number;
  interestScore: number;
  occupationScore: number;
}

export interface MatchResult {
  member1: Member;
  member2: Member;
  score: number;
  breakdown: MatchBreakdown;
}

export interface MatchWeights {
  mbti: number;
  interests: number;
  occupation: number;
}

export const DEFAULT_WEIGHTS: MatchWeights = {
  mbti: 0.35,
  interests: 0.50,
  occupation: 0.15,
};
