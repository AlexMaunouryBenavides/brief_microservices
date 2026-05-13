import { CarList } from '../features/Catalog/CarList';

export default function CatalogPage(): JSX.Element {
  return (
    <main className="pt-14">
      <div className="px-8 py-16 border-b border-zinc-100">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
          Véhicules électriques
        </p>
        <h1 className="text-5xl font-light text-zinc-900 tracking-tight">Catalogue</h1>
        <p className="text-zinc-400 mt-3 text-sm max-w-md">
          Configurez votre prochain véhicule électrique et commandez en quelques clics.
        </p>
      </div>
      <CarList />
    </main>
  );
}
