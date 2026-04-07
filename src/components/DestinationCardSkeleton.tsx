import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { Skeleton } from '@/components/ui/Skeleton';

export function DestinationCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '4/3', width: '100%' }} />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={128} />
        </Box>
        <Skeleton variant="text" width={80} sx={{ mt: 1 }} />
        <Skeleton variant="text" width={96} sx={{ mt: 1.5 }} />
      </CardContent>
    </Card>
  );
}
