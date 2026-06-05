import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout.jsx';
import { AuthLayout } from './components/layout/AuthLayout.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { ErrorBoundary } from './components/errorBoundary/ErrorBoundary.jsx';
import { Loading } from './components/common/Loading.jsx';
import { ROUTES } from './utils/constants.js';

// Route-level code splitting: each page is its own lazily-loaded chunk.
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage.jsx'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage.jsx'));
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage.jsx'));
const ProfileSettings = lazy(
  () => import('./pages/settings/ProfileSettings.jsx')
);
const AccountsSettings = lazy(
  () => import('./pages/settings/AccountsSettings.jsx')
);
const PreferencesSettings = lazy(
  () => import('./pages/settings/PreferencesSettings.jsx')
);
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading label="Loading…" />}>
        <Routes>
          {/* Public */}
          <Route path={ROUTES.HOME} element={<HomePage />} />

          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          </Route>

          {/* Protected app */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
            <Route path={ROUTES.BUDGETS} element={<BudgetsPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

            {/* Nested routes under /settings */}
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />}>
              <Route index element={<ProfileSettings />} />
              <Route path="accounts" element={<AccountsSettings />} />
              <Route path="preferences" element={<PreferencesSettings />} />
            </Route>
          </Route>

          {/* Fallbacks */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
