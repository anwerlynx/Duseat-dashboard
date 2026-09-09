'use client'

import * as React from 'react'
import { MoreHorizontal, ArrowUpRight, Eye, Pin, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KpiCard as KpiCardType } from './data'
import { AnimatedNumber, Sparkline, Delta, Tooltip } from './primitives'
import { Dropdown } from './menu'

interface KpiCardProps {
  card: KpiCardType
  compact?: boolean
  index?: number
  onOpen: (card: KpiCardType) => void
  onAction: (action: string, card: KpiCardType) => void
}

export function KpiCard({ card, compact = false, index = 0, onOpen, onAction }: KpiCardProps) {
  const Icon = card.icon

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(card)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(card)
        }
      }}
      style={{ animationDelay: `${index * 45}ms` }}
      className="group animate-fade-up relative flex cursor-pointer flex-col rounded-xl border border-border bg-card p-4 shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-brand/10 group-hover:text-brand">
          <Icon className="size-[18px]" />
        </span>
        <Tooltip content={`${card.title} — ${card.growth} vs last period`}>
          <span className="text-[14px] leading-[20px] font-medium text-muted-foreground">{card.title}</span>
        </Tooltip>
        <div className="ml-auto flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          <Dropdown
            align="end"
            value=""
            onSelect={(v) => onAction(v, card)}
            options={[
              { label: 'View details', value: 'view', icon: <Eye className="size-4 text-muted-foreground" /> },
              { label: 'Pin to top', value: 'pin', icon: <Pin className="size-4 text-muted-foreground" /> },
              { label: 'Export data', value: 'export', icon: <Download className="size-4 text-muted-foreground" /> },
            ]}
            trigger={
              <span className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </span>
            }
            ariaLabel={`Actions for ${card.title}`}
          />
        </div>
      </div>

      {/* Value */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <AnimatedNumber value={card.value} className="text-[24px] leading-[32px] font-bold text-foreground" />
          <p className="mt-1 text-[12px] leading-[16px] text-muted-foreground">vs last month</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Delta value={card.growth.replace(/[+-]/, '')} trend={card.trend} pill />
          <Sparkline data={card.spark} trend={card.trend} />
        </div>
      </div>

      {/* Supporting metrics */}
      <div className={cn('mt-4 space-y-2 border-t border-border pt-3', compact && 'space-y-1.5')}>
        {card.supporting.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-2 text-[14px] leading-[20px]">
            <span className="truncate font-normal text-muted-foreground">{m.label}</span>
            <span className="flex items-center gap-2">
              <span className="font-medium tabular-nums text-foreground">{m.value}</span>
              {m.delta && <Delta value={m.delta} trend={m.trend || 'up'} />}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
