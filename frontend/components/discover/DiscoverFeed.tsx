'use client';

import { useState, useMemo } from 'react';
import { Button }            from '@/frontend/components/ui/Button';
import { Input }             from '@/frontend/components/ui/Input';
import { FilterChips }       from '@/frontend/components/discover/FilterChips';
import { LiveNowRow }        from '@/frontend/components/discover/LiveNowRow';
import { RoomCard }          from '@/frontend/components/discover/RoomCard';
import { EmptyState }        from '@/frontend/components/discover/EmptyState';
import { CreateRoomModal }   from '@/frontend/components/discover/CreateRoomModal';
import type { Room } from '@/frontend/types';

interface DiscoverFeedProps {
  rooms:         Room[];
  isLoggedIn:    boolean;
}

type Vibe = 'all' | 'chill' | 'party' | 'discover' | 'study' | 'late_night';

export function DiscoverFeed({ rooms, isLoggedIn }: DiscoverFeedProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [vibe,      setVibe]      = useState<Vibe>('all');
  const [query,     setQuery]     = useState('');

  const filtered = useMemo(() => {
    let list = rooms;
    if (vibe !== 'all')  list = list.filter((r) => r.vibe === vibe);
    if (query.trim())    list = list.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.host?.display_name?.toLowerCase().includes(query.toLowerCase())
    );
    return list;
  }, [rooms, vibe, query]);

  const liveRooms = useMemo(() =>
    [...rooms].filter((r) => r.is_playing).sort((a, b) => (b.member_count ?? 0) - (a.member_count ?? 0)).slice(0, 10),
    [rooms]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jam-text">Discover</h1>
          <p className="text-sm text-jam-muted mt-0.5">Drop into a live room with strangers</p>
        </div>
        {isLoggedIn && (
          <Button variant="primary" size="md" pill onClick={() => setModalOpen(true)}>
            + Start a jam
          </Button>
        )}
      </div>

      {/* ── Search bar ──────────────────────────────────────────── */}
      <Input
        variant="search"
        placeholder="Search rooms, hosts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        id="room-search"
      />

      {/* ── Live now row ─────────────────────────────────────────── */}
      {liveRooms.length > 0 && <LiveNowRow rooms={liveRooms} />}

      {/* ── Filter chips ─────────────────────────────────────────── */}
      <FilterChips value={vibe} onChange={setVibe} />

      {/* ── Room grid ────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <EmptyState
          onStartJam={() => {
            if (isLoggedIn) setModalOpen(true);
            else window.location.href = '/api/auth/login';
          }}
          isFiltered={vibe !== 'all' || !!query.trim()}
        />
      )}

      {/* Not logged in CTA */}
      {!isLoggedIn && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-jam-muted">Connect Spotify to host your own room</p>
          <a href="/api/auth/login">
            <Button variant="primary" size="md" pill>Connect Spotify</Button>
          </a>
        </div>
      )}

      {/* Create room modal */}
      <CreateRoomModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
