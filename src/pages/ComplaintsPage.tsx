import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Headphones, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CoreTopBar } from '../components/layout/CoreTopBar';
import { StatusChip } from '../components/ui/StatusChip';
import { complaintService } from '../features/complaints/services/complaint.service';
import { DEMO_IDS } from '../lib/api/demo-ids';
import { ROUTES } from '../lib/constants/routes';
import { formatDate } from '../lib/utils/format-date';
import type { Complaint } from '../types/common.types';

const filters = [
  { label: 'الكل', value: 'ALL' },
  { label: 'مفتوحة', value: 'OPEN' },
  { label: 'قيد التنفيذ', value: 'IN_PROGRESS' },
  { label: 'تم الحل', value: 'RESOLVED' },
] as const;

function complaintTone(status: Complaint['status']) {
  if (status === 'RESOLVED' || status === 'CLOSED') return 'success';
  if (status === 'IN_PROGRESS') return 'warning';
  if (status === 'OPEN') return 'danger';
  return 'neutral';
}

function complaintStatus(status: Complaint['status']) {
  if (status === 'RESOLVED' || status === 'CLOSED') return 'تم الحل';
  if (status === 'IN_PROGRESS') return 'قيد التنفيذ';
  if (status === 'OPEN') return 'مفتوحة';
  return 'متصعدة';
}

export function ComplaintsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('ALL');
  const { data: complaints = [], isError, isLoading } = useQuery({
    queryKey: ['complaints', 'resident', DEMO_IDS.residentId],
    queryFn: complaintService.getBackendComplaints,
  });
  const visibleComplaints = filter === 'ALL' ? complaints : complaints.filter((complaint) => complaint.status === filter);

  return (
    <section className="min-h-dvh bg-background pb-28">
      <CoreTopBar title="الشكاوى" />
      <main className="space-y-6 px-5 pt-6">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.value}
              className={`min-w-24 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-colors ${
                filter === item.value ? 'bg-primary text-white shadow-primary/20' : 'bg-surface-container text-on-surface'
              }`}
              type="button"
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {isLoading && (
            <div className="rounded-[28px] bg-white p-6 text-center text-base font-bold text-secondary shadow-lg shadow-primary/5">
              جاري تحميل الشكاوى...
            </div>
          )}
          {isError && (
            <div className="rounded-[28px] border border-error/20 bg-error-container/40 p-6 text-right text-error">
              تعذر تحميل الشكاوى من الخادم. حاول مرة أخرى لاحقا.
            </div>
          )}
          {!isLoading && !isError && visibleComplaints.length === 0 && (
            <div className="rounded-[28px] bg-white p-6 text-center text-on-surface-variant shadow-lg shadow-primary/5">
              لا توجد شكاوى مطابقة لهذا الفلتر.
            </div>
          )}
          {visibleComplaints.map((complaint) => (
            <Link key={complaint.id} className="block rounded-[28px] bg-white p-6 shadow-xl shadow-primary/8 transition-transform active:scale-[0.99]" to={`/complaints/${complaint.id}`}>
              <div className="flex items-start justify-between gap-4">
                <StatusChip label={complaintStatus(complaint.status)} tone={complaintTone(complaint.status)} />
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary">{complaint.category}</p>
                  <h2 className="mt-2 text-2xl font-bold leading-9 text-primary">{complaint.title}</h2>
                  <p className="mt-3 line-clamp-2 text-base leading-7 text-on-surface">{complaint.description}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-outline-variant/40 pt-4 text-sm text-outline">
                <span>تذكرة: #{complaint.id.replace('comp-', '88')}</span>
                <span className="flex items-center gap-2">
                  {formatDate(complaint.createdAt)}
                  <CalendarDays className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-[28px] bg-primary-container p-6 text-white shadow-xl shadow-primary/15">
          <h2 className="text-2xl font-bold text-primary-fixed-dim">هل تحتاج مساعدة فورية؟</h2>
          <p className="mt-3 text-base leading-7 text-on-primary-container">فريق خدمة العملاء متواجد على مدار الساعة للرد على استفساراتكم ومشاكلكم.</p>
          <Link className="mt-5 inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-3 text-base font-bold text-white" to={ROUTES.SUPPORT}>
            <Headphones className="h-6 w-6" />
            تواصل معنا
          </Link>
        </div>
      </main>

      <Link
        aria-label="إرسال شكوى"
        className="fixed bottom-24 left-[max(24px,calc((100vw-480px)/2+24px))] z-30 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-white shadow-xl shadow-secondary/25"
        to={ROUTES.COMPLAINT_NEW}
      >
        <Plus className="h-10 w-10" />
      </Link>
    </section>
  );
}
