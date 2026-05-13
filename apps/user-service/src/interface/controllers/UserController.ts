import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUser/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUser/LoginUserUseCase';
import { GetProfileUseCase } from '../../application/use-cases/GetProfile/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../application/use-cases/UpdateProfile/UpdateProfileUseCase';
import { RegisterHttpDto } from '../dtos/RegisterHttpDto';
import { LoginHttpDto } from '../dtos/LoginHttpDto';
import { UpdateProfileHttpDto } from '../dtos/UpdateProfileHttpDto';
import { UserRole } from '../../domain/entities/User';

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
}

interface LoginResponse {
  accessToken: string;
  user: Omit<UserResponse, 'createdAt'>;
}

@Controller()
export class UserController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Post('auth/register')
  async register(@Body() dto: RegisterHttpDto): Promise<UserResponse> {
    const user = await this.registerUseCase.execute(dto);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginHttpDto): Promise<LoginResponse> {
    const { accessToken, user } = await this.loginUseCase.execute(dto);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  @Get('users/me')
  async getProfile(@Headers('x-user-id') userId: string): Promise<UserResponse> {
    const user = await this.getProfileUseCase.execute(userId);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Patch('users/me')
  async updateProfile(
    @Headers('x-user-id') userId: string,
    @Body() dto: UpdateProfileHttpDto,
  ): Promise<UserResponse> {
    const user = await this.updateProfileUseCase.execute(userId, dto);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
