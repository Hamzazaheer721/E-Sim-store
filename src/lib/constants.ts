export const REGIONS = [
  { value: 'all', label: 'All' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'americas', label: 'Americas' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'africa', label: 'Africa' },
  { value: 'oceania', label: 'Oceania' },
] as const;

export const QUERY_KEYS = {
  destinations: {
    all: ['destinations'] as const,
    list: (filters: { search?: string; region?: string }) => ['destinations', filters] as const,
    detail: (slug: string) => ['destinations', slug] as const,
  },
  cart: (cartId: string) => ['cart', cartId] as const,
  paymentMethods: ['payment-methods'] as const,
} as const;
