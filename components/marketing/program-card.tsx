import Link from 'next/link'
import { Clock, GraduationCap, Monitor, ArrowRight } from 'lucide-react'
import { type Program, formatKsh } from '@/lib/programs-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const levelColor: Record<Program['level'], string> = {
  Certificate: 'bg-secondary/12 text-secondary',
  Diploma: 'bg-primary/10 text-primary',
  'Postgraduate Diploma': 'bg-gold/20 text-gold-foreground',
  'CPD Course': 'bg-accent text-accent-foreground',
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-primary">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            color: 'var(--color-primary-foreground)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <GraduationCap className="size-12 text-primary-foreground/70" />
        </div>
        <span className="absolute left-3 top-3">
          <Badge className={levelColor[program.level]}>{program.level}</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary">
          {program.categoryLabel}
        </p>
        <h3 className="mt-1.5 font-heading text-lg font-semibold leading-snug text-foreground">
          {program.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {program.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {program.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Monitor className="size-3.5" /> {program.mode}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="font-heading text-base font-bold text-primary">
            {formatKsh(program.feesKsh)}
          </span>
          <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary">
            <Link href={`/programs/${program.slug}`}>
              View
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
