import { useCallback, useState } from 'react';
import { validateForm } from '../utils/validators.js';

/**
 * Controlled-form helper with field-level validation.
 *
 * @param {object} initialValues
 * @param {object} schema map of `{ field: (value, allValues) => errorString }`
 */
export function useFormValidation(initialValues, schema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (name, allValues) => {
      if (!schema[name]) return '';
      return schema[name](allValues[name], allValues);
    },
    [schema]
  );

  const handleChange = useCallback(
    (event) => {
      const { name, type, checked, value } = event.target;
      const fieldValue = type === 'checkbox' ? checked : value;
      setValues((prev) => {
        const next = { ...prev, [name]: fieldValue };
        if (touched[name]) {
          setErrors((e) => ({ ...e, [name]: validateField(name, next) }));
        }
        return next;
      });
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, values) }));
    },
    [values, validateField]
  );

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(
    (next = initialValues) => {
      setValues(next);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  /** Validate everything; returns true when valid and marks fields touched. */
  const validateAll = useCallback(() => {
    const result = validateForm(values, schema);
    setErrors(result.errors);
    setTouched(
      Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return result.isValid;
  }, [values, schema]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validateAll,
    reset,
  };
}
