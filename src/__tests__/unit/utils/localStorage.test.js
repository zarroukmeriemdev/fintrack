import { describe, it, expect, vi } from 'vitest';
import {
  readStorage,
  writeStorage,
  removeStorage,
} from '../../../utils/localStorage.js';

describe('localStorage helpers', () => {
  it('writes and reads JSON values', () => {
    writeStorage('key', { a: 1 });
    expect(readStorage('key')).toEqual({ a: 1 });
  });

  it('returns the fallback when the key is missing', () => {
    expect(readStorage('missing', 'fallback')).toBe('fallback');
  });

  it('returns the fallback when stored JSON is corrupt', () => {
    localStorage.setItem('bad', '{not json');
    expect(readStorage('bad', null)).toBeNull();
  });

  it('removes a key', () => {
    writeStorage('temp', 1);
    removeStorage('temp');
    expect(readStorage('temp', 'gone')).toBe('gone');
  });

  it('writeStorage returns false when storage throws', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota');
      });
    expect(writeStorage('x', 1)).toBe(false);
    spy.mockRestore();
  });
});
