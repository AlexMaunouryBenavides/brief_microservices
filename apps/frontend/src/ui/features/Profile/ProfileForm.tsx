import { type FormEvent, useEffect, useState } from 'react';
import { useProfile } from './useProfile';

export function ProfileForm(): JSX.Element {
  const { user, isLoading, isSaving, update } = useProfile();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  if (isLoading) return <p>Chargement du profil...</p>;
  if (!user) return <p>Utilisateur introuvable.</p>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await update({ firstName, lastName });
    setSuccess(true);
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4 max-w-sm">
      {success && <p className="text-green-600 text-sm">Profil mis à jour.</p>}
      <div className="flex flex-col gap-1">
        <label htmlFor="firstName" className="text-sm font-medium">Prénom</label>
        <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border rounded px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="lastName" className="text-sm font-medium">Nom</label>
        <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border rounded px-3 py-2 text-sm" />
      </div>
      <p className="text-sm text-gray-500">{user.email}</p>
      <button type="submit" disabled={isSaving} className="bg-blue-600 text-white rounded px-4 py-2 font-medium disabled:opacity-50">
        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
