import { Order, OrderItem, OrderStatus } from '../../../domain/entities/Order';
import { OrderEntity } from '../entities/OrderEntity';
import { OrderItemEntity } from '../entities/OrderItemEntity';

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    const items = (entity.items ?? []).map(
      (itemEntity) =>
        new OrderItem({
          id: itemEntity.id,
          carId: itemEntity.carId,
          carSnapshot: itemEntity.carSnapshot,
          selectedOptions: itemEntity.selectedOptions,
          unitPrice: Number(itemEntity.unitPrice),
          quantity: itemEntity.quantity,
        }),
    );

    return new Order({
      id: entity.id,
      userId: entity.userId,
      items,
      totalAmount: Number(entity.totalAmount),
      status: entity.status as OrderStatus,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(order: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = order.id;
    entity.userId = order.userId;
    entity.totalAmount = order.totalAmount;
    entity.status = order.status;
    entity.createdAt = order.createdAt;

    entity.items = order.items.map((item) => {
      const itemEntity = new OrderItemEntity();
      itemEntity.id = item.id;
      itemEntity.carId = item.carId;
      itemEntity.carSnapshot = item.carSnapshot;
      itemEntity.selectedOptions = item.selectedOptions;
      itemEntity.unitPrice = item.unitPrice;
      itemEntity.quantity = item.quantity;
      itemEntity.order = entity;
      return itemEntity;
    });

    return entity;
  }
}
