import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  className?: string
}) {
  return (
    <div className={cn("border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
