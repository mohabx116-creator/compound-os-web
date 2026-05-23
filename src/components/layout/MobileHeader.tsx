import { Bell, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';
import { cn } from '../../lib/utils/cn';
import { Button } from '../ui/Button';

interface MobileHeaderProps {
  title: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === ROUTES.HOME;

  return (
    <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-background/90 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {!isHome && (
            <Button
              aria-label="الرجوع"
              className="shrink-0"
              size="icon"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-secondary">Compound OS</p>
            <h1 className="truncate text-xl font-semibold text-primary">{title}</h1>
          </div>
        </div>
        <Link
          aria-label="الإشعارات"
          className={cn(
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:bg-surface-container-low',
            location.pathname === ROUTES.NOTIFICATIONS && 'border-secondary/30 bg-secondary/10 text-secondary',
          )}
          to={ROUTES.NOTIFICATIONS}
        >
          <Bell className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
