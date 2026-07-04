'use client';

import { Sidebar }      from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import type { JamUser } from '@/frontend/types';

interface AppShellProps {
  user:     JamUser | null;
  children: React.ReactNode;
}

/**
 * AppShell — the persistent chrome around every page.
 *
 * Desktop: sidebar (240px fixed) + scrollable main area
 * Mobile:  full-height main area + fixed bottom tab bar
 *
 * This is a client component so Sidebar + BottomTabBar can use
 * usePathname. Children are passed as slots from the server layout
 * and may themselves be server components.
 */
export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="flex h-full overflow-hidden bg-jam-black">
      {/* Desktop sidebar */}
      <Sidebar user={user} />

      {/* Main content */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto h-full pb-20 md:pb-0"
      >
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomTabBar />
    </div>
  );
}
