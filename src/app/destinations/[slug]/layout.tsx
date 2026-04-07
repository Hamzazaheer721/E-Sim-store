import type { Metadata } from 'next';

import { getDestination } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const destination = await getDestination(slug);
    return {
      title: `${destination.name} eSIM Plans — eSIM Shop`,
      description: `Buy eSIM plans for ${destination.name}. Choose from ${destination.plans.length} plans with instant delivery.`,
    };
  } catch {
    return {
      title: 'Destination — eSIM Shop',
    };
  }
}

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
