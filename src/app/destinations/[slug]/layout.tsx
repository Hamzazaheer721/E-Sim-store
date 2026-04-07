import type { Metadata } from 'next';

import { ApiError, getDestination } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const destination = await getDestination(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  return {
    title: `${destination.name} eSIM Plans`,
    description: `Browse eSIM data plans for ${destination.name}. Stay connected while travelling.`,
  };
}

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
