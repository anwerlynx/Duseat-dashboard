'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterChipProps {
  label: string
  value?: string | number
  onRemove: () => void
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function FilterChip({
  label,
  value,
  onRemove,
  variant = 'neutral',
  className,
}: FilterChipProps) {
  const variantStyles = {
    neutral: 'bg-[#eff1f3] text-[#1f2327]',
    brand: 'bg-[#e5f6f7] text-[#00c2cb] font-semibold',
    success: 'bg-[#dfefe8] text-[#17b26a] font-semibold',
    warning: 'bg-[#fffaf0] text-[#f79009] border border-[#f79009]/20 font-semibold',
    destructive: 'bg-[#f3e1e0] text-[#d92d20] font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] transition-colors',
        variantStyles[variant],
        className
      )}
    >
      <span>
        {label}
        {value !== undefined && value !== '' && `: ${value}`}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        aria-label={`Remove filter ${label}`}
        className="rounded-full p-0.5 hover:bg-black/10 transition-colors cursor-pointer"
      >
        <X className="size-3" />
      </button>
    </span>
  )
}

export interface FilterChipGroupProps {
  children: React.ReactNode
  onClearAll?: () => void
  clearLabel?: string
  className?: string
}

export function FilterChipGroup({
  children,
  onClearAll,
  clearLabel = 'Clear All',
  className,
}: FilterChipGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 pt-1', className)}>
      <span className="text-[12px] font-semibold text-[#6f777f]">Active Filters:</span>
      {children}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-[12px] font-bold text-[#00c2cb] hover:underline ml-1 cursor-pointer"
        >
          {clearLabel}
        </button>
      )}
    </div>
  )
}
