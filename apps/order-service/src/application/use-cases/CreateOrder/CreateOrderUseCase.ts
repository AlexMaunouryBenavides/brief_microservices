import { randomUUID } from 'crypto';
import { Order, OrderItem } from '../../../domain/entities/Order';
import { IOrderRepository } from '../../../domain/ports/IOrderRepository';
import { ICartClient } from '../../../domain/ports/ICartClient';
import { IOrderEventsPublisher } from '../../../domain/ports/IOrderEventsPublisher';
import { CartEmptyError } from '../../../domain/errors/OrderErrors';

export interface CreateOrderDto {
  userId: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly cartClient: ICartClient,
    private readonly eventsPublisher: IOrderEventsPublisher,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartClient.getCart(dto.userId);

    if (cart.items.length === 0) {
      throw new CartEmptyError(dto.userId);
    }

    const items = cart.items.map(
      (cartItem) =>
        new OrderItem({
          id: randomUUID(),
          carId: cartItem.carId,
          carSnapshot: cartItem.carSnapshot,
          selectedOptions: cartItem.selectedOptions,
          unitPrice: cartItem.totalPrice,
          quantity: cartItem.quantity,
        }),
    );

    const totalAmount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order = new Order({
      id: randomUUID(),
      userId: dto.userId,
      items,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    });

    const saved = await this.orderRepo.save(order);

    await this.eventsPublisher.publishOrderCreated({
      orderId: saved.id,
      userId: saved.userId,
      totalAmount: saved.totalAmount,
    });

    return saved;
  }
}
