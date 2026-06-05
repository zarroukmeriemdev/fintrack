import { useState } from 'react';
import { Brand } from './Brand.jsx';
import { Navigation } from './Navigation.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button } from './Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

/** App header: brand, primary navigation, theme toggle, and logout. */
export function Header() {
  const { user, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <Brand />
        <button
          type="button"
          className="icon-btn nav-toggle"
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation menu"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <div className="app-header__spacer" />

        <div id="primary-navigation">
          <Navigation isOpen={navOpen} onNavigate={() => setNavOpen(false)} />
        </div>

        <div className="header-actions">
          <span className="user-chip">{user?.name || user?.email}</span>
          <ThemeToggle />
          <Button variant="secondary" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
