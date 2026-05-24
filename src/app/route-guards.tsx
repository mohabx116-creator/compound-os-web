import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isMockAuthenticated } from '../lib/auth/mock-auth';
import { ROUTES } from '../lib/constants/routes';

export function ProtectedRoute() {
  const location = useLocation();

  if (!isMockAuthenticated()) {
    return <Navigate replace state={{ from: location }} to={location.pathname === ROUTES.HOME ? ROUTES.SPLASH : ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
