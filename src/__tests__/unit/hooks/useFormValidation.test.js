import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../../../hooks/useFormValidation.js';
import { validateRequired, validateEmail } from '../../../utils/validators.js';

const schema = { name: validateRequired, email: validateEmail };

function setup() {
  return renderHook(() => useFormValidation({ name: '', email: '' }, schema));
}

describe('useFormValidation', () => {
  it('starts with the initial values and no errors', () => {
    const { result } = setup();
    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
  });

  it('updates a value via handleChange', () => {
    const { result } = setup();
    act(() =>
      result.current.handleChange({
        target: { name: 'name', value: 'Sam', type: 'text' },
      })
    );
    expect(result.current.values.name).toBe('Sam');
  });

  it('validates a field on blur', () => {
    const { result } = setup();
    act(() => result.current.handleBlur({ target: { name: 'email' } }));
    expect(result.current.errors.email).toBeTruthy();
  });

  it('validateAll returns false and populates all errors when invalid', () => {
    const { result } = setup();
    let valid;
    act(() => {
      valid = result.current.validateAll();
    });
    expect(valid).toBe(false);
    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.errors.email).toBeTruthy();
  });

  it('validateAll returns true when all fields are valid', () => {
    const { result } = setup();
    act(() => {
      result.current.setFieldValue('name', 'Sam');
      result.current.setFieldValue('email', 'sam@example.com');
    });
    let valid;
    act(() => {
      valid = result.current.validateAll();
    });
    expect(valid).toBe(true);
  });

  it('reset restores defaults and clears errors', () => {
    const { result } = setup();
    act(() => {
      result.current.setFieldValue('name', 'X');
      result.current.validateAll();
    });
    act(() => result.current.reset());
    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
  });
});
