'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  ShieldPlus,
  Stethoscope,
  HeartPulse,
  Globe2,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { RESEARCH_STATS, RESEARCH_AREAS } from '@/lib/site-data'
import { Button } from '@/components/ui/button'

const icons: Record<string, LucideIcon> = {
  ShieldPlus,
  Stethoscope,
  HeartPulse,
  Globe2,
  CheckCircle2,
}

const researchImages: Record<string, string> = {
  'Medication Safety': '/images/medication_safety.png',
  'Clinical Pharmacy': '/images/clinical_pharmacy.png',
  'Pharmaceutical Care': '/images/Pharmaceutical_care.png',
  'Public Health': '/images/Public_health.png',
  'Medication Adherence': '/images/medical_adherence.png',
}

export function ResearchPreview() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Research Division
            </span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold sm:text-4xl">
              African evidence. Global standards. Better medication therapy.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-primary-foreground/80">
              Our research division generates the evidence base for medication
              therapy management in African health systems through rigorous,
              multi-country studies.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {RESEARCH_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-primary-foreground/5 p-4 ring-1 ring-primary-foreground/10"
                >
                  <dt className="font-heading text-3xl font-bold text-gold">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-primary-foreground/70">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <Button asChild className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="/research">
                Explore the Research Division
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {RESEARCH_AREAS.map((area, i) => {
              const Icon = icons[area.icon]
              const bgImage = researchImages[area.title]
              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative overflow-hidden p-5 ring-1 ring-primary-foreground/10 transition hover:ring-primary-foreground/20"
                  style={{
                    backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10">
                    <span className="flex size-10 items-center justify-center bg-gold/20 text-gold">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-3 font-heading text-base font-semibold text-primary-foreground">
                      {area.title}
                    </h3>
                    <p className="mt-1 text-sm text-primary-foreground/90">
                      {area.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
