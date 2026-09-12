'use client'

import * as React from 'react'
import Link from 'next/link'
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
  History as HistoryIcon,
  Archive,
  Trash2,
  DollarSign,
  Briefcase,
  Layers,
  Award,
  Pin,
  Plus,
} from 'lucide-react'
import type { PropertyOffer, PropertyRequest } from '@/lib/platform-users'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/dashboard/toast'
import { Flag, getCountryCode } from '@/components/ui/flag'
import { Tag, StatusTag } from '@/components/ui/badge-tag'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { OfferDetailsModal } from './offer-details-modal'
import { AllOffersModal } from './all-offers-modal'
import { EditRequestModal } from './edit-request-modal'

interface RequestDetailModalProps {
  request: PropertyRequest
  onClose: () => void
  onOpenChatWithAgent?: (agentName: string, requestRef: string) => void
  onUpdateStatus?: (requestId: string, newStatus: PropertyRequest['status']) => void
  onUpdateRequest?: (updatedRequest: PropertyRequest) => void
  onDeleteRequest?: (requestId: string) => void
  onArchiveRequest?: (requestId: string) => void
  onAssignAdmin?: (requestId: string, adminName: string) => void
}

type DetailTab =
  | 'investor'
  | 'requirements'
  | 'timeline'
  | 'offers'
  | 'accepted-offer'
  | 'deal'
  | 'conversation'
  | 'notes'
  | 'history'

export function RequestDetailModal({
  request: initialRequest,
  onClose,
  onOpenChatWithAgent,
  onUpdateStatus,
  onUpdateRequest,
  onDeleteRequest,
  onArchiveRequest,
  onAssignAdmin,
}: RequestDetailModalProps) {
  const { toast } = useToast()
  const [request, setRequest] = React.useState<PropertyRequest>(initialRequest)
  const [activeTab, setActiveTab] = React.useState<DetailTab>('investor')
  const [autoMatch, setAutoMatch] = React.useState(request.communication.autoMatchLanguages ?? true)
  const [isBoosted, setIsBoosted] = React.useState(false)
  const [allOffersOpen, setAllOffersOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedOfferForModal, setSelectedOfferForModal] = React.useState<any | null>(null)

  // Internal Admin Notes State
  const [adminNotesList, setAdminNotesList] = React.useState([
    { id: '1', author: 'Nadia Al-Hashimi', text: 'Investor requested immediate viewings for units in Dubai Hills and Nad Al Sheba.', date: 'Today, 09:40' },
    { id: '2', author: 'Tariq Al-Mansoor', text: 'Pre-approval mortgage letter verified with Emirates NBD.', date: 'Yesterday, 14:15' },
  ])
  const [newNoteText, setNewNoteText] = React.useState('')

  // Quick chat simulation
  const [chatMessages, setChatMessages] = React.useState([
    { id: '1', from: 'agent', name: 'Layla Haddad', text: 'Hello Anwar, I have submitted a prime 5BR villa in Nad Al Sheba with private pool ready for immediate transfer.', time: '10:15 AM' },
    { id: '2', from: 'user', name: request.investorName, text: 'Thank you Layla. Can you share the title deed copy and floor plan?', time: '10:22 AM' },
    { id: '3', from: 'agent', name: 'Layla Haddad', text: 'Sent via secure attachments. Let me know if you would like to schedule a site inspection today.', time: '10:25 AM' },
  ])
  const [chatInput, setChatInput] = React.useState('')

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
    const updated: PropertyRequest = {
      ...request,
      status: 'Matched',
      dealConfirmed: true,
      dealWinner: {
        name: offer.agentName,
        title: 'Won the deal!',
        agency: offer.agency,
        amount: offer.price,
        date: 'Today, 11:30',
      },
      offers: request.offers.map((o) =>
        o.id === offer.id ? { ...o, status: 'Accepted' } : { ...o, status: 'Declined' }
      ),
    }
    setRequest(updated)
    if (onUpdateRequest) onUpdateRequest(updated)
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

  const handleAddAdminNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    setAdminNotesList((prev) => [
      {
        id: String(Date.now()),
        author: 'Nadia Al-Hashimi',
        text: newNoteText.trim(),
        date: 'Just now',
      },
      ...prev,
    ])
    setNewNoteText('')
    toast({ variant: 'success', title: 'Note Added', description: 'Internal admin note recorded.' })
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        from: 'user',
        name: 'Admin Dispatch',
        text: chatInput.trim(),
        time: 'Just now',
      },
    ])
    setChatInput('')
  }

  const countryCode = getCountryCode(
    request.countryFlag === '🇪🇬' ? 'Egypt' : request.countryFlag === '🇺🇸' ? 'United States' : 'United Arab Emirates'
  )

  const timelineSteps = [
    { title: 'Request Created & Verified', desc: 'Investor submitted verified criteria via mobile app', date: request.created || '28 May 2026', done: true },
    { title: 'Broadcast to Licensed Agents', desc: 'Alert dispatched to 48 verified brokers in target zones', date: '28 May 2026', done: true },
    { title: 'Offers Received', desc: `${request.offers.length} competitive property proposals submitted`, date: '29 May 2026', done: request.offers.length > 0 },
    { title: 'Offer Accepted & Escrow', desc: request.dealWinner ? `Won by ${request.dealWinner.name} (${request.dealWinner.amount})` : 'Pending investor selection', date: request.dealWinner?.date || 'Pending', done: !!request.dealWinner },
    { title: 'Title Deed Transfer & Closing', desc: 'DLD registrar title transfer completion', date: 'Expected Q3 2026', done: request.status === 'Closed' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-5 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[94vh] sm:max-h-[92vh] w-full max-w-[calc(100vw-16px)] sm:max-w-[1240px] flex-col overflow-hidden rounded-[12px] sm:rounded-[16px] border border-[#E2E5E8] bg-white shadow-2xl ant-modal-zoom">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#E2E5E8] bg-white px-4 sm:px-6 py-3 sm:py-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#E2E5E8] bg-white text-[#68727D] hover:bg-[#F8F9FA] hover:text-[#202428] transition-colors cursor-pointer shadow-xs shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] leading-[28px] font-bold text-[#1f2327] font-sans">Request Details</h2>
                <span className="rounded-[6px] bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 font-mono text-[12px] leading-[16px] font-semibold text-[#6f777f]">
                  {request.id}
                </span>
                <FigmaStatusBadge status={request.status} />
                {isBoosted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4e5] px-2.5 py-0.5 text-[12px] leading-[16px] font-semibold text-[#b54708] border border-[#f79009]/30">
                    <Flame className="size-3 text-[#f79009]" />
                    HOT BRIEF
                  </span>
                )}
              </div>
              <p className="text-[12px] leading-[16px] text-[#6f777f]">
                Created {request.created || 'Recently'} • Real-time investor acquisition brief
              </p>
            </div>
          </div>

          {/* Top Quick Actions (Insights, Edit, Close, Archive, Delete, Assign Admin, Export) */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/request-insights?id=${request.id}`}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#06B6C9] bg-[#E8F9FB] px-3 text-[13px] font-semibold text-[#0891A6] hover:bg-[#06B6C9] hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="size-3.5" />
              <span>Request Insights</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#202428] hover:bg-[#eff1f3] transition-all cursor-pointer shadow-xs"
            >
              <Pencil className="size-3.5 text-[#68727D]" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('Closed')}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <CheckCircle2 className="size-3.5 text-[#17b26a]" />
              <span>Close</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('Archived')}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <Archive className="size-3.5 text-[#6f777f]" />
              <span>Archive</span>
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
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <FileDown className="size-3.5 text-[#6f777f]" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* 9 Navigation Sub-Tabs matching exact user specification */}
        <div className="flex items-center gap-1 border-b border-[#E2E5E8] bg-[#F8F9FA] px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'investor', label: '1. Investor' },
            { id: 'requirements', label: '2. Requirements' },
            { id: 'timeline', label: '3. Timeline' },
            { id: 'offers', label: `4. Offers (${request.offers.length})` },
            { id: 'accepted-offer', label: '5. Accepted Offer' },
            { id: 'deal', label: '6. Deal' },
            { id: 'conversation', label: '7. Conversation' },
            { id: 'notes', label: `8. Admin Notes (${adminNotesList.length})` },
            { id: 'history', label: '9. History' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DetailTab)}
              className={cn(
                'flex h-[32px] items-center rounded-[6px] px-3 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'bg-[#202428] text-white font-semibold shadow-xs'
                  : 'text-[#68727D] hover:bg-[#E2E5E8]/60 hover:text-[#202428]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Main Scroll Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#F8F9FA] space-y-4 sm:space-y-6 font-sans">
          {/* TAB 1: INVESTOR & FULL OVERVIEW (Figma Node 2061:3833 / 3869) */}
          {activeTab === 'investor' && (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column (Approx 60%) */}
              <div className="space-y-5 lg:col-span-7 xl:col-span-7">
                {/* 1. Investor Header Card */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <div className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-sm shadow-xs border-2 border-white">
                          <img
                            src={
                              request.investorAvatar ||
                              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
                            }
                            alt={request.investorName}
                            className="size-full object-cover object-center aspect-square"
                          />
                        </div>
                        <div className="absolute -left-1 -top-1">
                          <Flag code={countryCode} className="size-3.5 rounded-xs" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/investors/${request.investorId || (request.investorName === 'Omar Nasser' ? 'IN-2045' : 'IN-2048')}`}
                            className="font-bold text-[16px] text-[#1f2327] font-sans hover:text-[#00c2cb] hover:underline transition-colors flex items-center gap-1"
                          >
                            <span>{request.investorName}</span>
                            <ExternalLink className="size-3 text-[#00c2cb]" />
                          </Link>
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
                      onClick={() => setActiveTab('offers')}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f6f7] px-3 py-1 text-[13px] font-bold text-[#00c2cb] hover:bg-[#00c2cb] hover:text-white transition-all cursor-pointer ant-wave-btn shadow-2xs"
                    >
                      <MessageSquare className="size-3.5" />
                      <span>{request.offersCount} offers</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <p className="text-[16px] sm:text-[17px] font-bold text-[#1f2327] leading-relaxed">
                      {request.title}
                    </p>
                    <div className="mt-2.5 flex items-start gap-2 rounded-[8px] bg-[#f8f9fa] border border-[#d3d5d7] p-3 text-[13px]">
                      <span className="font-bold text-[#6f777f] shrink-0">📄 Note:</span>
                      <p className="font-medium text-[#1f2327] leading-snug">
                        {request.note || 'Flexible on handover date. Minimum 7% rental yield expected.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Full Requirements & Specs Grid */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#d3d5d7]">
                    <h3 className="text-[15px] font-bold text-[#1f2327]">Property Requirements & Criteria</h3>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex h-[30px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-semibold text-[#00c2cb] hover:bg-[#eff1f3]"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit Specs</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-0.5">
                      <span className="text-[#6f777f] text-[11px] font-medium">Acquisition Purpose</span>
                      <p className="font-bold text-[#1f2327]">{request.purpose} ({request.investmentType || 'Residential'})</p>
                    </div>
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-0.5">
                      <span className="text-[#6f777f] text-[11px] font-medium">Property Category</span>
                      <p className="font-bold text-[#1f2327]">{request.propertyType}</p>
                    </div>
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-0.5">
                      <span className="text-[#6f777f] text-[11px] font-medium">Bedrooms Layout</span>
                      <p className="font-bold text-[#1f2327]">{request.bedrooms}</p>
                    </div>
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-0.5">
                      <span className="text-[#6f777f] text-[11px] font-medium">Construction Status</span>
                      <p className="font-bold text-[#1f2327]">{request.unitStatus}</p>
                    </div>
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-0.5">
                      <span className="text-[#6f777f] text-[11px] font-medium">Payment Method</span>
                      <p className="font-bold text-[#1f2327]">{request.paymentMethod}</p>
                    </div>
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-0.5">
                      <span className="text-[#6f777f] text-[11px] font-medium">Payment Plan</span>
                      <p className="font-bold text-[#1f2327]">{request.paymentPlan || 'Standard Handover'}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[12px] font-semibold text-[#1f2327]">Developer Preferences:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {request.developerPreference.selected.map((d) => (
                        <span key={d} className="rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] px-2.5 py-0.5 text-[12px] font-medium text-[#1f2327]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Metrics, Offers Feed & Deal Status */}
              <div className="space-y-5 lg:col-span-5 xl:col-span-5">
                {/* 1. Target Budget & Preferred Areas Card */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1f2327] pb-2 border-b border-[#d3d5d7]">
                    Budget & Target Location
                  </h4>
                  <div className="space-y-3">
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                      <span className="text-[12px] font-medium text-[#6f777f]">Target Acquisition Budget</span>
                      <p className="text-[22px] font-bold text-[#00c2cb] mt-0.5">{request.budget}</p>
                    </div>
                    <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-1.5">
                      <span className="text-[12px] font-medium text-[#6f777f]">Target Areas</span>
                      <div className="flex flex-wrap gap-1.5">
                        {request.preferredAreas.map((area) => (
                          <span key={area} className="rounded bg-white border border-[#d3d5d7] px-2.5 py-0.5 text-[12px] font-medium text-[#1f2327]">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Winning Deal Card (If Matched/Closed) */}
                {request.dealConfirmed && request.dealWinner && (
                  <div className="rounded-[12px] border border-[#dfefe8] bg-[#dfefe8]/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-[#17b26a] text-[13px]">
                      <Award className="size-4" />
                      <span>Deal Awarded Winner</span>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                      <p className="font-bold text-[14px] text-[#1f2327]">{request.dealWinner.name}</p>
                      <p className="text-[12px] text-[#6f777f]">{request.dealWinner.agency} • {request.dealWinner.amount}</p>
                    </div>
                  </div>
                )}

                {/* 3. Live Offers Feed (Figma Original Layout) */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#d3d5d7]">
                    <h4 className="text-[15px] font-bold text-[#1f2327]">{request.offers.length} Offers Submitted</h4>
                    <button
                      type="button"
                      onClick={() => setAllOffersOpen(true)}
                      className="text-[12px] font-bold text-[#00c2cb] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>See all</span>
                      <span className="rounded-full bg-[#e5f6f7] px-1.5 py-0.2 text-[10px] font-bold">
                        {request.offers.length}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {request.offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 space-y-2.5 hover:border-[#00c2cb] transition-colors shadow-2xs font-sans"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] text-white flex items-center justify-center font-bold text-xs">
                              {offer.agentName.split(' ').map((p) => p[0]).join('')}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[13px] text-[#1f2327]">{offer.agentName}</span>
                                <span className="bg-[#e5f6f7] text-[#00c2cb] px-1.5 py-0.2 rounded text-[10px] font-bold">
                                  Pro
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6f777f]">{offer.agency} • ★ {offer.rating}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="block font-bold text-[13px] text-[#1f2327]">{offer.price}</span>
                            <span className="text-[10px] font-semibold text-[#17b26a]">{offer.status}</span>
                          </div>
                        </div>

                        <p className="text-[12px] text-[#6f777f] line-clamp-2 leading-relaxed">
                          {offer.description}
                        </p>

                        {/* Photo Thumbnails */}
                        <div className="grid grid-cols-4 gap-1">
                          {[
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300&auto=format&fit=crop&q=80',
                          ].map((img, i) => (
                            <div key={i} className="h-9 rounded-[4px] overflow-hidden bg-muted">
                              <img src={img} alt="Preview" className="size-full object-cover" />
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
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
                            className="flex-1 rounded-[6px] border border-[#d3d5d7] bg-white py-1 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer text-center"
                          >
                            View Offer
                          </button>

                          {!request.dealConfirmed && (
                            <button
                              type="button"
                              onClick={() => handleAcceptOffer(offer)}
                              className="flex-1 rounded-[6px] bg-[#00c2cb] py-1 text-[12px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-2xs ant-wave-btn text-center"
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
          )}

          {/* TAB 2: REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#d3d5d7]">
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Full Requirements Specification</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#00c2cb] hover:bg-[#eff1f3]"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit Specs</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
                  <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3.5 space-y-1">
                    <span className="text-[#6f777f] font-medium">Acquisition Purpose</span>
                    <p className="font-bold text-[#1f2327]">{request.purpose} ({request.investmentType || 'Residential'})</p>
                  </div>
                  <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3.5 space-y-1">
                    <span className="text-[#6f777f] font-medium">Property Category</span>
                    <p className="font-bold text-[#1f2327]">{request.propertyType}</p>
                  </div>
                  <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3.5 space-y-1">
                    <span className="text-[#6f777f] font-medium">Bedrooms Layout</span>
                    <p className="font-bold text-[#1f2327]">{request.bedrooms}</p>
                  </div>
                  <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3.5 space-y-1">
                    <span className="text-[#6f777f] font-medium">Construction Status</span>
                    <p className="font-bold text-[#1f2327]">{request.unitStatus}</p>
                  </div>
                  <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3.5 space-y-1">
                    <span className="text-[#6f777f] font-medium">Payment Method</span>
                    <p className="font-bold text-[#1f2327]">{request.paymentMethod} {request.mortgageEligibility ? `(${request.mortgageEligibility} pre-approved)` : ''}</p>
                  </div>
                  <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3.5 space-y-1">
                    <span className="text-[#6f777f] font-medium">Payment Plan</span>
                    <p className="font-bold text-[#1f2327]">{request.paymentPlan || 'Standard Handover'}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[13px] font-semibold text-[#1f2327]">Developer Preferences:</span>
                  <div className="flex flex-wrap gap-2">
                    {request.developerPreference.selected.map((d) => (
                      <span key={d} className="rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] px-3 py-1 text-[12px] font-medium text-[#1f2327]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[16px] font-bold text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Request Lifecycle Timeline
              </h3>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3d5d7]">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <span
                      className={cn(
                        'absolute -left-6 top-1 flex size-3 rounded-full border-2 border-white ring-2',
                        step.done ? 'bg-[#17b26a] ring-[#17b26a]/20' : 'bg-[#d3d5d7] ring-[#d3d5d7]/20'
                      )}
                    />
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className={cn('font-bold', step.done ? 'text-[#1f2327]' : 'text-[#6f777f]')}>{step.title}</span>
                        <span className="text-[12px] text-[#6f777f]">{step.date}</span>
                      </div>
                      <p className="text-[12px] text-[#6f777f]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFERS */}
          {activeTab === 'offers' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d3d5d7]">
                <h3 className="text-[16px] font-bold text-[#1f2327]">{request.offers.length} Submitted Proposals</h3>
                <button
                  type="button"
                  onClick={() => setAllOffersOpen(true)}
                  className="text-[13px] font-bold text-[#00c2cb] hover:underline cursor-pointer"
                >
                  See Full Screen View
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.offers.map((offer) => (
                  <div key={offer.id} className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3 shadow-2xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-[14px] text-[#1f2327]">{offer.propertyTitle || 'Property Proposal'}</span>
                        <p className="text-[12px] text-[#6f777f]">{offer.agentName} ({offer.agency})</p>
                      </div>
                      <span className="font-bold text-[14px] text-[#00c2cb]">{offer.price}</span>
                    </div>
                    <p className="text-[12px] text-[#6f777f] line-clamp-2">{offer.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#d3d5d7]">
                      <span className="text-[12px] font-semibold text-[#17b26a]">★ {offer.rating} rating</span>
                      {!request.dealConfirmed && (
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(offer)}
                          className="h-[30px] rounded-[6px] bg-[#00c2cb] px-3 text-[12px] font-bold text-white hover:opacity-90 cursor-pointer shadow-2xs"
                        >
                          Accept Offer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCEPTED OFFER */}
          {activeTab === 'accepted-offer' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[16px] font-bold text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Accepted Broker Proposal
              </h3>
              {request.dealConfirmed && request.dealWinner ? (
                <div className="space-y-4">
                  <div className="rounded-[8px] bg-[#dfefe8] border border-[#17b26a]/30 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[14px] font-bold text-[#17b26a]">Winner: {request.dealWinner.name}</span>
                      <p className="text-[12px] text-[#1f2327] mt-0.5">Agreed Price: {request.dealWinner.amount} • {request.dealWinner.agency}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-[#17b26a]">Proposal Accepted</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                      <span className="text-[#6f777f] font-medium">Agreed Purchase Value</span>
                      <p className="text-[15px] font-bold text-[#00c2cb] mt-1">{request.dealWinner.amount}</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                      <span className="text-[#6f777f] font-medium">Confirmed On</span>
                      <p className="text-[15px] font-bold text-[#1f2327] mt-1">{request.dealWinner.date}</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                      <span className="text-[#6f777f] font-medium">Assigned Agency</span>
                      <p className="text-[15px] font-bold text-[#1f2327] mt-1">{request.dealWinner.agency}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-8 text-center text-[13px] text-[#6f777f]">
                  No proposal has been officially accepted yet. Open the Offers tab to award a broker.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: DEAL */}
          {activeTab === 'deal' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[16px] font-bold text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Deal & Escrow Settlement
              </h3>
              {request.dealConfirmed && request.dealWinner ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                      <span className="text-[#6f777f] font-medium">Standard Broker Commission (2%)</span>
                      <p className="text-[15px] font-bold text-[#1f2327] mt-1">AED 93,000</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                      <span className="text-[#6f777f] font-medium">DLD Transfer Fee (4%)</span>
                      <p className="text-[15px] font-bold text-[#1f2327] mt-1">AED 186,000</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                      <span className="text-[#6f777f] font-medium">Estimated Handover</span>
                      <p className="text-[15px] font-bold text-[#17b26a] mt-1">15 June 2026</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-8 text-center text-[13px] text-[#6f777f]">
                  Escrow and settlement details will be activated once a deal is awarded.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CONVERSATION */}
          {activeTab === 'conversation' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[16px] font-bold text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Live Chat & Negotiations
              </h3>
              <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 h-[280px] overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex flex-col max-w-[80%] rounded-[8px] p-3 text-[13px]',
                      msg.from === 'user'
                        ? 'ml-auto bg-[#1f2327] text-white'
                        : 'mr-auto bg-white border border-[#d3d5d7] text-[#1f2327]'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 text-[11px] opacity-70 mb-1">
                      <span className="font-semibold">{msg.name}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type administrative dispatch or note to investor/agent..."
                  className="h-[38px] flex-1 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                />
                <button
                  type="submit"
                  className="h-[38px] rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-bold text-white hover:opacity-90"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: ADMIN NOTES */}
          {activeTab === 'notes' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d3d5d7]">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Internal Compliance & Admin Notes</h3>
                <span className="text-[12px] text-[#6f777f]">Visible to admins only</span>
              </div>

              <form onSubmit={handleAddAdminNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Write internal note or compliance audit comment for this request..."
                  className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="h-[34px] rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 pt-2">
                {adminNotesList.map((n) => (
                  <div key={n.id} className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#1f2327]">{n.author}</span>
                      <span className="text-[#6f777f]">{n.date}</span>
                    </div>
                    <p className="text-[13px] text-[#1f2327]">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: HISTORY & AUDIT */}
          {activeTab === 'history' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[16px] font-bold text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Audit Trail & History
              </h3>
              <div className="space-y-2 text-[13px]">
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1f2327]">Request Created</span>
                    <p className="text-[12px] text-[#6f777f]">Posted by {request.investorName} from mobile app</p>
                  </div>
                  <span className="text-[12px] text-[#6f777f]">{request.created || '28 May 2026'}</span>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1f2327]">Broadcast to Brokers</span>
                    <p className="text-[12px] text-[#6f777f]">Dispatched to 48 verified agents matching villa category</p>
                  </div>
                  <span className="text-[12px] text-[#6f777f]">28 May 2026, 09:15</span>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1f2327]">12 Offers Received</span>
                    <p className="text-[12px] text-[#6f777f]">Verified agents submitted competitive proposals</p>
                  </div>
                  <span className="text-[12px] text-[#6f777f]">Today, 10:30</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] bg-white px-6 py-3.5 font-sans">
          <span className="text-[13px] text-[#6f777f]">
            Duseat Real Estate Platform • Request Ref #{request.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] bg-[#1f2327] px-5 text-[13px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
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
