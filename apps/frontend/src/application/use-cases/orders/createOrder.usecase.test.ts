import { vi, it, expect, describe, beforeEach } from 'vitest';
import { createOrder } from './createOrder.usecase';
import * as ordersApi from '../../../infrastructure/api/orders.api';
import type { Order } from '../../../domain/models/Order.model';

vi.mock('../../../infrastructure/api/orders.api');

describe('createOrder use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the created order', async () => {
    const mockOrder: Order = {
      id: 'ord-1',
      userId: 'u1',
      items: [],
      totalAmount: 45000,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00Z',
    };
    vi.mocked(ordersApi.createOrderApi).mockResolvedValue(mockOrder);

    const result = await createOrder();

    expect(ordersApi.createOrderApi).toHaveBeenCalledOnce();
    expect(result.status).toBe('pending');
  });
});
