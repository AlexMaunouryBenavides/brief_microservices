import { vi, it, expect, describe, beforeEach } from 'vitest';
import { addToCart } from './addToCart.usecase';
import * as cartApi from '../../../infrastructure/api/cart.api';
import type { Cart } from '../../../domain/models/Cart.model';

vi.mock('../../../infrastructure/api/cart.api');

const mockCart: Cart = {
  userId: 'u1',
  items: [
    {
      id: 'ci-1',
      carId: 'car-1',
      carSnapshot: { brand: 'Tesla', model: 'Model 3', basePrice: 45000 },
      selectedOptions: [],
      totalPrice: 45000,
      quantity: 1,
    },
  ],
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('addToCart use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns updated cart after adding item', async () => {
    vi.mocked(cartApi.addToCartApi).mockResolvedValue(mockCart);

    const result = await addToCart('car-1', ['opt-1']);

    expect(cartApi.addToCartApi).toHaveBeenCalledWith('car-1', ['opt-1']);
    expect(result.items).toHaveLength(1);
  });
});
