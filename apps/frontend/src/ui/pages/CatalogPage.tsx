import { CarList } from '../features/Catalog/CarList';

export default function CatalogPage(): JSX.Element {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catalogue</h1>
      <CarList />
    </main>
  );
}
