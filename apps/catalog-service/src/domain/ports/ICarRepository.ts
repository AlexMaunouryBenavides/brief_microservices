import { Car } from '../entities/Car';

export interface ICarRepository {
  findAll(): Promise<Car[]>;
  findById(id: string): Promise<Car | null>;
  save(car: Car): Promise<Car>;
  update(car: Car): Promise<Car>;
  delete(id: string): Promise<void>;
}
