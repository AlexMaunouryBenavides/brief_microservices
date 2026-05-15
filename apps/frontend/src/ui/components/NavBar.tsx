import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaOpencart, FaJediOrder } from 'react-icons/fa';
import { IoCarSportSharp, IoClose, IoMenu } from 'react-icons/io5';
import { logout } from '../../application/store/auth.slice';
import { selectIsAuthenticated, selectIsAdmin, selectUser } from '../../application/store/auth.selectors';
import { useAppDispatch, useAppSelector } from '../../application/store/store';

export function NavBar(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const user = useAppSelector(selectUser);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 h-14 px-8 flex items-center justify-between">
        <Link to="/" className="font-brand text-xl text-zinc-900">
          EV Store
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-zinc-600">
          <li>
            <Link to="/catalog" className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
              <IoCarSportSharp size={16} />
              Catalogue
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/cart" className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
                  <FaOpencart size={16} />
                  Panier
                </Link>
              </li>
              <li>
                <Link to="/orders" className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
                  <FaJediOrder size={16} />
                  Commandes
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-5 text-sm">
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

        {/* Burger button (mobile only) */}
        <button
          className="md:hidden text-zinc-900 p-1"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <IoMenu size={24} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-zinc-900 flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between px-8 h-14 border-b border-zinc-800">
          <Link to="/" className="font-brand text-xl text-white">
            EV Store
          </Link>
          <button
            className="text-white p-1"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Mobile menu links */}
        <ul className="flex flex-col px-8 py-10 gap-2 flex-1">
          <li>
            <Link
              to="/catalog"
              className="flex items-center justify-between py-4 text-white text-lg border-b border-zinc-800 hover:text-zinc-300 transition-colors"
            >
              <span className="flex items-center gap-3">
                <IoCarSportSharp size={20} />
                Catalogue
              </span>
              <span className="text-zinc-600 text-sm">›</span>
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link
                  to="/cart"
                  className="flex items-center justify-between py-4 text-white text-lg border-b border-zinc-800 hover:text-zinc-300 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FaOpencart size={20} />
                    Panier
                  </span>
                  <span className="text-zinc-600 text-sm">›</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="flex items-center justify-between py-4 text-white text-lg border-b border-zinc-800 hover:text-zinc-300 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FaJediOrder size={20} />
                    Commandes
                  </span>
                  <span className="text-zinc-600 text-sm">›</span>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center justify-between py-4 text-white text-lg border-b border-zinc-800 hover:text-zinc-300 transition-colors"
                >
                  {user?.firstName ?? 'Profil'}
                  <span className="text-zinc-600 text-sm">›</span>
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center justify-between py-4 text-white text-lg border-b border-zinc-800 hover:text-zinc-300 transition-colors"
                  >
                    Admin
                    <span className="text-zinc-600 text-sm">›</span>
                  </Link>
                </li>
              )}
              <li className="mt-4">
                <button
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li className="mt-6 flex flex-col gap-4">
              <Link to="/login" className="text-zinc-300 hover:text-white transition-colors text-lg">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-white text-zinc-900 text-sm px-5 py-3 text-center tracking-wide hover:bg-zinc-200 transition-colors"
              >
                Créer un compte
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
