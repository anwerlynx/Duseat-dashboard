'use client'

import * as React from 'react'
import { AvatarFlagOverlay, getCountryCode } from '@/components/ui/flag'
import { FigmaTag } from '@/components/ui/figma-tag'
import { MainButton } from '@/components/ui/main-button'
import {
  Clock,
  MessageSquare,
  FileText,
  Tag as TagIcon,
  Home,
  KeyRound,
  CheckCircle2,
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
        'bg-white border border-[#d3d5d7] content-stretch drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-3.5 items-center p-4 sm:p-5 relative rounded-[16px] w-full text-left transition-all duration-200 hover:border-[#00c2cb] hover:shadow-md font-sans',
        className
      )}
    >
      {/* Top Row: User Avatar with Vector Flag, Name, Online Status & Time */}
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <AvatarFlagOverlay code={countryCode}>
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
          </AvatarFlagOverlay>

          {/* Name & Online Status */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] leading-[22px] font-bold text-[#010413] truncate font-sans">
                {request.investorName}
              </span>
              <CheckCircle2 className="size-4 shrink-0 text-[#00c2cb]" />
            </div>
            <div className="flex items-center gap-1.5 text-[12px] leading-[16px] text-[#6f777f] font-sans">
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
      <div className="flex flex-col gap-2 w-full pt-0.5">
        <p className="text-[15px] sm:text-[16px] leading-[22px] font-medium text-[#010413] font-sans line-clamp-2">
          {request.title}
        </p>
        <div className="flex items-start gap-1.5 text-[13px] leading-[18px] text-[#6f777f] font-sans">
          <div className="flex items-center gap-1 shrink-0 text-[12px] text-[#9da4ae] pt-0.5">
            <FileText className="size-3.5 text-[#9da4ae]" />
            <span className="font-medium">Note:</span>
          </div>
          <p className="line-clamp-1 flex-1 text-[13px] text-[#6f777f]">
            {request.note || 'Family-friendly community with schools and parks nearby.'}
          </p>
        </div>
      </div>

      {/* 3 Meta Info Cards: Budget, Type, Method */}
      <div className="grid grid-cols-3 gap-2 w-full pt-1">
        <div className="bg-[#f8f9fa] border border-[#d3d5d7]/50 rounded-[10px] px-2.5 py-2 flex flex-col gap-0.5 items-start justify-center min-w-0">
          <div className="flex items-center gap-1 text-[11px] leading-[14px] text-[#9da4ae] font-sans">
            <TagIcon className="size-3 text-[#9da4ae] shrink-0" />
            <span>Budget</span>
          </div>
          <p className="text-[13px] leading-[18px] font-bold text-[#010413] truncate w-full font-sans">
            {request.budget}
          </p>
        </div>

        <div className="bg-[#f8f9fa] border border-[#d3d5d7]/50 rounded-[10px] px-2.5 py-2 flex flex-col gap-0.5 items-start justify-center min-w-0">
          <div className="flex items-center gap-1 text-[11px] leading-[14px] text-[#9da4ae] font-sans">
            <Home className="size-3 text-[#9da4ae] shrink-0" />
            <span>Type</span>
          </div>
          <p className="text-[13px] leading-[18px] font-bold text-[#010413] truncate w-full font-sans">
            {request.purpose || 'Living'}
          </p>
        </div>

        <div className="bg-[#f8f9fa] border border-[#d3d5d7]/50 rounded-[10px] px-2.5 py-2 flex flex-col gap-0.5 items-start justify-center min-w-0">
          <div className="flex items-center gap-1 text-[11px] leading-[14px] text-[#9da4ae] font-sans">
            <KeyRound className="size-3 text-[#9da4ae] shrink-0" />
            <span>Method</span>
          </div>
          <p className="text-[13px] leading-[18px] font-bold text-[#010413] truncate w-full font-sans">
            {request.unitStatus || 'Ready'}
          </p>
        </div>
      </div>

      {/* Offers Badge Tag */}
      <div className="w-full flex items-center justify-start pt-0.5">
        <FigmaTag
          status="Active"
          size="lg"
          label={`${request.offersCount} offers`}
          leftIcon={<MessageSquare className="size-[18px]" />}
        />
      </div>

      {/* Main Action Button: View Details */}
      <div className="w-full pt-1">
        <MainButton
          variant="Secondary"
          size="md"
          label="View details"
          onClick={onViewDetails}
          className="w-full"
        />
      </div>
    </div>
  )
}
