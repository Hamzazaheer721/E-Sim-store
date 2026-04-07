'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function DestinationError() {
  return (
    <ErrorState
      message="Something went wrong loading this destination."
      onRetry={() => {
        window.location.href = '/';
      }}
    />
  );
}
