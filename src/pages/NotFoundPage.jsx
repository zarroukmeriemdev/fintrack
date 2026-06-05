import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const home = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME;
  return (
    <div className="container notfound">
      <p className="notfound__code">404</p>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Button as={Link} to={home}>
        Go back home
      </Button>
    </div>
  );
}
