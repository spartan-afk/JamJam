'use client';

import { useState } from 'react';

interface AlbumArtworkProps {
  src?:       string | null;
  trackName?: string | null;
}

export function AlbumArtwork({ src, trackName }: AlbumArtworkProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="art-glow-wrap flex items-center justify-center">
      <div
        className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden bg-jam-raised border border-jam-border shadow-glow-art flex-shrink-0"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={trackName ?? 'Album art'}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          /* Placeholder when nothing is playing */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2A2A2E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="text-xs text-jam-border">Nothing playing yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
