import { useEffect, useState } from 'react';
import { listCars } from '../../../application/use-cases/catalog/listCars.usecase';
import type { Car } from '../../../domain/models/Car.model';

export function useCarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCars()
      .then(setCars)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur inconnue'))
      .finally(() => setIsLoading(false));
  }, []);

  return { cars, isLoading, error };
}
