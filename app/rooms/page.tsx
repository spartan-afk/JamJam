export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserRooms } from '@/backend/services/rooms';
import { RoomCard } from '@/frontend/components/discover/RoomCard';
import { EmptyState } from '@/frontend/components/discover/EmptyState';

export default async function YourRoomsPage() {
  const sessionId = cookies().get('jamjam_session')?.value;
  if (!sessionId) redirect('/api/auth/login');

  const rooms = await getUserRooms(sessionId);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-jam-text">Your Rooms</h1>
        <p className="text-sm text-jam-muted">Rooms you've hosted or joined</p>
      </div>

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="pt-8 text-center bg-jam-surface p-12 rounded-2xl border border-jam-border">
          <p className="text-jam-muted mb-4">You haven't joined any rooms yet.</p>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 bg-jam-violet text-white hover:bg-opacity-90 rounded-full px-6 py-2.5 text-sm"
          >
            Discover jams
          </a>
        </div>
      )}
    </div>
  );
}
