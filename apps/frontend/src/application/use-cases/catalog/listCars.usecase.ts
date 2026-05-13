import { listCarsApi } from '../../../infrastructure/api/catalog.api';
import type { Car } from '../../../domain/models/Car.model';

export const listCars = (): Promise<Car[]> => listCarsApi();
