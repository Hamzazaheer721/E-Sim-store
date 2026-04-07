import { useQuery } from '@tanstack/react-query';

import { getDestination } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';

export function useDestination(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.destinations.detail(slug),
    queryFn: () => getDestination(slug),
    enabled: !!slug,
  });
}
