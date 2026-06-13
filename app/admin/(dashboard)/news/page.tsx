import { requireAdmin } from "@/lib/admin-data"
import { createAdminClient } from "@/lib/supabase/admin"
import { createNews, setNewsPublished, deleteNews } from "@/app/admin/(dashboard)/actions"
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-ui"
import { RowActions } from "@/components/admin/row-actions"
import { CreateDialog, type Field } from "@/components/admin/create-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const fields: Field[] = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug (optional)", placeholder: "auto-generated from title" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "News", label: "News" },
      { value: "Research Updates", label: "Research Updates" },
      { value: "Partnerships", label: "Partnerships" },
      { value: "Announcements", label: "Announcements" },
      { value: "Events", label: "Events" },
    ],
  },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "body", label: "Body", type: "textarea" },
  { name: "author", label: "Author", placeholder: "AMTMTI Communications" },
  { name: "read_minutes", label: "Read time (minutes)", type: "number", defaultValue: 3 },
  {
    name: "featured",
    label: "Featured",
    type: "select",
    defaultValue: "false",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
]

export default async function AdminNewsPage() {
  await requireAdmin()
  const db = createAdminClient()

  const { data: news } = await db
    .from("news")
    .select("id, title, category, is_published, published_at")
    .order("published_at", { ascending: false })
  const list = news ?? []

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="News"
        description="Manage news articles and announcements."
        action={
          <CreateDialog
            title="New article"
            description="Publish a news article or announcement."
            triggerLabel="New article"
            fields={fields}
            action={createNews}
          />
        }
      />

      {list.length === 0 ? (
        <EmptyState message="No articles yet." />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium text-foreground">{n.title}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{n.category || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={n.is_published ? "default" : "secondary"}>
                      {n.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      actions={[
                        {
                          label: n.is_published ? "Unpublish" : "Publish",
                          run: async () => {
                            "use server"
                            return setNewsPublished(n.id, !n.is_published)
                          },
                          successMessage: "Status updated.",
                        },
                        {
                          label: "Delete",
                          destructive: true,
                          run: async () => {
                            "use server"
                            return deleteNews(n.id)
                          },
                          successMessage: "Article deleted.",
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
