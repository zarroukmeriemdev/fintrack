import { describe, it, expect } from 'vitest';
import {
  request,
  ApiError,
  isAbortError,
  clearCache,
} from '../../../api/client.js';

describe('api client', () => {
  it('resolves the handler result', async () => {
    const data = await request('k1', () => ({ ok: true }));
    expect(data).toEqual({ ok: true });
  });

  it('wraps a thrown ApiError unchanged', async () => {
    await expect(
      request('k2', () => {
        throw new ApiError('boom', { status: 400, code: 'BAD' });
      })
    ).rejects.toMatchObject({ message: 'boom', code: 'BAD', status: 400 });
  });

  it('converts a generic throw into an ApiError', async () => {
    await expect(
      request('k3', () => {
        throw new Error('raw');
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('rejects with an AbortError when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      request('k4', () => 'never', { signal: controller.signal })
    ).rejects.toSatisfy(isAbortError);
  });

  it('aborts an in-flight request', async () => {
    const controller = new AbortController();
    const promise = request('k5', () => 'value', { signal: controller.signal });
    controller.abort();
    await expect(promise).rejects.toSatisfy(isAbortError);
  });

  it('serves cached GET results on the second call', async () => {
    clearCache();
    let calls = 0;
    const handler = () => {
      calls += 1;
      return calls;
    };
    const first = await request('cached', handler, { cache: true });
    const second = await request('cached', handler, { cache: true });
    expect(first).toBe(1);
    expect(second).toBe(1); // served from cache, handler not re-run
    expect(calls).toBe(1);
  });
});
