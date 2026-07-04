'use client';

import type { SpotifyArtist } from '@/frontend/types';
import { Avatar } from '@/frontend/components/ui/Avatar';

interface ArtistRowProps {
  artist: SpotifyArtist;
  rank:   number;
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function ArtistRow({ artist, rank }: ArtistRowProps) {
  const avatarSrc = artist.images?.[1]?.url ?? artist.images?.[0]?.url;
  const topGenre  = artist.genres?.[0];

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-jam-surface transition-colors">
      {/* Rank */}
      <span className="w-5 text-xs text-jam-border tabular-nums text-right flex-shrink-0">
        {rank}
      </span>

      {/* Avatar */}
      <Avatar src={avatarSrc} name={artist.name} size="md" />

      {/* Name + genre */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-jam-text truncate">{artist.name}</p>
        {topGenre && (
          <p className="text-xs text-jam-muted capitalize truncate">{topGenre}</p>
        )}
      </div>

      {/* Followers */}
      <span className="text-xs text-jam-border tabular-nums flex-shrink-0">
        {formatFollowers(artist.followers?.total ?? 0)}
      </span>
    </div>
  );
}
