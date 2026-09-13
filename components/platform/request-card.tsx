'use client'

import * as React from 'react'
import {
  Clock,
  MessageSquare,
  FileText,
} from 'lucide-react'
import type { PropertyRequest } from '@/lib/platform-users'
import { cn } from '@/lib/utils'

interface RequestCardProps {
  request: PropertyRequest
  onViewDetails: () => void
  className?: string
}

// Scalloped / Starburst verified badge matching Figma Node 2078:23479 exactly
export function FigmaVerifiedCheckBadge({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('size-4 shrink-0', className)} aria-label="Verified Investor">
      <path
        d="M10.29 2.3a2 2 0 0 1 3.42 0l.9 1.54a2 2 0 0 0 1.83 1.05h1.78a2 2 0 0 1 2 2v1.78a2 2 0 0 0 1.05 1.83l1.54.9a2 2 0 0 1 0 3.42l-1.54.9a2 2 0 0 0-1.05 1.83v1.78a2 2 0 0 1-2 2h-1.78a2 2 0 0 0-1.83 1.05l-.9 1.54a2 2 0 0 1-3.42 0l-.9-1.54a2 2 0 0 0-1.83-1.05H7.21a2 2 0 0 1-2-2v-1.78a2 2 0 0 0-1.05-1.83l-1.54-.9a2 2 0 0 1 0-3.42l1.54-.9A2 2 0 0 0 4.71 8.7V6.92a2 2 0 0 1 2-2h1.78a2 2 0 0 0 1.83-1.05l.9-1.54Z"
        fill="#00C2CB"
      />
      <path
        d="m8.5 12 2.2 2.2 4.8-4.8"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

import { Flag, getCountryCode } from '@/components/ui/flag'

// Country flag mini pill on top-left of avatar matching modern vector flag standard
function MiniFlagBadge({ flag }: { flag?: string }) {
  const code = getCountryCode(flag || 'AE')
  return (
    <div className="absolute -top-1 -left-1.5 z-10 overflow-hidden rounded-[3px] shadow-xs ring-1 ring-white bg-white">
      <Flag code={code} size="s" className="border-0 shadow-none !rounded-[2px]" />
    </div>
  )
}

export function RequestCard({ request, onViewDetails, className }: RequestCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E5E7EB] rounded-[18px] sm:rounded-[24px] p-3 sm:p-5 lg:p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-3.5 sm:gap-4 font-sans text-left transition-all duration-200 hover:border-[#00C2CB] hover:shadow-md w-full min-w-0 max-w-full box-border',
        className
      )}
    >
      <div className="flex flex-col gap-3.5 w-full min-w-0">
        {/* Top Row: User Avatar with Flag, Name + Verification, Online Status & Time */}
        <div className="flex w-full items-start justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            {/* Avatar with Flag */}
            <div className="relative shrink-0">
              <MiniFlagBadge flag={request.countryFlag} />
              <div className="size-[38px] sm:size-[44px] rounded-full overflow-hidden border border-[#E5E7EB] bg-[#F3F4F6] flex items-center justify-center">
                <img
                  src={
                    request.investorAvatar ||
                    (request.investorName.includes('Ahmed') || request.investorName.includes('Mansoor')
                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                      : request.investorName.includes('Anwar')
                      ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80')
                  }
                  alt={request.investorName}
                  className="size-full object-cover object-center"
                />
              </div>
            </div>

            {/* Name + Verified Badge & Online Status */}
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[14px] sm:text-[16px] font-bold text-[#111827] break-words leading-tight">
                  {request.investorName}
                </span>
                <FigmaVerifiedCheckBadge className="size-3.5 sm:size-4 shrink-0" />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#8A939D] leading-none">
                <span className="size-1.5 sm:size-2 rounded-full bg-[#10B981] shrink-0" />
                <span className="break-words">{request.onlineStatus || 'Online (Avg 10m)'}</span>
              </div>
            </div>
          </div>

          {/* Time Ago (Top Right) */}
          <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-[#9CA3AF] shrink-0 font-medium pt-0.5 whitespace-nowrap">
            <Clock className="size-3 sm:size-3.5 text-[#9CA3AF] shrink-0" />
            <span>{request.timeAgo || '4 min ago'}</span>
          </div>
        </div>

        {/* Description / Requirement Text */}
        <p className="text-[13.5px] sm:text-[15px] leading-[20px] sm:leading-[22px] font-medium text-[#111827] break-words min-w-0">
          {request.title}
        </p>

        {/* Note Row */}
        <div className="flex items-start gap-1.5 text-[11.5px] sm:text-[12.5px] leading-[17px] sm:leading-[18px] min-w-0 w-full">
          <div className="flex items-center gap-1 shrink-0 text-[#9CA3AF] pt-0.5">
            <FileText className="size-3 sm:size-3.5 text-[#9CA3AF]" />
            <span className="font-medium text-[#8A939D]">Note:</span>
          </div>
          <p className="text-[#6B7280] flex-1 min-w-0 break-words">
            {request.note || 'Family-friendly community with schools and parks nearby.'}
          </p>
        </div>

        {/* 3 Meta Info Cards: Budget, Type, Status */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full pt-0.5 min-w-0">
          {/* Budget */}
          <div className="bg-[#F8F9FA] rounded-[8px] sm:rounded-[14px] p-1.5 sm:p-2.5 flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-[#8A939D]">
              <svg viewBox="0 0 24 24" className="size-3 sm:size-3.5 text-[#8A939D] shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
                <path d="M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                <circle cx="12" cy="14" r="2.5" />
                <path d="M12 12.5v3" />
              </svg>
              <span className="break-words">Budget</span>
            </div>
            <p className="text-[11.5px] sm:text-[14px] font-bold text-[#111827] break-words">
              {request.budget}
            </p>
          </div>

          {/* Type */}
          <div className="bg-[#F8F9FA] rounded-[8px] sm:rounded-[14px] p-1.5 sm:p-2.5 flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-[#8A939D]">
              <svg viewBox="0 0 24 24" className="size-3 sm:size-3.5 text-[#8A939D] shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="break-words">Type</span>
            </div>
            <p className="text-[11.5px] sm:text-[14px] font-bold text-[#111827] break-words">
              {request.purpose || 'Living'}
            </p>
          </div>

          {/* Status */}
          <div className="bg-[#F8F9FA] rounded-[8px] sm:rounded-[14px] p-1.5 sm:p-2.5 flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-[#8A939D]">
              <svg viewBox="0 0 24 24" className="size-3 sm:size-3.5 text-[#8A939D] shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
              <span className="break-words">Status</span>
            </div>
            <p className="text-[11.5px] sm:text-[14px] font-bold text-[#111827] break-words">
              {request.unitStatus || 'Ready'}
            </p>
          </div>
        </div>

        {/* Offers Badge Tag */}
        <div className="w-full flex items-center justify-start pt-0.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[#D5F5F6] text-[#00AAB3] text-[12.5px] font-bold">
            <MessageSquare className="size-3.5 text-[#00AAB3] shrink-0" />
            <span>{request.offersCount} offers</span>
          </span>
        </div>
      </div>

      {/* Main Action Button: Solid Teal/Cyan View details matching Figma */}
      <div className="w-full pt-1">
        <button
          type="button"
          onClick={onViewDetails}
          className="w-full h-[44px] sm:h-[46px] rounded-[14px] bg-[#00C2CB] hover:bg-[#00B4BD] active:scale-[0.99] text-white font-bold text-[14.5px] sm:text-[15px] shadow-sm transition-all flex items-center justify-center cursor-pointer ant-wave-btn"
        >
          View details
        </button>
      </div>
    </div>
  )
}
