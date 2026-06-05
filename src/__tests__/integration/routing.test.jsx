import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../../App.jsx';
import {
  renderWithProviders,
  seedAuthSession,
} from '../../test/renderWithProviders.jsx';

describe('routing', () => {
  it('renders the public landing page at /', async () => {
    renderWithProviders(<App />, { route: '/' });
    expect(
      await screen.findByRole('heading', {
        name: /take control of your money/i,
      })
    ).toBeInTheDocument();
  });

  it('shows the 404 page for unknown routes', async () => {
    seedAuthSession();
    renderWithProviders(<App />, { route: '/this/does/not/exist' });
    expect(
      await screen.findByRole('heading', { name: /page not found/i })
    ).toBeInTheDocument();
  });

  it('renders nested settings routes for an authenticated user', async () => {
    seedAuthSession();
    renderWithProviders(<App />, { route: '/settings/accounts' });
    expect(
      await screen.findByRole('heading', { name: /^accounts$/i })
    ).toBeInTheDocument();
  });
});
