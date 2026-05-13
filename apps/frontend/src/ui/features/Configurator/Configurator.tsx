import { useConfigurator } from './useConfigurator';
import { addToCart } from '../../../application/use-cases/cart/addToCart.usecase';
import { useNavigate } from 'react-router-dom';

interface Props {
  carId: string;
}

export function Configurator({ carId }: Props): JSX.Element {
  const { car, selectedOptionIds, toggleOption, currentPrice, isLoading } = useConfigurator(carId);
  const navigate = useNavigate();

  if (isLoading || !car)
    return (
      <div className="flex items-center justify-center py-32 text-zinc-400 text-xs tracking-widest uppercase">
        Chargement…
      </div>
    );

  const handleAddToCart = async () => {
    await addToCart(carId, selectedOptionIds);
    navigate('/cart');
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-3.5rem)]">
      <div className="bg-zinc-50 flex items-center justify-center p-12">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="w-full max-w-lg object-contain"
          />
        ) : (
          <div className="w-full aspect-video bg-zinc-100 flex items-center justify-center text-zinc-300 text-xs uppercase tracking-widest">
            Aucune image
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between px-12 py-16 bg-white">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">{car.brand}</p>
          <h1 className="text-3xl font-light text-zinc-900">{car.model}</h1>
          <p className="text-sm text-zinc-400 mt-2">
            {car.year} · {car.rangeKm} km d'autonomie · {car.powerKw} kW
          </p>
          {car.description && (
            <p className="text-sm text-zinc-500 mt-4 leading-relaxed max-w-sm">{car.description}</p>
          )}

          {car.options.length > 0 && (
            <section className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Options</p>
              <ul className="flex flex-col divide-y divide-zinc-100">
                {car.options.map((option) => {
                  const checked = selectedOptionIds.includes(option.id);
                  return (
                    <li key={option.id}>
                      <label
                        htmlFor={`opt-${option.id}`}
                        className="flex items-center justify-between py-3.5 cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                              checked ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 group-hover:border-zinc-500'
                            }`}
                          >
                            {checked && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            id={`opt-${option.id}`}
                            aria-label={option.name}
                            checked={checked}
                            onChange={() => toggleOption(option.id)}
                            className="sr-only"
                          />
                          <div>
                            <p className="text-sm text-zinc-900">{option.name}</p>
                            {option.description && (
                              <p className="text-xs text-zinc-400 mt-0.5">{option.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-zinc-500 ml-4 shrink-0">
                          +{option.additionalPrice.toLocaleString('fr-FR')} €
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <div className="border-t border-zinc-100 pt-8 mt-8">
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-xs text-zinc-400 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-light text-zinc-900">
              {currentPrice.toLocaleString('fr-FR')} €
            </p>
          </div>
          <button
            onClick={() => void handleAddToCart()}
            className="w-full bg-zinc-900 text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-zinc-700 transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
