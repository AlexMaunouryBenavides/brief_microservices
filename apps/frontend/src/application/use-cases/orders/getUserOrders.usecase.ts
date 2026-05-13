import { getUserOrdersApi } from '../../../infrastructure/api/orders.api';
import type { Order } from '../../../domain/models/Order.model';

export const getUserOrders = (): Promise<Order[]> => getUserOrdersApi();
