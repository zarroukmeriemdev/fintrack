import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.jsx';

/**
 * Accessible modal dialog.
 *  - Renders into document.body via a portal.
 *  - Closes on Escape and overlay click.
 *  - Traps initial focus and restores it on close.
 */
export function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    lastFocusedRef.current = document.activeElement;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);

    // Move focus into the dialog for keyboard/screen-reader users.
    dialogRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    // Overlay click-to-close is a mouse-only convenience; keyboard users close
    // via Escape (handled above) or the dedicated close button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </Button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
