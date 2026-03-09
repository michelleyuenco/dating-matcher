import { useState } from 'react';
import { Category, CategoryType } from '../../domain/entities';

interface Props {
  categories: Category[];
  loading: boolean;
  onAdd: (name: string, type: CategoryType, values?: string[]) => void;
  onRemove: (id: string) => void;
}

export default function CategoriesPage({ categories, loading, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('interest');
  const [values, setValues] = useState('');
  const [filterType, setFilterType] = useState<CategoryType | 'all'>('all');

  const filtered = filterType === 'all' ? categories : categories.filter(c => c.type === filterType);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), type, values.split(/[,，、]+/).map(v => v.trim()).filter(Boolean));
    setName(''); setValues(''); setShowForm(false);
  };

  if (loading) return <div className="page"><p>Loading categories...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Categories 分類 ({categories.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Category'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label>Category Name 分類名稱</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 桌遊 Board Games" />
            </div>
            <div className="form-group">
              <label>Type 類型</label>
              <select value={type} onChange={e => setType(e.target.value as CategoryType)}>
                <option value="interest">Interest 興趣</option>
                <option value="occupation">Occupation 職業</option>
                <option value="custom">Custom 自訂</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Values 數值 (comma separated)</label>
            <input value={values} onChange={e => setValues(e.target.value)} placeholder="e.g. chess、monopoly、catan" />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Category</button>
        </div>
      )}

      <div className="filter-bar">
        {(['all', 'interest', 'occupation', 'mbti', 'custom'] as const).map(t => (
          <button key={t} className={`btn btn-sm ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
            {t === 'all' ? 'All' : t === 'interest' ? 'Interest 興趣' : t === 'occupation' ? 'Occupation 職業' : t === 'mbti' ? 'MBTI' : 'Custom 自訂'}
          </button>
        ))}
      </div>

      <div className="categories-grid">
        {filtered.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="category-header">
              <h3>{cat.name}</h3>
              <span className={`badge badge-${cat.type}`}>{cat.type}</span>
              {cat.type !== 'mbti' && (
                <button className="btn btn-danger btn-xs" onClick={() => onRemove(cat.id)}>×</button>
              )}
            </div>
            <div className="category-values">
              {cat.values.map(v => (
                <span key={v} className="tag">{v}</span>
              ))}
              <span className="tag tag-count">{cat.values.length} items</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
