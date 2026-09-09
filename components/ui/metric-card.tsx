'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  label: string
  count?: number | string
  value?: number | string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive'
  isActive?: boolean
  active?: boolean
  onClick?: () => void
  className?: string
}

export function MetricCard({
  label,
  count,
  value,
  trend,
  trendDirection = 'neutral',
  icon: Icon,
  tone = 'neutral',
  isActive = false,
  active = false,
  onClick,
  className,
}: MetricCardProps) {
  const displayCount = value !== undefined ? value : count ?? 0
  const isCardActive = active || isActive
  const toneColors = {
    neutral: 'text-[#1f2327]',
    brand: 'text-[#00c2cb]',
    success: 'text-[#17b26a]',
    warning: 'text-[#f79009]',
    destructive: 'text-[#d92d20]',
  }

  const activeStyles = {
    neutral: 'border-[#1f2327] bg-[#fcfcfc]',
    brand: 'border-[#00c2cb] bg-[#e5f6f7]',
    success: 'border-[#17b26a] bg-[#dfefe8]/40',
    warning: 'border-[#f79009] bg-[#fffaf0]',
    destructive: 'border-[#d92d20] bg-[#f3e1e0]/40',
  }

  const hoverStyles = {
    neutral: 'hover:border-[#1f2327]',
    brand: 'hover:border-[#00c2cb]',
    success: 'hover:border-[#17b26a]',
    warning: 'hover:border-[#f79009]',
    destructive: 'hover:border-[#d92d20]',
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-[12px] border p-3.5 shadow-xs transition-all select-none',
        onClick && 'cursor-pointer',
        isCardActive
          ? activeStyles[tone]
          : `border-[#d3d5d7] bg-white ${onClick ? hoverStyles[tone] : ''}`,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#6f777f]">{label}</span>
        {Icon && <Icon className={cn('size-4', toneColors[tone])} />}
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className={cn('text-[24px] font-bold leading-none font-sans', toneColors[tone])}>
          {displayCount}
        </span>
        {trend && (
          <span
            className={cn(
              'text-[11px] font-semibold flex items-center gap-0.5',
              trendDirection === 'up'
                ? 'text-[#17b26a]'
                : trendDirection === 'down'
                ? 'text-[#d92d20]'
                : 'text-[#6f777f]'
            )}
          >
            {trendDirection === 'up' && <TrendingUp className="size-3" />}
            {trendDirection === 'down' && <TrendingDown className="size-3" />}
            <span>{trend}</span>
          </span>
        )}
      </div>
    </div>
  )
}
