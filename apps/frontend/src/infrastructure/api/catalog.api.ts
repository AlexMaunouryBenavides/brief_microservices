import { apiClient } from './apiClient';
import type { Car } from '../../domain/models/Car.model';

export const listCarsApi = async (): Promise<Car[]> => {
  const { data } = await apiClient.get<Car[]>('/catalog/cars');
  return data;
};

export const getCarByIdApi = async (id: string): Promise<Car> => {
  const { data } = await apiClient.get<Car>(`/catalog/cars/${id}`);
  return data;
};

export const calculatePriceApi = async (carId: string, optionIds: string[]): Promise<number> => {
  const params = optionIds.length > 0 ? `?optionIds=${optionIds.join(',')}` : '';
  const { data } = await apiClient.get<{ totalPrice: number }>(
    `/catalog/cars/${carId}/price${params}`,
  );
  return data.totalPrice;
};
