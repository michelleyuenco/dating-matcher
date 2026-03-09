import { useState, FormEvent } from 'react';
import { Gender, MBTIType, Member } from '../../domain/entities';

const MBTI_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

interface Props {
  onSubmit: (member: Omit<Member, 'id'>) => void;
  initial?: Member;
  submitLabel?: string;
}

export default function MemberForm({ onSubmit, initial, submitLabel = 'Add Member' }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [age, setAge] = useState(initial?.age?.toString() ?? '');
  const [gender, setGender] = useState<Gender>(initial?.gender ?? 'male');
  const [mbti, setMbti] = useState<MBTIType>(initial?.mbti ?? 'INFP');
  const [occupation, setOccupation] = useState(initial?.occupation ?? '');
  const [interests, setInterests] = useState(initial?.interests?.join(', ') ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');
  const [expectations, setExpectations] = useState(initial?.expectations ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      age: parseInt(age),
      gender,
      mbti,
      occupation: occupation.trim(),
      interests: interests.split(/[,，、]+/).map(i => i.trim()).filter(Boolean),
      bio: bio.trim() || undefined,
      expectations: expectations.trim() || undefined,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });

    if (!initial) {
      setName(''); setAge(''); setOccupation('');
      setInterests(''); setBio(''); setExpectations('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <div className="form-row">
        <div className="form-group">
          <label>Name 姓名</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Age 年齡</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} min="18" max="100" required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Gender 性別</label>
          <select value={gender} onChange={e => setGender(e.target.value as Gender)}>
            <option value="male">Male 男</option>
            <option value="female">Female 女</option>
          </select>
        </div>
        <div className="form-group">
          <label>MBTI</label>
          <select value={mbti} onChange={e => setMbti(e.target.value as MBTIType)}>
            {MBTI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Occupation 職業</label>
        <input value={occupation} onChange={e => setOccupation(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Interests 興趣 (comma separated)</label>
        <input value={interests} onChange={e => setInterests(e.target.value)} required placeholder="e.g. 行山、睇戲、咖啡" />
      </div>

      <div className="form-group">
        <label>Bio 自我簡介</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} />
      </div>

      <div className="form-group">
        <label>Expectations 期望</label>
        <textarea value={expectations} onChange={e => setExpectations(e.target.value)} rows={2} />
      </div>

      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}
