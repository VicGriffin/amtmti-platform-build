import { getAdminDb } from "@/lib/admin-data"
import {
  createResearch,
  deleteResearch,
  createPublication,
  deletePublication,
} from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, DbNotConnected, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { CreateDialog, type Field } from "@/components/admin/create-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const projectFields: Field[] = [
  { name: "title", label: "Title", required: true },
  {
    name: "area",
    label: "Research area",
    type: "select",
    options: [
      { value: "Medication Safety", label: "Medication Safety" },
      { value: "Clinical Pharmacy", label: "Clinical Pharmacy" },
      { value: "Pharmaceutical Care", label: "Pharmaceutical Care" },
      { value: "Public Health", label: "Public Health" },
      { value: "Medication Adherence", label: "Medication Adherence" },
    ],
  },
  { name: "summary", label: "Summary", type: "textarea" },
  {
    name: "status",
    label: "Status",
    type: "select",
    defaultValue: "active",
    options: [
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
      { value: "proposed", label: "Proposed" },
    ],
  },
]

const publicationFields: Field[] = [
  { name: "title", label: "Title", required: true },
  { name: "authors", label: "Authors" },
  { name: "journal", label: "Journal" },
  { name: "year", label: "Year", type: "number", defaultValue: new Date().getFullYear() },
  { name: "url", label: "URL", type: "url" },
]

export default async function AdminResearchPage() {
  const db = getAdminDb()

  if (!db) {
    return (
      <div className="mx-auto max-w-6xl">
        <AdminPageHeader title="Research" description="Manage research projects and publications." />
        <DbNotConnected />
      </div>
    )
  }

  const [{ data: projects }, { data: publications }] = await Promise.all([
    db.from("research_projects").select("id, title, area, status").order("created_at", { ascending: false }),
    db.from("publications").select("id, title, authors, journal, year").order("year", { ascending: false }),
  ])
  const projectList = projects ?? []
  const pubList = publications ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title="Research" description="Manage research projects and publications." />

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Research projects</h2>
          <CreateDialog
            title="New project"
            triggerLabel="New project"
            fields={projectFields}
            action={createResearch}
          />
        </div>
        {projectList.length === 0 ? (
          <EmptyState message="No research projects yet." />
        ) : (
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectList.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{p.area || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{p.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <RowActions
                        actions={[
                          {
                            label: "Delete",
                            destructive: true,
                            run: async () => {
                              "use server"
                              return deleteResearch(p.id)
                            },
                            successMessage: "Project deleted.",
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
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Publications</h2>
          <CreateDialog
            title="New publication"
            triggerLabel="New publication"
            fields={publicationFields}
            action={createPublication}
          />
        </div>
        {pubList.length === 0 ? (
          <EmptyState message="No publications yet." />
        ) : (
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Authors</TableHead>
                  <TableHead className="hidden lg:table-cell">Journal</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pubList.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{p.authors || "—"}</TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{p.journal || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.year || "—"}</TableCell>
                    <TableCell>
                      <RowActions
                        actions={[
                          {
                            label: "Delete",
                            destructive: true,
                            run: async () => {
                              "use server"
                              return deletePublication(p.id)
                            },
                            successMessage: "Publication deleted.",
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
      </section>
    </div>
  )
}
