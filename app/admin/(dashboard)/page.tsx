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
import { getAdminDb, countRows } from "@/lib/admin-data"
import { StatCard } from "@/components/portal/stat-card"
import { AdminPageHeader, DbNotConnected } from "@/components/admin/admin-ui"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboardPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Dashboard" description="Platform overview and recent activity." />
        <DbNotConnected />
      </div>
    )
  }

  const [students, programs, enrollments, pendingEnroll, applications, messages] = await Promise.all([
    countRows(db, "profiles", (q) => q.eq("role", "student")),
    countRows(db, "programs"),
    countRows(db, "enrollments"),
    countRows(db, "enrollments", (q) => q.eq("status", "pending")),
    countRows(db, "membership_applications", (q) => q.eq("status", "pending")),
    countRows(db, "contact_messages", (q) => q.eq("status", "new")),
  ])

  const { data: recentEnroll } = await db
    .from("enrollments")
    .select("id, program_title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(6)

  const { data: recentMessages } = await db
    .from("contact_messages")
    .select("id, name, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title="Dashboard" description="Platform overview and recent activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Students" value={students} icon={Users} />
        <StatCard label="Programs" value={programs} icon={GraduationCap} />
        <StatCard label="Enrollments" value={enrollments} icon={ClipboardList} hint={`${pendingEnroll} pending`} />
        <StatCard label="Pending applications" value={applications} icon={FileCheck} />
        <StatCard label="New messages" value={messages} icon={Mail} />
        <StatCard label="Research projects" value={await countRows(db, "research_projects")} icon={FlaskConical} />
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
                  <span className="min-w-0 truncate text-sm text-foreground">{e.program_title}</span>
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
                    <span className="block truncate text-xs text-muted-foreground">{m.subject ?? "No subject"}</span>
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
