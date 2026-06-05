/**
 * Seed data used to populate a new user's account on first login.
 * Dates are recent-relative-ish fixed ISO strings so charts have history.
 * This stands in for a backend response (JSONPlaceholder-style mock).
 */

export const DEMO_USER = {
  id: 'user_demo',
  email: 'demo@fintrack.app',
  password: 'demo123',
  name: 'Demo User',
  currency: 'USD',
};

export const seedAccounts = [
  { id: 'acc_checking', name: 'Everyday Checking', type: 'checking' },
  { id: 'acc_savings', name: 'Rainy Day Savings', type: 'savings' },
  { id: 'acc_credit', name: 'Travel Credit Card', type: 'credit' },
];

export const seedBudgets = [
  { id: 'bud_housing', category: 'Housing', limit: 1400 },
  { id: 'bud_groceries', category: 'Groceries', limit: 500 },
  { id: 'bud_transport', category: 'Transport', limit: 200 },
  { id: 'bud_dining', category: 'Dining', limit: 250 },
  { id: 'bud_entertainment', category: 'Entertainment', limit: 150 },
];

export const seedGoals = [
  { id: 'goal_emergency', name: 'Emergency Fund', target: 10000, saved: 6200 },
  { id: 'goal_trip', name: 'Japan Trip', target: 4000, saved: 1500 },
];

export const seedTransactions = [
  // Two months back
  {
    id: 't01',
    type: 'income',
    category: 'Salary',
    account: 'Everyday Checking',
    description: 'Monthly salary',
    amount: 4200,
    date: '2026-04-01',
  },
  {
    id: 't02',
    type: 'expense',
    category: 'Housing',
    account: 'Everyday Checking',
    description: 'Rent',
    amount: 1400,
    date: '2026-04-03',
  },
  {
    id: 't03',
    type: 'expense',
    category: 'Groceries',
    account: 'Everyday Checking',
    description: 'Supermarket',
    amount: 320,
    date: '2026-04-08',
  },
  {
    id: 't04',
    type: 'expense',
    category: 'Transport',
    account: 'Travel Credit Card',
    description: 'Fuel',
    amount: 90,
    date: '2026-04-12',
  },
  {
    id: 't05',
    type: 'expense',
    category: 'Dining',
    account: 'Travel Credit Card',
    description: 'Restaurants',
    amount: 180,
    date: '2026-04-19',
  },
  {
    id: 't06',
    type: 'income',
    category: 'Freelance',
    account: 'Everyday Checking',
    description: 'Side project',
    amount: 650,
    date: '2026-04-22',
  },
  // One month back
  {
    id: 't07',
    type: 'income',
    category: 'Salary',
    account: 'Everyday Checking',
    description: 'Monthly salary',
    amount: 4200,
    date: '2026-05-01',
  },
  {
    id: 't08',
    type: 'expense',
    category: 'Housing',
    account: 'Everyday Checking',
    description: 'Rent',
    amount: 1400,
    date: '2026-05-03',
  },
  {
    id: 't09',
    type: 'expense',
    category: 'Groceries',
    account: 'Everyday Checking',
    description: 'Supermarket',
    amount: 410,
    date: '2026-05-09',
  },
  {
    id: 't10',
    type: 'expense',
    category: 'Utilities',
    account: 'Everyday Checking',
    description: 'Electricity & water',
    amount: 140,
    date: '2026-05-11',
  },
  {
    id: 't11',
    type: 'expense',
    category: 'Entertainment',
    account: 'Travel Credit Card',
    description: 'Streaming + concert',
    amount: 120,
    date: '2026-05-15',
  },
  {
    id: 't12',
    type: 'expense',
    category: 'Health',
    account: 'Everyday Checking',
    description: 'Pharmacy',
    amount: 60,
    date: '2026-05-20',
  },
  {
    id: 't13',
    type: 'income',
    category: 'Investments',
    account: 'Rainy Day Savings',
    description: 'Dividends',
    amount: 95,
    date: '2026-05-25',
  },
  // Current month
  {
    id: 't14',
    type: 'income',
    category: 'Salary',
    account: 'Everyday Checking',
    description: 'Monthly salary',
    amount: 4200,
    date: '2026-06-01',
  },
  {
    id: 't15',
    type: 'expense',
    category: 'Housing',
    account: 'Everyday Checking',
    description: 'Rent',
    amount: 1400,
    date: '2026-06-03',
  },
  {
    id: 't16',
    type: 'expense',
    category: 'Groceries',
    account: 'Everyday Checking',
    description: 'Supermarket',
    amount: 180,
    date: '2026-06-04',
  },
  {
    id: 't17',
    type: 'expense',
    category: 'Transport',
    account: 'Travel Credit Card',
    description: 'Train pass',
    amount: 75,
    date: '2026-06-05',
  },
];

export function buildSeedState() {
  return {
    accounts: seedAccounts,
    budgets: seedBudgets,
    goals: seedGoals,
    transactions: seedTransactions,
  };
}
