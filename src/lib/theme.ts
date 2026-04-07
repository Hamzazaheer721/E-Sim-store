'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0f2b46',
      light: '#1a3a5c',
      dark: '#091d30',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#d97706',
    },
    background: {
      default: '#f0f7ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f2b46',
      secondary: '#4a5568',
      disabled: '#718096',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(15, 43, 70, 0.08), 0 1px 2px rgba(15, 43, 70, 0.06)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 500,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#dbeafe',
        },
      },
    },
  },
});
