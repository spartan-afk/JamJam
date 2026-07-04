'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button }  from '@/frontend/components/ui/Button';
import { Input }   from '@/frontend/components/ui/Input';
import type { VibeTag } from '@/frontend/types';

const VIBES: { value: VibeTag; label: string; emoji: string }[] = [
  { value: 'chill',      label: 'Chill',      emoji: '🌙' },
  { value: 'party',      label: 'Party',      emoji: '🎉' },
  { value: 'discover',   label: 'Discover',   emoji: '🔭' },
  { value: 'study',      label: 'Study',      emoji: '📚' },
  { value: 'late_night', label: 'Late night', emoji: '🌃' },
];

interface CreateRoomModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router  = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [name,     setName]     = useState('');
  const [vibe,     setVibe]     = useState<VibeTag | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setName(''); setVibe(null); setError('');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Give your jam a name.'); return; }
    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/rooms', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), vibe, isPublic }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/room/${data.id}`);
      } else {
        setError(data.error ?? 'Could not create room.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-room-title"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      >
        <div className="w-full max-w-sm bg-jam-raised rounded-2xl border border-jam-border p-6 animate-slide-up">
          <h2 id="create-room-title" className="text-lg font-semibold text-jam-text mb-5">
            Start a jam
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Room name */}
            <Input
              ref={inputRef}
              id="room-name"
              label="Room name"
              placeholder="Name your jam..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />

            {/* Vibe selector */}
            <div>
              <p className="text-xs font-medium text-jam-muted mb-2">Vibe</p>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => {
                  const active = vibe === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => setVibe(active ? null : v.value)}
                      className={[
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                        active
                          ? 'bg-jam-violet/20 border-jam-violet/60 text-jam-violet'
                          : 'bg-transparent border-jam-border text-jam-muted hover:border-jam-muted',
                      ].join(' ')}
                    >
                      {v.emoji} {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Public toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jam-text font-medium">Public room</p>
                <p className="text-xs text-jam-muted">Anyone can discover and join</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isPublic}
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isPublic ? 'bg-jam-violet' : 'bg-jam-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {error && (
              <p className="text-xs text-jam-red">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" pill className="flex-1" disabled={loading}>
                {loading ? 'Starting...' : 'Start jam'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
