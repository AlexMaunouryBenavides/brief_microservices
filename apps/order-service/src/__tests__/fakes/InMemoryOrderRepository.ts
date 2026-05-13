import { IOrderRepository } from '../../domain/ports/IOrderRepository';
import { Order } from '../../domain/entities/Order';

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  async save(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  all(): Order[] {
    return Array.from(this.orders.values());
  }

  clear(): void {
    this.orders.clear();
  }
}
