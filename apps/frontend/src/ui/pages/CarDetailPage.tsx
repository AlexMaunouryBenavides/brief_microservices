import { useParams } from 'react-router-dom';
import { Configurator } from '../features/Configurator/Configurator';

export default function CarDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Identifiant de véhicule manquant.</p>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Configurator carId={id} />
    </main>
  );
}
