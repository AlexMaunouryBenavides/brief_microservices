import { randomUUID } from 'crypto';
import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { IOptionRepository } from '../../../domain/ports/IOptionRepository';
import { Option } from '../../../domain/entities/Option';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

export interface AddOptionDto {
  carId: string;
  name: string;
  description?: string;
  additionalPrice: number;
}

export class AddOptionUseCase {
  constructor(
    private readonly carRepo: ICarRepository,
    private readonly optionRepo: IOptionRepository,
  ) {}

  async execute(dto: AddOptionDto): Promise<Option> {
    const car = await this.carRepo.findById(dto.carId);
    if (!car) throw new CarNotFoundError(dto.carId);

    const option = new Option({
      id: randomUUID(),
      carId: dto.carId,
      name: dto.name,
      description: dto.description,
      additionalPrice: dto.additionalPrice,
    });

    const saved = await this.optionRepo.save(option);
    await this.carRepo.update(car.withOptions([...car.options, saved]));

    return saved;
  }
}
