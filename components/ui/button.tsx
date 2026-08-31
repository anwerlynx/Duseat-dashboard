'use client'

import * as React from 'react'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-sans font-medium whitespace-nowrap transition-all duration-150 outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 ant-wave-btn cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Main / Primary Action Button (Brand Turquoise - #00C2CB)
        main: 'bg-[#00C2CB] text-white hover:bg-[#00adb5] active:bg-[#00989f] shadow-[0_1px_3px_rgba(0,194,203,0.3)] hover:shadow-[0_4px_12px_rgba(0,194,203,0.35)] border border-transparent font-semibold',
        primary: 'bg-[#00C2CB] text-white hover:bg-[#00adb5] active:bg-[#00989f] shadow-[0_1px_3px_rgba(0,194,203,0.3)] hover:shadow-[0_4px_12px_rgba(0,194,203,0.35)] border border-transparent font-semibold',
        brand: 'bg-[#00C2CB] text-white hover:bg-[#00adb5] active:bg-[#00989f] shadow-[0_1px_3px_rgba(0,194,203,0.3)] hover:shadow-[0_4px_12px_rgba(0,194,203,0.35)] border border-transparent font-semibold',
        default: 'bg-[#00C2CB] text-white hover:bg-[#00adb5] active:bg-[#00989f] shadow-[0_1px_3px_rgba(0,194,203,0.3)] hover:shadow-[0_4px_12px_rgba(0,194,203,0.35)] border border-transparent font-semibold',

        // Secondary Soft Neutral (Clean Light Gray)
        secondary: 'bg-[#F2F4F7] text-[#344054] hover:bg-[#E4E7EC] hover:text-[#1D2939] active:bg-[#D0D5DD] border border-[#E4E7EC]/80 dark:bg-muted dark:text-foreground',
        
        // Secondary Brand (Soft Turquoise Surface)
        'secondary-brand': 'bg-[#E5F6F7] text-[#00A8B0] hover:bg-[#D0F0F2] hover:text-[#008f96] active:bg-[#BBE9EC] border border-[#00C2CB]/25 font-semibold',
        subtle: 'bg-[#E5F6F7] text-[#00A8B0] hover:bg-[#D0F0F2] hover:text-[#008f96] active:bg-[#BBE9EC] border border-[#00C2CB]/25 font-semibold',

        // Transparent / Ghost (Borderless Minimal Action)
        transparent: 'bg-transparent text-[#475467] hover:bg-[#F2F4F7] hover:text-[#1D2939] active:bg-[#E4E7EC] border border-transparent dark:text-foreground dark:hover:bg-muted/60',
        ghost: 'bg-transparent text-[#475467] hover:bg-[#F2F4F7] hover:text-[#1D2939] active:bg-[#E4E7EC] border border-transparent dark:text-foreground dark:hover:bg-muted/60',

        // Outline (Crisp Clean Border)
        outline: 'border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB] hover:border-[#98A2B3] hover:text-[#1D2939] active:bg-[#F2F4F7] shadow-2xs dark:border-border dark:bg-transparent dark:text-foreground dark:hover:bg-muted/40',
        'outline-brand': 'border border-[#00C2CB] bg-transparent text-[#00A8B0] hover:bg-[#E5F6F7] active:bg-[#D0F0F2] font-semibold',

        // Dark / High Contrast Neutral Solid
        dark: 'bg-[#1D2939] text-white hover:bg-[#101828] active:bg-[#0C111D] shadow-xs border border-transparent',

        // Destructive / Danger
        destructive: 'bg-[#F04438] text-white hover:bg-[#D92D20] active:bg-[#B42318] shadow-xs border border-transparent font-semibold',
        danger: 'bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2] active:bg-[#FECDCA] border border-[#FECDCA]/80 font-semibold',

        // Success
        success: 'bg-[#17B26A] text-white hover:bg-[#039855] active:bg-[#027A48] shadow-xs border border-transparent font-semibold',
        'success-soft': 'bg-[#ECFDF3] text-[#027A48] hover:bg-[#D1FADF] active:bg-[#A6F4C5] border border-[#A6F4C5]/80 font-semibold',

        // Link
        link: 'text-[#00C2CB] hover:text-[#008f96] underline-offset-4 hover:underline bg-transparent border-transparent p-0 h-auto font-medium',
      },
      size: {
        xs: 'h-6 gap-1 rounded-[7px] px-2 text-xs [&_svg:not([class*="size-"])]:size-3',
        sm: 'h-7.5 gap-1.5 rounded-[8px] px-2.5 text-xs font-medium [&_svg:not([class*="size-"])]:size-3.5',
        default: 'h-9 gap-2 rounded-[10px] px-3.5 text-sm font-medium [&_svg:not([class*="size-"])]:size-4',
        md: 'h-9 gap-2 rounded-[10px] px-3.5 text-sm font-medium [&_svg:not([class*="size-"])]:size-4',
        lg: 'h-10.5 gap-2 rounded-[12px] px-4.5 text-sm font-semibold [&_svg:not([class*="size-"])]:size-4.5',
        xl: 'h-12 gap-2.5 rounded-[12px] px-5.5 text-base font-semibold [&_svg:not([class*="size-"])]:size-5',

        // Icon Only Sizes
        'icon-xs': 'size-6 rounded-[7px] p-0 [&_svg:not([class*="size-"])]:size-3',
        'icon-sm': 'size-7.5 rounded-[8px] p-0 [&_svg:not([class*="size-"])]:size-3.5',
        icon: 'size-9 rounded-[10px] p-0 [&_svg:not([class*="size-"])]:size-4',
        'icon-lg': 'size-10.5 rounded-[12px] p-0 [&_svg:not([class*="size-"])]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconOnly?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    let computedSize = size
    if (iconOnly) {
      if (size === 'xs') computedSize = 'icon-xs'
      else if (size === 'sm') computedSize = 'icon-sm'
      else if (size === 'lg' || size === 'xl') computedSize = 'icon-lg'
      else computedSize = 'icon'
    }

    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size: computedSize, className }))}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin text-current" />
            {!iconOnly && children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 items-center justify-center">{leftIcon}</span>}
            {!iconOnly && children && <span>{children}</span>}
            {iconOnly && children}
            {rightIcon && <span className="inline-flex shrink-0 items-center justify-center">{rightIcon}</span>}
          </>
        )}
      </ButtonPrimitive>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
