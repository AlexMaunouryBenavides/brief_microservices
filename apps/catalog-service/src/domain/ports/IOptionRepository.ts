import { Option } from '../entities/Option';

export interface IOptionRepository {
  findById(id: string): Promise<Option | null>;
  findByCarId(carId: string): Promise<Option[]>;
  save(option: Option): Promise<Option>;
  update(option: Option): Promise<Option>;
  delete(id: string): Promise<void>;
}
