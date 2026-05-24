import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

export const heroImages = {
  compound:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=900',
  office:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900',
  maintenance:
    'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=900',
  gym:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500',
  lounge:
    'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80&w=500',
  court:
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=500',
  pool:
    'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=80&w=500',
};

export function PageFrame({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('min-h-dvh bg-background pb-32', className)}>{children}</section>;
}

export function SectionTitle({ title, icon: Icon }: { title: string; icon?: LucideIcon }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      {Icon && <Icon className="h-6 w-6 text-primary" />}
    </div>
  );
}

export function IconBubble({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary-container/30 text-secondary', className)}>
      <Icon className="h-7 w-7" />
    </span>
  );
}

export function statusTone(status?: string) {
  if (status === 'PAID' || status === 'RESOLVED' || status === 'CONFIRMED' || status === 'ACTIVE') return 'success';
  if (status === 'OVERDUE' || status === 'URGENT') return 'danger';
  return 'warning';
}

export function paymentStatusLabel(status?: string) {
  if (status === 'PAID') return 'مدفوع';
  if (status === 'OVERDUE') return 'متأخر';
  return 'قيد السداد';
}

export function complaintStatusLabel(status?: string) {
  if (status === 'RESOLVED') return 'تم الحل';
  if (status === 'IN_PROGRESS') return 'قيد التنفيذ';
  if (status === 'ESCALATED') return 'مصعدة';
  if (status === 'CLOSED') return 'مغلقة';
  return 'مفتوحة';
}

export const fieldClass =
  'w-full rounded-2xl border-0 bg-surface-container-low px-4 py-4 text-right text-primary shadow-none placeholder:text-outline focus:ring-2 focus:ring-secondary';
