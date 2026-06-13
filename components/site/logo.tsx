import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
  variant = 'default',
}: {
  className?: string
  showText?: boolean
  variant?: 'default' | 'light'
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2.5c2 3 5 4.2 5 8.3 0 3.6-2.4 6.2-5 8.7-2.6-2.5-5-5.1-5-8.7 0-4.1 3-5.3 5-8.3Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M12 8v6m-3-3h6"
            stroke="var(--color-primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-gold ring-2 ring-card" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading text-lg font-bold tracking-tight',
              variant === 'light' ? 'text-primary-foreground' : 'text-foreground',
            )}
          >
            AMTMTI
          </span>
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-[0.12em]',
              variant === 'light'
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground',
            )}
          >
            Africa MTM Institute
          </span>
        </span>
      )}
    </span>
  )
}
