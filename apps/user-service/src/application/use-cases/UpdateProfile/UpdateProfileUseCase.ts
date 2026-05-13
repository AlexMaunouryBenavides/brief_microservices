import { IUserRepository } from '../../../domain/ports/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/UserErrors';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const updated = user.withUpdatedProfile(dto);
    return this.userRepo.update(updated);
  }
}
