import { vi, it, expect, describe, beforeEach } from 'vitest';
import { listCars } from './listCars.usecase';
import * as catalogApi from '../../../infrastructure/api/catalog.api';
import type { Car } from '../../../domain/models/Car.model';

vi.mock('../../../infrastructure/api/catalog.api');

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

describe('listCars use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the list of cars from the API', async () => {
    vi.mocked(catalogApi.listCarsApi).mockResolvedValue([mockCar]);

    const result = await listCars();

    expect(catalogApi.listCarsApi).toHaveBeenCalledOnce();
    expect(result).toEqual([mockCar]);
  });

  it('returns empty array when no cars', async () => {
    vi.mocked(catalogApi.listCarsApi).mockResolvedValue([]);

    const result = await listCars();

    expect(result).toEqual([]);
  });
});
