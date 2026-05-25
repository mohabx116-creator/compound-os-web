import { useQuery } from '@tanstack/react-query';
import { Clock3, Download, FileCheck, FileText, History, Info, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatusChip } from '../../components/ui/StatusChip';
import { Timeline } from '../../components/ui/Timeline';
import { complaintService } from '../../features/complaints/services/complaint.service';
import { paymentService } from '../../features/payments/services/payment.service';
import { ApiClientError } from '../../lib/api/api-client';
import { ROUTES } from '../../lib/constants/routes';
import { useSession } from '../../lib/session/use-session';
import { formatMoney } from '../../lib/utils/format-money';
import { complaintStatusLabel, heroImages, PageFrame, paymentStatusLabel, SectionTitle, statusTone } from './shared';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ComplaintDetailErrorKind = 'invalid-id' | 'not-found' | 'load-failed';

function isUuidLike(value: string) {
  return uuidPattern.test(value);
}

function getComplaintDetailErrorKind(error: unknown): ComplaintDetailErrorKind {
  if (error instanceof ApiClientError) {
    if (error.status === 404) return 'not-found';
    if (error.status === 400) return 'invalid-id';
  }

  return 'load-failed';
}

function getComplaintDetailErrorCopy(kind: ComplaintDetailErrorKind) {
  if (kind === 'invalid-id') {
    return {
      title: 'رقم الشكوى غير صالح',
      description: 'تأكد من الرابط أو ارجع إلى قائمة الشكاوى.',
    };
  }

  if (kind === 'not-found') {
    return {
      title: 'الشكوى غير موجودة',
      description: 'ربما تم حذفها أو أن الرابط غير صحيح.',
    };
  }

  return {
    title: 'تعذر تحميل تفاصيل الشكوى',
    description: 'حاول مرة أخرى بعد لحظات.',
  };
}

interface ComplaintDetailErrorCardProps {
  kind: ComplaintDetailErrorKind;
  isRetrying?: boolean;
  onRetry?: () => void;
}

function ComplaintDetailErrorCard({ kind, isRetrying = false, onRetry }: ComplaintDetailErrorCardProps) {
  const copy = getComplaintDetailErrorCopy(kind);

  return (
    <DetailCard className="space-y-4 text-right">
      <div>
        <h1 className="text-xl font-bold text-error">{copy.title}</h1>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{copy.description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Link className="inline-flex justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/15" to={ROUTES.COMPLAINTS}>
          العودة إلى قائمة الشكاوى
        </Link>
        {onRetry && (
          <button
            className="inline-flex justify-center rounded-2xl border border-outline-variant px-5 py-3 text-sm font-bold text-primary disabled:opacity-60"
            disabled={isRetrying}
            type="button"
            onClick={onRetry}
          >
            {isRetrying ? 'جاري المحاولة...' : 'إعادة المحاولة'}
          </button>
        )}
      </div>
    </DetailCard>
  );
}

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
  const { id: routeComplaintId } = useParams<{ id?: string }>();
  const session = useSession();
  const complaintId = routeComplaintId?.trim() || session.complaintId || '';
  const hasComplaintId = complaintId.length > 0;
  const hasValidComplaintId = hasComplaintId && isUuidLike(complaintId);
  const invalidIdError = hasComplaintId && !hasValidComplaintId;
  const { data: complaint, isFetching, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: () => complaintService.getBackendComplaintById(complaintId),
    enabled: hasValidComplaintId,
  });
  const complaintErrorKind = invalidIdError
    ? 'invalid-id'
    : isError
      ? getComplaintDetailErrorKind(error)
      : undefined;

  return (
    <PageFrame>
      <CoreTopBar title="تفاصيل الشكوى" back />
      <main className="space-y-5 px-5 pt-6">
        {isLoading && hasValidComplaintId && (
          <DetailCard>
            <p className="text-center text-sm font-bold text-secondary">جاري تحميل تفاصيل الشكوى...</p>
          </DetailCard>
        )}
        {complaintErrorKind && (
          <ComplaintDetailErrorCard
            kind={complaintErrorKind}
            isRetrying={isFetching}
            onRetry={complaintErrorKind === 'load-failed' ? () => {
              void refetch();
            } : undefined}
          />
        )}
        {!hasComplaintId && (
          <DetailCard>
            <p className="text-center text-sm text-on-surface-variant">لا توجد تفاصيل شكوى متاحة لهذا البلاغ.</p>
          </DetailCard>
        )}
        {complaint && (
          <>
        <DetailCard className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <StatusChip label={complaintStatusLabel(complaint.status)} tone={statusTone(complaint.status)} />
              <StatusChip label={complaint.priority === 'HIGH' ? 'هامة' : 'عادية'} tone={complaint.priority === 'HIGH' ? 'danger' : 'neutral'} />
            </div>
            <p className="text-sm text-on-surface-variant">بلاغ رقم {complaint.id}</p>
          </div>
          <h1 className="text-right text-2xl font-bold leading-9 text-primary">{complaint.title}</h1>
          <p className="text-right text-sm text-on-surface-variant">تم الإنشاء: {complaint.createdAt.slice(0, 10)}</p>
        </DetailCard>

        <DetailCard>
          <SectionTitle title="تفاصيل البلاغ" icon={FileText} />
          <p className="mt-3 text-right leading-7 text-on-surface-variant">
            {complaint.description}
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
