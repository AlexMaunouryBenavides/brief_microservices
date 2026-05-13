import { vi, it, expect, describe, beforeEach } from 'vitest';
import { loginUser } from './loginUser.usecase';
import * as authApi from '../../../infrastructure/api/auth.api';

vi.mock('../../../infrastructure/api/auth.api');

const mockResult = {
  accessToken: 'tok123',
  user: { id: '1', email: 'a@b.com', firstName: 'Alice', lastName: 'D', role: 'customer' as const },
};

describe('loginUser use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns auth result from the API', async () => {
    vi.mocked(authApi.loginApi).mockResolvedValue(mockResult);

    const result = await loginUser({ email: 'a@b.com', password: 'pass' });

    expect(authApi.loginApi).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' });
    expect(result).toEqual(mockResult);
  });

  it('propagates API errors', async () => {
    vi.mocked(authApi.loginApi).mockRejectedValue(new Error('Unauthorized'));

    await expect(loginUser({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(
      'Unauthorized',
    );
  });
});
