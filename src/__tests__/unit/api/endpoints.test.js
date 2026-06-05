import { describe, it, expect } from 'vitest';
import {
  login,
  signup,
  fetchUserData,
  saveUserData,
} from '../../../api/endpoints.js';
import { DEMO_USER } from '../../../api/mocks/seedData.js';

describe('auth endpoints', () => {
  it('logs in the demo user with valid credentials', async () => {
    const result = await login({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });
    expect(result.user.email).toBe(DEMO_USER.email);
    expect(result.user).not.toHaveProperty('password');
    expect(result.token).toBeTruthy();
  });

  it('rejects invalid credentials', async () => {
    await expect(
      login({ email: DEMO_USER.email, password: 'wrong' })
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('creates a new account', async () => {
    const result = await signup({
      name: 'New Person',
      email: 'new.person@example.com',
      password: 'secret1',
    });
    expect(result.user.email).toBe('new.person@example.com');
    expect(result.user.id).toBeTruthy();
  });

  it('rejects a duplicate email', async () => {
    await expect(
      signup({ name: 'Dup', email: DEMO_USER.email, password: 'secret1' })
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
});

describe('finance data endpoints', () => {
  it('seeds and returns data for a new user', async () => {
    const data = await fetchUserData('user_xyz');
    expect(data).toHaveProperty('transactions');
    expect(data.transactions.length).toBeGreaterThan(0);
    expect(data).toHaveProperty('budgets');
    expect(data).toHaveProperty('accounts');
  });

  it('persists and reloads changes', async () => {
    await fetchUserData('user_save');
    await saveUserData('user_save', {
      accounts: [],
      budgets: [],
      goals: [],
      transactions: [{ id: 'only', amount: 1, type: 'income' }],
    });
    const reloaded = await fetchUserData('user_save');
    expect(reloaded.transactions).toHaveLength(1);
    expect(reloaded.transactions[0].id).toBe('only');
  });

  it('rejects when no user id is supplied', async () => {
    await expect(fetchUserData('')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });
});
