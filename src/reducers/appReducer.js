import { generateId } from '../utils/helpers.js';

export const APP_ACTIONS = {
  LOAD_START: 'app/loadStart',
  LOAD_SUCCESS: 'app/loadSuccess',
  LOAD_ERROR: 'app/loadError',
  RESET: 'app/reset',

  ADD_TRANSACTION: 'app/addTransaction',
  UPDATE_TRANSACTION: 'app/updateTransaction',
  DELETE_TRANSACTION: 'app/deleteTransaction',

  ADD_ACCOUNT: 'app/addAccount',
  DELETE_ACCOUNT: 'app/deleteAccount',

  ADD_BUDGET: 'app/addBudget',
  UPDATE_BUDGET: 'app/updateBudget',
  DELETE_BUDGET: 'app/deleteBudget',

  ADD_GOAL: 'app/addGoal',
  UPDATE_GOAL: 'app/updateGoal',
  DELETE_GOAL: 'app/deleteGoal',
};

export const initialAppState = {
  status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
  error: null,
  accounts: [],
  budgets: [],
  goals: [],
  transactions: [],
};

export function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.LOAD_START:
      return { ...state, status: 'loading', error: null };

    case APP_ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        status: 'ready',
        error: null,
        accounts: action.payload.accounts || [],
        budgets: action.payload.budgets || [],
        goals: action.payload.goals || [],
        transactions: action.payload.transactions || [],
      };

    case APP_ACTIONS.LOAD_ERROR:
      return { ...state, status: 'error', error: action.payload };

    case APP_ACTIONS.RESET:
      return { ...initialAppState };

    /* ----------------------------- Transactions -------------------------- */
    case APP_ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [
          { ...action.payload, id: action.payload.id || generateId('t') },
          ...state.transactions,
        ],
      };

    case APP_ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case APP_ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    /* ------------------------------- Accounts ---------------------------- */
    case APP_ACTIONS.ADD_ACCOUNT:
      return {
        ...state,
        accounts: [
          ...state.accounts,
          { ...action.payload, id: action.payload.id || generateId('acc') },
        ],
      };

    case APP_ACTIONS.DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter((a) => a.id !== action.payload),
      };

    /* ------------------------------- Budgets ----------------------------- */
    case APP_ACTIONS.ADD_BUDGET:
      return {
        ...state,
        budgets: [
          ...state.budgets,
          { ...action.payload, id: action.payload.id || generateId('bud') },
        ],
      };

    case APP_ACTIONS.UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };

    case APP_ACTIONS.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
      };

    /* -------------------------------- Goals ------------------------------ */
    case APP_ACTIONS.ADD_GOAL:
      return {
        ...state,
        goals: [
          ...state.goals,
          { ...action.payload, id: action.payload.id || generateId('goal') },
        ],
      };

    case APP_ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload } : g
        ),
      };

    case APP_ACTIONS.DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    default:
      return state;
  }
}
