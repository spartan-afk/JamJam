import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '@/backend/lib/pkce';
import { buildAuthorizeUrl } from '@/backend/lib/spotify';

export async function GET() {
  const verifier  = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state     = generateCodeVerifier(16);

  const authorizeUrl = buildAuthorizeUrl(challenge, state);

  const res = NextResponse.redirect(authorizeUrl);
  const cookieOpts = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   60 * 10, // 10 minutes — just long enough to complete the flow
    path:     '/',
  };
  res.cookies.set('spotify_pkce_verifier', verifier, cookieOpts);
  res.cookies.set('spotify_oauth_state',   state,    cookieOpts);
  return res;
}
