import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Clock,
  Monitor,
  GraduationCap,
  CheckCircle2,
  CalendarDays,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
import { PROGRAMS, formatKsh } from '@/lib/programs-data'
import { PageHero } from '@/components/site/page-hero'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgramCard } from '@/components/marketing/program-card'
import { EnrollButton } from '@/components/marketing/enroll-button'

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = PROGRAMS.find((p) => p.slug === slug)
  if (!program) return { title: 'Program not found' }
  return {
    title: program.title,
    description: program.summary,
  }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const program = PROGRAMS.find((p) => p.slug === slug)
  if (!program) notFound()

  const related = PROGRAMS.filter(
    (p) => p.category === program.category && p.slug !== program.slug,
  ).slice(0, 3)

  const facts = [
    { icon: BadgeCheck, label: 'Level', value: program.level },
    { icon: Clock, label: 'Duration', value: program.duration },
    { icon: Monitor, label: 'Delivery', value: program.mode },
    { icon: CalendarDays, label: 'Intake', value: 'Rolling enrolment' },
  ]

  return (
    <>
      <PageHero
        eyebrow={program.categoryLabel}
        title={program.title}
        description={program.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programs', href: '/programs' },
          { label: program.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-gold/20 text-gold-foreground">
            {program.level}
          </Badge>
          <span className="font-heading text-2xl font-bold text-gold">
            {formatKsh(program.feesKsh)}
          </span>
        </div>
      </PageHero>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Program overview
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {program.summary} This programme blends evidence-based theory with
              practical, case-led learning so you can apply medication therapy
              management principles directly in your daily practice. Delivered by
              experienced clinical faculty, it is designed to fit around the
              demands of a working healthcare professional.
            </p>

            <h3 className="mt-10 font-heading text-xl font-bold text-foreground">
              What you&apos;ll be able to do
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {program.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-heading text-xl font-bold text-foreground">
              How you&apos;ll learn
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Guided modules',
                  body: 'Structured online modules with readings, case studies, and assessments.',
                },
                {
                  title: 'Live sessions',
                  body: 'Interactive sessions and clinics with faculty and peers across Africa.',
                },
                {
                  title: 'Applied practice',
                  body: 'Workplace-based tasks that translate learning into patient impact.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h4 className="font-heading text-base font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="size-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tuition
                  </p>
                  <p className="font-heading text-xl font-bold text-primary">
                    {formatKsh(program.feesKsh)}
                  </p>
                </div>
              </div>

              <dl className="mt-6 flex flex-col gap-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                      <fact.icon className="size-4 text-secondary" />
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-3">
                <EnrollButton program={program} />
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  render={
                    <Link href="/contact">
                      Ask a question
                      <ArrowRight className="size-4" />
                    </Link>
                  }
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related programs */}
      {related.length > 0 && (
        <section className="border-t border-border bg-muted/40 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Related programs
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProgramCard key={p.slug} program={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
