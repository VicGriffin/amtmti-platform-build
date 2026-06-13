import { MembershipPlans } from './membership-plans'
import { SectionHeading } from '@/components/site/section-heading'

export function MembershipSection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Membership"
          title="Join Africa's leading MTM community"
          description="Become part of a thriving pan-African network of pharmacists, clinicians, researchers, and healthcare leaders."
        />
        <div className="mt-12">
          <MembershipPlans />
        </div>
      </div>
    </section>
  )
}
