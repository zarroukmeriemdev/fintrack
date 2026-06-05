import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App.jsx';
import {
  renderWithProviders,
  seedAuthSession,
} from '../../test/renderWithProviders.jsx';

describe('budgets page', () => {
  it('shows seeded budgets and adds a new one', async () => {
    seedAuthSession();
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/budgets' });

    expect(
      await screen.findByRole('heading', { name: /budgets/i })
    ).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Housing' });

    await user.click(screen.getByRole('button', { name: /add budget/i }));
    const dialog = await screen.findByRole('dialog', { name: /add budget/i });
    await user.type(within(dialog).getByLabelText(/monthly limit/i), '120');
    await user.click(
      within(dialog).getByRole('button', { name: /add budget/i })
    );

    // A new budget card heading appears (a category not already budgeted).
    await screen.findByText(/spent of/i);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('reports page', () => {
  it('renders KPIs and a category breakdown table', async () => {
    seedAuthSession();
    renderWithProviders(<App />, { route: '/reports' });

    expect(
      await screen.findByRole('heading', { name: /reports/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: /spending by category/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/savings rate/i)).toBeInTheDocument();
  });
});
