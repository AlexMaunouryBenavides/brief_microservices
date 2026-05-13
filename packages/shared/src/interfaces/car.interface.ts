export interface ICar {
  id: string;
  brand: string;
  model: string;
  year: number;
  rangeKm: number;
  powerKw: number;
  basePrice: number;
  imageUrl?: string;
  description?: string;
  options: IOption[];
}

export interface IOption {
  id: string;
  carId: string;
  name: string;
  description?: string;
  additionalPrice: number;
}
