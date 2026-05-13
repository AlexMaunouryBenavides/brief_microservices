import { vi, it, expect, describe, beforeEach } from 'vitest';
import { calculatePrice } from './calculatePrice.usecase';
import * as catalogApi from '../../../infrastructure/api/catalog.api';

vi.mock('../../../infrastructure/api/catalog.api');

describe('calculatePrice use-case', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns base price when no options selected', async () => {
    vi.mocked(catalogApi.calculatePriceApi).mockResolvedValue(45000);

    const result = await calculatePrice('car-1', []);

    expect(catalogApi.calculatePriceApi).toHaveBeenCalledWith('car-1', []);
    expect(result).toBe(45000);
  });

  it('returns price including selected options', async () => {
    vi.mocked(catalogApi.calculatePriceApi).mockResolvedValue(50000);

    const result = await calculatePrice('car-1', ['opt-1']);

    expect(catalogApi.calculatePriceApi).toHaveBeenCalledWith('car-1', ['opt-1']);
    expect(result).toBe(50000);
  });
});
