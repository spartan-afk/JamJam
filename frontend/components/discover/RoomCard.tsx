'use client';

import Link from 'next/link';
import { Avatar }    from '@/frontend/components/ui/Avatar';
import { Badge }     from '@/frontend/components/ui/Badge';
import { LivePulse } from '@/frontend/components/ui/LivePulse';
import type { Room } from '@/frontend/types';

const VIBE_LABELS: Record<string, string> = {
  chill:      'chill',
  party:      'party',
  discover:   'discover',
  study:      'study',
  late_night: 'late night',
};

interface RoomCardProps {
  room:    Room;
  variant?: 'default' | 'featured'; // featured = LiveNowRow large card
}

export function RoomCard({ room, variant = 'default' }: RoomCardProps) {
  const isLive    = room.is_playing;
  const artSrc    = room.current_track_art;
  const count     = room.member_count ?? 0;
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={`/room/${room.id}`}
      className={[
        'group flex flex-col rounded-2xl border overflow-hidden bg-jam-surface transition-all duration-200 hover:scale-[1.015] hover:-translate-y-0.5',
        isLive ? 'live-card-border' : 'border-jam-border hover:border-jam-border/70',
        isFeatured ? 'w-[200px] flex-shrink-0' : 'w-full',
      ].join(' ')}
    >
      {/* Album art */}
      <div className={`relative w-full overflow-hidden bg-jam-raised ${isFeatured ? 'h-[200px]' : 'h-[140px]'}`}>
        {artSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artSrc}
            alt={room.current_track_name ?? 'Album art'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}

        {/* Live overlay badge */}
        {isLive && (
          <div className="absolute top-2 left-2">
            <Badge variant="live">LIVE</Badge>
          </div>
        )}

        {/* Vibe badge */}
        {room.vibe && (
          <div className="absolute top-2 right-2">
            <Badge variant="vibe">{VIBE_LABELS[room.vibe] ?? room.vibe}</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-2">
        <div className="font-semibold text-[15px] text-jam-text leading-tight truncate">
          {room.name}
        </div>

        {/* Host */}
        {room.host && (
          <div className="flex items-center gap-2">
            <Avatar src={room.host.avatar_url} name={room.host.display_name} size="xs" />
            <span className="text-xs text-jam-muted truncate">{room.host.display_name ?? 'Host'}</span>
          </div>
        )}

        {/* Track + listener count */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-jam-muted truncate max-w-[70%]">
            {room.current_track_name
              ? `${room.current_track_name}${room.current_track_artist ? ` · ${room.current_track_artist}` : ''}`
              : 'Nothing playing yet'}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <LivePulse size="sm" />
            <span className="text-xs text-jam-muted tabular-nums">{count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
