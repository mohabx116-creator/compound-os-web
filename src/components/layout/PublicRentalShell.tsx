import { Building2, Home, ShieldCheck } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../../lib/constants/routes';

export function PublicRentalShell() {
  return (
    <div className="rental-luxury min-h-dvh bg-background text-on-background">
      <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-white/96 backdrop-blur-xl shadow-[0_2px_15px_rgba(3,22,53,0.04)]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to={ROUTES.RENTALS}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/15">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="text-right">
              <p className="text-sm font-black text-primary">إيجارات كمباوند السبحي</p>
              <p className="hidden text-xs font-medium text-on-surface-variant sm:block">سوق الإيجارات داخل كمباوند السبحي</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-sm font-bold text-primary">
            <Link className="hidden rounded-full px-4 py-2 hover:bg-primary/5 transition duration-200 sm:inline-flex" to={ROUTES.LOGIN}>
              دخول السكان
            </Link>
            <Link className="inline-flex min-h-10 items-center gap-2 rounded-full bg-secondary px-4 py-2 text-white shadow-lg shadow-secondary/15" to={ROUTES.RENTALS}>
              <Home className="h-4 w-4" />
              الإيجارات
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-outline-variant/50 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-right text-sm text-on-surface-variant sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-bold text-primary">سوق إيجارات السبحي</p>
            <p className="mt-1">منصة عرض وحدات الإيجار داخل كمباوند السبحي مع تحقق دفع آمن عبر الخادم.</p>
          </div>
          <div className="flex items-center gap-2 font-bold text-secondary">
            <ShieldCheck className="h-5 w-5" />
            لا يتم عرض بيانات المالك إلا بعد تحقق الدفع من الخادم
          </div>
        </div>
      </footer>
    </div>
  );
}
