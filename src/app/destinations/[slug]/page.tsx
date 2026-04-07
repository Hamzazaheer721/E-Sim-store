import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { PlanCard } from '@/components/PlanCard';
import { ApiError, getDestination, getDestinations } from '@/lib/api';

export const revalidate = 60;

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.filter((d) => d.popular).map((d) => ({ slug: d.slug }));
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const destination = await getDestination(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  return (
    <Box>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#0f2b46',
          textDecoration: 'none',
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        All destinations
      </Link>

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
