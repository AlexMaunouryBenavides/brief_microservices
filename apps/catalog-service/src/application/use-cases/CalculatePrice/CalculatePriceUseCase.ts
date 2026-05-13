import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { CarNotFoundError, OptionNotBelongToCarError } from '../../../domain/errors/CatalogErrors';

export interface CalculatePriceDto {
  carId: string;
  optionIds: string[];
}

export interface PriceResult {
  totalPrice: number;
  basePrice: number;
  selectedOptions: Array<{ id: string; name: string; additionalPrice: number }>;
}

export class CalculatePriceUseCase {
  constructor(private readonly carRepo: ICarRepository) {}

  async execute(dto: CalculatePriceDto): Promise<PriceResult> {
    const car = await this.carRepo.findById(dto.carId);
    if (!car) throw new CarNotFoundError(dto.carId);

    const selectedOptions: PriceResult['selectedOptions'] = [];

    for (const optionId of dto.optionIds) {
      const option = car.options.find((o) => o.id === optionId);
      if (!option) throw new OptionNotBelongToCarError(optionId, dto.carId);
      selectedOptions.push({
        id: option.id,
        name: option.name,
        additionalPrice: option.additionalPrice,
      });
    }

    const totalPrice =
      car.basePrice + selectedOptions.reduce((sum, o) => sum + o.additionalPrice, 0);

    return { totalPrice, basePrice: car.basePrice, selectedOptions };
  }
}
