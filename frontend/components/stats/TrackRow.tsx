'use client';

import type { SpotifyTrack } from '@/frontend/types';

interface TrackRowProps {
  track: SpotifyTrack;
  rank:  number;
}

function msToTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function TrackRow({ track, rank }: TrackRowProps) {
  const artUrl = track.album.images?.[1]?.url ?? track.album.images?.[0]?.url;
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-jam-surface transition-colors group">
      {/* Rank */}
      <span className="w-5 text-xs text-jam-border tabular-nums text-right flex-shrink-0">
        {rank}
      </span>

      {/* Art */}
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-jam-raised border border-jam-border flex-shrink-0">
        {artUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={artUrl} alt={track.album.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-jam-raised" />
        }
      </div>

      {/* Name + artist */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-jam-text truncate">{track.name}</p>
        <p className="text-xs text-jam-muted truncate">{track.artists.map((a) => a.name).join(', ')}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-jam-border tabular-nums flex-shrink-0">
        {msToTime(track.duration_ms)}
      </span>
    </div>
  );
}
