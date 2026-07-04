'use client';

import { RoomCard } from './RoomCard';
import type { Room } from '@/frontend/types';

interface LiveNowRowProps {
  rooms: Room[];
}

export function LiveNowRow({ rooms }: LiveNowRowProps) {
  if (rooms.length === 0) return null;

  return (
    <section aria-label="Live now">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-jam-text uppercase tracking-wide">Live now</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-jam-red animate-pulse-live" />
      </div>

      {/* Horizontally scrollable row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
        {rooms.map((room) => (
          <div key={room.id} className="snap-start">
            <RoomCard room={room} variant="featured" />
          </div>
        ))}
      </div>
    </section>
  );
}
