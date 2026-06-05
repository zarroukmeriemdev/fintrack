import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../common/Input.jsx';
import { Button } from '../../common/Button.jsx';
import { useFormValidation } from '../../../hooks/useFormValidation.js';
import { useAuth } from '../../../hooks/useAuth.js';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePasswordMatch,
} from '../../../utils/validators.js';
import { ROUTES } from '../../../utils/constants.js';

const schema = {
  name: validateRequired,
  email: validateEmail,
  password: validatePassword,
  confirm: (value, all) => validatePasswordMatch(all.password, value),
};

export function SignupForm() {
  const navigate = useNavigate();
  const { signup, error, clearError, status } = useAuth();

  const { values, errors, handleChange, handleBlur, validateAll } =
    useFormValidation(
      { name: '', email: '', password: '', confirm: '' },
      schema
    );

  const submitting = status === 'loading';

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    if (!validateAll()) return;
    try {
      await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      /* error surfaced via auth context */
    }
  };

  return (
    <>
      <h1>Create your account</h1>
      <p>Start tracking your finances in minutes.</p>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
        />
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
          autoComplete="new-password"
          hint="At least 6 characters"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirm}
        />
        <Button type="submit" block disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </>
  );
}
