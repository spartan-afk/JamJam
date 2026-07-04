import { supabaseServer } from '@/backend/lib/supabase';
import { getValidToken, createPlaylist } from '@/backend/lib/spotify';
import type { VibeTag } from '@/frontend/types';

// ─── Create room ──────────────────────────────────────────────────
export async function createRoom(
  hostId: string,
  name: string,
  vibe: VibeTag | null,
  isPublic: boolean
) {
  const { data, error } = await supabaseServer
    .from('rooms')
    .insert({
      host_id:   hostId,
      name:      name.trim() || 'Untitled jam',
      vibe,
      is_public: isPublic,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Add host as first member
  await supabaseServer
    .from('room_members')
    .insert({ room_id: data.id, spotify_id: hostId });

  return data;
}

// ─── Join room ────────────────────────────────────────────────────
export async function joinRoom(roomId: string, spotifyId: string) {
  const { error } = await supabaseServer
    .from('room_members')
    .upsert({ room_id: roomId, spotify_id: spotifyId });

  if (error) throw new Error(error.message);
}

// ─── Get public rooms (with member count + host info) ─────────────
export async function getPublicRooms(vibe?: string | null) {
  let query = supabaseServer
    .from('rooms')
    .select(`
      *,
      host:users!rooms_host_id_fkey(display_name, avatar_url),
      room_members(count)
    `)
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(40);

  if (vibe && vibe !== 'all') {
    query = query.eq('vibe', vibe);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Flatten the member count from the nested aggregate
  return (data ?? []).map((r: any) => ({
    ...r,
    member_count: r.room_members?.[0]?.count ?? 0,
    room_members: undefined,
  }));
}

// ─── Get single room with member count ───────────────────────────
export async function getRoom(roomId: string) {
  const { data, error } = await supabaseServer
    .from('rooms')
    .select(`
      *,
      host:users!rooms_host_id_fkey(display_name, avatar_url),
      room_members(count)
    `)
    .eq('id', roomId)
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    member_count: data.room_members?.[0]?.count ?? 0,
    room_members: undefined,
  };
}

// ─── Get room members (for listener list) ────────────────────────
export async function getRoomMembers(roomId: string) {
  const { data, error } = await supabaseServer
    .from('room_members')
    .select('spotify_id, joined_at, user:users(display_name, avatar_url)')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Save session as playlist ─────────────────────────────────────
export async function saveSessionAsPlaylist(roomId: string, spotifyId: string) {
  // 1. Load room
  const { data: room } = await supabaseServer
    .from('rooms')
    .select('name')
    .eq('id', roomId)
    .single();
  if (!room) throw new Error('room_not_found');

  // 2. Load distinct track URIs in order played
  const { data: tracks } = await supabaseServer
    .from('room_track_log')
    .select('track_uri')
    .eq('room_id', roomId)
    .order('played_at', { ascending: true });

  const uris = Array.from(new Set((tracks ?? []).map((t: any) => t.track_uri))).filter(Boolean);
  if (uris.length === 0) throw new Error('no_tracks_played_yet');

  // 3. Get a valid (auto-refreshed) access token
  const accessToken = await getValidToken(spotifyId);

  // 4. Create the Spotify playlist
  const playlist = await createPlaylist(
    accessToken,
    spotifyId,
    `JAMJAM — ${room.name}`,
    uris
  );

  return playlist.external_urls?.spotify as string;
}

// ─── Get user's joined rooms ─────────────────────────────────────────
export async function getUserRooms(spotifyId: string) {
  const { data, error } = await supabaseServer
    .from('room_members')
    .select(`
      joined_at,
      room:rooms (
        *,
        host:users!rooms_host_id_fkey(display_name, avatar_url),
        room_members(count)
      )
    `)
    .eq('spotify_id', spotifyId)
    .order('joined_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row: any) => {
      const r = row.room;
      if (!r) return null;
      return {
        ...r,
        member_count: r.room_members?.[0]?.count ?? 0,
        room_members: undefined,
      };
    })
    .filter(Boolean);
}

// ─── Get recent jam friends ──────────────────────────────────────────
export async function getRecentJamFriends(spotifyId: string) {
  const { data: myRooms } = await supabaseServer
    .from('room_members')
    .select('room_id')
    .eq('spotify_id', spotifyId);

  if (!myRooms || myRooms.length === 0) return [];
  const roomIds = myRooms.map((r) => r.room_id);

  const { data: friends } = await supabaseServer
    .from('room_members')
    .select('spotify_id, joined_at, user:users(display_name, avatar_url)')
    .in('room_id', roomIds)
    .neq('spotify_id', spotifyId)
    .order('joined_at', { ascending: false });

  if (!friends) return [];

  const uniqueFriends = new Map();
  for (const f of friends) {
    if (!uniqueFriends.has(f.spotify_id)) {
      uniqueFriends.set(f.spotify_id, f);
    }
  }

  return Array.from(uniqueFriends.values());
}
