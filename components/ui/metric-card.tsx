'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SupportingMetricItem {
  label: string
  value: string | number
  delta?: string
  trend?: 'up' | 'down'
}

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
  supporting?: SupportingMetricItem[]
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
  supporting,
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

  const iconBgColors = {
    neutral: 'bg-[#f4f5f6] text-[#1f2327] group-hover:bg-[#1f2327] group-hover:text-white',
    brand: 'bg-[#f4f5f6] text-[#1f2327] group-hover:bg-[#1f2327] group-hover:text-white',
    success: 'bg-[#dfefe8] text-[#17b26a] group-hover:bg-[#17b26a] group-hover:text-white',
    warning: 'bg-[#fff5e5] text-[#f79009] group-hover:bg-[#f79009] group-hover:text-white',
    destructive: 'bg-[#fee4e2] text-[#d92d20] group-hover:bg-[#d92d20] group-hover:text-white',
    info: 'bg-[#e0f2fe] text-[#1570ef] group-hover:bg-[#1570ef] group-hover:text-white',
  }

  const activeStyles = {
    neutral: 'border-2 border-[#1f2327] bg-[#1f2327]/[0.02] ring-2 ring-[#1f2327]/15 shadow-sm',
    brand: 'border-2 border-[#1f2327] bg-[#1f2327]/[0.02] ring-2 ring-[#1f2327]/15 shadow-sm',
    success: 'border-2 border-[#17b26a] bg-[#17b26a]/[0.02] ring-2 ring-[#17b26a]/15 shadow-sm',
    warning: 'border-2 border-[#f79009] bg-[#f79009]/[0.02] ring-2 ring-[#f79009]/15 shadow-sm',
    destructive: 'border-2 border-[#d92d20] bg-[#d92d20]/[0.02] ring-2 ring-[#d92d20]/15 shadow-sm',
    info: 'border-2 border-[#1570ef] bg-[#1570ef]/[0.02] ring-2 ring-[#1570ef]/15 shadow-sm',
  }

  const hoverStyles = {
    neutral: 'hover:border-[#1f2327]/40',
    brand: 'hover:border-[#1f2327]/40',
    success: 'hover:border-[#17b26a]/60',
    warning: 'hover:border-[#f79009]/60',
    destructive: 'hover:border-[#d92d20]/60',
    info: 'hover:border-[#1570ef]/60',
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border border-[#d3d5d7] bg-white p-4 shadow-sm outline-none transition-all duration-200 select-none font-sans min-h-[96px]',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
        onClick && hoverStyles[tone],
        isCardActive && activeStyles[tone],
        className
      )}
    >
      {/* Header with Icon on the Left, Title, and subtle ArrowUpRight on the Right */}
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors mt-0.5',
              iconBgColors[tone]
            )}
          >
            <Icon className="size-[17px]" />
          </span>
        )}
        <span className="text-[13.5px] font-medium text-[#6f777f] group-hover:text-[#1f2327] transition-colors break-words flex-1 min-w-0" title={label}>
          {label}
        </span>
        {onClick && (
          <div className="ml-auto flex items-center shrink-0">
            <ArrowUpRight className="size-4 text-[#98a2b3] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1f2327]" />
          </div>
        )}
      </div>

      {/* Value row with bold black numbers and trend pill badge */}
      <div className="mt-2.5 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[22px] sm:text-[26px] font-bold leading-tight tracking-tight text-[#1f2327] block break-words tabular-nums font-sans">
            {displayCount}
          </span>
          {subtitle && (
            <p className="mt-1 text-[12px] leading-[16px] text-[#6f777f] break-words">{subtitle}</p>
          )}
        </div>

        {trendText ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0',
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
        ) : null}
      </div>

      {/* Optional supporting metrics list (matching Dashboard KpiCard) */}
      {supporting && supporting.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-[#f2f4f7] pt-2.5">
          {supporting.map((m) => (
            <div key={m.label} className="flex items-start justify-between gap-2 text-[12px] leading-[16px]">
              <span className="text-[#6f777f] font-normal break-words flex-1 min-w-0">{m.label}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="font-semibold tabular-nums text-[#1f2327]">{m.value}</span>
                {m.delta && (
                  <span
                    className={cn(
                      'text-[11px] font-bold',
                      m.trend === 'down' ? 'text-[#d92d20]' : 'text-[#17b26a]'
                    )}
                  >
                    {m.delta}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

