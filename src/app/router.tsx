import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MobileAppShell } from '../components/layout/MobileAppShell';
import { RentalExternalRedirect } from '../components/rentals/RentalExternalRedirect';
import { ROUTES } from '../lib/constants/routes';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from './route-guards';
import { routeMeta } from './route-meta';

const SplashPage = lazy(() => import('../pages/SplashPage').then((module) => ({ default: module.SplashPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })));
const PaymentsPage = lazy(() => import('../pages/PaymentsPage').then((module) => ({ default: module.PaymentsPage })));
const ComplaintsPage = lazy(() => import('../pages/ComplaintsPage').then((module) => ({ default: module.ComplaintsPage })));
const CreateComplaintPage = lazy(() => import('../pages/CreateComplaintPage').then((module) => ({ default: module.CreateComplaintPage })));
const ServicesPage = lazy(() => import('../pages/ServicesPage').then((module) => ({ default: module.ServicesPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const PaymentDetailsPage = lazy(() =>
  import('../pages/advanced/PaymentAndComplaintDetailsPage').then((module) => ({ default: module.PaymentDetailsPage })),
);
const ComplaintDetailsPage = lazy(() =>
  import('../pages/advanced/PaymentAndComplaintDetailsPage').then((module) => ({ default: module.ComplaintDetailsPage })),
);
const AnnouncementsPage = lazy(() => import('../pages/advanced/AnnouncementPages').then((module) => ({ default: module.AnnouncementsPage })));
const AnnouncementDetailsPage = lazy(() =>
  import('../pages/advanced/AnnouncementPages').then((module) => ({ default: module.AnnouncementDetailsPage })),
);
const NotificationsPage = lazy(() => import('../pages/advanced/AnnouncementPages').then((module) => ({ default: module.NotificationsPage })));
const EmergencyPage = lazy(() => import('../pages/advanced/EmergencyPages').then((module) => ({ default: module.EmergencyPage })));
const EmergencyStatusPage = lazy(() => import('../pages/advanced/EmergencyPages').then((module) => ({ default: module.EmergencyStatusPage })));
const MaintenanceRequestPage = lazy(() => import('../pages/advanced/ServicePages').then((module) => ({ default: module.MaintenanceRequestPage })));
const VisitorAccessPage = lazy(() => import('../pages/advanced/ServicePages').then((module) => ({ default: module.VisitorAccessPage })));
const FacilityBookingPage = lazy(() => import('../pages/advanced/ServicePages').then((module) => ({ default: module.FacilityBookingPage })));
const DocumentsPage = lazy(() => import('../pages/advanced/ServicePages').then((module) => ({ default: module.DocumentsPage })));
const CommunityRulesPage = lazy(() => import('../pages/advanced/ServicePages').then((module) => ({ default: module.CommunityRulesPage })));
const ManagementContactPage = lazy(() => import('../pages/advanced/ServicePages').then((module) => ({ default: module.ManagementContactPage })));
const ChatPage = lazy(() => import('../pages/advanced/ProfileUtilityPages').then((module) => ({ default: module.ChatPage })));
const UnitDetailsPage = lazy(() => import('../pages/advanced/ProfileUtilityPages').then((module) => ({ default: module.UnitDetailsPage })));
const SettingsPage = lazy(() => import('../pages/advanced/ProfileUtilityPages').then((module) => ({ default: module.SettingsPage })));
const SupportPage = lazy(() => import('../pages/advanced/ProfileUtilityPages').then((module) => ({ default: module.SupportPage })));
const FAQPage = lazy(() => import('../pages/advanced/ProfileUtilityPages').then((module) => ({ default: module.FAQPage })));

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-5 text-center">
      <div className="rounded-[28px] border border-outline-variant/60 bg-white px-8 py-7 shadow-lg shadow-primary/5">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-secondary-container border-t-secondary" />
        <p className="mt-4 text-sm font-bold text-primary">جاري تجهيز الشاشة...</p>
      </div>
    </div>
  );
}

const implementedRoutes = new Set<string>([
  ROUTES.SPLASH,
  ROUTES.LOGIN,
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
  ROUTES.RENTALS,
  ROUTES.RENTAL_DETAILS,
  ROUTES.RENTAL_CONTACT,
  ROUTES.RENTAL_RESERVATION,
]);

const placeholderRoutes = routeMeta.filter(
  (route) => !implementedRoutes.has(route.path),
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.RENTALS} element={<RentalExternalRedirect />} />
        <Route path={ROUTES.RENTAL_DETAILS} element={<RentalExternalRedirect />} />
        <Route path={ROUTES.RENTAL_CONTACT} element={<RentalExternalRedirect />} />
        <Route path={ROUTES.RENTAL_RESERVATION} element={<RentalExternalRedirect />} />
        <Route element={<MobileAppShell />}>
          <Route path={ROUTES.SPLASH} element={<Suspense fallback={<RouteLoadingFallback />}><SplashPage /></Suspense>} />
          <Route path={ROUTES.LOGIN} element={<Suspense fallback={<RouteLoadingFallback />}><LoginPage /></Suspense>} />
          <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<Suspense fallback={<RouteLoadingFallback />}><HomePage /></Suspense>} />
          <Route path={ROUTES.PAYMENTS} element={<Suspense fallback={<RouteLoadingFallback />}><PaymentsPage /></Suspense>} />
          <Route path={ROUTES.PAYMENT_DETAILS} element={<Suspense fallback={<RouteLoadingFallback />}><PaymentDetailsPage /></Suspense>} />
          <Route path={ROUTES.COMPLAINTS} element={<Suspense fallback={<RouteLoadingFallback />}><ComplaintsPage /></Suspense>} />
          <Route path={ROUTES.COMPLAINT_NEW} element={<Suspense fallback={<RouteLoadingFallback />}><CreateComplaintPage /></Suspense>} />
          <Route path={ROUTES.COMPLAINT_DETAILS} element={<Suspense fallback={<RouteLoadingFallback />}><ComplaintDetailsPage /></Suspense>} />
          <Route path={ROUTES.ANNOUNCEMENTS} element={<Suspense fallback={<RouteLoadingFallback />}><AnnouncementsPage /></Suspense>} />
          <Route path={ROUTES.ANNOUNCEMENT_DETAILS} element={<Suspense fallback={<RouteLoadingFallback />}><AnnouncementDetailsPage /></Suspense>} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Suspense fallback={<RouteLoadingFallback />}><NotificationsPage /></Suspense>} />
          <Route path={ROUTES.SERVICES} element={<Suspense fallback={<RouteLoadingFallback />}><ServicesPage /></Suspense>} />
          <Route path={ROUTES.MAINTENANCE} element={<Suspense fallback={<RouteLoadingFallback />}><MaintenanceRequestPage /></Suspense>} />
          <Route path={ROUTES.VISITORS} element={<Suspense fallback={<RouteLoadingFallback />}><VisitorAccessPage /></Suspense>} />
          <Route path={ROUTES.FACILITIES} element={<Suspense fallback={<RouteLoadingFallback />}><FacilityBookingPage /></Suspense>} />
          <Route path={ROUTES.DOCUMENTS} element={<Suspense fallback={<RouteLoadingFallback />}><DocumentsPage /></Suspense>} />
          <Route path={ROUTES.RULES} element={<Suspense fallback={<RouteLoadingFallback />}><CommunityRulesPage /></Suspense>} />
          <Route path={ROUTES.CONTACT} element={<Suspense fallback={<RouteLoadingFallback />}><ManagementContactPage /></Suspense>} />
          <Route path={ROUTES.EMERGENCY} element={<Suspense fallback={<RouteLoadingFallback />}><EmergencyPage /></Suspense>} />
          <Route path={ROUTES.EMERGENCY_STATUS} element={<Suspense fallback={<RouteLoadingFallback />}><EmergencyStatusPage /></Suspense>} />
          <Route path={ROUTES.CHAT} element={<Suspense fallback={<RouteLoadingFallback />}><ChatPage /></Suspense>} />
          <Route path={ROUTES.PROFILE} element={<Suspense fallback={<RouteLoadingFallback />}><ProfilePage /></Suspense>} />
          <Route path={ROUTES.UNIT} element={<Suspense fallback={<RouteLoadingFallback />}><UnitDetailsPage /></Suspense>} />
          <Route path={ROUTES.SETTINGS} element={<Suspense fallback={<RouteLoadingFallback />}><SettingsPage /></Suspense>} />
          <Route path={ROUTES.SUPPORT} element={<Suspense fallback={<RouteLoadingFallback />}><SupportPage /></Suspense>} />
          <Route path={ROUTES.FAQ} element={<Suspense fallback={<RouteLoadingFallback />}><FAQPage /></Suspense>} />
          {placeholderRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PlaceholderPage title={route.title} purpose={route.purpose} />}
            />
          ))}
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
