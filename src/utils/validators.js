import { ERROR_MESSAGES } from './constants.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

export function isStrongEnoughPassword(value) {
  return typeof value === 'string' && value.length >= 6;
}

/** Returns an error string for an email field, or '' when valid. */
export function validateEmail(value) {
  if (!value || !value.trim()) return ERROR_MESSAGES.REQUIRED;
  if (!isValidEmail(value)) return ERROR_MESSAGES.INVALID_EMAIL;
  return '';
}

export function validatePassword(value) {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  if (!isStrongEnoughPassword(value)) return ERROR_MESSAGES.SHORT_PASSWORD;
  return '';
}

export function validateRequired(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  return '';
}

/** Amount must parse to a finite number strictly greater than zero. */
export function validateAmount(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return ERROR_MESSAGES.INVALID_AMOUNT;
  return '';
}

export function validatePasswordMatch(password, confirm) {
  if (!confirm) return ERROR_MESSAGES.REQUIRED;
  if (password !== confirm) return ERROR_MESSAGES.PASSWORD_MISMATCH;
  return '';
}

/**
 * Run a map of `{ field: validatorFn }` against `values`.
 * Returns `{ errors, isValid }` where errors only contains non-empty messages.
 */
export function validateForm(values, schema) {
  const errors = {};
  for (const field of Object.keys(schema)) {
    const message = schema[field](values[field], values);
    if (message) errors[field] = message;
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
}
