import type { Metadata } from 'next'
import { Users, BookOpen, Award, Globe2, TrendingUp, Heart } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { MembershipPlans } from '@/components/marketing/membership-plans'
import { MembershipApplyForm } from '@/components/marketing/membership-apply-form'

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Join the pan-African AMTMTI community. Choose a Student, Affiliate, or Corporate membership and access CPD discounts, the research library, and a continent-wide network.',
}

const benefits = [
  {
    icon: Users,
    title: 'A pan-African network',
    body: 'Connect with thousands of pharmacists, clinicians, and researchers across the continent.',
  },
  {
    icon: BookOpen,
    title: 'Research library access',
    body: 'Unlock publications, toolkits, and evidence-based MTM resources.',
  },
  {
    icon: Award,
    title: 'CPD discounts',
    body: 'Enjoy member rates on accredited courses and continuing education.',
  },
  {
    icon: Globe2,
    title: 'Events & summits',
    body: 'Priority access and discounts to our flagship gatherings and webinars.',
  },
  {
    icon: TrendingUp,
    title: 'Career growth',
    body: 'Mentorship, job opportunities, and recognition through member badges.',
  },
  {
    icon: Heart,
    title: 'Shared mission',
    body: 'Be part of a movement improving medication outcomes for every patient.',
  },
]

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Become part of the AMTMTI community"
        description="Join a growing pan-African network committed to safer medication use, professional growth, and world-class practice."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Membership' }]}
      />

      {/* Benefits */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Why join"
            title="Membership benefits"
            description="Everything you need to grow your practice and your impact."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <b.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="border-y border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Plans"
            title="Choose your membership"
            description="Flexible tiers for students, individual professionals, and institutions."
          />
          <div className="mt-14">
            <MembershipPlans />
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="scroll-mt-24 bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Apply now
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
              Start your membership application
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Complete the short form and our membership team will guide you
              through the next steps, including payment and onboarding for your
              chosen tier.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <MembershipApplyForm />
          </div>
        </div>
      </section>
    </>
  )
}
