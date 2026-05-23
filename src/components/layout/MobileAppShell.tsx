import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { getRouteMeta, isPublicRoute } from '../../app/route-meta';
import { ROUTES } from '../../lib/constants/routes';
import { BottomNavigation } from './BottomNavigation';
import { FloatingEmergencyButton } from './FloatingEmergencyButton';
import { MobileHeader } from './MobileHeader';
import { OfflineBanner } from './OfflineBanner';

const corePageRoutes = new Set<string>([
  ROUTES.HOME,
  ROUTES.PAYMENTS,
  ROUTES.COMPLAINTS,
  ROUTES.COMPLAINT_NEW,
  ROUTES.PAYMENT_DETAILS,
  ROUTES.COMPLAINT_DETAILS,
  ROUTES.ANNOUNCEMENTS,
  ROUTES.ANNOUNCEMENT_DETAILS,
  ROUTES.NOTIFICATIONS,
  ROUTES.SERVICES,
  ROUTES.MAINTENANCE,
  ROUTES.VISITORS,
  ROUTES.FACILITIES,
  ROUTES.DOCUMENTS,
  ROUTES.RULES,
  ROUTES.CONTACT,
  ROUTES.EMERGENCY,
  ROUTES.EMERGENCY_STATUS,
  ROUTES.CHAT,
  ROUTES.PROFILE,
  ROUTES.UNIT,
  ROUTES.SETTINGS,
  ROUTES.SUPPORT,
  ROUTES.FAQ,
]);

export function MobileAppShell() {
  const location = useLocation();
  const publicRoute = isPublicRoute(location.pathname);
  const corePage = [...corePageRoutes].some((route) => Boolean(matchPath({ path: route, end: true }, location.pathname)));
  const hideBottomNavigation = publicRoute || location.pathname === ROUTES.COMPLAINT_NEW;
  const meta = getRouteMeta(location.pathname);

  return (
    <div className="min-h-dvh bg-surface-container sm:bg-surface-container-high">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background text-on-background shadow-none sm:shadow-2xl sm:shadow-primary/15">
        {!publicRoute && !corePage && <MobileHeader title={meta.title} />}
        <OfflineBanner />
        <main className={publicRoute || corePage ? 'flex flex-1 flex-col' : 'flex-1 px-5 pb-28 pt-4'}>
          <Outlet />
        </main>
        {!hideBottomNavigation && (
          <>
            {!corePage && <FloatingEmergencyButton />}
            <BottomNavigation />
          </>
        )}
      </div>
    </div>
  );
}
