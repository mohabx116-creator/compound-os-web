import type { ReactNode } from 'react';

interface InfoRowProps {
  label: string;
  value: ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline-variant/40 py-3 last:border-b-0">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <span className="text-left text-sm font-bold text-primary">{value}</span>
    </div>
  );
}

