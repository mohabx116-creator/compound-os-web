import { CheckCircle2, Clock3, CircleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

interface StatusChipProps {
  label: string;
  tone?: StatusTone;
  icon?: LucideIcon;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-secondary-container/40 text-on-secondary-container',
  warning: 'bg-tertiary-fixed/40 text-tertiary',
  danger: 'bg-error-container text-error',
  neutral: 'bg-surface-container text-on-surface-variant',
};

const defaultIcons: Record<StatusTone, LucideIcon> = {
  success: CheckCircle2,
  warning: Clock3,
  danger: CircleAlert,
  neutral: Clock3,
};

export function StatusChip({ label, tone = 'neutral', icon, className }: StatusChipProps) {
  const Icon = icon ?? defaultIcons[tone];

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', toneClasses[tone], className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
