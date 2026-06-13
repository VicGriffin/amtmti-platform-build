import { FileText, Download, Lock } from "lucide-react"
import { requireUser } from "@/lib/portal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function ResourcesPage() {
  const { supabase } = await requireUser("/portal/resources")

  // Students can see public + course + member resources (RLS allows authenticated reads).
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false })

  const list = resources ?? []

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manuals, reading materials, and downloadable course content.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">No resources available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <div key={r.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </span>
                <Badge variant="outline" className="capitalize">
                  {r.access}
                </Badge>
              </div>
              <h2 className="mt-3 font-medium text-foreground text-pretty">{r.title}</h2>
              {r.description ? (
                <p className="mt-1 text-xs text-muted-foreground text-pretty">{r.description}</p>
              ) : null}
              <div className="mt-auto pt-4">
                {r.file_url ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    render={<a href={r.file_url} target="_blank" rel="noopener noreferrer" />}
                  >
                    <Download className="size-4" /> Download
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <Lock className="size-4" /> Coming soon
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
