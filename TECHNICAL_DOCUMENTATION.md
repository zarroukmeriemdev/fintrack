# Technical Documentation — FinTrack

## 1. Architecture overview

FinTrack is a client-side single-page application. It is intentionally
**backend-agnostic**: all data access goes through a small API layer
(`src/api/`) that currently persists to `localStorage` but is shaped like a real
network client, so it can be swapped for Firebase/Supabase/REST without touching
the UI.

```
┌─────────────────────────────────────────────────────────────┐
│                          UI (pages)                          │
│   Home · Login · Signup · Dashboard · Transactions ·         │
│   Budgets · Reports · Settings/* · NotFound                  │
└───────────────┬─────────────────────────────┬───────────────┘
                │ consume via hooks            │
        ┌───────▼────────┐            ┌────────▼─────────┐
        │   Contexts     │            │  Feature/common  │
        │ Auth · Theme · │            │   components      │
        │     App        │            └──────────────────┘
        └───────┬────────┘
                │ dispatch → reducers (auth, app)
        ┌───────▼────────┐
        │   API layer    │  request(): latency, AbortController,
        │ client+endpoints│  timeout, ApiError, TTL cache
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │  localStorage  │  per-user dataset + users + theme + session
        └────────────────┘
```

**Layering rules**

- Pages and components never touch `localStorage` directly — they go through
  contexts/hooks, which go through the API layer, which is the only module that
  reads/writes storage.
- Pure logic (totals, grouping, filtering, CSV) lives in `utils/` and is framework
  independent and fully unit-tested.

## 2. Data models

```js
User        { id, email, name, currency }            // password kept server-side only
Account     { id, name, type }                        // type: checking|savings|credit|cash
Transaction { id, type, category, account,            // type: income|expense
              description, amount, date }              // date: 'YYYY-MM-DD'
Budget      { id, category, limit }                    // monthly limit per category
Goal        { id, name, target, saved }
```

Per-user finance data is stored under `fintrack.appState.<userId>` and has the
shape `{ accounts, budgets, goals, transactions }`. Users are stored under
`fintrack.users`, the active session under `fintrack.auth`, and the theme under
`fintrack.theme`.

## 3. API endpoints (mock)

The mock client (`api/client.js`) wraps every call with simulated latency,
`AbortController` cancellation, an 8s timeout, a typed `ApiError`, and an
optional TTL cache. `api/endpoints.js` exposes:

| Function                       | Purpose                                  | Notes                       |
| ------------------------------ | ---------------------------------------- | --------------------------- |
| `login({ email, password })`   | Authenticate, returns `{ user, token }`  | 401 on bad credentials      |
| `signup({ name,email,pass })`  | Register, returns `{ user, token }`      | 409 on duplicate email      |
| `fetchUserData(userId)`        | Load `{accounts,budgets,goals,txns}`     | seeds on first access, cached |
| `saveUserData(userId, data)`   | Write-through persist                     | invalidates the GET cache   |

Swapping to a real backend means re-implementing these four functions; the rest
of the app is unchanged.

## 4. State management design

Three contexts, each backed by `useReducer` or persisted state:

- **AuthContext** (`authReducer`) — session lifecycle
  (`idle→loading→authenticated|error`), persisted to `localStorage` and
  rehydrated on load via a lazy initializer. Exposes `login`, `signup`,
  `logout`, `updateUser`, `clearError`.
- **ThemeContext** — light/dark, initialised from `prefers-color-scheme`,
  persisted, and applied via `data-theme` on `<html>`.
- **AppContext** (`appReducer`) — the finance dataset and all CRUD actions. It:
  1. loads the signed-in user's data when auth changes (cancelling stale loads),
  2. **write-through persists** any change back through the API (skipping the
     initial load to avoid a redundant write), and
  3. exposes stable, memoised action creators so consumers don't re-render
     unnecessarily.

**Avoiding prop drilling:** cross-cutting state (auth, theme, finance data) is
read through hooks (`useAuth`, `useTheme`, `useApp`) anywhere in the tree. Local,
view-specific state (filters, pagination, modal open/close) stays in the
component that owns it.

## 5. Routing

React Router v6 with three groups:

- **Public:** `/` (landing).
- **Auth layout:** `/login`, `/signup` (redirect to `/dashboard` if already
  authenticated).
- **Protected (`<ProtectedRoute>` + `MainLayout`):** `/dashboard`,
  `/transactions`, `/budgets`, `/reports`, and **nested** `/settings` →
  `index` (profile), `/settings/accounts`, `/settings/preferences`.
- **404:** unknown paths redirect to `/404` (`NotFoundPage`).

`ProtectedRoute` preserves the attempted location in router state so users return
to it after signing in.

## 6. Performance optimizations

- **Code splitting:** every page is `React.lazy()`-loaded behind `<Suspense>`;
  Recharts and React Router are split into their own vendor chunks
  (`vite.config.js` `manualChunks`). The initial route does not pay for the
  charting library.
- **Memoisation:** expensive derivations (totals, grouping, monthly series,
  filtering) are wrapped in `useMemo`; list rows and charts are `React.memo`;
  context action creators are `useCallback`-stable.
- **Debounced search** (`useDebounce`) keeps typing smooth on large lists.
- **Request hygiene:** `useFetch`/`AppContext` cancel in-flight requests via
  `AbortController` on unmount or re-fetch; the API layer caches GET responses.

## 7. Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), a skip link,
  and labelled regions.
- All inputs are label-associated; errors use `role="alert"` and
  `aria-invalid` / `aria-describedby`.
- Modal: focus moved in on open and restored on close, `Escape` to close,
  `role="dialog"` + `aria-modal`, body scroll lock.
- Visible focus rings, `aria-pressed` toggles, progress bars expose
  `aria-valuenow`, and `prefers-reduced-motion` disables animation.

## 8. Key design decisions

- **localStorage-backed mock API instead of a real backend** — keeps the project
  self-contained and deployable as a static site while still exercising real
  async/error/loading/caching patterns. The API boundary makes a future backend
  a drop-in.
- **Vitest over Jest** — native to Vite, Jest-compatible API, fast.
- **Plain CSS with design tokens** — a small, dependency-free design system
  (`variables.css`) that powers theming via CSS custom properties.

## 9. Known limitations

- Data is per-browser (no cross-device sync) and not encrypted — appropriate for
  a demo, not real financial data.
- "Passwords" are stored in `localStorage` for the mock auth only; this is **not**
  secure and must be replaced by a real auth provider for production.
- Budgets are treated as monthly and compared against all-time category spend in
  some summaries; multi-period budgeting is a future enhancement.
- No real-time multi-user collaboration (out of scope for Option E).
