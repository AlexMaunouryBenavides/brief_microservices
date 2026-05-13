import { DeleteOptionUseCase } from './DeleteOptionUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { InMemoryOptionRepository } from '../../../__tests__/fakes/InMemoryOptionRepository';
import { buildCar, buildOption } from '../../../__tests__/fixtures/catalog.fixtures';
import {
  CarNotFoundError,
  OptionNotFoundError,
  OptionNotBelongToCarError,
} from '../../../domain/errors/CatalogErrors';

describe('DeleteOptionUseCase', () => {
  let useCase: DeleteOptionUseCase;
  let carRepo: InMemoryCarRepository;
  let optionRepo: InMemoryOptionRepository;

  beforeEach(async () => {
    carRepo = new InMemoryCarRepository();
    optionRepo = new InMemoryOptionRepository();
    useCase = new DeleteOptionUseCase(carRepo, optionRepo);

    const opt = buildOption({ id: 'opt-1', carId: 'car-1' });
    await optionRepo.save(opt);
    await carRepo.save(buildCar({ id: 'car-1', options: [opt] }));
  });

  it('removes the option from the option repository', async () => {
    await useCase.execute('car-1', 'opt-1');
    expect(await optionRepo.findById('opt-1')).toBeNull();
  });

  it('also removes the option from the car', async () => {
    await useCase.execute('car-1', 'opt-1');
    const car = await carRepo.findById('car-1');
    expect(car?.options).toHaveLength(0);
  });

  it('throws CarNotFoundError for unknown carId', async () => {
    await expect(useCase.execute('unknown', 'opt-1')).rejects.toThrow(CarNotFoundError);
  });

  it('throws OptionNotFoundError for unknown optionId', async () => {
    await expect(useCase.execute('car-1', 'unknown-opt')).rejects.toThrow(OptionNotFoundError);
  });

  it('throws OptionNotBelongToCarError when option belongs to another car', async () => {
    const foreignOpt = buildOption({ id: 'opt-99', carId: 'car-2' });
    await optionRepo.save(foreignOpt);
    await expect(useCase.execute('car-1', 'opt-99')).rejects.toThrow(OptionNotBelongToCarError);
  });
});
