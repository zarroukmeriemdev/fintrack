import { memo } from 'react';
import { Button } from '../../common/Button.jsx';
import { formatDate, formatSignedCurrency } from '../../../utils/formatters.js';

/** A single transaction row in the transactions table. */
function TransactionRowBase({ transaction, currency, onEdit, onDelete }) {
  const { type, description, category, account, date, amount } = transaction;
  return (
    <tr>
      <td>{formatDate(date)}</td>
      <td>{description}</td>
      <td>
        <span className="badge badge--neutral">{category}</span>
      </td>
      <td>{account}</td>
      <td className="num">
        <span
          className={type === 'income' ? 'amount-income' : 'amount-expense'}
        >
          {formatSignedCurrency(amount, type, currency)}
        </span>
      </td>
      <td className="num">
        <div className="row-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${description}`}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${description}`}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

export const TransactionRow = memo(TransactionRowBase);
