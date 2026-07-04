import { NextRequest, NextResponse } from 'next/server';
import { joinRoom } from '@/backend/services/rooms';

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const spotifyId = req.cookies.get('jamjam_session')?.value;
  if (!spotifyId) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  try {
    await joinRoom(params.roomId, spotifyId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
