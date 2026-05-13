import { Repository } from 'typeorm';
import { ICarRepository } from '../../../domain/ports/ICarRepository';
import { Car } from '../../../domain/entities/Car';
import { CarEntity } from '../entities/CarEntity';
import { CatalogMapper } from '../mappers/CatalogMapper';

export class TypeOrmCarRepository implements ICarRepository {
  constructor(private readonly repo: Repository<CarEntity>) {}

  async findAll(): Promise<Car[]> {
    const entities = await this.repo.find();
    return entities.map(CatalogMapper.carToDomain);
  }

  async findById(id: string): Promise<Car | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? CatalogMapper.carToDomain(entity) : null;
  }

  async save(car: Car): Promise<Car> {
    const entity = CatalogMapper.carToEntity(car);
    const saved = await this.repo.save(entity);
    return CatalogMapper.carToDomain(saved);
  }

  async update(car: Car): Promise<Car> {
    const entity = CatalogMapper.carToEntity(car);
    const saved = await this.repo.save(entity);
    return CatalogMapper.carToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
