import { vi, it, expect, describe, beforeEach } from 'vitest';
import { getProfile } from './getProfile.usecase';
import * as userApi from '../../../infrastructure/api/user.api';

vi.mock('../../../infrastructure/api/user.api');

describe('getProfile use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the authenticated user profile', async () => {
    const mockUser = { id: '1', email: 'a@b.com', firstName: 'Alice', lastName: 'D', role: 'customer' as const };
    vi.mocked(userApi.getProfileApi).mockResolvedValue(mockUser);

    const result = await getProfile();

    expect(userApi.getProfileApi).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUser);
  });
});
