'use client';

import { Button } from '@/frontend/components/ui/Button';

interface EmptyStateProps {
  onStartJam: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onStartJam, isFiltered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
      {/* Ghost icon */}
      <div className="w-16 h-16 rounded-2xl bg-jam-surface border border-jam-border flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>

      <h2 className="text-lg font-semibold text-jam-text mb-2">
        {isFiltered ? 'No jams with this vibe' : 'No public jams right now'}
      </h2>
      <p className="text-sm text-jam-muted mb-8 max-w-xs">
        {isFiltered
          ? 'Try a different filter, or be the first to set the vibe.'
          : 'The room is quiet — be the first to start something.'}
      </p>

      <Button variant="primary" size="lg" pill onClick={onStartJam}>
        Start a jam
      </Button>
    </div>
  );
}
