import type { Metadata } from "next"
import { requireUser } from "@/lib/portal"
import { PortalShell } from "@/components/portal/portal-shell"

export const metadata: Metadata = {
  title: "Student Portal | AMTMTI",
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireUser()

  return (
    <PortalShell fullName={profile.full_name} email={profile.email}>
      {children}
    </PortalShell>
  )
}
