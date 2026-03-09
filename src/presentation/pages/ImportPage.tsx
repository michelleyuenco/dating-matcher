import { useState } from 'react';
import { Member, MBTIType } from '../../domain/entities';
import { seedMembers } from '../../data/seedMembers';
import { seedCategories } from '../../data/seedCategories';
import { Category } from '../../domain/entities';

interface Props {
  onImport: (members: Omit<Member, 'id'>[]) => Promise<Member[] | null>;
  onClear: () => void;
  onSyncCategories: (cats: Category[]) => Promise<void>;
  currentCount: number;
}

const VALID_MBTI: MBTIType[] = [
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
];

export default function ImportPage({ onImport, onClear, onSyncCategories, currentCount }: Props) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importing, setImporting] = useState(false);

  const handleSeedImport = async () => {
    setImporting(true);
    setError('');
    setSuccess('');
    try {
      // Seed categories first
      const catsWithIds = seedCategories.map((c, i) => ({ ...c, id: `seed-cat-${i}` }));
      await onSyncCategories(catsWithIds);
      // Then import members
      const result = await onImport(seedMembers);
      if (result && result.length > 0) {
        setSuccess(`Successfully imported ${result.length} members and ${catsWithIds.length} categories from Excel data!`);
      }
    } catch {
      setError('Failed to import seed data');
    } finally {
      setImporting(false);
    }
  };

  const handleJsonImport = async () => {
    setError('');
    setSuccess('');
    setImporting(true);

    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) { setError('Data must be a JSON array'); return; }

      const errors: string[] = [];
      const valid: Omit<Member, 'id'>[] = [];

      data.forEach((item: Record<string, unknown>, i: number) => {
        if (!item.name || !item.gender || !item.mbti || !item.occupation || !item.interests) {
          errors.push(`Row ${i + 1}: missing required fields`);
          return;
        }
        if (item.gender !== 'male' && item.gender !== 'female' && item.gender !== '男' && item.gender !== '女') {
          errors.push(`Row ${i + 1}: gender must be male/female/男/女`);
          return;
        }
        const gender = (item.gender === '男' || item.gender === 'male') ? 'male' as const : 'female' as const;
        const mbtiRaw = (item.mbti as string).toUpperCase();
        const mbtiVal = VALID_MBTI.includes(mbtiRaw as MBTIType) ? mbtiRaw as MBTIType : 'INFP' as MBTIType;

        valid.push({
          name: item.name as string,
          age: (item.age as number) || 25,
          gender,
          mbti: mbtiVal,
          occupation: item.occupation as string,
          interests: Array.isArray(item.interests)
            ? (item.interests as string[])
            : (item.interests as string).split(/[,，、]+/).map((s: string) => s.trim()).filter(Boolean),
          bio: item.bio as string | undefined,
          expectations: item.expectations as string | undefined,
          createdAt: new Date().toISOString(),
        });
      });

      if (errors.length > 0) setError(errors.join('\n'));
      if (valid.length > 0) {
        const result = await onImport(valid);
        if (result) {
          setSuccess(`Successfully imported ${result.length} members!`);
          setJsonInput('');
        }
      }
    } catch {
      setError('Invalid JSON format');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page">
      <h2>Import Members 匯入成員</h2>

      <div className="card">
        <h3>Quick Import: Excel Data 快速匯入Excel數據</h3>
        <p>Import all 54 members from the collected Excel spreadsheet with pre-configured categories.</p>
        <button className="btn btn-primary" onClick={handleSeedImport} disabled={importing}>
          {importing ? 'Importing...' : 'Import Excel Data (54 members)'}
        </button>
      </div>

      <div className="card">
        <h3>JSON Import 自訂匯入</h3>
        <p>Paste a JSON array. Supports both English and Chinese field values (gender: male/female/男/女).</p>
        <div className="form-group">
          <textarea
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            rows={12}
            placeholder='[{"name": "Jason", "age": 28, "gender": "male", "mbti": "ENFP", "occupation": "工程師", "interests": ["行山", "咖啡"], "bio": "..."}]'
            className="mono"
          />
        </div>
        <button className="btn btn-primary" onClick={handleJsonImport} disabled={!jsonInput.trim() || importing}>
          Import JSON
        </button>
      </div>

      {error && <div className="alert alert-error"><pre>{error}</pre></div>}
      {success && <div className="alert alert-success">{success}</div>}

      {currentCount > 0 && (
        <div className="card">
          <p>Current members: {currentCount}</p>
          <button className="btn btn-danger" onClick={onClear}>
            Clear All Members 清除所有成員
          </button>
        </div>
      )}
    </div>
  );
}
