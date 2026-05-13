import { getProfileApi } from '../../../infrastructure/api/user.api';
import type { User } from '../../../domain/models/User.model';

export const getProfile = (): Promise<User> => getProfileApi();
