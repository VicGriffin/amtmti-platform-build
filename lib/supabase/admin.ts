import { createClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client for the admin dashboard.
 *
 * Admins authenticate with a separate signed cookie (see lib/admin-auth.ts),
 * NOT Supabase Auth, so there is no auth.uid() for them and RLS policies that
 * rely on public.is_admin() would block their queries. This client uses the
 * service role key to bypass RLS for trusted, server-only admin operations.
 *
 * NEVER import this from client components. Server-only.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function hasAdminClientConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY),
  )
}
