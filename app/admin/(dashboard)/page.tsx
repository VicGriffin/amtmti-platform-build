import Link from "next/link"
import {
  Users,
  GraduationCap,
  ClipboardList,
  FileCheck,
  FlaskConical,
  Mail,
  ArrowRight,
} from "lucide-react"
import { requireAdmin } from "@/lib/admin-data"
import { createAdminClient } from "@/lib/supabase/admin"
import { StatCard } from "@/components/portal/stat-card"
import { AdminPageHeader } from "@/components/admin/admin-ui"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export default async function AdminDashboardPage() {
  // Require admin authentication
  await requireAdmin()

  const db = createAdminClient()

  // Fetch statistics
  const [
    { count: students },
    { count: programs },
    { count: enrollments },
    { count: pendingEnroll },
    { count: applications },
    { count: messages },
    { count: research },
  ] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    db.from("programs").select("id", { count: "exact", head: true }).eq("is_published", true),
    db.from("enrollments").select("id", { count: "exact", head: true }),
    db.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("membership_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    db.from("research_projects").select("id", { count: "exact", head: true }),
  ])

  // Fetch recent enrollments with program details
  const { data: recentEnroll } = await db
    .from("enrollments")
    .select("id, status, enrolled_at, programs(title)")
    .order("enrolled_at", { ascending: false })
    .limit(6)

  // Fetch recent messages
  const { data: recentMessages } = await db
    .from("contact_messages")
    .select("id, name, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title="Dashboard" description="Platform overview and recent activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Students" value={students || 0} icon={Users} />
        <StatCard label="Programs" value={programs || 0} icon={GraduationCap} />
        <StatCard label="Enrollments" value={enrollments || 0} icon={ClipboardList} hint={`${pendingEnroll || 0} pending`} />
        <StatCard label="Pending applications" value={applications || 0} icon={FileCheck} />
        <StatCard label="New messages" value={messages || 0} icon={Mail} />
        <StatCard label="Research projects" value={research || 0} icon={FlaskConical} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent enrollments</h2>
            <Link href="/admin/enrollments" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {(recentEnroll ?? []).length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">No enrollments yet.</li>
            ) : (
              (recentEnroll ?? []).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0 truncate text-sm text-foreground">
                    {(e.programs as any)?.title || "Unknown Program"}
                  </span>
                  <Badge variant="outline" className="capitalize">{e.status}</Badge>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent messages</h2>
            <Link href="/admin/messages" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {(recentMessages ?? []).length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">No messages yet.</li>
            ) : (
              (recentMessages ?? []).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">{m.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{m.email}</span>
                  </span>
                  <Badge variant={m.status === "new" ? "default" : "outline"} className="capitalize">{m.status}</Badge>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}
