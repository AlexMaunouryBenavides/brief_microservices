import { Car } from '../../../domain/entities/Car';
import { Option } from '../../../domain/entities/Option';
import { CarEntity } from '../entities/CarEntity';
import { OptionEntity } from '../entities/OptionEntity';

export class CatalogMapper {
  static optionToDomain(entity: OptionEntity): Option {
    return new Option({
      id: entity.id,
      carId: entity.carId,
      name: entity.name,
      description: entity.description ?? undefined,
      additionalPrice: Number(entity.additionalPrice),
    });
  }

  static carToDomain(entity: CarEntity): Car {
    return new Car({
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      year: entity.year,
      rangeKm: entity.rangeKm,
      powerKw: entity.powerKw,
      basePrice: Number(entity.basePrice),
      imageUrl: entity.imageUrl ?? undefined,
      description: entity.description ?? undefined,
      options: (entity.options ?? []).map(CatalogMapper.optionToDomain),
    });
  }

  static optionToEntity(option: Option): OptionEntity {
    const entity = new OptionEntity();
    entity.id = option.id;
    entity.carId = option.carId;
    entity.name = option.name;
    entity.description = option.description ?? null;
    entity.additionalPrice = option.additionalPrice;
    return entity;
  }

  static carToEntity(car: Car): CarEntity {
    const entity = new CarEntity();
    entity.id = car.id;
    entity.brand = car.brand;
    entity.model = car.model;
    entity.year = car.year;
    entity.rangeKm = car.rangeKm;
    entity.powerKw = car.powerKw;
    entity.basePrice = car.basePrice;
    entity.imageUrl = car.imageUrl ?? null;
    entity.description = car.description ?? null;
    entity.options = car.options.map(CatalogMapper.optionToEntity);
    return entity;
  }
}
