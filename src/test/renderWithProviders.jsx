import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import { AppProvider } from '../contexts/AppContext.jsx';

/**
 * Render a component wrapped in the full provider tree and a MemoryRouter.
 * Pass `route` to set the initial URL, or `withApp: false` to skip AppProvider
 * (useful when a test does not need the finance dataset).
 */
export function renderWithProviders(
  ui,
  { route = '/', withApp = true, ...options } = {}
) {
  function Wrapper({ children }) {
    const tree = (
      <ThemeProvider>
        <AuthProvider>
          {withApp ? <AppProvider>{children}</AppProvider> : children}
        </AuthProvider>
      </ThemeProvider>
    );
    return <MemoryRouter initialEntries={[route]}>{tree}</MemoryRouter>;
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

/** Seed an authenticated session in localStorage before rendering. */
export function seedAuthSession(
  user = {
    id: 'user_test',
    name: 'Tester',
    email: 'tester@example.com',
    currency: 'USD',
  }
) {
  localStorage.setItem(
    'fintrack.auth',
    JSON.stringify({ user, token: 'test-token' })
  );
  return user;
}
