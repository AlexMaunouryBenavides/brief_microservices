import { UpdateCarUseCase } from './UpdateCarUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { buildCar } from '../../../__tests__/fixtures/catalog.fixtures';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

describe('UpdateCarUseCase', () => {
  let useCase: UpdateCarUseCase;
  let repo: InMemoryCarRepository;

  beforeEach(async () => {
    repo = new InMemoryCarRepository();
    useCase = new UpdateCarUseCase(repo);
    await repo.save(buildCar({ id: 'car-1', brand: 'Tesla', basePrice: 42000 }));
  });

  it('updates provided fields', async () => {
    const updated = await useCase.execute('car-1', { brand: 'Tesla Motors', basePrice: 44000 });
    expect(updated.brand).toBe('Tesla Motors');
    expect(updated.basePrice).toBe(44000);
    expect(updated.model).toBe('Model 3');
  });

  it('persists the update', async () => {
    await useCase.execute('car-1', { rangeKm: 600 });
    const fetched = await repo.findById('car-1');
    expect(fetched?.rangeKm).toBe(600);
  });

  it('throws CarNotFoundError for unknown id', async () => {
    await expect(useCase.execute('unknown', { brand: 'X' })).rejects.toThrow(CarNotFoundError);
  });
});
