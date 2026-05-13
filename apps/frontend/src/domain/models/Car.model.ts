export interface CarOption {
  id: string;
  name: string;
  description?: string;
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
  description?: string;
  options: CarOption[];
}
