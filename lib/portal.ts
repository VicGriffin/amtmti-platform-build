import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type Profile = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  profession: string | null
  avatar_url: string | null
  role: string
  status: string
}

// Returns the authenticated user + profile, redirecting to login if absent.
export async function requireUser(redirectTo = "/portal") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  return {
    supabase,
    user,
    profile: (profile as Profile | null) ?? {
      id: user.id,
      full_name: (user.user_metadata?.full_name as string) ?? null,
      email: user.email ?? null,
      phone: null,
      country: null,
      profession: null,
      avatar_url: null,
      role: "student",
      status: "active",
    },
  }
}
