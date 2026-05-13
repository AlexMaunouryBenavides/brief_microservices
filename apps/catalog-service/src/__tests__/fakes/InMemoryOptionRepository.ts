import { IOptionRepository } from '../../domain/ports/IOptionRepository';
import { Option } from '../../domain/entities/Option';

export class InMemoryOptionRepository implements IOptionRepository {
  private options: Map<string, Option> = new Map();

  async findById(id: string): Promise<Option | null> {
    return this.options.get(id) ?? null;
  }

  async findByCarId(carId: string): Promise<Option[]> {
    return Array.from(this.options.values()).filter((o) => o.carId === carId);
  }

  async save(option: Option): Promise<Option> {
    this.options.set(option.id, option);
    return option;
  }

  async update(option: Option): Promise<Option> {
    this.options.set(option.id, option);
    return option;
  }

  async delete(id: string): Promise<void> {
    this.options.delete(id);
  }

  clear(): void {
    this.options.clear();
  }
}
