import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Skeleton } from '@/components/ui/Skeleton';

export function PlanCardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={96} height={24} />
            <Skeleton variant="text" width={160} height={20} sx={{ mt: 0.5 }} />
          </Box>
          <Skeleton variant="text" width={80} height={32} />
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Skeleton variant="text" width={40} height={16} />
            <Skeleton variant="text" width={64} height={28} sx={{ mt: 0.5 }} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Skeleton variant="text" width={56} height={16} />
            <Skeleton variant="text" width={80} height={28} sx={{ mt: 0.5 }} />
          </Grid>
        </Grid>
        <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: 1 }} />
      </CardContent>
    </Card>
  );
}
