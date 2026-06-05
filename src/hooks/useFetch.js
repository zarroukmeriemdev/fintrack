import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError } from '../api/client.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Run an async function on mount (and on demand via `refetch`).
 *
 * `asyncFn` receives an AbortSignal and should pass it to the API call.
 * The in-flight request is aborted on unmount or when `refetch` is called
 * again, preventing "set state on unmounted component" leaks.
 *
 * @returns {{ data, error, loading, refetch }}
 */
export function useFetch(asyncFn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFn = useCallback(asyncFn, deps);

  const run = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const result = await stableFn(controller.signal);
      if (mountedRef.current && !controller.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      if (isAbortError(err)) return; // expected on cancel; ignore
      if (mountedRef.current) {
        setError(err?.message || ERROR_MESSAGES.GENERIC);
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [stableFn]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) run();
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [run, immediate]);

  return { data, error, loading, refetch: run };
}
