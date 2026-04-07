import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addToCart, ApiError, getCart, removeFromCart } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { useCartStore } from '@/store/cart-store';
import type { Cart } from '@/types';

export function useCart() {
  const queryClient = useQueryClient();
  const cartId = useCartStore((s) => s.cartId);
  const setCartId = useCartStore((s) => s.setCartId);
  const clearCart = useCartStore((s) => s.clearCart);

  const cartQuery = useQuery({
    queryKey: QUERY_KEYS.cart(cartId!),
    queryFn: () => getCart(cartId!),
    enabled: !!cartId,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        clearCart();
        return false;
      }
      return failureCount < 2;
    },
  });

  const addMutation = useMutation({
    mutationFn: (planId: string) => addToCart(planId, cartId),
    onSuccess: (data) => {
      setCartId(data.cartId);
      queryClient.setQueryData(QUERY_KEYS.cart(data.cartId), data);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFromCart(cartId!, itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.cart(cartId!),
      });

      const previousCart = queryClient.getQueryData<Cart>(QUERY_KEYS.cart(cartId!));

      if (previousCart) {
        const updatedItems = previousCart.items.filter((item) => item.itemId !== itemId);
        const updatedTotal = updatedItems.reduce(
          (sum, item) => sum + item.plan.priceInCents * item.quantity,
          0,
        );
        queryClient.setQueryData<Cart>(QUERY_KEYS.cart(cartId!), {
          ...previousCart,
          items: updatedItems,
          totalInCents: updatedTotal,
        });
      }

      return { previousCart };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(QUERY_KEYS.cart(cartId!), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.cart(cartId!),
      });
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    refetch: cartQuery.refetch,

    addToCart: addMutation.mutate,
    isAdding: addMutation.isPending,

    removeItem: removeMutation.mutate,
    isRemoving: removeMutation.isPending,

    clearCart,
  };
}
