import { vi, it, expect, describe } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Configurator } from './Configurator';
import { renderWithProviders } from '../../../shared/test-utils';
import * as getCarUseCase from '../../../application/use-cases/catalog/getCarById.usecase';
import * as priceUseCase from '../../../application/use-cases/catalog/calculatePrice.usecase';

vi.mock('../../../application/use-cases/catalog/getCarById.usecase');
vi.mock('../../../application/use-cases/catalog/calculatePrice.usecase');

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

    expect(await screen.findByText(/Tesla Model 3/i)).toBeInTheDocument();
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
});
