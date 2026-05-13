import { vi, it, expect, describe, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useLoginForm } from './useLoginForm';
import * as loginUseCase from '../../../application/use-cases/auth/loginUser.usecase';

vi.mock('../../../application/use-cases/auth/loginUser.usecase');

const mockResult = {
  accessToken: 'tok',
  user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'customer' as const },
};

describe('useLoginForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts with no error and not loading', () => {
    const { result } = renderHookWithProviders(() => useLoginForm());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('dispatches loginSuccess and clears error on success', async () => {
    vi.mocked(loginUseCase.loginUser).mockResolvedValue(mockResult);
    const { result, store } = renderHookWithProviders(() => useLoginForm());

    await act(async () => {
      await result.current.submit({ email: 'a@b.com', password: 'pass' });
    });

    expect(store.getState().auth.accessToken).toBe('tok');
    expect(result.current.error).toBeNull();
  });

  it('sets error message on failure', async () => {
    vi.mocked(loginUseCase.loginUser).mockRejectedValue(new Error('Unauthorized'));
    const { result } = renderHookWithProviders(() => useLoginForm());

    await act(async () => {
      await result.current.submit({ email: 'x@x.com', password: 'wrong' });
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
  });
});
