import { vi, it, expect, describe, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useProfile } from './useProfile';
import * as getProfileUseCase from '../../../application/use-cases/profile/getProfile.usecase';
import * as updateProfileUseCase from '../../../application/use-cases/profile/updateProfile.usecase';

vi.mock('../../../application/use-cases/profile/getProfile.usecase');
vi.mock('../../../application/use-cases/profile/updateProfile.usecase');

const mockUser = { id: '1', email: 'a@b.com', firstName: 'Alice', lastName: 'D', role: 'customer' as const };

describe('useProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches profile on mount when no user in store', async () => {
    vi.mocked(getProfileUseCase.getProfile).mockResolvedValue(mockUser);
    const { result } = renderHookWithProviders(() => useProfile());

    await vi.waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('does not fetch if user already in store', async () => {
    vi.mocked(getProfileUseCase.getProfile).mockResolvedValue(mockUser);
    renderHookWithProviders(() => useProfile(), {
      auth: { accessToken: 'tok', user: mockUser },
    });

    await vi.waitFor(() => {
      expect(getProfileUseCase.getProfile).not.toHaveBeenCalled();
    });
  });

  it('updates user via update use-case', async () => {
    vi.mocked(getProfileUseCase.getProfile).mockResolvedValue(mockUser);
    const updated = { ...mockUser, firstName: 'Bob' };
    vi.mocked(updateProfileUseCase.updateProfile).mockResolvedValue(updated);
    const { result } = renderHookWithProviders(() => useProfile());
    await vi.waitFor(() => expect(result.current.user).not.toBeNull());

    await act(async () => {
      await result.current.update({ firstName: 'Bob' });
    });

    expect(result.current.user?.firstName).toBe('Bob');
  });
});
