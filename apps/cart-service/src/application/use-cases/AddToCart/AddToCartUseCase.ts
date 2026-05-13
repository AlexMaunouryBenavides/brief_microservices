import { randomUUID } from 'crypto';
import { ICartRepository } from '../../../domain/ports/ICartRepository';
import { ICatalogClient } from '../../../domain/ports/ICatalogClient';
import { Cart } from '../../../domain/entities/Cart';
import { CartItem } from '../../../domain/entities/CartItem';

export interface AddToCartDto {
  userId: string;
  carId: string;
  optionIds: string[];
  quantity: number;
}

export class AddToCartUseCase {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly catalogClient: ICatalogClient,
  ) {}

  async execute(dto: AddToCartDto): Promise<Cart> {
    const { car, selectedOptions, totalPrice } = await this.catalogClient.getCarWithPrice(
      dto.carId,
      dto.optionIds,
    );

    const existingCart = await this.cartRepo.findByUserId(dto.userId);
    const cart = existingCart ?? Cart.empty(dto.userId);

    const item = new CartItem({
      id: randomUUID(),
      carId: dto.carId,
      carSnapshot: { ...car },
      selectedOptions: selectedOptions.map((o) => ({ ...o })),
      totalPrice,
      quantity: dto.quantity,
    });

    return this.cartRepo.save(cart.addItem(item));
  }
}
