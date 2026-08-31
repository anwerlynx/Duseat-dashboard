'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WidgetCardProps {
  title: string
  onViewAll?: () => void
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function WidgetCard({ title, onViewAll, actions, children, className }: WidgetCardProps) {
  return (
    <div className={cn('flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-center justify-between gap-2 pb-2">
        <h2 className="text-[20px] leading-[28px] font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {actions}
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1 rounded-lg border border-input bg-card px-2.5 py-1.5 text-[12px] leading-[16px] font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
