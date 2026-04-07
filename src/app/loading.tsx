import Grid from '@mui/material/Grid';
import { DestinationCardSkeleton } from '@/components/DestinationCardSkeleton';

export default function Loading() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
          <DestinationCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
