'use client'

import * as React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '@/lib/utils'
import { revenueSeries } from './data'
import { Delta } from './primitives'
import { Dropdown } from './menu'
import type { DateRange } from './topbar'

const currencyRates: Record<string, { symbol: string; rate: number }> = {
  AED: { symbol: 'AED', rate: 1 },
  USD: { symbol: '$', rate: 0.272 },
  EUR: { symbol: '€', rate: 0.25 },
}

const rangeToSeriesKey: Record<DateRange, keyof typeof revenueSeries> = {
  today: 'week',
  week: 'week',
  month: 'month',
  year: 'year',
}

interface RevenueChartProps {
  range: DateRange
}

function CustomTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean
  payload?: Array<{ payload: { label: string; value: number; deals: number } }>
  currency: string
}) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  const { symbol, rate } = currencyRates[currency]
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-muted-foreground">{p.label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
        {symbol} {Math.round(p.value * rate).toLocaleString('en-US')}
      </p>
      <p className="text-xs text-muted-foreground tabular-nums">{p.deals} deals closed</p>
    </div>
  )
}

export function RevenueChart({ range }: RevenueChartProps) {
  const [currency, setCurrency] = React.useState('AED')
  const data = revenueSeries[rangeToSeriesKey[range]]
  const { symbol, rate } = currencyRates[currency]

  const total = data.reduce((acc, d) => acc + d.value, 0)
  const peak = Math.max(...data.map((d) => d.value))
  const summaryValue = Math.round(peak * rate)

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm font-sans">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] leading-[28px] font-semibold text-foreground">Revenue Performance</h2>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="text-[24px] leading-[32px] font-bold tabular-nums text-foreground">
              {symbol} {summaryValue.toLocaleString('en-US')}
            </span>
            <Delta value="14.0%" trend="up" pill />
          </div>
          <p className="mt-1 text-[12px] leading-[16px] text-muted-foreground tabular-nums">
            +{symbol} {Math.round(9200 * rate).toLocaleString('en-US')} vs last period
          </p>
        </div>
        <Dropdown
          value={currency}
          onSelect={setCurrency}
          options={Object.keys(currencyRates).map((c) => ({ label: c, value: c }))}
          ariaLabel="Select currency"
        />
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#01ccd2" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#01ccd2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 12 }}
              width={64}
              tickFormatter={(v) => `${symbol} ${Math.round((v * rate) / 1000)}K`}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} />}
              cursor={{ stroke: '#01ccd2', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#01ccd2"
              strokeWidth={2.5}
              fill="url(#revFill)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#01ccd2' }}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        {[
          { label: 'Total', value: `${symbol} ${Math.round((total * rate) / 1000).toLocaleString('en-US')}K` },
          { label: 'Peak', value: `${symbol} ${Math.round((peak * rate) / 1000).toLocaleString('en-US')}K` },
          { label: 'Avg / period', value: `${symbol} ${Math.round((total * rate) / data.length / 1000).toLocaleString('en-US')}K` },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[12px] leading-[16px] text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 text-[14px] leading-[20px] font-semibold tabular-nums text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
