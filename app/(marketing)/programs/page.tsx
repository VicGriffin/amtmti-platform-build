import type { Metadata } from 'next'
import { PageHero } from '@/components/site/page-hero'
import { ProgramsExplorer } from '@/components/marketing/programs-explorer'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore AMTMTI accredited certificates, diplomas, postgraduate diplomas, and CPD courses in medication therapy management across every healthcare profession.',
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ profession?: string; level?: string }>
}) {
  const params = await searchParams

  return (
    <>
      <PageHero
        eyebrow="Accredited Training"
        title="Programs built for African healthcare"
        description="Certificates, diplomas, postgraduate pathways, and CPD courses designed around the realities of practice across the continent."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Programs' }]}
      />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <ProgramsExplorer
            initialProfession={params.profession ?? ''}
            initialLevel={params.level ?? ''}
          />
        </div>
      </section>
    </>
  )
}
