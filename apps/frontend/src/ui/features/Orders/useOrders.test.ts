import { vi, it, expect, describe, beforeEach } from 'vitest';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useOrders } from './useOrders';
import * as getUserOrdersUseCase from '../../../application/use-cases/orders/getUserOrders.usecase';
import type { Order } from '../../../domain/models/Order.model';

vi.mock('../../../application/use-cases/orders/getUserOrders.usecase');

const mockOrder: Order = {
  id: 'ord-1',
  userId: 'u1',
  items: [],
  totalAmount: 45000,
  status: 'pending',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('useOrders', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads orders on mount', async () => {
    vi.mocked(getUserOrdersUseCase.getUserOrders).mockResolvedValue([mockOrder]);
    const { result } = renderHookWithProviders(() => useOrders());

    await vi.waitFor(() => {
      expect(result.current.orders).toHaveLength(1);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns empty orders initially', () => {
    vi.mocked(getUserOrdersUseCase.getUserOrders).mockReturnValue(new Promise(() => {}));
    const { result } = renderHookWithProviders(() => useOrders());

    expect(result.current.orders).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });
});
