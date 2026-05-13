import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { IOptionRepository } from '../../../domain/ports/IOptionRepository';
import { Option } from '../../../domain/entities/Option';
import {
  CarNotFoundError,
  OptionNotFoundError,
  OptionNotBelongToCarError,
} from '../../../domain/errors/CatalogErrors';

export interface UpdateOptionDto {
  name?: string;
  description?: string;
  additionalPrice?: number;
}

export class UpdateOptionUseCase {
  constructor(
    private readonly carRepo: ICarRepository,
    private readonly optionRepo: IOptionRepository,
  ) {}

  async execute(carId: string, optionId: string, dto: UpdateOptionDto): Promise<Option> {
    const car = await this.carRepo.findById(carId);
    if (!car) throw new CarNotFoundError(carId);

    const option = await this.optionRepo.findById(optionId);
    if (!option) throw new OptionNotFoundError(optionId);

    if (option.carId !== carId) throw new OptionNotBelongToCarError(optionId, carId);

    const updated = await this.optionRepo.update(option.withUpdated(dto));

    const updatedOptions = car.options.map((o) => (o.id === optionId ? updated : o));
    await this.carRepo.update(car.withOptions(updatedOptions));

    return updated;
  }
}
