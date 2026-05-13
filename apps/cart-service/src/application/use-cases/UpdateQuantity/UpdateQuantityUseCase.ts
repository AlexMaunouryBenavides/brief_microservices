import { ICartRepository } from '../../../domain/ports/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { CartItemNotFoundError } from '../../../domain/errors/CartErrors';

export class UpdateQuantityUseCase {
  constructor(private readonly cartRepo: ICartRepository) {}

  async execute(userId: string, itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepo.findByUserId(userId);
    const item = cart ? cart.items.find((i) => i.id === itemId) : undefined;
    if (!cart || !item) throw new CartItemNotFoundError(itemId);

    return this.cartRepo.save(cart.updateItemQuantity(itemId, quantity));
  }
}
