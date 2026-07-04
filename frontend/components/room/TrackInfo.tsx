'use client';

import { Waveform } from '@/frontend/components/ui/Waveform';

interface TrackInfoProps {
  trackName?:   string | null;
  artistName?:  string | null;
  isPlaying:    boolean;
  positionMs?:  number;
}

function msToTime(ms: number) {
  const s     = Math.floor(ms / 1000);
  const m     = Math.floor(s / 60);
  const secs  = s % 60;
  return `${m}:${String(secs).padStart(2, '0')}`;
}

export function TrackInfo({ trackName, artistName, isPlaying, positionMs = 0 }: TrackInfoProps) {
  const hasTrack = !!trackName;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Track name + waveform */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-[20px] font-semibold text-jam-text leading-tight truncate">
            {hasTrack ? trackName : 'Nothing playing yet'}
          </h2>
        </div>
        {hasTrack && (
          <Waveform isPlaying={isPlaying} className="flex-shrink-0" />
        )}
      </div>

      {/* Artist */}
      {artistName && (
        <p className="text-sm text-jam-muted truncate">{artistName}</p>
      )}

      {/* Progress bar — visual only, host-controlled */}
      {hasTrack && (
        <div className="mt-2">
          <div className="h-[3px] w-full bg-jam-border rounded-full overflow-hidden">
            <div
              className="h-full bg-jam-violet rounded-full transition-none"
              style={{ width: '40%' }} /* TODO: compute from positionMs / duration_ms once duration is known */
            />
          </div>
          {positionMs > 0 && (
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-jam-border tabular-nums">{msToTime(positionMs)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
