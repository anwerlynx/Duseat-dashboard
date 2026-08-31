'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
}

// ============================================================================
// Official TDesign Icons Suite (https://tdesign.tencent.com/icons)
// ============================================================================

export function TLayoutGrid({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TUsers({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5c0-2.3 2-3.8 4.2-3.8s4.2 1.5 4.2 3.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10.5 3.5a2.2 2.2 0 0 1 0 4.2M13.5 13.5c0-1.8-1.3-3.1-3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TUser({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="8" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 14c0-2.8 2.2-4.5 4.5-4.5s4.5 1.7 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TUserCheck({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5c0-2.5 2-4 4.5-4 1.2 0 2.2.4 3 1.1M10.5 11l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TUserBlock({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5c0-2.5 2-4 4.5-4 .8 0 1.5.2 2.1.6M10.5 12.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM11.2 11.2l3.6 3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TShieldCheck({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M8 1.8 2.8 4.2v4.5c0 3.5 2.3 6.4 5.2 7.1 2.9-.7 5.2-3.6 5.2-7.1V4.2L8 1.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m5.8 8 1.6 1.6 3.4-3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TFileText({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M3.5 2.5h6l3.5 3.5v7.5a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5v3.5h3.5M6 8h4M6 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TScrollText({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M12.5 13.5h-9a1.5 1.5 0 0 1 0-3h8a1.5 1.5 0 0 0 1.5-1.5V3a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1v7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5.5h4M6 8h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function THandshake({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="m2 7 3.5-3.5a1.5 1.5 0 0 1 2.1 0L9 5M14 7l-3.5-3.5a1.5 1.5 0 0 0-2.1 0L7 5M2 7l4 4a1.5 1.5 0 0 0 2.1 0l4-4M5.5 10.5 8 13l3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TChat({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M2.5 4.5A2 2 0 0 1 4.5 2.5h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4.8L4 13.5v-2h-.5a2 2 0 0 1-2-2v-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TSend({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M14 2 7 9M14 2 9.5 14l-2.5-5.5L1.5 6 14 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TEye({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TBell({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5c0 3-1.5 4-1.5 4h12s-1.5-1-1.5-4A4.5 4.5 0 0 0 8 2ZM6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TWallet({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 7.5h3v2h-3a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12.5" cy="8.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function TMoney({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TAnalytics({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M2.5 13.5h11M4.5 10.5V13M8 6.5V13M11.5 3.5V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TMegaphone({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="m2 5.5 8-2.5v6.5l-8-2.5v-1.5ZM10 4.5a3 3 0 0 1 0 4.5M4 8v3.5a1 1 0 0 0 1 1h.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TTools({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3v10M2.5 7.5h11" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TSetting({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 1.8v1.4M8 12.8v1.4M1.8 8h1.4M12.8 8h1.4M3.6 3.6l1 1M11.4 11.4l1 1M3.6 12.4l1-1M11.4 4.6l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TLifebuoy({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="8" cy="8" r="5.8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m3.9 3.9 1.8 1.8M10.3 10.3l1.8 1.8M3.9 12.1l1.8-1.8M10.3 5.7l1.8-1.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TActivity({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M2 8h2.8l2-4.5 2.5 9 1.8-4.5H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TRobot({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="3" y="4.5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6" cy="8" r="1" fill="currentColor" />
      <circle cx="10" cy="8" r="1" fill="currentColor" />
      <path d="M8 2.2v2.3M1.5 8.5h1.5M13 8.5h1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TBriefcase({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2.5" y="4.5" width="11" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 4.5V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5M2.5 8h11M7.2 8v1.5h1.6V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TFlag({ size = 18, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M3.5 14V2.5l8 3-8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function THome({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M2.5 6.5 8 2l5.5 4.5V13a1 1 0 0 1-1 1h-3v-3.5h-3V14h-3a1 1 0 0 1-1-1V6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TCompass({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <polygon points="10,6 6.8,7.3 6,10 9.2,8.7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function TSearch({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TFilter({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M2.5 3.5h11l-4.5 5.5v4l-2-1.2v-2.8L2.5 3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TCheckCircleFilled({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z" fill="currentColor" />
      <path d="m5.5 8 2 2 4-4" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TCheckCircle({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="m5.5 8 2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TClock({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.8v3.5l2.2 1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TLocation({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M8 14.5s-4.5-4.8-4.5-8a4.5 4.5 0 0 1 9 0c0 3.2-4.5 8-4.5 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TBuilding({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="3" y="2.5" width="10" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5h1M9.5 5h1M5.5 7.5h1M9.5 7.5h1M7 13.5v-2.5h2v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TMail({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m3 4.5 5 4 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TLock({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="3" y="6.5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TDownload({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M8 2.5v7.5M5.5 7.5 8 10l2.5-2.5M2.5 13.5h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TMore({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="4" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="8" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function TChevronDown({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="m4.5 6.5 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TChevronRight({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="m6.5 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TArrowLeft({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M13 8H3M6.5 4.5 3 8l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TTrash({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M3 4.5h10M6.5 2.5h3M5 4.5v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8M6.5 7.5v3.5M9.5 7.5v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TEdit({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M3 13.5h10M10.5 3l2.5 2.5-6.5 6.5H4v-2.5L10.5 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TKey({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <circle cx="5.5" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8.5 8H13.5v2.5M11.5 8v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function TLogin({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M6.5 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3.5M10 5.5l2.5 2.5L10 10.5M5.5 8h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TLogout({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="M6.5 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3.5M12.5 8H5.5M10 5.5 12.5 8 10 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TClose({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TCalendar({ size = 16, className, ...props }: TIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)} {...props}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 2v2.5M10.5 2v2.5M2.5 6.5h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
