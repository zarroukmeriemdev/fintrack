import { describe, it, expect } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App.jsx';
import {
  renderWithProviders,
  seedAuthSession,
} from '../../test/renderWithProviders.jsx';

describe('transactions workflow', () => {
  it('lists seeded transactions and supports adding a new one', async () => {
    seedAuthSession();
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/transactions' });

    // Seed data loads asynchronously.
    expect(
      await screen.findByRole('heading', { name: /transactions/i })
    ).toBeInTheDocument();
    await screen.findByText('Rent');

    // Open the add-transaction modal.
    await user.click(screen.getByRole('button', { name: /add transaction/i }));
    const dialog = await screen.findByRole('dialog', {
      name: /add transaction/i,
    });

    // Fill the form.
    await user.type(
      within(dialog).getByLabelText(/description/i),
      'Coffee beans'
    );
    await user.type(within(dialog).getByLabelText(/amount/i), '18');
    await user.selectOptions(
      within(dialog).getByLabelText(/category/i),
      'Groceries'
    );
    await user.click(
      within(dialog).getByRole('button', { name: /add transaction/i })
    );

    // The new transaction appears in the table.
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(await screen.findByText('Coffee beans')).toBeInTheDocument();
  });

  it('filters transactions by search term', async () => {
    seedAuthSession();
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: '/transactions' });

    await screen.findByText('Rent');
    await user.type(screen.getByLabelText(/search/i), 'salary');

    await waitFor(() =>
      expect(screen.queryByText('Rent')).not.toBeInTheDocument()
    );
    expect(screen.getAllByText(/monthly salary/i).length).toBeGreaterThan(0);
  });
});
