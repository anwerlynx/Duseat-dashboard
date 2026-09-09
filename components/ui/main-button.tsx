'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MainButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'Primary' | 'Secondary' | 'Text'
  size?: 'sm' | 'md' | 'lg' | 'xlg'
  status?: 'Normal' | 'Hover' | 'Disable'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  iconOnly?: boolean
  loading?: boolean
  label?: string
  children?: React.ReactNode
}

/**
 * MainButton Component
 * Extracted from Figma: @https://www.figma.com/design/sNuyvH8pS0stcQ2jU3DUtW/Components?node-id=1160-319&m=dev
 * 
 * Variants:
 * - variant: Primary (solid #00c2cb), Secondary (outline #00c2cb), Text (ghost)
 * - size: sm (36px), md (44px), lg (48px), xlg (56px)
 * - status: Normal, Hover, Disable
 * - iconOnly: square aspect ratio for icon-only action triggers
 */
export const MainButton = React.forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      className,
      variant = 'Primary',
      size = 'sm',
      status = 'Normal',
      iconLeft,
      iconRight,
      iconOnly = false,
      loading = false,
      label,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || status === 'Disable' || loading
    const content = children || label

    // Base Size Classes
    const sizeClasses = {
      sm: iconOnly ? 'size-[36px] p-0' : 'h-[36px] px-[12px] py-[8px] text-[14px]',
      md: iconOnly ? 'size-[44px] p-0' : 'h-[44px] px-[12px] py-[8px] text-[15px] sm:text-[16px]',
      lg: iconOnly ? 'size-[48px] p-0' : 'h-[48px] px-[14px] py-[8px] text-[16px]',
      xlg: iconOnly ? 'size-[56px] p-0' : 'h-[56px] px-[16px] py-[8px] text-[16px] sm:text-[17px]',
    }

    // Icon Size scale calibrated to 18-20px
    const iconSizeClasses = {
      sm: 'size-[18px]',
      md: 'size-[20px]',
      lg: 'size-[20px]',
      xlg: 'size-[22px]',
    }

    // Variant Style Classes matching Figma node 1160:319 tokens
    const variantClasses = {
      Primary: cn(
        'bg-[#00c2cb] text-white font-medium border border-transparent shadow-2xs ant-wave-btn',
        'hover:bg-[#007a80] hover:text-white active:bg-[#004f55]',
        'disabled:bg-[#d3d5d7] disabled:text-[#90969c] disabled:border-transparent disabled:cursor-not-allowed disabled:shadow-none'
      ),
      Secondary: cn(
        'border border-[#00c2cb] bg-transparent text-[#00c2cb] font-medium shadow-2xs ant-wave-btn',
        'hover:border-[#3cc4cb] hover:bg-[#e5f6f7] hover:text-[#007a80] active:bg-[#c7ecee]',
        'disabled:border-[#d3d5d7] disabled:text-[#90969c] disabled:bg-transparent disabled:cursor-not-allowed disabled:shadow-none'
      ),
      Text: cn(
        'bg-transparent text-[#00c2cb] font-medium border border-transparent',
        'hover:bg-[#e5f6f7] hover:text-[#007a80] active:bg-[#c7ecee]',
        'disabled:text-[#90969c] disabled:bg-transparent disabled:cursor-not-allowed'
      ),
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center gap-[6px] rounded-[12px] font-sans transition-all duration-200 cursor-pointer select-none leading-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#00c2cb]/40',
          sizeClasses[size],
          variantClasses[variant],
          status === 'Hover' && variant === 'Primary' && 'bg-[#007a80] text-white',
          status === 'Hover' && variant === 'Secondary' && 'border-[#3cc4cb] bg-[#e5f6f7] text-[#007a80]',
          status === 'Hover' && variant === 'Text' && 'bg-[#e5f6f7] text-[#007a80]',
          status === 'Disable' && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className={cn('animate-spin shrink-0', iconSizeClasses[size])} />
        )}

        {!loading && iconLeft && (
          <span className={cn('inline-flex items-center justify-center shrink-0 [&>svg]:size-full', iconSizeClasses[size])}>
            {iconLeft}
          </span>
        )}

        {!iconOnly && content && (
          <span className="truncate">{content}</span>
        )}

        {!loading && iconRight && (
          <span className={cn('inline-flex items-center justify-center shrink-0 [&>svg]:size-full', iconSizeClasses[size])}>
            {iconRight}
          </span>
        )}
      </button>
    )
  }
)

MainButton.displayName = 'MainButton'
