'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function CartError({ reset }: { reset: () => void }) {
  return <ErrorState message="Something went wrong loading your cart." onRetry={reset} />;
}
