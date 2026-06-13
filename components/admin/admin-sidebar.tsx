"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  FileCheck,
  Mail,
  Newspaper,
  CalendarDays,
  FlaskConical,
  FolderOpen,
  Handshake,
  Settings,
  X,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/programs", label: "Programs", icon: GraduationCap },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { href: "/admin/applications", label: "Applications", icon: FileCheck },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/research", label: "Research", icon: FlaskConical },
  { href: "/admin/resources", label: "Resources", icon: FolderOpen },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" aria-label="AMTMTI admin" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4.5" />
            </span>
            <span className="text-sm font-semibold text-foreground">AMTMTI Admin</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t border-border p-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary hover:underline">
            View public site
          </Link>
        </div>
      </aside>
    </>
  )
}
