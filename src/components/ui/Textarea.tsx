import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 4, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-on-surface text-right block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface border border-transparent placeholder:text-on-surface-variant/40 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-200 text-base resize-none',
            {
              'border-error focus:border-error': error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-error mt-0.5 text-right w-full">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
