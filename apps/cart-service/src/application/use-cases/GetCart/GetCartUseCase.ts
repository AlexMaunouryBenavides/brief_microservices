import { ICartRepository } from '../../../domain/ports/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';

export class GetCartUseCase {
  constructor(private readonly cartRepo: ICartRepository) {}

  async execute(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) return Cart.empty(userId);
    return cart;
  }
}
