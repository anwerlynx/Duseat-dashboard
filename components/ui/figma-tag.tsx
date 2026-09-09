'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type FigmaTagStatus =
  | 'Primary'
  | 'Default'
  | 'Active'
  | 'Error'
  | 'Success'
  | 'information'
  | 'Warning'
  | 'Disabled'

export type FigmaTagSize = 'sm' | 'lg' | 'xl'
export type FigmaTagType = 'Normal' | 'Outline'

export interface FigmaTagProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: FigmaTagType
  status?: FigmaTagStatus
  size?: FigmaTagSize
  tagChip?: boolean
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showLabel?: boolean
  showLeftIcon?: boolean
  showRightIcon?: boolean
  onDismiss?: () => void
}

/**
 * FigmaTag Component
 * Extracted from Figma: @https://www.figma.com/design/sNuyvH8pS0stcQ2jU3DUtW/Components?node-id=1275-1884&m=dev
 * 
 * Properties:
 * - type: "Normal" | "Outline"
 * - status: "Primary" | "Default" | "Active" | "Error" | "Success" | "information" | "Warning" | "Disabled"
 * - size: "sm" (24px, 16px icon) | "lg" (28px, 18px icon) | "xl" (34px, 20px icon)
 * - tagChip: boolean (full chip or compact icon chip)
 * - leftIcon / rightIcon: custom vector icons or action triggers (18-20px sized)
 */
export const FigmaTag = React.forwardRef<HTMLDivElement, FigmaTagProps>(
  (
    {
      className,
      type = 'Normal',
      status = 'Default',
      size = 'lg',
      tagChip = true,
      label,
      children,
      leftIcon,
      rightIcon,
      showLabel = true,
      showLeftIcon = true,
      showRightIcon = true,
      onDismiss,
      onClick,
      ...props
    },
    ref
  ) => {
    const content = children || label

    // Height & Padding scale calibrated for 18-20px icons
    const sizeClasses = {
      sm: tagChip ? 'h-[24px] px-[8px] text-[12px] rounded-[12px] gap-1.5' : 'size-[24px] p-0 rounded-[8px]',
      lg: tagChip ? 'h-[28px] px-[10px] text-[13px] rounded-[12px] gap-2' : 'size-[28px] p-0 rounded-[8px]',
      xl: tagChip ? 'h-[34px] px-[12px] text-[14px] rounded-[12px] gap-2.5' : 'size-[34px] p-0 rounded-[8px]',
    }[size]

    const iconSizeClasses = {
      sm: 'size-[16px] [&>svg]:size-[16px]',
      lg: 'size-[18px] [&>svg]:size-[18px]',
      xl: 'size-[20px] [&>svg]:size-[20px]',
    }[size]

    // Color Styles mapped to Figma tokens
    const statusStyles: Record<FigmaTagStatus, { normal: string; outline: string }> = {
      Default: {
        normal: 'bg-white text-[#1f2327] border border-[#d3d5d7] shadow-2xs',
        outline: 'bg-white border border-[#d3d5d7] text-[#1f2327]',
      },
      Primary: {
        normal: 'bg-[#00c2cb] text-white',
        outline: 'bg-[#00c2cb] border border-[#a3e0e3] text-white',
      },
      Active: {
        normal: 'bg-[#c7ecee] text-[#00a4ac] font-semibold',
        outline: 'bg-[#c7ecee] border border-[#00c2cb] text-[#00a4ac] font-semibold',
      },
      Error: {
        normal: 'bg-[#f3e1e0] text-[#d92d20] font-semibold',
        outline: 'bg-[#f3e1e0] border border-[#eaa5a0] text-[#d92d20] font-semibold',
      },
      Success: {
        normal: 'bg-[#dfefe8] text-[#17b26a] font-semibold',
        outline: 'bg-[#dfefe8] border border-[#bde0d1] text-[#17b26a] font-semibold',
      },
      information: {
        normal: 'bg-[#d6e4ff] text-[#2f54eb] font-semibold',
        outline: 'bg-[#d6e4ff] border border-[#adc8ff] text-[#2f54eb] font-semibold',
      },
      Warning: {
        normal: 'bg-[#fff4e5] text-[#b54708] font-semibold',
        outline: 'bg-[#fff4e5] border border-[#ffce80] text-[#b54708] font-semibold',
      },
      Disabled: {
        normal: 'bg-[#eff1f3] text-[#90969c]',
        outline: 'bg-[#eff1f3] border border-[#d3d5d7] text-[#90969c]',
      },
    }

    const currentStyle = type === 'Outline' ? statusStyles[status].outline : statusStyles[status].normal

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center select-none whitespace-nowrap transition-all font-sans',
          currentStyle,
          sizeClasses,
          onClick && 'cursor-pointer hover:opacity-90 active:scale-98',
          className
        )}
        {...props}
      >
        {/* Left Icon (18-20px) */}
        {showLeftIcon && leftIcon && (
          <span className={cn('inline-flex items-center justify-center shrink-0', iconSizeClasses)}>
            {leftIcon}
          </span>
        )}

        {/* Label */}
        {showLabel && content && (
          <span className="truncate leading-none">{content}</span>
        )}

        {/* Right Icon / Dismiss Trigger (18-20px) */}
        {showRightIcon && (rightIcon || onDismiss) && (
          <span
            onClick={(e) => {
              if (onDismiss) {
                e.stopPropagation()
                onDismiss()
              }
            }}
            className={cn(
              'inline-flex items-center justify-center shrink-0',
              iconSizeClasses,
              onDismiss && 'cursor-pointer hover:opacity-75'
            )}
          >
            {rightIcon || (
              <svg viewBox="0 0 16 16" fill="none" className="size-full stroke-current" strokeWidth="2">
                <path d="M4 12L12 4M4 4L12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        )}
      </div>
    )
  }
)

FigmaTag.displayName = 'FigmaTag'
