import { Database } from "lucide-react"

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground text-balance">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  )
}

export function DbNotConnected() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <Database className="mx-auto size-9 text-muted-foreground" />
      <h2 className="mt-4 text-base font-semibold text-foreground">Database not connected</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground text-pretty">
        Connect the Supabase integration and run the SQL scripts in{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">scripts/</code> to populate live data.
        The dashboard UI is fully wired and will display records as soon as the database is available.
      </p>
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
