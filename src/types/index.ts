export type Region = 'europe' | 'asia' | 'americas' | 'africa' | 'oceania' | 'middle-east';

export interface Destination {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: Region;
  popular: boolean;
  imageUrl: string;
  planCount: number;
  startingFromPriceInCents: number;
}

export interface DestinationWithPlans {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: Region;
  popular: boolean;
  imageUrl: string;
  plans: Plan[];
}

export interface Plan {
  id: string;
  destinationSlug: string;
  name: string;
  description: string | null;
  dataAmountGB: number;
  validityDays: number;
  priceInCents: number;
  currency: string;
  coverage: string[];
  speedThrottle: string | null;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  totalInCents: number;
  currency: string;
}

export interface CartItem {
  itemId: string;
  planId: string;
  plan: Plan;
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  orderId: string;
  status: string;
  email: string;
  items: CartItem[];
  totalInCents: number;
  currency: string;
  createdAt: string;
}

export interface OrderErrors {
  errors: Record<string, string>;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  paymentMethodId: string;
}
