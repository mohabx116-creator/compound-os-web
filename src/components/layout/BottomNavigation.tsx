import { CreditCard, Home, MessageSquareWarning, UserRound, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';
import { cn } from '../../lib/utils/cn';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    label: 'الرئيسية',
    to: ROUTES.HOME,
    icon: Home,
    match: (path) => path === ROUTES.HOME || path.startsWith('/announcements') || path === ROUTES.NOTIFICATIONS,
  },
  { label: 'المدفوعات', to: ROUTES.PAYMENTS, icon: CreditCard, match: (path) => path.startsWith('/payments') },
  { label: 'الشكاوى', to: ROUTES.COMPLAINTS, icon: MessageSquareWarning, match: (path) => path.startsWith('/complaints') || path.startsWith('/emergency') },
  { label: 'الخدمات', to: ROUTES.SERVICES, icon: Wrench, match: (path) => path.startsWith('/services') || path === ROUTES.CHAT },
  { label: 'حسابي', to: ROUTES.PROFILE, icon: UserRound, match: (path) => path.startsWith('/profile') },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-outline-variant/70 bg-surface/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-10px_30px_rgba(3,22,53,0.08)] backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active = item.match(location.pathname);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[12px] font-medium transition-colors',
                active ? 'text-secondary' : 'text-on-surface-variant hover:bg-surface-container-low',
              )}
            >
              <Icon className={cn('h-6 w-6', active && 'stroke-[2.5]')} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
