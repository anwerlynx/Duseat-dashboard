'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Flag, getCountryCode } from './flag'

export type TableAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TableAvatarVariant = 'default' | 'brand' | 'subtle' | 'gradient'
export type TableAvatarShape = 'circle' | 'rounded'

export interface TableAvatarProps {
  src?: string | null
  name?: string | null
  alt?: string
  size?: TableAvatarSize
  variant?: TableAvatarVariant
  shape?: TableAvatarShape
  countryCode?: string | null
  country?: string | null
  status?: 'online' | 'offline' | 'busy' | 'away' | null
  verified?: boolean
  className?: string
  imageClassName?: string
  fallbackClassName?: string
  onClick?: () => void
}

const sizeConfig: Record<
  TableAvatarSize,
  {
    container: string
    text: string
    flagSize: 's' | 'm'
    flagOffset: string
    statusSize: string
    statusOffset: string
    iconSize: string
  }
> = {
  xs: {
    container: 'size-6',
    text: 'text-[10px]',
    flagSize: 's',
    flagOffset: '-bottom-0.5 -right-0.5 scale-75 origin-bottom-right',
    statusSize: 'size-1.5',
    statusOffset: '-bottom-0.5 -right-0.5',
    iconSize: 'size-2.5',
  },
  sm: {
    container: 'size-7',
    text: 'text-[11px]',
    flagSize: 's',
    flagOffset: '-bottom-0.5 -right-0.5 scale-90 origin-bottom-right',
    statusSize: 'size-2',
    statusOffset: '-bottom-0.5 -right-0.5',
    iconSize: 'size-3',
  },
  md: {
    container: 'size-8 sm:size-8.5',
    text: 'text-[12px]',
    flagSize: 's',
    flagOffset: '-bottom-1 -right-1',
    statusSize: 'size-2.5',
    statusOffset: '-bottom-0.5 -right-0.5',
    iconSize: 'size-3.5',
  },
  lg: {
    container: 'size-9 sm:size-10',
    text: 'text-[13px]',
    flagSize: 's',
    flagOffset: '-bottom-1 -right-1',
    statusSize: 'size-2.5',
    statusOffset: 'bottom-0 right-0',
    iconSize: 'size-4',
  },
  xl: {
    container: 'size-10 sm:size-11',
    text: 'text-[14px]',
    flagSize: 'm',
    flagOffset: '-bottom-1 -right-1',
    statusSize: 'size-3',
    statusOffset: 'bottom-0 right-0',
    iconSize: 'size-4.5',
  },
}

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Standardized Responsive Table Avatar Component
 * Ensures pixel-perfect sizing, zero image distortion, fallback initials,
 * country flag integration, and status indicators across all dashboard tables.
 */
export function TableAvatar({
  src,
  name,
  alt,
  size = 'md',
  variant = 'brand',
  shape = 'circle',
  countryCode,
  country,
  status,
  verified,
  className,
  imageClassName,
  fallbackClassName,
  onClick,
}: TableAvatarProps) {
  const [imgError, setImgError] = React.useState(false)
  const resolvedCountry = countryCode || (country ? getCountryCode(country) : null)
  const cfg = sizeConfig[size]
  const initials = getInitials(name)

  // Reset error state if src changes
  React.useEffect(() => {
    setImgError(false)
  }, [src])

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-[8px]'

  const variantStyles = {
    brand: 'bg-gradient-to-br from-[#00c2cb] to-[#0a8288] text-white font-bold',
    default: 'bg-[#eff1f3] text-[#1f2327] font-bold border border-[#d3d5d7]',
    subtle: 'bg-[#e5f6f7] text-[#00848b] font-bold border border-[#00c2cb]/30',
    gradient: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold',
  }

  const avatarElement = (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex shrink-0 aspect-square select-none items-center justify-center overflow-hidden border border-[#d3d5d7] shadow-2xs transition-all',
        cfg.container,
        shapeClasses,
        onClick && 'cursor-pointer hover:ring-2 hover:ring-[#00c2cb]/60 hover:opacity-95',
        className
      )}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          onError={() => setImgError(true)}
          loading="lazy"
          className={cn('size-full object-cover shrink-0', imageClassName)}
        />
      ) : (
        <div
          className={cn(
            'flex size-full items-center justify-center shrink-0 leading-none tracking-wider',
            variantStyles[variant],
            cfg.text,
            fallbackClassName
          )}
        >
          {initials}
        </div>
      )}
    </div>
  )

  // If no flag, status, or verification badge, return pure avatar
  if (!resolvedCountry && !status && !verified) {
    return avatarElement
  }

  return (
    <div className="relative inline-flex shrink-0">
      {avatarElement}

      {/* Country Flag Overlay */}
      {resolvedCountry && (
        <div className={cn('absolute z-10 pointer-events-none drop-shadow-xs', cfg.flagOffset)}>
          <Flag
            code={resolvedCountry}
            size={cfg.flagSize}
            className="ring-2 ring-white rounded-[2px]"
          />
        </div>
      )}

      {/* Status Dot (when flag is not present) */}
      {!resolvedCountry && status && (
        <span
          className={cn(
            'absolute z-10 rounded-full ring-2 ring-white',
            cfg.statusSize,
            cfg.statusOffset,
            status === 'online' && 'bg-[#17b26a]',
            status === 'busy' && 'bg-[#f04438]',
            status === 'away' && 'bg-[#f79009]',
            status === 'offline' && 'bg-[#6f777f]'
          )}
        />
      )}
    </div>
  )
}

/**
 * Dual Participant Table Avatar Component
 * Displays primary and secondary user avatars overlapping cleanly for
 * conversations, deals, negotiations, and moderation reports.
 */
export function DualTableAvatar({
  primary,
  secondary,
  size = 'md',
  className,
}: {
  primary: {
    src?: string | null
    name?: string | null
    countryCode?: string | null
    country?: string | null
  }
  secondary: {
    src?: string | null
    name?: string | null
    countryCode?: string | null
    country?: string | null
  }
  size?: TableAvatarSize
  className?: string
}) {
  return (
    <div className={cn('relative inline-flex items-center shrink-0', className)}>
      <TableAvatar
        src={primary.src}
        name={primary.name}
        countryCode={primary.countryCode}
        country={primary.country}
        size={size}
        variant="brand"
        className="z-10 ring-2 ring-white"
      />
      <div className="-ml-3 z-0">
        <TableAvatar
          src={secondary.src}
          name={secondary.name}
          countryCode={secondary.countryCode}
          country={secondary.country}
          size={size}
          variant="default"
          className="ring-2 ring-white opacity-90"
        />
      </div>
    </div>
  )
}
