import { Hero } from '@/components/marketing/hero'
import { PartnersSlider } from '@/components/marketing/partners-slider'
import { WhyAmtmti } from '@/components/marketing/why-amtmti'
import { FeaturedPrograms } from '@/components/marketing/featured-programs'
import { ResearchPreview } from '@/components/marketing/research-preview'
import { NewsEvents } from '@/components/marketing/news-events'
import { MembershipSection } from '@/components/marketing/membership-section'
import { Testimonials } from '@/components/marketing/testimonials'
import { CtaBanner } from '@/components/marketing/cta-banner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersSlider />
      <WhyAmtmti />
      <FeaturedPrograms />
      <ResearchPreview />
      <NewsEvents />
      <MembershipSection />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
