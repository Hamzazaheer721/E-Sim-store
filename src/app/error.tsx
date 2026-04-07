'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState message="Something went wrong loading this page." onRetry={reset} />;
}
