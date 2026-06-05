/**
 * Polymorphic button. Renders a <button> by default, or any element via `as`
 * (e.g. `as={Link}`) while keeping consistent variant styling.
 */
export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  type,
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Only native buttons need an explicit type to avoid accidental form submits.
  const typeProp = Component === 'button' ? { type: type || 'button' } : {};

  return (
    <Component className={classes} {...typeProp} {...rest}>
      {children}
    </Component>
  );
}
