import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="mx-5 mt-3 flex items-center gap-2 rounded-2xl bg-error-container px-4 py-3 text-sm font-medium text-error-on-container">
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      <span>أنت غير متصل حاليا. سيتم استخدام البيانات التجريبية المتاحة.</span>
    </div>
  );
}
