'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PROGRAMS } from '@/lib/programs-data'
import { PROFESSION_CATEGORIES, PROGRAM_LEVELS, DELIVERY_MODES } from '@/lib/site-data'
import { ProgramCard } from './program-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Map the friendly "CPD Courses" nav label to the data level "CPD Course"
function normalizeLevel(level: string) {
  return level === 'CPD Courses' ? 'CPD Course' : level
}

export function ProgramsExplorer({
  initialProfession = '',
  initialLevel = '',
}: {
  initialProfession?: string
  initialLevel?: string
}) {
  const [query, setQuery] = useState('')
  const [profession, setProfession] = useState(initialProfession)
  const [level, setLevel] = useState(normalizeLevel(initialLevel))
  const [mode, setMode] = useState('')

  const filtered = useMemo(() => {
    return PROGRAMS.filter((p) => {
      if (profession && p.category !== profession) return false
      if (level && p.level !== level) return false
      if (mode && p.mode !== mode) return false
      if (query) {
        const q = query.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [query, profession, level, mode])

  const hasFilters = profession || level || mode || query

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Filter programs
            </h2>
          </div>

          <FilterGroup label="Profession">
            <FilterChip active={profession === ''} onClick={() => setProfession('')}>
              All
            </FilterChip>
            {PROFESSION_CATEGORIES.map((c) => (
              <FilterChip
                key={c.slug}
                active={profession === c.slug}
                onClick={() => setProfession(c.slug)}
              >
                {c.title}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Level">
            <FilterChip active={level === ''} onClick={() => setLevel('')}>
              All
            </FilterChip>
            {PROGRAM_LEVELS.map((l) => (
              <FilterChip key={l} active={level === l} onClick={() => setLevel(l)}>
                {l}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Delivery mode">
            <FilterChip active={mode === ''} onClick={() => setMode('')}>
              All
            </FilterChip>
            {DELIVERY_MODES.map((m) => (
              <FilterChip key={m} active={mode === m} onClick={() => setMode(m)}>
                {m}
              </FilterChip>
            ))}
          </FilterGroup>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-muted-foreground"
              onClick={() => {
                setProfession('')
                setLevel('')
                setMode('')
                setQuery('')
              }}
            >
              <X className="size-3.5" />
              Clear all filters
            </Button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs by title or keyword..."
            aria-label="Search programs"
            className="pl-9"
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'program' : 'programs'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 border border-dashed border-border bg-card py-16 text-center">
            <Badge variant="secondary">No matches</Badge>
            <p className="max-w-sm text-sm text-muted-foreground">
              No programs match your current filters. Try clearing some filters or
              adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground/70 hover:border-primary/40 hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}
