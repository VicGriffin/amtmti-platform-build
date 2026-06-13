import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { requireUser } from "@/lib/portal"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  completed: "secondary",
  pending: "outline",
  rejected: "outline",
}

export default async function CoursesPage() {
  const { supabase, user } = await requireUser("/portal/courses")
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const list = enrollments ?? []

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All programs you have enrolled in.
          </p>
        </div>
        <Button render={<Link href="/programs" />}>Browse more</Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <GraduationCap className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            You have not enrolled in any programs yet.
          </p>
          <Button className="mt-4" render={<Link href="/programs" />}>
            Explore programs
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((e) => (
            <div key={e.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <Badge variant="outline" className="text-xs">
                  {e.category_label}
                </Badge>
                <Badge variant={statusVariant[e.status] ?? "outline"} className="capitalize">
                  {e.status}
                </Badge>
              </div>
              <h2 className="mt-3 font-semibold text-foreground text-pretty">{e.program_title}</h2>
              {e.level ? <p className="text-xs text-muted-foreground">{e.level}</p> : null}
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium">{e.progress}%</span>
                </div>
                <Progress value={e.progress} className="mt-1.5 h-2" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                render={<Link href={`/programs/${e.program_slug}`} />}
              >
                View program
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
