'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, UserPlus, MailCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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
import { PROFESSION_CATEGORIES } from '@/lib/site-data'
import { toast } from 'sonner'

const COUNTRIES = [
  'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Nigeria', 'Ghana',
  'South Africa', 'Egypt', 'Zambia', 'Malawi', 'Other',
]

export function RegisterForm() {
  const router = useRouter()
  const params = useSearchParams()
  const program = params.get('program')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [profession, setProfession] = useState('')
  const [country, setCountry] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const fullName = String(data.get('full_name') ?? '')
    const email = String(data.get('email') ?? '')
    const phone = String(data.get('phone') ?? '')
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirm') ?? '')

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${program ? `/programs/${program}` : '/portal'}`
        : undefined

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: { full_name: fullName, phone, country, profession },
      },
    })

    setLoading(false)

    if (error) {
      toast.error(error.message || 'Could not create your account.')
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
          <MailCheck className="size-6" />
        </span>
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Check your email
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We&apos;ve sent a confirmation link to verify your account. Once
            verified, you can sign in to your portal.
          </p>
        </div>
        <Button variant="outline" className="w-full" render={<a href="/login">Go to sign in</a>} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" required placeholder="Jane Doe" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+254 700 000000" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profession">Profession</Label>
          <Select value={profession} onValueChange={setProfession}>
            <SelectTrigger id="profession">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {PROFESSION_CATEGORIES.map((p) => (
                <SelectItem key={p.slug} value={p.title}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required placeholder="••••••••" autoComplete="new-password" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" required placeholder="••••••••" autoComplete="new-password" />
        </div>
      </div>
      <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
