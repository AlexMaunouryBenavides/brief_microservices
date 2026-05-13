import { Repository } from 'typeorm';
import { ICartRepository } from '../../../domain/ports/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { CartEntity } from '../entities/CartEntity';
import { CartMapper } from '../mappers/CartMapper';

export class TypeOrmCartRepository implements ICartRepository {
  constructor(private readonly repo: Repository<CartEntity>) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    const entity = await this.repo.findOneBy({ userId });
    return entity ? CartMapper.toDomain(entity) : null;
  }

  async save(cart: Cart): Promise<Cart> {
    const entity = CartMapper.toEntity(cart);
    const saved = await this.repo.save(entity);
    return CartMapper.toDomain(saved);
  }
}
