'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function DestinationError({ reset }: { reset: () => void }) {
  return <ErrorState message="Something went wrong loading this destination." onRetry={reset} />;
}
