'use client';

import { Avatar }    from '@/frontend/components/ui/Avatar';
import { LivePulse } from '@/frontend/components/ui/LivePulse';

interface Member {
  spotify_id: string;
  user?: { display_name: string | null; avatar_url: string | null } | null;
}

interface ListenerRowProps {
  members:     Member[];
  totalCount?: number;
}

const MAX_SHOWN = 8;

export function ListenerRow({ members, totalCount }: ListenerRowProps) {
  const shown   = members.slice(0, MAX_SHOWN);
  const overflow = (totalCount ?? members.length) - shown.length;

  return (
    <div className="flex items-center gap-3">
      {/* Avatars */}
      <div className="flex items-center -space-x-2">
        {shown.map((m) => (
          <div key={m.spotify_id} className="ring-2 ring-jam-black rounded-full">
            <Avatar
              src={m.user?.avatar_url}
              name={m.user?.display_name}
              size="sm"
            />
          </div>
        ))}
        {overflow > 0 && (
          <div className="ring-2 ring-jam-black rounded-full w-7 h-7 bg-jam-raised border border-jam-border flex items-center justify-center">
            <span className="text-[9px] font-semibold text-jam-muted">+{overflow}</span>
          </div>
        )}
      </div>

      {/* Count + pulse */}
      <div className="flex items-center gap-1.5">
        <LivePulse size="sm" />
        <span className="text-xs text-jam-muted tabular-nums">
          {totalCount ?? members.length} in here
        </span>
      </div>
    </div>
  );
}
