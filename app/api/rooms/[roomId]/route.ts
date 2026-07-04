import { NextRequest, NextResponse } from 'next/server';
import { getRoom } from '@/backend/services/rooms';

export async function GET(
  _req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await getRoom(params.roomId);
    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
