'use client';

import { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { CartItem } from '@/components/CartItem';
import { CheckoutForm } from '@/components/CheckoutForm';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import type { Order } from '@/types';

export default function CartPage() {
  const { cart, isLoading, isError, refetch } = useCart();
  const clearCartState = useCartStore((s) => s.clearCart);
  const [order, setOrder] = useState<Order | null>(null);

  const handleOrderSuccess = (confirmedOrder: Order) => {
    setOrder(confirmedOrder);
    clearCartState();
  };

  if (order) {
    return <OrderConfirmation order={order} />;
  }

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Your cart
        </Typography>
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

  if (isError) {
    return (
      <ErrorState message="Failed to load your cart. Please try again." onRetry={() => refetch()} />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 48 }} />}
        title="Your cart is empty"
        description="Browse our destinations and find the perfect eSIM plan for your trip."
        action={
          <Link href="/">
            <Button>Browse destinations</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700}>
        Your cart
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cart.items.map((item) => (
              <CartItem key={item.itemId} item={item} />
            ))}
          </Box>

          <Divider sx={{ mt: 3 }} />
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="h5" fontWeight={700} color="primary">
              {formatPrice(cart.totalInCents)}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
            <CardContent sx={{ p: 3 }}>
              <CheckoutForm cartId={cart.cartId} onSuccess={handleOrderSuccess} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
