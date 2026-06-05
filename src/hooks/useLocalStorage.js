import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '../utils/localStorage.js';

/**
 * useState backed by localStorage.
 * Reads the initial value lazily and writes on every update.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  const setStoredValue = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}
