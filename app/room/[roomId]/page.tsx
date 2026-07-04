export const dynamic = 'force-dynamic';

import { cookies }         from 'next/headers';
import { notFound }         from 'next/navigation';
import { getRoom, getRoomMembers } from '@/backend/services/rooms';
import { supabaseServer }   from '@/backend/lib/supabase';
import { getValidToken }    from '@/backend/lib/spotify';
import RoomView             from '@/frontend/components/room/RoomView';

interface RoomPageProps {
  params: { roomId: string };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const sessionId = cookies().get('jamjam_session')?.value ?? null;

  // Fetch room + members in parallel
  let room, members;
  try {
    [room, members] = await Promise.all([
      getRoom(params.roomId),
      getRoomMembers(params.roomId),
    ]);
  } catch {
    notFound();
  }

  const isHost = !!sessionId && sessionId === room.host_id;

  // Register the viewer as a member (upsert is idempotent)
  if (sessionId) {
    await supabaseServer
      .from('room_members')
      .upsert({ room_id: room.id, spotify_id: sessionId });
  }

  // Fetch a valid (auto-refreshed) access token for the host only
  let accessToken: string | null = null;
  if (isHost) {
    try {
      accessToken = await getValidToken(sessionId!);
    } catch {
      accessToken = null; // If refresh fails, host will see "Connecting..."
    }
  }

  return (
    <RoomView
      initialRoom={room}
      initialMembers={members as any}
      isHost={isHost}
      spotifyAccessToken={accessToken}
      currentUserId={sessionId}
    />
  );
}
