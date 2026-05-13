import { createOrderApi } from '../../../infrastructure/api/orders.api';
import type { Order } from '../../../domain/models/Order.model';

export const createOrder = (): Promise<Order> => createOrderApi();
