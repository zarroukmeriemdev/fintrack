import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header.jsx';
import { Footer } from '../common/Footer.jsx';

/** Authenticated app shell: header + routed content + footer. */
export function MainLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main className="app-main" id="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
