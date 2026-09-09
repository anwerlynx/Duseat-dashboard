'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type PlanBadgeTier = 'Pro' | 'Elite' | 'Power'

export interface PlanBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  property1?: PlanBadgeTier
  tier?: PlanBadgeTier
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

/**
 * Official Figma Insignia for Plan Tiers (Node 217:10008)
 * Renders the exact multi-layered shield vector + light reflection + star crystal
 */
export function PlanBadgeInsignia({
  tier = 'Pro',
  className = 'size-[16px]',
}: {
  tier?: PlanBadgeTier
  className?: string
}) {
  const isPower = tier === 'Power'
  const isElite = tier === 'Elite'
  const isPro = !isPower && !isElite

  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0 size-[16px]', className)}>
      {/* Layer 1: Shield Vector Gradient */}
      <img
        src={
          isPower
            ? '/images/badges/power-vector.svg'
            : isElite
            ? '/images/badges/elite-vector.svg'
            : '/images/badges/pro-vector.svg'
        }
        alt=""
        className="absolute inset-0 size-full object-contain pointer-events-none select-none"
        loading="eager"
      />
      {/* Layer 2: Light Streak Reflection */}
      <img
        src={
          isPower
            ? '/images/badges/power-reflect.svg'
            : isElite
            ? '/images/badges/elite-reflect.svg'
            : '/images/badges/pro-reflect.svg'
        }
        alt=""
        className="absolute inset-0 size-full object-contain pointer-events-none select-none"
        loading="eager"
      />
      {/* Layer 3: Central Crystal Star */}
      <img
        src={isPro ? '/images/badges/star-pro.png' : '/images/badges/star-elite-power.png'}
        alt=""
        className="absolute size-[8px] object-contain pointer-events-none select-none z-10 drop-shadow-xs"
        loading="eager"
      />
    </div>
  )
}

/**
 * PlanBadge Component
 * Extracted directly from Figma: @https://www.figma.com/design/fFqCjG8QjlNgBUOUDn6mVN/Dashboard?node-id=217-10008&m=dev
 * 
 * Tiers:
 * - Pro: Cyan surface (#e5f6f7), text (#00c2cb), Insignia: Pro agent
 * - Elite: Blue surface (#eaf2ff), text (#3366ff / #2f54eb), Insignia: Elite agent
 * - Power: Red/Rose surface (#f3e1e0), text (#d92d20), Insignia: Power agent
 */
export const PlanBadge = React.forwardRef<HTMLDivElement, PlanBadgeProps>(
  (
    {
      property1,
      tier = 'Pro',
      size = 'md',
      showIcon = true,
      className,
      ...props
    },
    ref
  ) => {
    const selectedTier = property1 || tier

    const tierConfig = {
      Pro: {
        label: 'Pro agent',
        bg: 'bg-[#e5f6f7] hover:bg-[#d9f1f3]',
        text: 'text-[#00a4ac] font-semibold',
        border: 'border-[#c7ecee]/80',
      },
      Elite: {
        label: 'Elite agent',
        bg: 'bg-[#eaf2ff] hover:bg-[#deebff]',
        text: 'text-[#2f54eb] font-semibold',
        border: 'border-[#adc8ff]/80',
      },
      Power: {
        label: 'Power agent',
        bg: 'bg-[#f3e1e0] hover:bg-[#edd4d2]',
        text: 'text-[#d92d20] font-semibold',
        border: 'border-[#eaa5a0]/80',
      },
    }[selectedTier]

    const sizeClasses = {
      sm: 'h-[22px] px-[8px] text-[12px] gap-[3px] rounded-[8px]',
      md: 'h-[28px] px-[12px] py-[4px] text-[14px] gap-[4px] rounded-[12px]',
      lg: 'h-[34px] px-[14px] text-[15px] gap-[5px] rounded-[12px]',
    }[size]

    const iconSizes = {
      sm: 'size-[13px]',
      md: 'size-[16px]',
      lg: 'size-[18px]',
    }[size]

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-sans border select-none whitespace-nowrap leading-none transition-all shadow-2xs',
          tierConfig.bg,
          tierConfig.text,
          tierConfig.border,
          sizeClasses,
          className
        )}
        {...props}
      >
        <span>{tierConfig.label}</span>

        {showIcon && <PlanBadgeInsignia tier={selectedTier} className={iconSizes} />}
      </div>
    )
  }
)

PlanBadge.displayName = 'PlanBadge'
