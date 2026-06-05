import { Button } from '../../common/Button.jsx';
import { ProgressBar } from '../../common/ProgressBar.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

/**
 * Budget summary with spend-vs-limit progress.
 * @param {{ budget: {category,limit,spent,remaining,percent}, currency, onEdit, onDelete }} props
 */
export function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const { category, limit, spent, remaining, percent } = budget;
  const over = remaining < 0;

  return (
    <div className="card budget-card">
      <div className="budget-card__head">
        <h3>{category}</h3>
        <div className="row-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(budget)}
            aria-label={`Edit ${category} budget`}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(budget)}
            aria-label={`Delete ${category} budget`}
          >
            Delete
          </Button>
        </div>
      </div>

      <ProgressBar percent={percent} />

      <div className="budget-card__meta">
        <span>
          {formatCurrency(spent, currency)} of {formatCurrency(limit, currency)}
        </span>
        <span className={over ? 'amount-expense' : 'amount-income'}>
          {over
            ? `${formatCurrency(Math.abs(remaining), currency)} over`
            : `${formatCurrency(remaining, currency)} left`}
        </span>
      </div>
    </div>
  );
}
