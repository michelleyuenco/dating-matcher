import { useState } from 'react';
import { Member } from '../../domain/entities';
import MemberForm from '../components/MemberForm';

interface Props {
  members: Member[];
  loading: boolean;
  onAdd: (member: Omit<Member, 'id'>) => void;
  onRemove: (id: string) => void;
}

export default function MembersPage({ members, loading, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');
  const [search, setSearch] = useState('');

  const filtered = members
    .filter(m => filter === 'all' || m.gender === filter)
    .filter(m =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.occupation.toLowerCase().includes(search.toLowerCase()) ||
      m.interests.some(i => i.toLowerCase().includes(search.toLowerCase()))
    );

  if (loading) return <div className="page"><p>Loading members...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Members 成員 ({members.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <MemberForm onSubmit={(m) => { onAdd(m); setShowForm(false); }} />
        </div>
      )}

      <div className="filter-bar">
        <button className={`btn btn-sm ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`btn btn-sm ${filter === 'male' ? 'active' : ''}`} onClick={() => setFilter('male')}>Male 男</button>
        <button className={`btn btn-sm ${filter === 'female' ? 'active' : ''}`} onClick={() => setFilter('female')}>Female 女</button>
        <input
          className="search-input"
          placeholder="Search 搜尋..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="member-list">
        {filtered.length === 0 ? (
          <p className="empty">No members found.</p>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="member-card">
              <div className="member-card-header">
                <div className={`person-avatar ${m.gender}`}>{m.name.slice(0, 2)}</div>
                <div className="member-info">
                  <strong>{m.name}</strong>
                  <span>{m.age}歲 · {m.gender === 'male' ? '男' : '女'} · {m.mbti}</span>
                  <span>{m.occupation}</span>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => onRemove(m.id)}>Remove</button>
              </div>
              <div className="member-interests">
                {m.interests.map(i => (
                  <span key={i} className="tag">{i}</span>
                ))}
              </div>
              {m.bio && <p className="member-bio">{m.bio}</p>}
              {m.expectations && <p className="member-expectations">期望: {m.expectations}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
