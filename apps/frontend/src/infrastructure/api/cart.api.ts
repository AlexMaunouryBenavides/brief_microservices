import { apiClient } from './apiClient';
import type { Cart } from '../../domain/models/Cart.model';

export const getCartApi = async (): Promise<Cart> => {
  const { data } = await apiClient.get<Cart>('/cart');
  return data;
};

export const addToCartApi = async (carId: string, selectedOptionIds: string[]): Promise<Cart> => {
  const { data } = await apiClient.post<Cart>('/cart/items', { carId, selectedOptionIds });
  return data;
};

export const removeFromCartApi = async (itemId: string): Promise<Cart> => {
  const { data } = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
  return data;
};

export const updateCartItemQuantityApi = async (itemId: string, quantity: number): Promise<Cart> => {
  const { data } = await apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity });
  return data;
};
