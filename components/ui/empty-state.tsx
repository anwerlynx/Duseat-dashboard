'use client'

import * as React from 'react'
import { LucideIcon, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('p-12 text-center space-y-3 font-sans', className)}>
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eff1f3] text-[#6f777f]">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-[16px] sm:text-[18px] font-bold text-[#1f2327]">{title}</h3>
        {description && <p className="text-[13px] sm:text-[14px] text-[#6f777f] max-w-sm mx-auto">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="h-[36px] rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-semibold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}
