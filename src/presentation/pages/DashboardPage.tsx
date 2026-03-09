interface Props {
  stats: { total: number; males: number; females: number };
  categoryCount: number;
}

export default function DashboardPage({ stats, categoryCount }: Props) {
  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Members 總人數</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.males}</div>
          <div className="stat-label">Males 男</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.females}</div>
          <div className="stat-label">Females 女</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{categoryCount}</div>
          <div className="stat-label">Categories 分類</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.min(stats.males, stats.females)}</div>
          <div className="stat-label">Possible Pairs 可配對數</div>
        </div>
      </div>

      <div className="info-box">
        <h3>How Matching Works 配對方式</h3>
        <ul>
          <li><strong>Primary Rule 基本規則:</strong> Matches are always one male + one female 配對一定是一男一女</li>
          <li><strong>MBTI Compatibility MBTI兼容性 (35%):</strong> Based on cognitive function theory 基於認知功能理論</li>
          <li><strong>Shared Interests 共同興趣 (50%):</strong> More overlap = higher score 越多重疊分數越高</li>
          <li><strong>Occupation 職業 (15%):</strong> Factor for occupational compatibility 職業兼容因素</li>
        </ul>
        <p>New interests and occupations are <strong>auto-categorized</strong> when members are added. 新興趣和職業會自動分類。</p>
      </div>
    </div>
  );
}
