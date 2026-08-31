'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type TagVariant =
  | 'brand'
  | 'action'
  | 'success'
  | 'warning'
  | 'pending'
  | 'info'
  | 'information'
  | 'danger'
  | 'destructive'
  | 'suspended'
  | 'neutral'
  | 'secondary'

export type TagAppearance = 'main' | 'solid' | 'secondary' | 'soft' | 'transparent' | 'outline' | 'ghost'

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TagVariant
  appearance?: TagAppearance
  children?: React.ReactNode
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
  iconOnly?: boolean
  interactive?: boolean
}

export function Tag({
  variant = 'brand',
  appearance = 'secondary',
  children,
  icon,
  rightIcon,
  size = 'md',
  iconOnly = false,
  interactive = false,
  className,
  ...props
}: TagProps) {
  const norm = (variant || '').toLowerCase()
  const isSolid = appearance === 'main' || appearance === 'solid'
  const isTransparent = appearance === 'transparent' || appearance === 'outline' || appearance === 'ghost'

  // Style matrix: [Appearance x Variant]
  let styleClasses = ''

  if (isSolid) {
    // Main / Solid Fill (High Emphasis)
    if (norm === 'success' || norm === 'verified' || norm === 'active' || norm === 'approved' || norm === 'accepted') {
      styleClasses = 'bg-[#17B26A] text-white shadow-2xs font-medium'
    } else if (norm === 'warning' || norm === 'pending' || norm === 'in review' || norm === 'open') {
      styleClasses = 'bg-[#F79009] text-white shadow-2xs font-medium'
    } else if (norm === 'info' || norm === 'information') {
      styleClasses = 'bg-[#1A7FF0] text-white shadow-2xs font-medium'
    } else if (norm === 'danger' || norm === 'destructive' || norm === 'suspended' || norm === 'banned' || norm === 'revoked' || norm === 'declined' || norm === 'closed') {
      styleClasses = 'bg-[#F04438] text-white shadow-2xs font-medium'
    } else if (norm === 'neutral' || norm === 'secondary') {
      styleClasses = 'bg-[#344054] text-white shadow-2xs font-medium'
    } else {
      // brand / action / default
      styleClasses = 'bg-[#00C2CB] text-white shadow-2xs font-medium'
    }
  } else if (isTransparent) {
    // Transparent / Outline Style (Crisp 1px border, transparent bg)
    if (norm === 'success' || norm === 'verified' || norm === 'active' || norm === 'approved' || norm === 'accepted') {
      styleClasses = 'bg-transparent text-[#027A48] border border-[#17B26A]/40 hover:bg-[#ECFDF3]/60 font-medium'
    } else if (norm === 'warning' || norm === 'pending' || norm === 'in review' || norm === 'open') {
      styleClasses = 'bg-transparent text-[#B54708] border border-[#F79009]/40 hover:bg-[#FFFAEB]/60 font-medium'
    } else if (norm === 'info' || norm === 'information') {
      styleClasses = 'bg-transparent text-[#0B62CC] border border-[#1A7FF0]/40 hover:bg-[#F0F6FE]/60 font-medium'
    } else if (norm === 'danger' || norm === 'destructive' || norm === 'suspended' || norm === 'banned' || norm === 'revoked' || norm === 'declined' || norm === 'closed') {
      styleClasses = 'bg-transparent text-[#B42318] border border-[#F04438]/40 hover:bg-[#FEF3F2]/60 font-medium'
    } else if (norm === 'neutral' || norm === 'secondary') {
      styleClasses = 'bg-transparent text-[#344054] border border-[#D0D5DD] hover:bg-[#F2F4F7] font-medium'
    } else {
      // brand / action / default
      styleClasses = 'bg-transparent text-[#00A8B0] border border-[#00C2CB]/40 hover:bg-[#E5F6F7]/60 font-medium'
    }
  } else {
    // Secondary / Soft Tint (Subtle pastel tint - Standard UX Dashboard)
    if (norm === 'success' || norm === 'verified' || norm === 'active' || norm === 'approved' || norm === 'accepted') {
      styleClasses = 'bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]/50 font-medium'
    } else if (norm === 'warning' || norm === 'pending' || norm === 'in review' || norm === 'open') {
      styleClasses = 'bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]/60 font-medium'
    } else if (norm === 'info' || norm === 'information') {
      styleClasses = 'bg-[#F0F6FE] text-[#0B62CC] border border-[#BAdafB]/70 font-medium'
    } else if (norm === 'danger' || norm === 'destructive' || norm === 'suspended' || norm === 'banned' || norm === 'revoked' || norm === 'declined' || norm === 'closed') {
      styleClasses = 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]/60 font-medium'
    } else if (norm === 'neutral' || norm === 'secondary') {
      styleClasses = 'bg-[#F2F4F7] text-[#344054] border border-[#EAECF0] font-medium'
    } else {
      // brand / action / default
      styleClasses = 'bg-[#E5F6F7] text-[#00A8B0] border border-[#00C2CB]/25 font-medium'
    }
  }

  // Size classes
  let sizeClasses = 'px-2.5 py-0.5 text-[12px] leading-[16px] rounded-[8px]'
  if (size === 'xs') {
    sizeClasses = iconOnly ? 'size-5 p-0 rounded-[6px]' : 'px-1.5 py-0.2 text-[12px] leading-[16px] rounded-[6px]'
  } else if (size === 'sm') {
    sizeClasses = iconOnly ? 'size-6 p-0 rounded-[7px]' : 'px-2 py-0.5 text-[12px] leading-[16px] rounded-[7px]'
  } else if (size === 'md') {
    sizeClasses = iconOnly ? 'size-7 p-0 rounded-[8px]' : 'px-2.5 py-1 text-[12px] leading-[16px] rounded-[8px]'
  } else if (size === 'lg') {
    sizeClasses = iconOnly ? 'size-8.5 p-0 rounded-[10px]' : 'px-3 py-1.5 text-[14px] leading-[20px] rounded-[10px]'
  }

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 font-sans leading-none tracking-normal whitespace-nowrap select-none transition-all duration-150',
        interactive && 'cursor-pointer hover:opacity-90 active:scale-97',
        sizeClasses,
        styleClasses,
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center [&_svg]:size-3.5">{icon}</span>}
      {!iconOnly && children && <span>{children}</span>}
      {rightIcon && <span className="inline-flex shrink-0 items-center justify-center [&_svg]:size-3.5">{rightIcon}</span>}
    </div>
  )
}

// Helper for dynamic status values (Active, Verified, Pending, Suspended, etc.)
export function StatusTag({
  value,
  appearance = 'secondary',
  size = 'md',
  className,
  icon,
}: {
  value: string
  appearance?: TagAppearance
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  icon?: React.ReactNode
}) {
  const v = (value || '').toLowerCase().trim()
  let variant: TagVariant = 'neutral'

  if (v === 'active' || v === 'verified' || v === 'approved' || v === 'deal confirmed' || v === 'accepted') {
    variant = 'success'
  } else if (v === 'pending' || v === 'in review' || v === 'receiving offers' || v === 'open') {
    variant = 'warning'
  } else if (v === 'suspended' || v === 'banned' || v === 'revoked' || v === 'declined' || v === 'closed') {
    variant = 'danger'
  } else if (v.includes('pro') || v.includes('rera') || v.includes('matched')) {
    variant = 'brand'
  }

  return (
    <Tag variant={variant} appearance={appearance} size={size} icon={icon} className={className}>
      {value}
    </Tag>
  )
}
