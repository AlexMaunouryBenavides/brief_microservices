import { vi, it, expect, describe, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useCart } from './useCart';
import * as getCartUseCase from '../../../application/use-cases/cart/getCart.usecase';
import * as removeUseCase from '../../../application/use-cases/cart/addToCart.usecase';
import type { Cart } from '../../../domain/models/Cart.model';

vi.mock('../../../application/use-cases/cart/getCart.usecase');
vi.mock('../../../infrastructure/api/cart.api');

const emptyCart: Cart = { userId: 'u1', items: [], updatedAt: '2024-01-01T00:00:00Z' };

describe('useCart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads cart on mount', async () => {
    vi.mocked(getCartUseCase.getCart).mockResolvedValue(emptyCart);
    const { result } = renderHookWithProviders(() => useCart());

    await vi.waitFor(() => {
      expect(result.current.cart).toEqual(emptyCart);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('starts loading on mount', () => {
    vi.mocked(getCartUseCase.getCart).mockReturnValue(new Promise(() => {}));
    const { result } = renderHookWithProviders(() => useCart());

    expect(result.current.isLoading).toBe(true);
  });
});
