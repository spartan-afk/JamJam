'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search';
  label?:   string;
}

// Search icon SVG
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-jam-muted flex-shrink-0">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', label, className = '', id, ...rest }, ref) => {
    const base = 'bg-jam-surface border border-jam-border text-jam-text placeholder:text-jam-muted text-sm transition-all duration-200 focus:outline-none focus:border-jam-violet focus:ring-1 focus:ring-jam-violet w-full';

    if (variant === 'search') {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            ref={ref}
            id={id}
            className={`${base} pl-9 pr-4 py-2.5 rounded-full ${className}`}
            {...rest}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-jam-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`${base} px-3 py-2.5 rounded-[10px] ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
