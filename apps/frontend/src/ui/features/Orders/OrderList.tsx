import { Link } from 'react-router-dom';
import { useOrders } from './useOrders';

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
};

export function OrderList(): JSX.Element {
  const { orders, isLoading, error } = useOrders();

  if (isLoading) return <p>Chargement des commandes...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  if (orders.length === 0)
    return <p className="text-gray-500">Aucune commande pour le moment.</p>;

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id} className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">#{order.id.slice(0, 8)}</p>
            <p className="font-bold">{order.totalAmount.toLocaleString('fr-FR')} €</p>
            <p className="text-sm">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
              {statusLabels[order.status] ?? order.status}
            </span>
            <Link to={`/orders/${order.id}`} className="text-blue-600 text-sm hover:underline">
              Détails
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
