import { useQuery } from '@tanstack/react-query';

import { getPaymentMethods } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods,
    queryFn: getPaymentMethods,
    staleTime: Infinity,
  });
}
