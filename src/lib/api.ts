import type { Cart, Destination, DestinationWithPlans, Order, PaymentMethod } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  return res.json() as Promise<T>;
}

export function getDestinations(params?: { search?: string; region?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.region && params.region !== 'all') query.set('region', params.region);
  const qs = query.toString();
  return apiFetch<Destination[]>(`/api/destinations${qs ? `?${qs}` : ''}`);
}

export function getDestination(slug: string) {
  return apiFetch<DestinationWithPlans>(`/api/destinations/${slug}`);
}

export function getCart(cartId: string) {
  return apiFetch<Cart>(`/api/cart/${cartId}`);
}

export function addToCart(planId: string, cartId?: string | null) {
  return apiFetch<Cart>('/api/cart', {
    method: 'POST',
    body: JSON.stringify(cartId ? { planId, cartId } : { planId }),
  });
}

export function removeFromCart(cartId: string, itemId: string) {
  return apiFetch<void>(`/api/cart/${cartId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export function getPaymentMethods() {
  return apiFetch<PaymentMethod[]>('/api/payment-methods');
}

export function placeOrder(data: {
  cartId: string;
  email: string;
  firstName: string;
  lastName: string;
  paymentMethodId: string;
}) {
  return apiFetch<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
