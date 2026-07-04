'use client';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?:       string | null;
  name?:      string | null;
  size?:      AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { cls: string; text: string }> = {
  xs: { cls: 'w-5 h-5',   text: 'text-[9px]'  },
  sm: { cls: 'w-7 h-7',   text: 'text-[10px]' },
  md: { cls: 'w-8 h-8',   text: 'text-xs'     },
  lg: { cls: 'w-11 h-11', text: 'text-sm'     },
  xl: { cls: 'w-14 h-14', text: 'text-base'   },
};

function initials(name?: string | null) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  return words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const { cls, text } = sizeMap[size];
  const base = `rounded-full overflow-hidden bg-jam-raised border border-jam-border flex-shrink-0 flex items-center justify-center ${cls} ${className}`;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? 'avatar'}
        className={`${base} object-cover`}
      />
    );
  }

  return (
    <div className={base}>
      <span className={`${text} font-semibold text-jam-muted select-none`}>
        {initials(name)}
      </span>
    </div>
  );
}
