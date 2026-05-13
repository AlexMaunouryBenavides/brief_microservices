import { ICarRepository } from '../../domain/ports/ICarRepository';
import { Car } from '../../domain/entities/Car';

export class InMemoryCarRepository implements ICarRepository {
  private cars: Map<string, Car> = new Map();

  async findAll(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async findById(id: string): Promise<Car | null> {
    return this.cars.get(id) ?? null;
  }

  async save(car: Car): Promise<Car> {
    this.cars.set(car.id, car);
    return car;
  }

  async update(car: Car): Promise<Car> {
    this.cars.set(car.id, car);
    return car;
  }

  async delete(id: string): Promise<void> {
    this.cars.delete(id);
  }

  clear(): void {
    this.cars.clear();
  }
}
