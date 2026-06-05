import { ProgressBar } from '../../common/ProgressBar.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

/**
 * Savings goal progress tile.
 * @param {{ goal: {name,target,saved}, currency: string }} props
 */
export function GoalCard({ goal, currency }) {
  const { name, target, saved } = goal;
  const percent = target > 0 ? Math.round((saved / target) * 100) : 0;
  return (
    <div className="card goal-card">
      <div className="goal-card__head">
        <h3>{name}</h3>
        <span className="badge badge--neutral">{percent}%</span>
      </div>
      <ProgressBar percent={percent} />
      <div className="budget-card__meta">
        <span>{formatCurrency(saved, currency)} saved</span>
        <span>{formatCurrency(target, currency)} goal</span>
      </div>
    </div>
  );
}
