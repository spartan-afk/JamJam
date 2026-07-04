import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/frontend/components/layout/AppShell';
import { getSessionUser } from '@/backend/lib/session';

export const metadata: Metadata = {
  title:       'JAMJAM — public listening rooms',
  description: 'Drop into live music rooms with strangers. Public, real-time, built on Spotify.',
  keywords:    ['music', 'listening rooms', 'spotify', 'social', 'discover'],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read session on every render so the sidebar always has current user state
  const user = await getSessionUser();

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0A0A0B" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body>
        <AppShell user={user}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
