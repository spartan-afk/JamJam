'use client';

export function MemberState() {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-jam-surface border border-jam-border">
        {/* Headphones icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B8B92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        <span className="text-sm text-jam-muted">Listening along</span>
      </div>
      <p className="text-xs text-jam-border text-center max-w-[220px]">
        Open Spotify to control your own playback — you're synced to this room's now-playing
      </p>
    </div>
  );
}
