import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../lib/constants/routes';

interface PlaceholderPageProps {
  title: string;
  purpose: string;
}

export function PlaceholderPage({ title, purpose }: PlaceholderPageProps) {
  const params = useParams();
  const referenceId = params.id;

  return (
    <section className="space-y-5">
      <div className="rounded-3xl bg-primary p-5 text-white shadow-xl shadow-primary/15">
        <p className="text-sm font-medium text-secondary-fixed">مرحلة التأسيس</p>
        <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-primary-fixed">
          هذه الصفحة جاهزة كمسار مستقل وسيتم تحويلها في المرحلة التالية إلى شاشة مطابقة لتصميم Stitch.
        </p>
      </div>

      <div className="rounded-3xl border border-outline-variant/60 bg-surface p-5 shadow-lg shadow-primary/5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <ClipboardList className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-primary">الغرض من الشاشة</h3>
        <p className="mt-2 text-sm leading-7 text-on-surface-variant">{purpose}</p>
        {referenceId && (
          <p className="mt-4 rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-medium text-on-surface">
            رقم المرجع التجريبي: <span className="font-semibold text-secondary">{referenceId}</span>
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-dashed border-outline-variant bg-surface-container-low p-5">
        <p className="text-sm leading-7 text-on-surface-variant">
          سيتم ربط هذه الشاشة لاحقا بالمكونات التفصيلية والنماذج والتحقق من البيانات مع الحفاظ على بنية mock-first.
        </p>
        <Link
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3 text-base font-semibold text-white shadow-md transition-transform active:scale-95"
          to={ROUTES.SERVICES}
        >
          الانتقال إلى الخدمات
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
