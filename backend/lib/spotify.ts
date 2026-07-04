import { supabaseServer } from './supabase';
import { JamUser } from '@/frontend/types';

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com';
const SPOTIFY_API_URL      = 'https://api.spotify.com/v1';

// ─── Scopes ───────────────────────────────────────────────────────
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-top-read',
  'user-read-recently-played',
  'playlist-modify-public',
  'playlist-modify-private',
].join(' ');

// ─── Auth helpers ─────────────────────────────────────────────────
export function buildAuthorizeUrl(codeChallenge: string, state: string) {
  const params = new URLSearchParams({
    client_id:             process.env.SPOTIFY_CLIENT_ID!,
    response_type:         'code',
    redirect_uri:          process.env.SPOTIFY_REDIRECT_URI!,
    code_challenge_method: 'S256',
    code_challenge:        codeChallenge,
    state,
    scope:                 SPOTIFY_SCOPES,
  });
  return `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, codeVerifier: string) {
  const body = new URLSearchParams({
    grant_type:    'authorization_code',
    code,
    redirect_uri:  process.env.SPOTIFY_REDIRECT_URI!,
    client_id:     process.env.SPOTIFY_CLIENT_ID!,
    code_verifier: codeVerifier,
  });

  const res = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{
    access_token:  string;
    token_type:    string;
    scope:         string;
    expires_in:    number;
    refresh_token: string;
  }>;
}

export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: refreshToken,
    client_id:     process.env.SPOTIFY_CLIENT_ID!,
  });

  const res = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{
    access_token: string;
    expires_in:   number;
    scope:        string;
  }>;
}

// ─── Core fetch wrapper ───────────────────────────────────────────
export async function spotifyFetch(path: string, accessToken: string, init: RequestInit = {}) {
  const res = await fetch(`${SPOTIFY_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`Spotify API error: ${res.status} ${await res.text()}`);
  if (res.status === 204) return null; // playback control endpoints return no body
  return res.json();
}

// ─── Auto-refresh wrapper ─────────────────────────────────────────
// Use this in any server route that calls Spotify on behalf of a user.
// It reads the user row, refreshes if the token is expired, persists the
// new token, and returns a valid access_token ready to use.
export async function getValidToken(spotifyId: string): Promise<string> {
  const { data: user } = await supabaseServer
    .from('users')
    .select('access_token, refresh_token, token_expires_at')
    .eq('spotify_id', spotifyId)
    .single();

  if (!user) throw new Error('user_not_found');

  // Give a 30-second buffer so we don't send a token that expires mid-request
  const expiresAt = new Date(user.token_expires_at).getTime();
  const needsRefresh = expiresAt - Date.now() < 30_000;

  if (!needsRefresh) return user.access_token;

  const refreshed = await refreshAccessToken(user.refresh_token);
  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

  await supabaseServer
    .from('users')
    .update({ access_token: refreshed.access_token, token_expires_at: newExpiresAt })
    .eq('spotify_id', spotifyId);

  return refreshed.access_token;
}

// ─── Convenience calls ────────────────────────────────────────────
export const getMe = (token: string) => spotifyFetch('/me', token);

export const getTopTracks = (
  token: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term',
  limit = 20
) => spotifyFetch(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, token);

export const getTopArtists = (
  token: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term',
  limit = 20
) => spotifyFetch(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, token);

export const getRecentlyPlayed = (token: string, limit = 20) =>
  spotifyFetch(`/me/player/recently-played?limit=${limit}`, token);

export const createPlaylist = async (
  token: string,
  userId: string,
  name: string,
  trackUris: string[]
) => {
  const playlist = await spotifyFetch(`/users/${userId}/playlists`, token, {
    method: 'POST',
    body: JSON.stringify({
      name,
      public:      false,
      description: 'Saved from a JAMJAM session 🎵',
    }),
  });
  await spotifyFetch(`/playlists/${playlist.id}/tracks`, token, {
    method: 'POST',
    body:   JSON.stringify({ uris: trackUris }),
  });
  return playlist;
};
