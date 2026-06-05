import { createContext, useCallback, useEffect, useReducer } from 'react';
import {
  authReducer,
  initialAuthState,
  AUTH_ACTIONS,
} from '../reducers/authReducer.js';
import * as api from '../api/endpoints.js';
import {
  readStorage,
  writeStorage,
  removeStorage,
} from '../utils/localStorage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export const AuthContext = createContext(null);

/** Rehydrate a previous session from localStorage on first render. */
function lazyInit() {
  const persisted = readStorage(STORAGE_KEYS.AUTH, null);
  if (persisted?.user && persisted?.token) {
    return {
      ...initialAuthState,
      user: persisted.user,
      token: persisted.token,
      status: 'authenticated',
    };
  }
  return initialAuthState;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, lazyInit);

  // Persist auth across reloads.
  useEffect(() => {
    if (state.status === 'authenticated' && state.user) {
      writeStorage(STORAGE_KEYS.AUTH, { user: state.user, token: state.token });
    }
  }, [state.status, state.user, state.token]);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.START });
    try {
      const result = await api.login(credentials);
      dispatch({ type: AUTH_ACTIONS.SUCCESS, payload: result });
      return result.user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.FAILURE, payload: err.message });
      throw err;
    }
  }, []);

  const signup = useCallback(async (form) => {
    dispatch({ type: AUTH_ACTIONS.START });
    try {
      const result = await api.signup(form);
      dispatch({ type: AUTH_ACTIONS.SUCCESS, payload: result });
      return result.user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.FAILURE, payload: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    removeStorage(STORAGE_KEYS.AUTH);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const updateUser = useCallback((changes) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: changes });
  }, []);

  const value = {
    ...state,
    isAuthenticated: state.status === 'authenticated' && Boolean(state.user),
    login,
    signup,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
