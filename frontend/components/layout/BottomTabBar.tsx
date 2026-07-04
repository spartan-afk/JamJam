'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── Tab icons ────────────────────────────────────────────────────
function TabCompass({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
function TabMusic({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function TabUsers({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function TabUser({ active }: { active: boolean }) {
  const c = active ? '#8B5CF6' : '#8B8B92';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const TABS = [
  { href: '/',        label: 'Discover', Icon: TabCompass },
  { href: '/rooms',   label: 'Rooms',    Icon: TabMusic   },
  { href: '/friends', label: 'Friends',  Icon: TabUsers   },
  { href: '/profile', label: 'Profile',  Icon: TabUser    },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-jam-surface border-t border-jam-border flex safe-area-bottom">
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
              active ? 'text-jam-violet' : 'text-jam-muted'
            }`}
          >
            <Icon active={active} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
