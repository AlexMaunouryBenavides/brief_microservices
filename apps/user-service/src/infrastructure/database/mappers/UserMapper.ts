import { User, UserRole } from '../../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role as UserRole,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.role = user.role;
    entity.createdAt = user.createdAt;
    return entity;
  }
}
