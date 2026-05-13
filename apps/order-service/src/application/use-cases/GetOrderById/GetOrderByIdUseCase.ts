import { Order } from '../../../domain/entities/Order';
import { IOrderRepository } from '../../../domain/ports/IOrderRepository';
import { OrderNotFoundError, UnauthorizedOrderAccessError } from '../../../domain/errors/OrderErrors';

export interface GetOrderByIdDto {
  orderId: string;
  userId: string;
}

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(dto: GetOrderByIdDto): Promise<Order> {
    const order = await this.orderRepo.findById(dto.orderId);

    if (!order) {
      throw new OrderNotFoundError(dto.orderId);
    }

    if (order.userId !== dto.userId) {
      throw new UnauthorizedOrderAccessError();
    }

    return order;
  }
}
