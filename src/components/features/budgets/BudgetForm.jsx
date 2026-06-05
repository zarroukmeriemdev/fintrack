import { useMemo } from 'react';
import { Input } from '../../common/Input.jsx';
import { Button } from '../../common/Button.jsx';
import { useFormValidation } from '../../../hooks/useFormValidation.js';
import { useApp } from '../../../hooks/useApp.js';
import { validateRequired, validateAmount } from '../../../utils/validators.js';
import { EXPENSE_CATEGORIES } from '../../../utils/constants.js';

const schema = {
  category: validateRequired,
  limit: validateAmount,
};

/** Create or edit a monthly budget for a category. */
export function BudgetForm({ initial, onDone }) {
  const { budgets, addBudget, updateBudget } = useApp();
  const isEdit = Boolean(initial);

  // Categories not already budgeted (plus the one being edited).
  const availableCategories = useMemo(() => {
    const used = new Set(budgets.map((b) => b.category));
    return EXPENSE_CATEGORIES.filter(
      (c) => !used.has(c) || c === initial?.category
    );
  }, [budgets, initial]);

  const defaults = {
    category: initial?.category || availableCategories[0] || '',
    limit: initial?.limit != null ? String(initial.limit) : '',
  };

  const { values, errors, handleChange, handleBlur, validateAll } =
    useFormValidation(defaults, schema);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAll()) return;
    const payload = {
      category: values.category,
      limit: Number(values.limit),
    };
    if (isEdit) updateBudget({ ...payload, id: initial.id });
    else addBudget(payload);
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Category"
        name="category"
        options={availableCategories}
        value={values.category}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.category}
        disabled={isEdit}
      />
      <Input
        label="Monthly limit"
        name="limit"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder="0.00"
        value={values.limit}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.limit}
      />
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? 'Save' : 'Add budget'}</Button>
      </div>
    </form>
  );
}
