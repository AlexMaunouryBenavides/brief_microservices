import { useCallback, useEffect, useState } from 'react';
import { getCart } from '../../../application/use-cases/cart/getCart.usecase';
import { removeFromCartApi, updateCartItemQuantityApi } from '../../../infrastructure/api/cart.api';
import type { Cart } from '../../../domain/models/Cart.model';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(() => {
    setIsLoading(true);
    getCart()
      .then(setCart)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId: string) => {
    const updated = await removeFromCartApi(itemId);
    setCart(updated);
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    const updated = await updateCartItemQuantityApi(itemId, quantity);
    setCart(updated);
  }, []);

  return { cart, isLoading, removeItem, updateQuantity, refresh: fetchCart };
}
