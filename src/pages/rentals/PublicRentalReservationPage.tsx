import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarClock, CheckCircle2, Clock, Home, ShieldCheck, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { rentalApiService } from '../../lib/api/rental-service';
import { ROUTES } from '../../lib/constants/routes';
import { formatRentalDate, formatRentalMoney, listingStatusLabels, reservationStatusLabels, shortId } from './rental-format';

function StatusIcon({ status }: { status: string }) {
  if (status === 'CONFIRMED' || status === 'RESERVED' || status === 'PAID_PENDING_CONFIRMATION') {
    return <CheckCircle2 className="h-12 w-12 text-secondary" />;
  }
  if (status === 'CANCELLED' || status === 'EXPIRED' || status === 'REJECTED') {
    return <XCircle className="h-12 w-12 text-error" />;
  }
  return <Clock className="h-12 w-12 text-tertiary" />;
}

export function PublicRentalReservationPage() {
  const { id } = useParams();
  const reservationQuery = useQuery({
    queryKey: ['rentals', 'public', 'reservation', id],
    queryFn: () => rentalApiService.getRentalReservation(id ?? ''),
    enabled: Boolean(id),
  });

  if (reservationQuery.isLoading) {
    return (
      <main className="mx-auto flex min-h-[70dvh] w-full max-w-3xl items-center justify-center px-4 py-12">
        <div className="h-[420px] w-full animate-pulse rounded-[32px] bg-white shadow-xl shadow-primary/5" />
      </main>
    );
  }

  if (reservationQuery.isError || !reservationQuery.data) {
    return (
      <main className="mx-auto flex min-h-[70dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
        <CalendarClock className="h-14 w-14 text-secondary" />
        <h1 className="mt-5 text-3xl font-black text-primary">طلب الحجز غير موجود</h1>
        <p className="mt-3 leading-8 text-on-surface-variant">قد يكون رقم الطلب غير صحيح أو لم يعد متاحا للعرض.</p>
        <Link className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white" to={ROUTES.RENTALS}>
          العودة إلى الإيجارات
        </Link>
      </main>
    );
  }

  const reservation = reservationQuery.data;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[32px] border border-outline-variant/60 bg-white text-right shadow-2xl shadow-primary/10">
        <div className="bg-primary p-6 text-white sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-secondary-fixed">رقم الطلب #{shortId(reservation.id)}</p>
              <h1 className="mt-2 text-3xl font-black leading-[1.35]">حالة الحجز المؤقت</h1>
            </div>
            <StatusIcon status={reservation.status} />
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div className="rounded-[28px] bg-surface-container-low p-5">
              <p className="text-sm font-bold text-on-surface-variant">الحالة الحالية</p>
              <p className="mt-2 text-3xl font-black text-primary">{reservationStatusLabels[reservation.status]}</p>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                لا يعتبر الحجز مؤكدا إلا بعد تأكيد الدفع والمعالجة من الخادم. لا تعتمد هذه الصفحة على حالة دفع مرسلة من المتصفح.
              </p>
            </div>

            {reservation.listing && (
              <Link className="block rounded-[28px] border border-outline-variant/60 p-5 hover:bg-surface-container-low" to={`/rentals/${reservation.listing.slug}`}>
                <p className="text-sm font-bold text-secondary">الوحدة المرتبطة</p>
                <h2 className="mt-2 text-2xl font-black text-primary">{reservation.listing.title}</h2>
                <p className="mt-2 text-sm text-on-surface-variant">حالة الوحدة: {listingStatusLabels[reservation.listing.status] ?? reservation.listing.status}</p>
              </Link>
            )}
          </div>

          <aside className="space-y-3 rounded-[28px] border border-outline-variant/60 p-5">
            <div>
              <p className="text-sm font-bold text-on-surface-variant">قيمة رسوم الحجز</p>
              <p className="mt-1 text-2xl font-black text-primary">{formatRentalMoney(reservation.amount)}</p>
            </div>
            <div className="h-px bg-outline-variant/60" />
            <div>
              <p className="text-sm font-bold text-on-surface-variant">تاريخ الطلب</p>
              <p className="mt-1 font-black text-primary">{formatRentalDate(reservation.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant">ينتهي في</p>
              <p className="mt-1 font-black text-primary">{formatRentalDate(reservation.reservedUntil)}</p>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-4 text-sm leading-7 text-secondary">
              <ShieldCheck className="mb-2 h-5 w-5" />
              الدفع والحجز النهائي يعالجان من خلال الخادم فقط.
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-outline-variant/60 bg-surface-container-low p-5 sm:flex-row sm:justify-between">
          <Link className="inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant bg-white px-5 py-3 text-sm font-bold text-primary" to={ROUTES.RENTALS}>
            <Home className="h-4 w-4" />
            العودة إلى الإيجارات
          </Link>
          {reservation.listing && (
            <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white" to={`/rentals/${reservation.listing.slug}`}>
              عرض الوحدة
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
