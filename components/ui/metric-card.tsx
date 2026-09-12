'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  label: string
  count?: number | string
  value?: number | string
  subtitle?: string
  trend?: string | { value: string; isPositive?: boolean }
  trendDirection?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive' | 'info'
  isActive?: boolean
  active?: boolean
  onClick?: () => void
  className?: string
}

export function MetricCard({
  label,
  count,
  value,
  subtitle,
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

  const trendText = typeof trend === 'object' && trend !== null ? trend.value : trend
  const effectiveDirection =
    typeof trend === 'object' && trend !== null && trend.isPositive !== undefined
      ? trend.isPositive
        ? 'up'
        : 'down'
      : trendDirection

  const toneColors = {
    neutral: 'text-[#00c2cb]',
    brand: 'text-[#00c2cb]',
    success: 'text-[#17b26a]',
    warning: 'text-[#f79009]',
    destructive: 'text-[#d92d20]',
    info: 'text-[#1570ef]',
  }

  const iconBgColors = {
    neutral: 'bg-[#00c2cb]/10 text-[#00c2cb]',
    brand: 'bg-[#00c2cb]/10 text-[#00c2cb]',
    success: 'bg-[#17b26a]/10 text-[#17b26a]',
    warning: 'bg-[#f79009]/10 text-[#f79009]',
    destructive: 'bg-[#d92d20]/10 text-[#d92d20]',
    info: 'bg-[#1570ef]/10 text-[#1570ef]',
  }

  const activeStyles = {
    neutral: 'border-2 border-[#00c2cb] bg-[#00c2cb]/[0.04] ring-2 ring-[#00c2cb]/20 shadow-[0_2px_12px_rgba(0,194,203,0.12)]',
    brand: 'border-2 border-[#00c2cb] bg-[#00c2cb]/[0.04] ring-2 ring-[#00c2cb]/20 shadow-[0_2px_12px_rgba(0,194,203,0.12)]',
    success: 'border-2 border-[#17b26a] bg-[#17b26a]/[0.04] ring-2 ring-[#17b26a]/20 shadow-[0_2px_12px_rgba(23,178,106,0.12)]',
    warning: 'border-2 border-[#f79009] bg-[#f79009]/[0.04] ring-2 ring-[#f79009]/20 shadow-[0_2px_12px_rgba(247,144,9,0.12)]',
    destructive: 'border-2 border-[#d92d20] bg-[#d92d20]/[0.04] ring-2 ring-[#d92d20]/20 shadow-[0_2px_12px_rgba(217,45,32,0.12)]',
    info: 'border-2 border-[#1570ef] bg-[#1570ef]/[0.04] ring-2 ring-[#1570ef]/20 shadow-[0_2px_12px_rgba(21,112,239,0.12)]',
  }

  const hoverStyles = {
    neutral: 'hover:border-[#00c2cb]',
    brand: 'hover:border-[#00c2cb]',
    success: 'hover:border-[#17b26a]',
    warning: 'hover:border-[#f79009]',
    destructive: 'hover:border-[#d92d20]',
    info: 'hover:border-[#1570ef]',
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'group flex flex-col justify-between rounded-[12px] border-2 border-[#e5e7eb] bg-white p-3.5 sm:p-4 min-h-[90px]',
        'drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)]',
        'transition-all duration-150 select-none font-sans',
        onClick && 'cursor-pointer hover:shadow-xs hover:-translate-y-0.5',
        onClick && hoverStyles[tone],
        isCardActive && activeStyles[tone],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-[#6f777f] truncate" title={label}>
          {label}
        </span>
        {Icon && (
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-[6px] transition-colors',
              iconBgColors[tone]
            )}
          >
            <Icon className="size-3.5" />
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span
          className={cn(
            'text-[24px] sm:text-[26px] font-semibold leading-none tracking-tight font-sans truncate',
            toneColors[tone]
          )}
        >
          {displayCount}
        </span>

        {trendText ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold shrink-0',
              effectiveDirection === 'up'
                ? 'bg-[#dfefe8] text-[#17b26a]'
                : effectiveDirection === 'down'
                ? 'bg-[#fee4e2] text-[#d92d20]'
                : 'bg-[#eff1f3] text-[#6f777f]'
            )}
          >
            {effectiveDirection === 'up' && <TrendingUp className="size-3" />}
            {effectiveDirection === 'down' && <TrendingDown className="size-3" />}
            {effectiveDirection === 'neutral' && <Minus className="size-3" />}
            <span>{trendText}</span>
          </span>
        ) : subtitle ? (
          <span className="text-[11px] font-medium text-[#6f777f] truncate">{subtitle}</span>
        ) : null}
      </div>
    </div>
  )
}
