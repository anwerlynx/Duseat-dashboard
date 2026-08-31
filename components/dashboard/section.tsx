'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionProps {
  title: string
  description?: string
  count?: number
  actions?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  id?: string
}

export function Section({
  title,
  description,
  count,
  actions,
  children,
  defaultOpen = true,
  id,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const panelId = React.useId()

  return (
    <section id={id} className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
      <div className="flex items-center gap-3 px-1 pb-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={cn(
              'size-5 text-muted-foreground transition-transform duration-200',
              !open && '-rotate-90',
            )}
          />
          <h2 className="text-[20px] leading-[28px] font-semibold text-foreground">{title}</h2>
          {typeof count === 'number' && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[12px] leading-[16px] font-medium text-muted-foreground tabular-nums">
              {count}
            </span>
          )}
          {description && (
            <span className="hidden text-[14px] leading-[20px] font-normal text-muted-foreground md:inline">· {description}</span>
          )}
        </button>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div
        id={panelId}
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="p-1">{children}</div>
        </div>
      </div>
    </section>
  )
}
