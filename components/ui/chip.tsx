'use client'

import * as React from 'react'
import { X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ChipVariant =
  | 'brand'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export type ChipAppearance = 'main' | 'solid' | 'secondary' | 'soft' | 'transparent' | 'outline' | 'ghost'

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant
  appearance?: ChipAppearance
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  avatar?: React.ReactNode
  iconOnly?: boolean
  selected?: boolean
  disabled?: boolean
  removable?: boolean
  onRemove?: (e: React.MouseEvent) => void
  onSelect?: () => void
}

export function Chip({
  variant = 'brand',
  appearance = 'secondary',
  size = 'md',
  icon,
  avatar,
  iconOnly = false,
  selected = false,
  disabled = false,
  removable = false,
  onRemove,
  onSelect,
  children,
  className,
  ...props
}: ChipProps) {
  const norm = (variant || '').toLowerCase()
  const isSolid = appearance === 'main' || appearance === 'solid'
  const isTransparent = appearance === 'transparent' || appearance === 'outline' || appearance === 'ghost'

  // Style matrix
  let styleClasses = ''

  if (selected) {
    // When selected: vibrant Brand Primary
    styleClasses = 'bg-[#00C2CB] text-white shadow-xs border border-transparent font-medium'
  } else if (isSolid) {
    if (norm === 'success') {
      styleClasses = 'bg-[#17B26A] text-white hover:bg-[#16a360] font-medium'
    } else if (norm === 'warning') {
      styleClasses = 'bg-[#F79009] text-white hover:bg-[#dc7f06] font-medium'
    } else if (norm === 'info') {
      styleClasses = 'bg-[#1A7FF0] text-white hover:bg-[#0b62cc] font-medium'
    } else if (norm === 'danger') {
      styleClasses = 'bg-[#F04438] text-white hover:bg-[#d9382d] font-medium'
    } else if (norm === 'neutral') {
      styleClasses = 'bg-[#344054] text-white hover:bg-[#1D2939] font-medium'
    } else {
      styleClasses = 'bg-[#00C2CB] text-white hover:bg-[#00adb5] font-medium'
    }
  } else if (isTransparent) {
    if (norm === 'success') {
      styleClasses = 'bg-transparent text-[#027A48] border border-[#17B26A]/40 hover:bg-[#ECFDF3]/60 font-medium'
    } else if (norm === 'warning') {
      styleClasses = 'bg-transparent text-[#B54708] border border-[#F79009]/40 hover:bg-[#FFFAEB]/60 font-medium'
    } else if (norm === 'info') {
      styleClasses = 'bg-transparent text-[#0B62CC] border border-[#1A7FF0]/40 hover:bg-[#F0F6FE]/60 font-medium'
    } else if (norm === 'danger') {
      styleClasses = 'bg-transparent text-[#B42318] border border-[#F04438]/40 hover:bg-[#FEF3F2]/60 font-medium'
    } else if (norm === 'neutral') {
      styleClasses = 'bg-transparent text-[#344054] border border-[#D0D5DD] hover:bg-[#F2F4F7] font-medium'
    } else {
      styleClasses = 'bg-transparent text-[#00A8B0] border border-[#00C2CB]/40 hover:bg-[#E5F6F7]/60 font-medium'
    }
  } else {
    // Secondary / Soft Tint (Modern Table / Filter UI default)
    if (norm === 'success') {
      styleClasses = 'bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]/60 hover:bg-[#d1fadf] font-medium'
    } else if (norm === 'warning') {
      styleClasses = 'bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]/70 hover:bg-[#fef0c7] font-medium'
    } else if (norm === 'info') {
      styleClasses = 'bg-[#F0F6FE] text-[#0B62CC] border border-[#BAdafB]/70 hover:bg-[#e0edfd] font-medium'
    } else if (norm === 'danger') {
      styleClasses = 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]/70 hover:bg-[#fee4e2] font-medium'
    } else if (norm === 'neutral') {
      styleClasses = 'bg-[#F2F4F7] text-[#344054] border border-[#EAECF0] hover:bg-[#E4E7EC] font-medium'
    } else {
      styleClasses = 'bg-[#E5F6F7] text-[#00A8B0] border border-[#00C2CB]/25 hover:bg-[#d0f0f2] font-medium'
    }
  }

  // Size classes
  let sizeClasses = 'h-7.5 px-3 text-[12px] leading-[16px] rounded-full gap-1.5 font-medium'
  let removeBtnSize = 'size-3.5'
  let iconSize = 'size-3.5'

  if (size === 'sm') {
    sizeClasses = iconOnly ? 'size-6 p-0 rounded-full' : 'h-6 px-2 text-[12px] leading-[16px] rounded-full gap-1 font-medium'
    removeBtnSize = 'size-3'
    iconSize = 'size-3'
  } else if (size === 'lg') {
    sizeClasses = iconOnly ? 'size-9.5 p-0 rounded-full' : 'h-9 px-4 text-[14px] leading-[20px] rounded-full gap-2 font-medium'
    removeBtnSize = 'size-4'
    iconSize = 'size-4'
  } else if (iconOnly) {
    sizeClasses = 'size-7.5 p-0 rounded-full'
  }

  const isClickable = !disabled && (Boolean(onSelect) || props.onClick !== undefined)

  return (
    <div
      role={onSelect ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={(e) => {
        if (disabled) return
        if (onSelect) onSelect()
        if (props.onClick) props.onClick(e)
      }}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (onSelect) onSelect()
        }
      }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-sans select-none transition-all duration-150 leading-none',
        isClickable && 'cursor-pointer active:scale-96',
        disabled && 'opacity-50 pointer-events-none',
        sizeClasses,
        styleClasses,
        className
      )}
      {...props}
    >
      {/* Leading Check for selected or avatar/icon */}
      {selected ? (
        <Check className={cn('shrink-0 stroke-[2.5]', iconSize)} />
      ) : avatar ? (
        <span className="shrink-0 overflow-hidden rounded-full">{avatar}</span>
      ) : icon ? (
        <span className={cn('inline-flex shrink-0 items-center justify-center [&_svg]:size-full', iconSize)}>
          {icon}
        </span>
      ) : null}

      {/* Chip Label */}
      {!iconOnly && children && <span className="truncate">{children}</span>}

      {/* Remove (X) Button */}
      {removable && !disabled && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Remove chip"
          onClick={(e) => {
            e.stopPropagation()
            if (onRemove) onRemove(e)
          }}
          className={cn(
            'inline-flex items-center justify-center rounded-full p-0.5 opacity-70 hover:opacity-100 hover:bg-black/10 active:bg-black/20 transition-all cursor-pointer -mr-1',
            removeBtnSize
          )}
        >
          <X className="size-full stroke-[2.5]" />
        </button>
      )}
    </div>
  )
}

export interface ChipGroupProps {
  children: React.ReactNode
  className?: string
}

export function ChipGroup({ children, className }: ChipGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
    </div>
  )
}
