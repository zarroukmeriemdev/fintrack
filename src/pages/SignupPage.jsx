import { Navigate } from 'react-router-dom';
import { SignupForm } from '../components/features/Auth/SignupForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../utils/constants.js';

export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <SignupForm />;
}
