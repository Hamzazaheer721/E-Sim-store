import TextField from '@mui/material/TextField';
import { forwardRef } from 'react';

interface InputProps {
  label: string;
  error?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, type, placeholder, autoComplete, name, onChange, onBlur }, ref) => {
    return (
      <TextField
        inputRef={ref}
        id={id || label.toLowerCase().replace(/\s+/g, '-')}
        name={name}
        label={label}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        error={!!error}
        helperText={error}
        fullWidth
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  },
);

Input.displayName = 'Input';
