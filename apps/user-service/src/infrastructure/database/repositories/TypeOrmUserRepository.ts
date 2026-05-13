import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/ports/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';
import { UserMapper } from '../mappers/UserMapper';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly repo: Repository<UserEntity>) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOneBy({ email });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const saved = await this.repo.save(entity);
    return UserMapper.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const saved = await this.repo.save(entity);
    return UserMapper.toDomain(saved);
  }
}
