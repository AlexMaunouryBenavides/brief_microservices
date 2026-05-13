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
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-lg font-bold text-blue-700">EV Store</Link>
      <ul className="flex items-center gap-4 text-sm">
        <li><Link to="/catalog" className="hover:text-blue-600">Catalogue</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/cart" className="hover:text-blue-600">Panier</Link></li>
            <li><Link to="/orders" className="hover:text-blue-600">Commandes</Link></li>
            <li><Link to="/profile" className="hover:text-blue-600">{user?.firstName ?? 'Profil'}</Link></li>
            {isAdmin && <li><Link to="/admin" className="hover:text-blue-600">Admin</Link></li>}
            <li>
              <button onClick={handleLogout} className="text-red-500 hover:underline">
                Déconnexion
              </button>
            </li>
          </>
        )}
        {!isAuthenticated && (
          <>
            <li><Link to="/login" className="hover:text-blue-600">Connexion</Link></li>
            <li><Link to="/register" className="hover:text-blue-600">Inscription</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
