export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRecentJamFriends } from '@/backend/services/rooms';
import { Avatar } from '@/frontend/components/ui/Avatar';

export default async function FriendsPage() {
  const sessionId = cookies().get('jamjam_session')?.value;
  if (!sessionId) redirect('/api/auth/login');

  const friends = await getRecentJamFriends(sessionId);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-jam-text">Friends</h1>
        <p className="text-sm text-jam-muted">People you've jammed with recently</p>
      </div>

      {friends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div key={friend.spotify_id} className="flex items-center gap-4 p-4 bg-jam-surface rounded-2xl border border-jam-border">
              <Avatar src={friend.user?.avatar_url} name={friend.user?.display_name} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-jam-text truncate">{friend.user?.display_name ?? friend.spotify_id}</p>
                <p className="text-xs text-jam-muted mt-1">Recently jammed</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-8 text-center bg-jam-surface p-12 rounded-2xl border border-jam-border">
          <p className="text-jam-muted mb-4">You haven't jammed with anyone yet.</p>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 bg-jam-violet text-white hover:bg-opacity-90 rounded-full px-6 py-2.5 text-sm"
          >
            Find a room
          </a>
        </div>
      )}
    </div>
  );
}
