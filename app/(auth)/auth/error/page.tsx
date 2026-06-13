import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </span>
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Authentication error
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          That link is invalid or has expired. Please try signing in again.
        </p>
      </div>
      <Button className="w-full" render={<Link href="/login">Back to sign in</Link>} />
    </div>
  )
}
