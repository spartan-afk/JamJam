-- ============================================================
--  JAMJAM — Supabase schema
--  Run this in Project > SQL Editor > New query
-- ============================================================

-- Users (keyed by Spotify ID)
create table if not exists users (
  spotify_id      text primary key,
  display_name    text,
  avatar_url      text,
  access_token    text,   -- stored plaintext for demo; encrypt at rest in prod
  refresh_token   text,
  token_expires_at timestamptz,
  created_at      timestamptz default now()
);

-- Rooms
create table if not exists rooms (
  id                   uuid primary key default gen_random_uuid(),
  host_id              text references users(spotify_id) on delete cascade,
  name                 text not null,
  is_public            boolean default true,
  vibe                 text check (vibe in ('chill','party','discover','study','late_night')),
  current_track_uri    text,
  current_track_name   text,
  current_track_artist text,
  current_track_art    text,
  is_playing           boolean default false,
  position_ms          integer default 0,
  updated_at           timestamptz default now(),
  created_at           timestamptz default now()
);

-- Room members (many-to-many)
create table if not exists room_members (
  room_id     uuid references rooms(id) on delete cascade,
  spotify_id  text references users(spotify_id) on delete cascade,
  joined_at   timestamptz default now(),
  primary key (room_id, spotify_id)
);

-- Track log — every track that plays is logged so hosts can save as playlist
create table if not exists room_track_log (
  id           bigint generated always as identity primary key,
  room_id      uuid references rooms(id) on delete cascade,
  track_uri    text not null,
  track_name   text,
  track_artist text,
  played_at    timestamptz default now()
);

-- Chat messages
create table if not exists room_messages (
  id           bigint generated always as identity primary key,
  room_id      uuid references rooms(id) on delete cascade,
  spotify_id   text references users(spotify_id) on delete cascade,
  message      text not null,
  created_at   timestamptz default now()
);

-- ─── Realtime ────────────────────────────────────────────────────
-- Push updates to all members without polling
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table room_members;
alter publication supabase_realtime add table room_messages;

-- ─── Row Level Security ──────────────────────────────────────────
-- Rooms — publicly readable; insert/update restricted to auth'd sessions
alter table rooms enable row level security;
create policy "rooms_select_public"  on rooms for select using (true);
create policy "rooms_insert_any"     on rooms for insert with check (true);
create policy "rooms_update_any"     on rooms for update using (true);
create policy "rooms_delete_any"     on rooms for delete using (true);

-- Room members
alter table room_members enable row level security;
create policy "room_members_select"  on room_members for select using (true);
create policy "room_members_insert"  on room_members for insert with check (true);
create policy "room_members_delete"  on room_members for delete using (true);

-- Track log
alter table room_track_log enable row level security;
create policy "track_log_select"     on room_track_log for select using (true);
create policy "track_log_insert"     on room_track_log for insert with check (true);

-- Room messages
alter table room_messages enable row level security;
create policy "messages_select"      on room_messages for select using (true);
create policy "messages_insert"      on room_messages for insert with check (true);
