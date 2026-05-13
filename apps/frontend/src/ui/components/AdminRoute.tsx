import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectIsAdmin } from '../../application/store/auth.selectors';
import { useAppSelector } from '../../application/store/store';

export function AdminRoute(): JSX.Element {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
