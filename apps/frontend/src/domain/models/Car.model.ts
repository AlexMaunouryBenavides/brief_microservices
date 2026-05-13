export interface CarOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  rangeKm: number;
  powerKw: number;
  basePrice: number;
  imageUrl: string;
  options: CarOption[];
}
