import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <Box sx={{ maxWidth: 512, mx: 'auto', py: 6, textAlign: 'center' }}>
      <Box
        sx={{
          mx: 'auto',
          mb: 3,
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'success.main',
          opacity: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 40, color: 'success.main', position: 'absolute', opacity: 1 }}
        />
      </Box>

      <Typography variant="h5" fontWeight={700}>
        Order confirmed!
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
        Your eSIM details will be sent to{' '}
        <Typography component="span" variant="body2" fontWeight={500} color="text.primary">
          {order.email}
        </Typography>
      </Typography>

      <Card sx={{ mt: 4, textAlign: 'left' }}>
        <CardContent>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Box>
              <Typography variant="caption" color="text.disabled">
                Order ID
              </Typography>
              <Typography variant="body2" fontWeight={500} fontFamily="monospace">
                {order.orderId}
              </Typography>
            </Box>
            <Chip label={order.status} color="success" size="small" />
          </Box>

          <Divider />

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {order.items.map((item) => (
              <Box
                key={item.itemId}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {item.plan.name}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {item.plan.dataAmountGB} GB · {item.plan.validityDays} days
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(item.plan.priceInCents)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mt: 2 }} />

          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}
          >
            <Typography fontWeight={600}>Total</Typography>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatPrice(order.totalInCents)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Link href="/">
          <Button variant="secondary" size="lg">
            Continue shopping
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
