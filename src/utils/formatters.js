import { format, parseISO, isValid } from 'date-fns';
import { CURRENCIES, DEFAULT_CURRENCY } from './constants.js';

function currencyConfig(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

/** Format a number as currency, e.g. formatCurrency(1234.5) -> "$1,234.50". */
export function formatCurrency(amount, code = DEFAULT_CURRENCY) {
  const value = Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  const { locale } = currencyConfig(code);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
    }).format(safe);
  } catch {
    // Fallback for unsupported currency codes in older runtimes.
    return `${currencyConfig(code).symbol}${safe.toFixed(2)}`;
  }
}

/** Signed currency: income shows "+", expense shows "-". */
export function formatSignedCurrency(amount, type, code = DEFAULT_CURRENCY) {
  const sign = type === 'expense' ? '-' : '+';
  return `${sign}${formatCurrency(Math.abs(Number(amount) || 0), code)}`;
}

function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return parseISO(value);
  return new Date(value);
}

export function formatDate(value, pattern = 'MMM d, yyyy') {
  const date = toDate(value);
  return isValid(date) ? format(date, pattern) : '—';
}

export function formatMonth(value) {
  return formatDate(value, 'MMM yyyy');
}

/** YYYY-MM key used to group transactions by month. */
export function monthKey(value) {
  const date = toDate(value);
  return isValid(date) ? format(date, 'yyyy-MM') : '';
}

export function formatPercent(value, fractionDigits = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0%';
  return `${num.toFixed(fractionDigits)}%`;
}

/** Capitalise the first letter, e.g. "income" -> "Income". */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
