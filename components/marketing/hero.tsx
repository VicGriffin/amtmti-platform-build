'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_STATS } from '@/lib/site-data'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Animated background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[28rem] rounded-full bg-gold/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium ring-1 ring-primary-foreground/15">
            <span className="size-1.5 rounded-full bg-gold" />
            The Institute
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            A World-Class Home for{' '}
            <span className="text-gold">Medication Therapy Management</span>{' '}
            Training in Africa
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80">
            AMTMTI delivers world-class education and skills enhancement
            training in medication therapy management — including professional
            development courses, certificates, diplomas, and postgraduate
            diplomas — designed for pharmacists, clinicians, and the wider
            African healthcare workforce.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="/about">
                About the Institute
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/research">
                <FlaskConical className="size-4" />
                Visit Research Division
              </Link>
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="rounded-xl bg-primary-foreground/5 p-3 ring-1 ring-primary-foreground/10"
              >
                <dt className="text-2xl font-bold text-gold">{stat.value}</dt>
                <dd className="mt-0.5 text-xs text-primary-foreground/70">
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-primary-foreground/15">
            <Image
              src="/images/hero-professionals.png"
              alt="African healthcare professionals collaborating in a clinical pharmacy"
              width={720}
              height={820}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute -bottom-5 left-5 rounded-2xl bg-card p-4 text-card-foreground shadow-xl ring-1 ring-border"
          >
            <p className="text-xs font-medium text-muted-foreground">Accredited & recognised</p>
            <p className="font-heading text-lg font-bold text-primary">Pan-African MTM Pathways</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
