import { useMemo, useState } from 'react';
import { Member, MatchResult, MatchWeights, DEFAULT_WEIGHTS } from '../../domain/entities';
import { generateAllMatches, generateOptimalMatches } from '../../domain/usecases';

export function useMatches(members: Member[]) {
  const [weights, setWeights] = useState<MatchWeights>(DEFAULT_WEIGHTS);
  const [mode, setMode] = useState<'optimal' | 'all'>('optimal');

  const allMatches = useMemo(
    () => generateAllMatches(members, weights),
    [members, weights]
  );

  const optimalMatches = useMemo(
    () => generateOptimalMatches(members, weights),
    [members, weights]
  );

  const matches: MatchResult[] = mode === 'optimal' ? optimalMatches : allMatches;

  return { matches, allMatches, optimalMatches, weights, setWeights, mode, setMode };
}
