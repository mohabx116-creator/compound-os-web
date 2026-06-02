import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronRight, CreditCard, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ApiClientError } from '../../lib/api/api-client';
import { rentalApiService } from '../../lib/api/rental-service';
import type { ContactAccessResponse, StartContactUnlockResponse } from '../../lib/api/types';
import { ROUTES } from '../../lib/constants/routes';
import { formatRentalMoney, publicRentalBrand, publicRentalText } from './rental-format';

const contactSchema = z.object({
  tenantName: z.string().trim().min(2, 'اكتب الاسم بالكامل'),
  tenantPhone: z.string().trim().min(5, 'اكتب رقم موبايل صحيح'),
  tenantEmail: z.string().trim().email('اكتب بريد إلكتروني صحيح').optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function isPaymentProviderPending(error: unknown) {
  if (!(error instanceof ApiClientError)) return false;
  const details = error.details as { code?: string; error?: { code?: string } } | undefined;
  return error.status === 503 || details?.code === 'PAYMENT_PROVIDER_NOT_CONFIGURED' || details?.error?.code === 'PAYMENT_PROVIDER_NOT_CONFIGURED';
}

export function PublicRentalContactPage() {
  const { slug } = useParams();
  const [access, setAccess] = useState<ContactAccessResponse | null>(null);
  const [unlockResult, setUnlockResult] = useState<StartContactUnlockResponse | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const listingQuery = useQuery({
    queryKey: ['rentals', 'public', 'listing', slug],
    queryFn: () => rentalApiService.getPublicRentalListingBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });

  const accessMutation = useMutation({
    mutationFn: ({ listingId, tenantPhone }: { listingId: string; tenantPhone: string }) =>
      rentalApiService.getContactAccess(listingId, tenantPhone),
  });

  const unlockMutation = useMutation({
    mutationFn: ({ listingId, values }: { listingId: string; values: ContactFormValues }) =>
      rentalApiService.startContactUnlock(listingId, {
        tenantName: values.tenantName,
        tenantPhone: values.tenantPhone,
        tenantEmail: values.tenantEmail || undefined,
      }),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      tenantName: '',
      tenantPhone: '',
      tenantEmail: '',
    },
  });

  const isPending = isSubmitting || accessMutation.isPending || unlockMutation.isPending;
  const listing = listingQuery.data;
  const title = listing ? publicRentalText(listing.title) : '';
  const location = listing
    ? publicRentalText(listing.locationText ?? listing.addressText ?? listing.compound?.name, publicRentalBrand.compoundAr)
    : publicRentalBrand.compoundAr;

  const onSubmit = handleSubmit(async (values) => {
    if (!listing) return;
    setNotice(null);
    setAccess(null);
    setUnlockResult(null);

    const currentAccess = await accessMutation.mutateAsync({
      listingId: listing.id,
      tenantPhone: values.tenantPhone,
    });

    setAccess(currentAccess);

    if (currentAccess.unlocked) {
      return;
    }

    try {
      const result = await unlockMutation.mutateAsync({ listingId: listing.id, values });
      setUnlockResult(result);

      if (result.paymentUrl) {
        setNotice('تم تجهيز رابط الدفع. بعد إتمام الدفع، يتم فتح بيانات التواصل فقط عند تأكيد العملية من الخادم.');
      } else if (result.alreadyUnlocked) {
        setNotice('تم العثور على فتح تواصل سابق، تحقق من بيانات التواصل مرة أخرى بنفس رقم الهاتف.');
      } else {
        setNotice('تم إنشاء طلب فتح التواصل، لكن رابط الدفع غير متاح حاليا.');
      }
    } catch (error) {
      setNotice(
        isPaymentProviderPending(error)
          ? 'الدفع الإلكتروني قيد التجهيز. لن تظهر بيانات المالك قبل تفعيل مزود الدفع وتأكيد العملية من الخادم.'
          : error instanceof Error
            ? error.message
            : 'تعذر بدء طلب فتح التواصل. حاول مرة أخرى.',
      );
    }
  });

  if (listingQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-[520px] animate-pulse rounded-[32px] bg-white shadow-xl shadow-primary/5" />
      </main>
    );
  }

  if (listingQuery.isError || !listing) {
    return (
      <main className="mx-auto flex min-h-[70dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
        <LockKeyhole className="h-14 w-14 text-secondary" />
        <h1 className="mt-5 text-3xl font-black text-primary">الوحدة غير موجودة أو لم تعد متاحة</h1>
        <p className="mt-3 leading-8 text-on-surface-variant">لا يمكن بدء فتح بيانات التواصل لهذه الوحدة حاليا.</p>
        <Link className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white" to={ROUTES.RENTALS}>
          العودة إلى الإيجارات
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:px-8">
      <aside className="rounded-[32px] border border-outline-variant/60 bg-white p-5 text-right shadow-xl shadow-primary/5">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary" to={ROUTES.RENTALS}>
          <ChevronRight className="h-5 w-5" />
          رجوع إلى الإيجارات
        </Link>
        <div className="overflow-hidden rounded-[28px] bg-surface-container-low">
          <img
            alt={title}
            className="aspect-[4/3] w-full object-cover"
            src={listing.images.find((image) => image.isCover)?.url ?? listing.images[0]?.url ?? 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000'}
          />
        </div>
        <h1 className="mt-5 text-2xl font-black leading-9 text-primary">{title}</h1>
        <p className="mt-2 text-sm leading-7 text-on-surface-variant">{location}</p>
        <div className="mt-5 rounded-3xl bg-surface-container-low p-4">
          <p className="text-sm font-bold text-on-surface-variant">رسوم فتح بيانات التواصل</p>
          <p className="mt-1 text-3xl font-black text-primary">{formatRentalMoney(listing.contactUnlockFee)}</p>
          <p className="mt-2 text-xs leading-6 text-on-surface-variant">
            لا يتم عرض رقم المالك أو بريده إلا إذا أكد الخادم أن الدفع ناجح لهذا الرقم وهذه الوحدة.
          </p>
        </div>
      </aside>

      <section className="rounded-[32px] border border-outline-variant/60 bg-white p-5 text-right shadow-xl shadow-primary/5 sm:p-7">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
          <ShieldCheck className="h-4 w-4" />
          فتح آمن عبر الخادم
        </span>
        <h2 className="mt-5 text-3xl font-black leading-[1.35] text-primary">طلب بيانات التواصل مع المالك</h2>
        <p className="mt-3 text-base leading-8 text-on-surface-variant">
          أدخل بياناتك أولا للتحقق من وجود فتح تواصل مدفوع سابقا. إذا لم يكن لديك وصول، سنبدأ طلب الدفع من الخادم عند توفر مزود الدفع.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-primary">الاسم بالكامل</span>
            <input className="w-full rounded-2xl border-outline-variant bg-surface-container-low py-3 text-right focus:border-secondary focus:ring-secondary/20" {...register('tenantName')} />
            {errors.tenantName && <span className="mt-1 block text-sm font-bold text-error">{errors.tenantName.message}</span>}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-primary">رقم الموبايل</span>
            <input className="w-full rounded-2xl border-outline-variant bg-surface-container-low py-3 text-right focus:border-secondary focus:ring-secondary/20" {...register('tenantPhone')} />
            {errors.tenantPhone && <span className="mt-1 block text-sm font-bold text-error">{errors.tenantPhone.message}</span>}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-primary">البريد الإلكتروني اختياري</span>
            <input className="w-full rounded-2xl border-outline-variant bg-surface-container-low py-3 text-right focus:border-secondary focus:ring-secondary/20" type="email" {...register('tenantEmail')} />
            {errors.tenantEmail && <span className="mt-1 block text-sm font-bold text-error">{errors.tenantEmail.message}</span>}
          </label>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-black text-white shadow-xl shadow-primary/15 disabled:opacity-60" disabled={isPending} type="submit">
            <CreditCard className="h-5 w-5" />
            {isPending ? 'جار التحقق...' : 'تحقق وابدأ فتح التواصل'}
          </button>
        </form>

        {access?.unlocked && access.ownerContact && (
          <div className="mt-6 rounded-[28px] border border-secondary/25 bg-secondary/10 p-5">
            <h3 className="text-xl font-black text-secondary">تم فتح بيانات التواصل</h3>
            <div className="mt-4 space-y-3 text-primary">
              <p className="flex items-center gap-2"><UserRound className="h-5 w-5 text-secondary" />{access.ownerContact.fullName}</p>
              <p className="flex items-center gap-2"><Phone className="h-5 w-5 text-secondary" />{access.ownerContact.phone}</p>
              {access.ownerContact.email && <p className="flex items-center gap-2"><Mail className="h-5 w-5 text-secondary" />{access.ownerContact.email}</p>}
            </div>
          </div>
        )}

        {!access?.unlocked && (notice || unlockResult?.paymentUrl) && (
          <div className="mt-6 rounded-[28px] border border-outline-variant/60 bg-surface-container-low p-5">
            <h3 className="text-xl font-black text-primary">حالة طلب فتح التواصل</h3>
            {notice && <p className="mt-2 text-sm leading-7 text-on-surface-variant">{notice}</p>}
            {unlockResult?.paymentUrl && (
              <a className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-white" href={unlockResult.paymentUrl}>
                فتح رابط الدفع
                <ArrowLeft className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
