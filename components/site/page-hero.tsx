import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Crumb = { label: string; href?: string }

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-border bg-primary text-primary-foreground',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          color: 'var(--color-primary-foreground)',
        }}
      />
      <div
        aria-hidden
        className="absolute -right-24 -top-24 size-72 rounded-full bg-secondary/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-primary-foreground/70">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition hover:text-gold">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary-foreground">{crumb.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && (
                    <ChevronRight className="size-3.5 text-primary-foreground/40" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 max-w-3xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-primary-foreground/80">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
