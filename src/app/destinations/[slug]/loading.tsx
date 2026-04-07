import Box from '@mui/material/Box';
import { PlanCardSkeleton } from '@/components/PlanCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DestinationLoading() {
  return (
    <Box>
      <Skeleton variant="text" width={160} height={24} />
      <Skeleton variant="rectangular" height={256} sx={{ mt: 2, borderRadius: 2 }} />
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <PlanCardSkeleton key={i} />
        ))}
      </Box>
    </Box>
  );
}
