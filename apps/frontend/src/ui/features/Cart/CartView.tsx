import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import { createOrder } from '../../../application/use-cases/orders/createOrder.usecase';

export function CartView(): JSX.Element {
  const { cart, isLoading, removeItem } = useCart();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-32 text-zinc-400 text-xs tracking-widest uppercase">
        Chargement…
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-zinc-400 text-sm">Votre panier est vide.</p>
        <Link
          to="/catalog"
          className="text-xs uppercase tracking-[0.2em] text-zinc-900 border-b border-zinc-300 hover:border-zinc-900 transition-colors pb-0.5"
        >
          Voir le catalogue
        </Link>
      </div>
    );

  const total = cart.items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  const handleOrder = async () => {
    await createOrder();
    navigate('/orders');
  };

  return (
    <div>
      <ul className="divide-y divide-zinc-100">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between py-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">
                {item.carSnapshot.brand} {item.carSnapshot.model}
              </p>
              {item.selectedOptions.length > 0 && (
                <p className="text-xs text-zinc-400 mt-1">
                  {item.selectedOptions.map((o) => o.name).join(' · ')}
                </p>
              )}
              <p className="text-xs text-zinc-400 mt-1">Qté : {item.quantity}</p>
            </div>
            <div className="flex items-center gap-6 ml-8">
              <span className="text-sm text-zinc-900">
                {item.totalPrice.toLocaleString('fr-FR')} €
              </span>
              <button
                onClick={() => void removeItem(item.id)}
                className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                Retirer
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-zinc-200 pt-6 mt-2">
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Total</p>
          <p className="text-2xl font-light text-zinc-900">{total.toLocaleString('fr-FR')} €</p>
        </div>
        <button
          onClick={() => void handleOrder()}
          className="w-full bg-zinc-900 text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-zinc-700 transition-colors"
        >
          Passer commande
        </button>
      </div>
    </div>
  );
}
