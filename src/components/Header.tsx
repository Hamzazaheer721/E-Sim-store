'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Box from '@mui/material/Box';

import { getCart } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { useCartStore } from '@/store/cart-store';

export function Header() {
  const cartId = useCartStore((s) => s.cartId);

  const { data: cart } = useQuery({
    queryKey: QUERY_KEYS.cart(cartId!),
    queryFn: () => getCart(cartId!),
    enabled: !!cartId,
  });

  const itemCount = cart?.items.length ?? 0;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ maxWidth: '80rem', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        <Typography
          component={Link}
          href="/"
          variant="h6"
          fontWeight={700}
          color="primary"
          sx={{ flexGrow: 1, textDecoration: 'none' }}
        >
          eSIM Shop
        </Typography>

        <Box
          component={Link}
          href="/cart"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <IconButton color="inherit" size="small">
            <Badge badgeContent={itemCount} color="error">
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Cart
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
