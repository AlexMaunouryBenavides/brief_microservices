import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated } from '../../application/store/auth.selectors';
import { useAppSelector } from '../../application/store/store';

export function PrivateRoute(): JSX.Element {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
