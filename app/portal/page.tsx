import Link from "next/link"
import { GraduationCap, Award, Bell, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react"
import { requireUser } from "@/lib/portal"
import { StatCard } from "@/components/portal/stat-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  completed: "secondary",
  pending: "outline",
  rejected: "outline",
}

export default async function PortalDashboard() {
  const { supabase, user, profile } = await requireUser()

  const [{ data: enrollments }, { count: certCount }, { data: notifications }] = await Promise.all([
    supabase
      .from("enrollments")
      .select("*, programs(id, title, thumbnail_url)")
      .eq("student_id", user.id)
      .order("enrolled_at", { ascending: false }),
    supabase.from("certificates").select("*", { count: "exact", head: true }).eq("student_id", user.id),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4),
  ])

  const list = enrollments ?? []
  const active = list.filter((e) => e.status === "active")
  const completed = list.filter((e) => e.status === "completed")
  const firstName = (profile.full_name || "Student").split(" ")[0]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is an overview of your learning journey at AMTMTI.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Courses" value={active.length} icon={GraduationCap} />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="Certificates" value={certCount ?? 0} icon={Award} />
        <StatCard label="Total Enrollments" value={list.length} icon={BookOpen} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
            <Button variant="ghost" size="sm" render={<Link href="/portal/courses" />}>
              View all <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {list.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  You are not enrolled in any programs yet.
                </p>
                <Button className="mt-4" render={<Link href="/programs" />}>
                  Browse programs
                </Button>
              </div>
            ) : (
              list.slice(0, 4).map((e) => {
                const program = (e.programs as any)
                return (
                  <div key={e.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {program?.title || "Unknown Program"}
                        </p>
                      </div>
                      <Badge variant={statusVariant[e.status] ?? "outline"} className="capitalize">
                        {e.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={e.progress_percentage || 0} className="h-2" />
                      <span className="text-xs font-medium text-muted-foreground">{e.progress_percentage || 0}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <Bell className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {(notifications ?? []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">No notifications yet.</p>
              </div>
            ) : (
              (notifications ?? []).map((n) => (
                <div key={n.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-medium text-foreground text-pretty">{n.title}</p>
                  {n.message ? (
                    <p className="mt-1 text-xs text-muted-foreground text-pretty">{n.message}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
