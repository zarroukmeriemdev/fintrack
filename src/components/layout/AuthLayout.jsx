import { Outlet } from 'react-router-dom';
import { Brand } from '../common/Brand.jsx';

/** Centered shell for login / signup screens. */
export function AuthLayout() {
  return (
    <div className="auth-screen">
      <div className="auth-card card">
        <div className="auth-card__brand">
          <Brand to={null} />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
