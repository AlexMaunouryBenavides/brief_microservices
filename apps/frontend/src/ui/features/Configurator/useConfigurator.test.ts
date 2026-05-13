import { vi, it, expect, describe, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHookWithProviders } from '../../../shared/test-utils';
import { useConfigurator } from './useConfigurator';
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
  imageUrl: '/img.jpg',
  options: [
    { id: 'opt-1', name: 'Autopilot', additionalPrice: 5000 },
    { id: 'opt-2', name: 'Toit panoramique', additionalPrice: 2000 },
  ],
};

describe('useConfigurator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCarUseCase.getCarById).mockResolvedValue(mockCar);
    vi.mocked(priceUseCase.calculatePrice).mockResolvedValue(45000);
  });

  it('loads car on mount', async () => {
    const { result } = renderHookWithProviders(() => useConfigurator('car-1'));

    await vi.waitFor(() => {
      expect(result.current.car?.id).toBe('car-1');
    });
  });

  it('starts with no selected options', async () => {
    const { result } = renderHookWithProviders(() => useConfigurator('car-1'));

    await vi.waitFor(() => expect(result.current.car).not.toBeNull());

    expect(result.current.selectedOptionIds).toEqual([]);
  });

  it('toggles option on and off', async () => {
    const { result } = renderHookWithProviders(() => useConfigurator('car-1'));
    await vi.waitFor(() => expect(result.current.car).not.toBeNull());

    act(() => result.current.toggleOption('opt-1'));
    expect(result.current.selectedOptionIds).toContain('opt-1');

    act(() => result.current.toggleOption('opt-1'));
    expect(result.current.selectedOptionIds).not.toContain('opt-1');
  });

  it('recalculates price when options change', async () => {
    vi.mocked(priceUseCase.calculatePrice).mockResolvedValue(50000);
    const { result } = renderHookWithProviders(() => useConfigurator('car-1'));
    await vi.waitFor(() => expect(result.current.car).not.toBeNull());

    act(() => result.current.toggleOption('opt-1'));

    await vi.waitFor(() => {
      expect(priceUseCase.calculatePrice).toHaveBeenCalledWith('car-1', ['opt-1']);
    });
  });
});
