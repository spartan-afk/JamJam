'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrackRow }   from '@/frontend/components/stats/TrackRow';
import { ArtistRow }  from '@/frontend/components/stats/ArtistRow';
import type { SpotifyTrack, SpotifyArtist } from '@/frontend/types';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

const RANGES: { value: TimeRange; label: string }[] = [
  { value: 'short_term',  label: '4 weeks'   },
  { value: 'medium_term', label: '6 months'  },
  { value: 'long_term',   label: 'All time'  },
];

export default function StatsPage() {
  const [range,   setRange]   = useState<TimeRange>('short_term');
  const [tracks,  setTracks]  = useState<SpotifyTrack[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchStats = useCallback(async (r: TimeRange) => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`/api/stats?range=${r}`);
      if (res.status === 401) {
        setError('Connect Spotify to see your stats.');
        setLoading(false); return;
      }
      const data = await res.json();
      setTracks(data.tracks ?? []);
      setArtists(data.artists ?? []);
    } catch {
      setError('Could not load stats right now.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(range); }, [range, fetchStats]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jam-text">Your stats</h1>
          <p className="text-sm text-jam-muted mt-0.5">Top tracks and artists, available any time</p>
        </div>

        {/* Time range pills */}
        <div className="flex gap-1.5 p-1 bg-jam-surface rounded-xl border border-jam-border">
          {RANGES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={[
                'px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all duration-150',
                range === value
                  ? 'bg-jam-raised text-jam-text shadow-sm'
                  : 'text-jam-muted hover:text-jam-text',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-jam-border bg-jam-surface px-5 py-8 text-center">
          <p className="text-sm text-jam-muted">{error}</p>
          {error.includes('Connect') && (
            <a href="/api/auth/login" className="mt-4 inline-block text-sm text-jam-violet hover:underline">
              Connect Spotify →
            </a>
          )}
        </div>
      )}

      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-14 rounded-xl bg-jam-surface animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top tracks */}
          <section>
            <h2 className="text-xs font-semibold text-jam-muted uppercase tracking-wide mb-3">
              Top tracks
            </h2>
            <div className="space-y-1">
              {tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} rank={i + 1} />
              ))}
              {tracks.length === 0 && (
                <p className="text-sm text-jam-border px-3">Nothing to show yet — listen to more music</p>
              )}
            </div>
          </section>

          {/* Top artists */}
          <section>
            <h2 className="text-xs font-semibold text-jam-muted uppercase tracking-wide mb-3">
              Top artists
            </h2>
            <div className="space-y-1">
              {artists.map((artist, i) => (
                <ArtistRow key={artist.id} artist={artist} rank={i + 1} />
              ))}
              {artists.length === 0 && (
                <p className="text-sm text-jam-border px-3">Nothing to show yet</p>
              )}
            </div>
          </section>
        </div>
      )}

    </div>
  );
}
