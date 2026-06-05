import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressBar } from '../../../components/common/ProgressBar.jsx';
import { Pagination } from '../../../components/common/Pagination.jsx';
import { StatCard } from '../../../components/features/Dashboard/StatCard.jsx';
import { GoalCard } from '../../../components/features/goals/GoalCard.jsx';
import { BudgetCard } from '../../../components/features/budgets/BudgetCard.jsx';
import { TransactionRow } from '../../../components/features/transactions/TransactionRow.jsx';

describe('ProgressBar', () => {
  it('exposes the value through aria attributes', () => {
    render(<ProgressBar percent={42} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute?.('aria-valuenow', '42');
  });

  it('clamps the visual width at 100%', () => {
    render(<ProgressBar percent={150} />);
    const inner = screen.getByRole('progressbar').firstChild;
    expect(inner).toHaveStyle({ width: '100%' });
    expect(inner.className).toContain('progress__bar--over');
  });
});

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('disables Prev on the first page and pages forward', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

describe('StatCard', () => {
  it('renders label, value and hint', () => {
    render(
      <StatCard label="Balance" value="$10.00" tone="income" hint="net" />
    );
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('net')).toBeInTheDocument();
  });
});

describe('GoalCard', () => {
  it('computes the saved percentage', () => {
    render(
      <GoalCard
        goal={{ id: 'g', name: 'Trip', target: 1000, saved: 250 }}
        currency="USD"
      />
    );
    expect(screen.getByText('Trip')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});

describe('BudgetCard', () => {
  const budget = {
    id: 'b',
    category: 'Groceries',
    limit: 400,
    spent: 300,
    remaining: 100,
    percent: 75,
  };

  it('shows remaining amount and fires actions', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <BudgetCard
        budget={budget}
        currency="USD"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText(/left/)).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /edit groceries/i })
    );
    await userEvent.click(
      screen.getByRole('button', { name: /delete groceries/i })
    );
    expect(onEdit).toHaveBeenCalledWith(budget);
    expect(onDelete).toHaveBeenCalledWith(budget);
  });

  it('shows over-budget messaging', () => {
    render(
      <BudgetCard
        budget={{ ...budget, spent: 500, remaining: -100, percent: 125 }}
        currency="USD"
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText(/over/)).toBeInTheDocument();
  });
});

describe('TransactionRow', () => {
  const tx = {
    id: 't',
    type: 'expense',
    description: 'Coffee',
    category: 'Dining',
    account: 'Checking',
    date: '2026-06-01',
    amount: 4.5,
  };

  it('renders signed amount and triggers edit/delete', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <table>
        <tbody>
          <TransactionRow
            transaction={tx}
            currency="USD"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </tbody>
      </table>
    );
    expect(screen.getByText('-$4.50')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /edit coffee/i }));
    expect(onEdit).toHaveBeenCalledWith(tx);
    await userEvent.click(
      screen.getByRole('button', { name: /delete coffee/i })
    );
    expect(onDelete).toHaveBeenCalledWith(tx);
  });
});
