import { type FormEvent, useState } from 'react';
import { useRegisterForm } from './useRegisterForm';

export function RegisterForm(): JSX.Element {
  const { submit, isLoading, error } = useRegisterForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit({ email, password, firstName, lastName });
  };

  const inputClass =
    'border-0 border-b border-zinc-200 focus:border-zinc-900 outline-none bg-transparent py-2 text-sm text-zinc-900 transition-colors';
  const labelClass = 'text-[10px] uppercase tracking-widest text-zinc-400';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {error && (
        <p role="alert" className="text-red-500 text-xs tracking-wide">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className={labelClass}>Prénom</label>
          <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputClass} placeholder="Jean" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className={labelClass}>Nom</label>
          <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClass} placeholder="Dupont" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="votre@email.com" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelClass}>Mot de passe</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} placeholder="••••••••" />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-zinc-900 text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-zinc-700 transition-colors disabled:opacity-40"
      >
        {isLoading ? 'Création…' : 'Créer mon compte'}
      </button>
    </form>
  );
}
