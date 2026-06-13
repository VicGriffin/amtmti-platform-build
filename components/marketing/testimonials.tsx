'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/site-data'
import { SectionHeading } from '@/components/site/section-heading'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = TESTIMONIALS.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = () => setIndex((i) => (i - 1 + count) % count)

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  const t = TESTIMONIALS[index]
  const initials = t.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by healthcare professionals across Africa"
        />
        <div className="relative mt-12">
          <Quote className="mx-auto size-10 text-secondary/30" />
          <div className="min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-center"
              >
                <blockquote className="text-balance font-heading text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-secondary' : 'w-2 bg-border'
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
