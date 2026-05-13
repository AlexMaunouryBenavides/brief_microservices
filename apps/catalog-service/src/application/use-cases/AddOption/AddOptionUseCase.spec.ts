import { AddOptionUseCase } from './AddOptionUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { InMemoryOptionRepository } from '../../../__tests__/fakes/InMemoryOptionRepository';
import { buildCar } from '../../../__tests__/fixtures/catalog.fixtures';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';
import { Option } from '../../../domain/entities/Option';

describe('AddOptionUseCase', () => {
  let useCase: AddOptionUseCase;
  let carRepo: InMemoryCarRepository;
  let optionRepo: InMemoryOptionRepository;

  beforeEach(async () => {
    carRepo = new InMemoryCarRepository();
    optionRepo = new InMemoryOptionRepository();
    useCase = new AddOptionUseCase(carRepo, optionRepo);
    await carRepo.save(buildCar({ id: 'car-1' }));
  });

  it('creates and persists an option linked to the car', async () => {
    const option = await useCase.execute({
      carId: 'car-1',
      name: 'Glass Roof',
      additionalPrice: 1200,
    });

    expect(option).toBeInstanceOf(Option);
    expect(option.carId).toBe('car-1');
    expect(option.name).toBe('Glass Roof');
    expect(option.additionalPrice).toBe(1200);
    expect(option.id).toBeTruthy();

    const saved = await optionRepo.findByCarId('car-1');
    expect(saved).toHaveLength(1);
  });

  it('also adds the option to the car in the car repository', async () => {
    await useCase.execute({ carId: 'car-1', name: 'Glass Roof', additionalPrice: 1200 });

    const car = await carRepo.findById('car-1');
    expect(car?.options).toHaveLength(1);
  });

  it('throws CarNotFoundError for unknown carId', async () => {
    await expect(
      useCase.execute({ carId: 'unknown', name: 'X', additionalPrice: 100 }),
    ).rejects.toThrow(CarNotFoundError);
  });
});
