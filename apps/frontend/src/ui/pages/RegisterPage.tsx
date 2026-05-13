import { Link } from 'react-router-dom';
import { RegisterForm } from '../features/Auth/RegisterForm';

export default function RegisterPage(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
