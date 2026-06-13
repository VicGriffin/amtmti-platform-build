import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Award,
  ShieldCheck,
  TrendingUp,
  Scale,
  Target,
  Eye,
  ArrowRight,
} from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  VALUES,
  JOURNEY,
  LEADERSHIP,
  STRATEGIC_OBJECTIVES,
  SITE,
} from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about AMTMTI — our mission, vision, values, leadership, and 2030 strategy to advance medication therapy management across Africa.',
}

const valueIcons = { Award, ShieldCheck, TrendingUp, Scale } as const

function initials(name: string) {
  return name
    .replace(/^(Prof\.|Dr\.)\s*/i, '')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AMTMTI"
        title="Advancing safer medication use across Africa"
        description={`${SITE.fullName} is a continent-wide institute dedicated to world-class education, research, and community in medication therapy management.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Mission & Vision */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="size-6" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              To deliver accessible, world-class education and skills enhancement
              training in medication therapy management, equipping Africa&apos;s
              healthcare workforce to improve medication outcomes for every
              patient.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-secondary/12 text-secondary">
              <Eye className="size-6" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
              Our Vision
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              A continent where medication therapy management is embedded in
              every level of care — driven by African-led research, a thriving
              professional community, and the highest standards of patient
              safety.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="What guides us"
            title="Our core values"
            description="The principles that shape every programme, partnership, and decision."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = valueIcons[value.icon as keyof typeof valueIcons]
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gold/20 text-gold-foreground">
                    {Icon && <Icon className="size-5" />}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="scroll-mt-24 bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Our journey"
            title="From a training gap to a continent-wide institute"
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-5">
            {JOURNEY.map((item, i) => (
              <li key={item.year} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="font-heading text-xl font-bold text-secondary">
                    {item.year}
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Strategic objectives */}
      <section
        id="objectives"
        className="scroll-mt-24 bg-primary py-16 text-primary-foreground sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            2030 Strategy
          </span>
          <h2 className="mt-2 max-w-2xl text-balance font-heading text-3xl font-bold sm:text-4xl">
            Our strategic objectives for the decade
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-primary-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {STRATEGIC_OBJECTIVES.map((obj) => (
              <div key={obj.title} className="bg-primary p-7">
                <span className="font-heading text-3xl font-bold text-gold">
                  {obj.year}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold">
                  {obj.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
                  {obj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section
        id="leadership"
        className="scroll-mt-24 bg-background py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Leadership"
            title="Meet the team driving our mission"
            description="Experienced clinicians, educators, and researchers leading AMTMTI."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((person) => (
              <div
                key={person.name}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center"
              >
                <Avatar className="size-20">
                  <AvatarFallback className="bg-primary/10 font-heading text-lg font-semibold text-primary">
                    {initials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {person.name}
                </h3>
                <p className="text-sm font-medium text-secondary">
                  {person.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Join a movement transforming medication safety in Africa
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              render={<Link href="/programs">Explore programs</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              render={
                <Link href="/membership">
                  Become a member
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}
