import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/backend/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const sessionId = cookies().get('jamjam_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'empty_message' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('room_messages')
      .insert({
        room_id: params.roomId,
        spotify_id: sessionId,
        message: message.trim(),
      })
      .select('*, user:users(display_name, avatar_url)')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
