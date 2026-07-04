'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabaseBrowser } from '@/backend/lib/supabase';
import { AlbumArtwork }   from './AlbumArtwork';
import { TrackInfo }      from './TrackInfo';
import { HostControls }   from './HostControls';
import { MemberState }    from './MemberState';
import { ListenerRow }    from './ListenerRow';
import { RoomHeader }     from './RoomHeader';
import { RightPanel }     from './RightPanel';
import { Button }         from '@/frontend/components/ui/Button';
import type { Room }      from '@/frontend/types';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

interface Member {
  spotify_id: string;
  user?: { display_name: string | null; avatar_url: string | null } | null;
}

interface RoomViewProps {
  initialRoom:       Room;
  initialMembers:    Member[];
  isHost:            boolean;
  spotifyAccessToken: string | null;
  currentUserId?:    string | null;
}

export default function RoomView({
  initialRoom,
  initialMembers,
  isHost,
  spotifyAccessToken,
  currentUserId,
}: RoomViewProps) {
  const [room,      setRoom]      = useState<Room>(initialRoom);
  const [members,   setMembers]   = useState<Member[]>(initialMembers);
  const [player,    setPlayer]    = useState<any>(null);
  const [deviceId,  setDeviceId]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]   = useState('');

  // ─── Supabase Realtime — room state ───────────────────────────────
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`room:${room.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload) => setRoom((prev) => ({ ...prev, ...(payload.new as Partial<Room>) }))
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'room_members', filter: `room_id=eq.${room.id}` },
        async () => {
          // Refetch member list on join event
          const { data } = await supabaseBrowser
            .from('room_members')
            .select('spotify_id, user:users(display_name, avatar_url)')
            .eq('room_id', room.id);
          if (data) setMembers(data as unknown as Member[]);
        }
      )
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, [room.id]);

  // ─── Spotify Web Playback SDK — host only ────────────────────────
  useEffect(() => {
    if (!isHost || !spotifyAccessToken) return;

    const script    = document.createElement('script');
    script.src      = 'https://sdk.scdn.co/spotify-player.js';
    script.async    = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const sdkPlayer = new window.Spotify.Player({
        name:          'JAMJAM Room',
        getOAuthToken: (cb: (t: string) => void) => cb(spotifyAccessToken),
        volume:        0.8,
      });

      sdkPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
      });

      sdkPlayer.addListener('player_state_changed', async (state: any) => {
        if (!state) return;
        const track = state.track_window.current_track;

        // Push now-playing state to Supabase → all members get it via Realtime
        await supabaseBrowser.from('rooms').update({
          current_track_uri:    track.uri,
          current_track_name:   track.name,
          current_track_artist: track.artists.map((a: any) => a.name).join(', '),
          current_track_art:    track.album.images?.[0]?.url ?? null,
          is_playing:           !state.paused,
          position_ms:          state.position,
          updated_at:           new Date().toISOString(),
        }).eq('id', room.id);

        // Log for save-as-playlist
        await supabaseBrowser.from('room_track_log').insert({
          room_id:      room.id,
          track_uri:    track.uri,
          track_name:   track.name,
          track_artist: track.artists[0]?.name ?? null,
        });
      });

      sdkPlayer.connect();
      setPlayer(sdkPlayer);
    };

    return () => { player?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, spotifyAccessToken]);

  const togglePlay = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const saveAsPlaylist = async () => {
    setSaving(true); setSaveMsg('');
    const res  = await fetch(`/api/rooms/${room.id}/save`, { method: 'POST' });
    const data = await res.json();
    setSaving(false);
    if (data.playlistUrl) {
      setSaveMsg('Saved! Opening in Spotify...');
      window.open(data.playlistUrl, '_blank');
    } else {
      setSaveMsg(
        data.error === 'no_tracks_played_yet'
          ? 'Nothing played yet — come back after a few tracks.'
          : 'Could not save. Try again.'
      );
    }
    setTimeout(() => setSaveMsg(''), 4000);
  };

  return (
    <div className="flex h-full">
      {/* ── Center: room content ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-7 animate-fade-in">

          {/* Header */}
          <RoomHeader
            roomName={room.name}
            roomId={room.id}
            vibe={room.vibe}
            isLive={room.is_playing}
          />

          {/* Listener row */}
          <ListenerRow
            members={members}
            totalCount={room.member_count ?? members.length}
          />

          {/* Album art */}
          <AlbumArtwork
            src={room.current_track_art}
            trackName={room.current_track_name}
          />

          {/* Track info */}
          <TrackInfo
            trackName={room.current_track_name}
            artistName={room.current_track_artist}
            isPlaying={room.is_playing}
            positionMs={room.position_ms}
          />

          {/* Controls */}
          <div className="flex flex-col items-center gap-4">
            {isHost ? (
              <HostControls
                isPlaying={room.is_playing}
                deviceReady={!!deviceId}
                onToggle={togglePlay}
              />
            ) : (
              <MemberState />
            )}
          </div>

          {/* Save as playlist */}
          <div className="flex flex-col items-center gap-1.5 pb-6">
            <Button
              variant="tertiary"
              size="sm"
              onClick={saveAsPlaylist}
              disabled={saving}
              className="gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {saving ? 'Saving...' : 'Save session as playlist'}
            </Button>
            {saveMsg && (
              <p className="text-xs text-jam-muted text-center animate-fade-in">{saveMsg}</p>
            )}
          </div>

        </div>
      </div>

      {/* ── Right panel: listeners + chat shell ──────────────────── */}
      <RightPanel 
        members={members} 
        roomId={room.id}
        currentUserId={currentUserId}
      />
    </div>
  );
}
