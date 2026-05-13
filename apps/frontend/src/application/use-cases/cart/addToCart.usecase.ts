import { addToCartApi } from '../../../infrastructure/api/cart.api';
import type { Cart } from '../../../domain/models/Cart.model';

export const addToCart = (carId: string, selectedOptionIds: string[]): Promise<Cart> =>
  addToCartApi(carId, selectedOptionIds);
