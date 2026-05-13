import { ListCarsUseCase } from './ListCarsUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { buildCar } from '../../../__tests__/fixtures/catalog.fixtures';

describe('ListCarsUseCase', () => {
  let useCase: ListCarsUseCase;
  let repo: InMemoryCarRepository;

  beforeEach(() => {
    repo = new InMemoryCarRepository();
    useCase = new ListCarsUseCase(repo);
  });

  it('returns an empty array when no cars exist', async () => {
    const cars = await useCase.execute();
    expect(cars).toEqual([]);
  });

  it('returns all persisted cars', async () => {
    await repo.save(buildCar({ id: 'car-1', brand: 'Tesla' }));
    await repo.save(buildCar({ id: 'car-2', brand: 'Renault', model: 'Megane E-Tech' }));

    const cars = await useCase.execute();
    expect(cars).toHaveLength(2);
    expect(cars.map((c) => c.brand)).toEqual(expect.arrayContaining(['Tesla', 'Renault']));
  });
});
