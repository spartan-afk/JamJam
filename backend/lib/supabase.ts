import { createClient, SupabaseClient } from '@supabase/supabase-js';

/** Lazily-created browser client — safe in client components, uses anon key.
 *  Created on first call so missing env vars only error at runtime, not at build. */
let _browserClient: SupabaseClient | null = null;
export function getSupabaseBrowser(): SupabaseClient {
  if (!_browserClient) {
    _browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _browserClient;
}

/** @deprecated Use getSupabaseBrowser() in new code */
export const supabaseBrowser = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabaseBrowser() as any)[prop];
  },
});

/** Lazily-created server client — uses the service role key, bypasses RLS.
 *  Import ONLY in server-side code (route handlers, server components). */
let _serverClient: SupabaseClient | null = null;
export function getSupabaseServer(): SupabaseClient {
  if (!_serverClient) {
    _serverClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _serverClient;
}

/** @deprecated Use getSupabaseServer() in new code */
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabaseServer() as any)[prop];
  },
});
