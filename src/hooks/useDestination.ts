import { useQuery } from '@tanstack/react-query';

import { getDestination } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';

/**
 * Fetches a single destination by slug, including its plans.
 * Only enabled when slug is provided (prevents fetch on mount
 * before the route param resolves).
 */
export function useDestination(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.destinations.detail(slug),
    queryFn: () => getDestination(slug),
    enabled: !!slug,
  });
}
