import { vi, it, expect, describe, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useRegisterForm } from './useRegisterForm';
import * as registerUseCase from '../../../application/use-cases/auth/registerUser.usecase';

vi.mock('../../../application/use-cases/auth/registerUser.usecase');

describe('useRegisterForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts with no error and not loading', () => {
    const { result } = renderHookWithProviders(() => useRegisterForm());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('redirects to /login on success', async () => {
    const mockUser = { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'customer' as const };
    vi.mocked(registerUseCase.registerUser).mockResolvedValue(mockUser);
    const { result } = renderHookWithProviders(() => useRegisterForm());

    await act(async () => {
      await result.current.submit({ email: 'a@b.com', password: 'pass', firstName: 'A', lastName: 'B' });
    });

    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    vi.mocked(registerUseCase.registerUser).mockRejectedValue(new Error('Conflict'));
    const { result } = renderHookWithProviders(() => useRegisterForm());

    await act(async () => {
      await result.current.submit({ email: 'x@x.com', password: 'p', firstName: 'X', lastName: 'Y' });
    });

    expect(result.current.error).toBeTruthy();
  });
});
