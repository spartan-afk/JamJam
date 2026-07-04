'use client';

import { useEffect, useState, useRef } from 'react';
import { Avatar } from '@/frontend/components/ui/Avatar';
import { Input } from '@/frontend/components/ui/Input';
import { supabaseBrowser } from '@/backend/lib/supabase';

interface Member {
  spotify_id: string;
  user?: { display_name: string | null; avatar_url: string | null } | null;
}

interface Message {
  id: string;
  spotify_id: string;
  message: string;
  created_at: string;
  user?: { display_name: string | null; avatar_url: string | null } | null;
}

interface RightPanelProps {
  members: Member[];
  roomId: string;
  currentUserId?: string | null;
}

export function RightPanel({ members, roomId, currentUserId }: RightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial messages and subscribe to new ones
  useEffect(() => {
    const fetchMessages = async () => {
      // 1. Fetch recent messages
      const { data } = await supabaseBrowser
        .from('room_messages')
        .select('*, user:users(display_name, avatar_url)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (data) {
        setMessages(data.reverse() as unknown as Message[]);
      }
    };
    
    fetchMessages();

    // 2. Subscribe to realtime inserts
    const channel = supabaseBrowser
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          // Fetch the user info for the new message
          const { data: userData } = await supabaseBrowser
            .from('users')
            .select('display_name, avatar_url')
            .eq('spotify_id', payload.new.spotify_id)
            .single();

          const newMessage = {
            ...payload.new,
            user: userData
          } as Message;

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      await fetch(`/api/rooms/${roomId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue }),
      });
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-[300px] flex-shrink-0 h-full border-l border-jam-border bg-jam-surface">

      {/* Listeners */}
      <div className="h-[35%] overflow-y-auto px-4 py-5 border-b border-jam-border">
        <h3 className="text-xs font-semibold text-jam-muted uppercase tracking-wide mb-4">
          In this room · {members.length}
        </h3>
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.spotify_id} className="flex items-center gap-2.5">
              <Avatar src={m.user?.avatar_url} name={m.user?.display_name} size="sm" />
              <span className="text-sm text-jam-text truncate">
                {m.user?.display_name ?? m.spotify_id}
              </span>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-xs text-jam-border">Just you so far — share the link</p>
          )}
        </div>
      </div>

      {/* Chat shell */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-jam-border bg-jam-surface/50 backdrop-blur-md z-10 sticky top-0">
          <h3 className="text-xs font-semibold text-jam-text uppercase tracking-wide">Live Chat</h3>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <p className="text-xs text-jam-muted">No messages yet.<br/>Say hi!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.spotify_id === currentUserId;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <Avatar src={msg.user?.avatar_url} name={msg.user?.display_name} size="sm" />
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {!isMe && (
                      <span className="text-[10px] text-jam-muted mb-1 ml-1 truncate max-w-full">
                        {msg.user?.display_name ?? msg.spotify_id}
                      </span>
                    )}
                    <div className={`px-3 py-2 text-sm rounded-2xl ${
                      isMe 
                        ? 'bg-jam-violet text-white rounded-tr-sm' 
                        : 'bg-jam-raised text-jam-text border border-jam-border rounded-tl-sm'
                    }`}>
                      <p className="break-words">{msg.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-jam-border bg-jam-surface">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentUserId ? "Say something..." : "Log in to chat"}
              disabled={!currentUserId || isSending}
              className="flex-1 text-sm bg-jam-raised border-jam-border focus:border-jam-violet rounded-full px-4 h-10"
            />
          </form>
        </div>
      </div>

    </aside>
  );
}
