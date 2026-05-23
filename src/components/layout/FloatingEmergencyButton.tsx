import { Siren } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function FloatingEmergencyButton() {
  const location = useLocation();

  if (location.pathname.startsWith('/emergency')) {
    return null;
  }

  return (
    <Link
      aria-label="بلاغ طوارئ"
      className="emergency-pulse fixed bottom-28 left-[max(20px,calc((100vw-480px)/2+20px))] z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-xl shadow-error/25 transition-transform active:scale-95"
      to={ROUTES.EMERGENCY}
    >
      <Siren className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}
