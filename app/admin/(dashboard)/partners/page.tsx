import { getAdminDb } from "@/lib/admin-data"
import { createPartner, deletePartner } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { CreateDialog, type Field } from "@/components/admin/create-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const fields: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "logo_url", label: "Logo URL", type: "url" },
  { name: "website_url", label: "Website URL", type: "url" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "display_order", label: "Display order", type: "number", defaultValue: 0 },
]

export default async function AdminPartnersPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Partners" description="Manage partner organizations." />
        <DbNotConnected />
      </div>
    )
  }

  const { data: partners } = await db
    .from("partners")
    .select("id, name, website_url, display_order")
    .order("display_order", { ascending: true })
  const list = partners ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Partners"
        description="Manage partner organizations shown on the public site."
        action={
          <CreateDialog
            title="New partner"
            description="Add a partner organization."
            triggerLabel="New partner"
            fields={fields}
            action={createPartner}
          />
        }
      />

      {list.length === 0 ? (
        <EmptyState message="No partners yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Website</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">{p.display_order}</TableCell>
                  <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {p.website_url}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: "Delete",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return deletePartner(p.id)
                          },
                          successMessage: "Partner deleted.",
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
