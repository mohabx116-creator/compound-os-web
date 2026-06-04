import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { buildRentalAppUrl } from '../../lib/config/rental-app';

export function RentalExternalRedirect() {
  const location = useLocation();
  const targetUrl = useMemo(
    () => buildRentalAppUrl(location.pathname, location.search, location.hash),
    [location.hash, location.pathname, location.search],
  );

  useEffect(() => {
    window.location.replace(targetUrl);
  }, [targetUrl]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 text-center" dir="rtl">
      <section className="w-full max-w-md rounded-[28px] border border-outline-variant/70 bg-white p-7 shadow-xl shadow-primary/10">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-secondary-container border-t-secondary" />
        <h1 className="mt-5 text-2xl font-black text-primary">جاري تحويلك إلى بوابة إيجارات السبحي...</h1>
        <p className="mt-3 text-sm leading-7 text-on-surface-variant">
          تم نقل بوابة الإيجارات إلى تطبيق مستقل للحفاظ على تجربة عامة أسرع ومنفصلة عن تطبيق السكان.
        </p>
        <a className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white" href={targetUrl}>
          اضغط هنا للانتقال إلى بوابة الإيجارات
        </a>
      </section>
    </main>
  );
}
