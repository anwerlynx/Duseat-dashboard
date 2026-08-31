'use client'

import * as React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'
import { cn } from '@/lib/utils'
import { dealStatus } from './data'

export function DealStatus() {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set())
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const visible = dealStatus.filter((d) => !hidden.has(d.key))
  const total = visible.reduce((acc, d) => acc + d.value, 0)

  const toggle = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else if (next.size < dealStatus.length - 1) next.add(key)
      return next
    })
  }

  const activeSegment = activeIndex !== null ? visible[activeIndex] : null

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm font-sans">
      <h2 className="text-[20px] leading-[28px] font-semibold text-foreground">Deal Status</h2>

      <div className="relative mx-auto mt-2 h-52 w-full max-w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              cornerRadius={6}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              onMouseEnter={(_, i) => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              activeIndex={activeIndex ?? undefined}
              activeShape={(props: React.ComponentProps<typeof Sector>) => (
                <Sector {...props} outerRadius={(props.outerRadius ?? 88) + 5} />
              )}
              animationDuration={600}
            >
              {visible.map((seg) => (
                <Cell key={seg.key} fill={seg.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[24px] leading-[32px] font-bold tabular-nums text-foreground">
            {activeSegment ? activeSegment.value.toLocaleString('en-US') : total.toLocaleString('en-US')}
          </span>
          <span className="text-[12px] leading-[16px] text-muted-foreground">
            {activeSegment ? activeSegment.label : 'Total Deals'}
          </span>
        </div>
      </div>

      {/* Interactive legend */}
      <ul className="mt-4 space-y-1 border-t border-border pt-4">
        {dealStatus.map((seg, i) => {
          const isHidden = hidden.has(seg.key)
          return (
            <li key={seg.key}>
              <button
                type="button"
                onClick={() => toggle(seg.key)}
                onMouseEnter={() => {
                  if (!isHidden) setActiveIndex(visible.findIndex((v) => v.key === seg.key))
                }}
                onMouseLeave={() => setActiveIndex(null)}
                aria-pressed={!isHidden}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-[14px] leading-[20px] transition-colors hover:bg-secondary',
                  isHidden && 'opacity-40',
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full ring-2 ring-transparent transition-all"
                  style={{ backgroundColor: seg.color }}
                />
                <span className={cn('flex-1 text-left text-foreground font-normal', isHidden && 'line-through')}>{seg.label}</span>
                <span className="font-semibold tabular-nums text-foreground">{seg.value.toLocaleString('en-US')}</span>
                <span className="w-9 text-right text-[12px] leading-[16px] text-muted-foreground tabular-nums">{seg.percent}%</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
