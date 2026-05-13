import { CartItem } from './CartItem';

export interface CartProps {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

export class Cart {
  readonly userId: string;
  readonly items: CartItem[];
  readonly updatedAt: Date;

  constructor(props: CartProps) {
    this.userId = props.userId;
    this.items = props.items;
    this.updatedAt = props.updatedAt;
  }

  addItem(item: CartItem): Cart {
    return new Cart({ ...this, items: [...this.items, item], updatedAt: new Date() });
  }

  removeItem(itemId: string): Cart {
    return new Cart({
      ...this,
      items: this.items.filter((i) => i.id !== itemId),
      updatedAt: new Date(),
    });
  }

  updateItemQuantity(itemId: string, quantity: number): Cart {
    return new Cart({
      ...this,
      items: this.items.map((i) => (i.id === itemId ? i.withQuantity(quantity) : i)),
      updatedAt: new Date(),
    });
  }

  clear(): Cart {
    return new Cart({ ...this, items: [], updatedAt: new Date() });
  }

  static empty(userId: string): Cart {
    return new Cart({ userId, items: [], updatedAt: new Date() });
  }
}
