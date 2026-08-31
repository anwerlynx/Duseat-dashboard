'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ==========================================
// 1. Plan Badge Icons (Figma Node 217:10008)
// ==========================================

export function ProBadgeIcon({ className = 'size-4 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          d="M0.8 2.6C0.8 1.6 1.6 0.8 2.6 0.8L13.3 0.8C14.3 0.8 15.1 1.6 15.1 2.6V8.7C15.1 12.3 11.8 15.2 8 15.2C4.2 15.2 0.8 12.3 0.8 8.7V2.6Z"
          fill="url(#pro_gradient)"
        />
        <path
          d="M2.6 0.8H13.3C14.3 0.8 15.1 1.6 15.1 2.6V8.7C15.1 12.3 11.8 15.2 8 15.2C4.2 15.2 0.8 12.3 0.8 8.7V2.6C0.8 1.6 1.6 0.8 2.6 0.8Z"
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="1.2"
        />
      </g>
      {/* Reflect light streak */}
      <path
        d="M12.8 0.8C13.5 1.1 14.3 1.8 14.3 2.6V4.5L3.3 15C2.3 14.5 1.5 13.8 0.8 12.7L12.8 0.8Z"
        fill="white"
        fillOpacity="0.35"
      />
      {/* Sparkle star */}
      <path
        d="M8 5.2L8.6 7.2L10.6 7.8L8.6 8.4L8 10.4L7.4 8.4L5.4 7.8L7.4 7.2L8 5.2Z"
        fill="white"
      />
      <defs>
        <linearGradient id="pro_gradient" x1="8" y1="16" x2="8" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01CCD2" />
          <stop offset="1" stopColor="#00898D" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function EliteBadgeIcon({ className = 'size-4 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.4 16.5C8.5 17 7.5 17 6.6 16.5L2.1 13.9C1.3 13.4 0.8 12.4 0.8 11.4V6.2C0.8 5.2 1.3 4.3 2.1 3.8L6.6 1.2C7.5 0.7 8.5 0.7 9.4 1.2L13.9 3.8C14.7 4.3 15.2 5.2 15.2 6.2V11.4C15.2 12.4 14.7 13.4 13.9 13.9L9.4 16.5Z"
        fill="url(#elite_gradient)"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1.1"
      />
      {/* Reflect light streak */}
      <path
        d="M13.2 2.2C13.8 2.6 14.4 3.3 14.4 4.1V5.5L3.5 16C2.5 15.4 1.7 14.7 1.1 13.7L13.2 2.2Z"
        fill="white"
        fillOpacity="0.3"
      />
      {/* Sparkle star */}
      <path
        d="M8 5.6L8.6 7.4L10.4 8L8.6 8.6L8 10.4L7.4 8.6L5.6 8L7.4 7.4L8 5.6Z"
        fill="white"
      />
      <defs>
        <linearGradient id="elite_gradient" x1="8" y1="0" x2="8" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06113E" />
          <stop offset="1" stopColor="#102DA4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PowerBadgeIcon({ className = 'size-4 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 5.8C0.7 3.5 0.5 2.3 0.9 1.6C1.2 0.9 1.8 0.4 2.5 0.3C3.2 0.1 4.3 0.5 6.3 1.4L6.8 1.6C7.3 1.8 7.6 1.9 7.9 2C8.1 2 8.4 2 8.6 2C8.9 1.9 9.2 1.8 9.7 1.6L10.2 1.4C12.3 0.5 13.3 0.1 14.1 0.3C14.7 0.4 15.3 0.9 15.6 1.6C16 2.3 15.8 3.5 15.5 5.8L15.1 9.1C15 9.7 14.9 10 14.8 10.3C14.7 10.6 14.6 10.8 14.4 11C14.2 11.2 14 11.4 13.5 11.8L10.6 14.1C9.8 14.8 9.4 15.1 8.9 15.2C8.5 15.3 8.1 15.3 7.7 15.2C7.2 15.1 6.8 14.8 6 14.1L3.1 11.8C2.6 11.4 2.4 11.2 2.2 11C2 10.8 1.9 10.6 1.8 10.3C1.7 10 1.6 9.7 1.5 9.1L1 5.8Z"
        fill="#970003"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Reflect light streak */}
      <path
        d="M13.5 1.5C14.1 2 14.7 2.8 14.7 3.6V5.2L4 15C3 14.4 2.2 13.7 1.5 12.6L13.5 1.5Z"
        fill="white"
        fillOpacity="0.32"
      />
      {/* Sparkle star */}
      <path
        d="M8.3 5.4L8.9 7.2L10.7 7.8L8.9 8.4L8.3 10.2L7.7 8.4L5.9 7.8L7.7 7.2L8.3 5.4Z"
        fill="white"
      />
    </svg>
  )
}

// ==========================================
// 2. Plan Badge Component (Figma Node 217:10008)
// ==========================================

export type PlanType = 'Pro' | 'Elite' | 'Power' | string

export function AgentPlanBadge({
  plan = 'Pro',
  className,
}: {
  plan?: PlanType
  className?: string
}) {
  const norm = (plan || '').toLowerCase()
  const isElite = norm.includes('elite')
  const isPower = norm.includes('power')
  const isPro = !isElite && !isPower

  if (isPower) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-[12px] bg-[#f3e1e0] px-3 py-1 font-sans text-[12px] leading-[16px] font-semibold text-[#d92d20] shadow-2xs select-none transition-transform hover:scale-102',
          className
        )}
      >
        <span>Power agent</span>
        <PowerBadgeIcon className="size-[16px]" />
      </div>
    )
  }

  if (isElite) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-[12px] bg-[#eaf2ff] px-3 py-1 font-sans text-[12px] leading-[16px] font-semibold text-[#3366ff] shadow-2xs select-none transition-transform hover:scale-102',
          className
        )}
      >
        <span>Elite agent</span>
        <EliteBadgeIcon className="size-[16px]" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[12px] bg-[#e5f6f7] px-3 py-1 font-sans text-[12px] leading-[16px] font-semibold text-[#00c2cb] shadow-2xs select-none transition-transform hover:scale-102',
        className
      )}
    >
      <span>Pro agent</span>
      <ProBadgeIcon className="size-[16px]" />
    </div>
  )
}

// ==========================================
// 3. Status Badges (Figma Node 234:7117)
// ==========================================

export function VerifiedStatusIcon({ className = 'size-[12px]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.83 0.05C6.09 0.05 6.34 0.16 6.51 0.35L7.12 1.01L7.99 0.74C8.23 0.66 8.5 0.69 8.73 0.82C8.95 0.95 9.11 1.17 9.16 1.42L9.36 2.3L10.25 2.5C10.5 2.56 10.71 2.72 10.84 2.94C10.97 3.16 11 3.43 10.92 3.68L10.65 4.54L11.32 5.15C11.51 5.33 11.62 5.58 11.62 5.83C11.62 6.09 11.51 6.34 11.32 6.51L10.65 7.12L10.92 7.99C11 8.23 10.97 8.5 10.84 8.73C10.71 8.95 10.5 9.11 10.25 9.16L9.36 9.36L9.16 10.25C9.11 10.5 8.95 10.71 8.73 10.84C8.5 10.97 8.23 11 7.99 10.92L7.12 10.65L6.51 11.32C6.34 11.51 6.09 11.62 5.83 11.62C5.58 11.62 5.33 11.51 5.15 11.32L4.54 10.65L3.68 10.92C3.43 11 3.16 10.97 2.94 10.84C2.72 10.71 2.56 10.5 2.5 10.25L2.3 9.36L1.42 9.16C1.17 9.11 0.95 8.95 0.82 8.73C0.69 8.5 0.66 8.23 0.74 7.99L1.01 7.12L0.35 6.51C0.16 6.34 0.05 6.09 0.05 5.83C0.05 5.58 0.16 5.33 0.35 5.15L1.01 4.54L0.74 3.68C0.66 3.43 0.69 3.16 0.82 2.94C0.95 2.72 1.17 2.56 1.42 2.5L2.3 2.3L2.5 1.42C2.56 1.17 2.72 0.95 2.94 0.82C3.16 0.69 3.43 0.66 3.68 0.74L4.54 1.01L5.15 0.35C5.33 0.16 5.58 0.05 5.83 0.05ZM7.6 4.55C7.43 4.38 7.15 4.38 6.98 4.55L5.35 6.19L4.68 5.52C4.51 5.35 4.24 5.35 4.07 5.52C3.89 5.69 3.89 5.97 4.07 6.14L5.04 7.11C5.21 7.29 5.49 7.29 5.66 7.11L7.6 5.17C7.77 5 7.77 4.72 7.6 4.55Z"
        fill="#17B26A"
      />
    </svg>
  )
}

export function PendingClockIcon({ className = 'size-[14px]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" stroke="#FDB022" strokeWidth="1.2" />
      <path d="M7 4V7.2L9 8.5" stroke="#FDB022" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function RejectedXIcon({ className = 'size-[14px]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="#D92D20" />
      <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function FigmaStatusBadge({
  status,
  className,
}: {
  status: 'Verified' | 'Pending' | 'Rejected' | 'Suspended' | 'Active' | string
  className?: string
}) {
  const norm = (status || '').toLowerCase()
  const isVerified = norm === 'verified' || norm === 'active' || norm === 'approved'
  const isPending = norm === 'pending' || norm === 'under review' || norm === 'in review'
  const isRejected = norm === 'rejected' || norm === 'suspended' || norm === 'banned' || norm === 'declined'

  if (isVerified) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-[12px] bg-[#dfefe8] px-3 py-1 font-sans text-[12px] leading-[16px] font-medium text-[#17b26a] select-none',
          className
        )}
      >
        <span>{status}</span>
        <VerifiedStatusIcon className="size-[12px]" />
      </div>
    )
  }

  if (isPending) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-[12px] bg-[#f6efe0] px-3 py-1 font-sans text-[12px] leading-[16px] font-medium text-[#fdb022] select-none',
          className
        )}
      >
        <span>{status}</span>
        <PendingClockIcon className="size-[14px]" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[12px] bg-[#f3e1e0] px-3 py-1 font-sans text-[12px] leading-[16px] font-medium text-[#d92d20] select-none',
        className
      )}
    >
      <span>{status}</span>
      <RejectedXIcon className="size-[14px]" />
    </div>
  )
}

// ==========================================
// 4. Rating Badge (Figma Node 234:7283)
// ==========================================

export function RateBadge({ rate = 4.9, className }: { rate?: number | string; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[12px] bg-[#f6efe0] px-2.5 py-0.5 font-sans text-[12px] leading-[16px] font-medium text-[#666666] select-none',
        className
      )}
    >
      <svg className="size-3.5 text-[#ff8a00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span>{rate}</span>
    </div>
  )
}

// ==========================================
// 5. Counter Badge (Figma Node 187:7901 - N)
// ==========================================

export function CounterBadge({
  count,
  variant = 'default',
  className,
}: {
  count: number | string
  variant?: 'default' | 'warning' | 'error' | string
  className?: string
}) {
  const norm = variant.toLowerCase()
  if (norm === 'warning') {
    return (
      <span
        className={cn(
          'inline-flex size-[20px] items-center justify-center rounded-full bg-[#fdb022] font-sans text-[12px] font-medium text-white shadow-2xs leading-none',
          className
        )}
      >
        {count}
      </span>
    )
  }

  if (norm === 'error' || norm === 'danger') {
    return (
      <span
        className={cn(
          'inline-flex size-[20px] items-center justify-center rounded-full bg-[#f3e1e0] font-sans text-[12px] font-medium text-[#d92d20] shadow-2xs leading-none',
          className
        )}
      >
        {count}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex size-[20px] items-center justify-center rounded-full bg-[#e5f6f7] font-sans text-[12px] font-medium text-[#00c2cb] shadow-2xs leading-none',
        className
      )}
    >
      {count}
    </span>
  )
}
