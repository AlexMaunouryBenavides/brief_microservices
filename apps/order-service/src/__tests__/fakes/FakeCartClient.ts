import { ICartClient } from '../../domain/ports/ICartClient';
import { ICart } from '@brief-ev/shared';

export class FakeCartClient implements ICartClient {
  private carts: Map<string, ICart> = new Map();

  setCart(userId: string, cart: ICart): void {
    this.carts.set(userId, cart);
  }

  async getCart(userId: string): Promise<ICart> {
    return this.carts.get(userId) ?? { userId, items: [], updatedAt: new Date() };
  }
}
