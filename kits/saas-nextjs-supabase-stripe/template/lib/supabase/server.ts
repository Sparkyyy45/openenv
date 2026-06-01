import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for use in Server Components,
 * Route Handlers, and Server Actions.
 *
 * Reads/writes auth cookies via the Next.js `cookies()` API.
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` can fail in Server Components (read-only cookies).
            // This is safe to ignore when called from a Server Component —
            // middleware will refresh the session before the SC renders.
          }
        },
      },
    }
  );
}
