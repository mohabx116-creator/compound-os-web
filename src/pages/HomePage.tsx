import { useQuery } from '@tanstack/react-query';
import { Bell, CalendarClock, Headphones, KeyRound, MessageSquarePlus, TriangleAlert, Wallet, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { announcementService } from '../features/announcements/services/announcement.service';
import { complaintService } from '../features/complaints/services/complaint.service';
import { paymentService } from '../features/payments/services/payment.service';
import { ROUTES } from '../lib/constants/routes';
import { formatDate } from '../lib/utils/format-date';
import { formatMoney } from '../lib/utils/format-money';
import { useAppStore } from '../stores/app.store';

const avatarUrl = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=160';

const quickActions = [
  { label: 'إرسال شكوى', icon: MessageSquarePlus, to: ROUTES.COMPLAINT_NEW },
  { label: 'حجز مرافق', icon: Wrench, to: ROUTES.FACILITIES },
  { label: 'تصريح دخول', icon: KeyRound, to: ROUTES.VISITORS },
  { label: 'تواصل', icon: Headphones, to: ROUTES.CONTACT },
];

export function HomePage() {
  const resident = useAppStore((state) => state.resident);
  const unit = useAppStore((state) => state.unit);
  const { data: payments = [] } = useQuery({ queryKey: ['payments'], queryFn: paymentService.getPayments });
  const { data: complaints = [] } = useQuery({ queryKey: ['complaints'], queryFn: complaintService.getComplaints });
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.getAnnouncements });

  const firstName = resident.fullName.split(' ')[0] ?? resident.fullName;
  const outstanding = payments.filter((payment) => payment.status !== 'PAID');
  const totalDue = outstanding.reduce((sum, payment) => sum + payment.amount, 0);
  const nextDueDate = outstanding[0]?.dueDate;
  const openComplaints = complaints.filter((complaint) => complaint.status === 'OPEN').length;
  const inProgressComplaints = complaints.filter((complaint) => complaint.status === 'IN_PROGRESS').length;
  const latestAnnouncement = announcements[0];

  return (
    <section className="min-h-dvh bg-background pb-28">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/40 bg-background/95 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img alt="" className="h-12 w-12 rounded-full border-2 border-primary/10 object-cover" src={avatarUrl} />
          <div>
            <h1 className="text-2xl font-semibold leading-8 text-primary">أهلا بك، {firstName}</h1>
            <p className="text-base text-on-surface-variant">{unit.unitNumber} - الياسمين</p>
          </div>
        </div>
        <Link aria-label="الإشعارات" className="flex h-12 w-12 items-center justify-center rounded-full text-primary hover:bg-surface-container" to={ROUTES.NOTIFICATIONS}>
          <Bell className="h-7 w-7" />
        </Link>
      </header>

      <main className="space-y-6 px-5 pt-6">
        <Link className="relative block overflow-hidden rounded-[28px] bg-primary-container p-6 text-white shadow-xl shadow-primary/15" to={ROUTES.PAYMENTS}>
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-start justify-between">
              <Wallet className="h-11 w-11 text-secondary-fixed" />
              <div className="text-left">
                <p className="text-lg font-medium text-primary-fixed-dim">إجمالي المستحقات</p>
                <p className="mt-1 text-3xl font-bold">{formatMoney(totalDue || 2500)}</p>
              </div>
            </div>
            <div className="h-px bg-white/15" />
            <div className="flex items-center justify-between gap-4">
              <button className="rounded-2xl bg-secondary px-8 py-3 text-xl font-semibold text-white shadow-md" type="button">
                دفع الآن
              </button>
              <p className="text-base text-on-primary-container">
                تاريخ الاستحقاق: {nextDueDate ? formatDate(nextDueDate) : '٥ مايو ٢٠٢٤'}
              </p>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-5">
          <Link className="rounded-[28px] border border-outline-variant/40 bg-white p-5 shadow-lg shadow-primary/5" to={ROUTES.COMPLAINTS}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-error-container/45 text-error">
              <TriangleAlert className="h-7 w-7" />
            </div>
            <p className="text-xl text-on-surface">شكاوى مفتوحة</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{openComplaints || 1}</p>
          </Link>
          <Link className="rounded-[28px] border border-outline-variant/40 bg-white p-5 shadow-lg shadow-primary/5" to={ROUTES.COMPLAINTS}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-fixed/35 text-tertiary">
              <CalendarClock className="h-7 w-7" />
            </div>
            <p className="text-xl text-on-surface">تحت التنفيذ</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{inProgressComplaints || 2}</p>
          </Link>
        </div>

        <section>
          <h2 className="mb-4 text-right text-2xl font-semibold text-on-surface">الوصول السريع</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} className="flex flex-col items-center gap-3 text-center text-on-surface-variant" to={action.to}>
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-outline-variant/40 bg-white text-primary shadow-md shadow-primary/5">
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="text-base leading-6">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {latestAnnouncement && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <Link className="text-xl font-semibold text-secondary" to={ROUTES.ANNOUNCEMENTS}>عرض الكل</Link>
              <h2 className="text-2xl font-semibold text-on-surface">آخر الإعلانات</h2>
            </div>
            <Link className="relative block h-44 overflow-hidden rounded-[28px] shadow-xl shadow-primary/10" to={`/announcements/${latestAnnouncement.id}`}>
              <img alt="" className="h-full w-full object-cover" src={latestAnnouncement.imageUrl} />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                {latestAnnouncement.isImportant && (
                  <span className="mb-2 w-fit rounded-full bg-secondary-container px-4 py-1 text-sm font-bold text-on-secondary-container">هام</span>
                )}
                <h3 className="text-xl font-semibold">{latestAnnouncement.title}</h3>
                <p className="mt-1 truncate text-base text-white/80">{latestAnnouncement.content}</p>
              </div>
            </Link>
          </section>
        )}
      </main>

      <Link
        aria-label="بلاغ طوارئ"
        className="emergency-pulse fixed bottom-24 left-[max(24px,calc((100vw-480px)/2+24px))] z-30 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-error text-white shadow-xl shadow-error/25"
        to={ROUTES.EMERGENCY}
      >
        <TriangleAlert className="h-8 w-8" />
        <span className="text-xs font-bold">طوارئ</span>
      </Link>
    </section>
  );
}
