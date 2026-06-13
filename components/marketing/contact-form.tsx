'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ContactForm({
  defaultSubject = '',
  compact = false,
}: {
  defaultSubject?: string
  compact?: boolean
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)

    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      subject: String(data.get('subject') ?? defaultSubject),
      message: String(data.get('message') ?? ''),
    })

    setLoading(false)

    if (error) {
      toast.error('Something went wrong. Please try again.')
      return
    }

    toast.success('Message sent! Our team will be in touch soon.')
    form.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={compact ? 'flex flex-col gap-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-name">Full name</Label>
          <Input id="cf-name" name="name" required placeholder="Jane Doe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-email">Email</Label>
          <Input
            id="cf-email"
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cf-subject">Subject</Label>
        <Input
          id="cf-subject"
          name="subject"
          defaultValue={defaultSubject}
          required
          placeholder="How can we help?"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cf-message">Message</Label>
        <Textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us a little more..."
        />
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
        {loading ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  )
}
