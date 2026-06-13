'use client'

import { motion } from 'motion/react'
import { Award, ShieldCheck, TrendingUp, Scale, type LucideIcon } from 'lucide-react'
import { VALUES } from '@/lib/site-data'
import { SectionHeading } from '@/components/site/section-heading'

const icons: Record<string, LucideIcon> = {
  Award,
  ShieldCheck,
  TrendingUp,
  Scale,
}

export function WhyAmtmti() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why AMTMTI"
          title="Principles that anchor everything we do"
          description="Our work is guided by four values that shape how we teach, research, and serve healthcare professionals across the continent."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => {
            const Icon = icons[value.icon]
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-secondary/40 hover:shadow-lg"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-secondary group-hover:text-secondary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
