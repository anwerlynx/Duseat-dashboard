'use client'

import * as React from 'react'
import { Flag, getCountryCode } from '@/components/ui/flag'
import {
  Clock,
  MessageSquare,
  FileText,
  Tag as TagIcon,
  Home,
  KeyRound,
} from 'lucide-react'
import type { PropertyRequest } from '@/lib/platform-users'
import { cn } from '@/lib/utils'

interface RequestCardProps {
  request: PropertyRequest
  onViewDetails: () => void
  className?: string
}

export function RequestCard({ request, onViewDetails, className }: RequestCardProps) {
  const countryCode = getCountryCode(
    request.countryFlag === '🇪🇬' ? 'Egypt' : request.countryFlag === '🇺🇸' ? 'United States' : 'United Arab Emirates'
  )

  return (
    <div
      className={cn(
        'bg-white border border-[#d3d5d7] content-stretch drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-3 items-center p-4 sm:p-5 sm:py-6 relative rounded-[16px] w-full text-left transition-all duration-200 hover:border-[#00c2cb]/50 hover:shadow-md',
        className
      )}
    >
      {/* Top Row: User Avatar, Name, Online Status & Time */}
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with UAE Flag badge */}
          <div className="relative size-[44px] shrink-0">
            <div className="size-[44px] rounded-full overflow-hidden border-2 border-white shadow-xs bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center">
              <img
                src={
                  request.investorAvatar ||
                  (request.investorName.includes('Anwar')
                    ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
                    : request.investorName.includes('Sarah')
                    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                    : request.investorName.includes('Mansoor')
                    ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80')
                }
                alt={request.investorName}
                className="size-full object-cover object-center aspect-square"
              />
            </div>
            <div className="absolute -left-1 -top-1">
              <Flag code={countryCode} size="s" />
            </div>
          </div>

          {/* Name & Online Status */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[16px] leading-[24px] font-semibold text-[#010413] truncate font-sans">
                {request.investorName}
              </span>
              <svg className="size-3.5 shrink-0 text-[#00c2cb]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] leading-[16px] text-[#9da4ae] font-sans">
              <span className="size-2 rounded-full bg-[#17b26a] shrink-0" />
              <span className="truncate">{request.onlineStatus || 'Online (Avg 10m)'}</span>
            </div>
          </div>
        </div>

        {/* Time Ago */}
        <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#9da4ae] shrink-0 font-sans">
          <Clock className="size-3.5 text-[#9da4ae]" />
          <span>{request.timeAgo}</span>
        </div>
      </div>

      {/* Description & Note */}
      <div className="flex flex-col gap-2 w-full pt-1">
        <p className="text-[16px] leading-[24px] font-medium text-[#010413] font-sans line-clamp-3">
          {request.title}
        </p>
        <div className="flex items-start gap-1.5 text-[14px] leading-[20px] text-[#6f777f] font-sans">
          <div className="flex items-center gap-1 shrink-0 text-[12px] leading-[16px] text-[#90969c] pt-0.5">
            <FileText className="size-3.5 text-[#90969c]" />
            <span className="font-medium">Note:</span>
          </div>
          <p className="line-clamp-1 flex-1 text-[14px] leading-[20px] text-[#6f777f]">
            {request.note || 'Family-friendly community with schools and parks nearby.'}
          </p>
        </div>
      </div>

      {/* 3 Meta Info Cards: Budget, Type, Method */}
      <div className="grid grid-cols-3 gap-2 w-full pt-1">
        <div className="bg-[#f8f8f8] rounded-[12px] px-2.5 py-2 flex flex-col gap-0.5 items-start justify-center min-w-0">
          <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#9da4ae] font-sans">
            <TagIcon className="size-3 text-[#9da4ae] shrink-0" />
            <span>Budget</span>
          </div>
          <p className="text-[14px] leading-[20px] font-medium text-[#010413] truncate w-full font-sans">
            {request.budget}
          </p>
        </div>

        <div className="bg-[#f8f8f8] rounded-[12px] px-2.5 py-2 flex flex-col gap-0.5 items-start justify-center min-w-0">
          <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#9da4ae] font-sans">
            <Home className="size-3 text-[#9da4ae] shrink-0" />
            <span>Type</span>
          </div>
          <p className="text-[14px] leading-[20px] font-medium text-[#010413] truncate w-full font-sans">
            {request.purpose || 'Living'}
          </p>
        </div>

        <div className="bg-[#f8f8f8] rounded-[12px] px-2.5 py-2 flex flex-col gap-0.5 items-start justify-center min-w-0">
          <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#9da4ae] font-sans">
            <KeyRound className="size-3 text-[#9da4ae] shrink-0" />
            <span>Method</span>
          </div>
          <p className="text-[14px] leading-[20px] font-medium text-[#010413] truncate w-full font-sans">
            {request.unitStatus || 'Ready'}
          </p>
        </div>
      </div>

      {/* Offers Badge Tag */}
      <div className="w-full flex items-center justify-start pt-0.5">
        <div className="bg-[#c7ecee] h-[24px] px-2 rounded-[8px] flex items-center gap-1.5 text-[12px] leading-[16px] text-[#00a4ac] font-medium font-sans">
          <MessageSquare className="size-3 text-[#00a4ac]" />
          <span>{request.offersCount} offers</span>
        </div>
      </div>

      {/* Main Action Button: View Details */}
      <button
        type="button"
        onClick={onViewDetails}
        className="mt-1 w-full h-[44px] rounded-[12px] border border-[#00c2cb] bg-transparent text-[#00c2cb] text-[14px] leading-[20px] font-semibold flex items-center justify-center transition-all duration-200 hover:bg-[#00c2cb] hover:text-white cursor-pointer ant-wave-btn font-sans shadow-2xs"
      >
        View details
      </button>
    </div>
  )
}



