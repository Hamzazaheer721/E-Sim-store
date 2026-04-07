'use client';

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import type { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const { cart, addToCart, isAdding } = useCart();

  const isInCart = cart?.items.some((item) => item.planId === plan.id) ?? false;

  return (
    <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {plan.name}
            </Typography>
            {plan.description && (
              <Typography variant="body2" color="text.disabled" sx={{ mt: 0.25 }}>
                {plan.description}
              </Typography>
            )}
          </Box>
          <Typography variant="h5" fontWeight={700} color="primary" sx={{ flexShrink: 0 }}>
            {formatPrice(plan.priceInCents)}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="body2" color="text.disabled">
              Data
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {plan.dataAmountGB} GB
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="body2" color="text.disabled">
              Validity
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {plan.validityDays} days
            </Typography>
          </Grid>
          {plan.coverage.length > 1 && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" color="text.disabled">
                Coverage
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {plan.coverage.join(', ')}
              </Typography>
            </Grid>
          )}
        </Grid>

        {plan.speedThrottle && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {plan.speedThrottle}
          </Alert>
        )}

        {isInCart ? (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                py: 1.5,
                borderRadius: 1,
                bgcolor: 'success.main',
                color: 'white',
              }}
            >
              <CheckCircleOutlineIcon fontSize="small" />
              <Typography variant="body2" fontWeight={600}>
                Already Added to cart
              </Typography>
            </Box>
          </Box>
        ) : (
          <Button
            onClick={() => addToCart(plan.id)}
            isLoading={isAdding}
            disabled={isAdding}
            fullWidth
            size="lg"
            style={{ marginTop: 16 }}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
