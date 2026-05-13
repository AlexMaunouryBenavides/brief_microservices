import { getCartApi } from '../../../infrastructure/api/cart.api';
import type { Cart } from '../../../domain/models/Cart.model';

export const getCart = (): Promise<Cart> => getCartApi();
