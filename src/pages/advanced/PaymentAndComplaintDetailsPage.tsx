import { useQuery } from '@tanstack/react-query';
import { Clock3, Download, FileCheck, FileText, History, Info } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CoreTopBar } from '../../components/layout/CoreTopBar';
import { DetailCard } from '../../components/ui/DetailCard';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatusChip } from '../../components/ui/StatusChip';
import { Timeline } from '../../components/ui/Timeline';
import { paymentService } from '../../features/payments/services/payment.service';
import { ApiClientError } from '../../lib/api/api-client';
import { complaintApiService } from '../../lib/api/complaint-service';
import type { Complaint, ComplaintPriority, ComplaintStatus, UnitStatus, UnitType } from '../../lib/api/types';
import { ROUTES } from '../../lib/constants/routes';
import { useSession } from '../../lib/session/use-session';
import { formatMoney } from '../../lib/utils/format-money';
import { heroImages, PageFrame, paymentStatusLabel, SectionTitle, statusTone } from './shared';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ComplaintDetailErrorKind = 'invalid-id' | 'not-found' | 'load-failed';
type ChipTone = 'success' | 'warning' | 'danger' | 'neutral';

const complaintStatusLabels: Record<ComplaintStatus, string> = {
  OPEN: 'مفتوحة',
  IN_PROGRESS: 'قيد المعالجة',
  RESOLVED: 'تم الحل',
  CLOSED: 'مغلقة',
  ESCALATED: 'مصعدة',
};

const complaintPriorityLabels: Record<ComplaintPriority, string> = {
  LOW: 'منخفضة',
  MEDIUM: 'متوسطة',
  HIGH: 'عالية',
  URGENT: 'عاجلة',
};

const unitTypeLabels: Record<UnitType, string> = {
  APARTMENT: 'شقة',
  VILLA: 'فيلا',
  SHOP: 'محل',
  OFFICE: 'مكتب',
};

const unitStatusLabels: Record<UnitStatus, string> = {
  OCCUPIED: 'مشغولة',
  VACANT: 'شاغرة',
  MAINTENANCE: 'صيانة',
};

function isUuidLike(value: string) {
  return uuidPattern.test(value);
}

function formatDateTime(value: string) {
  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return value;
  }
}

function complaintStatusLabel(status: ComplaintStatus) {
  return complaintStatusLabels[status] ?? status;
}

function complaintPriorityLabel(priority: ComplaintPriority) {
  return complaintPriorityLabels[priority] ?? priority;
}

function unitTypeLabel(unitType: UnitType) {
  return unitTypeLabels[unitType] ?? unitType;
}

function unitStatusLabel(status: UnitStatus) {
  return unitStatusLabels[status] ?? status;
}

function complaintStatusTone(status: ComplaintStatus): ChipTone {
  if (status === 'RESOLVED' || status === 'CLOSED') return 'success';
  if (status === 'OPEN' || status === 'ESCALATED') return 'danger';
  return 'warning';
}

function complaintPriorityTone(priority: ComplaintPriority): ChipTone {
  if (priority === 'URGENT' || priority === 'HIGH') return 'danger';
  if (priority === 'MEDIUM') return 'warning';
  return 'neutral';
}

function unitStatusTone(status: UnitStatus): ChipTone {
  if (status === 'OCCUPIED') return 'success';
  if (status === 'MAINTENANCE') return 'warning';
  return 'neutral';
}

function complaintTimeline(complaint: Complaint) {
  return [
    {
      title: 'تم إنشاء الشكوى',
      description: 'تم تسجيل الشكوى وإرسالها إلى الإدارة المختصة.',
      time: formatDateTime(complaint.createdAt),
      done: true,
    },
    {
      title: 'آخر تحديث',
      description: `حالة الشكوى الحالية: ${complaintStatusLabel(complaint.status)}.`,
      time: formatDateTime(complaint.updatedAt),
      done: complaint.status !== 'OPEN',
    },
  ];
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
    queryFn: () => complaintApiService.getComplaintById(complaintId),
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
            <DetailCard className="space-y-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusChip label={complaintStatusLabel(complaint.status)} tone={complaintStatusTone(complaint.status)} />
                    <StatusChip label={complaintPriorityLabel(complaint.priority)} tone={complaintPriorityTone(complaint.priority)} />
                  </div>
                  <p className="text-right text-xs font-semibold text-on-surface-variant break-all">رقم الشكوى: {complaint.id}</p>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold leading-9 text-primary">{complaint.title}</h1>
                  <p className="mt-2 text-sm text-on-surface-variant">ملخص بيانات الشكوى الحالية من النظام.</p>
                </div>
              </div>
              <div>
                <InfoRow label="حالة الشكوى" value={complaintStatusLabel(complaint.status)} />
                <InfoRow label="أولوية الشكوى" value={complaintPriorityLabel(complaint.priority)} />
                <InfoRow label="تاريخ الإنشاء" value={formatDateTime(complaint.createdAt)} />
                <InfoRow label="آخر تحديث" value={formatDateTime(complaint.updatedAt)} />
              </div>
            </DetailCard>

            <DetailCard>
              <SectionTitle title="وصف الشكوى" icon={FileText} />
              <p className="mt-4 text-right text-base leading-8 text-on-surface-variant">
                {complaint.description}
              </p>
              <div className="mt-4 overflow-hidden rounded-[22px] bg-surface-container-low">
                <img alt="" className="h-36 w-full object-cover" src={heroImages.maintenance} />
              </div>
            </DetailCard>

            <DetailCard>
              <SectionTitle title="بيانات الساكن" icon={Info} />
              <div className="mt-3">
                <InfoRow label="اسم الساكن" value={complaint.resident?.fullName ?? 'غير متاح'} />
                <InfoRow label="رقم الهاتف" value={complaint.resident?.phone ?? 'غير متاح'} />
              </div>
            </DetailCard>

            <DetailCard>
              <SectionTitle title="بيانات الوحدة" icon={Info} />
              {complaint.unit ? (
                <div className="mt-3">
                  <InfoRow label="رقم الوحدة" value={complaint.unit.unitNumber} />
                  <InfoRow label="نوع الوحدة" value={unitTypeLabel(complaint.unit.unitType)} />
                  <InfoRow
                    label="حالة الوحدة"
                    value={<StatusChip label={unitStatusLabel(complaint.unit.status)} tone={unitStatusTone(complaint.unit.status)} />}
                  />
                </div>
              ) : (
                <p className="mt-4 text-right text-sm leading-6 text-on-surface-variant">لا توجد وحدة مرتبطة بهذه الشكوى.</p>
              )}
            </DetailCard>

            <DetailCard>
              <SectionTitle title="بيانات الكمباوند" icon={Info} />
              <div className="mt-3">
                <InfoRow label="اسم الكمباوند" value={complaint.compound?.name ?? 'غير متاح'} />
              </div>
            </DetailCard>

            <DetailCard>
              <SectionTitle title="تتبع الحالة" icon={Clock3} />
              <div className="mt-4">
                <Timeline items={complaintTimeline(complaint)} />
              </div>
            </DetailCard>
          </>
        )}
      </main>
    </PageFrame>
  );
}
