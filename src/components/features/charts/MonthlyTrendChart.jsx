import { memo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency, formatMonth } from '../../../utils/formatters.js';
import { INCOME_COLOR, EXPENSE_COLOR } from './chartTheme.js';

/**
 * Grouped bar chart of income vs. expense per month.
 * @param {{ data: Array<{key,income,expense}>, currency: string }} props
 */
function MonthlyTrendChartBase({ data, currency }) {
  if (!data.length) {
    return <p className="empty-state">No data to chart yet.</p>;
  }
  const chartData = data.map((d) => ({
    ...d,
    label: formatMonth(`${d.key}-01`),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} width={70} />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value, currency), name]}
        />
        <Legend />
        <Bar
          dataKey="income"
          name="Income"
          fill={INCOME_COLOR}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill={EXPENSE_COLOR}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const MonthlyTrendChart = memo(MonthlyTrendChartBase);
