import { Bell } from "lucide-react"
import { requireUser } from "@/lib/portal"
import { Badge } from "@/components/ui/badge"

const typeLabel: Record<string, string> = {
  announcement: "Announcement",
  enrollment: "Enrollment",
  research: "Research",
  membership: "Membership",
}

export default async function NotificationsPage() {
  const { supabase, user } = await requireUser("/portal/notifications")
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("created_at", { ascending: false })

  const list = notifications ?? []

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Announcements, enrollment updates, and institute news.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Bell className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">You have no notifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((n) => (
            <div key={n.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-pretty">{n.title}</p>
                    {!n.read ? (
                      <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                    ) : null}
                  </div>
                  {n.body ? (
                    <p className="mt-1 text-sm text-muted-foreground text-pretty">{n.body}</p>
                  ) : null}
                </div>
                <Badge variant="outline" className="shrink-0">
                  {typeLabel[n.type] ?? n.type}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
