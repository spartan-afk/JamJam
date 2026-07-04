import { NextRequest, NextResponse } from 'next/server';
import { getValidToken, getTopTracks, getTopArtists } from '@/backend/lib/spotify';

export async function GET(req: NextRequest) {
  const spotifyId = req.cookies.get('jamjam_session')?.value;
  if (!spotifyId) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const timeRange = (req.nextUrl.searchParams.get('range') as 'short_term' | 'medium_term' | 'long_term') ?? 'short_term';

  try {
    const token   = await getValidToken(spotifyId);
    const [tracks, artists] = await Promise.all([
      getTopTracks(token,  timeRange, 20),
      getTopArtists(token, timeRange, 20),
    ]);
    return NextResponse.json({ tracks: tracks.items, artists: artists.items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
