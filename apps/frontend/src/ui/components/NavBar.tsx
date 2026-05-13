import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../application/store/auth.slice';
import { selectIsAuthenticated, selectIsAdmin, selectUser } from '../../application/store/auth.selectors';
import { useAppDispatch, useAppSelector } from '../../application/store/store';

export function NavBar(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 h-14 px-8 flex items-center justify-between">
      <Link to="/" className="text-sm font-semibold tracking-[0.2em] uppercase text-zinc-900">
        EV Store
      </Link>

      <ul className="flex items-center gap-8 text-sm text-zinc-600">
        <li>
          <Link to="/catalog" className="hover:text-zinc-900 transition-colors">
            Catalogue
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/cart" className="hover:text-zinc-900 transition-colors">
                Panier
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-zinc-900 transition-colors">
                Commandes
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="flex items-center gap-5 text-sm">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              {user?.firstName ?? 'Profil'}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-zinc-900 text-white text-xs px-4 py-2 tracking-wide hover:bg-zinc-700 transition-colors"
            >
              Créer un compte
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
