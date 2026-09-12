'use client'

import * as React from 'react'
import {
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentOfferData {
  id: string
  requestId?: string
  status: 'Accepted' | 'Pending' | 'Declined' | 'Under review' | string
  // User/Agent row
  name?: string
  investorName?: string
  agentName?: string
  avatar?: string
  investorAvatar?: string
  role?: string
  investorRole?: string
  agency?: string
  agentId?: string
  dealsCount?: number | string
  rating?: number | string
  subscriptionPlan?: string
  isVerified?: boolean
  timeAgo?: string
  // Content
  proposalDescription: string
  note?: string
  photos: string[]
  location: string
  brochureName?: string
  amount?: string
  // Callbacks
  onOpenChat?: () => void
  onViewDetails?: () => void
  onRequestClick?: () => void
}

/**
 * Property Offer Card matching exact Dashboard Figma design:
 * Node: 312:33338 (https://www.figma.com/design/fFqCjG8QjlNgBUOUDn6mVN/Dashboard?node-id=312-33338&m=dev)
 */
export function AgentOfferCard({
  offer,
  onOpenChat,
  onViewDetails,
  onRequestClick,
  className,
}: {
  offer: AgentOfferData
  onOpenChat?: () => void
  onViewDetails?: () => void
  onRequestClick?: () => void
  className?: string
}) {
  const isAccepted = offer.status === 'Accepted'
  const isDeclined = offer.status === 'Declined'
  const isPending = offer.status === 'Pending' || offer.status === 'Under review'

  const displayName =
    offer.name ||
    offer.agentName ||
    offer.investorName ||
    'Anwar hosny'

  const displayAvatar =
    offer.avatar ||
    offer.investorAvatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'

  const displayId = offer.agentId || 'AG-1057'
  const displayDeals = offer.dealsCount ? `${offer.dealsCount} Deals` : '64 Deals'
  const displayRating = offer.rating ? String(offer.rating) : '4.9'
  const displayPlan = offer.subscriptionPlan || 'Pro agent'
  const displayTime = offer.timeAgo || '4 min ago'
  const displayRequestId = offer.requestId || '#REQ-1024'
  const displayNote =
    offer.note || 'Family-friendly community with schools and parks nearby.'

  const photos =
    offer.photos && offer.photos.length > 0
      ? offer.photos.slice(0, 4)
      : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
        ]

  return (
    <div
      className={cn(
        'bg-white border border-[#D0D5DD] rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 drop-shadow-[0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col justify-between gap-4 font-sans text-left transition-all duration-200 hover:border-[#00C2CB] hover:shadow-md w-full',
        className
      )}
    >
      <div className="flex flex-col gap-3.5 w-full">
        {/* Row 1: Request ID (left) + Status Badge (right) */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onRequestClick}
            className="text-[15px] font-medium text-[#00C2CB] underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            {displayRequestId.startsWith('#') ? displayRequestId : `#${displayRequestId}`}
          </button>

          {isAccepted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBFDF3] border border-[#7CE9AB] text-[#027A48] text-[12px] font-medium tracking-tight">
              <svg viewBox="0 0 24 24" fill="none" className="size-3.5 text-[#027A48]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Accepted</span>
            </span>
          ) : isDeclined ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3F2] border border-[#FDA29B] text-[#D92D20] text-[12px] font-medium tracking-tight">
              <svg viewBox="0 0 24 24" fill="none" className="size-3.5 text-[#D92D20]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>Declined</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFAEB] border border-[#FEDF89] text-[#B54708] text-[12px] font-medium tracking-tight">
              <svg viewBox="0 0 24 24" fill="none" className="size-3.5 text-[#B54708]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Pending</span>
            </span>
          )}
        </div>

        {/* Row 2: User Avatar + Name + Badges + Subtitle + Time */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="size-[44px] rounded-full overflow-hidden border border-[#E5E7EB] bg-[#F3F4F6] shrink-0">
              <img
                src={displayAvatar}
                alt={displayName}
                className="size-full object-cover object-center"
              />
            </div>

            {/* Name + Badges & Subtitle */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[15px] text-[#101828] leading-tight truncate">
                  {displayName}
                </span>

                {/* Plan Badge (cyan) */}
                <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#E0F7F8] border border-[#B3EEF0] px-1.5 py-0.5 text-[11px] font-semibold text-[#00A4AC] leading-none shrink-0">
                  <span>{displayPlan}</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 text-[#00A4AC]">
                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.5l-4-4 1.41-1.41L11 13.67l6.59-6.59L19 8.5l-8 8z" />
                  </svg>
                </span>

                {/* Verified Badge (green) */}
                <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#E6F8EF] border border-[#A6F4C5] px-1.5 py-0.5 text-[11px] font-semibold text-[#079455] leading-none shrink-0">
                  <span>Verified</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 text-[#079455]">
                    <circle cx="12" cy="12" r="10" />
                    <path fill="white" d="m9 12 2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                {/* Rating Badge (amber) */}
                <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#FEF7EB] border border-[#FEDF89] px-1.5 py-0.5 text-[11px] font-semibold text-[#F79009] leading-none shrink-0">
                  <Star className="size-3 fill-[#F79009] text-[#F79009]" />
                  <span>{displayRating}</span>
                </span>
              </div>

              {/* Subtitle: ID • Deals */}
              <div className="text-[13px] text-[#667085] mt-0.5">
                <span>{displayId}</span>
                <span className="mx-1.5">•</span>
                <span>{displayDeals}</span>
              </div>
            </div>
          </div>

          {/* Timestamp on right */}
          <div className="inline-flex items-center gap-1 text-[12px] text-[#98A2B3] font-normal shrink-0">
            <Clock className="size-3.5 text-[#98A2B3]" />
            <span>{displayTime}</span>
          </div>
        </div>

        {/* Row 3: Description Title & Note */}
        <div className="space-y-1 pt-0.5">
          <p className="text-[14.5px] sm:text-[15px] font-medium text-[#101828] leading-snug">
            {offer.proposalDescription}
          </p>

          <div className="flex items-center gap-1.5 text-[12.5px] sm:text-[13px] text-[#667085]">
            <FileText className="size-3.5 text-[#98A2B3] shrink-0" />
            <span className="text-[#98A2B3] font-medium">Note:</span>
            <span className="truncate">{displayNote}</span>
          </div>
        </div>

        {/* Row 4: 4 Property Photos */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              className="h-[74px] sm:h-[80px] rounded-[12px] sm:rounded-[14px] overflow-hidden border border-[#E5E7EB] bg-[#F2F4F7] relative group"
            >
              <img
                src={photoUrl}
                alt={`Property preview ${idx + 1}`}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>

        {/* Row 5: Location & Brochure Pills (Equal Width Rounded Containers matching Figma 312:33680) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Location Pill */}
          <div className="h-[44px] rounded-[12px] border border-[#D0D5DD] bg-white flex items-center justify-center gap-2 px-3 text-[13.5px] font-medium text-[#344054] shadow-2xs hover:border-[#00C2CB] transition-colors">
            <MapPin className="size-4 text-[#667085] shrink-0" />
            <span className="truncate">{offer.location || 'Palm Jumeirah'}</span>
          </div>

          {/* Brochure Pill */}
          <div className="h-[44px] rounded-[12px] border border-[#D0D5DD] bg-white flex items-center justify-center gap-2 px-3 text-[13.5px] font-medium text-[#344054] shadow-2xs hover:border-[#00C2CB] transition-colors">
            <FileText className="size-4 text-[#667085] shrink-0" />
            <span className="truncate">{offer.brochureName || 'Brochure.pdf'}</span>
          </div>
        </div>
      </div>

      {/* Row 6: Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1 w-full">
        {isAccepted && onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="w-full h-[46px] rounded-[12px] bg-[#00C2CB] hover:bg-[#00B4BD] active:scale-[0.99] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer ant-wave-btn"
          >
            <span>Open chat</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4.5 text-white">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={onViewDetails}
          className="w-full h-[46px] rounded-[12px] border border-[#00C2CB] bg-white hover:bg-[#00C2CB]/5 active:scale-[0.99] text-[#00C2CB] font-semibold text-[15px] flex items-center justify-center transition-all cursor-pointer ant-wave-btn shadow-2xs"
        >
          View Offer details
        </button>
      </div>
    </div>
  )
}
