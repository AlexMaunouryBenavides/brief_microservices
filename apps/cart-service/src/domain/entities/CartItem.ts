import { CarSnapshot } from '../value-objects/CarSnapshot';
import { SelectedOptionSnapshot } from '../value-objects/SelectedOptionSnapshot';

export interface CartItemProps {
  id: string;
  carId: string;
  carSnapshot: CarSnapshot;
  selectedOptions: SelectedOptionSnapshot[];
  totalPrice: number;
  quantity: number;
}

export class CartItem {
  readonly id: string;
  readonly carId: string;
  readonly carSnapshot: CarSnapshot;
  readonly selectedOptions: SelectedOptionSnapshot[];
  readonly totalPrice: number;
  readonly quantity: number;

  constructor(props: CartItemProps) {
    this.id = props.id;
    this.carId = props.carId;
    this.carSnapshot = props.carSnapshot;
    this.selectedOptions = props.selectedOptions;
    this.totalPrice = props.totalPrice;
    this.quantity = props.quantity;
  }

  withQuantity(quantity: number): CartItem {
    return new CartItem({ ...this, quantity });
  }
}
