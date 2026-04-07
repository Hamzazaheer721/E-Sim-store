'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { getOrderFieldErrors, usePlaceOrder } from '@/hooks/usePlaceOrder';
import type { Order } from '@/types';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  paymentMethodId: z.string().min(1, 'Please select a payment method'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  cartId: string;
  onSuccess: (order: Order) => void;
}

export function CheckoutForm({ cartId, onSuccess }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      paymentMethodId: '',
    },
  });

  const { data: paymentMethods, isLoading: isLoadingMethods } = usePaymentMethods();
  const orderMutation = usePlaceOrder();

  useEffect(() => {
    if (orderMutation.error) {
      const fieldErrors = getOrderFieldErrors(orderMutation.error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as keyof CheckoutFormValues, { message });
        });
      }
    }
  }, [orderMutation.error, setError]);

  const onSubmit = (data: CheckoutFormValues) => {
    orderMutation.mutate({ ...data, cartId }, { onSuccess: (order) => onSuccess(order) });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      <Typography variant="h6" fontWeight={600}>
        Contact details
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </Grid>
      </Grid>

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormControl error={!!errors.paymentMethodId}>
        <FormLabel sx={{ fontWeight: 500 }}>Payment method</FormLabel>

        {isLoadingMethods ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={56} />
            ))}
          </Box>
        ) : (
          <Controller
            name="paymentMethodId"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                {paymentMethods?.map((method) => (
                  <FormControlLabel
                    key={method.id}
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" fontSize="1.25rem">
                          {method.icon}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {method.name}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      mx: 0,
                      mt: 1,
                      border: 1,
                      borderColor: errors.paymentMethodId ? 'error.main' : 'divider',
                      borderRadius: 1,
                      px: 2,
                      py: 0.5,
                      '&:has(input:checked)': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        backgroundColor: 'rgba(15,43,70,0.04)',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        )}

        {errors.paymentMethodId && (
          <FormHelperText>{errors.paymentMethodId.message}</FormHelperText>
        )}
      </FormControl>

      {orderMutation.error && !getOrderFieldErrors(orderMutation.error) && (
        <Alert severity="error">Something went wrong placing your order. Please try again.</Alert>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={orderMutation.isPending}
        disabled={orderMutation.isPending}
      >
        {orderMutation.isPending ? 'Placing order...' : 'Place order'}
      </Button>
    </Box>
  );
}
