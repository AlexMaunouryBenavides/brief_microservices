export interface CartItemSnapshot {
  brand: string;
  model: string;
  basePrice: number;
}

export interface CartItemOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface CartItem {
  id: string;
  carId: string;
  carSnapshot: CartItemSnapshot;
  selectedOptions: CartItemOption[];
  totalPrice: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}
