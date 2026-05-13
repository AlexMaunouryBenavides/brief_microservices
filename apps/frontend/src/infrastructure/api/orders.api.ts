import { apiClient } from './apiClient';
import type { Order } from '../../domain/models/Order.model';

export const createOrderApi = async (): Promise<Order> => {
  const { data } = await apiClient.post<Order>('/orders');
  return data;
};

export const getUserOrdersApi = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>('/orders');
  return data;
};

export const getOrderByIdApi = async (id: string): Promise<Order> => {
  const { data } = await apiClient.get<Order>(`/orders/${id}`);
  return data;
};
