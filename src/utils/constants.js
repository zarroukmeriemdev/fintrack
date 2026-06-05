/** Application-wide constants: keys, categories, messages, config. */

export const STORAGE_KEYS = {
  AUTH: 'fintrack.auth',
  THEME: 'fintrack.theme',
  STATE: 'fintrack.appState',
};

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const ACCOUNT_TYPES = ['checking', 'savings', 'credit', 'cash'];

/** Default expense categories. Income uses INCOME_CATEGORIES. */
export const EXPENSE_CATEGORIES = [
  'Housing',
  'Groceries',
  'Transport',
  'Utilities',
  'Dining',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other',
];

export const ALL_CATEGORIES = [
  ...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'TND', symbol: 'DT', locale: 'fr-TN' },
];

export const DEFAULT_CURRENCY = 'USD';

export const PAGE_SIZE = 8;

/** Simulated network latency window (ms) for the mock API. */
export const API_LATENCY = { min: 150, max: 450 };

/** Cache time-to-live for API responses (ms). */
export const CACHE_TTL = 30_000;

export const ERROR_MESSAGES = {
  NETWORK: 'Could not reach the server. Check your connection and try again.',
  TIMEOUT: 'The request took too long. Please try again.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  GENERIC: 'Something went wrong. Please try again.',
  REQUIRED: 'This field is required.',
  INVALID_EMAIL: 'Enter a valid email address.',
  SHORT_PASSWORD: 'Password must be at least 6 characters.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  INVALID_AMOUNT: 'Enter an amount greater than zero.',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};
