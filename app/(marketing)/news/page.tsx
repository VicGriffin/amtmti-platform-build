import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, MapPin, ArrowRight, Clock } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { Badge } from '@/components/ui/badge'
import { NEWS, EVENTS, formatDate } from '@/lib/news-data'

export const metadata: Metadata = {
  title: 'News & Events',
  description:
    'The latest news, announcements, research updates, partnerships, and upcoming events from AMTMTI.',
}

const categoryColor: Record<string, string> = {
  News: 'bg-primary/10 text-primary',
  'Research Updates': 'bg-secondary/12 text-secondary',
  Partnerships: 'bg-gold/20 text-gold-foreground',
  Announcements: 'bg-accent text-accent-foreground',
  Events: 'bg-primary/10 text-primary',
}

export default function NewsPage() {
  const [featured, ...rest] = NEWS

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="News & events"
        description="Announcements, research updates, partnerships, and gatherings from across the AMTMTI community."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />

      {/* Featured + grid */}
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Featured */}
          <Link
            href={`/news/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] bg-primary lg:aspect-auto">
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(currentColor 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  color: 'var(--color-primary-foreground)',
                }}
              />
              <div className="absolute left-4 top-4">
                <Badge className={categoryColor[featured.category]}>
                  {featured.category}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {formatDate(featured.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {featured.readMinutes} min read
                </span>
              </div>
              <h2 className="mt-3 text-balance font-heading text-2xl font-bold leading-snug text-foreground group-hover:text-primary">
                {featured.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {featured.excerpt}
              </p>
              <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] bg-muted">
                  <div className="absolute left-3 top-3">
                    <Badge className={categoryColor[item.category]}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="border-t border-border bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            align="left"
            eyebrow="Upcoming events"
            title="Join us in person and online"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {EVENTS.map((event) => (
              <div
                key={event.slug}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <Badge variant="secondary" className="self-start">
                  {event.mode}
                </Badge>
                <h3 className="mt-4 font-heading text-lg font-semibold leading-snug text-foreground">
                  {event.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
                <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-secondary" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-secondary" />
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
