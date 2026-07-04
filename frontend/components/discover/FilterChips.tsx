'use client';

import { useState } from 'react';

type Vibe = 'all' | 'chill' | 'party' | 'discover' | 'study' | 'late_night';

const CHIPS: { value: Vibe; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'chill',     label: 'Chill'     },
  { value: 'party',     label: 'Party'     },
  { value: 'discover',  label: 'Discover'  },
  { value: 'study',     label: 'Study'     },
  { value: 'late_night', label: 'Late night' },
];

interface FilterChipsProps {
  value:    Vibe;
  onChange: (v: Vibe) => void;
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by vibe">
      {CHIPS.map(({ value: v, label }) => {
        const active = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border',
              active
                ? 'bg-jam-violet/20 border-jam-violet/60 text-jam-violet'
                : 'bg-transparent border-jam-border text-jam-muted hover:border-jam-muted hover:text-jam-text',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
