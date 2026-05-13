import { CalculatePriceUseCase } from './CalculatePriceUseCase';
import { InMemoryCarRepository } from '../../../__tests__/fakes/InMemoryCarRepository';
import { buildCar, buildOption } from '../../../__tests__/fixtures/catalog.fixtures';
import {
  CarNotFoundError,
  OptionNotBelongToCarError,
} from '../../../domain/errors/CatalogErrors';

describe('CalculatePriceUseCase', () => {
  let useCase: CalculatePriceUseCase;
  let repo: InMemoryCarRepository;

  const opt1 = buildOption({ id: 'opt-1', carId: 'car-1', additionalPrice: 3000 });
  const opt2 = buildOption({ id: 'opt-2', carId: 'car-1', name: 'Premium Sound', additionalPrice: 1500 });
  const otherCarOpt = buildOption({ id: 'opt-3', carId: 'car-2', additionalPrice: 500 });

  beforeEach(async () => {
    repo = new InMemoryCarRepository();
    useCase = new CalculatePriceUseCase(repo);

    await repo.save(buildCar({ id: 'car-1', basePrice: 42000, options: [opt1, opt2] }));
    await repo.save(buildCar({ id: 'car-2', basePrice: 30000, options: [otherCarOpt] }));
  });

  it('returns basePrice when no options are selected', async () => {
    const { totalPrice } = await useCase.execute({ carId: 'car-1', optionIds: [] });
    expect(totalPrice).toBe(42000);
  });

  it('returns basePrice + single option price', async () => {
    const { totalPrice } = await useCase.execute({ carId: 'car-1', optionIds: ['opt-1'] });
    expect(totalPrice).toBe(45000);
  });

  it('sums multiple options correctly', async () => {
    const { totalPrice } = await useCase.execute({ carId: 'car-1', optionIds: ['opt-1', 'opt-2'] });
    expect(totalPrice).toBe(46500);
  });

  it('throws CarNotFoundError for unknown car', async () => {
    await expect(
      useCase.execute({ carId: 'unknown', optionIds: [] }),
    ).rejects.toThrow(CarNotFoundError);
  });

  it('throws OptionNotBelongToCarError when option belongs to another car', async () => {
    await expect(
      useCase.execute({ carId: 'car-1', optionIds: ['opt-3'] }),
    ).rejects.toThrow(OptionNotBelongToCarError);
  });

  it('throws OptionNotBelongToCarError for completely unknown optionId', async () => {
    await expect(
      useCase.execute({ carId: 'car-1', optionIds: ['nonexistent'] }),
    ).rejects.toThrow(OptionNotBelongToCarError);
  });
});
