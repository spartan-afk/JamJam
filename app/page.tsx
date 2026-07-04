export const dynamic = 'force-dynamic';

import { getPublicRooms } from '@/backend/services/rooms';
import { getSessionId }   from '@/backend/lib/session';
import { DiscoverFeed }   from '@/frontend/components/discover/DiscoverFeed';

export default async function HomePage() {
  const [rooms, sessionId] = await Promise.all([
    getPublicRooms(),
    Promise.resolve(getSessionId()),
  ]);

  return <DiscoverFeed rooms={rooms} isLoggedIn={!!sessionId} />;
}
