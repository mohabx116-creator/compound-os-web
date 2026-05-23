import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLogo } from '../components/brand/AppLogo';
import { ROUTES } from '../lib/constants/routes';

export function SplashPage() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-5 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(#e0e3e5_0.6px,transparent_0.6px)] [background-size:24px_24px]" />
      <div className="absolute -right-36 -top-36 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute -bottom-36 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <Link className="relative z-10 flex flex-col items-center animate-[fade-in_700ms_ease-out]" to={ROUTES.LOGIN}>
        <AppLogo card size="lg" withText />
        <h1 className="mt-10 text-4xl font-bold tracking-tight text-primary">Compound OS</h1>
        <p className="mt-4 max-w-xs text-base leading-8 text-on-surface-variant">
          إدارة ذكية لحياة أسهل داخل الكمباوند
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-outline">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <span>نظام إدارة آمن وذكي</span>
        </div>
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full w-full origin-right rounded-full bg-gradient-to-l from-secondary to-primary animate-[splash-load_2200ms_ease-in-out_forwards]" />
        </div>
      </Link>
    </section>
  );
}
