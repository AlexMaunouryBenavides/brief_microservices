import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { IOptionRepository } from '../../../domain/ports/IOptionRepository';
import {
  CarNotFoundError,
  OptionNotFoundError,
  OptionNotBelongToCarError,
} from '../../../domain/errors/CatalogErrors';

export class DeleteOptionUseCase {
  constructor(
    private readonly carRepo: ICarRepository,
    private readonly optionRepo: IOptionRepository,
  ) {}

  async execute(carId: string, optionId: string): Promise<void> {
    const car = await this.carRepo.findById(carId);
    if (!car) throw new CarNotFoundError(carId);

    const option = await this.optionRepo.findById(optionId);
    if (!option) throw new OptionNotFoundError(optionId);

    if (option.carId !== carId) throw new OptionNotBelongToCarError(optionId, carId);

    await this.optionRepo.delete(optionId);

    const updatedOptions = car.options.filter((o) => o.id !== optionId);
    await this.carRepo.update(car.withOptions(updatedOptions));
  }
}
