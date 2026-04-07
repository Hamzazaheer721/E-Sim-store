import { useQuery } from '@tanstack/react-query';

import { getDestinations } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';

export function useDestinations(filters: { search?: string; region?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.destinations.list(filters),
    queryFn: () => getDestinations(filters),
  });
}
