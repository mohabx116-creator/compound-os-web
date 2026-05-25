import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../lib/constants/routes';
import { useSession } from '../lib/session/use-session';

function SessionLoadingFallback() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-5 text-center">
      <div className="rounded-[28px] border border-outline-variant/60 bg-white px-8 py-7 shadow-lg shadow-primary/5">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-secondary-container border-t-secondary" />
        <p className="mt-4 text-sm font-bold text-primary">جاري تأكيد جلسة الدخول...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const location = useLocation();
  const session = useSession();

  if (session.isLoading) {
    return <SessionLoadingFallback />;
  }

  if (!session.isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={location.pathname === ROUTES.HOME ? ROUTES.SPLASH : ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
