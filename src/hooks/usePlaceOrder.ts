import { useMutation } from '@tanstack/react-query';

import { ApiError, placeOrder } from '@/lib/api';
import type { OrderErrors } from '@/types';

export function usePlaceOrder() {
  return useMutation({
    mutationFn: placeOrder,
  });
}

export function getOrderFieldErrors(error: Error | null): Record<string, string> | null {
  if (
    error instanceof ApiError &&
    error.status === 422 &&
    error.body &&
    typeof error.body === 'object' &&
    'errors' in error.body
  ) {
    return (error.body as OrderErrors).errors;
  }
  return null;
}
