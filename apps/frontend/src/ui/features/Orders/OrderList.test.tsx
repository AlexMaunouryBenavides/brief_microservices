import { vi, it, expect, describe } from 'vitest';
import { screen } from '@testing-library/react';
import { OrderList } from './OrderList';
import { renderWithProviders } from '../../../shared/test-utils';
import * as getUserOrdersUseCase from '../../../application/use-cases/orders/getUserOrders.usecase';
import type { Order } from '../../../domain/models/Order.model';

vi.mock('../../../application/use-cases/orders/getUserOrders.usecase');

describe('OrderList', () => {
  it('shows empty state when no orders', async () => {
    vi.mocked(getUserOrdersUseCase.getUserOrders).mockResolvedValue([]);
    renderWithProviders(<OrderList />);

    expect(await screen.findByText(/aucune commande/i)).toBeInTheDocument();
  });

  it('renders orders with their amounts', async () => {
    const orders: Order[] = [
      { id: 'ord-1', userId: 'u1', items: [], totalAmount: 45000, status: 'pending', createdAt: '2024-01-15T00:00:00Z' },
    ];
    vi.mocked(getUserOrdersUseCase.getUserOrders).mockResolvedValue(orders);
    renderWithProviders(<OrderList />);

    expect(await screen.findByText(/45\s000/i)).toBeInTheDocument();
    expect(screen.getByText(/en attente/i)).toBeInTheDocument();
  });
});
