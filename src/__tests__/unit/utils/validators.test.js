import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  validateEmail,
  validatePassword,
  validateRequired,
  validateAmount,
  validatePasswordMatch,
  validateForm,
} from '../../../utils/validators.js';
import { ERROR_MESSAGES } from '../../../utils/constants.js';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('accepts a well-formed address', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    it.each(['', 'no-at', 'a@b', 'a@b.', '  ', 42])(
      'rejects malformed input %s',
      (value) => {
        expect(isValidEmail(value)).toBe(false);
      }
    );
  });

  describe('validateEmail', () => {
    it('flags an empty value as required', () => {
      expect(validateEmail('')).toBe(ERROR_MESSAGES.REQUIRED);
    });
    it('flags an invalid value', () => {
      expect(validateEmail('nope')).toBe(ERROR_MESSAGES.INVALID_EMAIL);
    });
    it('returns empty string when valid', () => {
      expect(validateEmail('a@b.com')).toBe('');
    });
  });

  describe('validatePassword', () => {
    it('requires a value', () => {
      expect(validatePassword('')).toBe(ERROR_MESSAGES.REQUIRED);
    });
    it('rejects short passwords', () => {
      expect(validatePassword('123')).toBe(ERROR_MESSAGES.SHORT_PASSWORD);
    });
    it('accepts a 6+ char password', () => {
      expect(validatePassword('secret1')).toBe('');
    });
  });

  describe('validateRequired', () => {
    it.each([null, undefined, '', '   '])('flags %s', (value) => {
      expect(validateRequired(value)).toBe(ERROR_MESSAGES.REQUIRED);
    });
    it('accepts a non-empty value', () => {
      expect(validateRequired('hello')).toBe('');
    });
  });

  describe('validateAmount', () => {
    it('requires a value', () => {
      expect(validateAmount('')).toBe(ERROR_MESSAGES.REQUIRED);
    });
    it.each(['0', '-5', 'abc'])('rejects %s', (value) => {
      expect(validateAmount(value)).toBe(ERROR_MESSAGES.INVALID_AMOUNT);
    });
    it('accepts a positive number', () => {
      expect(validateAmount('12.5')).toBe('');
    });
  });

  describe('validatePasswordMatch', () => {
    it('requires the confirmation', () => {
      expect(validatePasswordMatch('abc123', '')).toBe(ERROR_MESSAGES.REQUIRED);
    });
    it('flags a mismatch', () => {
      expect(validatePasswordMatch('abc123', 'xyz')).toBe(
        ERROR_MESSAGES.PASSWORD_MISMATCH
      );
    });
    it('passes when equal', () => {
      expect(validatePasswordMatch('abc123', 'abc123')).toBe('');
    });
  });

  describe('validateForm', () => {
    const schema = { email: validateEmail, password: validatePassword };

    it('collects errors and reports invalid', () => {
      const { errors, isValid } = validateForm(
        { email: 'bad', password: '1' },
        schema
      );
      expect(isValid).toBe(false);
      expect(errors.email).toBe(ERROR_MESSAGES.INVALID_EMAIL);
      expect(errors.password).toBe(ERROR_MESSAGES.SHORT_PASSWORD);
    });

    it('reports valid with no errors', () => {
      const { errors, isValid } = validateForm(
        { email: 'a@b.com', password: 'secret1' },
        schema
      );
      expect(isValid).toBe(true);
      expect(errors).toEqual({});
    });
  });
});
