'use client'

import * as React from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MessageSquare,
  Banknote,
  MapPin,
  Building2,
  Lock,
  X,
  Sparkles,
  Globe,
  Flame,
  UserCheck,
  Send,
  Pencil,
  FileDown,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Eye,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import type { PropertyOffer, PropertyRequest } from '@/lib/platform-users'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/dashboard/toast'
import { Flag, getCountryCode } from '@/components/ui/flag'
import { Tag, StatusTag } from '@/components/ui/badge-tag'
import { OfferDetailsModal } from './offer-details-modal'
import { AllOffersModal } from './all-offers-modal'
import { EditRequestModal } from './edit-request-modal'

interface RequestDetailModalProps {
  request: PropertyRequest
  onClose: () => void
  onOpenChatWithAgent?: (agentName: string, requestRef: string) => void
  onUpdateStatus?: (requestId: string, newStatus: PropertyRequest['status']) => void
  onUpdateRequest?: (updatedRequest: PropertyRequest) => void
}

export function RequestDetailModal({
  request: initialRequest,
  onClose,
  onOpenChatWithAgent,
  onUpdateStatus,
  onUpdateRequest,
}: RequestDetailModalProps) {
  const { toast } = useToast()
  const [request, setRequest] = React.useState<PropertyRequest>(initialRequest)
  const [autoMatch, setAutoMatch] = React.useState(request.communication.autoMatchLanguages ?? true)
  const [isBoosted, setIsBoosted] = React.useState(false)
  const [allOffersOpen, setAllOffersOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedOfferForModal, setSelectedOfferForModal] = React.useState<any | null>(null)
  const [adminNote, setAdminNote] = React.useState('')
  const [isEditingNote, setIsEditingNote] = React.useState(false)

  const handleStatusChange = (newStatus: PropertyRequest['status']) => {
    setRequest((prev) => ({ ...prev, status: newStatus }))
    if (onUpdateStatus) onUpdateStatus(request.id, newStatus)
    toast({
      variant: 'success',
      title: 'Status updated',
      description: `Request ${request.id} marked as ${newStatus}.`,
    })
  }

  const handleAcceptOffer = (offer: PropertyOffer) => {
    setRequest((prev) => ({
      ...prev,
      status: 'Deal confirmed',
      dealConfirmed: true,
      dealWinner: {
        name: offer.agentName,
        title: 'Won the deal!',
        agency: offer.agency,
        amount: offer.price,
        date: 'Today, 11:30',
      },
      offers: prev.offers.map((o) =>
        o.id === offer.id ? { ...o, status: 'Accepted' } : { ...o, status: 'Declined' }
      ),
    }))
    toast({
      variant: 'success',
      title: 'Deal Confirmed & Escrow Initiated',
      description: `Offer from ${offer.agentName} (${offer.price}) awarded the deal! All other offers closed.`,
    })
  }

  const handleToggleBoost = () => {
    setIsBoosted(!isBoosted)
    toast({
      variant: 'info',
      title: !isBoosted ? 'Request Boosted 🔥' : 'Boost Removed',
      description: !isBoosted
        ? 'Request prioritized on verified brokers feed with top alert.'
        : 'Request restored to standard listing priority.',
    })
  }

  const countryCode = getCountryCode(
    request.countryFlag === '🇪🇬' ? 'Egypt' : request.countryFlag === '🇺🇸' ? 'United States' : 'United Arab Emirates'
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-[1240px] flex-col overflow-hidden rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Top Header Bar (Desktop Dashboard Layout) */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#d3d5d7] bg-white px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
              aria-label="Back to requests"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] leading-[28px] font-bold text-[#1f2327] font-sans">Request Details</h2>
                <span className="rounded-[6px] bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 font-mono text-[12px] leading-[16px] font-semibold text-[#6f777f]">
                  {request.id}
                </span>
                {isBoosted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4e5] px-2.5 py-0.5 text-[12px] leading-[16px] font-semibold text-[#b54708] border border-[#f79009]/30">
                    <Flame className="size-3 text-[#f79009]" />
                    HOT REQUEST
                  </span>
                )}
              </div>
              <p className="text-[12px] leading-[16px] text-[#6f777f]">Created {request.created || 'Recently'} • Real-time investor acquisition brief</p>
            </div>
          </div>

          {/* Top Admin Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] px-3 py-1.5 text-[14px] leading-[20px]">
              <span className="text-[12px] leading-[16px] text-[#6f777f] font-medium">Status:</span>
              <select
                value={request.status}
                onChange={(e) => handleStatusChange(e.target.value as PropertyRequest['status'])}
                className="bg-transparent font-semibold text-[#1f2327] outline-none cursor-pointer text-[14px]"
              >
                <option value="Open">Open</option>
                <option value="Receiving offers">Receiving offers</option>
                <option value="Matched">Matched</option>
                <option value="Deal confirmed">Deal confirmed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#00c2cb] bg-[#e5f6f7] px-3.5 text-[14px] leading-[20px] font-semibold text-[#00848b] hover:bg-[#00c2cb] hover:text-white transition-all cursor-pointer ant-wave-btn shadow-2xs"
            >
              <Pencil className="size-3.5" />
              <span>Edit Request / تعديل الطلب</span>
            </button>

            <button
              type="button"
              onClick={handleToggleBoost}
              className={cn(
                'flex h-[38px] items-center gap-1.5 rounded-[8px] border px-3 text-[14px] leading-[20px] font-semibold transition-colors cursor-pointer ant-wave-btn shadow-2xs',
                isBoosted
                  ? 'border-[#f79009] bg-[#fff4e5] text-[#b54708]'
                  : 'border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3]'
              )}
            >
              <Flame className={cn('size-4', isBoosted ? 'text-[#f79009]' : 'text-[#6f777f]')} />
              <span>{isBoosted ? 'Boosted' : 'Boost Priority'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                toast({
                  variant: 'success',
                  title: 'Notice Broadcasted',
                  description: `Push alert sent to 48 verified brokers matching ${request.propertyType} in ${request.preferredAreas[0] || 'Dubai'}.`,
                })
              }}
              className="flex h-[38px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] leading-[20px] font-medium text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
            >
              <Send className="size-3.5" />
              <span>Broadcast to Agents</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-[8px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Scroll Content (Desktop 2-Column Split) */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa] space-y-6 font-sans">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* =========================================================================
                LEFT COLUMN: Core Request Brief (Figma 2061:3833 / 3869 / 3851 / 3887)
               ========================================================================= */}
            <div className="space-y-5 lg:col-span-7 xl:col-span-8">
              {/* 1. Investor Header Card */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <div className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-sm shadow-xs border-2 border-white">
                        {request.investorAvatar || (request.investorName.includes('Anwar') ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80') ? (
                          <img
                            src={
                              request.investorAvatar ||
                              (request.investorName.includes('Anwar')
                                ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
                                : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80')
                            }
                            alt={request.investorName}
                            className="size-full object-cover object-center aspect-square"
                          />
                        ) : (
                          request.investorName.split(' ').map((n) => n[0]).join('')
                        )}
                      </div>
                      <div className="absolute -left-1 -top-1">
                        <Flag code={countryCode} size="s" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[16px] text-[#1f2327] font-sans">{request.investorName}</span>
                        <span className="text-[12px] text-[#6f777f] font-normal">• Investor</span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#dfefe8] px-2 py-0.2 text-[11px] font-semibold text-[#17b26a]">
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-0.5 text-[12px] text-[#6f777f]">
                        <span className="inline-flex items-center gap-1 text-[#17b26a] font-semibold">
                          <span className="size-2 rounded-full bg-[#17b26a] shrink-0 animate-pulse" />
                          {request.onlineStatus || 'Online (Avg 10m)'}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-[#9da4ae]">
                          <Clock className="size-3.5" />
                          {request.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAllOffersOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f6f7] px-3 py-1 text-[13px] font-bold text-[#00c2cb] hover:bg-[#00c2cb] hover:text-white transition-all cursor-pointer ant-wave-btn shadow-2xs"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>{request.offersCount} offers</span>
                  </button>
                </div>

                {/* Headline Pitch Description */}
                <div className="pt-1">
                  <p className="text-[16px] sm:text-[17px] font-bold text-[#1f2327] leading-relaxed">
                    {request.title}
                  </p>

                  {/* Note Callout */}
                  <div className="mt-2.5 flex items-start gap-2 rounded-[8px] bg-[#f8f9fa] border border-[#d3d5d7] p-3 text-[13px]">
                    <span className="font-bold text-[#6f777f] shrink-0">📄 Note:</span>
                    <p className="font-medium text-[#1f2327] leading-snug">
                      {request.note || 'Flexible on handover date. Minimum 7% rental yield expected.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. What They Want (Figma Specifications Grid with Flow Branches) */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#d3d5d7]">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#6f777f]">
                    What they want (Acquisition Specs)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[12px] font-semibold text-[#00c2cb] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Pencil className="size-3" />
                    <span>Edit Specs</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {/* Purpose */}
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex flex-col justify-between">
                    <p className="text-[12px] font-medium text-[#6f777f]">Purpose</p>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center rounded-full bg-[#00c2cb] px-2.5 py-0.5 text-[12px] font-medium text-white shadow-2xs">
                        {request.purpose}
                        {request.investmentType && ` • ${request.investmentType}`}
                      </span>
                    </div>
                  </div>

                  {/* Property / Commercial Type */}
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex flex-col justify-between">
                    <p className="text-[12px] font-medium text-[#6f777f]">
                      {request.investmentType === 'Commercial' ? 'Commercial Type' : 'Property Type'}
                    </p>
                    <p className="text-[15px] font-bold text-[#1f2327] mt-1">
                      {request.commercialUnitType || request.propertyType}
                    </p>
                  </div>

                  {/* Bedrooms (or N/A for commercial) */}
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex flex-col justify-between">
                    <p className="text-[12px] font-medium text-[#6f777f]">Bedrooms</p>
                    <p className="text-[15px] font-bold text-[#1f2327] mt-1">
                      {request.investmentType === 'Commercial' ? 'Commercial Unit' : request.bedrooms}
                    </p>
                  </div>

                  {/* Unit status */}
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex flex-col justify-between">
                    <p className="text-[12px] font-medium text-[#6f777f]">Unit status</p>
                    <div className="mt-1">
                      <span className={cn(
                        'inline-flex items-center rounded-[6px] px-2.5 py-0.5 text-[12px] font-medium',
                        request.unitStatus === 'Ready'
                          ? 'bg-[#dfefe8] text-[#17b26a] border border-[#a6f4c5]/50'
                          : 'bg-[#e5f6f7] text-[#00848b] border border-[#c7ecee]'
                      )}>
                        {request.unitStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Location & Budget Card */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#6f777f] pb-2.5 border-b border-[#d3d5d7]">
                  Location & Budget
                </h4>
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 sm:col-span-4 flex flex-col justify-between">
                    <p className="text-[12px] font-medium text-[#6f777f]">Budget</p>
                    <p className="text-[20px] font-extrabold text-[#00c2cb] mt-1">{request.budget}</p>
                  </div>

                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 sm:col-span-8 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-medium text-[#6f777f]">Preferred areas</p>
                      <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.2 text-[12px] font-medium">
                        {request.preferredAreas.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {request.preferredAreas.map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 py-1 text-[12px] font-medium text-[#1f2327]"
                        >
                          <MapPin className="size-3 text-[#00c2cb]" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Payment Plan & Developers Preference (Conditional by Ready vs Offplan) */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#6f777f] pb-2.5 border-b border-[#d3d5d7]">
                  Payment plan & developer preference
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* If Ready: Payment Method + Mortgage Eligibility */}
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-medium text-[#6f777f]">Payment method</p>
                      <p className="text-[15px] font-bold text-[#1f2327] mt-0.5">{request.paymentMethod}</p>
                    </div>
                    <span className="rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 py-1 text-[12px] font-medium text-[#1f2327]">
                      {request.paymentMethod === 'Mortgage' ? 'Bank Mortgage' : 'Cash Buyer'}
                    </span>
                  </div>

                  {/* Mortgage Eligibility OR Payment Plan */}
                  {request.paymentMethod === 'Mortgage' ? (
                    <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-medium text-[#6f777f]">Mortgage eligibility</p>
                        <p className="text-[15px] font-bold text-[#1f2327] mt-0.5">
                          {request.mortgageEligibility === 'Yes' || request.mortgageEligible
                            ? 'Eligible (Pre-approved)'
                            : request.mortgageEligibility === 'No'
                            ? 'Not Eligible'
                            : 'Checking Eligibility'}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[12px] font-medium',
                          request.mortgageEligibility === 'Yes' || request.mortgageEligible
                            ? 'bg-[#dfefe8] text-[#17b26a]'
                            : 'bg-[#eff1f3] text-[#6f777f]'
                        )}
                      >
                        {request.mortgageEligibility || (request.mortgageEligible ? 'Yes' : 'No')}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-medium text-[#6f777f]">Preferred Payment Plan</p>
                        <p className="text-[14px] font-bold text-[#1f2327] mt-0.5">
                          {request.paymentPlan || 'Standard Developer Plan'}
                        </p>
                      </div>
                      <span className="rounded-[6px] bg-[#e5f6f7] text-[#00848b] px-2.5 py-0.5 text-[12px] font-medium">
                        {request.unitStatus === 'Ready' ? 'Immediate' : 'Installments'}
                      </span>
                    </div>
                  )}

                  {/* Developer Preferences */}
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-medium text-[#6f777f]">Specific developer preference?</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#dfefe8] px-2 py-0.5 text-[12px] font-medium text-[#17b26a]">
                        <CheckCircle2 className="size-3" />
                        {request.developerPreference.hasPreference ? 'Selected Developers' : 'Open to all developers'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {request.developerPreference.selected.map((dev) => (
                        <span
                          key={dev}
                          className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-1.5 text-[13px] font-medium text-[#1f2327]"
                        >
                          <Building2 className="size-3.5 text-[#00c2cb]" />
                          {dev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Communication & Auto Match Languages */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#6f777f] pb-2.5 border-b border-[#d3d5d7]">
                  Communication & Languages
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                    <div>
                      <p className="text-[14px] font-bold text-[#1f2327]">Auto match my languages</p>
                      <p className="text-[12px] text-[#6f777f] mt-0.5">
                        We'll translate your request and show it to agents who speak your selected languages.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoMatch(!autoMatch)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                        autoMatch ? 'bg-[#00c2cb]' : 'bg-[#d3d5d7]'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                          autoMatch ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(request.communication.preferredLanguages || ['Arabic', 'English']).map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-1 text-[13px] font-medium text-[#1f2327]"
                      >
                        <Globe className="size-3.5 text-[#00c2cb]" />
                        <span>{lang}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN: Admin Controls, Current Interest & Offers Feed
               ========================================================================= */}
            <div className="space-y-5 lg:col-span-5 xl:col-span-4">
              {/* 1. Admin Control & Moderation Card */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#1f2327] pb-2.5 border-b border-[#d3d5d7]">
                  Admin Controls
                </h4>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      toast({
                        variant: 'info',
                        title: 'Investor Contact',
                        description: `Initiated direct communication with ${request.investorName} via secure administrative channel.`,
                      })
                    }}
                    className="w-full h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs ant-wave-btn"
                  >
                    <User className="size-4 text-[#6f777f]" />
                    <span>Contact Investor Direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURI(`Request ID,${request.id}\nInvestor,${request.investorName}\nBudget,${request.budget}\nProperty,${request.propertyType}\nAreas,"${request.preferredAreas.join(', ')}"`)
                      const link = document.createElement('a')
                      link.setAttribute('href', csvContent)
                      link.setAttribute('download', `request_${request.id}.csv`)
                      link.click()
                      toast({ variant: 'success', title: 'Exported', description: `Request ${request.id} downloaded.` })
                    }}
                    className="w-full h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs ant-wave-btn"
                  >
                    <FileDown className="size-4 text-[#6f777f]" />
                    <span>Download Request Brief</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('Closed')}
                    className="w-full h-[38px] rounded-[8px] border border-rose-200 bg-rose-50 text-[13px] font-semibold text-[#f04438] hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <X className="size-4" />
                    <span>Archive / Close Request</span>
                  </button>
                </div>
              </div>

              {/* 2. Current Interest Card (Figma Node 2061:3833 / 3851) */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#d3d5d7]">
                  <h4 className="text-[14px] font-bold text-[#1f2327]">Current Interest</h4>
                  <span className="text-[12px] font-semibold text-[#00c2cb]">{request.agentsPitchingCount} Agents pitching</span>
                </div>

                <div className="flex items-center justify-between rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                  <span className="font-bold text-[14px] text-[#1f2327]">{request.agentsPitchingCount} Agents pitching</span>
                  <div className="flex -space-x-2 overflow-hidden">
                    {['Liam Johnson', 'Layla Haddad', 'Ahmed Khaled'].map((name, i) => (
                      <div
                        key={i}
                        className="inline-block size-7 rounded-full ring-2 ring-white bg-[#1f2327] text-white text-[10px] font-bold flex items-center justify-center"
                      >
                        {name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    ))}
                    <div className="inline-block size-7 rounded-full ring-2 ring-white bg-[#e5f6f7] text-[#00c2cb] text-[10px] font-bold flex items-center justify-center">
                      +{request.agentsPitchingCount - 3}
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-[#6f777f] flex items-center gap-1.5 leading-tight">
                  <Sparkles className="size-3.5 text-[#f79009] shrink-0" />
                  <span>Confirming a deal will automatically close all other offers and chats.</span>
                </p>

                {/* Deal Confirmed Banner (Figma Node 2061:3851 / 3887) */}
                {request.dealConfirmed && request.dealWinner && (
                  <div className="rounded-[10px] border border-[#dfefe8] bg-[#dfefe8]/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-[#17b26a] text-[13px]">
                      <Lock className="size-4" />
                      <span>Deal confirmed. All other offers & chats closed.</span>
                    </div>

                    <div className="flex items-center justify-between rounded-[8px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                          👑
                        </div>
                        <div>
                          <p className="font-bold text-[14px] text-[#1f2327]">{request.dealWinner.name}</p>
                          <p className="text-[12px] text-[#17b26a] font-semibold">Won the deal! • {request.dealWinner.amount}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#dfefe8] px-2 py-0.5 text-[11px] font-bold text-[#17b26a]">
                        Closed
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Offers Feed (Figma Node 2061:3833 / 3869) */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#d3d5d7]">
                  <h4 className="text-[16px] font-bold text-[#1f2327]">{request.offers.length} Offers submitted</h4>
                  <button
                    type="button"
                    onClick={() => setAllOffersOpen(true)}
                    className="text-[13px] font-bold text-[#00c2cb] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>See all</span>
                    <span className="rounded-full bg-[#e5f6f7] px-1.5 py-0.2 text-[11px] font-bold">
                      {request.offers.length}
                    </span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {request.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3 hover:border-[#00c2cb] transition-colors shadow-2xs font-sans"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="size-9 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] text-white flex items-center justify-center font-bold text-xs">
                            {offer.agentName.split(' ').map((p) => p[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[14px] text-[#1f2327]">{offer.agentName}</span>
                              <span className="bg-[#e5f6f7] text-[#00c2cb] px-1.5 py-0.2 rounded text-[10px] font-bold">
                                Pro
                              </span>
                            </div>
                            <p className="text-[12px] text-[#6f777f]">{offer.agency} • ★ {offer.rating}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block font-bold text-[14px] text-[#1f2327]">{offer.price}</span>
                          <span className="text-[11px] font-semibold text-[#17b26a]">{offer.status}</span>
                        </div>
                      </div>

                      <p className="text-[13px] text-[#6f777f] line-clamp-2 leading-relaxed">
                        {offer.description}
                      </p>

                      {/* Photo Thumbnails */}
                      <div className="grid grid-cols-4 gap-1 pt-0.5">
                        {[
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300&auto=format&fit=crop&q=80',
                        ].map((img, i) => (
                          <div key={i} className="h-10 rounded-[4px] overflow-hidden bg-muted">
                            <img src={img} alt="Property preview" className="size-full object-cover" />
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#d3d5d7]">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOfferForModal({
                              id: offer.id,
                              agentName: offer.agentName,
                              agentId: 'AG-1057',
                              agentDeals: 64,
                              agentRating: offer.rating || 4.9,
                              agentSubscription: 'Pro agent',
                              agentVerified: true,
                              proposalText: offer.description,
                              photos: [
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
                                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
                              ],
                              price: offer.price,
                            })
                          }
                          className="flex-1 rounded-[6px] border border-[#d3d5d7] bg-white py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                        >
                          View Offer
                        </button>

                        {!request.dealConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleAcceptOffer(offer)}
                            className="flex-1 rounded-[6px] bg-[#00c2cb] py-1.5 text-[12px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-2xs ant-wave-btn"
                          >
                            Accept Deal
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] bg-white px-6 py-3.5 font-sans">
          <span className="text-[13px] text-[#6f777f]">
            Duseat Real Estate Platform • Request Ref #{request.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] bg-[#1f2327] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>

      {/* All Offers Modal */}
      <AllOffersModal
        isOpen={allOffersOpen}
        onClose={() => setAllOffersOpen(false)}
        request={request}
        onAcceptOffer={handleAcceptOffer}
        onOpenChatWithAgent={onOpenChatWithAgent}
      />

      {/* Offer Details Modal */}
      {selectedOfferForModal && (
        <OfferDetailsModal
          isOpen={true}
          offer={selectedOfferForModal}
          onClose={() => setSelectedOfferForModal(null)}
          onAccept={() => {
            const offer = request.offers.find((o) => o.id === selectedOfferForModal.id)
            if (offer) handleAcceptOffer(offer)
            setSelectedOfferForModal(null)
          }}
          onDelete={() => {
            setRequest((prev) => ({
              ...prev,
              offers: prev.offers.filter((o) => o.id !== selectedOfferForModal.id),
              offersCount: Math.max(0, prev.offersCount - 1),
            }))
            setSelectedOfferForModal(null)
            toast({ variant: 'error', title: 'Offer Deleted', description: 'Offer removed from request feed.' })
          }}
        />
      )}

      {/* Edit Request Modal */}
      <EditRequestModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        request={request}
        onSave={(updated) => {
          setRequest(updated)
          if (onUpdateRequest) onUpdateRequest(updated)
        }}
      />
    </div>
  )
}
