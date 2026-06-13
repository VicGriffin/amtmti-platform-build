import { getAdminDb } from "@/lib/admin-data"
import { setMessageStatus, deleteMessage } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  replied: "secondary",
  archived: "outline",
}

export default async function AdminMessagesPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader title="Messages" description="Inbox of contact form submissions." />
        <DbNotConnected />
      </div>
    )
  }

  const { data: messages } = await db
    .from("contact_messages")
    .select("id, name, email, subject, inquiry_type, message, status, created_at")
    .order("created_at", { ascending: false })
  const list = messages ?? []

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader title="Messages" description="Inbox of contact form submissions." />

      {list.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <ul className="flex flex-col gap-4">
          {list.map((m) => (
            <li key={m.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{m.name}</span>
                    <Badge variant={statusVariant[m.status] ?? "outline"} className="capitalize">
                      {m.status}
                    </Badge>
                    {m.inquiry_type ? (
                      <Badge variant="outline" className="capitalize">{m.inquiry_type}</Badge>
                    ) : null}
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">
                    {m.email}
                  </a>
                </div>
                <RowActions
                  actions={[
                    {
                      label: "Mark replied",
                      run: async () => {
                        "use server"
                        return setMessageStatus(m.id, "replied")
                      },
                      successMessage: "Marked as replied.",
                    },
                    {
                      label: "Archive",
                      run: async () => {
                        "use server"
                        return setMessageStatus(m.id, "archived")
                      },
                      successMessage: "Message archived.",
                    },
                    {
                      label: "Delete",
                      destructive: true,
                      run: async () => {
                        "use server"
                        return deleteMessage(m.id)
                      },
                      successMessage: "Message deleted.",
                    },
                  ]}
                />
              </div>
              {m.subject ? <p className="mt-3 text-sm font-medium text-foreground">{m.subject}</p> : null}
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground text-pretty">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
