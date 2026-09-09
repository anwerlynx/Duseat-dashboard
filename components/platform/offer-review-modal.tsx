'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  X,
  Building,
  User,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flag as FlagIcon,
  Trash2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Briefcase,
  Play,
  Eye,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode } from '@/components/ui/flag'
import type { PlatformOffer, OfferDocument } from '@/lib/offers-data'

interface OfferReviewModalProps {
  offer: PlatformOffer
  onClose: () => void
  onApprove: (offerId: string) => void
  onReject: (offerId: string, reason: string) => void
  onFlag: (offerId: string, reason: string) => void
  onDelete: (offerId: string) => void
}

type TabType = 'overview' | 'agent' | 'request' | 'property' | 'documents' | 'financials' | 'timeline' | 'history'

export function OfferReviewModal({
  offer,
  onClose,
  onApprove,
  onReject,
  onFlag,
  onDelete,
}: OfferReviewModalProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')
  const [activePhotoIdx, setActivePhotoIdx] = React.useState(0)
  const [showRejectForm, setShowRejectForm] = React.useState(false)
  const [showFlagForm, setShowFlagForm] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState('')
  const [flagReason, setFlagReason] = React.useState('')

  const countryCode = getCountryCode(offer.investorCountry)

  const handleApproveClick = () => {
    onApprove(offer.id)
  }

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectReason.trim()) return
    onReject(offer.id, rejectReason.trim())
    setShowRejectForm(false)
  }

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!flagReason.trim()) return
    onFlag(offer.id, flagReason.trim())
    setShowFlagForm(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* =========================================================================
            MODAL HEADER
           ========================================================================= */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] px-5 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#1f2327]">
              <Building className="size-6 text-[#00c2cb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] sm:text-[20px] font-medium text-[#1f2327]">{offer.propertyTitle}</h2>
                <span className="font-mono text-[12px] font-medium text-[#6f777f] rounded-[4px] bg-[#eff1f3] px-2 py-0.5">
                  {offer.id}
                </span>
                <FigmaStatusBadge status={offer.status} />
              </div>
              <p className="text-[12px] text-[#6f777f] flex items-center gap-2 mt-0.5">
                <span>
                  Agent:{' '}
                  <Link
                    href={`/agents/${offer.agentId || 'AG-1048'}`}
                    className="text-[#1f2327] font-medium hover:text-[#00c2cb] hover:underline"
                  >
                    {offer.agentName}
                  </Link>{' '}
                  ({offer.agentAgency})
                </span>
                <span>•</span>
                <span>Offer Price: <strong className="text-[#00c2cb] font-medium">{offer.price}</strong></span>
                <span>•</span>
                <span>Submitted: {offer.submittedAt}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApproveClick}
              disabled={offer.status === 'Accepted'}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#17b26a] px-3.5 text-[13px] font-medium text-white hover:bg-[#139757] disabled:opacity-50 transition-colors cursor-pointer shadow-2xs ant-wave-btn"
            >
              <CheckCircle2 className="size-4" />
              <span>Approve Offer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowRejectForm(true)
                setShowFlagForm(false)
              }}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3 text-[13px] font-medium text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer"
            >
              <XCircle className="size-4" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowFlagForm(true)
                setShowRejectForm(false)
              }}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#f79009]/30 bg-[#fffaf0] px-3 text-[13px] font-medium text-[#b54708] hover:bg-[#fffaf0]/80 transition-colors cursor-pointer"
            >
              <FlagIcon className="size-3.5" />
              <span>Flag</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(offer.id)}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#f3e1e0] hover:text-[#d92d20] transition-colors cursor-pointer"
              title="Delete Offer"
            >
              <Trash2 className="size-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* SUB-TABS: All 7 requested detail views */}
        <div className="flex items-center gap-1 border-b border-[#d3d5d7] bg-white px-5 py-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Summary' },
            { id: 'agent', label: '1. Agent Details' },
            { id: 'request', label: '2. Investor Request' },
            { id: 'property', label: '3. Property Specs' },
            { id: 'documents', label: `4. Documents (${offer.documents.length})` },
            { id: 'financials', label: '5. Offer Price & Terms' },
            { id: 'timeline', label: '6. Timeline' },
            { id: 'history', label: `7. History (${offer.history.length})` },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                'flex h-[32px] items-center rounded-[6px] px-3 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'bg-[#1f2327] text-white font-medium shadow-2xs'
                  : 'text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* REJECTION / FLAG ACCORDION FORMS */}
        {showRejectForm && (
          <form onSubmit={handleRejectSubmit} className="bg-[#f3e1e0]/60 border-b border-[#d92d20]/20 p-4 space-y-2.5 ant-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#d92d20] flex items-center gap-1.5">
                <AlertTriangle className="size-4" />
                Specify reason for offer rejection:
              </span>
              <button type="button" onClick={() => setShowRejectForm(false)} className="text-[12px] text-[#6f777f] hover:text-[#1f2327]">
                Cancel
              </button>
            </div>
            <textarea
              required
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Property location out of requested zone, price discrepancy, or missing developer NOC..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 text-[13px] text-[#1f2327] placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button type="submit" className="h-[32px] rounded-[6px] bg-[#d92d20] px-4 text-[12px] font-medium text-white hover:bg-[#b92518] shadow-2xs">
                Confirm Rejection
              </button>
            </div>
          </form>
        )}

        {showFlagForm && (
          <form onSubmit={handleFlagSubmit} className="bg-[#fffaf0] border-b border-[#f79009]/30 p-4 space-y-2.5 ant-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#b54708] flex items-center gap-1.5">
                <FlagIcon className="size-4 text-[#f79009]" />
                Flag offer for compliance audit:
              </span>
              <button type="button" onClick={() => setShowFlagForm(false)} className="text-[12px] text-[#6f777f] hover:text-[#1f2327]">
                Cancel
              </button>
            </div>
            <textarea
              required
              rows={2}
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Specify risk trigger (e.g. Unverified title deed, high price markup, duplicate submission)..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 text-[13px] text-[#1f2327] placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button type="submit" className="h-[32px] rounded-[6px] bg-[#f79009] px-4 text-[12px] font-medium text-white hover:bg-[#d97706] shadow-2xs">
                Confirm Flag
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            MAIN SCROLLABLE BODY
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#f8f9fa]">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Photo Gallery & Headline */}
              <div className="lg:col-span-7 space-y-4">
                {/* Main Photo Gallery Carousel */}
                <div className="relative rounded-[10px] overflow-hidden bg-black aspect-video border border-[#d3d5d7]">
                  <img
                    src={offer.photos[activePhotoIdx] || offer.photos[0]}
                    alt={offer.propertyTitle}
                    className="size-full object-cover"
                  />
                  {offer.photos.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-3 pointer-events-none">
                      <button
                        type="button"
                        onClick={() => setActivePhotoIdx((p) => (p > 0 ? p - 1 : offer.photos.length - 1))}
                        className="size-8 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black/80"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePhotoIdx((p) => (p < offer.photos.length - 1 ? p + 1 : 0))}
                        className="size-8 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black/80"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-medium text-white">
                    {activePhotoIdx + 1} / {offer.photos.length}
                  </span>
                </div>

                {/* Thumbnails row */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {offer.photos.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePhotoIdx(i)}
                      className={cn(
                        'size-16 rounded-[6px] overflow-hidden border-2 shrink-0 transition-all cursor-pointer',
                        activePhotoIdx === i ? 'border-[#00c2cb] ring-1 ring-[#00c2cb]' : 'border-[#d3d5d7] opacity-70'
                      )}
                    >
                      <img src={photo} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2">
                  <h4 className="text-[13px] font-medium text-[#1f2327] uppercase tracking-wider">Agent Proposal Description</h4>
                  <p className="text-[13px] text-[#1f2327] leading-relaxed">{offer.description}</p>
                </div>
              </div>

              {/* Right Summary Cards */}
              <div className="lg:col-span-5 space-y-4">
                {/* Pricing Card */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3">
                  <span className="text-[12px] text-[#6f777f] font-medium">Proposed Asking Price</span>
                  <p className="text-[26px] font-medium text-[#00c2cb] leading-tight">{offer.price}</p>
                  <div className="grid grid-cols-2 gap-2 text-[12px] pt-1 border-t border-[#d3d5d7]">
                    <div>
                      <span className="text-[#6f777f] block">Est. Commission</span>
                      <strong className="text-[#1f2327] font-medium">{offer.commission}</strong>
                    </div>
                    <div>
                      <span className="text-[#6f777f] block">Payment Plan</span>
                      <strong className="text-[#1f2327] font-medium">{offer.paymentPlan}</strong>
                    </div>
                  </div>
                </div>

                {/* Key Specs Card */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2.5">
                  <h4 className="text-[13px] font-medium text-[#1f2327] pb-1.5 border-b border-[#d3d5d7]">Unit Highlights</h4>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div>
                      <span className="text-[#6f777f] block">Property Type</span>
                      <strong className="text-[#1f2327] font-medium">{offer.propertyType}</strong>
                    </div>
                    <div>
                      <span className="text-[#6f777f] block">Bedrooms</span>
                      <strong className="text-[#1f2327] font-medium">{offer.bedrooms} ({offer.bathrooms})</strong>
                    </div>
                    <div>
                      <span className="text-[#6f777f] block">Built-up Area</span>
                      <strong className="text-[#1f2327] font-medium">{offer.sizeSqFt}</strong>
                    </div>
                    <div>
                      <span className="text-[#6f777f] block">Handover</span>
                      <strong className="text-[#17b26a] font-medium">{offer.handoverDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Linked Investor Card */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2">
                  <span className="text-[12px] text-[#6f777f] font-medium">Target Investor Request</span>
                  <div className="flex items-center gap-2.5 pt-1">
                    <Link href={`/investors/${offer.investorId || 'IN-2048'}`}>
                      <img
                        src={offer.investorAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'}
                        alt={offer.investorName}
                        className="size-8 rounded-full object-cover border border-[#d3d5d7] hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/investors/${offer.investorId || 'IN-2048'}`}
                        className="text-[13px] font-medium text-[#1f2327] hover:text-[#00c2cb] hover:underline block"
                      >
                        {offer.investorName}
                      </Link>
                      <Link
                        href={`/requests?id=${offer.requestId}`}
                        className="font-mono text-[11px] font-bold text-[#00c2cb] hover:underline block"
                        title={`Open Request ${offer.requestId}`}
                      >
                        {offer.requestId}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: AGENT */}
          {activeTab === 'agent' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d3d5d7]">
                <div className="flex items-center gap-3">
                  <img
                    src={offer.agentAvatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'}
                    alt={offer.agentName}
                    className="size-12 rounded-[8px] object-cover border border-[#d3d5d7]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-medium text-[#1f2327]">{offer.agentName}</h3>
                      <span className="rounded bg-[#eaf2ff] text-[#3366ff] px-2 py-0.5 text-[11px] font-medium">
                        {offer.agentPlan}
                      </span>
                      <span className="rounded bg-[#dfefe8] text-[#17b26a] px-2 py-0.5 text-[11px] font-medium flex items-center gap-1">
                        <ShieldCheck className="size-3" />
                        RERA Verified
                      </span>
                    </div>
                    <p className="text-[12px] text-[#6f777f]">{offer.agentAgency} • Broker ID: {offer.agentId}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                  <span className="text-[#6f777f] font-medium">Customer Rating</span>
                  <p className="text-[16px] font-medium text-[#f79009] mt-1">★ {offer.agentRating} / 5.0</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                  <span className="text-[#6f777f] font-medium">Closed Deals on Duseat</span>
                  <p className="text-[16px] font-medium text-[#1f2327] mt-1">{offer.agentDeals} Deals</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
                  <span className="text-[#6f777f] font-medium">Brokerage Status</span>
                  <p className="text-[16px] font-medium text-[#17b26a] mt-1">Active / In Good Standing</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVESTOR REQUEST */}
          {activeTab === 'request' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d3d5d7]">
                <h3 className="text-[16px] font-medium text-[#1f2327]">Connected Investor Brief</h3>
                <span className="font-mono font-medium text-[13px] text-[#00c2cb]">{offer.requestId}</span>
              </div>
              <div className="p-4 rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] space-y-2">
                <div className="flex items-center gap-2">
                  <Flag code={countryCode} className="size-4 rounded-xs" />
                  <strong className="text-[14px] font-medium text-[#1f2327]">{offer.investorName}</strong>
                  <span className="text-[12px] text-[#6f777f]">({offer.investorCountry})</span>
                </div>
                <p className="text-[14px] font-medium text-[#1f2327]">{offer.requestTitle}</p>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTY */}
          {activeTab === 'property' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <h3 className="text-[16px] font-medium text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Complete Property Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[#6f777f] block">Category</span>
                  <strong className="text-[#1f2327] font-medium">{offer.propertyType}</strong>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[#6f777f] block">Bedrooms</span>
                  <strong className="text-[#1f2327] font-medium">{offer.bedrooms}</strong>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[#6f777f] block">Bathrooms</span>
                  <strong className="text-[#1f2327] font-medium">{offer.bathrooms}</strong>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[#6f777f] block">Area Size</span>
                  <strong className="text-[#1f2327] font-medium">{offer.sizeSqFt}</strong>
                </div>
              </div>
              <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-1 text-[13px]">
                <span className="text-[#6f777f] block">Full Location Address</span>
                <p className="font-medium text-[#1f2327] flex items-center gap-1.5">
                  <MapPin className="size-4 text-[#00c2cb]" />
                  {offer.propertyLocation}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <h3 className="text-[16px] font-medium text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Uploaded Property Documents & Certificates ({offer.documents.length})
              </h3>
              <div className="space-y-2.5">
                {offer.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-[6px] bg-white border border-[#d3d5d7]">
                        <FileCheck className="size-4.5 text-[#00c2cb]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#1f2327]">{doc.name}</p>
                        <span className="text-[11px] text-[#6f777f]">{doc.type} • {doc.size} • {doc.uploadedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#dfefe8] text-[#17b26a] px-2 py-0.5 text-[11px] font-medium">
                        {doc.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => alert(`Opening ${doc.name}`)}
                        className="flex h-[30px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-medium text-[#1f2327] hover:bg-[#eff1f3]"
                      >
                        <Eye className="size-3.5 text-[#00c2cb]" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <h3 className="text-[16px] font-medium text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Offer Financial Breakdown & Terms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-4">
                  <span className="text-[#6f777f]">Total Purchase Price</span>
                  <p className="text-[20px] font-medium text-[#00c2cb] mt-1">{offer.price}</p>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-4">
                  <span className="text-[#6f777f]">Broker Commission (2%)</span>
                  <p className="text-[20px] font-medium text-[#1f2327] mt-1">{offer.commission}</p>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-4">
                  <span className="text-[#6f777f]">Payment Structure</span>
                  <p className="text-[16px] font-medium text-[#17b26a] mt-1">{offer.paymentPlan}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <h3 className="text-[16px] font-medium text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Offer Lifecycle Timeline
              </h3>
              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3d5d7]">
                {offer.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <span
                      className={cn(
                        'absolute -left-6 top-1 flex size-3 rounded-full border-2 border-white ring-2',
                        step.done ? 'bg-[#17b26a] ring-[#17b26a]/20' : 'bg-[#d3d5d7] ring-[#d3d5d7]/20'
                      )}
                    />
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1 text-[13px]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#1f2327]">{step.title}</span>
                        <span className="text-[12px] text-[#6f777f]">{step.date}</span>
                      </div>
                      <p className="text-[12px] text-[#6f777f]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: HISTORY */}
          {activeTab === 'history' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <h3 className="text-[16px] font-medium text-[#1f2327] pb-3 border-b border-[#d3d5d7]">
                Audit History Trail ({offer.history.length})
              </h3>
              <div className="space-y-2.5 text-[13px]">
                {offer.history.map((evt) => (
                  <div key={evt.id} className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1f2327]">{evt.action}</span>
                      <span className="text-[12px] text-[#6f777f]">{evt.timestamp}</span>
                    </div>
                    <p className="text-[12px] text-[#6f777f]">{evt.details}</p>
                    <span className="text-[11px] text-[#9da4ae]">Actor: {evt.actor} ({evt.actorRole})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] bg-white px-6 py-3.5">
          <span className="text-[13px] text-[#6f777f]">
            Offer Ref: <strong className="font-mono font-medium text-[#1f2327]">{offer.id}</strong> • Target: {offer.requestId}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] bg-[#1f2327] px-5 text-[13px] font-medium text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
