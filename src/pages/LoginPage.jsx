import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/features/Auth/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <LoginForm />;
}
