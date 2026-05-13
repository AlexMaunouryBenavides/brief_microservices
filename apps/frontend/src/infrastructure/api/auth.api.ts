import { apiClient } from './apiClient';
import type { AuthResult, User } from '../../domain/models/User.model';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const loginApi = async (dto: LoginDto): Promise<AuthResult> => {
  const { data } = await apiClient.post<AuthResult>('/auth/login', dto);
  return data;
};

export const registerApi = async (dto: RegisterDto): Promise<User> => {
  const { data } = await apiClient.post<User>('/auth/register', dto);
  return data;
};
