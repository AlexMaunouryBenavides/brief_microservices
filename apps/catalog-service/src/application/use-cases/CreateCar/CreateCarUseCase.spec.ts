import { CreateCarUseCase } from './CreateCarUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { Car } from '../../../domain/entities/Car';

describe('CreateCarUseCase', () => {
  let useCase: CreateCarUseCase;
  let repo: InMemoryCarRepository;

  beforeEach(() => {
    repo = new InMemoryCarRepository();
    useCase = new CreateCarUseCase(repo);
  });

  it('creates and persists a car with no options', async () => {
    const car = await useCase.execute({
      brand: 'Tesla',
      model: 'Model Y',
      year: 2024,
      rangeKm: 533,
      powerKw: 220,
      basePrice: 47000,
    });

    expect(car).toBeInstanceOf(Car);
    expect(car.brand).toBe('Tesla');
    expect(car.options).toEqual([]);
    expect(car.id).toBeTruthy();

    const saved = await repo.findById(car.id);
    expect(saved).not.toBeNull();
  });

  it('assigns optional fields when provided', async () => {
    const car = await useCase.execute({
      brand: 'Renault',
      model: 'Megane E-Tech',
      year: 2023,
      rangeKm: 470,
      powerKw: 160,
      basePrice: 35000,
      imageUrl: 'https://example.com/megane.jpg',
      description: 'Comfort trim',
    });

    expect(car.imageUrl).toBe('https://example.com/megane.jpg');
    expect(car.description).toBe('Comfort trim');
  });
});
