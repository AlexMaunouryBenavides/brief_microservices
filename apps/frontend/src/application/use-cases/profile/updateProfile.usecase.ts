import { updateProfileApi, type UpdateProfileDto } from '../../../infrastructure/api/user.api';
import type { User } from '../../../domain/models/User.model';

export const updateProfile = (dto: UpdateProfileDto): Promise<User> => updateProfileApi(dto);
