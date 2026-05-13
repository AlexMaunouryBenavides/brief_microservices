import { Order } from '../../../domain/entities/Order';
import { IOrderRepository } from '../../../domain/ports/IOrderRepository';

export class GetUserOrdersUseCase {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }
}
