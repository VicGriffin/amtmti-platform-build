import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { hasAdminClientConfig } from "@/lib/supabase/admin"
import { AdminPageHeader } from "@/components/admin/admin-ui"
import { Badge } from "@/components/ui/badge"

function StatusRow({ label, ok, value }: { label: string; ok: boolean; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {value ? <p className="truncate text-xs text-muted-foreground">{value}</p> : null}
      </div>
      {ok ? (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="size-3.5" /> Configured
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <XCircle className="size-3.5" /> Missing
        </Badge>
      )}
    </div>
  )
}

export default function AdminSettingsPage() {
  const dbReady = hasAdminClientConfig()
  const adminEmailSet = Boolean(process.env.ADMIN_EMAIL)
  const adminPasswordSet = Boolean(process.env.ADMIN_PASSWORD)

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="Settings" description="Platform configuration and environment status." />

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="size-4.5 text-primary" />
          <h2 className="font-semibold text-foreground">Environment status</h2>
        </div>
        <div className="divide-y divide-border">
          <StatusRow
            label="Supabase database"
            ok={dbReady}
            value="NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"
          />
          <StatusRow label="Admin email" ok={adminEmailSet} value="ADMIN_EMAIL" />
          <StatusRow label="Admin password" ok={adminPasswordSet} value="ADMIN_PASSWORD" />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground">About this dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Administrators authenticate with a signed session cookie (separate from Supabase Auth) and
          all data operations run server-side with the Supabase service role, bypassing RLS for
          trusted admin actions. Connect the Supabase integration and run the SQL scripts in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">scripts/</code> to enable live data
          across the platform.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground">Required environment variables</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
          <li><code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code></li>
          <li><code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
          <li><code className="rounded bg-muted px-1 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code></li>
          <li><code className="rounded bg-muted px-1 py-0.5 text-xs">ADMIN_EMAIL</code></li>
          <li><code className="rounded bg-muted px-1 py-0.5 text-xs">ADMIN_PASSWORD</code></li>
        </ul>
      </section>
    </div>
  )
}
