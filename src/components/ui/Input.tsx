import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-on-surface text-right block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface border border-transparent placeholder:text-on-surface-variant/40 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-200 text-base',
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

Input.displayName = 'Input';
