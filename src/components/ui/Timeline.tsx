import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

export interface TimelineItem {
  title: string;
  description: string;
  time: string;
  done?: boolean;
  danger?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const Icon = item.done ? CheckCircle2 : Circle;

        return (
          <div key={`${item.title}-${item.time}`} className="grid grid-cols-[1fr_32px] gap-3">
            <div className="pb-5 text-right">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-on-surface-variant">{item.time}</span>
                <h3 className={cn('text-base font-bold text-primary', item.danger && 'text-error')}>{item.title}</h3>
              </div>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">{item.description}</p>
            </div>
            <div className="relative flex justify-center">
              {index < items.length - 1 && <span className="absolute top-7 h-full w-px bg-outline-variant" />}
              <span
                className={cn(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white',
                  item.done ? 'text-secondary' : item.danger ? 'text-error' : 'text-outline',
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

