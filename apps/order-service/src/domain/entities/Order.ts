export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface OrderItemProps {
  id: string;
  carId: string;
  carSnapshot: { brand: string; model: string; basePrice: number };
  selectedOptions: { id: string; name: string; additionalPrice: number }[];
  unitPrice: number;
  quantity: number;
}

export class OrderItem {
  readonly id: string;
  readonly carId: string;
  readonly carSnapshot: { brand: string; model: string; basePrice: number };
  readonly selectedOptions: { id: string; name: string; additionalPrice: number }[];
  readonly unitPrice: number;
  readonly quantity: number;

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this.carId = props.carId;
    this.carSnapshot = props.carSnapshot;
    this.selectedOptions = props.selectedOptions;
    this.unitPrice = props.unitPrice;
    this.quantity = props.quantity;
  }
}

export interface OrderProps {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

export class Order {
  readonly id: string;
  readonly userId: string;
  readonly items: OrderItem[];
  readonly totalAmount: number;
  readonly status: OrderStatus;
  readonly createdAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.items = props.items;
    this.totalAmount = props.totalAmount;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }
}
