"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ProfileFields = {
  full_name: string
  email: string
  phone: string
  country: string
  profession: string
}

export function ProfileForm({ initial }: { initial: ProfileFields }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState(initial)

  function update(field: keyof ProfileFields, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      toast.error("Your session expired. Please sign in again.")
      router.push("/login")
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
        phone: values.phone,
        country: values.country,
        profession: values.profession,
      })
      .eq("id", user.id)

    setLoading(false)

    if (error) {
      toast.error("Could not update your profile. Please try again.")
      return
    }

    toast.success("Profile updated.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          value={values.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={values.email} disabled />
        <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+254..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={values.country}
            onChange={(e) => update("country", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profession">Profession</Label>
        <Input
          id="profession"
          value={values.profession}
          onChange={(e) => update("profession", e.target.value)}
          placeholder="e.g. Laboratory Technologist"
        />
      </div>
      <Button type="submit" disabled={loading} className="mt-1 self-start">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
