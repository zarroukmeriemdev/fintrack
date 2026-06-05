import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  appReducer,
  initialAppState,
  APP_ACTIONS,
} from '../reducers/appReducer.js';
import * as api from '../api/endpoints.js';
import { isAbortError } from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // Skip persisting the dataset we just loaded (avoids a redundant write).
  const skipPersistRef = useRef(true);

  // Load (or reset) the dataset whenever the signed-in user changes.
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      dispatch({ type: APP_ACTIONS.RESET });
      return;
    }

    const controller = new AbortController();
    skipPersistRef.current = true;
    dispatch({ type: APP_ACTIONS.LOAD_START });

    api
      .fetchUserData(user.id, { signal: controller.signal })
      .then((data) =>
        dispatch({ type: APP_ACTIONS.LOAD_SUCCESS, payload: data })
      )
      .catch((err) => {
        if (isAbortError(err)) return;
        dispatch({
          type: APP_ACTIONS.LOAD_ERROR,
          payload: err?.message || ERROR_MESSAGES.GENERIC,
        });
      });

    return () => controller.abort();
  }, [isAuthenticated, user?.id]);

  // Write-through persistence: save the dataset back whenever it changes.
  useEffect(() => {
    if (state.status !== 'ready' || !user?.id) return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    api
      .saveUserData(user.id, {
        accounts: state.accounts,
        budgets: state.budgets,
        goals: state.goals,
        transactions: state.transactions,
      })
      .catch(() => {
        /* localStorage write-through; surfaced errors are non-fatal here */
      });
  }, [
    state.status,
    state.accounts,
    state.budgets,
    state.goals,
    state.transactions,
    user?.id,
  ]);

  // Action creators — stable identities so consumers can memoise safely.
  const addTransaction = useCallback(
    (tx) => dispatch({ type: APP_ACTIONS.ADD_TRANSACTION, payload: tx }),
    []
  );
  const updateTransaction = useCallback(
    (tx) => dispatch({ type: APP_ACTIONS.UPDATE_TRANSACTION, payload: tx }),
    []
  );
  const deleteTransaction = useCallback(
    (id) => dispatch({ type: APP_ACTIONS.DELETE_TRANSACTION, payload: id }),
    []
  );
  const addAccount = useCallback(
    (acc) => dispatch({ type: APP_ACTIONS.ADD_ACCOUNT, payload: acc }),
    []
  );
  const deleteAccount = useCallback(
    (id) => dispatch({ type: APP_ACTIONS.DELETE_ACCOUNT, payload: id }),
    []
  );
  const addBudget = useCallback(
    (b) => dispatch({ type: APP_ACTIONS.ADD_BUDGET, payload: b }),
    []
  );
  const updateBudget = useCallback(
    (b) => dispatch({ type: APP_ACTIONS.UPDATE_BUDGET, payload: b }),
    []
  );
  const deleteBudget = useCallback(
    (id) => dispatch({ type: APP_ACTIONS.DELETE_BUDGET, payload: id }),
    []
  );
  const addGoal = useCallback(
    (g) => dispatch({ type: APP_ACTIONS.ADD_GOAL, payload: g }),
    []
  );
  const updateGoal = useCallback(
    (g) => dispatch({ type: APP_ACTIONS.UPDATE_GOAL, payload: g }),
    []
  );
  const deleteGoal = useCallback(
    (id) => dispatch({ type: APP_ACTIONS.DELETE_GOAL, payload: id }),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addAccount,
      deleteAccount,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
    }),
    [
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addAccount,
      deleteAccount,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
