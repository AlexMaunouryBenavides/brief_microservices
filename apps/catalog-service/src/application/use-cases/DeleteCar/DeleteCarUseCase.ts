import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { CarNotFoundError } from '../../../domain/errors/CatalogErrors';

export class DeleteCarUseCase {
  constructor(private readonly carRepo: ICarRepository) {}

  async execute(id: string): Promise<void> {
    const car = await this.carRepo.findById(id);
    if (!car) throw new CarNotFoundError(id);
    await this.carRepo.delete(id);
  }
}
