import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { Car } from '../../../domain/entities/Car';

export class ListCarsUseCase {
  constructor(private readonly carRepo: ICarRepository) {}

  async execute(): Promise<Car[]> {
    return this.carRepo.findAll();
  }
}
