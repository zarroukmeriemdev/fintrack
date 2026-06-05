export const AUTH_ACTIONS = {
  START: 'auth/start',
  SUCCESS: 'auth/success',
  FAILURE: 'auth/failure',
  LOGOUT: 'auth/logout',
  CLEAR_ERROR: 'auth/clearError',
  UPDATE_USER: 'auth/updateUser',
};

export const initialAuthState = {
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'error'
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.START:
      return { ...state, status: 'loading', error: null };
    case AUTH_ACTIONS.SUCCESS:
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case AUTH_ACTIONS.FAILURE:
      return { ...state, status: 'error', error: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialAuthState };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}
