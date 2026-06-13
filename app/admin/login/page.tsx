import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/site/logo"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Admin Login | AMTMTI",
}

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin")
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="AMTMTI home">
            <Logo />
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-foreground">Administrator Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Restricted area. Authorized AMTMTI staff only.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            Return to website
          </Link>
        </p>
      </div>
    </main>
  )
}
