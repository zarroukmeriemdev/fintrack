import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App.jsx';
import {
  renderWithProviders,
  seedAuthSession,
} from '../../test/renderWithProviders.jsx';

describe('signup flow', () => {
  it('creates an account and lands on the dashboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/signup' });

    await screen.findByRole('heading', { name: /create your account/i });
    await user.type(screen.getByLabelText(/^name$/i), 'Casey');
    await user.type(screen.getByLabelText(/email/i), 'casey@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'secret1');
    await user.type(screen.getByLabelText(/confirm password/i), 'secret1');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(
      await screen.findByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it('flags mismatched passwords', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/signup' });

    await screen.findByRole('heading', { name: /create your account/i });
    await user.type(screen.getByLabelText(/^name$/i), 'Casey');
    await user.type(screen.getByLabelText(/email/i), 'casey2@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'secret1');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });
});

describe('settings', () => {
  it('updates the profile name', async () => {
    seedAuthSession();
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/settings' });

    await screen.findByRole('heading', { name: /^profile$/i });
    const nameInput = screen.getByLabelText(/^name$/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/profile updated/i)).toBeInTheDocument();
  });

  it('adds an account from the accounts tab', async () => {
    seedAuthSession();
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/settings/accounts' });

    await screen.findByRole('heading', { name: /^accounts$/i });
    await user.type(screen.getByLabelText(/account name/i), 'Brokerage');
    await user.click(screen.getByRole('button', { name: /add account/i }));

    expect(await screen.findByText('Brokerage')).toBeInTheDocument();
  });

  it('switches the theme from the preferences tab', async () => {
    seedAuthSession();
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/settings/preferences' });

    await screen.findByRole('heading', { name: /^preferences$/i });
    await user.click(screen.getByRole('button', { name: /^dark$/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
