import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import { createOrder } from '../../../application/use-cases/orders/createOrder.usecase';

export function CartView(): JSX.Element {
  const { cart, isLoading, removeItem } = useCart();
  const navigate = useNavigate();

  if (isLoading) return <p>Chargement du panier...</p>;
  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Votre panier est vide.</p>
        <Link to="/catalog" className="mt-4 inline-block text-blue-600 underline">
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
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">
                {item.carSnapshot.brand} {item.carSnapshot.model}
              </p>
              {item.selectedOptions.length > 0 && (
                <p className="text-sm text-gray-500">
                  {item.selectedOptions.map((o) => o.name).join(', ')}
                </p>
              )}
              <p className="text-sm">Qté : {item.quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">{item.totalPrice.toLocaleString('fr-FR')} €</span>
              <button
                onClick={() => void removeItem(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xl font-bold">Total : {total.toLocaleString('fr-FR')} €</p>
        <button
          onClick={() => void handleOrder()}
          className="bg-green-600 text-white rounded px-6 py-3 font-medium hover:bg-green-700"
        >
          Commander
        </button>
      </div>
    </div>
  );
}
