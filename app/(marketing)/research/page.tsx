import type { Metadata } from 'next'
import {
  ShieldPlus,
  Stethoscope,
  HeartPulse,
  Globe2,
  CheckCircle2,
  FileText,
  Download,
  Users,
} from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { ContactForm } from '@/components/marketing/contact-form'
import { Badge } from '@/components/ui/badge'
import { RESEARCH_STATS, RESEARCH_AREAS, PARTNERS } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'The AMTMTI Research Division generates the African evidence base for medication therapy management — spanning medication safety, clinical pharmacy, and public health.',
}

const areaIcons = {
  ShieldPlus,
  Stethoscope,
  HeartPulse,
  Globe2,
  CheckCircle2,
} as const

const PUBLICATIONS = [
  {
    title:
      'Pharmacist-led medication reviews and preventable harm: a four-country study',
    journal: 'African Journal of Pharmaceutical Care',
    year: '2026',
    type: 'Original Research',
  },
  {
    title: 'Adherence interventions in chronic disease: a systematic review',
    journal: 'Journal of Medication Safety',
    year: '2025',
    type: 'Systematic Review',
  },
  {
    title: 'Implementing MTM in primary care across East Africa',
    journal: 'Global Health Practice',
    year: '2025',
    type: 'Implementation Study',
  },
  {
    title: 'Competency frameworks for pharmaceutical care in Africa',
    journal: 'Pharmacy Education Review',
    year: '2024',
    type: 'Position Paper',
  },
]

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research Division"
        title="Building the African evidence base for MTM"
        description="We generate rigorous, locally relevant research that drives safer medication use and informs policy across the continent."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }]}
      />

      {/* Stats */}
      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 lg:grid-cols-4">
          {RESEARCH_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research areas */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Focus areas"
            title="Where our research makes an impact"
            description="Five interconnected themes guiding our studies and collaborations."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH_AREAS.map((area) => {
              const Icon = areaIcons[area.icon as keyof typeof areaIcons]
              return (
                <div
                  key={area.title}
                  className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-secondary/12 text-secondary">
                    {Icon && <Icon className="size-5" />}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section
        id="publications"
        className="scroll-mt-24 border-y border-border bg-muted/40 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            align="left"
            eyebrow="Publications"
            title="Recent research output"
          />
          <div className="mt-10 flex flex-col gap-4">
            {PUBLICATIONS.map((pub) => (
              <article
                key={pub.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
                      {pub.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pub.journal} · {pub.year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <Badge variant="secondary">{pub.type}</Badge>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary transition hover:text-primary/80"
                  >
                    <Download className="size-4" />
                    PDF
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborations */}
      <section
        id="collaborations"
        className="scroll-mt-24 bg-background py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Collaborations"
            title="Our research partners"
            description="We work hand in hand with universities, hospitals, and health bodies across Africa and beyond."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {PARTNERS.map((partner) => (
              <span
                key={partner}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
              >
                <Users className="size-4 text-secondary" />
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Submit research */}
      <section id="submit" className="scroll-mt-24 bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Get involved
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
              Submit a research proposal
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Are you working on medication safety or pharmaceutical care research?
              We welcome proposals for collaboration, co-authorship, and funding
              partnerships. Share your idea and our Research Division will respond.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm defaultSubject="Research proposal" compact />
          </div>
        </div>
      </section>
    </>
  )
}
