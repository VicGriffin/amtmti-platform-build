import { getAdminDb } from "@/lib/admin-data"
import { setStudentStatus } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Students" description="Manage student accounts." />
        <DbNotConnected />
      </div>
    )
  }

  let query = db
    .from("profiles")
    .select("id, full_name, email, country, profession, status, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false })

  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)

  const { data: students } = await query
  const list = students ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Students"
        description="View, search, and manage student accounts."
        action={
          <form className="w-full sm:w-64">
            <Input name="q" placeholder="Search name or email" defaultValue={q ?? ""} aria-label="Search students" />
          </form>
        }
      />

      {list.length === 0 ? (
        <EmptyState message="No students found." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Country</TableHead>
                <TableHead className="hidden md:table-cell">Profession</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.full_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{s.country || "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{s.profession || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "active" ? "default" : "outline"} className="capitalize">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={
                        s.status === "active"
                          ? [
                              {
                                label: "Suspend",
                                destructive: true,
                                run: async () => {
                                  "use server"
                                  return setStudentStatus(s.id, "suspended")
                                },
                                successMessage: "Student suspended.",
                              },
                            ]
                          : [
                              {
                                label: "Activate",
                                run: async () => {
                                  "use server"
                                  return setStudentStatus(s.id, "active")
                                },
                                successMessage: "Student activated.",
                              },
                            ]
                      }
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
