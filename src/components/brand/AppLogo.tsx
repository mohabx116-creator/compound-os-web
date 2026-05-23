import { cn } from '../../lib/utils/cn';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  card?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-32 w-32',
};

export function AppLogo({ size = 'md', withText = false, card = false, className }: AppLogoProps) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-2xl',
          sizeClasses[size],
          card && 'bg-white p-3 shadow-xl shadow-primary/10',
        )}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-x-[8%] top-[4%] h-[48%] rotate-45 rounded-sm bg-[#19c392]" />
          <div className="absolute inset-x-[13%] bottom-[7%] h-[58%] rounded-b-2xl bg-primary" />
          <div className="absolute inset-x-[36%] bottom-[7%] h-[34%] rounded-t-md bg-background" />
        </div>
      </div>
      {withText && <span className="text-sm font-bold text-primary">Compound OS</span>}
    </div>
  );
}
