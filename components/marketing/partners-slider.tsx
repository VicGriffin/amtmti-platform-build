import { PARTNERS } from '@/lib/site-data'
import { Building2 } from 'lucide-react'

export function PartnersSlider() {
  const items = [...PARTNERS, ...PARTNERS]

  return (
    <section className="border-y border-border bg-muted/40 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by universities, hospitals, regulators & research organisations
        </p>
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-[marquee_36s_linear_infinite] gap-4 group-hover:[animation-play-state:paused]">
            {items.map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card px-6 py-3.5"
              >
                <Building2 className="size-5 text-primary" />
                <span className="whitespace-nowrap text-sm font-medium text-foreground/80">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
