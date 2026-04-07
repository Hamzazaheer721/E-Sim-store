'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, isRemoving } = useCart();
  const { plan } = item;

  return (
    <Card>
      <CardContent sx={{ display: 'flex', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 1,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SignalCellularAltIcon sx={{ color: 'text.disabled' }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {plan.name}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {plan.dataAmountGB} GB · {plan.validityDays} days
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              {formatPrice(plan.priceInCents)}
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.itemId)}
              isLoading={isRemoving}
              style={{ color: '#dc2626' }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
