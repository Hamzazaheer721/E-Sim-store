import Image from 'next/image';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import { formatPrice } from '@/lib/utils';
import type { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  priority?: boolean;
}

export function DestinationCard({ destination, priority = false }: DestinationCardProps) {
  return (
    <Card
      component={Link}
      href={`/destinations/${destination.slug}`}
      sx={{
        textDecoration: 'none',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
        />
        {destination.popular && (
          <Chip
            label="Popular"
            size="small"
            color="secondary"
            sx={{ position: 'absolute', top: 12, right: 12 }}
          />
        )}
      </Box>

      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" component="span">
            {destination.flag}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            {destination.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
          {destination.planCount} {destination.planCount === 1 ? 'plan' : 'plans'}
        </Typography>
        <Typography variant="body1" fontWeight={700} color="primary" sx={{ mt: 1 }}>
          From {formatPrice(destination.startingFromPriceInCents)}
        </Typography>
      </CardContent>
    </Card>
  );
}
