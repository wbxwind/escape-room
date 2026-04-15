import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for use inside API route handlers.
 * Prefers the service-role key (bypasses RLS) when available,
 * falling back to the anon key. Never import this in client components.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}
