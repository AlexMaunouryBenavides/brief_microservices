import * as argon2 from 'argon2';
import { IUserRepository } from '../../../domain/ports/IUserRepository';
import { User } from '../../../domain/entities/User';
import { InvalidCredentialsError } from '../../../domain/errors/UserErrors';

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: User;
}

export interface IJwtService {
  sign(payload: { sub: string; email: string; role: string }): string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, user };
  }
}
