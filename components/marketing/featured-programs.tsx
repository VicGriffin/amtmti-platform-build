import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PROGRAMS } from '@/lib/programs-data'
import { PROFESSION_CATEGORIES } from '@/lib/site-data'
import { SectionHeading } from '@/components/site/section-heading'
import { ProgramCard } from './program-card'
import { Button } from '@/components/ui/button'

export function FeaturedPrograms() {
  const featured = PROGRAMS.filter((p) => p.featured).slice(0, 4)

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Programs"
            title="Accredited pathways for every healthcare profession"
            description="From short CPD courses to postgraduate diplomas, our programmes meet professionals wherever they are in their careers."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/programs">
              Browse all programs
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {PROFESSION_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/programs?profession=${cat.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80 transition hover:border-primary hover:text-primary"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
}
