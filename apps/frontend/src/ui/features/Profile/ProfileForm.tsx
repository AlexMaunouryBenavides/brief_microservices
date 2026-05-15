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

  if (isLoading)
    return (
      <div className="text-zinc-400 text-xs tracking-widest uppercase py-12">Chargement…</div>
    );
  if (!user)
    return <p className="text-zinc-400 text-sm">Utilisateur introuvable.</p>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await update({ firstName, lastName });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputClass =
    'border-0 border-b border-zinc-200 focus:border-zinc-900 outline-none bg-transparent py-2 text-sm text-zinc-900 transition-colors';
  const labelClass = 'text-[10px] uppercase tracking-widest text-zinc-400';

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-6">
      {success && (
        <p className="text-emerald-600 text-xs tracking-wide">Profil mis à jour.</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="firstName" className={labelClass}>Prénom</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lastName" className={labelClass}>Nom</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className={labelClass}>Email</p>
        <p className="py-2 text-sm text-zinc-400">{user.email}</p>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-2 w-full bg-zinc-900 text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-zinc-700 transition-colors disabled:opacity-40"
      >
        {isSaving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
