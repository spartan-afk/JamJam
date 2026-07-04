'use client';

import { Button } from '@/frontend/components/ui/Button';

interface HostControlsProps {
  isPlaying:  boolean;
  deviceReady: boolean;
  onToggle:   () => void;
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6"  y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

export function HostControls({ isPlaying, deviceReady, onToggle }: HostControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main play/pause */}
      <button
        onClick={onToggle}
        disabled={!deviceReady}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={[
          'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200',
          deviceReady
            ? 'bg-jam-violet text-white hover:bg-opacity-85 hover:scale-105 active:scale-95 shadow-glow-violet'
            : 'bg-jam-surface text-jam-border border border-jam-border cursor-not-allowed',
        ].join(' ')}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      {!deviceReady && (
        <p className="text-xs text-jam-muted flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-jam-warn animate-pulse" />
          Connecting device...
        </p>
      )}

      <p className="text-[11px] text-jam-border">
        Host controls · play from Spotify on this device
      </p>
    </div>
  );
}
