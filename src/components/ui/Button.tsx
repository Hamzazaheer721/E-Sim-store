'use client';

import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { ReactNode, MouseEventHandler, CSSProperties } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  style?: CSSProperties;
}

const variantMap = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
} as const;

const sizeMap = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  fullWidth,
  type = 'button',
  onClick,
  style,
}: ButtonProps) {
  return (
    <MuiButton
      disabled={disabled || isLoading}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      style={style}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
    >
      {children}
    </MuiButton>
  );
}
