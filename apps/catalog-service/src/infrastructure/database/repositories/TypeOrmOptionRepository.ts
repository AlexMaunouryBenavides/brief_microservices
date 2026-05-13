import { Repository } from 'typeorm';
import { IOptionRepository } from '../../../domain/ports/IOptionRepository';
import { Option } from '../../../domain/entities/Option';
import { OptionEntity } from '../entities/OptionEntity';
import { CatalogMapper } from '../mappers/CatalogMapper';

export class TypeOrmOptionRepository implements IOptionRepository {
  constructor(private readonly repo: Repository<OptionEntity>) {}

  async findById(id: string): Promise<Option | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? CatalogMapper.optionToDomain(entity) : null;
  }

  async findByCarId(carId: string): Promise<Option[]> {
    const entities = await this.repo.findBy({ carId });
    return entities.map(CatalogMapper.optionToDomain);
  }

  async save(option: Option): Promise<Option> {
    const entity = CatalogMapper.optionToEntity(option);
    const saved = await this.repo.save(entity);
    return CatalogMapper.optionToDomain(saved);
  }

  async update(option: Option): Promise<Option> {
    const entity = CatalogMapper.optionToEntity(option);
    const saved = await this.repo.save(entity);
    return CatalogMapper.optionToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
