import { MatchResult, MatchWeights } from '../../domain/entities';
import MatchCard from '../components/MatchCard';

interface Props {
  matches: MatchResult[];
  weights: MatchWeights;
  setWeights: (w: MatchWeights) => void;
  mode: 'optimal' | 'all';
  setMode: (m: 'optimal' | 'all') => void;
}

export default function MatchesPage({ matches, weights, setWeights, mode, setMode }: Props) {
  const setWeight = (key: keyof MatchWeights, pct: number) => {
    setWeights({ ...weights, [key]: pct / 100 });
  };

  const totalPct = Math.round((weights.mbti + weights.interests + weights.occupation) * 100);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Matches 配對結果</h2>
        <div className="filter-bar">
          <button className={`btn btn-sm ${mode === 'optimal' ? 'active' : ''}`} onClick={() => setMode('optimal')}>
            Optimal 1:1 最佳配對
          </button>
          <button className={`btn btn-sm ${mode === 'all' ? 'active' : ''}`} onClick={() => setMode('all')}>
            All Pairs 所有組合
          </button>
        </div>
      </div>

      <div className="card weights-panel">
        <h3>Matching Weights 配對權重</h3>
        <div className="weight-slider">
          <label>MBTI: {Math.round(weights.mbti * 100)}%</label>
          <input type="range" min="0" max="100" value={Math.round(weights.mbti * 100)} onChange={e => setWeight('mbti', +e.target.value)} />
        </div>
        <div className="weight-slider">
          <label>Interests 興趣: {Math.round(weights.interests * 100)}%</label>
          <input type="range" min="0" max="100" value={Math.round(weights.interests * 100)} onChange={e => setWeight('interests', +e.target.value)} />
        </div>
        <div className="weight-slider">
          <label>Occupation 職業: {Math.round(weights.occupation * 100)}%</label>
          <input type="range" min="0" max="100" value={Math.round(weights.occupation * 100)} onChange={e => setWeight('occupation', +e.target.value)} />
        </div>
        <p className="weight-total">
          Total: {totalPct}% {totalPct !== 100 && '(should equal 100%)'}
        </p>
      </div>

      <div className="matches-list">
        {matches.length === 0 ? (
          <p className="empty">No matches found. Make sure you have both male and female members.</p>
        ) : (
          matches.map((match, i) => (
            <MatchCard key={`${match.member1.id}-${match.member2.id}`} match={match} rank={i + 1} />
          ))
        )}
      </div>
    </div>
  );
}
