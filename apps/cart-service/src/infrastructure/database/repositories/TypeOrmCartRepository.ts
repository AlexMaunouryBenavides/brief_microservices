import { Repository } from 'typeorm';
import { ICartRepository } from '../../../domain/ports/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { CartEntity } from '../entities/CartEntity';
import { CartItemEntity } from '../entities/CartItemEntity';
import { CartMapper } from '../mappers/CartMapper';

export class TypeOrmCartRepository implements ICartRepository {
  constructor(private readonly repo: Repository<CartEntity>) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    const entity = await this.repo.findOneBy({ userId });
    return entity ? CartMapper.toDomain(entity) : null;
  }

  async save(cart: Cart): Promise<Cart> {
    const existing = await this.repo.findOne({ where: { userId: cart.userId } });

    if (existing) {
      const newItemIds = new Set(cart.items.map((i) => i.id));
      const removedIds = (existing.items ?? [])
        .filter((item) => !newItemIds.has(item.id))
        .map((item) => item.id);
      if (removedIds.length > 0) {
        await this.repo.manager.delete(CartItemEntity, removedIds);
      }
    }

    const entity = existing ?? new CartEntity();
    entity.userId = cart.userId;
    entity.updatedAt = cart.updatedAt;
    entity.items = cart.items.map((item) => CartMapper.itemToEntity(item, cart.userId));
    const saved = await this.repo.save(entity);
    return CartMapper.toDomain(saved);
  }
}
