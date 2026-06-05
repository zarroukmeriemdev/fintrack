import { API_LATENCY, CACHE_TTL, ERROR_MESSAGES } from '../utils/constants.js';

/**
 * A small fetch-like client over an in-memory/localStorage "backend".
 *
 * It mimics a real network layer so the rest of the app is backend-agnostic:
 *  - simulated latency
 *  - AbortController support (request cancellation)
 *  - timeout handling
 *  - a typed ApiError with user-friendly messages
 *  - a tiny TTL response cache for GET requests
 *
 * Swapping this for Axios/Firebase later only touches this file + endpoints.js.
 */

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'GENERIC' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const cache = new Map();

export function clearCache() {
  cache.clear();
}

function randomLatency() {
  // Skip simulated latency under test so async chains stay fast and
  // deterministic; use realistic latency everywhere else.
  if (import.meta.env?.MODE === 'test') return 0;
  const { min, max } = API_LATENCY;
  return min + Math.floor(performance.now() % (max - min + 1));
}

/**
 * Run an async "handler" with simulated latency, cancellation and timeout.
 * @param {string} key cache key (also used for logging)
 * @param {() => any} handler returns the resolved data (may throw ApiError)
 * @param {{ signal?: AbortSignal, timeout?: number, cache?: boolean }} opts
 */
export function request(key, handler, opts = {}) {
  const { signal, timeout = 8000, cache: useCache = false } = opts;

  if (useCache) {
    const hit = cache.get(key);
    if (hit && performance.now() - hit.time < CACHE_TTL) {
      return Promise.resolve(hit.data);
    }
  }

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const latency = randomLatency();

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new ApiError(ERROR_MESSAGES.TIMEOUT, { code: 'TIMEOUT' }));
    }, timeout);

    const latencyId = setTimeout(() => {
      cleanup();
      try {
        const data = handler();
        if (useCache) cache.set(key, { time: performance.now(), data });
        resolve(data);
      } catch (err) {
        if (err instanceof ApiError) reject(err);
        else reject(new ApiError(ERROR_MESSAGES.GENERIC, { code: 'GENERIC' }));
      }
    }, latency);

    function onAbort() {
      cleanup();
      reject(new DOMException('Aborted', 'AbortError'));
    }

    function cleanup() {
      clearTimeout(timeoutId);
      clearTimeout(latencyId);
      signal?.removeEventListener('abort', onAbort);
    }

    signal?.addEventListener('abort', onAbort);
  });
}

/** True when an error is the result of an aborted request. */
export function isAbortError(err) {
  return err?.name === 'AbortError';
}
