import { request, ApiError, clearCache } from './client.js';
import { readStorage, writeStorage } from '../utils/localStorage.js';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants.js';
import { DEMO_USER, buildSeedState } from './mocks/seedData.js';
import { generateId } from '../utils/helpers.js';

/**
 * The "database" lives in localStorage under a per-feature key.
 * These functions read/write it and are the only place that touches it.
 */

const USERS_KEY = 'fintrack.users';

function readUsers() {
  const users = readStorage(USERS_KEY, null);
  if (!users) {
    // Seed the demo account on first run.
    const seeded = [DEMO_USER];
    writeStorage(USERS_KEY, seeded);
    return seeded;
  }
  return users;
}

function persistUsers(users) {
  writeStorage(USERS_KEY, users);
}

function stripPassword(user) {
  const { password: _password, ...safe } = user;
  return safe;
}

/* ----------------------------- Auth endpoints ---------------------------- */

export function login({ email, password }, opts = {}) {
  return request(
    'auth/login',
    () => {
      const users = readUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === String(email).toLowerCase()
      );
      if (!found || found.password !== password) {
        throw new ApiError('Invalid email or password.', {
          status: 401,
          code: 'UNAUTHORIZED',
        });
      }
      return { user: stripPassword(found), token: generateId('token') };
    },
    opts
  );
}

export function signup({ name, email, password }, opts = {}) {
  return request(
    'auth/signup',
    () => {
      const users = readUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === String(email).toLowerCase()
      );
      if (exists) {
        throw new ApiError('An account with this email already exists.', {
          status: 409,
          code: 'CONFLICT',
        });
      }
      const newUser = {
        id: generateId('user'),
        name,
        email,
        password,
        currency: 'USD',
      };
      persistUsers([...users, newUser]);
      return { user: stripPassword(newUser), token: generateId('token') };
    },
    opts
  );
}

/* --------------------------- Finance data endpoints ---------------------- */

function userDataKey(userId) {
  return `${STORAGE_KEYS.STATE}.${userId}`;
}

/** Fetch a user's full finance dataset, seeding it on first access. */
export function fetchUserData(userId, opts = {}) {
  return request(
    `data/${userId}`,
    () => {
      if (!userId) {
        throw new ApiError(ERROR_MESSAGES.UNAUTHORIZED, {
          status: 401,
          code: 'UNAUTHORIZED',
        });
      }
      let data = readStorage(userDataKey(userId), null);
      if (!data) {
        data = buildSeedState();
        writeStorage(userDataKey(userId), data);
      }
      return data;
    },
    { ...opts, cache: true }
  );
}

/** Persist the full dataset (write-through). Clears the GET cache. */
export function saveUserData(userId, data, opts = {}) {
  return request(
    `data/${userId}/save`,
    () => {
      if (!userId) {
        throw new ApiError(ERROR_MESSAGES.UNAUTHORIZED, {
          status: 401,
          code: 'UNAUTHORIZED',
        });
      }
      writeStorage(userDataKey(userId), data);
      clearCache();
      return { ok: true };
    },
    opts
  );
}
