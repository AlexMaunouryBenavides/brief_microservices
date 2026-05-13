import { vi, it, expect, describe, beforeEach } from 'vitest';
import { getUserOrders } from './getUserOrders.usecase';
import * as ordersApi from '../../../infrastructure/api/orders.api';
import type { Order } from '../../../domain/models/Order.model';

vi.mock('../../../infrastructure/api/orders.api');

const mockOrder: Order = {
  id: 'ord-1',
  userId: 'u1',
  items: [],
  totalAmount: 45000,
  status: 'pending',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('getUserOrders use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns list of orders', async () => {
    vi.mocked(ordersApi.getUserOrdersApi).mockResolvedValue([mockOrder]);

    const result = await getUserOrders();

    expect(ordersApi.getUserOrdersApi).toHaveBeenCalledOnce();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ord-1');
  });
});
