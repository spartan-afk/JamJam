'use client';

interface WaveformProps {
  isPlaying: boolean;
  color?:    'violet' | 'white';
  className?: string;
}

export function Waveform({ isPlaying, className = '' }: WaveformProps) {
  return (
    <span
      className={`inline-flex items-end gap-[3px] h-[18px] ${className}`}
      aria-label={isPlaying ? 'Playing' : 'Paused'}
    >
      {[1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className={`wf-bar wf-bar-${n}${isPlaying ? '' : ' paused'}`}
          style={{ height: isPlaying ? undefined : '3px' }}
        />
      ))}
    </span>
  );
}
