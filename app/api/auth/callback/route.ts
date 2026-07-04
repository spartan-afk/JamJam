import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getMe } from '@/backend/lib/spotify';
import { supabaseServer } from '@/backend/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const storedState = req.cookies.get('spotify_oauth_state')?.value;
  const verifier    = req.cookies.get('spotify_pkce_verifier')?.value;

  if (error) return NextResponse.redirect(new URL(`/?error=${error}`, req.url));

  if (!code || !verifier || !state || state !== storedState) {
    return NextResponse.redirect(new URL('/?error=state_mismatch', req.url));
  }

  const tokenData = await exchangeCodeForToken(code, verifier);
  const profile   = await getMe(tokenData.access_token);
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

  await supabaseServer.from('users').upsert({
    spotify_id:       profile.id,
    display_name:     profile.display_name,
    avatar_url:       profile.images?.[0]?.url ?? null,
    access_token:     tokenData.access_token,
    refresh_token:    tokenData.refresh_token,
    token_expires_at: expiresAt,
  });

  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('jamjam_session', profile.id, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   60 * 60 * 24 * 30, // 30 days
    path:     '/',
  });
  res.cookies.delete('spotify_pkce_verifier');
  res.cookies.delete('spotify_oauth_state');
  return res;
}
