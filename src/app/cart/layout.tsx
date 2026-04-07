import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart — eSIM Shop',
  description: 'Review your eSIM plans and complete your purchase.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
