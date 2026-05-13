import { useCallback, useEffect, useState } from 'react';
import { getCarById } from '../../../application/use-cases/catalog/getCarById.usecase';
import { calculatePrice } from '../../../application/use-cases/catalog/calculatePrice.usecase';
import type { Car } from '../../../domain/models/Car.model';

export function useConfigurator(carId: string) {
  const [car, setCar] = useState<Car | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCarById(carId)
      .then((c) => {
        setCar(c);
        setCurrentPrice(c.basePrice);
      })
      .finally(() => setIsLoading(false));
  }, [carId]);

  useEffect(() => {
    if (!car) return;
    calculatePrice(carId, selectedOptionIds).then(setCurrentPrice);
  }, [carId, selectedOptionIds, car]);

  const toggleOption = useCallback((optionId: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    );
  }, []);

  return { car, selectedOptionIds, toggleOption, currentPrice, isLoading };
}
