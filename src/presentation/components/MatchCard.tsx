import { MatchResult } from '../../domain/entities';

interface Props {
  match: MatchResult;
  rank?: number;
}

export default function MatchCard({ match, rank }: Props) {
  const { member1, member2, score, breakdown } = match;
  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="match-card">
      {rank && <div className="match-rank">#{rank}</div>}
      <div className="match-pair">
        <div className="match-person">
          <div className="person-avatar male">{member1.name.slice(0, 2)}</div>
          <strong>{member1.name}</strong>
          <span className="person-meta">{member1.age} · {member1.mbti}</span>
          <span className="person-meta">{member1.occupation}</span>
        </div>
        <div className="match-score" style={{ borderColor: scoreColor, color: scoreColor }}>
          {score}%
        </div>
        <div className="match-person">
          <div className="person-avatar female">{member2.name.slice(0, 2)}</div>
          <strong>{member2.name}</strong>
          <span className="person-meta">{member2.age} · {member2.mbti}</span>
          <span className="person-meta">{member2.occupation}</span>
        </div>
      </div>
      <div className="match-breakdown">
        <div className="breakdown-item">
          <span>MBTI</span>
          <div className="bar"><div className="bar-fill" style={{ width: `${breakdown.mbtiScore}%` }} /></div>
          <span>{breakdown.mbtiScore}%</span>
        </div>
        <div className="breakdown-item">
          <span>Interests</span>
          <div className="bar"><div className="bar-fill" style={{ width: `${breakdown.interestScore}%` }} /></div>
          <span>{breakdown.interestScore}%</span>
        </div>
        <div className="breakdown-item">
          <span>Occupation</span>
          <div className="bar"><div className="bar-fill" style={{ width: `${breakdown.occupationScore}%` }} /></div>
          <span>{breakdown.occupationScore}%</span>
        </div>
      </div>
    </div>
  );
}
