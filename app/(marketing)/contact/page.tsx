import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { ContactForm } from '@/components/marketing/contact-form'
import { SITE } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with AMTMTI. Reach our team for programs, membership, research collaborations, and general enquiries.',
}

export default function ContactPage() {
  const details = [
    {
      icon: Phone,
      label: 'Phone',
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: `${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.country}`,
    },
    { icon: Clock, label: 'Hours', value: SITE.hours },
  ]

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="We&apos;d love to hear from you"
        description="Questions about programs, membership, or research? Reach out and our team will respond promptly."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Details */}
          <div className="flex flex-col gap-4">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <d.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {d.label}
                  </p>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="mt-0.5 block font-medium text-foreground transition hover:text-primary"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 font-medium text-foreground">{d.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="AMTMTI location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.95%2C-1.16%2C37.02%2C-1.10&layer=mapnik&marker=-1.13%2C36.98"
                className="h-56 w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Send us a message
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you as soon as we
              can.
            </p>
            <div className="mt-6">
              <ContactForm defaultSubject="General enquiry" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
