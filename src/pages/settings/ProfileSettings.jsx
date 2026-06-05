import { useState } from 'react';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useFormValidation } from '../../hooks/useFormValidation.js';
import { useAuth } from '../../hooks/useAuth.js';
import { validateRequired } from '../../utils/validators.js';
import { CURRENCIES } from '../../utils/constants.js';

const schema = { name: validateRequired };

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const { values, errors, handleChange, handleBlur, validateAll } =
    useFormValidation(
      { name: user?.name || '', currency: user?.currency || 'USD' },
      schema
    );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAll()) return;
    updateUser({ name: values.name.trim(), currency: values.currency });
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 420 }}>
      <h2>Profile</h2>
      {saved && (
        <div className="alert alert--success" role="status">
          Profile updated.
        </div>
      )}
      <Input label="Email" name="email" value={user?.email || ''} disabled />
      <Input
        label="Name"
        name="name"
        value={values.name}
        onChange={(e) => {
          setSaved(false);
          handleChange(e);
        }}
        onBlur={handleBlur}
        error={errors.name}
      />
      <Input
        label="Preferred currency"
        name="currency"
        options={CURRENCIES.map((c) => ({
          value: c.code,
          label: `${c.code} (${c.symbol})`,
        }))}
        value={values.currency}
        onChange={(e) => {
          setSaved(false);
          handleChange(e);
        }}
      />
      <Button type="submit">Save changes</Button>
    </form>
  );
}
