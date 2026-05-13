import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { IUserRepository } from '../../../domain/ports/IUserRepository';
import { User } from '../../../domain/entities/User';
import { EmailAlreadyTakenError } from '../../../domain/errors/UserErrors';

export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyTakenError(dto.email);
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = new User({
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: 'customer',
      createdAt: new Date(),
    });

    return this.userRepo.save(user);
  }
}
