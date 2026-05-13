import { ICartRepository } from '../../../domain/ports/ICartRepository';

export class ClearCartUseCase {
  constructor(private readonly cartRepo: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) return;
    await this.cartRepo.save(cart.clear());
  }
}
