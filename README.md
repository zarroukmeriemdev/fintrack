# FinTrack — Personal Finance Dashboard

A production-ready personal finance dashboard built with React. Track income and
expenses, set category budgets, monitor savings goals, and visualise spending
trends — all in a fast, accessible, responsive single-page app.

> **Capstone project** for the Full-Stack React course (Lab ALL-IN-ONE).
> Implements **Option E — Personal Finance Dashboard** and integrates every
> concept from Labs 1–5: components & props, state & events, `useEffect` /
> Context / routing, API integration with error handling & caching, and
> professional patterns with `useReducer`, testing, and mocking.

---

## Problem solved

Most people don't have a clear, real-time picture of where their money goes.
FinTrack gives you one place to record every transaction, compare spending
against budgets, and see trends over time — without spreadsheets and without
handing your financial data to a third party (everything is stored locally in
your browser).

## Target users

Individuals and households who want a lightweight, private money tracker:
budget-conscious students, freelancers with irregular income, and anyone who
wants to build better spending habits.

## Key features

- 🔐 **Authentication** — sign up / log in, protected routes, persisted session
  (a demo account is provided).
- 💸 **Transactions** — full CRUD, with search, type/category/month filters,
  sorting, and pagination.
- 📊 **Budgets** — per-category monthly limits with live spend-vs-limit progress
  and over-budget warnings.
- 📈 **Reports** — interactive charts (income vs. expense, category breakdown),
  per-period analysis, and a savings-rate KPI.
- 🎯 **Savings goals** — track progress toward targets.
- 🏦 **Accounts** — manage multiple accounts (checking, savings, credit, cash).
- ⬇️ **CSV export** — download your (filtered) transactions.
- 🌗 **Dark / light theme** — respects system preference, remembers your choice.
- 📴 **Offline-friendly** — data persists in `localStorage`; works without a
  backend.
- ♿ **Accessible & responsive** — semantic HTML, ARIA, keyboard navigation,
  mobile → desktop layouts.

## Tech stack

| Area         | Choice                                             |
| ------------ | -------------------------------------------------- |
| UI           | React 18                                           |
| Routing      | React Router v6 (nested + protected routes)        |
| State        | Context API + `useReducer` + `localStorage`        |
| Data         | Mock API layer over `localStorage` (backend-ready) |
| Charts       | Recharts                                           |
| Dates        | date-fns                                           |
| Build        | Vite                                               |
| Testing      | Vitest + React Testing Library (jsdom)             |
| Code quality | ESLint + Prettier                                  |
| Hosting      | Vercel / Netlify (config included)                 |

> **Note on tooling:** the course brief lists Jest; this project uses **Vitest**,
> which exposes a Jest-compatible API (`describe`/`it`/`expect`) and is the
> idiomatic test runner for Vite. No test code changes are needed to read it as
> Jest-style tests.

---

## Getting started

### Prerequisites

- Node.js 18+ and npm

### Run locally

```bash
git clone <your-repo-url>
cd fintrack
npm install
npm start            # or: npm run dev  → http://localhost:5173
```

### Demo account

```
email:    demo@fintrack.app
password: demo123
```

On the login screen you can also click **“Use demo account”** to auto-fill these
credentials. (You can register a fresh account at any time — each account gets
its own seeded dataset.)

### Run tests

```bash
npm test                 # run the full suite once
npm run test:watch       # watch mode
npm run test:coverage    # run with a coverage report
```

### Lint & format

```bash
npm run lint             # ESLint (zero warnings enforced)
npm run format           # Prettier (write)
```

### Production build

```bash
npm run build            # outputs to dist/
npm run preview          # serve the production build locally
```

---

## Deployment

The app is a static SPA and ships with config for both major free hosts:

- **Vercel** — `vercel.json` (framework preset + SPA rewrite). Import the repo or
  run `vercel`.
- **Netlify** — `netlify.toml` (build command, publish dir, SPA redirect).
  Connect the repo and it auto-deploys on push.

Both configs route all paths to `index.html` so client-side deep links (e.g.
`/dashboard`, `/settings/accounts`) work on refresh.

**Live URL:** https://fintrack-capstone-app.netlify.app

(Use the demo account above, or register a new one.)

---

## Project structure

```
src/
├── api/            # mock client (latency, cancel, timeout, cache) + endpoints
├── components/
│   ├── common/     # Button, Input, Modal, Header, Navigation, ProtectedRoute…
│   ├── layout/     # MainLayout, AuthLayout
│   ├── features/   # Auth, Dashboard, transactions, budgets, goals, charts
│   └── errorBoundary/
├── contexts/       # AuthContext, ThemeContext, AppContext
├── hooks/          # useAuth, useTheme, useApp, useFetch, useDebounce,
│                   #   useLocalStorage, useFormValidation
├── pages/          # Home, Login, Signup, Dashboard, Transactions, Budgets,
│                   #   Reports, settings/*, NotFound
├── reducers/       # authReducer, appReducer
├── utils/          # constants, validators, formatters, helpers, localStorage
├── styles/         # design tokens + global / component / layout / page CSS
├── test/           # test utilities (renderWithProviders)
└── __tests__/      # unit + integration tests
```

See [`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md) for architecture
details and [`TEST_REPORT.md`](./TEST_REPORT.md) for the testing summary.

## Screenshots

> _Add screenshots here (homepage, dashboard, transactions, budgets, reports,
> mobile view, dark mode, Lighthouse report, test output)._

## License

Built for educational purposes as a course capstone.
