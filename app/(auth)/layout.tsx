import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/site/logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, var(--gold) 0, transparent 45%), radial-gradient(circle at 80% 70%, var(--secondary) 0, transparent 40%)',
          }}
        />
        <Link href="/" className="relative">
          <Logo variant="light" />
        </Link>
        <div className="relative max-w-md">
          <h2 className="font-heading text-3xl font-semibold leading-tight text-balance">
            Advancing medication therapy management across Africa.
          </h2>
          <p className="mt-4 leading-relaxed text-primary-foreground/70">
            Join thousands of pharmacists, clinicians, and healthcare
            professionals building safer medication practice through world-class
            accredited training.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="font-heading text-2xl font-bold text-gold">12,400+</p>
              <p className="text-sm text-primary-foreground/60">Professionals trained</p>
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-gold">40+</p>
              <p className="text-sm text-primary-foreground/60">Accredited programs</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} AMTMTI. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-background">
        <div className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}
