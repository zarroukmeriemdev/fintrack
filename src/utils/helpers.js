import { monthKey } from './formatters.js';
import { TRANSACTION_TYPES } from './constants.js';

/** Generate a reasonably unique id without external deps. */
export function generateId(prefix = 'id') {
  const rand = Math.floor((1 + (performance.now() % 1)) * 1e9).toString(36);
  const tail = (performance.now() | 0).toString(36);
  return `${prefix}_${tail}${rand}`;
}

/** Sum the `amount` of every transaction matching `type`. */
export function sumByType(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((total, t) => total + (Number(t.amount) || 0), 0);
}

export function totalIncome(transactions) {
  return sumByType(transactions, TRANSACTION_TYPES.INCOME);
}

export function totalExpense(transactions) {
  return sumByType(transactions, TRANSACTION_TYPES.EXPENSE);
}

/** Net balance = income - expense. */
export function netBalance(transactions) {
  return totalIncome(transactions) - totalExpense(transactions);
}

/**
 * Sum expense amounts grouped by category.
 * Returns `[{ category, amount }]` sorted by amount descending.
 */
export function expensesByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== TRANSACTION_TYPES.EXPENSE) continue;
    map.set(t.category, (map.get(t.category) || 0) + (Number(t.amount) || 0));
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Build a monthly income/expense series.
 * Returns `[{ key, income, expense, net }]` sorted chronologically.
 */
export function monthlySeries(transactions) {
  const map = new Map();
  for (const t of transactions) {
    const key = monthKey(t.date);
    if (!key) continue;
    if (!map.has(key)) map.set(key, { key, income: 0, expense: 0 });
    const bucket = map.get(key);
    const amount = Number(t.amount) || 0;
    if (t.type === TRANSACTION_TYPES.INCOME) bucket.income += amount;
    else bucket.expense += amount;
  }
  return [...map.values()]
    .map((b) => ({ ...b, net: b.income - b.expense }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Filter + sort transactions for the list view.
 * opts: { search, type, category, month, sortBy ('date'|'amount'), sortDir }
 */
export function filterTransactions(transactions, opts = {}) {
  const {
    search = '',
    type = 'all',
    category = 'all',
    month = 'all',
    sortBy = 'date',
    sortDir = 'desc',
  } = opts;
  const term = search.trim().toLowerCase();

  const filtered = transactions.filter((t) => {
    if (type !== 'all' && t.type !== type) return false;
    if (category !== 'all' && t.category !== category) return false;
    if (month !== 'all' && monthKey(t.date) !== month) return false;
    if (term) {
      const haystack =
        `${t.description} ${t.category} ${t.account}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  const dir = sortDir === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    if (sortBy === 'amount') return (a.amount - b.amount) * dir;
    return a.date.localeCompare(b.date) * dir;
  });
  return filtered;
}

/** Slice an array into a page (1-indexed). */
export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function pageCount(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Distinct sorted month keys present in the data, newest first. */
export function availableMonths(transactions) {
  const keys = new Set(
    transactions.map((t) => monthKey(t.date)).filter(Boolean)
  );
  return [...keys].sort((a, b) => b.localeCompare(a));
}

/**
 * Combine budgets with actual spend per category.
 * Returns `[{ category, limit, spent, remaining, percent }]`.
 */
export function budgetProgress(budgets, transactions) {
  const spendByCat = new Map(
    expensesByCategory(transactions).map((e) => [e.category, e.amount])
  );
  return budgets.map((b) => {
    const spent = spendByCat.get(b.category) || 0;
    const percent = b.limit > 0 ? (spent / b.limit) * 100 : 0;
    return {
      ...b,
      spent,
      remaining: b.limit - spent,
      percent: Math.round(percent),
    };
  });
}

/** Convert transactions to a CSV string (with header row). */
export function transactionsToCSV(transactions) {
  const header = [
    'Date',
    'Type',
    'Category',
    'Account',
    'Description',
    'Amount',
  ];
  const escape = (val) => {
    const str = String(val ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const rows = transactions.map((t) =>
    [t.date, t.type, t.category, t.account, t.description, t.amount]
      .map(escape)
      .join(',')
  );
  return [header.join(','), ...rows].join('\n');
}
