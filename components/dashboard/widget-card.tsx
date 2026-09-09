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
        'flex flex-col justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 shadow-2xs font-sans h-full min-h-[440px]',
        className
      )}
    >
      <div className={cn('flex items-center justify-between gap-2 border-b border-[#d3d5d7] pb-3', headerClassName)}>
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold text-[#1f2327] truncate">{title}</h2>
          {subtitle && <p className="text-[12px] text-[#6f777f] truncate mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {actions}
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
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
