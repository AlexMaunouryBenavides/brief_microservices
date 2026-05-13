import { useConfigurator } from './useConfigurator';
import { addToCart } from '../../../application/use-cases/cart/addToCart.usecase';
import { useNavigate } from 'react-router-dom';

interface Props {
  carId: string;
}

export function Configurator({ carId }: Props): JSX.Element {
  const { car, selectedOptionIds, toggleOption, currentPrice, isLoading } = useConfigurator(carId);
  const navigate = useNavigate();

  if (isLoading || !car) return <p>Chargement...</p>;

  const handleAddToCart = async () => {
    await addToCart(carId, selectedOptionIds);
    navigate('/cart');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          {car.brand} {car.model}
        </h1>
        <p className="text-gray-500">
          {car.year} · {car.rangeKm} km · {car.powerKw} kW
        </p>
      </div>

      {car.options.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Options</h2>
          <ul className="flex flex-col gap-2">
            {car.options.map((option) => (
              <li key={option.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`opt-${option.id}`}
                  aria-label={option.name}
                  checked={selectedOptionIds.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="w-4 h-4"
                />
                <label htmlFor={`opt-${option.id}`} className="flex-1 cursor-pointer">
                  {option.name}
                </label>
                <span className="text-sm text-gray-500">
                  +{option.additionalPrice.toLocaleString('fr-FR')} €
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-2xl font-bold">{currentPrice.toLocaleString('fr-FR')} €</p>
        <button
          onClick={() => void handleAddToCart()}
          className="bg-blue-600 text-white rounded px-6 py-3 font-medium hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
