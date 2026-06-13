import { requireAdmin } from "@/lib/admin-data"
import { createAdminClient } from "@/lib/supabase/admin"
import { createEvent, deleteEvent } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { CreateDialog, type Field } from "@/components/admin/create-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const fields: Field[] = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug (optional)", placeholder: "auto-generated from title" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "location", label: "Location", placeholder: "Nairobi, Kenya / Online" },
  {
    name: "mode",
    label: "Mode",
    type: "select",
    options: [
      { value: "In-Person", label: "In-Person" },
      { value: "Virtual", label: "Virtual" },
      { value: "Hybrid", label: "Hybrid" },
    ],
  },
  { name: "date", label: "Date", type: "datetime-local" },
  { name: "image_url", label: "Image URL", placeholder: "https://..." },
  { name: "registration_url", label: "Registration URL", placeholder: "https://..." },
]

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function AdminEventsPage() {
  await requireAdmin()
  const db = createAdminClient()

  const { data: events } = await db
    .from("events")
    .select("id, title, location, date, mode")
    .order("date", { ascending: true })
  const list = events ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Events"
        description="Manage upcoming events and speakers."
        action={
          <CreateDialog
            title="New event"
            description="Schedule an upcoming event."
            triggerLabel="New event"
            fields={fields}
            action={createEvent}
          />
        }
      />

      {list.length === 0 ? (
        <EmptyState message="No events scheduled." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-foreground">{e.title}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {e.location || "—"} ({e.mode})
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(e.date)}</TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: "Delete",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return deleteEvent(e.id)
                          },
                          successMessage: "Event deleted.",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
