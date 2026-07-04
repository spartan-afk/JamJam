'use client';

import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  pill?:    boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:     'bg-jam-violet text-white hover:bg-opacity-90 disabled:opacity-50',
  secondary:   'bg-transparent border border-jam-border text-jam-text hover:border-jam-violet hover:text-jam-violet disabled:opacity-50',
  tertiary:    'bg-transparent text-jam-muted hover:text-jam-text disabled:opacity-40',
  destructive: 'bg-transparent border border-jam-red text-jam-red hover:bg-jam-red hover:text-white disabled:opacity-50',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2   text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

export function Button({
  variant = 'primary',
  size    = 'md',
  pill    = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jam-violet focus-visible:ring-offset-2 focus-visible:ring-offset-jam-black cursor-pointer',
        pill ? 'rounded-full' : 'rounded-[10px]',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
