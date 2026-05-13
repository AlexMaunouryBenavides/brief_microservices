import { vi, it, expect, describe } from 'vitest';
import { screen } from '@testing-library/react';
import { CarList } from './CarList';
import { renderWithProviders } from '../../../shared/test-utils';
import * as listCarsUseCase from '../../../application/use-cases/catalog/listCars.usecase';

vi.mock('../../../application/use-cases/catalog/listCars.usecase');

describe('CarList', () => {
  it('shows loading state initially', () => {
    vi.mocked(listCarsUseCase.listCars).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<CarList />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('renders list of cars after loading', async () => {
    vi.mocked(listCarsUseCase.listCars).mockResolvedValue([
      { id: 'c1', brand: 'Tesla', model: 'Model 3', year: 2024, rangeKm: 500, powerKw: 250, basePrice: 45000, imageUrl: '', options: [] },
      { id: 'c2', brand: 'BMW', model: 'iX', year: 2024, rangeKm: 600, powerKw: 300, basePrice: 70000, imageUrl: '', options: [] },
    ]);
    renderWithProviders(<CarList />);

    expect(await screen.findByText(/Tesla Model 3/i)).toBeInTheDocument();
    expect(screen.getByText(/BMW iX/i)).toBeInTheDocument();
  });

  it('shows error when fetch fails', async () => {
    vi.mocked(listCarsUseCase.listCars).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<CarList />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
