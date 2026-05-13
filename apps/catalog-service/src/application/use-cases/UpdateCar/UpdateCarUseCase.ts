import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { Car } from '../../../domain/entities/Car';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

export interface UpdateCarDto {
  brand?: string;
  model?: string;
  year?: number;
  rangeKm?: number;
  powerKw?: number;
  basePrice?: number;
  imageUrl?: string;
  description?: string;
}

export class UpdateCarUseCase {
  constructor(private readonly carRepo: ICarRepository) {}

  async execute(id: string, dto: UpdateCarDto): Promise<Car> {
    const car = await this.carRepo.findById(id);
    if (!car) throw new CarNotFoundError(id);

    return this.carRepo.update(car.withUpdated(dto));
  }
}
