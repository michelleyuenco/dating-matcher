import { Member, MBTIType, MatchResult, MatchWeights, DEFAULT_WEIGHTS } from '../entities';

// MBTI compatibility based on cognitive function theory
const MBTI_COMPAT: Record<string, number> = {
  'INFP-ENFJ': 95, 'ENFP-INFJ': 95,
  'INTP-ENTJ': 95, 'ENTP-INTJ': 95,
  'ISFP-ESFJ': 90, 'ESFP-ISFJ': 90,
  'ISTP-ESTJ': 90, 'ESTP-ISTJ': 90,
  'INFP-ENTJ': 85, 'ENFP-INTJ': 85,
  'INTP-ENFJ': 85, 'ENTP-INFJ': 85,
  'ISFP-ESTJ': 80, 'ESFP-ISTJ': 80,
  'ISTP-ESFJ': 80, 'ESTP-ISFJ': 80,
  'INFP-INFJ': 75, 'ENFP-ENFJ': 75,
  'INTP-INTJ': 75, 'ENTP-ENTJ': 75,
  'ISFP-ISFJ': 70, 'ESFP-ESFJ': 70,
  'ISTP-ISTJ': 70, 'ESTP-ESTJ': 70,
  'INFP-ENFP': 70, 'INFJ-ENFJ': 70,
  'INTP-ENTP': 70, 'INTJ-ENTJ': 70,
  'ISFP-ESFP': 65, 'ISFJ-ESFJ': 65,
  'ISTP-ESTP': 65, 'ISTJ-ESTJ': 65,
  // Cross-group decent matches
  'INFP-ISFP': 60, 'INFJ-ISFJ': 60,
  'ENFP-ESFP': 60, 'ENFJ-ESFJ': 60,
  'INTP-ISTP': 60, 'INTJ-ISTJ': 60,
  'ENTP-ESTP': 60, 'ENTJ-ESTJ': 60,
};

function getMBTIScore(a: MBTIType, b: MBTIType): number {
  if (a === b) return 60;
  return MBTI_COMPAT[`${a}-${b}`] ?? MBTI_COMPAT[`${b}-${a}`] ?? 50;
}

function getInterestScore(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 50;
  const setA = new Set(a.map(i => i.toLowerCase()));
  const setB = new Set(b.map(i => i.toLowerCase()));
  const intersection = [...setA].filter(x => setB.has(x));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 50;
  return Math.round((intersection.length / union.size) * 100);
}

function getOccupationScore(a: string, b: string): number {
  return a.toLowerCase() === b.toLowerCase() ? 70 : 50;
}

export function calculateMatch(
  m1: Member,
  m2: Member,
  weights: MatchWeights = DEFAULT_WEIGHTS
): MatchResult {
  const mbtiScore = getMBTIScore(m1.mbti, m2.mbti);
  const interestScore = getInterestScore(m1.interests, m2.interests);
  const occupationScore = getOccupationScore(m1.occupation, m2.occupation);

  const score = Math.round(
    mbtiScore * weights.mbti +
    interestScore * weights.interests +
    occupationScore * weights.occupation
  );

  return {
    member1: m1,
    member2: m2,
    score,
    breakdown: { mbtiScore, interestScore, occupationScore },
  };
}

/** Generate all male-female pairs, sorted by score desc */
export function generateAllMatches(members: Member[], weights?: MatchWeights): MatchResult[] {
  const males = members.filter(m => m.gender === 'male');
  const females = members.filter(m => m.gender === 'female');
  const results: MatchResult[] = [];

  for (const male of males) {
    for (const female of females) {
      results.push(calculateMatch(male, female, weights));
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/** Greedy 1-to-1 optimal matching */
export function generateOptimalMatches(members: Member[], weights?: MatchWeights): MatchResult[] {
  const all = generateAllMatches(members, weights);
  const matched = new Set<string>();
  const optimal: MatchResult[] = [];

  for (const match of all) {
    if (!matched.has(match.member1.id) && !matched.has(match.member2.id)) {
      optimal.push(match);
      matched.add(match.member1.id);
      matched.add(match.member2.id);
    }
  }

  return optimal;
}
