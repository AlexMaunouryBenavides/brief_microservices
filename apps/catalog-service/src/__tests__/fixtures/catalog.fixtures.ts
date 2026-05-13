import { Car } from '../../domain/entities/Car';
import { Option } from '../../domain/entities/Option';

export function buildOption(overrides: Partial<ConstructorParameters<typeof Option>[0]> = {}): Option {
  return new Option({
    id: 'opt-1',
    carId: 'car-1',
    name: 'Autopilot',
    description: 'Self-driving capability',
    additionalPrice: 3000,
    ...overrides,
  });
}

export function buildCar(overrides: Partial<ConstructorParameters<typeof Car>[0]> = {}): Car {
  return new Car({
    id: 'car-1',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    rangeKm: 550,
    powerKw: 258,
    basePrice: 42000,
    imageUrl: 'https://example.com/model3.jpg',
    description: 'Long Range',
    options: [],
    ...overrides,
  });
}
