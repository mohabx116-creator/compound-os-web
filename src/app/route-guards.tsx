import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../lib/constants/routes';
import { getCurrentSessionIdentity } from '../lib/session/session-adapter';

export function ProtectedRoute() {
  const location = useLocation();

  if (!getCurrentSessionIdentity().isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={location.pathname === ROUTES.HOME ? ROUTES.SPLASH : ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
