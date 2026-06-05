import { Link } from 'react-router-dom';
import { Brand } from '../components/common/Brand.jsx';
import { Button } from '../components/common/Button.jsx';
import { ThemeToggle } from '../components/common/ThemeToggle.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

const FEATURES = [
  {
    title: 'Track every transaction',
    body: 'Log income and expenses, categorise them, and search instantly.',
  },
  {
    title: 'Budgets that keep you honest',
    body: 'Set monthly limits per category and watch progress in real time.',
  },
  {
    title: 'See where money goes',
    body: 'Interactive charts reveal spending trends and category breakdowns.',
  },
  {
    title: 'Yours, offline',
    body: 'Data is saved locally so your dashboard works without a connection.',
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      <header className="landing__nav container">
        <Brand to={null} />
        <div className="header-actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button as={Link} to={ROUTES.DASHBOARD} size="sm">
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to={ROUTES.LOGIN} variant="secondary" size="sm">
                Sign in
              </Button>
              <Button as={Link} to={ROUTES.SIGNUP} size="sm">
                Get started
              </Button>
            </>
          )}
        </div>
      </header>

      <section className="landing__hero container">
        <h1>Take control of your money.</h1>
        <p className="landing__lead">
          FinTrack is a personal finance dashboard for tracking income,
          expenses, budgets, and savings goals — all in one clean, fast place.
        </p>
        <div className="header-actions">
          <Button
            as={Link}
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.SIGNUP}
          >
            {isAuthenticated ? 'Open dashboard' : 'Start for free'}
          </Button>
          {!isAuthenticated && (
            <Button as={Link} to={ROUTES.LOGIN} variant="secondary">
              I already have an account
            </Button>
          )}
        </div>
      </section>

      <section className="landing__features container">
        {FEATURES.map((f) => (
          <div className="card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
