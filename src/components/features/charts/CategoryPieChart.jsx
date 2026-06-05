import { memo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../../utils/formatters.js';
import { CHART_COLORS } from './chartTheme.js';

/**
 * Donut chart of expense totals by category.
 * @param {{ data: Array<{category,amount}>, currency: string }} props
 */
function CategoryPieChartBase({ data, currency }) {
  if (!data.length) {
    return <p className="empty-state">No expenses to chart yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.category}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value, currency)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export const CategoryPieChart = memo(CategoryPieChartBase);
