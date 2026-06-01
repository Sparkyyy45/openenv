import { createBrowserClient as createClient } from '@supabase/ssr';

/**
 * Create a Supabase client for use in browser (Client Components).
 *
 * Uses the anon key — safe to expose on the client.
 * Auth state is managed via cookies automatically.
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
