import { type FormEvent, useState } from 'react';
import { useLoginForm } from './useLoginForm';

export function LoginForm(): JSX.Element {
  const { submit, isLoading, error } = useLoginForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {error && (
        <p role="alert" className="text-red-500 text-xs tracking-wide">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-zinc-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-0 border-b border-zinc-200 focus:border-zinc-900 outline-none bg-transparent py-2 text-sm text-zinc-900 placeholder:text-zinc-300 transition-colors"
          placeholder="votre@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-zinc-400">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-0 border-b border-zinc-200 focus:border-zinc-900 outline-none bg-transparent py-2 text-sm text-zinc-900 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-zinc-900 text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-zinc-700 transition-colors disabled:opacity-40"
      >
        {isLoading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
