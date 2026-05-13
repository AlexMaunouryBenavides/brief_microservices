import { IUserRepository } from '../../../domain/ports/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/UserErrors';

export class GetProfileUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return user;
  }
}
