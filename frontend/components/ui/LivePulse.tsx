'use client';

type LivePulseProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2   h-2',
  lg: 'w-2.5 h-2.5',
};

export function LivePulse({ size = 'md', className = '' }: LivePulseProps) {
  return (
    <span
      className={`inline-block rounded-full bg-jam-red animate-pulse-live flex-shrink-0 ${sizes[size]} ${className}`}
      aria-label="Live"
    />
  );
}
