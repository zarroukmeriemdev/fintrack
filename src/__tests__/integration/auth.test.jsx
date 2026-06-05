import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App.jsx';
import { renderWithProviders } from '../../test/renderWithProviders.jsx';

describe('authentication flow', () => {
  it('redirects unauthenticated users from a protected route to login', async () => {
    renderWithProviders(<App />, { route: '/dashboard' });
    expect(
      await screen.findByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument();
  });

  it('logs in with the demo account and lands on the dashboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/login' });

    await screen.findByRole('heading', { name: /welcome back/i });
    await user.click(screen.getByRole('button', { name: /use demo account/i }));
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(
      await screen.findByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it('shows a validation error for an invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/login' });

    await screen.findByRole('heading', { name: /welcome back/i });
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(
      await screen.findByText(/enter a valid email address/i)
    ).toBeInTheDocument();
  });
});
