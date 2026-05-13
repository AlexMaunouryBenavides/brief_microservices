import { vi, it, expect, describe, beforeEach } from 'vitest';
import { getCarById } from './getCarById.usecase';
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
  options: [{ id: 'opt-1', name: 'Autopilot', additionalPrice: 5000 }],
};

describe('getCarById use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the car with its options', async () => {
    vi.mocked(catalogApi.getCarByIdApi).mockResolvedValue(mockCar);

    const result = await getCarById('car-1');

    expect(catalogApi.getCarByIdApi).toHaveBeenCalledWith('car-1');
    expect(result).toEqual(mockCar);
    expect(result.options).toHaveLength(1);
  });
});
