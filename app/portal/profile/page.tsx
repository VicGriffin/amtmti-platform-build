import { requireUser } from "@/lib/portal"
import { ProfileForm } from "@/components/portal/profile-form"

export default async function ProfilePage() {
  const { profile } = await requireUser("/portal/profile")

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <ProfileForm
          initial={{
            full_name: profile.full_name ?? "",
            email: profile.email ?? "",
            phone: profile.phone ?? "",
            country: profile.country ?? "",
            profession: profile.profession ?? "",
          }}
        />
      </div>
    </div>
  )
}
