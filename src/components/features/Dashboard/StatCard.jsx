/**
 * A single KPI tile for the dashboard.
 * @param {{ label: string, value: string, tone?: 'income'|'expense'|'neutral', hint?: string }} props
 */
export function StatCard({ label, value, tone = 'neutral', hint }) {
  return (
    <div className="card stat-card">
      <span className="stat-card__label">{label}</span>
      <strong className={`stat-card__value stat-card__value--${tone}`}>
        {value}
      </strong>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </div>
  );
}
