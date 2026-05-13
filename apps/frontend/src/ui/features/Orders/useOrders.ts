import { useEffect, useState } from 'react';
import { getUserOrders } from '../../../application/use-cases/orders/getUserOrders.usecase';
import type { Order } from '../../../domain/models/Order.model';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserOrders()
      .then(setOrders)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur'))
      .finally(() => setIsLoading(false));
  }, []);

  return { orders, isLoading, error };
}
