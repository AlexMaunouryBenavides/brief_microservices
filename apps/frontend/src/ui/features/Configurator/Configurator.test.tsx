import { vi, it, expect, describe } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Configurator } from './Configurator';
import { renderWithProviders } from '../../../shared/test-utils';
import * as getCarUseCase from '../../../application/use-cases/catalog/getCarById.usecase';
import * as priceUseCase from '../../../application/use-cases/catalog/calculatePrice.usecase';
import * as addToCartUseCase from '../../../application/use-cases/cart/addToCart.usecase';

vi.mock('../../../application/use-cases/catalog/getCarById.usecase');
vi.mock('../../../application/use-cases/catalog/calculatePrice.usecase');
vi.mock('../../../application/use-cases/cart/addToCart.usecase');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockCar = {
  id: 'car-1',
  brand: 'Tesla',
  model: 'Model 3',
  year: 2024,
  rangeKm: 500,
  powerKw: 250,
  basePrice: 45000,
  imageUrl: '',
  options: [{ id: 'opt-1', name: 'Autopilot', additionalPrice: 5000 }],
};

describe('Configurator', () => {
  it('shows car name and options after loading', async () => {
    vi.mocked(getCarUseCase.getCarById).mockResolvedValue(mockCar);
    vi.mocked(priceUseCase.calculatePrice).mockResolvedValue(45000);
    renderWithProviders(<Configurator carId="car-1" />);

    expect(await screen.findByRole('heading', { name: /Model 3/i })).toBeInTheDocument();
    expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
    expect(screen.getByText(/Autopilot/i)).toBeInTheDocument();
  });

  it('toggles option selection on click', async () => {
    vi.mocked(getCarUseCase.getCarById).mockResolvedValue(mockCar);
    vi.mocked(priceUseCase.calculatePrice).mockResolvedValue(50000);
    renderWithProviders(<Configurator carId="car-1" />);

    await screen.findByText(/Autopilot/i);
    const checkbox = screen.getByRole('checkbox', { name: /Autopilot/i });

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('redirects to /login when unauthenticated user clicks "Ajouter au panier"', async () => {
    vi.mocked(getCarUseCase.getCarById).mockResolvedValue(mockCar);
    vi.mocked(priceUseCase.calculatePrice).mockResolvedValue(45000);
    renderWithProviders(<Configurator carId="car-1" />, {
      preloadedState: { auth: { accessToken: null, user: null } },
    });

    await screen.findByRole('button', { name: /ajouter au panier/i });
    await userEvent.click(screen.getByRole('button', { name: /ajouter au panier/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(addToCartUseCase.addToCart).not.toHaveBeenCalled();
  });

  it('calls addToCart and navigates to /cart when authenticated user clicks "Ajouter au panier"', async () => {
    vi.mocked(getCarUseCase.getCarById).mockResolvedValue(mockCar);
    vi.mocked(priceUseCase.calculatePrice).mockResolvedValue(45000);
    vi.mocked(addToCartUseCase.addToCart).mockResolvedValue({
      userId: 'user-1',
      items: [],
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    renderWithProviders(<Configurator carId="car-1" />, {
      preloadedState: { auth: { accessToken: 'token-abc', user: null } },
    });

    await screen.findByRole('button', { name: /ajouter au panier/i });
    await userEvent.click(screen.getByRole('button', { name: /ajouter au panier/i }));

    expect(addToCartUseCase.addToCart).toHaveBeenCalledWith('car-1', []);
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });
});
