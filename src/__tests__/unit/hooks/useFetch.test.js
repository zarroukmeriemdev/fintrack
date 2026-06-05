import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetch } from '../../../hooks/useFetch.js';

describe('useFetch', () => {
  it('runs immediately and exposes resolved data', async () => {
    const fn = vi.fn().mockResolvedValue({ value: 42 });
    const { result } = renderHook(() => useFetch(fn, []));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ value: 42 });
    expect(result.current.error).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('captures error messages from rejection', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('nope'));
    const { result } = renderHook(() => useFetch(fn, []));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('nope');
    expect(result.current.data).toBeNull();
  });

  it('does not run on mount when immediate is false', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useFetch(fn, [], { immediate: false }));
    expect(result.current.loading).toBe(false);
    expect(fn).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refetch();
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe('ok');
  });

  it('passes an AbortSignal to the async function', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    renderHook(() => useFetch(fn, []));
    await waitFor(() => expect(fn).toHaveBeenCalled());
    const signal = fn.mock.calls[0][0];
    expect(signal).toBeInstanceOf(AbortSignal);
  });
});
