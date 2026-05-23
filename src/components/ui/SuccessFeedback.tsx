import { CheckCircle2 } from 'lucide-react';

interface SuccessFeedbackProps {
  message: string;
}

export function SuccessFeedback({ message }: SuccessFeedbackProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-secondary/20 bg-secondary-container/35 px-4 py-3 text-sm font-semibold text-on-secondary-container">
      <CheckCircle2 className="h-5 w-5 text-secondary" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
