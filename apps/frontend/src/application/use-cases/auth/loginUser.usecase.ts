import { loginApi, type LoginDto } from '../../../infrastructure/api/auth.api';
import type { AuthResult } from '../../../domain/models/User.model';

export const loginUser = (dto: LoginDto): Promise<AuthResult> => loginApi(dto);
