import { useMemo, useState } from 'react';
import { useApp } from '../hooks/useApp.js';
import { useAuth } from '../hooks/useAuth.js';
import { Loading } from '../components/common/Loading.jsx';
import { Input } from '../components/common/Input.jsx';
import { MonthlyTrendChart } from '../components/features/charts/MonthlyTrendChart.jsx';
import { CategoryPieChart } from '../components/features/charts/CategoryPieChart.jsx';
import {
  monthlySeries,
  expensesByCategory,
  availableMonths,
  totalIncome,
  totalExpense,
} from '../utils/helpers.js';
import { formatCurrency, formatMonth, monthKey } from '../utils/formatters.js';

export default function ReportsPage() {
  const { user } = useAuth();
  const { status, transactions } = useApp();
  const currency = user?.currency || 'USD';

  const months = useMemo(() => availableMonths(transactions), [transactions]);
  const [month, setMonth] = useState('all');

  // Transactions scoped to the selected month (or all).
  const scoped = useMemo(() => {
    if (month === 'all') return transactions;
    return transactions.filter((t) => monthKey(t.date) === month);
  }, [transactions, month]);

  const series = useMemo(() => monthlySeries(transactions), [transactions]);
  const byCategory = useMemo(() => expensesByCategory(scoped), [scoped]);
  const income = useMemo(() => totalIncome(scoped), [scoped]);
  const expense = useMemo(() => totalExpense(scoped), [scoped]);
  const savingsRate =
    income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  if (status === 'loading' || status === 'idle') {
    return <Loading label="Loading reports…" />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Analyse your income and spending over time.</p>
        </div>
        <div style={{ minWidth: 200 }}>
          <Input
            label="Period"
            name="period"
            options={[
              { value: 'all', label: 'All time' },
              ...months.map((m) => ({
                value: m,
                label: formatMonth(`${m}-01`),
              })),
            ]}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-card__label">Income</span>
          <strong className="stat-card__value stat-card__value--income">
            {formatCurrency(income, currency)}
          </strong>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Expenses</span>
          <strong className="stat-card__value stat-card__value--expense">
            {formatCurrency(expense, currency)}
          </strong>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Net</span>
          <strong
            className={`stat-card__value stat-card__value--${
              income - expense >= 0 ? 'income' : 'expense'
            }`}
          >
            {formatCurrency(income - expense, currency)}
          </strong>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Savings rate</span>
          <strong className="stat-card__value">{savingsRate}%</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card" aria-label="Monthly income and expense">
          <h2>Income vs expense</h2>
          <MonthlyTrendChart data={series} currency={currency} />
        </section>
        <section className="card" aria-label="Category breakdown chart">
          <h2>Category breakdown</h2>
          <CategoryPieChart data={byCategory} currency={currency} />
        </section>
      </div>

      <section className="card" aria-label="Category breakdown table">
        <h2>Spending by category</h2>
        {byCategory.length === 0 ? (
          <p className="empty-state">No expenses in this period.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                  <th scope="col" className="num">
                    % of spending
                  </th>
                </tr>
              </thead>
              <tbody>
                {byCategory.map((c) => (
                  <tr key={c.category}>
                    <td>{c.category}</td>
                    <td className="num">
                      {formatCurrency(c.amount, currency)}
                    </td>
                    <td className="num">
                      {expense > 0 ? Math.round((c.amount / expense) * 100) : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
