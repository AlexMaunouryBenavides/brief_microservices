import { Link } from 'react-router-dom';
import { useCarList } from './useCarList';

export function CarList(): JSX.Element {
  const { cars, isLoading, error } = useCarList();

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-32 text-zinc-400 text-sm tracking-widest uppercase">
        Chargement…
      </div>
    );

  if (error)
    return (
      <p role="alert" className="text-red-500 text-sm px-8 py-12">
        {error}
      </p>
    );

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100">
      {cars.map((car) => (
        <li key={car.id} className="group bg-white">
          <Link to={`/catalog/${car.id}`} className="block">
            <div className="overflow-hidden aspect-[16/9] bg-zinc-50">
              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs uppercase tracking-widest">
                  Aucune image
                </div>
              )}
            </div>
            <div className="px-6 py-5">
              <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                {car.brand} · {car.year}
              </p>
              <h2 className="text-lg font-light text-zinc-900 leading-snug">{car.model}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                {car.rangeKm} km · {car.powerKw} kW
              </p>
              <div className="flex items-end justify-between mt-4">
                <p className="text-sm text-zinc-900 font-medium">
                  À partir de{' '}
                  <span className="text-base">{car.basePrice.toLocaleString('fr-FR')} €</span>
                </p>
                <span className="text-xs text-zinc-400 border-b border-zinc-200 group-hover:border-zinc-900 group-hover:text-zinc-900 transition-colors pb-0.5">
                  Configurer →
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
