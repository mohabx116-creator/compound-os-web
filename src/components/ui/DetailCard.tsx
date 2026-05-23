import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

interface DetailCardProps {
  children: ReactNode;
  className?: string;
}

export function DetailCard({ children, className }: DetailCardProps) {
  return (
    <section className={cn('rounded-[28px] border border-outline-variant/70 bg-white p-5 shadow-lg shadow-primary/5', className)}>
      {children}
    </section>
  );
}

