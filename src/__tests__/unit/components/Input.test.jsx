import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../../../components/common/Input.jsx';

describe('Input', () => {
  it('associates the label with the control', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows an error message with role alert and aria-invalid', () => {
    render(<Input label="Email" name="email" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('shows a hint when there is no error', () => {
    render(<Input label="Pwd" name="pwd" hint="6+ chars" />);
    expect(screen.getByText('6+ chars')).toBeInTheDocument();
  });

  it('renders a select when options are provided', () => {
    render(
      <Input
        label="Type"
        name="type"
        options={['income', 'expense']}
        value="income"
        onChange={() => {}}
      />
    );
    const select = screen.getByLabelText('Type');
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'expense' })).toBeInTheDocument();
  });
});
