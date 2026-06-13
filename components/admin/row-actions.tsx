"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type RowAction = {
  label: string
  run: () => Promise<{ ok: boolean; error?: string }>
  destructive?: boolean
  successMessage?: string
}

export function RowActions({ actions }: { actions: RowAction[] }) {
  const [pending, startTransition] = useTransition()

  function handle(action: RowAction) {
    startTransition(async () => {
      const res = await action.run()
      if (res.ok) {
        toast.success(action.successMessage ?? "Updated successfully.")
      } else {
        toast.error(res.error ?? "Something went wrong.")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8" aria-label="Row actions" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        {actions.map((action, i) => (
          <div key={action.label}>
            {action.destructive && i > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              onClick={() => handle(action)}
              className={action.destructive ? "text-destructive" : undefined}
            >
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
