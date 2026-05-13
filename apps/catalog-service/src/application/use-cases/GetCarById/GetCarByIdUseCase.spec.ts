import { GetCarByIdUseCase } from './GetCarByIdUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { buildCar, buildOption } from '../../../__tests__/fixtures/catalog.fixtures';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

describe('GetCarByIdUseCase', () => {
  let useCase: GetCarByIdUseCase;
  let repo: InMemoryCarRepository;

  beforeEach(() => {
    repo = new InMemoryCarRepository();
    useCase = new GetCarByIdUseCase(repo);
  });

  it('returns the car with its options', async () => {
    const option = buildOption({ id: 'opt-1', carId: 'car-1' });
    const car = buildCar({ id: 'car-1', options: [option] });
    await repo.save(car);

    const result = await useCase.execute('car-1');
    expect(result.id).toBe('car-1');
    expect(result.options).toHaveLength(1);
    expect(result.options[0].name).toBe('Autopilot');
  });

  it('throws CarNotFoundError for unknown id', async () => {
    await expect(useCase.execute('unknown')).rejects.toThrow(CarNotFoundError);
  });
});
