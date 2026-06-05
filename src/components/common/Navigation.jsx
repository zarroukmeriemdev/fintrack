import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../utils/constants.js';

const LINKS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.TRANSACTIONS, label: 'Transactions' },
  { to: ROUTES.BUDGETS, label: 'Budgets' },
  { to: ROUTES.REPORTS, label: 'Reports' },
  { to: ROUTES.SETTINGS, label: 'Settings' },
];

/** Primary in-app navigation. `isOpen` controls the mobile dropdown. */
export function Navigation({ isOpen, onNavigate }) {
  return (
    <nav className="app-nav" data-open={isOpen} aria-label="Primary">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
