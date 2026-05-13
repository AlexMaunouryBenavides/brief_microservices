import { vi, it, expect, describe } from 'vitest';
import { screen } from '@testing-library/react';
import { CartView } from './CartView';
import { renderWithProviders } from '../../../shared/test-utils';
import * as getCartUseCase from '../../../application/use-cases/cart/getCart.usecase';
import type { Cart } from '../../../domain/models/Cart.model';

vi.mock('../../../application/use-cases/cart/getCart.usecase');
vi.mock('../../../infrastructure/api/cart.api');

describe('CartView', () => {
  it('shows empty cart message when no items', async () => {
    vi.mocked(getCartUseCase.getCart).mockResolvedValue({
      userId: 'u1',
      items: [],
      updatedAt: '2024-01-01T00:00:00Z',
    });
    renderWithProviders(<CartView />);

    expect(await screen.findByText(/panier est vide/i)).toBeInTheDocument();
  });

  it('renders cart items', async () => {
    const cart: Cart = {
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
    vi.mocked(getCartUseCase.getCart).mockResolvedValue(cart);
    renderWithProviders(<CartView />);

    expect(await screen.findByText(/Tesla Model 3/i)).toBeInTheDocument();
    expect(screen.getAllByText(/45\s000/i).length).toBeGreaterThan(0);
  });
});
