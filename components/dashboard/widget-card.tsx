'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WidgetCardProps {
  title: string
  subtitle?: string
  onViewAll?: () => void
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

export function WidgetCard({
  title,
  subtitle,
  onViewAll,
  actions,
  children,
  className,
  headerClassName,
}: WidgetCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm font-sans h-full min-h-[440px]',
        className
      )}
    >
      <div className={cn('flex items-center justify-between gap-2 border-b border-border pb-3', headerClassName)}>
        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {actions}
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex h-[32px] items-center gap-1 rounded-md border border-border bg-card px-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
            >
              <span>View all</span>
              <ArrowUpRight className="size-3.5 text-[#6f777f]" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between pt-3">{children}</div>
    </div>
  )
}
