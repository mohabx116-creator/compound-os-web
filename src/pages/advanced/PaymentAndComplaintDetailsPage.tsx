import { useQuery } from '@tanstack/react-query';
import { Clock3, Download, FileCheck, FileText, History, Info, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatusChip } from '../../components/ui/StatusChip';
import { Timeline } from '../../components/ui/Timeline';
import { complaintService } from '../../features/complaints/services/complaint.service';
import { paymentService } from '../../features/payments/services/payment.service';
import { useSession } from '../../lib/session/use-session';
import { formatMoney } from '../../lib/utils/format-money';
import { complaintStatusLabel, heroImages, PageFrame, paymentStatusLabel, SectionTitle, statusTone } from './shared';

export function PaymentDetailsPage() {
  const { id } = useParams();
  const { data: payments = [] } = useQuery({ queryKey: ['payments'], queryFn: paymentService.getPayments });
  const payment = payments.find((item) => item.id === id) ?? payments[0];

  return (
    <PageFrame>
      <CoreTopBar title="تفاصيل المستحقات" back />
      <main className="space-y-5 px-5 pt-6">
        <DetailCard className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <StatusChip label={paymentStatusLabel(payment?.status)} tone={statusTone(payment?.status)} />
            <div className="text-right">
              <p className="text-sm text-on-surface-variant">فاتورة رقم {payment?.invoiceNumber ?? 'INV-2024-001'}</p>
              <h1 className="mt-1 text-3xl font-bold text-primary">{payment?.billingPeriod ?? 'مايو ٢٠٢٤'}</h1>
            </div>
          </div>
          <div className="rounded-[24px] bg-primary px-5 py-6 text-center text-white">
            <p className="text-sm text-primary-fixed-dim">إجمالي المستحق</p>
            <p className="mt-2 text-5xl font-bold">{formatMoney(payment?.amount ?? 2500)}</p>
          </div>
          <div>
            <InfoRow label="تاريخ الاستحقاق" value={payment?.dueDate ?? '2024-05-05'} />
            <InfoRow label="طريقة السداد" value={payment?.paymentMethod ?? 'لم يتم السداد بعد'} />
            <InfoRow label="البند" value={payment?.title ?? 'رسوم الصيانة الشهرية'} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button className="rounded-2xl bg-secondary px-5 py-4 text-lg font-bold text-white shadow-lg shadow-secondary/20" type="button">
              <span className="inline-flex items-center gap-2">
                رفع إثبات الدفع
                <FileCheck className="h-5 w-5" />
              </span>
            </button>
            <button className="rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-white shadow-lg shadow-primary/15" type="button">
              <span className="inline-flex items-center gap-2">
                تحميل الإيصال
                <Download className="h-5 w-5" />
              </span>
            </button>
          </div>
        </DetailCard>

        <DetailCard>
          <SectionTitle title="ملاحظات الحسابات" icon={Info} />
          <p className="mt-3 text-right leading-7 text-on-surface-variant">
            يتم مراجعة إثبات الدفع خلال يوم عمل واحد. ستصلك رسالة تأكيد فور اعتماد العملية من الإدارة المالية.
          </p>
        </DetailCard>

        <DetailCard>
          <SectionTitle title="حالة الطلب" icon={History} />
          <div className="mt-4">
            <Timeline
              items={[
                { title: 'تم إصدار الفاتورة', description: 'تمت إضافة المستحقات إلى حسابك.', time: '١ مايو', done: true },
                { title: 'في انتظار السداد', description: 'يمكنك رفع إيصال التحويل للمراجعة.', time: 'اليوم', done: payment?.status === 'PAID' },
                { title: 'اعتماد الحسابات', description: 'تحديث الحالة بعد مراجعة الإدارة المالية.', time: 'لاحقا' },
              ]}
            />
          </div>
        </DetailCard>
      </main>
    </PageFrame>
  );
}

export function ComplaintDetailsPage() {
  const { id } = useParams();
  const session = useSession();
  const complaintId = id ?? session.complaintId ?? '';
  const { data: complaint, isLoading, isError } = useQuery({
    queryKey: ['complaints', 'detail', complaintId],
    queryFn: () => complaintService.getBackendComplaintById(complaintId),
    enabled: Boolean(complaintId),
  });

  return (
    <PageFrame>
      <CoreTopBar title="تفاصيل الشكوى" back />
      <main className="space-y-5 px-5 pt-6">
        {isLoading && (
          <DetailCard>
            <p className="text-center text-sm font-bold text-secondary">جاري تحميل تفاصيل الشكوى...</p>
          </DetailCard>
        )}
        {isError && (
          <DetailCard>
            <p className="text-right text-sm text-error">تعذر تحميل تفاصيل الشكوى من الخادم.</p>
          </DetailCard>
        )}
        {!isLoading && !isError && !complaint && (
          <DetailCard>
            <p className="text-center text-sm text-on-surface-variant">لا توجد تفاصيل شكوى متاحة لهذا البلاغ.</p>
          </DetailCard>
        )}
        {complaint && (
          <>
        <DetailCard className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <StatusChip label={complaintStatusLabel(complaint?.status)} tone={statusTone(complaint?.status)} />
              <StatusChip label={complaint?.priority === 'HIGH' ? 'هامة' : 'عادية'} tone={complaint?.priority === 'HIGH' ? 'danger' : 'neutral'} />
            </div>
            <p className="text-sm text-on-surface-variant">بلاغ رقم {complaint?.id ?? 'comp-001'}</p>
          </div>
          <h1 className="text-right text-2xl font-bold leading-9 text-primary">{complaint?.title ?? 'صيانة المصاعد - البرج أ'}</h1>
          <p className="text-right text-sm text-on-surface-variant">تم الإنشاء: {complaint?.createdAt?.slice(0, 10) ?? '2024-05-20'}</p>
        </DetailCard>

        <DetailCard>
          <SectionTitle title="تفاصيل البلاغ" icon={FileText} />
          <p className="mt-3 text-right leading-7 text-on-surface-variant">
            {complaint?.description ?? 'يوجد عطل متكرر يحتاج إلى متابعة عاجلة من فريق الصيانة.'}
          </p>
          <div className="mt-4 overflow-hidden rounded-[22px] bg-surface-container-low">
            <img alt="" className="h-36 w-full object-cover" src={heroImages.maintenance} />
          </div>
        </DetailCard>

        <DetailCard>
          <SectionTitle title="تتبع الحالة" icon={Clock3} />
          <div className="mt-4">
            <Timeline
              items={(complaint?.timeline ?? []).map((item, index) => ({
                title: item.status,
                description: item.note,
                time: item.date.slice(0, 10),
                done: index < 2,
              }))}
            />
          </div>
        </DetailCard>

        <DetailCard>
          <SectionTitle title="تقييم الخدمة" icon={Star} />
          <div className="mt-4 flex justify-center gap-2 text-tertiary">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className="h-8 w-8 fill-current" />
            ))}
          </div>
        </DetailCard>
          </>
        )}
      </main>
    </PageFrame>
  );
}
