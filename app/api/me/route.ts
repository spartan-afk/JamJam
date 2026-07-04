import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/backend/lib/supabase';

export async function GET(req: NextRequest) {
  const spotifyId = req.cookies.get('jamjam_session')?.value;
  if (!spotifyId) return NextResponse.json(null, { status: 401 });

  const { data } = await supabaseServer
    .from('users')
    .select('spotify_id, display_name, avatar_url')
    .eq('spotify_id', spotifyId)
    .single();

  return NextResponse.json(data ?? null);
}
