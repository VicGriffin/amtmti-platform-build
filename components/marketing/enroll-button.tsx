'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GraduationCap, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Program } from '@/lib/programs-data'

export function EnrollButton({ program }: { program: Program }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleEnroll() {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.info('Create an account to enroll in this program.')
      router.push(`/register?program=${program.slug}`)
      return
    }

    const { error } = await supabase.from('enrollments').upsert(
      {
        user_id: user.id,
        program_slug: program.slug,
        program_title: program.title,
        category_label: program.categoryLabel,
        level: program.level,
        status: 'active',
      },
      { onConflict: 'user_id,program_slug' },
    )

    setLoading(false)

    if (error) {
      toast.error('Could not enroll. Please try again.')
      return
    }

    setDone(true)
    toast.success(`Enrolled in ${program.title}!`)
    setTimeout(() => router.push('/portal'), 900)
  }

  return (
    <Button
      size="lg"
      onClick={handleEnroll}
      disabled={loading || done}
      className="w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:w-auto"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : done ? (
        <Check className="size-4" />
      ) : (
        <GraduationCap className="size-4" />
      )}
      {done ? 'Enrolled' : loading ? 'Enrolling...' : 'Enroll in this program'}
    </Button>
  )
}
