'use client';

import { LivePulse } from './LivePulse';

type BadgeVariant = 'live' | 'vibe' | 'premium' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  live:    'bg-jam-red/15 text-jam-red border border-jam-red/30',
  vibe:    'bg-jam-violet/15 text-jam-violet border border-jam-violet/30',
  premium: 'bg-jam-surface text-jam-muted border border-jam-border',
  muted:   'bg-jam-surface text-jam-muted border border-jam-border',
};

export function Badge({ variant = 'muted', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}
    >
      {variant === 'live' && <LivePulse size="sm" />}
      {children}
    </span>
  );
}
