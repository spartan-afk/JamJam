/** Shared TypeScript types used across frontend and backend. */

export type JamUser = {
  spotify_id: string;
  display_name: string | null;
  avatar_url: string | null;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
};

export type VibeTag = 'chill' | 'party' | 'discover' | 'study' | 'late_night';

export type Room = {
  id: string;
  name: string;
  host_id: string;
  is_public: boolean;
  current_track_uri: string | null;
  current_track_name: string | null;
  current_track_artist: string | null;
  current_track_art: string | null;
  is_playing: boolean;
  position_ms: number;
  vibe: VibeTag | null;
  updated_at: string;
  created_at: string;
  // Computed / joined fields
  member_count?: number;
  host?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type TrackLog = {
  id: number;
  room_id: string;
  track_uri: string;
  track_name: string | null;
  track_artist: string | null;
  played_at: string;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
  uri: string;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  followers: { total: number };
};
