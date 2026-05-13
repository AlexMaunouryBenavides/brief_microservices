import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { Car } from '../../../domain/entities/Car';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

export class GetCarByIdUseCase {
  constructor(private readonly carRepo: ICarRepository) {}

  async execute(id: string): Promise<Car> {
    const car = await this.carRepo.findById(id);
    if (!car) throw new CarNotFoundError(id);
    return car;
  }
}
