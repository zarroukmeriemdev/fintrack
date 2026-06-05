import { useId } from 'react';

/**
 * Labelled form control with inline error messaging and ARIA wiring.
 * Renders a <select> when `options` is provided, otherwise an <input>.
 */
export function Input({
  label,
  name,
  error,
  hint,
  options,
  className = '',
  ...rest
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  const controlClass = [
    'field__control',
    error ? 'field__control--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}

      {options ? (
        <select
          id={id}
          name={name}
          className={controlClass}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...rest}
        >
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          className={controlClass}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...rest}
        />
      )}

      {hint && !error && (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      )}
      <span id={errorId} className="field__error" role="alert">
        {error || ''}
      </span>
    </div>
  );
}
