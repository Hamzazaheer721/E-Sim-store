'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { DestinationCard } from '@/components/DestinationCard';
import { DestinationCardSkeleton } from '@/components/DestinationCardSkeleton';
import { RegionFilter } from '@/components/RegionFilter';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useDestinations } from '@/hooks/useDestinations';
import SearchOffIcon from '@mui/icons-material/SearchOff';

function DestinationsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const region = searchParams.get('region') ?? 'all';

  const { data: destinations, isLoading, isError, refetch } = useDestinations({ search, region });

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Find your eSIM
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Browse destinations and buy eSIM plans for your next trip
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <SearchInput />
      </Box>
      <Box sx={{ mt: 3 }}>
        <RegionFilter />
      </Box>

      {isLoading && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <DestinationCardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {isError && (
        <ErrorState
          message="Failed to load destinations. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && destinations?.length === 0 && (
        <EmptyState
          title="No destinations found"
          description="Try a different search term or clear your filters."
          icon={<SearchOffIcon sx={{ fontSize: 48 }} />}
        />
      )}

      {!isLoading && !isError && destinations && destinations.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {destinations.map((destination, index) => (
            <Grid key={destination.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
              <DestinationCard destination={destination} priority={index < 3} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <DestinationCardSkeleton />
            </Grid>
          ))}
        </Grid>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
