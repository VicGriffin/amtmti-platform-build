import { getAdminDb } from "@/lib/admin-data"
import { createProgram, setProgramStatus, deleteProgram } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { CreateDialog, type Field } from "@/components/admin/create-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
}

const fields: Field[] = [
  { name: "title", label: "Title", required: true, placeholder: "Certificate in Medication Therapy Management" },
  { name: "slug", label: "Slug (optional)", placeholder: "auto-generated from title" },
  {
    name: "category_label",
    label: "Category",
    type: "select",
    options: [
      { value: "Clinicians", label: "Clinicians" },
      { value: "Nurses", label: "Nurses" },
      { value: "Pharmaceutical Technicians", label: "Pharmaceutical Technicians" },
      { value: "Pharmaceutical Technologists", label: "Pharmaceutical Technologists" },
      { value: "Pharmacists", label: "Pharmacists" },
      { value: "Physicians", label: "Physicians" },
    ],
  },
  {
    name: "level",
    label: "Level",
    type: "select",
    options: [
      { value: "Certificate", label: "Certificate" },
      { value: "Diploma", label: "Diploma" },
      { value: "Postgraduate Diploma", label: "Postgraduate Diploma" },
      { value: "CPD Course", label: "CPD Course" },
    ],
  },
  {
    name: "mode",
    label: "Delivery mode",
    type: "select",
    options: [
      { value: "Online", label: "Online" },
      { value: "Blended", label: "Blended" },
      { value: "In-person", label: "In-person" },
    ],
  },
  { name: "duration", label: "Duration", placeholder: "12 weeks" },
  { name: "fees_ksh", label: "Fees (KSH)", type: "number", defaultValue: 0 },
  { name: "summary", label: "Summary", type: "textarea" },
  {
    name: "status",
    label: "Status",
    type: "select",
    defaultValue: "draft",
    options: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
      { value: "archived", label: "Archived" },
    ],
  },
]

export default async function AdminProgramsPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Programs" description="Create and manage accredited programs." />
        <DbNotConnected />
      </div>
    )
  }

  const { data: programs } = await db
    .from("programs")
    .select("id, title, category_label, level, mode, fees_ksh, status")
    .order("created_at", { ascending: false })
  const list = programs ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Programs"
        description="Create and manage accredited programs."
        action={
          <CreateDialog
            title="New program"
            description="Add a new accredited program."
            triggerLabel="New program"
            fields={fields}
            action={createProgram}
          />
        }
      />

      {list.length === 0 ? (
        <EmptyState message="No programs yet. Create your first program." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Level</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{p.category_label}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{p.level}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.fees_ksh ? `KSH ${p.fees_ksh.toLocaleString()}` : "Free"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status] ?? "outline"} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: "Publish",
                          run: async () => {
                            "use server"
                            return setProgramStatus(p.id, "published")
                          },
                          successMessage: "Program published.",
                        },
                        {
                          label: "Set draft",
                          run: async () => {
                            "use server"
                            return setProgramStatus(p.id, "draft")
                          },
                          successMessage: "Set to draft.",
                        },
                        {
                          label: "Archive",
                          run: async () => {
                            "use server"
                            return setProgramStatus(p.id, "archived")
                          },
                          successMessage: "Program archived.",
                        },
                        {
                          label: "Delete",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return deleteProgram(p.id)
                          },
                          successMessage: "Program deleted.",
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
