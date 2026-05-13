import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './application/store/store';
import { NavBar } from './ui/components/NavBar';
import { PrivateRoute } from './ui/components/PrivateRoute';
import { AdminRoute } from './ui/components/AdminRoute';

const LoginPage = lazy(() => import('./ui/pages/LoginPage'));
const RegisterPage = lazy(() => import('./ui/pages/RegisterPage'));
const CatalogPage = lazy(() => import('./ui/pages/CatalogPage'));
const CarDetailPage = lazy(() => import('./ui/pages/CarDetailPage'));
const CartPage = lazy(() => import('./ui/pages/CartPage'));
const OrdersPage = lazy(() => import('./ui/pages/OrdersPage'));
const ProfilePage = lazy(() => import('./ui/pages/ProfilePage'));
const AdminPage = lazy(() => import('./ui/pages/AdminPage'));

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Suspense fallback={<p className="p-8">Chargement...</p>}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:id" element={<CarDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}
