'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function Error() {
  return <ErrorState message="Something went wrong loading this page." />;
}
