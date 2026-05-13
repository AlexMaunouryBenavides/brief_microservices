import { apiClient } from './apiClient';
import type { User } from '../../domain/models/User.model';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
}

export const getProfileApi = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/users/me');
  return data;
};

export const updateProfileApi = async (dto: UpdateProfileDto): Promise<User> => {
  const { data } = await apiClient.patch<User>('/users/me', dto);
  return data;
};
