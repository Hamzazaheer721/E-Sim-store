'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { PlanCard } from '@/components/PlanCard';
import { PlanCardSkeleton } from '@/components/PlanCardSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDestination } from '@/hooks/useDestination';

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: destination, isLoading, isError, refetch } = useDestination(slug);

  if (isLoading) {
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

  if (isError || !destination) {
    return (
      <ErrorState
        message="Failed to load destination. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Box>
      <MuiLink
        component={Link}
        href="/"
        underline="hover"
        color="primary"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        All destinations
      </MuiLink>

      <Box
        sx={{
          position: 'relative',
          mt: 2,
          height: { xs: 192, sm: 256 },
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          }}
        />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h3" component="span">
              {destination.flag}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="white">
              {destination.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box component="section" sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={600}>
          Choose your plan
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {destination.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
