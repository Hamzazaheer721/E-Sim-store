import { useMutation } from '@tanstack/react-query';

import { ApiError, placeOrder } from '@/lib/api';
import type { OrderErrors } from '@/types';

/**
 * Mutation hook for placing an order.
 *
 * On 422 error, extracts the field-level errors from the API response
 * so the checkout form can map them to individual fields via setError().
 *
 * Usage:
 *   const { mutate, isPending, error } = usePlaceOrder();
 *   const fieldErrors = getOrderFieldErrors(error);
 *   if (fieldErrors) Object.entries(fieldErrors).forEach(([field, msg]) => setError(field, { message: msg }));
 */
export function usePlaceOrder() {
  return useMutation({
    mutationFn: placeOrder,
  });
}

/**
 * Extracts field-level validation errors from a 422 API response.
 * Returns null if the error is not a validation error.
 */
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
