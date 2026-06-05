import { useMemo } from 'react';
import { Input } from '../../common/Input.jsx';
import { Button } from '../../common/Button.jsx';
import { useFormValidation } from '../../../hooks/useFormValidation.js';
import { useApp } from '../../../hooks/useApp.js';
import { validateRequired, validateAmount } from '../../../utils/validators.js';
import {
  TRANSACTION_TYPES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../../utils/constants.js';
import { formatDate } from '../../../utils/formatters.js';

const schema = {
  description: validateRequired,
  amount: validateAmount,
  category: validateRequired,
  account: validateRequired,
  date: validateRequired,
};

function todayISO() {
  // Derive a yyyy-MM-dd string without Date.now() randomness concerns.
  return formatDate(new Date(), 'yyyy-MM-dd');
}

/**
 * Create or edit a transaction. Pass `initial` (an existing transaction) to
 * edit; omit it to create. Calls `onDone` after a successful submit.
 */
export function TransactionForm({ initial, onDone }) {
  const { accounts, addTransaction, updateTransaction } = useApp();
  const isEdit = Boolean(initial);

  const defaults = useMemo(
    () => ({
      type: initial?.type || TRANSACTION_TYPES.EXPENSE,
      description: initial?.description || '',
      amount: initial?.amount != null ? String(initial.amount) : '',
      category: initial?.category || '',
      account: initial?.account || accounts[0]?.name || '',
      date: initial?.date || todayISO(),
    }),
    [initial, accounts]
  );

  const { values, errors, handleChange, handleBlur, validateAll } =
    useFormValidation(defaults, schema);

  const categoryOptions =
    values.type === TRANSACTION_TYPES.INCOME
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  const accountOptions = accounts.map((a) => a.name);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAll()) return;

    const payload = {
      type: values.type,
      description: values.description.trim(),
      amount: Number(values.amount),
      category: values.category,
      account: values.account,
      date: values.date,
    };

    if (isEdit) updateTransaction({ ...payload, id: initial.id });
    else addTransaction(payload);

    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Type"
        name="type"
        options={[
          { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
          { value: TRANSACTION_TYPES.INCOME, label: 'Income' },
        ]}
        value={values.type}
        onChange={handleChange}
      />
      <Input
        label="Description"
        name="description"
        placeholder="e.g. Groceries at the market"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
      />
      <Input
        label="Amount"
        name="amount"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder="0.00"
        value={values.amount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.amount}
      />
      <Input
        label="Category"
        name="category"
        options={['', ...categoryOptions].map((c) => ({
          value: c,
          label: c || 'Select a category…',
        }))}
        value={values.category}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.category}
      />
      <Input
        label="Account"
        name="account"
        options={accountOptions}
        value={values.account}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.account}
      />
      <Input
        label="Date"
        name="date"
        type="date"
        value={values.date}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.date}
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Save changes' : 'Add transaction'}
        </Button>
      </div>
    </form>
  );
}
