import { Repository } from 'typeorm';
import { IOrderRepository } from '../../../domain/ports/IOrderRepository';
import { Order } from '../../../domain/entities/Order';
import { OrderEntity } from '../entities/OrderEntity';
import { OrderMapper } from '../mappers/OrderMapper';

export class TypeOrmOrderRepository implements IOrderRepository {
  constructor(private readonly repo: Repository<OrderEntity>) {}

  async save(order: Order): Promise<Order> {
    const entity = OrderMapper.toEntity(order);
    const saved = await this.repo.save(entity);
    return OrderMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['items'] });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await this.repo.find({ where: { userId }, relations: ['items'] });
    return entities.map(OrderMapper.toDomain);
  }
}
