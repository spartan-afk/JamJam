export const dynamic = 'force-dynamic';

import { cookies }         from 'next/headers';
import { redirect }        from 'next/navigation';
import { supabaseServer }  from '@/backend/lib/supabase';
import { Avatar }          from '@/frontend/components/ui/Avatar';
import { Button }          from '@/frontend/components/ui/Button';

export default async function ProfilePage() {
  const sessionId = cookies().get('jamjam_session')?.value;
  if (!sessionId) redirect('/api/auth/login');

  const { data: user } = await supabaseServer
    .from('users')
    .select('spotify_id, display_name, avatar_url')
    .eq('spotify_id', sessionId)
    .single();

  // Past saved sessions (rooms where the user was host and tracks were logged)
  const { data: logs } = await supabaseServer
    .from('room_track_log')
    .select('room_id, rooms(name, created_at)')
    .eq('rooms.host_id', sessionId)
    .order('room_id');

  // Group logs by room_id
  const roomMap = new Map<string, { name: string; tracks: number; createdAt: string }>();
  (logs ?? []).forEach((row: any) => {
    if (!row.rooms) return;
    const id = row.room_id;
    if (!roomMap.has(id)) {
      roomMap.set(id, { name: row.rooms.name, tracks: 0, createdAt: row.rooms.created_at });
    }
    roomMap.get(id)!.tracks++;
  });
  const pastSessions = Array.from(roomMap.entries()).reverse().slice(0, 10);

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-10">

      {/* Profile card */}
      <section className="flex items-center gap-5 p-5 rounded-2xl bg-jam-surface border border-jam-border">
        <Avatar src={user?.avatar_url} name={user?.display_name} size="xl" />
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-jam-text truncate">
            {user?.display_name ?? 'Spotify user'}
          </p>
          <p className="text-xs text-jam-muted mt-0.5">@{user?.spotify_id}</p>
          <p className="text-xs text-jam-border mt-2">Connected via Spotify Premium</p>
        </div>
      </section>

      {/* Past sessions */}
      <section>
        <h2 className="text-xs font-semibold text-jam-muted uppercase tracking-wide mb-4">
          Past jam sessions
        </h2>
        {pastSessions.length === 0 ? (
          <p className="text-sm text-jam-border px-1">
            No sessions saved yet — host a jam and save it as a playlist.
          </p>
        ) : (
          <div className="space-y-2">
            {pastSessions.map(([id, s]) => (
              <div key={id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-jam-surface border border-jam-border">
                <div>
                  <p className="text-sm font-medium text-jam-text">{s.name}</p>
                  <p className="text-xs text-jam-muted mt-0.5">
                    {s.tracks} track{s.tracks !== 1 ? 's' : ''} played
                  </p>
                </div>
                <a href={`/room/${id}`}>
                  <Button variant="tertiary" size="sm">Revisit</Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Disconnect */}
      <section>
        <a
          href="/api/auth/logout"
          className="text-xs text-jam-muted hover:text-jam-red transition-colors"
        >
          Disconnect Spotify
        </a>
      </section>

    </div>
  );
}
