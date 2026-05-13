import { vi, it, expect, describe, beforeEach } from 'vitest';
import { updateProfile } from './updateProfile.usecase';
import * as userApi from '../../../infrastructure/api/user.api';

vi.mock('../../../infrastructure/api/user.api');

describe('updateProfile use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the updated user', async () => {
    const updated = { id: '1', email: 'a@b.com', firstName: 'Bob', lastName: 'D', role: 'customer' as const };
    vi.mocked(userApi.updateProfileApi).mockResolvedValue(updated);

    const result = await updateProfile({ firstName: 'Bob' });

    expect(userApi.updateProfileApi).toHaveBeenCalledWith({ firstName: 'Bob' });
    expect(result.firstName).toBe('Bob');
  });
});
