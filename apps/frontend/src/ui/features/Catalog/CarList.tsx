import { Link } from 'react-router-dom';
import { useCarList } from './useCarList';

export function CarList(): JSX.Element {
  const { cars, isLoading, error } = useCarList();

  if (isLoading) return <p>Chargement des véhicules...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <li key={car.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {car.imageUrl && (
            <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold">
              {car.brand} {car.model}
            </h2>
            <p className="text-sm text-gray-500">{car.year} · {car.rangeKm} km · {car.powerKw} kW</p>
            <p className="text-xl font-bold mt-2">{car.basePrice.toLocaleString('fr-FR')} €</p>
            <Link
              to={`/catalog/${car.id}`}
              className="mt-3 inline-block bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700"
            >
              Configurer
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
