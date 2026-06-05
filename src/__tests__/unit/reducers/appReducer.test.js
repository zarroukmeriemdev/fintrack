import { describe, it, expect } from 'vitest';
import {
  appReducer,
  initialAppState,
  APP_ACTIONS,
} from '../../../reducers/appReducer.js';

const ready = (over = {}) => ({
  ...initialAppState,
  status: 'ready',
  transactions: [{ id: 't1', amount: 10, type: 'expense' }],
  budgets: [{ id: 'b1', category: 'Food', limit: 100 }],
  accounts: [{ id: 'a1', name: 'Checking', type: 'checking' }],
  goals: [{ id: 'g1', name: 'Car', target: 5000, saved: 1000 }],
  ...over,
});

describe('appReducer', () => {
  it('returns current state for unknown actions', () => {
    expect(appReducer(initialAppState, { type: 'noop' })).toBe(initialAppState);
  });

  it('handles the load lifecycle', () => {
    const loading = appReducer(initialAppState, {
      type: APP_ACTIONS.LOAD_START,
    });
    expect(loading.status).toBe('loading');

    const loaded = appReducer(loading, {
      type: APP_ACTIONS.LOAD_SUCCESS,
      payload: {
        transactions: [{ id: 'x' }],
        budgets: [],
        accounts: [],
        goals: [],
      },
    });
    expect(loaded.status).toBe('ready');
    expect(loaded.transactions).toHaveLength(1);

    const errored = appReducer(loading, {
      type: APP_ACTIONS.LOAD_ERROR,
      payload: 'boom',
    });
    expect(errored.status).toBe('error');
    expect(errored.error).toBe('boom');
  });

  it('resets to initial state', () => {
    expect(appReducer(ready(), { type: APP_ACTIONS.RESET })).toEqual(
      initialAppState
    );
  });

  describe('transactions', () => {
    it('adds a transaction with a generated id at the front', () => {
      const state = appReducer(ready(), {
        type: APP_ACTIONS.ADD_TRANSACTION,
        payload: { amount: 5, type: 'income' },
      });
      expect(state.transactions).toHaveLength(2);
      expect(state.transactions[0].id).toBeTruthy();
      expect(state.transactions[0].amount).toBe(5);
    });

    it('updates an existing transaction', () => {
      const state = appReducer(ready(), {
        type: APP_ACTIONS.UPDATE_TRANSACTION,
        payload: { id: 't1', amount: 99 },
      });
      expect(state.transactions[0].amount).toBe(99);
    });

    it('deletes a transaction', () => {
      const state = appReducer(ready(), {
        type: APP_ACTIONS.DELETE_TRANSACTION,
        payload: 't1',
      });
      expect(state.transactions).toHaveLength(0);
    });
  });

  describe('budgets', () => {
    it('adds, updates and deletes budgets', () => {
      let state = appReducer(ready(), {
        type: APP_ACTIONS.ADD_BUDGET,
        payload: { category: 'Transport', limit: 50 },
      });
      expect(state.budgets).toHaveLength(2);

      state = appReducer(state, {
        type: APP_ACTIONS.UPDATE_BUDGET,
        payload: { id: 'b1', limit: 250 },
      });
      expect(state.budgets.find((b) => b.id === 'b1').limit).toBe(250);

      state = appReducer(state, {
        type: APP_ACTIONS.DELETE_BUDGET,
        payload: 'b1',
      });
      expect(state.budgets.find((b) => b.id === 'b1')).toBeUndefined();
    });
  });

  describe('accounts & goals', () => {
    it('adds and deletes an account', () => {
      let state = appReducer(ready(), {
        type: APP_ACTIONS.ADD_ACCOUNT,
        payload: { name: 'Savings', type: 'savings' },
      });
      expect(state.accounts).toHaveLength(2);
      state = appReducer(state, {
        type: APP_ACTIONS.DELETE_ACCOUNT,
        payload: 'a1',
      });
      expect(state.accounts).toHaveLength(1);
    });

    it('adds, updates and deletes a goal', () => {
      let state = appReducer(ready(), {
        type: APP_ACTIONS.ADD_GOAL,
        payload: { name: 'Trip', target: 1000, saved: 0 },
      });
      expect(state.goals).toHaveLength(2);
      state = appReducer(state, {
        type: APP_ACTIONS.UPDATE_GOAL,
        payload: { id: 'g1', saved: 2000 },
      });
      expect(state.goals.find((g) => g.id === 'g1').saved).toBe(2000);
      state = appReducer(state, {
        type: APP_ACTIONS.DELETE_GOAL,
        payload: 'g1',
      });
      expect(state.goals.find((g) => g.id === 'g1')).toBeUndefined();
    });
  });
});
