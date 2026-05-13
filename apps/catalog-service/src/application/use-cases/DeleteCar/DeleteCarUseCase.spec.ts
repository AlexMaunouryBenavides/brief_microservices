import { DeleteCarUseCase } from './DeleteCarUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { buildCar } from '../../../__tests__/fixtures/catalog.fixtures';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

describe('DeleteCarUseCase', () => {
  let useCase: DeleteCarUseCase;
  let repo: InMemoryCarRepository;

  beforeEach(async () => {
    repo = new InMemoryCarRepository();
    useCase = new DeleteCarUseCase(repo);
    await repo.save(buildCar({ id: 'car-1' }));
  });

  it('removes the car from the repository', async () => {
    await useCase.execute('car-1');
    expect(await repo.findById('car-1')).toBeNull();
  });

  it('throws CarNotFoundError for unknown id', async () => {
    await expect(useCase.execute('unknown')).rejects.toThrow(CarNotFoundError);
  });
});
