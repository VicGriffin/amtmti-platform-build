import { requireAdmin } from "@/lib/admin-data"
import { createAdminClient } from "@/lib/supabase/admin"
import { setEnrollmentStatus } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  completed: "secondary",
  pending: "outline",
  cancelled: "outline",
}

export default async function AdminEnrollmentsPage() {
  await requireAdmin()
  const db = createAdminClient()

  const { data: enrollments } = await db
    .from("enrollments")
    .select("id, status, progress_percentage, enrolled_at, programs(title)")
    .order("enrolled_at", { ascending: false })
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
                <TableHead className="hidden lg:table-cell">Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-foreground">
                    {(e.programs as any)?.title || "Unknown"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={e.progress_percentage || 0} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground">{e.progress_percentage || 0}%</span>
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
