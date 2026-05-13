import { PricedCart } from '../../domain/ports/ICatalogClient';

export const TESLA_PRICED: PricedCart = {
  car: {
    carId: 'car-1',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    basePrice: 42000,
    imageUrl: 'https://example.com/model3.jpg',
  },
  selectedOptions: [
    { optionId: 'opt-1', name: 'Autopilot', additionalPrice: 3000 },
  ],
  totalPrice: 45000,
};

export const RENAULT_PRICED: PricedCart = {
  car: {
    carId: 'car-2',
    brand: 'Renault',
    model: 'Megane E-Tech',
    year: 2023,
    basePrice: 35000,
  },
  selectedOptions: [],
  totalPrice: 35000,
};
