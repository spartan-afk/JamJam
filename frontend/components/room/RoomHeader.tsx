'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge }     from '@/frontend/components/ui/Badge';

interface RoomHeaderProps {
  roomName: string;
  roomId:   string;
  vibe?:    string | null;
  isLive:   boolean;
}

const VIBE_LABELS: Record<string, string> = {
  chill:      'chill',
  party:      'party',
  discover:   'discover',
  study:      'study',
  late_night: 'late night',
};

export function RoomHeader({ roomName, roomId, vibe, isLive }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1.5 min-w-0">
        {/* Back arrow + room name */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-jam-muted hover:text-jam-text transition-colors flex-shrink-0"
            aria-label="Back to discover"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="text-[22px] font-semibold text-jam-text leading-tight truncate">
            {roomName}
          </h1>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 pl-6">
          {isLive && <Badge variant="live">LIVE</Badge>}
          {vibe && <Badge variant="vibe">{VIBE_LABELS[vibe] ?? vibe}</Badge>}
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={copyLink}
        title="Copy invite link"
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-jam-border text-jam-muted hover:border-jam-violet hover:text-jam-violet transition-all duration-150 text-xs font-medium mt-1"
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </>
        )}
      </button>
    </div>
  );
}
