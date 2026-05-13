import { UpdateOptionUseCase } from './UpdateOptionUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { InMemoryOptionRepository } from '../../../__tests__/fakes/InMemoryOptionRepository';
import { buildCar, buildOption } from '../../../__tests__/fixtures/catalog.fixtures';
import {
  CarNotFoundError,
  OptionNotFoundError,
  OptionNotBelongToCarError,
} from '../../../domain/errors/CatalogErrors';

describe('UpdateOptionUseCase', () => {
  let useCase: UpdateOptionUseCase;
  let carRepo: InMemoryCarRepository;
  let optionRepo: InMemoryOptionRepository;

  beforeEach(async () => {
    carRepo = new InMemoryCarRepository();
    optionRepo = new InMemoryOptionRepository();
    useCase = new UpdateOptionUseCase(carRepo, optionRepo);

    const opt = buildOption({ id: 'opt-1', carId: 'car-1', additionalPrice: 3000 });
    await optionRepo.save(opt);
    await carRepo.save(buildCar({ id: 'car-1', options: [opt] }));
  });

  it('updates option fields', async () => {
    const updated = await useCase.execute('car-1', 'opt-1', {
      name: 'Enhanced Autopilot',
      additionalPrice: 4000,
    });
    expect(updated.name).toBe('Enhanced Autopilot');
    expect(updated.additionalPrice).toBe(4000);
  });

  it('also updates the option snapshot inside the car', async () => {
    await useCase.execute('car-1', 'opt-1', { additionalPrice: 4000 });
    const car = await carRepo.findById('car-1');
    expect(car?.options[0].additionalPrice).toBe(4000);
  });

  it('throws CarNotFoundError for unknown carId', async () => {
    await expect(
      useCase.execute('unknown', 'opt-1', { name: 'X' }),
    ).rejects.toThrow(CarNotFoundError);
  });

  it('throws OptionNotFoundError for unknown optionId', async () => {
    await expect(
      useCase.execute('car-1', 'unknown-opt', { name: 'X' }),
    ).rejects.toThrow(OptionNotFoundError);
  });

  it('throws OptionNotBelongToCarError when option belongs to another car', async () => {
    const foreignOpt = buildOption({ id: 'opt-99', carId: 'car-2' });
    await optionRepo.save(foreignOpt);
    await expect(
      useCase.execute('car-1', 'opt-99', { name: 'X' }),
    ).rejects.toThrow(OptionNotBelongToCarError);
  });
});
