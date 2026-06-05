import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../hooks/useApp.js';
import { useAuth } from '../hooks/useAuth.js';
import { Loading } from '../components/common/Loading.jsx';
import { Button } from '../components/common/Button.jsx';
import { StatCard } from '../components/features/Dashboard/StatCard.jsx';
import { MonthlyTrendChart } from '../components/features/charts/MonthlyTrendChart.jsx';
import { CategoryPieChart } from '../components/features/charts/CategoryPieChart.jsx';
import { GoalCard } from '../components/features/goals/GoalCard.jsx';
import {
  formatCurrency,
  formatDate,
  formatSignedCurrency,
} from '../utils/formatters.js';
import {
  totalIncome,
  totalExpense,
  netBalance,
  expensesByCategory,
  monthlySeries,
} from '../utils/helpers.js';
import { ROUTES } from '../utils/constants.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const { status, error, transactions, goals } = useApp();
  const currency = user?.currency || 'USD';

  const stats = useMemo(
    () => ({
      income: totalIncome(transactions),
      expense: totalExpense(transactions),
      balance: netBalance(transactions),
    }),
    [transactions]
  );

  const byCategory = useMemo(
    () => expensesByCategory(transactions),
    [transactions]
  );
  const series = useMemo(() => monthlySeries(transactions), [transactions]);
  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [transactions]
  );

  if (status === 'loading' || status === 'idle') {
    return <Loading label="Loading your dashboard…" />;
  }

  if (status === 'error') {
    return (
      <div className="alert alert--error" role="alert">
        {error || 'Could not load your data.'}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'there'} 👋</p>
        </div>
        <Button as={Link} to={ROUTES.TRANSACTIONS}>
          + Add transaction
        </Button>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Net balance"
          value={formatCurrency(stats.balance, currency)}
          tone={stats.balance >= 0 ? 'income' : 'expense'}
          hint="Income minus expenses"
        />
        <StatCard
          label="Total income"
          value={formatCurrency(stats.income, currency)}
          tone="income"
        />
        <StatCard
          label="Total expenses"
          value={formatCurrency(stats.expense, currency)}
          tone="expense"
        />
        <StatCard
          label="Transactions"
          value={String(transactions.length)}
          hint="All time"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card" aria-label="Income vs expense by month">
          <h2>Monthly trend</h2>
          <MonthlyTrendChart data={series} currency={currency} />
        </section>
        <section className="card" aria-label="Spending by category">
          <h2>Spending by category</h2>
          <CategoryPieChart data={byCategory} currency={currency} />
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="card" aria-label="Recent transactions">
          <div className="page-header">
            <h2>Recent activity</h2>
            <Link to={ROUTES.TRANSACTIONS}>View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="empty-state">No transactions yet.</p>
          ) : (
            <ul className="recent-list">
              {recent.map((t) => (
                <li key={t.id} className="recent-list__item">
                  <div>
                    <strong>{t.description}</strong>
                    <span className="recent-list__meta">
                      {t.category} · {formatDate(t.date)}
                    </span>
                  </div>
                  <span
                    className={
                      t.type === 'income' ? 'amount-income' : 'amount-expense'
                    }
                  >
                    {formatSignedCurrency(t.amount, t.type, currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card" aria-label="Savings goals">
          <div className="page-header">
            <h2>Savings goals</h2>
          </div>
          {goals.length === 0 ? (
            <p className="empty-state">No goals yet.</p>
          ) : (
            <div className="goal-list">
              {goals.map((g) => (
                <GoalCard key={g.id} goal={g} currency={currency} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
