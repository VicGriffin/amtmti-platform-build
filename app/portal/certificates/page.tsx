import { Award, Download } from "lucide-react"
import { requireUser } from "@/lib/portal"
import { Button } from "@/components/ui/button"

export default async function CertificatesPage() {
  const { supabase, user, profile } = await requireUser("/portal/certificates")
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })

  const list = certificates ?? []

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Certificates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Certificates awarded upon successful completion of your programs.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Award className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            You have not earned any certificates yet. Complete a program to receive one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="size-6" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{c.program_title}</p>
                  <p className="text-xs text-muted-foreground">
                    Awarded to {profile.full_name || "you"} ·{" "}
                    {new Date(c.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="size-4" /> Download PDF
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
