import { getAdminDb } from "@/lib/admin-data"
import { setEnrollmentStatus } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  completed: "secondary",
  pending: "outline",
  rejected: "outline",
}

export default async function AdminEnrollmentsPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Enrollments" description="Approve, reject, and track program enrollments." />
        <DbNotConnected />
      </div>
    )
  }

  const { data: enrollments } = await db
    .from("enrollments")
    .select("id, program_title, category_label, level, status, progress, created_at")
    .order("created_at", { ascending: false })
  const list = enrollments ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title="Enrollments" description="Approve, reject, and track program enrollments." />

      {list.length === 0 ? (
        <EmptyState message="No enrollments yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-foreground">{e.program_title}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{e.category_label || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={e.progress} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground">{e.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[e.status] ?? "outline"} className="capitalize">
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: "Approve (Active)",
                          run: async () => {
                            "use server"
                            return setEnrollmentStatus(e.id, "active")
                          },
                          successMessage: "Enrollment approved.",
                        },
                        {
                          label: "Mark completed",
                          run: async () => {
                            "use server"
                            return setEnrollmentStatus(e.id, "completed")
                          },
                          successMessage: "Marked completed.",
                        },
                        {
                          label: "Set pending",
                          run: async () => {
                            "use server"
                            return setEnrollmentStatus(e.id, "pending")
                          },
                          successMessage: "Set to pending.",
                        },
                        {
                          label: "Reject",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return setEnrollmentStatus(e.id, "rejected")
                          },
                          successMessage: "Enrollment rejected.",
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
