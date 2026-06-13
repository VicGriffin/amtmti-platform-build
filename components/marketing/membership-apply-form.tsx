'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MEMBERSHIP_TIERS } from '@/lib/site-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function MembershipApplyForm() {
  const [loading, setLoading] = useState(false)
  const [tier, setTier] = useState(MEMBERSHIP_TIERS[1].name)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('membership_applications').insert({
      user_id: user?.id ?? null,
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      organization: String(data.get('organization') ?? ''),
      tier,
    })

    setLoading(false)

    if (error) {
      toast.error('Could not submit your application. Please try again.')
      return
    }

    toast.success('Application received! We will review and be in touch shortly.')
    form.reset()
    setTier(MEMBERSHIP_TIERS[1].name)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ma-name">Full name</Label>
          <Input id="ma-name" name="name" required placeholder="Jane Doe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ma-email">Email</Label>
          <Input
            id="ma-email"
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ma-org">Organization (optional)</Label>
        <Input
          id="ma-org"
          name="organization"
          placeholder="Hospital, university, or pharmacy"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ma-tier">Membership tier</Label>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger id="ma-tier">
            <SelectValue placeholder="Select a tier" />
          </SelectTrigger>
          <SelectContent>
            {MEMBERSHIP_TIERS.map((t) => (
              <SelectItem key={t.name} value={t.name}>
                {t.name} — {t.price}
                {t.period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="self-start bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {loading ? 'Submitting...' : 'Submit application'}
      </Button>
    </form>
  )
}
