import { describe, it, expect } from 'vitest';
import {
  authReducer,
  initialAuthState,
  AUTH_ACTIONS,
} from '../../../reducers/authReducer.js';

describe('authReducer', () => {
  it('returns the current state for an unknown action', () => {
    expect(authReducer(initialAuthState, { type: 'noop' })).toBe(
      initialAuthState
    );
  });

  it('sets loading on START', () => {
    const state = authReducer(initialAuthState, { type: AUTH_ACTIONS.START });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores the user and token on SUCCESS', () => {
    const payload = { user: { id: '1', name: 'A' }, token: 'tok' };
    const state = authReducer(initialAuthState, {
      type: AUTH_ACTIONS.SUCCESS,
      payload,
    });
    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('tok');
  });

  it('records the error on FAILURE', () => {
    const state = authReducer(initialAuthState, {
      type: AUTH_ACTIONS.FAILURE,
      payload: 'Bad creds',
    });
    expect(state.status).toBe('error');
    expect(state.error).toBe('Bad creds');
  });

  it('clears all state on LOGOUT', () => {
    const authed = {
      ...initialAuthState,
      user: { id: '1' },
      token: 't',
      status: 'authenticated',
    };
    expect(authReducer(authed, { type: AUTH_ACTIONS.LOGOUT })).toEqual(
      initialAuthState
    );
  });

  it('clears only the error on CLEAR_ERROR', () => {
    const errored = { ...initialAuthState, error: 'x', status: 'error' };
    const state = authReducer(errored, { type: AUTH_ACTIONS.CLEAR_ERROR });
    expect(state.error).toBeNull();
    expect(state.status).toBe('error');
  });

  it('merges user changes on UPDATE_USER', () => {
    const authed = { ...initialAuthState, user: { id: '1', name: 'A' } };
    const state = authReducer(authed, {
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: { name: 'B', currency: 'EUR' },
    });
    expect(state.user).toEqual({ id: '1', name: 'B', currency: 'EUR' });
  });
});
