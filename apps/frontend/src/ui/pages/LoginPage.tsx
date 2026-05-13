import { Link } from 'react-router-dom';
import { LoginForm } from '../features/Auth/LoginForm';

export default function LoginPage(): JSX.Element {
  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-zinc-900 items-end p-16">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">EV Store</p>
          <h2 className="text-4xl font-light text-white leading-tight">
            L'avenir de la mobilité,<br />à portée de main.
          </h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-8">EV Store</p>
          <h1 className="text-2xl font-light text-zinc-900 mb-10">Connexion</h1>
          <LoginForm />
          <p className="mt-8 text-xs text-zinc-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-zinc-900 border-b border-zinc-300 hover:border-zinc-900 transition-colors pb-0.5">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
