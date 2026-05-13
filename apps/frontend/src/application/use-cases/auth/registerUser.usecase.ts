import { registerApi, type RegisterDto } from '../../../infrastructure/api/auth.api';
import type { User } from '../../../domain/models/User.model';

export const registerUser = (dto: RegisterDto): Promise<User> => registerApi(dto);
