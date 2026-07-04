import { NextRequest, NextResponse } from 'next/server';
import { getPublicRooms, createRoom } from '@/backend/services/rooms';
import type { VibeTag } from '@/frontend/types';

export async function GET(req: NextRequest) {
  const vibe = req.nextUrl.searchParams.get('vibe');
  try {
    const rooms = await getPublicRooms(vibe);
    return NextResponse.json(rooms);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const hostId = req.cookies.get('jamjam_session')?.value;
  if (!hostId) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { name, vibe, isPublic } = await req.json();

  try {
    const room = await createRoom(hostId, name, vibe as VibeTag | null, isPublic ?? true);
    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
