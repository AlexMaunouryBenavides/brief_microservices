export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface IOrderItemSnapshot {
  brand: string;
  model: string;
  basePrice: number;
}

export interface IOrderItemOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface IOrderItem {
  id: string;
  carId: string;
  carSnapshot: IOrderItemSnapshot;
  selectedOptions: IOrderItemOption[];
  unitPrice: number;
  quantity: number;
}

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}
