import { vi, it, expect, describe, beforeEach } from 'vitest';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useCarList } from './useCarList';
import * as listCarsUseCase from '../../../application/use-cases/catalog/listCars.usecase';
import type { Car } from '../../../domain/models/Car.model';

vi.mock('../../../application/use-cases/catalog/listCars.usecase');

const mockCar: Car = {
  id: 'car-1',
  brand: 'Tesla',
  model: 'Model 3',
  year: 2024,
  rangeKm: 500,
  powerKw: 250,
  basePrice: 45000,
  imageUrl: '/img.jpg',
  options: [],
};

describe('useCarList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads cars on mount', async () => {
    vi.mocked(listCarsUseCase.listCars).mockResolvedValue([mockCar]);
    const { result } = renderHookWithProviders(() => useCarList());

    expect(result.current.isLoading).toBe(true);

    await vi.waitFor(() => {
      expect(result.current.cars).toHaveLength(1);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(listCarsUseCase.listCars).mockRejectedValue(new Error('Network error'));
    const { result } = renderHookWithProviders(() => useCarList());

    await vi.waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
