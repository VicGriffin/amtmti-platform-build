import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { NEWS, formatDate } from '@/lib/news-data'
import { PageHero } from '@/components/site/page-hero'
import { Badge } from '@/components/ui/badge'

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = NEWS.find((n) => n.slug === slug)
  if (!item) return { title: 'Article not found' }
  return { title: item.title, description: item.excerpt }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = NEWS.find((n) => n.slug === slug)
  if (!item) notFound()

  const more = NEWS.filter((n) => n.slug !== item.slug).slice(0, 2)

  return (
    <>
      <PageHero
        eyebrow={item.category}
        title={item.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: item.category },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-gold" />
            {formatDate(item.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="size-4 text-gold" />
            {item.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-gold" />
            {item.readMinutes} min read
          </span>
        </div>
      </PageHero>

      <article className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-foreground">
            {item.excerpt}
          </p>
          <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
            <p>{item.body}</p>
            <p>
              This work forms part of AMTMTI&apos;s broader 2030 strategy to embed
              medication therapy management across African health systems —
              training professionals, generating evidence, and building a
              continent-wide community of practice committed to safer medication
              use.
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <Link
              href="/news"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              <ArrowLeft className="size-4" />
              Back to all news
            </Link>
          </div>
        </div>
      </article>

      {/* More articles */}
      <section className="border-t border-border bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            More from the newsroom
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {more.map((m) => (
              <Link
                key={m.slug}
                href={`/news/${m.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Badge variant="secondary" className="self-start">
                  {m.category}
                </Badge>
                <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                  {m.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {m.excerpt}
                </p>
                <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read article
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
