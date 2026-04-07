import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CartLoading() {
  return (
    <Box>
      <Skeleton variant="text" width={160} height={36} />
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={112} />
            ))}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Skeleton variant="rectangular" height={256} />
        </Grid>
      </Grid>
    </Box>
  );
}
