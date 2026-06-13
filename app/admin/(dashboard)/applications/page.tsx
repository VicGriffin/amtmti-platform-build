import { getAdminDb } from "@/lib/admin-data"
import { setApplicationStatus } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  approved: "default",
  rejected: "outline",
  pending: "secondary",
}

export default async function AdminApplicationsPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Membership Applications" description="Review and process membership applications." />
        <DbNotConnected />
      </div>
    )
  }

  const { data: apps } = await db
    .from("membership_applications")
    .select("id, name, email, country, profession, tier, status, created_at")
    .order("created_at", { ascending: false })
  const list = apps ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title="Membership Applications" description="Review and process membership applications." />

      {list.length === 0 ? (
        <EmptyState message="No applications yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead className="hidden md:table-cell">Profession</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <span className="block font-medium text-foreground">{a.name}</span>
                    <span className="block text-xs text-muted-foreground">{a.email}</span>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{a.profession || "—"}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{a.tier}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[a.status] ?? "outline"} className="capitalize">
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: "Approve",
                          run: async () => {
                            "use server"
                            return setApplicationStatus(a.id, "approved")
                          },
                          successMessage: "Application approved.",
                        },
                        {
                          label: "Set pending",
                          run: async () => {
                            "use server"
                            return setApplicationStatus(a.id, "pending")
                          },
                          successMessage: "Set to pending.",
                        },
                        {
                          label: "Reject",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return setApplicationStatus(a.id, "rejected")
                          },
                          successMessage: "Application rejected.",
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
