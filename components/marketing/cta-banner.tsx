import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaBanner() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-14 text-secondary-foreground sm:px-14">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/3 size-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <h2 className="text-balance font-heading text-3xl font-bold sm:text-4xl">
              Ready to advance medication therapy management?
            </h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-secondary-foreground/90">
              Join thousands of healthcare professionals building safer
              medication use across Africa. Enrol in an accredited programme
              today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90"
                render={
                  <Link href="/register">
                    Enroll Now
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
                render={<Link href="/programs">Browse Programs</Link>}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
