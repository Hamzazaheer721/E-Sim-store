'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function CartError() {
  return (
    <ErrorState
      message="Something went wrong loading this destination."
      onRetry={() => {
        window.location.href = '/';
      }}
    />
  );
}
