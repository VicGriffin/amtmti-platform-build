'use client'

import Link from 'next/link'
import { Globe, MessageCircle, Share2, Rss, Send, Clock, Phone, MapPin } from 'lucide-react'
import { SITE } from '@/lib/site-data'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const columns = [
  {
    title: 'About',
    links: [
      { label: 'About AMTMTI', href: '/about' },
      { label: 'Leadership', href: '/about#leadership' },
      { label: 'Our Journey', href: '/about#journey' },
      { label: 'Strategic Objectives', href: '/about#objectives' },
    ],
  },
  {
    title: 'Programs',
    links: [
      { label: 'All Programs', href: '/programs' },
      { label: 'Certificates', href: '/programs?level=Certificate' },
      { label: 'Diplomas', href: '/programs?level=Diploma' },
      { label: 'CPD Courses', href: '/programs?level=CPD%20Courses' },
    ],
  },
  {
    title: 'Research',
    links: [
      { label: 'Research Division', href: '/research' },
      { label: 'Publications', href: '/research#publications' },
      { label: 'Collaborations', href: '/research#collaborations' },
      { label: 'Submit Research', href: '/research#submit' },
    ],
  },
  {
    title: 'Membership',
    links: [
      { label: 'Join AMTMTI', href: '/membership' },
      { label: 'Student', href: '/membership#student' },
      { label: 'Affiliate', href: '/membership#affiliate' },
      { label: 'Corporate', href: '/membership#corporate' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'News & Events', href: '/news' },
      { label: 'E-Learning', href: '/portal' },
      { label: 'Contact', href: '/contact' },
      { label: 'Student Portal', href: '/login' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="lg:pr-6">
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              {SITE.fullName}. Building African solutions for safer medication
              use through education, research, and community.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-2">
                <Clock className="size-4 text-gold" /> {SITE.hours}
              </span>
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-gold">
                <Phone className="size-4 text-gold" /> {SITE.phone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-gold" /> {SITE.address.line1}, {SITE.address.country}
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-gold">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 transition hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid items-center gap-6 rounded-2xl bg-primary-foreground/5 p-6 ring-1 ring-primary-foreground/10 md:grid-cols-2">
          <div>
            <h3 className="font-heading text-lg font-semibold">Stay informed</h3>
            <p className="text-sm text-primary-foreground/70">
              Subscribe for research updates, course launches, and events.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.success('Subscribed! Welcome to the AMTMTI community.')
              ;(e.target as HTMLFormElement).reset()
            }}
            className="flex gap-2"
          >
            <Input
              type="email"
              required
              placeholder="Your email address"
              aria-label="Email address"
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Send className="size-4" />
              <span className="sr-only sm:not-sr-only">Subscribe</span>
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-6 md:flex-row">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
            <Link href="/privacy" className="hover:text-primary-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-foreground">Terms</Link>
          </div>
          <div className="flex items-center gap-3">
            {[Share2, Globe, MessageCircle, Rss].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media"
                className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-gold hover:text-gold-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
