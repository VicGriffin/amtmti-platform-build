'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Clock,
  MapPin,
  Menu,
  Phone,
  ChevronDown,
  GraduationCap,
  ShieldUser,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE, MAIN_NAV, PROFESSION_CATEGORIES, PROGRAM_TYPES } from '@/lib/site-data'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function TopBar() {
  return (
    <div className="hidden bg-primary text-primary-foreground lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-xs">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-gold" />
            {SITE.hours}
          </span>
          <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 transition hover:text-gold">
            <Phone className="size-3.5 text-gold" />
            {SITE.phone}
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-gold" />
            {SITE.address.line1}, {SITE.address.line2}, {SITE.address.country}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/login" className="flex items-center gap-1.5 font-medium transition hover:text-gold">
            <ShieldUser className="size-3.5" />
            Admin Login
          </Link>
          <span className="text-primary-foreground/30">|</span>
          <Link href="/login" className="flex items-center gap-1.5 font-medium transition hover:text-gold">
            <GraduationCap className="size-3.5" />
            Student Login
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProgramsMega({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid w-[640px] grid-cols-[1.4fr_1fr] gap-6 p-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          By Profession
        </p>
        <div className="grid grid-cols-2 gap-1">
          {PROFESSION_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/programs?profession=${cat.slug}`}
              onClick={onNavigate}
              className="group rounded-lg px-3 py-2 transition hover:bg-accent"
            >
              <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                {cat.title}
              </span>
              <span className="block text-xs text-muted-foreground">
                {cat.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
          Program Types
        </p>
        <ul className="flex flex-col gap-2">
          {PROGRAM_TYPES.map((type) => (
            <li key={type}>
              <Link
                href={`/programs?level=${encodeURIComponent(type)}`}
                onClick={onNavigate}
                className="flex items-center gap-2 text-sm text-primary-foreground/90 transition hover:text-gold"
              >
                <span className="size-1.5 rounded-full bg-gold" />
                {type}
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild variant="secondary" size="sm" className="mt-5 w-full">
          <Link href="/programs" onClick={onNavigate}>
            Browse all programs
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <div
        className={cn(
          'border-b transition-all duration-300',
          scrolled
            ? 'border-border bg-card/85 shadow-sm backdrop-blur-md'
            : 'border-transparent bg-card',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" aria-label="AMTMTI home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {MAIN_NAV.map((item) =>
              item.label === 'Programs' ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition',
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-foreground/80 hover:text-primary',
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </Link>
                  {megaOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                      <div className="overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
                        <ProgramsMega onNavigate={() => setMegaOpen(false)} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition',
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-primary',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button asChild className="hidden bg-gold text-gold-foreground hover:bg-gold/90 md:inline-flex">
              <Link href="/register">Enroll Now</Link>
            </Button>

            {/* Mobile */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto p-0">
                <SheetHeader className="border-b p-5">
                  <SheetTitle asChild>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-4">
                  {MAIN_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'rounded-md px-3 py-2.5 text-sm font-medium transition',
                        isActive(item.href)
                          ? 'bg-accent text-primary'
                          : 'text-foreground/80 hover:bg-accent',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 border-t p-4">
                  <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Enroll Now
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Student Login
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                      Admin Login
                    </Link>
                  </Button>
                  <div className="flex items-center justify-between pt-2 text-sm">
                    <span className="text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
