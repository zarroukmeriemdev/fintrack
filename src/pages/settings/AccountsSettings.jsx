import { useState } from 'react';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { useApp } from '../../hooks/useApp.js';
import { useFormValidation } from '../../hooks/useFormValidation.js';
import { validateRequired } from '../../utils/validators.js';
import { ACCOUNT_TYPES } from '../../utils/constants.js';
import { capitalize } from '../../utils/formatters.js';

const schema = { name: validateRequired, type: validateRequired };

export default function AccountsSettings() {
  const { accounts, addAccount, deleteAccount } = useApp();

  const { values, errors, handleChange, handleBlur, validateAll, reset } =
    useFormValidation({ name: '', type: ACCOUNT_TYPES[0] }, schema);

  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!validateAll()) return;
    const exists = accounts.some(
      (a) => a.name.toLowerCase() === values.name.trim().toLowerCase()
    );
    if (exists) {
      setError('An account with that name already exists.');
      return;
    }
    addAccount({ name: values.name.trim(), type: values.type });
    reset({ name: '', type: ACCOUNT_TYPES[0] });
  };

  return (
    <div>
      <h2>Accounts</h2>

      {accounts.length === 0 ? (
        <EmptyState
          title="No accounts"
          message="Add an account to get started."
        />
      ) : (
        <ul className="account-list">
          {accounts.map((a) => (
            <li key={a.id} className="account-list__item">
              <div>
                <strong>{a.name}</strong>
                <span className="badge badge--neutral">
                  {capitalize(a.type)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAccount(a.id)}
                aria-label={`Delete ${a.name}`}
                disabled={accounts.length <= 1}
                title={
                  accounts.length <= 1
                    ? 'You must keep at least one account'
                    : undefined
                }
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} noValidate className="account-form">
        <h3>Add account</h3>
        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}
        <Input
          label="Account name"
          name="name"
          placeholder="e.g. Joint Checking"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
        />
        <Input
          label="Type"
          name="type"
          options={ACCOUNT_TYPES.map((t) => ({
            value: t,
            label: capitalize(t),
          }))}
          value={values.type}
          onChange={handleChange}
        />
        <Button type="submit">Add account</Button>
      </form>
    </div>
  );
}
