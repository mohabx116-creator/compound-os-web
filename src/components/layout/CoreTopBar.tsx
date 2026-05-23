import { Bell, ChevronRight, Diamond } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';
import { cn } from '../../lib/utils/cn';

interface CoreTopBarProps {
  title?: string;
  subtitle?: string;
  avatarUrl?: string;
  back?: boolean;
  brand?: boolean;
  className?: string;
}

export function CoreTopBar({ title, subtitle, avatarUrl, back = false, brand = false, className }: CoreTopBarProps) {
  const navigate = useNavigate();

  return (
    <header className={cn('sticky top-0 z-20 h-16 border-b border-outline-variant/40 bg-background/95 px-5 backdrop-blur-xl', className)}>
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {back ? (
            <button
              aria-label="الرجوع"
              className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
              type="button"
              onClick={() => navigate(-1)}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : (
            <Link
              aria-label="الطوارئ"
              className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
              to={ROUTES.EMERGENCY}
            >
              <Diamond className="h-6 w-6" />
            </Link>
          )}
        </div>

        {brand ? (
          <h1 className="text-3xl font-bold text-primary">Compound OS</h1>
        ) : (
          <div className="min-w-0 flex-1 text-center">
            {title && <h1 className="truncate text-lg font-semibold text-primary">{title}</h1>}
            {subtitle && <p className="truncate text-sm text-on-surface-variant">{subtitle}</p>}
          </div>
        )}

        {avatarUrl ? (
          <img
            alt=""
            className="h-11 w-11 rounded-full border-2 border-primary/10 object-cover"
            src={avatarUrl}
          />
        ) : (
          <Link
            aria-label="الإشعارات"
            className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            to={ROUTES.NOTIFICATIONS}
          >
            <Bell className="h-6 w-6" />
          </Link>
        )}
      </div>
    </header>
  );
}
