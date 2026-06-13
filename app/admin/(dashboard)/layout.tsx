import type { Metadata } from "next"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin-data"
import { AdminShell } from "@/components/admin/admin-shell"

export const metadata: Metadata = {
  title: "Admin Dashboard | AMTMTI",
  robots: { index: false, follow: false },
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()
  await cookies() // ensure dynamic rendering
  const email = process.env.ADMIN_EMAIL ?? null

  return <AdminShell email={email}>{children}</AdminShell>
}
