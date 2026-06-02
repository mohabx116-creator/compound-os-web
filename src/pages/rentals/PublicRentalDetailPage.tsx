import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  MapPin,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ApiClientError } from '../../lib/api/api-client';
import { rentalApiService } from '../../lib/api/rental-service';
import type { RentalListing } from '../../lib/api/types';
import { ROUTES } from '../../lib/constants/routes';
import {
  formatRentalDate,
  formatRentalMoney,
  furnishingLabels,
  listingStatusLabels,
  listingTypeLabels,
  toNumber,
} from './rental-format';

const fallbackImage = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1400';

const visitorSchema = z.object({
  tenantName: z.string().trim().min(2, 'اكتب الاسم بالكامل'),
  tenantPhone: z.string().trim().min(5, 'اكتب رقم موبايل صحيح'),
  tenantEmail: z.string().trim().email('اكتب بريد إلكتروني صحيح').optional().or(z.literal('')),
});

type VisitorFormValues = z.infer<typeof visitorSchema>;

function mainImage(listing: RentalListing) {
  return listing.images.find((image) => image.isCover)?.url ?? listing.images[0]?.url ?? fallbackImage;
}

function isPaymentProviderPending(error: unknown) {
  if (!(error instanceof ApiClientError)) return false;
  const details = error.details as { code?: string; error?: { code?: string } } | undefined;
  return error.status === 503 || details?.code === 'PAYMENT_PROVIDER_NOT_CONFIGURED' || details?.error?.code === 'PAYMENT_PROVIDER_NOT_CONFIGURED';
}

function DetailError({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <Building2 className="h-14 w-14 text-secondary" />
      <h1 className="mt-5 text-3xl font-black text-primary">{title}</h1>
      <p className="mt-3 leading-8 text-on-surface-variant">{message}</p>
      <Link className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white" to={ROUTES.RENTALS}>
        العودة إلى الإيجارات
      </Link>
    </main>
  );
}

export function PublicRentalDetailPage() {
  const { slug } = useParams();
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationNotice, setReservationNotice] = useState<{ type: 'pending' | 'ready'; message: string; href?: string } | null>(null);

  const listingQuery = useQuery({
    queryKey: ['rentals', 'public', 'listing', slug],
    queryFn: () => rentalApiService.getPublicRentalListingBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });

  const reservationMutation = useMutation({
    mutationFn: ({ listingId, values }: { listingId: string; values: VisitorFormValues }) =>
      rentalApiService.startRentalReservation(listingId, {
        tenantName: values.tenantName,
        tenantPhone: values.tenantPhone,
        tenantEmail: values.tenantEmail || undefined,
      }),
    onSuccess: (result) => {
      if (result.paymentUrl) {
        setReservationNotice({
          type: 'ready',
          message: 'تم تجهيز رابط دفع الحجز المؤقت من خلال مزود الدفع.',
          href: result.paymentUrl,
        });
        return;
      }

      setReservationNotice({
        type: 'pending',
        message: 'تم إنشاء طلب الحجز، لكن رابط الدفع غير متاح حاليا. تابع حالة الطلب بدون اعتبار الحجز مؤكدا.',
        href: result.reservation?.id ? `/rentals/reservations/${result.reservation.id}` : undefined,
      });
    },
    onError: (error) => {
      setReservationNotice({
        type: 'pending',
        message: isPaymentProviderPending(error)
          ? 'الدفع الإلكتروني قيد التجهيز. لم يتم تأكيد الحجز أو خصم أي مبلغ من خلال هذه الواجهة.'
          : error instanceof Error
            ? error.message
            : 'تعذر بدء طلب الحجز. حاول مرة أخرى.',
      });
    },
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      tenantName: '',
      tenantPhone: '',
      tenantEmail: '',
    },
  });

  if (listingQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-[520px] animate-pulse rounded-[32px] bg-white shadow-xl shadow-primary/5" />
      </main>
    );
  }

  if (listingQuery.isError || !listingQuery.data) {
    return (
      <DetailError
        title="الوحدة غير موجودة أو لم تعد متاحة"
        message="قد تكون الوحدة أزيلت من السوق أو انتهت مدة نشرها. يمكنك الرجوع إلى قائمة الوحدات المتاحة."
      />
    );
  }

  const listing = listingQuery.data;
  const gallery = listing.images.length ? listing.images : [{ id: 'fallback', url: fallbackImage, altText: listing.title, sortOrder: 0, isCover: true }];
  const isReservationPending = reservationMutation.isPending || isSubmitting;

  const onReservationSubmit = handleSubmit(async (values) => {
    setReservationNotice(null);
    await reservationMutation.mutateAsync({ listingId: listing.id, values });
  });

  return (
    <main className="pb-16">
      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:px-8">
          <div>
            <Link className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary" to={ROUTES.RENTALS}>
              <ChevronRight className="h-5 w-5" />
              رجوع إلى الإيجارات
            </Link>
            <div className="overflow-hidden rounded-[32px] bg-surface-container-low shadow-2xl shadow-primary/10">
              <img alt={listing.title} className="aspect-[16/11] w-full object-cover lg:aspect-[16/9]" src={mainImage(listing)} />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {gallery.slice(0, 4).map((image) => (
                  <img key={image.id} alt={image.altText ?? listing.title} className="aspect-[4/3] rounded-2xl object-cover" src={image.url} />
                ))}
              </div>
            )}
          </div>

          <aside className="self-start rounded-[32px] border border-outline-variant/60 bg-background p-5 text-right shadow-xl shadow-primary/5 lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">{listingStatusLabels[listing.status]}</span>
              <span className="rounded-full bg-primary/5 px-3 py-1 text-sm font-bold text-primary">{listingTypeLabels[listing.listingType]}</span>
            </div>
            <h1 className="mt-4 text-3xl font-black leading-[1.35] text-primary">{listing.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-on-surface-variant">
              <MapPin className="h-5 w-5 shrink-0 text-secondary" />
              {listing.locationText ?? listing.addressText ?? listing.compound?.address ?? 'Sebahi Compound'}
            </p>
            <div className="mt-6 rounded-[24px] bg-white p-4">
              <p className="text-sm font-bold text-on-surface-variant">الإيجار الشهري</p>
              <p className="mt-1 text-4xl font-black text-primary">{formatRentalMoney(listing.monthlyRent)}</p>
              {listing.depositAmount && <p className="mt-2 text-sm text-on-surface-variant">التأمين: {formatRentalMoney(listing.depositAmount)}</p>}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <span className="rounded-2xl bg-white px-2 py-3 text-on-surface-variant"><BedDouble className="mx-auto mb-1 h-5 w-5 text-primary" />{listing.bedrooms} غرف</span>
              <span className="rounded-2xl bg-white px-2 py-3 text-on-surface-variant"><Bath className="mx-auto mb-1 h-5 w-5 text-primary" />{listing.bathrooms} حمام</span>
              <span className="rounded-2xl bg-white px-2 py-3 text-on-surface-variant"><Ruler className="mx-auto mb-1 h-5 w-5 text-primary" />{new Intl.NumberFormat('ar-EG').format(toNumber(listing.areaSqm))} م²</span>
            </div>
            <div className="mt-6 space-y-3">
              <Link className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-black text-white shadow-xl shadow-primary/15" to={`/rentals/${listing.slug}/contact`}>
                <LockKeyhole className="h-5 w-5" />
                فتح بيانات التواصل
              </Link>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-4 text-base font-black text-white shadow-xl shadow-secondary/15" type="button" onClick={() => setShowReservationForm((value) => !value)}>
                <CalendarClock className="h-5 w-5" />
                بدء حجز مؤقت
              </button>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-on-surface-variant">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              بيانات المالك لا تظهر من صفحة التفاصيل، والحجز لا يصبح مؤكدا إلا بعد تحقق الدفع من الخادم.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-outline-variant/60 bg-white p-6 text-right shadow-xl shadow-primary/5">
            <h2 className="text-2xl font-black text-primary">وصف الوحدة</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-9 text-on-surface-variant">{listing.description}</p>
          </section>

          <section className="rounded-[28px] border border-outline-variant/60 bg-white p-6 text-right shadow-xl shadow-primary/5">
            <h2 className="text-2xl font-black text-primary">المواصفات</h2>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface-container-low p-4"><dt className="text-sm text-on-surface-variant">نوع الوحدة</dt><dd className="mt-1 font-black text-primary">{listingTypeLabels[listing.listingType]}</dd></div>
              <div className="rounded-2xl bg-surface-container-low p-4"><dt className="text-sm text-on-surface-variant">التجهيز</dt><dd className="mt-1 font-black text-primary">{furnishingLabels[listing.furnishingStatus]}</dd></div>
              <div className="rounded-2xl bg-surface-container-low p-4"><dt className="text-sm text-on-surface-variant">الدور</dt><dd className="mt-1 font-black text-primary">{listing.floor ?? 'غير محدد'}</dd></div>
              <div className="rounded-2xl bg-surface-container-low p-4"><dt className="text-sm text-on-surface-variant">تاريخ النشر</dt><dd className="mt-1 font-black text-primary">{formatRentalDate(listing.publishedAt)}</dd></div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          {showReservationForm && (
            <form className="rounded-[28px] border border-secondary/20 bg-white p-5 text-right shadow-xl shadow-secondary/10" onSubmit={onReservationSubmit}>
              <h2 className="text-xl font-black text-primary">بيانات الحجز المؤقت</h2>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                رسوم الحجز المؤقت: {formatRentalMoney(listing.reservationFee)}. الدفع الإلكتروني يجب أن يتم من خلال رابط مزود الدفع عند توفره.
              </p>
              <div className="mt-5 space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-primary">الاسم</span>
                  <input className="w-full rounded-2xl border-outline-variant bg-surface-container-low text-right focus:border-secondary focus:ring-secondary/20" {...register('tenantName')} />
                  {errors.tenantName && <span className="mt-1 block text-sm font-bold text-error">{errors.tenantName.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-primary">رقم الموبايل</span>
                  <input className="w-full rounded-2xl border-outline-variant bg-surface-container-low text-right focus:border-secondary focus:ring-secondary/20" {...register('tenantPhone')} />
                  {errors.tenantPhone && <span className="mt-1 block text-sm font-bold text-error">{errors.tenantPhone.message}</span>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-primary">البريد الإلكتروني اختياري</span>
                  <input className="w-full rounded-2xl border-outline-variant bg-surface-container-low text-right focus:border-secondary focus:ring-secondary/20" type="email" {...register('tenantEmail')} />
                  {errors.tenantEmail && <span className="mt-1 block text-sm font-bold text-error">{errors.tenantEmail.message}</span>}
                </label>
              </div>
              {reservationNotice && (
                <div className="mt-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 text-sm leading-7 text-on-surface-variant">
                  <p className="font-bold text-primary">{reservationNotice.message}</p>
                  {reservationNotice.href && (
                    <a className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 font-bold text-white" href={reservationNotice.href}>
                      {reservationNotice.type === 'ready' ? 'فتح رابط الدفع' : 'متابعة حالة الحجز'}
                      <ArrowLeft className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-4 font-black text-white disabled:opacity-60" disabled={isReservationPending} type="submit">
                <CheckCircle2 className="h-5 w-5" />
                {isReservationPending ? 'جار بدء الطلب...' : 'بدء طلب الحجز'}
              </button>
            </form>
          )}

          <section className="rounded-[28px] border border-outline-variant/60 bg-white p-5 text-right shadow-xl shadow-primary/5">
            <h2 className="text-xl font-black text-primary">الموقع والكمباوند</h2>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">{listing.compound?.name ?? 'Sebahi Compound'}</p>
            <p className="mt-1 text-sm leading-7 text-on-surface-variant">{listing.addressText ?? listing.compound?.address ?? 'New Cairo, Egypt'}</p>
          </section>
        </div>
      </section>
    </main>
  );
}
