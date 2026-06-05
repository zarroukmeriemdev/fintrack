import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatSignedCurrency,
  formatDate,
  formatMonth,
  monthKey,
  formatPercent,
  capitalize,
} from '../../../utils/formatters.js';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats USD with two decimals', () => {
      expect(formatCurrency(1234.5, 'USD')).toBe('$1,234.50');
    });
    it('falls back to 0 for non-numeric input', () => {
      expect(formatCurrency('not-a-number')).toBe('$0.00');
    });
    it('handles an unknown currency gracefully', () => {
      expect(typeof formatCurrency(10, 'ZZZ')).toBe('string');
    });
  });

  describe('formatSignedCurrency', () => {
    it('prefixes income with +', () => {
      expect(formatSignedCurrency(100, 'income', 'USD')).toBe('+$100.00');
    });
    it('prefixes expense with -', () => {
      expect(formatSignedCurrency(100, 'expense', 'USD')).toBe('-$100.00');
    });
  });

  describe('date helpers', () => {
    it('formats an ISO date', () => {
      expect(formatDate('2026-06-05')).toBe('Jun 5, 2026');
    });
    it('returns a dash for invalid dates', () => {
      expect(formatDate('not-a-date')).toBe('—');
    });
    it('formats a month label', () => {
      expect(formatMonth('2026-06-05')).toBe('Jun 2026');
    });
    it('builds a yyyy-MM key', () => {
      expect(monthKey('2026-06-05')).toBe('2026-06');
    });
    it('returns empty key for invalid date', () => {
      expect(monthKey('nope')).toBe('');
    });
  });

  describe('formatPercent', () => {
    it('formats a whole percent', () => {
      expect(formatPercent(42)).toBe('42%');
    });
    it('supports fraction digits', () => {
      expect(formatPercent(42.345, 1)).toBe('42.3%');
    });
    it('handles invalid input', () => {
      expect(formatPercent('x')).toBe('0%');
    });
  });

  describe('capitalize', () => {
    it('capitalises the first letter', () => {
      expect(capitalize('income')).toBe('Income');
    });
    it('returns empty string unchanged', () => {
      expect(capitalize('')).toBe('');
    });
  });
});
