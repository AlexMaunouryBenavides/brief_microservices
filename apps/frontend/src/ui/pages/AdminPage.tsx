import { useState } from 'react';
import { apiClient } from '../../infrastructure/api/apiClient';
import type { Car } from '../../domain/models/Car.model';

interface CarFormData {
  brand: string;
  model: string;
  year: string;
  rangeKm: string;
  powerKw: string;
  basePrice: string;
  imageUrl: string;
}

const empty: CarFormData = { brand: '', model: '', year: '', rangeKm: '', powerKw: '', basePrice: '', imageUrl: '' };

export default function AdminPage(): JSX.Element {
  const [form, setForm] = useState<CarFormData>(empty);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiClient.post<Car>('/catalog/cars', {
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        rangeKm: Number(form.rangeKm),
        powerKw: Number(form.powerKw),
        basePrice: Number(form.basePrice),
        imageUrl: form.imageUrl,
      });
      setSuccess(true);
      setForm(empty);
    } catch {
      setError('Erreur lors de la création du véhicule.');
    }
  };

  const field = (key: keyof CarFormData, label: string, type = 'text') => (
    <div className="flex flex-col gap-1">
      <label htmlFor={key} className="text-sm font-medium">{label}</label>
      <input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="border rounded px-3 py-2 text-sm"
        required
      />
    </div>
  );

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Ajouter un véhicule</h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          {success && <p className="text-green-600 text-sm">Véhicule ajouté avec succès.</p>}
          {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
          {field('brand', 'Marque')}
          {field('model', 'Modèle')}
          {field('year', 'Année', 'number')}
          {field('rangeKm', 'Autonomie (km)', 'number')}
          {field('powerKw', 'Puissance (kW)', 'number')}
          {field('basePrice', 'Prix de base (€)', 'number')}
          {field('imageUrl', 'URL image')}
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700">
            Créer
          </button>
        </form>
      </section>
    </main>
  );
}
