import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input } from '../../common/Input.jsx';
import { Button } from '../../common/Button.jsx';
import { useFormValidation } from '../../../hooks/useFormValidation.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { validateEmail, validatePassword } from '../../../utils/validators.js';
import { ROUTES } from '../../../utils/constants.js';
import { DEMO_USER } from '../../../api/mocks/seedData.js';

const schema = { email: validateEmail, password: validatePassword };

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, status } = useAuth();
  const redirectTo = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    setFieldValue,
  } = useFormValidation({ email: '', password: '' }, schema);

  const submitting = status === 'loading';

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    if (!validateAll()) return;
    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch {
      /* error is surfaced via auth context */
    }
  };

  const fillDemo = () => {
    setFieldValue('email', DEMO_USER.email);
    setFieldValue('password', DEMO_USER.password);
  };

  return (
    <>
      <h1>Welcome back</h1>
      <p>Sign in to your FinTrack account.</p>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
        />
        <Button type="submit" block disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <Button variant="ghost" size="sm" block onClick={fillDemo}>
        Use demo account
      </Button>

      <p className="auth-switch">
        New to FinTrack? <Link to={ROUTES.SIGNUP}>Create an account</Link>
      </p>
    </>
  );
}
