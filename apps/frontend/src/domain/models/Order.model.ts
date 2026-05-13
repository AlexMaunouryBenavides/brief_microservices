export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface OrderItemSnapshot {
  brand: string;
  model: string;
  basePrice: number;
}

export interface OrderItemOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface OrderItem {
  id: string;
  carId: string;
  carSnapshot: OrderItemSnapshot;
  selectedOptions: OrderItemOption[];
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
