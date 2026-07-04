import { NextRequest, NextResponse } from 'next/server';
import { saveSessionAsPlaylist } from '@/backend/services/rooms';

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const spotifyId = req.cookies.get('jamjam_session')?.value;
  if (!spotifyId) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  try {
    const playlistUrl = await saveSessionAsPlaylist(params.roomId, spotifyId);
    return NextResponse.json({ playlistUrl });
  } catch (err: any) {
    const status = err.message === 'no_tracks_played_yet' ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
