import { vi, it, expect, describe, beforeEach } from 'vitest';
import { registerUser } from './registerUser.usecase';
import * as authApi from '../../../infrastructure/api/auth.api';

vi.mock('../../../infrastructure/api/auth.api');

describe('registerUser use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls registerApi with the DTO and returns the user', async () => {
    const mockUser = { id: '1', email: 'a@b.com', firstName: 'Alice', lastName: 'D', role: 'customer' as const };
    vi.mocked(authApi.registerApi).mockResolvedValue(mockUser);

    const result = await registerUser({
      email: 'a@b.com',
      password: 'pass',
      firstName: 'Alice',
      lastName: 'D',
    });

    expect(authApi.registerApi).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUser);
  });
});
