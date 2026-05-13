import { ICartRepository } from '../../domain/ports/ICartRepository';
import { Cart } from '../../domain/entities/Cart';

export class InMemoryCartRepository implements ICartRepository {
  private carts: Map<string, Cart> = new Map();

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.carts.get(userId) ?? null;
  }

  async save(cart: Cart): Promise<Cart> {
    this.carts.set(cart.userId, cart);
    return cart;
  }

  clear(): void {
    this.carts.clear();
  }
}
