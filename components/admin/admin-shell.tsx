"use client"

import { useState } from "react"
import { Menu, LogOut } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { adminLogoutAction } from "@/app/admin/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function AdminShell({
  email,
  children,
}: {
  email: string | null
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-muted/40">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground">Administrator</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-muted">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    AD
                  </span>
                  <span className="hidden text-sm font-medium text-foreground sm:inline">
                    {email ?? "Admin"}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-sm font-medium text-foreground">Administrator</span>
                <span className="block truncate text-xs text-muted-foreground">{email ?? "admin"}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={adminLogoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
