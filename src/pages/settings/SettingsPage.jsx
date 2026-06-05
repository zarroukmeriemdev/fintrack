import { NavLink, Outlet } from 'react-router-dom';

const SUB_LINKS = [
  { to: '/settings', label: 'Profile', end: true },
  { to: '/settings/accounts', label: 'Accounts' },
  { to: '/settings/preferences', label: 'Preferences' },
];

/** Settings layout: a sub-navigation plus the active nested route. */
export default function SettingsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, accounts, and app preferences.</p>
        </div>
      </div>

      <nav className="subnav" aria-label="Settings sections">
        {SUB_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="card">
        <Outlet />
      </div>
    </div>
  );
}
