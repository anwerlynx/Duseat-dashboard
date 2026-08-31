'use client'

import * as React from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */

function useHasMounted() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted
}

interface AnimatedNumberProps {
  value: string
  className?: string
  durationMs?: number
}

/**
 * Animates the numeric portion of a string (e.g. "AED 12.0K", "2h 34m")
 * from 0 to its target on mount. Non-numeric characters are preserved.
 */
export function AnimatedNumber({ value, className, durationMs = 900 }: AnimatedNumberProps) {
  const mounted = useHasMounted()
  const [display, setDisplay] = React.useState(value)
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!mounted) return
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplay(value)
      return
    }

    // Find the first numeric token to animate.
    const match = value.match(/[\d,.]+/)
    if (!match) {
      setDisplay(value)
      return
    }
    const numStr = match[0]
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
    const target = parseFloat(numStr.replace(/,/g, ''))
    const hasComma = numStr.includes(',')
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = target * eased
      let formatted = current.toFixed(decimals)
      if (hasComma) {
        const [int, dec] = formatted.split('.')
        formatted = Number(int).toLocaleString('en-US') + (dec ? '.' + dec : '')
      }
      setDisplay(value.replace(numStr, formatted))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [mounted, value, durationMs])

  return <span className={cn('tabular-nums', className)}>{display}</span>
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */

interface SparklineProps {
  data: number[]
  trend?: 'up' | 'down'
  className?: string
  width?: number
  height?: number
}

export function Sparkline({ data, trend = 'up', className, width = 72, height = 28 }: SparklineProps) {
  const id = React.useId()
  const stroke = trend === 'up' ? 'var(--brand)' : 'var(--destructive)'
  const { path, area } = React.useMemo(() => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const step = width / (data.length - 1)
    const pts = data.map((d, i) => {
      const x = i * step
      const y = height - ((d - min) / range) * (height - 4) - 2
      return [x, y] as const
    })
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    const areaPath = `${line} L${width},${height} L0,${height} Z`
    return { path: line, area: areaPath }
  }, [data, width, height])

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={path} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Trend pill / delta                                                  */
/* ------------------------------------------------------------------ */

interface DeltaProps {
  value: string
  trend: 'up' | 'down'
  pill?: boolean
  className?: string
}

export function Delta({ value, trend, pill = false, className }: DeltaProps) {
  const positive = trend === 'up'
  const Icon = positive ? ArrowUp : ArrowDown
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium tabular-nums',
        positive ? 'text-success' : 'text-destructive',
        pill && (positive ? 'rounded-full bg-success/10 px-2 py-0.5' : 'rounded-full bg-destructive/10 px-2 py-0.5'),
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {value}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, string> = {
  open: 'bg-brand/10 text-[#0b7f84] ring-brand/20',
  pending: 'bg-amber-100 text-amber-700 ring-amber-200',
  matched: 'bg-success/10 text-success ring-success/20',
  closed: 'bg-muted text-muted-foreground ring-border',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset',
        statusStyles[status] ?? statusStyles.closed,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                        */
/* ------------------------------------------------------------------ */

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const mounted = useHasMounted()
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
        style={{ width: mounted ? `${value}%` : '0%' }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

/* ------------------------------------------------------------------ */
/* Tooltip (lightweight, hover/focus)                                  */
/* ------------------------------------------------------------------ */

export function Tooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('group/tt relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-95 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-all duration-150 group-hover/tt:scale-100 group-hover/tt:opacity-100 group-focus-within/tt:scale-100 group-focus-within/tt:opacity-100"
      >
        {content}
        <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-foreground" />
      </span>
    </span>
  )
}
