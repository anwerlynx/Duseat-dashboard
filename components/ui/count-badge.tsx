'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const countBadgeVariants = cva(
  'inline-flex items-center justify-center font-mono font-semibold leading-none select-none transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-[#eff1f3] text-[#1f2327]',
        brand: 'bg-[#e5f6f7] text-[#00c2cb]',
        'brand-solid': 'bg-[#00c2cb] text-white',
        success: 'bg-[#dfefe8] text-[#17b26a]',
        warning: 'bg-[#fffaf0] text-[#f79009] border border-[#f79009]/20',
        destructive: 'bg-[#f3e1e0] text-[#d92d20]',
        active: 'bg-white/20 text-white',
        outline: 'border border-[#d3d5d7] bg-white text-[#6f777f]',
      },
      size: {
        sm: 'min-w-[18px] h-[18px] px-1.5 text-[11px] rounded-full',
        md: 'min-w-[20px] h-[20px] px-1.5 text-[12px] rounded-full',
        lg: 'min-w-[24px] h-[24px] px-2 text-[13px] rounded-full',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'sm',
    },
  }
)

export interface CountBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof countBadgeVariants> {
  count?: number | string
  max?: number
}

export function CountBadge({
  count,
  max = 999,
  variant,
  size,
  className,
  children,
  ...props
}: CountBadgeProps) {
  let displayValue: React.ReactNode = children

  if (count !== undefined && count !== null) {
    if (typeof count === 'number' && count > max) {
      displayValue = `${max}+`
    } else {
      displayValue = count
    }
  }

  if (displayValue === undefined || displayValue === null || displayValue === '') {
    return null
  }

  return (
    <span
      className={cn(countBadgeVariants({ variant, size, className }))}
      {...props}
    >
      {displayValue}
    </span>
  )
}
