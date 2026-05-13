import { useParams } from 'react-router-dom';
import { Configurator } from '../features/Configurator/Configurator';

export default function CarDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  if (!id)
    return (
      <main className="pt-14 flex items-center justify-center h-96 text-zinc-400 text-sm">
        Identifiant de véhicule manquant.
      </main>
    );

  return (
    <main className="pt-14">
      <Configurator carId={id} />
    </main>
  );
}
