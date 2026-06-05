import { describe, it, expect } from 'vitest';
import {
  generateId,
  sumByType,
  totalIncome,
  totalExpense,
  netBalance,
  expensesByCategory,
  monthlySeries,
  filterTransactions,
  paginate,
  pageCount,
  availableMonths,
  budgetProgress,
  transactionsToCSV,
} from '../../../utils/helpers.js';

const tx = (over = {}) => ({
  id: over.id || 't1',
  type: 'expense',
  category: 'Groceries',
  account: 'Checking',
  description: 'Food',
  amount: 50,
  date: '2026-06-01',
  ...over,
});

const sample = [
  tx({
    id: 'a',
    type: 'income',
    category: 'Salary',
    amount: 1000,
    date: '2026-05-01',
  }),
  tx({
    id: 'b',
    type: 'expense',
    category: 'Groceries',
    amount: 200,
    date: '2026-05-10',
  }),
  tx({
    id: 'c',
    type: 'expense',
    category: 'Groceries',
    amount: 100,
    date: '2026-06-02',
  }),
  tx({
    id: 'd',
    type: 'expense',
    category: 'Transport',
    amount: 50,
    date: '2026-06-03',
  }),
  tx({
    id: 'e',
    type: 'income',
    category: 'Freelance',
    amount: 300,
    date: '2026-06-04',
  }),
];

describe('helpers', () => {
  it('generateId returns unique prefixed ids', () => {
    const a = generateId('t');
    const b = generateId('t');
    expect(a).toMatch(/^t_/);
    expect(a).not.toBe(b);
  });

  describe('totals', () => {
    it('sums by type', () => {
      expect(sumByType(sample, 'income')).toBe(1300);
      expect(sumByType(sample, 'expense')).toBe(350);
    });
    it('totalIncome / totalExpense / netBalance', () => {
      expect(totalIncome(sample)).toBe(1300);
      expect(totalExpense(sample)).toBe(350);
      expect(netBalance(sample)).toBe(950);
    });
    it('handles an empty list', () => {
      expect(netBalance([])).toBe(0);
    });
  });

  describe('expensesByCategory', () => {
    it('groups and sorts by amount desc', () => {
      const result = expensesByCategory(sample);
      expect(result).toEqual([
        { category: 'Groceries', amount: 300 },
        { category: 'Transport', amount: 50 },
      ]);
    });
  });

  describe('monthlySeries', () => {
    it('buckets income/expense by month chronologically', () => {
      const series = monthlySeries(sample);
      expect(series).toHaveLength(2);
      expect(series[0]).toEqual({
        key: '2026-05',
        income: 1000,
        expense: 200,
        net: 800,
      });
      expect(series[1]).toEqual({
        key: '2026-06',
        income: 300,
        expense: 150,
        net: 150,
      });
    });
  });

  describe('filterTransactions', () => {
    it('filters by type', () => {
      expect(filterTransactions(sample, { type: 'income' })).toHaveLength(2);
    });
    it('filters by category', () => {
      expect(
        filterTransactions(sample, { category: 'Transport' })
      ).toHaveLength(1);
    });
    it('filters by month', () => {
      expect(filterTransactions(sample, { month: '2026-05' })).toHaveLength(2);
    });
    it('filters by search term (case-insensitive)', () => {
      expect(filterTransactions(sample, { search: 'salary' })).toHaveLength(1);
    });
    it('sorts by amount ascending', () => {
      const result = filterTransactions(sample, {
        sortBy: 'amount',
        sortDir: 'asc',
      });
      expect(result[0].amount).toBe(50);
      expect(result[result.length - 1].amount).toBe(1000);
    });
    it('defaults to date descending', () => {
      const result = filterTransactions(sample);
      expect(result[0].date).toBe('2026-06-04');
    });
  });

  describe('pagination', () => {
    it('paginate slices the right page', () => {
      const items = [1, 2, 3, 4, 5];
      expect(paginate(items, 1, 2)).toEqual([1, 2]);
      expect(paginate(items, 3, 2)).toEqual([5]);
    });
    it('pageCount rounds up and is at least 1', () => {
      expect(pageCount(5, 2)).toBe(3);
      expect(pageCount(0, 2)).toBe(1);
    });
  });

  describe('availableMonths', () => {
    it('returns distinct months newest first', () => {
      expect(availableMonths(sample)).toEqual(['2026-06', '2026-05']);
    });
  });

  describe('budgetProgress', () => {
    it('combines budgets with actual spend', () => {
      const budgets = [
        { id: 'b1', category: 'Groceries', limit: 400 },
        { id: 'b2', category: 'Transport', limit: 40 },
      ];
      const result = budgetProgress(budgets, sample);
      expect(result[0]).toMatchObject({
        category: 'Groceries',
        spent: 300,
        remaining: 100,
        percent: 75,
      });
      expect(result[1]).toMatchObject({
        category: 'Transport',
        spent: 50,
        remaining: -10,
        percent: 125,
      });
    });
  });

  describe('transactionsToCSV', () => {
    it('produces a header and a row per transaction', () => {
      const csv = transactionsToCSV([sample[0]]);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('Date,Type,Category,Account,Description,Amount');
      expect(lines[1]).toContain('Salary');
      expect(lines).toHaveLength(2);
    });
    it('escapes commas and quotes', () => {
      const csv = transactionsToCSV([
        tx({ description: 'Lunch, with "friends"' }),
      ]);
      expect(csv).toContain('"Lunch, with ""friends"""');
    });
  });
});
