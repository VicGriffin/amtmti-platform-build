import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { MEMBERSHIP_TIERS } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function MembershipPlans({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {MEMBERSHIP_TIERS.map((tier) => (
        <div
          key={tier.name}
          id={tier.name.toLowerCase()}
          className={cn(
            'relative flex flex-col border bg-card p-6 transition',
            tier.popular
              ? 'border-secondary shadow-lg ring-1 ring-secondary/30 lg:scale-[1.03]'
              : 'border-border hover:border-primary/40 hover:shadow-md',
          )}
        >
          {tier.popular && (
            <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <Star className="size-3 fill-current" />
              Most Popular
            </span>
          )}
          <h3 className="font-heading text-xl font-bold text-foreground">{tier.name}</h3>
          <div className="mt-3 flex items-end gap-1">
            <span className="font-heading text-3xl font-bold text-primary">{tier.price}</span>
            {tier.period && (
              <span className="pb-1 text-sm text-muted-foreground">{tier.period}</span>
            )}
          </div>
          <ul className="mt-6 flex flex-1 flex-col gap-3">
            {tier.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Check className="mt-0.5 size-4 shrink-0 text-secondary" />
                {benefit}
              </li>
            ))}
          </ul>
          <Button
            asChild
            className={cn(
              'mt-6',
              tier.popular
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                : '',
            )}
            variant={tier.popular ? 'default' : 'outline'}
          >
            <Link href={`/membership#apply`}>
              {tier.price === 'Free' ? 'Join Free' : `Choose ${tier.name}`}
            </Link>
          </Button>
        </div>
      ))}
    </div>
  )
}
