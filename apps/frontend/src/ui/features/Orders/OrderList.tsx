import { useOrders } from './useOrders';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600 bg-amber-50' },
  confirmed: { label: 'Confirmée', color: 'text-emerald-600 bg-emerald-50' },
  cancelled: { label: 'Annulée', color: 'text-zinc-500 bg-zinc-100' },
};

export function OrderList(): JSX.Element {
  const { orders, isLoading, error } = useOrders();

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-32 text-zinc-400 text-xs tracking-widest uppercase">
        Chargement…
      </div>
    );

  if (error)
    return <p role="alert" className="text-red-500 text-sm">{error}</p>;

  if (orders.length === 0)
    return (
      <p className="text-zinc-400 text-sm py-12">Aucune commande pour le moment.</p>
    );

  return (
    <ul className="divide-y divide-zinc-100">
      {orders.map((order) => {
        const status = statusConfig[order.status] ?? { label: order.status, color: 'text-zinc-500 bg-zinc-100' };
        return (
          <li key={order.id} className="flex items-center justify-between py-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                #{order.id.slice(0, 8)}
              </p>
              <p className="text-sm font-medium text-zinc-900">
                {order.totalAmount.toLocaleString('fr-FR')} €
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 ${status.color}`}>{status.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
