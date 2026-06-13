import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { NEWS, EVENTS, formatDate } from '@/lib/news-data'
import { SectionHeading } from '@/components/site/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function NewsEvents() {
  const latest = NEWS.slice(0, 3)
  const upcoming = EVENTS.slice(0, 3)

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading align="left" eyebrow="News" title="Latest from AMTMTI" />
              <Button asChild variant="ghost" size="sm" className="shrink-0 text-primary">
                <Link href="/news">
                  All news <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              {latest.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:gap-5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-secondary/12 text-secondary">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.date)} · {item.readMinutes} min read
                      </span>
                    </div>
                    <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary sm:block" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading align="left" eyebrow="Events" title="Upcoming events" />
            <div className="mt-6 flex flex-col gap-4">
              {upcoming.map((event) => (
                <div
                  key={event.slug}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <Badge className="bg-gold/20 text-gold-foreground">{event.mode}</Badge>
                  <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                    {event.title}
                  </h3>
                  <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      {event.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
