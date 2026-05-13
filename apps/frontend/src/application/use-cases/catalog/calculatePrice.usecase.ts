import { calculatePriceApi } from '../../../infrastructure/api/catalog.api';

export const calculatePrice = (carId: string, optionIds: string[]): Promise<number> =>
  calculatePriceApi(carId, optionIds);
