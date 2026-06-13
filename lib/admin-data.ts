import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { createAdminClient, hasAdminClientConfig } from "@/lib/supabase/admin"

// Ensures the admin signed-cookie session is valid for server components.
// Redirects to the admin login page otherwise.
export async function requireAdmin() {
  const ok = await isAdminAuthenticated()
  if (!ok) redirect("/admin/login")
}

// Returns a service-role client for admin pages, or null when Supabase is not
// yet configured (so pages can render an empty/disconnected state gracefully).
export function getAdminDb() {
  if (!hasAdminClientConfig()) return null
  try {
    return createAdminClient()
  } catch {
    return null
  }
}

// Counts rows for a table using a head request. Returns 0 on any failure.
export async function countRows(
  db: ReturnType<typeof createAdminClient>,
  table: string,
  filter?: (q: ReturnType<ReturnType<typeof createAdminClient>["from"]>) => unknown,
) {
  try {
    let query = db.from(table).select("*", { count: "exact", head: true })
    if (filter) query = filter(query) as typeof query
    const { count } = await query
    return count ?? 0
  } catch {
    return 0
  }
}
