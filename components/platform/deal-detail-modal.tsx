'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  Building,
  User,
  ShieldCheck,
  Download,
  Share2,
  Clock,
  Briefcase,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  Edit2,
  Check,
  CreditCard,
  Layers,
  MapPin,
  ArrowRight,
  Shield,
  FileCheck,
} from 'lucide-react'
import { FigmaStatusBadge, AgentPlanBadge } from '@/components/ui/figma-badges'
import { AvatarFlagOverlay, Flag, getCountryCode } from '@/components/ui/flag'
import { cn } from '@/lib/utils'
import type { PlatformDeal, DealStatus, DealNote } from '@/lib/deals-data'

interface DealDetailModalProps {
  deal: PlatformDeal
  isOpen: boolean
  onClose: () => void
  onComplete: (dealId: string) => void
  onCancel: (dealId: string) => void
  onAssignManager: (dealId: string) => void
}

type TabType =
  | 'overview'
  | 'investor'
  | 'agent'
  | 'property'
  | 'timeline'
  | 'documents'
  | 'payments'
  | 'commission'
  | 'conversation'
  | 'notes'
  | 'history'

export function DealDetailModal({
  deal,
  isOpen,
  onClose,
  onComplete,
  onCancel,
  onAssignManager,
}: DealDetailModalProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')
  const [copied, setCopied] = React.useState(false)

  // Internal Notes State
  const [notes, setNotes] = React.useState<DealNote[]>(deal.notes || [])
  const [newNoteText, setNewNoteText] = React.useState('')
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null)
  const [editingNoteText, setEditingNoteText] = React.useState('')

  // Conversation snippet
  const [chatLog, setChatLog] = React.useState(deal.conversation || [])

  // Sync state when deal changes
  React.useEffect(() => {
    setNotes(deal.notes || [])
    setChatLog(deal.conversation || [])
  }, [deal])

  if (!isOpen) return null

  const countryCode = getCountryCode(deal.investorCountry)
  const agentCountryCode = getCountryCode(deal.agentCountry)

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(deal.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    const note: DealNote = {
      id: `note-${Date.now()}`,
      author: 'Ahmad Khaled',
      role: 'Super Admin',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text: newNoteText.trim(),
    }
    setNotes([note, ...notes])
    setNewNoteText('')
  }

  const handleSaveEditNote = (noteId: string) => {
    if (!editingNoteText.trim()) return
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, text: editingNoteText.trim() } : n)))
    setEditingNoteId(null)
    setEditingNoteText('')
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview & Summary' },
    { id: 'investor', label: 'Investor' },
    { id: 'agent', label: 'Agent' },
    { id: 'property', label: 'Property' },
    { id: 'timeline', label: 'Timeline', count: deal.timeline.length },
    { id: 'documents', label: 'Documents', count: deal.documents.length },
    { id: 'payments', label: 'Payments', count: deal.payments.length },
    { id: 'commission', label: 'Commission' },
    { id: 'conversation', label: 'Conversation', count: chatLog.length },
    { id: 'notes', label: 'Notes', count: notes.length },
    { id: 'history', label: 'Audit History' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* =========================================================================
            1. MODAL HEADER (Matching Offers Specification)
           ========================================================================= */}
        <div className="flex shrink-0 flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] px-5 py-4 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#1f2327]">
              <Building className="size-6 text-[#00c2cb]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1f2327]">{deal.propertyTitle}</h2>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="font-mono text-[12px] font-semibold text-[#00c2cb] rounded-[4px] bg-[#e5f6f7] px-2 py-0.5 hover:bg-[#d6f0f2] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy Deal ID"
                >
                  <span>{deal.id}</span>
                  {copied ? <Check className="size-3 text-[#17b26a]" /> : <Copy className="size-3" />}
                </button>
                <FigmaStatusBadge status={deal.status} />
              </div>
              <p className="text-[12px] text-[#6f777f] flex flex-wrap items-center gap-2 mt-0.5">
                <span>Investor: <strong className="text-[#1f2327] font-semibold">{deal.investorName}</strong></span>
                <span>•</span>
                <span>Agent: <strong className="text-[#1f2327] font-semibold">{deal.agentName}</strong> ({deal.agentAgency})</span>
                <span>•</span>
                <span>Value: <strong className="text-[#00c2cb] font-bold">{deal.dealValue}</strong></span>
                <span>•</span>
                <span>Created: {deal.startDate}</span>
              </p>
            </div>
          </div>

          {/* Contextual Action Buttons in Header */}
          <div className="flex items-center gap-2 shrink-0">
            {deal.status === 'Active' && (
              <>
                <button
                  type="button"
                  onClick={() => onComplete(deal.id)}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#17b26a] px-3.5 text-[13px] font-medium text-white hover:bg-[#139757] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Complete Deal</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCancel(deal.id)}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3 text-[13px] font-medium text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer"
                >
                  <XCircle className="size-4" />
                  <span>Cancel Deal</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => onAssignManager(deal.id)}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <User className="size-4 text-[#6f777f]" />
              <span>Assign Manager</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. TAB NAVIGATION BAR (Matching Offers Specification)
           ========================================================================= */}
        <div className="flex shrink-0 items-center gap-1 border-b border-[#d3d5d7] bg-white px-5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex h-[44px] items-center gap-1.5 border-b-2 px-3 text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer',
                activeTab === tab.id
                  ? 'border-[#00c2cb] text-[#00c2cb] font-semibold'
                  : 'border-transparent text-[#6f777f] hover:text-[#1f2327]'
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                    activeTab === tab.id
                      ? 'bg-[#e5f6f7] text-[#00848b]'
                      : 'bg-[#eff1f3] text-[#6f777f]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* =========================================================================
            3. MODAL BODY: 10 STRUCTURED SECTIONS
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* SECTION 1: OVERVIEW & SUMMARY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Snapshot Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4">
                  <p className="text-[12px] font-medium text-[#6f777f]">Total Deal Value</p>
                  <p className="text-[20px] font-bold text-[#1f2327] mt-1">{deal.dealValue}</p>
                  <p className="text-[11px] text-[#6f777f] mt-0.5">Agreed Transaction Price</p>
                </div>
                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4">
                  <p className="text-[12px] font-medium text-[#6f777f]">Total Commission</p>
                  <p className="text-[20px] font-bold text-[#00c2cb] mt-1">{deal.commissionAmount}</p>
                  <p className="text-[11px] text-[#6f777f] mt-0.5">Rate: {deal.commissionRate}</p>
                </div>
                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4">
                  <p className="text-[12px] font-medium text-[#6f777f]">Escrow Status</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="size-2 rounded-full bg-[#17b26a]" />
                    <span className="text-[16px] font-bold text-[#17b26a]">{deal.escrowStatus}</span>
                  </div>
                  <p className="text-[11px] text-[#6f777f] mt-0.5">{deal.escrowAmount}</p>
                </div>
                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4">
                  <p className="text-[12px] font-medium text-[#6f777f]">Assigned Deal Manager</p>
                  <p className="text-[16px] font-bold text-[#1f2327] mt-1 truncate">{deal.assignedManager}</p>
                  <p className="text-[11px] text-[#6f777f] mt-0.5">{deal.managerEmail}</p>
                </div>
              </div>

              {/* Deal Parties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Investor Box */}
                <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                    <span className="text-[12px] font-semibold text-[#6f777f]">Investor (Buyer)</span>
                    <Link
                      href={`/investors/${deal.investorId}`}
                      className="text-[12px] font-semibold text-[#00c2cb] hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <AvatarFlagOverlay code={countryCode}>
                      <img
                        src={deal.investorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                        alt={deal.investorName}
                        className="size-11 rounded-full object-cover border border-[#d3d5d7]"
                      />
                    </AvatarFlagOverlay>
                    <div className="min-w-0">
                      <p className="font-semibold text-[14px] text-[#1f2327]">{deal.investorName}</p>
                      <p className="text-[12px] text-[#6f777f]">{deal.investorEmail}</p>
                      <p className="text-[12px] font-mono text-[#6f777f]">{deal.investorPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Agent Box */}
                <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                    <span className="text-[12px] font-semibold text-[#6f777f]">Licensed Agent</span>
                    <Link
                      href={`/agents/${deal.agentId}`}
                      className="text-[12px] font-semibold text-[#00c2cb] hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <AvatarFlagOverlay code={agentCountryCode}>
                      <img
                        src={deal.agentAvatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'}
                        alt={deal.agentName}
                        className="size-11 rounded-full object-cover border border-[#d3d5d7]"
                      />
                    </AvatarFlagOverlay>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-[14px] text-[#1f2327]">{deal.agentName}</p>
                        <AgentPlanBadge plan={deal.agentPlan} compact />
                      </div>
                      <p className="text-[12px] text-[#6f777f]">{deal.agentAgency}</p>
                      <p className="text-[12px] font-mono text-[#6f777f]">{deal.agentEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Snapshot */}
              <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-white flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={deal.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                  alt={deal.propertyTitle}
                  className="size-24 rounded-[8px] object-cover border border-[#d3d5d7] shrink-0"
                />
                <div className="flex-1 space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[#1f2327]">{deal.propertyTitle}</h3>
                    <span className="font-mono text-[12px] text-[#00c2cb] font-semibold">Ref: {deal.offerId}</span>
                  </div>
                  <p className="text-[13px] text-[#6f777f] flex items-center gap-1">
                    <MapPin className="size-3.5 text-[#00c2cb]" />
                    <span>{deal.propertyLocation}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className="rounded bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">{deal.propertyType}</span>
                    <span className="rounded bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">{deal.bedrooms}</span>
                    <span className="rounded bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">{deal.sizeSqFt}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: INVESTOR */}
          {activeTab === 'investor' && (
            <div className="rounded-[10px] border border-[#d3d5d7] p-6 bg-white space-y-5">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-4">
                <div className="flex items-center gap-3">
                  <AvatarFlagOverlay code={countryCode}>
                    <img
                      src={deal.investorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                      alt={deal.investorName}
                      className="size-14 rounded-full object-cover border border-[#d3d5d7]"
                    />
                  </AvatarFlagOverlay>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#1f2327]">{deal.investorName}</h3>
                    <p className="text-[12px] text-[#6f777f]">Investor ID: {deal.investorId} • KYC Verified</p>
                  </div>
                </div>
                <Link
                  href={`/investors/${deal.investorId}`}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#00adb5] transition-colors"
                >
                  <span>Open Full Profile</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Email Address</span>
                  <p className="font-medium text-[13px] text-[#1f2327] mt-0.5">{deal.investorEmail}</p>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Phone Number</span>
                  <p className="font-mono text-[13px] text-[#1f2327] mt-0.5">{deal.investorPhone}</p>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Country of Origin</span>
                  <p className="font-medium text-[13px] text-[#1f2327] mt-0.5">{deal.investorCountry}</p>
                </div>
              </div>

              {/* Linked Request */}
              <div className="rounded-[8px] bg-[#e5f6f7]/40 border border-[#00c2cb]/30 p-4 space-y-1.5">
                <span className="text-[12px] font-semibold text-[#00848b]">Linked Investor Request:</span>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-[#1f2327]">
                    Request ID: <strong className="font-mono text-[#00c2cb]">{deal.requestId}</strong> ({deal.propertyType} in {deal.propertyLocation})
                  </p>
                  <Link
                    href={deal.requestId ? `/request-insights?id=${deal.requestId}` : '/requests'}
                    className="text-[12px] font-semibold text-[#00c2cb] hover:underline flex items-center gap-1"
                  >
                    View Request Insights <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: AGENT */}
          {activeTab === 'agent' && (
            <div className="rounded-[10px] border border-[#d3d5d7] p-6 bg-white space-y-5">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-4">
                <div className="flex items-center gap-3">
                  <AvatarFlagOverlay code={agentCountryCode}>
                    <img
                      src={deal.agentAvatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'}
                      alt={deal.agentName}
                      className="size-14 rounded-full object-cover border border-[#d3d5d7]"
                    />
                  </AvatarFlagOverlay>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-bold text-[#1f2327]">{deal.agentName}</h3>
                      <AgentPlanBadge plan={deal.agentPlan} />
                    </div>
                    <p className="text-[12px] text-[#6f777f]">{deal.agentAgency} • Agent ID: {deal.agentId}</p>
                  </div>
                </div>
                <Link
                  href={`/agents/${deal.agentId}`}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#00adb5] transition-colors"
                >
                  <span>Open Agent Profile</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Licensed Agency</span>
                  <p className="font-medium text-[13px] text-[#1f2327] mt-0.5">{deal.agentAgency}</p>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Official Email</span>
                  <p className="font-mono text-[13px] text-[#1f2327] mt-0.5">{deal.agentEmail}</p>
                </div>
                <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3">
                  <span className="text-[11px] font-semibold text-[#6f777f]">RERA Compliance Status</span>
                  <p className="font-semibold text-[13px] text-[#17b26a] mt-0.5">Licensed & Active</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PROPERTY */}
          {activeTab === 'property' && (
            <div className="space-y-4">
              <div className="rounded-[10px] border border-[#d3d5d7] overflow-hidden bg-white">
                <img
                  src={deal.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                  alt={deal.propertyTitle}
                  className="h-60 w-full object-cover"
                />
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-[20px] font-bold text-[#1f2327]">{deal.propertyTitle}</h3>
                    <p className="text-[13px] text-[#6f777f] flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3.5 text-[#00c2cb]" />
                      <span>{deal.propertyLocation}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                      <span className="text-[11px] text-[#6f777f]">Property Type</span>
                      <p className="font-semibold text-[14px] text-[#1f2327] mt-0.5">{deal.propertyType}</p>
                    </div>
                    <div className="p-3 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                      <span className="text-[11px] text-[#6f777f]">Bedrooms</span>
                      <p className="font-semibold text-[14px] text-[#1f2327] mt-0.5">{deal.bedrooms}</p>
                    </div>
                    <div className="p-3 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                      <span className="text-[11px] text-[#6f777f]">Built-up Area</span>
                      <p className="font-semibold text-[14px] text-[#1f2327] mt-0.5">{deal.sizeSqFt}</p>
                    </div>
                    <div className="p-3 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                      <span className="text-[11px] text-[#6f777f]">Agreed Price</span>
                      <p className="font-bold text-[14px] text-[#00c2cb] mt-0.5">{deal.dealValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="divide-y divide-[#d3d5d7] rounded-[10px] border border-[#d3d5d7] bg-white p-5">
                {deal.timeline.map((step, idx) => (
                  <div key={step.id} className="py-4 flex items-start gap-3.5">
                    <div
                      className={cn(
                        'flex size-7 items-center justify-center rounded-full shrink-0 mt-0.5 text-xs font-bold',
                        step.done
                          ? 'bg-[#17b26a] text-white'
                          : 'bg-[#eff1f3] text-[#6f777f] border border-[#d3d5d7]'
                      )}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[14px] text-[#1f2327]">{step.title}</p>
                        <span className="text-[12px] font-mono text-[#6f777f]">{step.date}</span>
                      </div>
                      <p className="text-[13px] text-[#6f777f] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {deal.documents.length === 0 ? (
                <div className="py-12 text-center rounded-[10px] border border-[#d3d5d7] bg-white text-sm text-[#6f777f]">
                  No formal conveyance documents attached to this deal yet.
                </div>
              ) : (
                <div className="divide-y divide-[#d3d5d7] rounded-[10px] border border-[#d3d5d7] bg-white">
                  {deal.documents.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-[#fcfcfc]">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb]">
                          <FileText className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-[14px] text-[#1f2327]">{doc.name}</p>
                          <p className="text-[12px] text-[#6f777f]">
                            {doc.type} • {doc.size} • Uploaded {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#dfefe8] px-2.5 py-0.5 text-[11px] font-bold text-[#17b26a]">
                          {doc.status}
                        </span>
                        <a
                          href={doc.url}
                          download
                          className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]"
                          title="Download document"
                        >
                          <Download className="size-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 7: PAYMENTS & ESCROW */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-semibold text-[#6f777f]">Escrow Security Balance</span>
                  <p className="text-[20px] font-bold text-[#17b26a] mt-0.5">{deal.escrowAmount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#17b26a]" />
                  <span className="text-[13px] font-semibold text-[#17b26a]">Protected Under Central Bank Escrow</span>
                </div>
              </div>

              <div className="divide-y divide-[#d3d5d7] rounded-[10px] border border-[#d3d5d7] bg-white">
                {deal.payments.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[14px] text-[#1f2327]">{p.title}</p>
                      <p className="text-[12px] text-[#6f777f]">
                        Method: {p.method} • Ref: {p.reference} • {p.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[15px] text-[#1f2327]">{p.amount}</p>
                      <span
                        className={cn(
                          'text-[11px] font-semibold px-2 py-0.5 rounded',
                          p.status === 'Paid' || p.status === 'Escrow Funded'
                            ? 'bg-[#dfefe8] text-[#17b26a]'
                            : p.status === 'Refunded'
                            ? 'bg-[#fee4e2] text-[#d92d20]'
                            : 'bg-[#f6efe0] text-[#fdb022]'
                        )}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: COMMISSION */}
          {activeTab === 'commission' && (
            <div className="rounded-[10px] border border-[#d3d5d7] p-6 bg-white space-y-4">
              <h3 className="text-[16px] font-bold text-[#1f2327]">Commission & Fee Disbursement Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                  <span className="text-[12px] text-[#6f777f]">Agreed Commission Rate</span>
                  <p className="text-[20px] font-bold text-[#1f2327] mt-1">{deal.commissionRate}</p>
                </div>
                <div className="p-4 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                  <span className="text-[12px] text-[#6f777f]">Gross Commission Amount</span>
                  <p className="text-[20px] font-bold text-[#00c2cb] mt-1">{deal.commissionAmount}</p>
                </div>
                <div className="p-4 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[8px]">
                  <span className="text-[12px] text-[#6f777f]">Payout Protocol</span>
                  <p className="text-[13px] font-bold text-[#17b26a] mt-1">Direct Escrow Wire on Title Transfer</p>
                </div>
              </div>
              <div className="p-4 bg-[#e5f6f7] border border-[#00c2cb]/30 rounded-[8px] space-y-1">
                <span className="text-[12px] font-bold text-[#00848b]">Distribution Split:</span>
                <p className="text-[14px] font-medium text-[#1f2327]">{deal.commissionSplit}</p>
              </div>
            </div>
          )}

          {/* SECTION 9: CONVERSATION */}
          {activeTab === 'conversation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#6f777f]">
                  Showing messages exchanged between <strong className="text-[#1f2327]">{deal.investorName}</strong> and <strong className="text-[#1f2327]">{deal.agentName}</strong>
                </p>
                <Link
                  href="/chats"
                  className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3]"
                >
                  <MessageSquare className="size-3.5 text-[#00c2cb]" />
                  <span>Open Full Chat Screen</span>
                </Link>
              </div>

              <div className="h-64 overflow-y-auto rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 space-y-3">
                {chatLog.length === 0 ? (
                  <p className="text-center text-[#6f777f] text-[13px] py-10">No chat history recorded for this deal ref.</p>
                ) : (
                  chatLog.map((msg) => (
                    <div key={msg.id} className="p-3 bg-white border border-[#d3d5d7] rounded-[8px] space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[#6f777f]">
                        <span className="font-semibold text-[#1f2327]">
                          {msg.sender} ({msg.senderRole})
                        </span>
                        <span className="font-mono">{msg.time}</span>
                      </div>
                      <p className="text-[13px] text-[#1f2327]">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION 10: NOTES (CRUD) */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add internal compliance or admin note for this deal..."
                  className="flex-1 h-[38px] px-3.5 rounded-[8px] border border-[#d3d5d7] text-[13px] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 font-sans"
                />
                <button
                  type="submit"
                  className="h-[38px] px-4 rounded-[8px] bg-[#1f2327] text-white font-semibold text-[13px] hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="size-4" />
                  <span>Add Note</span>
                </button>
              </form>

              <div className="divide-y divide-[#d3d5d7] rounded-[10px] border border-[#d3d5d7] bg-white">
                {notes.length === 0 ? (
                  <p className="p-6 text-center text-[13px] text-[#6f777f]">No admin notes logged yet.</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[12px] text-[#6f777f]">
                        <span className="font-semibold text-[#1f2327]">
                          {n.author} • <span className="font-normal text-[#6f777f]">{n.role}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px]">{n.date}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(n.id)
                              setEditingNoteText(n.text)
                            }}
                            className="text-[#6f777f] hover:text-[#00c2cb] cursor-pointer"
                            title="Edit note"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(n.id)}
                            className="text-[#6f777f] hover:text-[#d92d20] cursor-pointer"
                            title="Delete note"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {editingNoteId === n.id ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            className="flex-1 h-[32px] px-2.5 rounded-[6px] border border-[#00c2cb] text-[13px] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditNote(n.id)}
                            className="h-[32px] px-3 rounded-[6px] bg-[#00c2cb] text-[#1f2327] text-[12px] font-semibold"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="h-[32px] px-2 text-[12px] text-[#6f777f]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-[13.5px] text-[#1f2327]">{n.text}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION 11: HISTORY / AUDIT */}
          {activeTab === 'history' && (
            <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
              <h3 className="text-[15px] font-bold text-[#1f2327]">Deal Audit Trail & Governance Log</h3>
              <div className="divide-y divide-[#d3d5d7] text-[13px]">
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#1f2327]">Deal Initiated & Form B Reservation Signed</p>
                    <p className="text-[12px] text-[#6f777f]">Actor: Layla Haddad (Licensed Agent) • Ref: {deal.id}</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#6f777f]">{deal.startDate}</span>
                </div>
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#1f2327]">10% Security Deposit Deposited to Escrow</p>
                    <p className="text-[12px] text-[#6f777f]">Actor: Amal Haddad (Investor) • {deal.escrowAmount}</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#6f777f]">14 May 2026</span>
                </div>
                <div className="py-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#1f2327]">Conveyance Manager Assigned</p>
                    <p className="text-[12px] text-[#6f777f]">Actor: System Admin • Assigned to: {deal.assignedManager}</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#6f777f]">15 May 2026</span>
                </div>
                {deal.status === 'Completed' && (
                  <div className="py-3 flex items-start justify-between bg-[#dfefe8]/30 px-3 rounded-[6px]">
                    <div>
                      <p className="font-bold text-[#17b26a]">Deal Completed & Title Conveyed at DLD</p>
                      <p className="text-[12px] text-[#1f2327]">Actor: {deal.assignedManager} • Commission Disbursed: {deal.commissionAmount}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#17b26a] font-bold">{deal.completedDate || '20 May 2026'}</span>
                  </div>
                )}
                {deal.status === 'Cancelled' && (
                  <div className="py-3 flex items-start justify-between bg-[#fee4e2]/40 px-3 rounded-[6px]">
                    <div>
                      <p className="font-bold text-[#d92d20]">Deal Cancelled & Escrow Refund Queued</p>
                      <p className="text-[12px] text-[#1f2327]">Actor: {deal.assignedManager}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#d92d20] font-bold">14 May 2026</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            4. MODAL FOOTER
           ========================================================================= */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#d3d5d7] bg-[#fcfcfc] px-5 py-4">
          <div className="flex items-center gap-2">
            {deal.status === 'Active' && (
              <>
                <button
                  type="button"
                  onClick={() => onComplete(deal.id)}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#17b26a] px-4 text-[13px] font-semibold text-white hover:bg-[#159a5c] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Complete Deal</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCancel(deal.id)}
                  className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#d92d20] hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Cancel Deal
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
