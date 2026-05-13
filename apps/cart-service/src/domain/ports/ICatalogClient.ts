import { CarSnapshot } from '../value-objects/CarSnapshot';
import { SelectedOptionSnapshot } from '../value-objects/SelectedOptionSnapshot';

export interface PricedCart {
  car: CarSnapshot;
  selectedOptions: SelectedOptionSnapshot[];
  totalPrice: number;
}

export interface ICatalogClient {
  getCarWithPrice(carId: string, optionIds: string[]): Promise<PricedCart>;
}
