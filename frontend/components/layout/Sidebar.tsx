'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/frontend/components/ui/Avatar';
import type { JamUser } from '@/frontend/types';

// ─── Nav icons ───────────────────────────────────────────────────
function IconCompass({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
function IconMusic({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function IconUsers({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconBarChart({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}
function IconSettings({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: '/',        label: 'Discover',   Icon: IconCompass   },
  { href: '/rooms',   label: 'Your Rooms', Icon: IconMusic     },
  { href: '/friends', label: 'Friends',    Icon: IconUsers     },
  { href: '/stats',   label: 'Stats',      Icon: IconBarChart  },
  { href: '/profile', label: 'Settings',   Icon: IconSettings  },
];

interface SidebarProps {
  user: JamUser | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col w-[240px] flex-shrink-0 h-full bg-[#070708] border-r border-jam-border">
      {/* Wordmark */}
      <div className="px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-jam-text">
          JAM<span className="text-jam-violet">JAM</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150 group',
                active
                  ? 'text-jam-violet border-l-2 border-jam-violet pl-[10px] bg-jam-violet/8'
                  : 'text-jam-muted hover:text-jam-text hover:bg-jam-surface',
              ].join(' ')}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-5 border-t border-jam-border">
        {user ? (
          <Link href="/profile" className="flex items-center gap-3 group">
            <Avatar src={user.avatar_url} name={user.display_name} size="sm" />
            <span className="text-sm text-jam-muted group-hover:text-jam-text transition-colors truncate">
              {user.display_name ?? user.spotify_id}
            </span>
          </Link>
        ) : (
          <a
            href="/api/auth/login"
            className="flex items-center justify-center w-full py-2 px-3 rounded-[10px] bg-jam-violet text-white text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Connect Spotify
          </a>
        )}
      </div>
    </aside>
  );
}
