import { Input } from '../../common/Input.jsx';
import { formatMonth } from '../../../utils/formatters.js';
import { ALL_CATEGORIES } from '../../../utils/constants.js';

/**
 * Search + filter controls for the transactions list.
 * @param {{ filters, onChange, months: string[] }} props
 */
export function TransactionFilters({ filters, onChange, months }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="filters">
      <div className="filters__search">
        <Input
          label="Search"
          name="search"
          type="search"
          placeholder="Search description, category…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      <Input
        label="Type"
        name="type"
        options={[
          { value: 'all', label: 'All types' },
          { value: 'income', label: 'Income' },
          { value: 'expense', label: 'Expense' },
        ]}
        value={filters.type}
        onChange={(e) => update({ type: e.target.value })}
      />
      <Input
        label="Category"
        name="category"
        options={[
          { value: 'all', label: 'All categories' },
          ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
        ]}
        value={filters.category}
        onChange={(e) => update({ category: e.target.value })}
      />
      <Input
        label="Month"
        name="month"
        options={[
          { value: 'all', label: 'All months' },
          ...months.map((m) => ({ value: m, label: formatMonth(`${m}-01`) })),
        ]}
        value={filters.month}
        onChange={(e) => update({ month: e.target.value })}
      />
    </div>
  );
}
