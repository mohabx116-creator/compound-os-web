import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none',
        {
          'bg-primary text-white hover:bg-primary-container shadow-md': variant === 'primary',
          'bg-secondary text-white hover:bg-secondary/90 shadow-md': variant === 'secondary',
          'border border-outline-variant text-on-surface hover:bg-surface-container-low': variant === 'outline',
          'bg-error text-white hover:bg-error/90 shadow-md': variant === 'error',
          'text-on-surface-variant hover:bg-surface-container': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm rounded-lg': size === 'sm',
          'px-5 py-2.5 text-base rounded-xl': size === 'md',
          'px-7 py-3 text-lg rounded-2xl': size === 'lg',
          'h-11 w-11 rounded-full p-0 flex items-center justify-center': size === 'icon',
        },
        className
      )}
      {...props}
    />
  );
};
