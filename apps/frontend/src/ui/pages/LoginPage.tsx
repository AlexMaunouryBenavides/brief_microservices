import { Link } from 'react-router-dom';
import { LoginForm } from '../features/Auth/LoginForm';

export default function LoginPage(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
