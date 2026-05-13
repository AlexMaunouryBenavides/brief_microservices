export interface ICartItemSnapshot {
  brand: string;
  model: string;
  basePrice: number;
}

export interface ICartItemOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface ICartItem {
  id: string;
  carId: string;
  carSnapshot: ICartItemSnapshot;
  selectedOptions: ICartItemOption[];
  totalPrice: number;
  quantity: number;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  updatedAt: Date;
}
