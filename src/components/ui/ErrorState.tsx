import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <WarningAmberIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      {onRetry && (
        <Box sx={{ mt: 2 }}>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </Box>
      )}
    </Box>
  );
}
