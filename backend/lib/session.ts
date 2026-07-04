import { cookies } from 'next/headers';
import { supabaseServer } from './supabase';
import type { JamUser } from '@/frontend/types';

/**
 * Returns the full user row for the currently logged-in Spotify account,
 * or null if the session cookie is absent / stale.
 *
 * Call this from Server Components and Server Actions only.
 * API route handlers should read req.cookies directly (no next/headers).
 */
export async function getSessionUser(): Promise<JamUser | null> {
  const spotifyId = cookies().get('jamjam_session')?.value;
  if (!spotifyId) return null;

  const { data } = await supabaseServer
    .from('users')
    .select('spotify_id, display_name, avatar_url')
    .eq('spotify_id', spotifyId)
    .single();

  return data ?? null;
}

/**
 * Returns just the spotify_id from the session cookie.
 * Faster — no DB round-trip.
 */
export function getSessionId(): string | null {
  return cookies().get('jamjam_session')?.value ?? null;
}
