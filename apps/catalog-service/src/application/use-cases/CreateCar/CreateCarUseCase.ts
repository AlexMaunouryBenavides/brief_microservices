import { randomUUID } from 'crypto';
import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { Car } from '../../../domain/entities/Car';

export interface CreateCarDto {
  brand: string;
  model: string;
  year: number;
  rangeKm: number;
  powerKw: number;
  basePrice: number;
  imageUrl?: string;
  description?: string;
}

export class CreateCarUseCase {
  constructor(private readonly carRepo: ICarRepository) {}

  async execute(dto: CreateCarDto): Promise<Car> {
    const car = new Car({
      id: randomUUID(),
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      rangeKm: dto.rangeKm,
      powerKw: dto.powerKw,
      basePrice: dto.basePrice,
      imageUrl: dto.imageUrl,
      description: dto.description,
      options: [],
    });

    return this.carRepo.save(car);
  }
}
