import { getCarByIdApi } from '../../../infrastructure/api/catalog.api';
import type { Car } from '../../../domain/models/Car.model';

export const getCarById = (id: string): Promise<Car> => getCarByIdApi(id);
