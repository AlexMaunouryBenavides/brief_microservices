import { vi, it, expect, describe, beforeEach } from 'vitest';
import { getCart } from './getCart.usecase';
import * as cartApi from '../../../infrastructure/api/cart.api';
import type { Cart } from '../../../domain/models/Cart.model';

vi.mock('../../../infrastructure/api/cart.api');

const mockCart: Cart = { userId: 'u1', items: [], updatedAt: '2024-01-01T00:00:00Z' };

describe('getCart use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the user cart', async () => {
    vi.mocked(cartApi.getCartApi).mockResolvedValue(mockCart);

    const result = await getCart();

    expect(cartApi.getCartApi).toHaveBeenCalledOnce();
    expect(result).toEqual(mockCart);
  });
});
