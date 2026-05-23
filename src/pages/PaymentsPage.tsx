import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Download, History, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CoreTopBar } from '../components/layout/CoreTopBar';
import { StatusChip } from '../components/ui/StatusChip';
import { paymentService } from '../features/payments/services/payment.service';
import { ROUTES } from '../lib/constants/routes';
import { formatMoney } from '../lib/utils/format-money';

function paymentStatusLabel(status: string) {
  if (status === 'PAID') return 'مدفوع';
  if (status === 'OVERDUE') return 'متأخر';
  return 'غير مدفوع';
}

export function PaymentsPage() {
  const { data: payments = [] } = useQuery({ queryKey: ['payments'], queryFn: paymentService.getPayments });
  const unpaidPayments = payments.filter((payment) => payment.status !== 'PAID');
  const totalDue = unpaidPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section className="min-h-dvh bg-background pb-28">
      <CoreTopBar brand />
      <main className="space-y-6 px-5 pt-7">
        <div className="flex items-end justify-between gap-4">
          <StatusChip label="غير مدفوع" tone="warning" />
          <div className="text-right">
            <h1 className="text-2xl font-bold text-primary">المدفوعات</h1>
            <p className="mt-1 text-base text-on-surface-variant">إدارة الفواتير والاشتراكات الخاصة بك</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-primary p-6 text-white shadow-xl shadow-primary/15">
          <div className="absolute -left-14 -top-14 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-start justify-between">
              <Wallet className="h-9 w-9 text-secondary-fixed" />
              <div className="text-left">
                <p className="text-xl font-semibold text-primary-fixed-dim">إجمالي المستحقات</p>
                <p className="mt-4 text-5xl font-bold tracking-tight">{formatMoney(totalDue || 5000)}</p>
              </div>
            </div>
            <button className="w-full rounded-2xl bg-secondary px-6 py-4 text-2xl font-bold text-white shadow-lg" type="button">
              ادفع الآن
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <h2 className="text-2xl font-bold text-primary">سجل المدفوعات</h2>
          <History className="h-7 w-7 text-primary" aria-hidden="true" />
        </div>

        <div className="space-y-5">
          {payments.map((payment) => {
            const paid = payment.status === 'PAID';
            const overdue = payment.status === 'OVERDUE';

            return (
              <Link
                key={payment.id}
                className={`block rounded-[24px] border bg-white p-5 shadow-md shadow-primary/5 transition-transform active:scale-[0.99] ${
                  overdue ? 'border-r-4 border-r-error border-outline-variant' : 'border-outline-variant'
                }`}
                to={`/payments/${payment.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className={`text-2xl font-bold ${overdue ? 'text-error' : 'text-secondary'}`}>{formatMoney(payment.amount)}</p>
                    <StatusChip label={paymentStatusLabel(payment.status)} tone={paid ? 'success' : overdue ? 'danger' : 'warning'} className="mt-2" />
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="text-xl font-bold text-primary">{payment.billingPeriod}</h3>
                    <p className="mt-1 truncate text-base text-on-surface-variant">{payment.title}</p>
                  </div>
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${paid ? 'bg-secondary-container/30 text-secondary' : 'bg-error-container text-error'}`}>
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                </div>
                {paid && (
                  <div className="mt-4 flex justify-start border-t border-outline-variant/40 pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary">
                      تحميل الإيصال
                      <Download className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 rounded-[24px] border border-dashed border-secondary/30 bg-secondary-container/10 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-secondary shadow-sm">
            <Wallet className="h-7 w-7" />
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-primary">هل لديك استفسار؟</h3>
            <p className="mt-1 text-sm text-on-surface-variant">تواصل مع قسم الحسابات مباشرة</p>
            <Link className="mt-2 inline-block text-sm font-bold text-secondary" to={ROUTES.SUPPORT}>
              تواصل معنا
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}
