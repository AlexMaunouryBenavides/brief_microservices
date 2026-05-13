import { Cart } from '../entities/Cart';

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<Cart>;
}
