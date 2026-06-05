# Test Report — FinTrack

## Summary

| Metric            | Value                          |
| ----------------- | ------------------------------ |
| Test runner       | Vitest + React Testing Library |
| Test files        | 21                             |
| **Total tests**   | **150 — all passing**          |
| Statement coverage | **95.08%**                    |
| Line coverage      | **95.08%**                    |
| Branch coverage    | **83.07%**                    |
| Function coverage  | **81.70%**                    |

> Coverage comfortably exceeds the 70% requirement (and the 80% "Excellent"
> rubric band). Runs are deterministic — simulated API latency is disabled in the
> test environment, so there are no timing-dependent flakes.

## How to run

```bash
npm test                 # run every test once
npm run test:watch       # watch mode for development
npm run test:coverage    # run with the full coverage report (text + HTML)
```

The HTML coverage report is written to `coverage/index.html`.

## Test breakdown

### Unit tests — pure functions (`__tests__/unit/utils/`) — 66 tests

| File                 | Tests | What it covers                                            |
| -------------------- | ----- | --------------------------------------------------------- |
| `validators.test.js` | 28    | email/password/amount/required validation, `validateForm` |
| `helpers.test.js`    | 18    | totals, grouping, monthly series, filter/sort, pagination, budget progress, CSV |
| `formatters.test.js` | 15    | currency, signed currency, dates, month keys, percent     |
| `localStorage.test.js` | 5   | read/write/remove, corrupt-JSON & quota fallbacks         |

### Unit tests — reducers (`__tests__/unit/reducers/`) — 16 tests

| File                 | Tests | What it covers                                  |
| -------------------- | ----- | ----------------------------------------------- |
| `appReducer.test.js` | 9     | load lifecycle, reset, transaction/budget/account/goal CRUD |
| `authReducer.test.js`| 7     | start/success/failure/logout/clear/update flows |

### Unit tests — custom hooks (`__tests__/unit/hooks/`) — 17 tests

| File                       | Tests | What it covers                                |
| -------------------------- | ----- | --------------------------------------------- |
| `useFormValidation.test.js`| 6     | change/blur validation, `validateAll`, reset  |
| `useFetch.test.js`         | 4     | immediate run, error capture, lazy run, abort signal |
| `useLocalStorage.test.js`  | 4     | init, rehydrate, persist, functional updates  |
| `useDebounce.test.js`      | 3     | initial value, delayed update, timer reset    |

### Unit tests — API layer (`__tests__/unit/api/`) — 13 tests

| File               | Tests | What it covers                                          |
| ------------------ | ----- | ------------------------------------------------------- |
| `endpoints.test.js`| 7     | login/signup success & errors, data seed/persist/guard  |
| `client.test.js`   | 6     | resolve, ApiError wrapping, abort (pre & in-flight), cache |

### Component tests (`__tests__/unit/components/`) — 23 tests

| File              | Tests | What it covers                                           |
| ----------------- | ----- | ------------------------------------------------------- |
| `widgets.test.jsx`| 9     | ProgressBar, Pagination, StatCard, GoalCard, BudgetCard, TransactionRow |
| `Button.test.jsx` | 6     | rendering, default type, variants, click, `as`, disabled |
| `Input.test.jsx`  | 4     | label association, error/ARIA, hint, select mode         |
| `Modal.test.jsx`  | 4     | closed/open, dialog role, close button, Escape           |

### Integration tests (`__tests__/integration/`) — 15 tests

| File                          | Tests | Workflow covered                                       |
| ----------------------------- | ----- | ------------------------------------------------------ |
| `settingsAndSignup.test.jsx`  | 5     | signup → dashboard, password mismatch, profile/account/theme updates |
| `auth.test.jsx`               | 3     | protected-route redirect, demo login → dashboard, invalid email |
| `routing.test.jsx`            | 3     | public landing, 404 fallback, nested settings route    |
| `transactions.test.jsx`       | 2     | list seeded data + add transaction, search filtering   |
| `budgetsAndReports.test.jsx`  | 2     | budgets list + add, reports KPIs & category table      |

## Testing strategy

- **Unit first:** all framework-independent logic (`utils/`, `reducers/`) is
  exhaustively tested in isolation — fast and high signal.
- **Hooks** are tested with `renderHook` (fake timers for debounce, abort-signal
  assertions for fetch).
- **Components** are tested through the user-facing DOM (roles, labels, text) per
  Testing Library guidance, including accessibility attributes.
- **Integration** tests drive the **whole app** (router + all providers + lazy
  routes) the way a user would — typing, clicking, navigating — to verify real
  workflows end to end.
- **The API is "mocked" by design:** the app's data layer is a deterministic
  in-memory/`localStorage` backend, so tests exercise real loading/error/caching
  code paths without network access. `localStorage` is cleared between tests for
  isolation.

## Notes

- The course brief references Jest; Vitest is used here with a Jest-compatible
  API. The assertions (`describe`/`it`/`expect`, `@testing-library/jest-dom`
  matchers) read identically to Jest.
