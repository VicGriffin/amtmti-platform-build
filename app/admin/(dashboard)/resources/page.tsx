import { getAdminDb } from "@/lib/admin-data"
import { createResource, deleteResource } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { CreateDialog, type Field } from "@/components/admin/create-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const fields: Field[] = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "category", label: "Category", placeholder: "Guidelines, Toolkits, Slides..." },
  { name: "file_url", label: "File URL", type: "url" },
  {
    name: "access",
    label: "Access",
    type: "select",
    defaultValue: "public",
    options: [
      { value: "public", label: "Public" },
      { value: "course", label: "Course" },
      { value: "member", label: "Member" },
    ],
  },
]

const accessVariant: Record<string, "default" | "secondary" | "outline"> = {
  public: "default",
  course: "secondary",
  member: "outline",
}

export default async function AdminResourcesPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Resources" description="Upload and manage downloadable resources." />
        <DbNotConnected />
      </div>
    )
  }

  const { data: resources } = await db
    .from("resources")
    .select("id, title, category, access, file_url")
    .order("created_at", { ascending: false })
  const list = resources ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Resources"
        description="Upload and manage downloadable resources."
        action={
          <CreateDialog
            title="New resource"
            description="Add a downloadable resource."
            triggerLabel="New resource"
            fields={fields}
            action={createResource}
          />
        }
      />

      {list.length === 0 ? (
        <EmptyState message="No resources yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.title}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{r.category || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={accessVariant[r.access] ?? "outline"} className="capitalize">
                      {r.access}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: "Delete",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return deleteResource(r.id)
                          },
                          successMessage: "Resource deleted.",
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
