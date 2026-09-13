'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  LogIn,
  KeyRound,
  UserX,
  Trash2,
  UserCheck,
  FileText,
  Lock,
  X,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  MoreHorizontal,
  ChevronDown,
  Eye,
  Download,
  ShieldCheck,
  ExternalLink,
  User,
  Activity,
  Award,
  Bell,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle,
  Ban,
  Building2,
  Check,
  Search,
  Plus,
  BadgeCheck,
  Laptop,
  HelpCircle,
  History,
  MessageSquare,
  DollarSign,
  Briefcase,
  Share2,
  Pencil,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { EditInvestorProfileModal } from './edit-investor-profile-modal'
import { RequestDetailModal } from './request-detail-modal'
import { DocumentViewerModal } from './document-viewer-modal'
import { OfferDetailsModal, type OfferDetail } from './offer-details-modal'
import { ChatModerator } from './chat-moderator'
import { RequestCard } from './request-card'
import { AgentOfferCard, type AgentOfferData } from './agent-offer-card'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { AvatarLightboxModal } from '@/components/ui/avatar-lightbox-modal'
import { Tag, StatusTag } from '@/components/ui/badge-tag'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { cn } from '@/lib/utils'
import type {
  ActivityItem,
  PlatformInvestor,
  PropertyOffer,
  PropertyRequest,
  VerificationDocument,
} from '@/lib/platform-users'

export type InvestorSectionId =
  | 'overview'
  | 'personal'
  | 'verification'
  | 'login-history'
  | 'devices'
  | 'timeline'
  | 'requests'
  | 'offers'
  | 'accepted-offers'
  | 'deals'
  | 'conversations'
  | 'reports'
  | 'notifications'
  | 'notes'
  | 'activity-score'

interface SectionTab {
  id: InvestorSectionId
  label: string
  shortLabel?: string
  icon: React.ComponentType<{ className?: string }>
  countKey?: 'requests' | 'offers' | 'acceptedOffers' | 'deals' | 'conversations' | 'reports' | 'notifications' | 'notes' | 'verification'
  category: 'Core' | 'Activity & Deals' | 'Security & Compliance'
}

const allSections: SectionTab[] = [
  { id: 'overview', label: '1. Profile Overview', shortLabel: 'Profile', icon: User, category: 'Core' },
  { id: 'personal', label: '2. Personal Information', shortLabel: 'Personal Info', icon: UserCheck, category: 'Core' },
  { id: 'verification', label: '3. Verification (KYC)', shortLabel: 'Verification', icon: ShieldCheck, countKey: 'verification', category: 'Security & Compliance' },
  { id: 'login-history', label: '4. Login History', shortLabel: 'Login History', icon: History, category: 'Security & Compliance' },
  { id: 'devices', label: '5. Devices & Sessions', shortLabel: 'Devices', icon: Laptop, category: 'Security & Compliance' },
  { id: 'timeline', label: '6. Activity Timeline', shortLabel: 'Timeline', icon: Clock, category: 'Core' },
  { id: 'requests', label: '7. Property Requests', shortLabel: 'Requests', icon: Building2, countKey: 'requests', category: 'Activity & Deals' },
  { id: 'offers', label: '8. Offers Received', shortLabel: 'Offers', icon: Sparkles, countKey: 'offers', category: 'Activity & Deals' },
  { id: 'accepted-offers', label: '9. Accepted Offers', shortLabel: 'Accepted Offers', icon: BadgeCheck, countKey: 'acceptedOffers', category: 'Activity & Deals' },
  { id: 'deals', label: '10. Deals & Escrow', shortLabel: 'Deals', icon: DollarSign, countKey: 'deals', category: 'Activity & Deals' },
  { id: 'conversations', label: '11. Conversations', shortLabel: 'Chats', icon: MessageSquare, countKey: 'conversations', category: 'Activity & Deals' },
  { id: 'reports', label: '12. Reports & Audits', shortLabel: 'Reports', icon: FileSpreadsheet, countKey: 'reports', category: 'Security & Compliance' },
  { id: 'notifications', label: '13. Notifications', shortLabel: 'Notifications', icon: Bell, countKey: 'notifications', category: 'Core' },
  { id: 'notes', label: '14. Internal Notes', shortLabel: 'Internal Notes', icon: FileText, countKey: 'notes', category: 'Core' },
  { id: 'activity-score', label: '15. Activity Score', shortLabel: 'Activity Score', icon: Activity, category: 'Core' },
]

function InvestorProfileInner({ investor: initialInvestor }: { investor: PlatformInvestor }) {
  const { toast } = useToast()
  const storageKey = `duseat_investor_profile_${initialInvestor.id}`

  const [investor, setInvestor] = React.useState<PlatformInvestor>(initialInvestor)
  const [activeTab, setActiveTab] = React.useState<InvestorSectionId>('overview')
  const [selectedRequest, setSelectedRequest] = React.useState<PropertyRequest | null>(null)
  const [selectedOfferModal, setSelectedOfferModal] = React.useState<OfferDetail | null>(null)
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null)
  const [activeChatId, setActiveChatId] = React.useState(initialInvestor.conversations[0]?.id || '')
  const [chatReply, setChatReply] = React.useState('')
  const [newNoteText, setNewNoteText] = React.useState('')
  const [confirm, setConfirm] = React.useState<ConfirmRequest | null>(null)
  const [notifModalOpen, setNotifModalOpen] = React.useState(false)
  const [notifMsg, setNotifMsg] = React.useState('')
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = React.useState(false)
  const [viewAllMode, setViewAllMode] = React.useState(false)
  const [filterCategory, setFilterCategory] = React.useState<'All' | 'Core' | 'Activity & Deals' | 'Security & Compliance'>('All')

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setInvestor(parsed)
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey])

  const saveInvestor = (updated: PlatformInvestor) => {
    setInvestor(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch (e) {
      // ignore
    }
  }

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const handleAction = (kind: string) => {
    switch (kind) {
      case 'verify':
        saveInvestor({ ...investor, status: 'Active', verification: 'Verified' })
        notify('Account verified', `${investor.name} verified with UAE compliance.`)
        break
      case 'suspend':
        saveInvestor({ ...investor, status: 'Suspended' })
        notify('Account suspended', `${investor.name} has been suspended.`, 'info')
        break
      case 'ban':
        saveInvestor({ ...investor, status: 'Banned', verification: 'Revoked' })
        notify('Account banned', `${investor.name} is now banned.`, 'error')
        break
      case 'reset':
        notify('Password reset', `Reset instructions emailed to ${investor.email}.`)
        break
      case 'login':
        notify('Impersonation', `Logged in as ${investor.name}.`, 'info')
        break
      case 'delete':
        notify('Account deleted', `${investor.name} moved to archive.`, 'error')
        break
    }
  }

  const confirmAction = (kind: string) => {
    const meta: Record<string, { title: string; desc: string; label: string; tone: ConfirmRequest['tone'] }> = {
      suspend: { title: 'Suspend Investor', desc: `${investor.name} will be paused from posting new requests.`, label: 'Suspend Account', tone: 'warning' },
      ban: { title: 'Ban Account', desc: `${investor.name} will be banned permanently.`, label: 'Ban Account', tone: 'danger' },
      delete: { title: 'Delete Investor', desc: `${investor.name} will be moved to deleted archive.`, label: 'Delete Record', tone: 'danger' },
      reset: { title: 'Reset Password', desc: `Send password reset email to ${investor.email}?`, label: 'Send Reset Link', tone: 'brand' },
    }
    const conf = meta[kind]
    if (conf) {
      setConfirm({
        title: conf.title,
        description: conf.desc,
        confirmLabel: conf.label,
        tone: conf.tone,
        icon: kind === 'suspend' ? 'suspend' : kind === 'ban' ? 'ban' : kind === 'delete' ? 'delete' : 'reset',
        onConfirm: () => handleAction(kind),
      })
      return
    }
    handleAction(kind)
  }

  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    const newNote: ActivityItem = {
      id: `note-${Date.now()}`,
      title: 'Admin Note',
      detail: newNoteText.trim(),
      date: 'Just now',
      author: 'Super Admin (You)',
      tone: 'info',
    }
    const updated = { ...investor, internalNotes: [newNote, ...investor.internalNotes] }
    saveInvestor(updated)
    setNewNoteText('')
    notify('Note added', 'Internal note recorded.')
  }

  const handleDocVerify = (docId: string, status: VerificationDocument['status'], note?: string) => {
    const updatedDocs = investor.verificationDocs.map((d) =>
      d.id === docId ? { ...d, status, reviewNotes: note || d.reviewNotes } : d
    )
    saveInvestor({ ...investor, verificationDocs: updatedDocs })
    notify('Document updated', `Status changed to ${status}.`)
  }

  const handleSendMessage = () => {
    if (!chatReply.trim() || !activeChatId) return
    const updatedChats = investor.conversations.map((c) => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [
            ...c.messages,
            { id: `m-${Date.now()}`, from: 'user' as const, text: chatReply.trim(), time: 'Just now' },
          ],
        }
      }
      return c
    })
    saveInvestor({ ...investor, conversations: updatedChats })
    setChatReply('')
  }

  const handleRequestStatusUpdate = (requestId: string, newStatus: PropertyRequest['status']) => {
    const updated = investor.requestsList.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    saveInvestor({ ...investor, requestsList: updated })
  }

  const countryCode = getCountryCode(investor.country)
  const activeChat = investor.conversations.find((c) => c.id === activeChatId) || investor.conversations[0]

  const getSectionCount = (tab: SectionTab) => {
    switch (tab.countKey) {
      case 'requests':
        return investor.requestsList.length
      case 'offers':
        return investor.offersReceived.length
      case 'acceptedOffers':
        return investor.acceptedOffers.length
      case 'deals':
        return investor.dealList.length
      case 'conversations':
        return investor.conversations.length
      case 'reports':
        return (investor.reports?.length || 2)
      case 'notifications':
        return investor.notifications.length
      case 'notes':
        return investor.internalNotes.length
      case 'verification':
        return investor.verificationDocs.length
      default:
        return undefined
    }
  }

  const filteredTabs = filterCategory === 'All'
    ? allSections
    : allSections.filter((t) => t.category === filterCategory)

  // Demo reports if empty
  const displayReports: ActivityItem[] = (investor.reports && investor.reports.length > 0)
    ? investor.reports
    : [
        {
          id: 'rep-1',
          title: 'Anti-Money Laundering (AML) Screening Check',
          detail: 'Automated global sanctions, PEP, and fraud watchlist check passed clear with zero flags.',
          date: investor.joined,
          tone: 'success',
          author: 'Automated AML Engine',
        },
        {
          id: 'rep-2',
          title: 'Proof of Funds & Liquidity Solvency Certificate',
          detail: 'Certified bank solvency letter from First Abu Dhabi Bank (FAB) verified for AED 8.5M balance.',
          date: '29 May 2026',
          tone: 'info',
          author: 'Finance & Escrow Audit Desk',
        },
      ]

  return (
    <PlatformShell title={investor.name} eyebrow="investor">
      <div className="flex w-full min-w-0 flex-col gap-4 px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* 1. Header Card with Investor Summary & Quick Actions */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4 font-sans w-full min-w-0 max-w-full">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full min-w-0">
            {/* Left: Avatar + Identity + Status Badges */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center min-w-0 flex-1">
              <AvatarFlagOverlay code={getCountryCode(investor.country || 'United Arab Emirates')}>
                <div
                  onClick={() => setAvatarModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  title="Click to view and download photo"
                  className="size-[72px] sm:size-[80px] rounded-[12px] overflow-hidden bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#00c2cb] hover:scale-105 active:scale-95 transition-all select-none shrink-0"
                >
                  {investor.avatar ? (
                    <img src={investor.avatar} alt={investor.name} className="size-full object-cover" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-white font-sans">
                      {investor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  )}
                </div>
              </AvatarFlagOverlay>

              {avatarModalOpen && (
                <AvatarLightboxModal
                  isOpen={avatarModalOpen}
                  onClose={() => setAvatarModalOpen(false)}
                  src={investor.avatar}
                  name={investor.name}
                  country={investor.country}
                  countryCode={getCountryCode(investor.country || 'AE')}
                  subtitle={`Investor ID: ${investor.id} • ${investor.verification}`}
                />
              )}

              <div className="space-y-1 font-sans min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
                  <h1 className="text-[22px] sm:text-[32px] font-bold leading-[28px] sm:leading-[40px] text-[#1f2327] break-words">
                    {investor.name}
                  </h1>
                  <FigmaStatusBadge status={investor.verification} />
                </div>

                <div className="text-[13px] sm:text-[14px] leading-[20px] text-[#6f777f] flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                  <span>
                    ID : <strong className="font-medium text-[#1f2327]">{investor.id}</strong>
                  </span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span>{investor.country}</span>
                  </span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span className="break-words">{investor.email}</span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span>{investor.phone}</span>
                </div>

                <div className="text-[12px] leading-[16px] text-[#6f777f] flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 min-w-0">
                  <span>
                    Member since <strong className="font-medium text-[#1f2327]">{investor.joined}</strong>
                  </span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span>
                    Last active <strong className="font-medium text-[#1f2327]">{investor.lastLogin}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex w-full sm:w-auto items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="flex-1 sm:flex-initial flex h-[38px] sm:h-[40px] items-center justify-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[13px] sm:text-[14px] leading-[20px] font-semibold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn shadow-2xs whitespace-nowrap"
              >
                <Pencil className="size-4 shrink-0" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('login')}
                className="flex-1 sm:flex-initial flex h-[38px] sm:h-[40px] items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white px-3 sm:px-3.5 text-[13px] sm:text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs whitespace-nowrap"
              >
                <span className="sm:hidden">Login</span>
                <span className="hidden sm:inline">Login as investor</span>
              </button>

              <Dropdown
                align="end"
                ariaLabel="More investor actions"
                floating
                onSelect={(val) => {
                  if (val === 'edit-profile') setIsEditProfileOpen(true)
                  else if (val === 'notification') setNotifModalOpen(true)
                  else if (val === 'verify') handleAction('verify')
                  else if (val === 'reset') confirmAction('reset')
                  else if (val === 'suspend') confirmAction('suspend')
                  else if (val === 'ban') confirmAction('ban')
                  else if (val === 'delete') confirmAction('delete')
                }}
                options={[
                  { label: 'Edit Full Profile Details', value: 'edit-profile', icon: <Pencil className="size-4 text-[#00c2cb]" /> },
                  { label: 'Send Notification', value: 'notification', icon: <Mail className="size-4 text-[#00c2cb]" /> },
                  ...(investor.verification !== 'Verified'
                    ? [{ label: 'Verify KYC Profile', value: 'verify', icon: <ShieldCheck className="size-4 text-emerald-600" /> }]
                    : []),
                  { label: 'Reset Password', value: 'reset', icon: <KeyRound className="size-4 text-[#6f777f]" /> },
                  { label: 'Suspend Investor', value: 'suspend', icon: <UserX className="size-4 text-amber-600" />, destructive: true },
                  { label: 'Ban Account', value: 'ban', icon: <Ban className="size-4 text-rose-600" />, destructive: true },
                  { label: 'Delete Account Archive', value: 'delete', icon: <Trash2 className="size-4 text-rose-600" />, destructive: true },
                ]}
                trigger={
                  <span className="flex size-[38px] sm:size-[40px] shrink-0 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs">
                    <MoreHorizontal className="size-5" />
                  </span>
                }
              />
            </div>
          </div>

          {/* 2. Quick 4 KPI Cards Bar */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-3 font-sans">
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className="rounded-[12px] border border-[#d3d5d7] bg-white p-3 sm:px-4 sm:py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer min-w-0"
            >
              <p className="text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-normal text-[#6f777f] break-words">Requests</p>
              <p className="mt-0.5 text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-[#1f2327] break-words">{investor.requestsList.length}</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('offers')}
              className="rounded-[12px] border border-[#d3d5d7] bg-white p-3 sm:px-4 sm:py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer min-w-0"
            >
              <p className="text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-normal text-[#6f777f] break-words">Offers received</p>
              <p className="mt-0.5 text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-[#1f2327] break-words">{investor.offersReceived.length || 12}</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deals')}
              className="rounded-[12px] border border-[#d3d5d7] bg-white p-3 sm:px-4 sm:py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer min-w-0"
            >
              <p className="text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-normal text-[#6f777f] break-words">Deals completed</p>
              <p className="mt-0.5 text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-[#1f2327] break-words">{investor.dealList.length || 1}</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity-score')}
              className="rounded-[12px] border border-[#d3d5d7] bg-white p-3 sm:px-4 sm:py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer min-w-0"
            >
              <p className="text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-normal text-[#6f777f] break-words">Total score</p>
              <p className="mt-0.5 text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-[#1f2327] break-words">{investor.score || 92}</p>
            </button>
          </div>
        </header>

        {/* 3. Navigation Bar: Complete 15 Investor Details Sections */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] font-sans space-y-4 w-full min-w-0 max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#d3d5d7] pb-3 w-full min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[15px] sm:text-[18px] font-semibold text-[#1f2327] break-words">
                Investor Details Directory ({allSections.length} Sections)
              </span>
            </div>

            {/* View All & Category Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-1 sm:pb-0 w-full sm:w-auto min-w-0">
              <button
                type="button"
                onClick={() => setViewAllMode(!viewAllMode)}
                className={cn(
                  'h-[34px] px-3 sm:px-3.5 rounded-[8px] font-medium transition-colors cursor-pointer ant-wave-btn flex items-center gap-1.5 shrink-0 whitespace-nowrap',
                  viewAllMode
                    ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                    : 'border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3]'
                )}
              >
                <Eye className="size-4 shrink-0" />
                <span>{viewAllMode ? 'Tabbed Mode' : 'View All / عرض الكل'}</span>
              </button>

              {(['All', 'Core', 'Activity & Deals', 'Security & Compliance'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setViewAllMode(false)
                    setFilterCategory(cat)
                  }}
                  className={cn(
                    'h-[34px] px-3 rounded-[8px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap',
                    !viewAllMode && filterCategory === cat
                      ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Buttons Strip */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth flex-nowrap w-full min-w-0">
            {filteredTabs.map((tab) => {
              const isActive = activeTab === tab.id
              const count = getSectionCount(tab)
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex h-[36px] items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-[8px] px-3 text-[14px] sm:text-[15px] font-medium transition-all cursor-pointer ant-wave-btn shrink-0',
                    isActive
                      ? 'bg-[#00c2cb] text-white shadow-xs font-semibold'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  <span>{tab.shortLabel || tab.label}</span>
                  {count !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.2 text-[11px] font-bold',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#eff1f3] text-[#1f2327]'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 4. Tab Content: 15 Distinct Section Renderers */}
        <div className="space-y-6 font-sans w-full min-w-0">
          {/* =========================================================================
              1. PROFILE / OVERVIEW
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 w-full min-w-0">
              <div className="grid gap-6 xl:grid-cols-12 w-full min-w-0">
                {/* Left Column (approx 68%) */}
                <div className="space-y-6 xl:col-span-8 w-full min-w-0">
                  {/* Active Property Requests */}
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col gap-4 sm:gap-6 w-full min-w-0 max-w-full">
                    <div className="flex flex-col gap-2.5 w-full min-w-0">
                      <div className="flex items-center justify-between gap-2 w-full min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-[17px] sm:text-[22px] font-bold text-[#1f2327] truncate">Active Property Requests</h3>
                          <span className="inline-flex items-center rounded-full bg-[#e5f6f7] px-2 py-0.5 text-[11px] sm:text-[12px] font-bold text-[#00848b] shrink-0">
                            {investor.requestsList.length} Total
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('requests')}
                          className="flex items-center gap-1 text-[13px] sm:text-[15px] font-semibold text-[#00c2cb] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                        >
                          <span>View all ({investor.requestsList.length})</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] sm:text-[13px] text-[#6f777f] w-full min-w-0">
                        <p className="truncate min-w-0 flex-1">
                          Showing latest <strong className="font-semibold text-[#1f2327]">2</strong> of <strong className="font-semibold text-[#1f2327]">{investor.requestsList.length}</strong> requirements
                        </p>
                        <span className="hidden sm:inline-block text-[11px] sm:text-[12px] font-medium text-[#6f777f] bg-[#f8f9fa] px-2 py-0.5 rounded-[6px] border border-[#e5e7eb] shrink-0">
                          Showing 2 of {investor.requestsList.length}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 w-full min-w-0">
                      {investor.requestsList.slice(0, 2).map((req) => (
                        <div key={req.id} className="w-full min-w-0">
                          <RequestCard
                            request={req}
                            onViewDetails={() => setSelectedRequest(req)}
                          />
                        </div>
                      ))}
                    </div>

                    {investor.requestsList.length > 2 && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0f2f5] text-[12px] sm:text-[13px] w-full min-w-0">
                        <span className="text-[#6f777f] truncate">
                          + {investor.requestsList.length - 2} more requests published
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('requests')}
                          className="font-semibold text-[#00c2cb] hover:underline cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap"
                        >
                          <span>Browse all {investor.requestsList.length} requests</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-6 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4 sm:gap-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[18px] sm:text-[24px] font-bold text-[#1f2327]">Recent Activity</h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('timeline')}
                        className="text-[13px] sm:text-[15px] font-medium text-[#00c2cb] underline cursor-pointer hover:opacity-80"
                      >
                        View full timeline
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:gap-3 font-sans">
                      {investor.timeline.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="border border-[#d3d5d7] rounded-[12px] min-h-[66px] px-3 sm:px-3.5 py-2.5 flex items-center justify-between gap-2 sm:gap-3 transition-colors hover:bg-[#fcfcfc]"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="size-[38px] sm:size-[42px] rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0 text-[#1f2327]">
                              <Activity className="size-4 sm:size-5" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-[14px] sm:text-[18px] font-medium text-[#1f2327] truncate">
                                {event.title}
                              </p>
                              <p className="text-[12px] sm:text-[14px] text-[#6f777f] truncate">
                                {event.detail}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11.5px] sm:text-[15px] font-medium text-[#6f777f] shrink-0 text-right whitespace-nowrap pl-1">
                            {event.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (approx 32%) */}
                <div className="space-y-6 xl:col-span-4 w-full min-w-0">
                  {/* Personal Information */}
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-6 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4 sm:gap-6 w-full min-w-0 max-w-full">
                    <div className="flex items-center justify-between gap-2 w-full min-w-0">
                      <h3 className="text-[18px] sm:text-[22px] font-bold text-[#1f2327]">Personal information</h3>
                      <span className="text-[13px] sm:text-[15px] text-[#6f777f] shrink-0">Investor record</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 sm:gap-y-4 font-sans w-full min-w-0">
                      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Email</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327] truncate break-all">
                          {investor.email}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Phone</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327] truncate">
                          {investor.phone}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Country</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327] truncate">
                          {investor.country}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Nationality</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327] truncate">
                          {investor.personalInfo.nationality || 'Emirati'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Language</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327] truncate">
                          {investor.personalInfo.language || 'Arabic, English'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Occupation</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327] truncate">
                          {investor.personalInfo.occupation || 'Property investor'}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2 flex flex-col gap-0.5 sm:gap-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Budget</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-[#1f2327]">
                          {investor.personalInfo.budget || 'AED 1.5M – 4M'}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 pt-1 sm:pt-2 w-full min-w-0">
                        <p className="text-[13px] sm:text-[14px] text-[#6f777f]">Preferred areas</p>
                        <div className="flex flex-wrap gap-2 w-full min-w-0">
                          {(investor.personalInfo.preferredAreas?.length ? investor.personalInfo.preferredAreas : ['Downtown Dubai', 'Dubai Marina', 'Business Bay']).map((area) => (
                            <div
                              key={area}
                              className="border border-[#d3d5d7] rounded-[8px] h-[38px] sm:h-[42px] px-3 py-1.5 flex items-center gap-1.5 text-[13px] sm:text-[15px] text-[#1f2327] font-medium bg-white max-w-full truncate"
                            >
                              <ExternalLink className="size-3.5 sm:size-4 text-[#1f2327] shrink-0" />
                              <span className="truncate">{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Card */}
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-6 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[18px] sm:text-[22px] font-bold text-[#1f2327]">Notes</h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('notes')}
                        className="text-[13px] sm:text-[15px] font-normal text-[#00c2cb] underline cursor-pointer hover:opacity-80"
                      >
                        View all notes
                      </button>
                    </div>

                    <div className="space-y-3 font-sans">
                      {investor.internalNotes.slice(0, 1).map((note) => (
                        <div
                          key={note.id}
                          className="border border-[#d3d5d7] rounded-[12px] p-3.5 flex items-start justify-between gap-3"
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-[16px] sm:text-[18px] font-medium text-[#1f2327]">
                              {note.author}
                            </p>
                            <p className="text-[13px] sm:text-[14px] text-[#6f777f] leading-relaxed">
                              {note.detail}
                            </p>
                          </div>
                          <span className="text-[14px] sm:text-[16px] text-[#6f777f] shrink-0 text-right">
                            {note.date}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('notes')}
                      className="w-full h-[44px] rounded-[8px] border border-[#d3d5d7] bg-white text-[#00c2cb] text-[16px] font-medium flex items-center justify-center hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
                    >
                      Add note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. PERSONAL INFORMATION (Figma Node 297:45269)
             ========================================================================= */}
          {activeTab === 'personal' && (
            <div className="space-y-5 font-sans">
              <div className="grid gap-5 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-8">
                  {/* Identity Details */}
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                      <h4 className="text-[18px] font-bold text-[#1f2327]">Investor's Personal Details</h4>
                      <span className="text-xs font-mono text-[#6f777f]">{investor.id}</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Full Legal Name</p>
                        <p className="mt-1 text-[15px] font-bold text-[#1f2327]">{investor.name}</p>
                      </div>
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Nationality</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Flag code={countryCode} size="s" />
                          <span className="text-[15px] font-bold text-[#1f2327]">{investor.personalInfo.nationality}</span>
                        </div>
                      </div>
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">National ID (Emirates ID)</p>
                        <p className="mt-1 text-[14px] font-semibold text-[#1f2327]">784-1988-1294821-1</p>
                      </div>
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Passport Number</p>
                        <p className="mt-1 text-[14px] font-semibold text-[#1f2327]">N94819201</p>
                      </div>
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Primary Phone</p>
                        <p className="mt-1 text-[14px] font-semibold text-[#1f2327]">{investor.phone}</p>
                      </div>
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Email Address</p>
                        <p className="mt-1 text-[14px] font-semibold text-[#1f2327]">{investor.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Investment Profile */}
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xs space-y-4">
                    <h4 className="text-[18px] font-bold text-[#1f2327] border-b border-[#d3d5d7] pb-3">Investment Capacity</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Budget Portfolio</p>
                        <p className="mt-1 text-[16px] font-bold text-[#1f2327]">{investor.personalInfo.budget || 'AED 5M – 15M'}</p>
                      </div>
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                        <p className="text-[12px] font-medium text-[#6f777f]">Available Liquid Funds</p>
                        <p className="mt-1 text-[16px] font-bold text-[#00c2cb]">{investor.personalInfo.netWorthEstimated || 'AED 10M+'}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[12px] font-medium text-[#6f777f] mb-2">Investment Focus & Preferred Asset Types</p>
                      <div className="flex flex-wrap gap-2">
                        {['Off-Plan Villas', 'Prime Waterfront', 'Luxury Penthouses', 'Commercial Offices'].map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-[6px] bg-[#f8f9fa] border border-[#d3d5d7] px-3 py-1 text-[12px] font-medium text-[#1f2327]"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 lg:col-span-4">
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xs space-y-4">
                    <h4 className="text-[18px] font-bold text-[#1f2327] pb-3 border-b border-[#d3d5d7]">Address & Location</h4>
                    <div className="space-y-3.5 text-[13px]">
                      <div>
                        <p className="text-[12px] font-medium text-[#6f777f]">Residential Address</p>
                        <p className="mt-1 text-[14px] font-semibold text-[#1f2327] leading-relaxed">
                          {investor.personalInfo.address || investor.country}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#d3d5d7]">
                        <p className="text-[12px] font-medium text-[#6f777f]">Country</p>
                        <p className="mt-0.5 text-[14px] font-semibold text-[#1f2327]">{investor.country}</p>
                      </div>
                      <div className="pt-2 border-t border-[#d3d5d7]">
                        <p className="text-[12px] font-medium text-[#6f777f]">Preferred Communication</p>
                        <p className="mt-0.5 text-[14px] font-semibold text-[#00c2cb]">WhatsApp & Email (Verified)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              3. VERIFICATION (KYC & Document Verification - Figma Node 297:46304)
             ========================================================================= */}
          {activeTab === 'verification' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-5 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#d3d5d7] pb-4">
                <div>
                  <h3 className="text-[20px] font-bold text-[#1f2327]">KYC & Document Verification</h3>
                  <p className="text-[13px] text-[#6f777f]">Review identity, passport, Emirates ID, and commercial trade licenses</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allVerified = investor.verificationDocs.map((d) => ({
                      ...d,
                      status: 'Verified' as const,
                    }))
                    saveInvestor({ ...investor, verificationDocs: allVerified, verification: 'Verified' })
                    notify('All Documents Verified', 'All investor KYC credentials marked as verified.')
                  }}
                  className="rounded-[8px] bg-[#00c2cb] px-4 py-2 text-[13px] font-bold text-white hover:opacity-90 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer ant-wave-btn"
                >
                  <CheckCircle2 className="size-4" />
                  Approve All Documents
                </button>
              </div>

              {/* Documents Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {investor.verificationDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="relative flex flex-col justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 transition-all hover:border-[#00c2cb] shadow-2xs font-sans space-y-3.5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="size-9 rounded-[8px] bg-[#e5f6f7] flex items-center justify-center text-[#00c2cb]">
                          <FileText className="size-5" />
                        </div>
                        <span
                          className={cn(
                            'rounded-[6px] px-2.5 py-0.5 text-xs font-semibold',
                            doc.status === 'Verified'
                              ? 'bg-[#dfefe8] text-[#17b26a]'
                              : doc.status === 'Rejected'
                              ? 'bg-[#fee4e2] text-[#f04438]'
                              : 'bg-[#fff4e5] text-[#b54708]'
                          )}
                        >
                          {doc.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-[15px] text-[#1f2327]">
                          {doc.name}
                        </h4>
                        <p className="text-[12px] text-[#6f777f] mt-0.5">
                          {doc.type} • PDF • 1.8MB • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDocId(doc.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white hover:bg-[#eff1f3] text-[#1f2327] py-2 text-[13px] font-semibold transition-colors cursor-pointer ant-wave-btn"
                      >
                        <Eye className="size-4 text-[#6f777f]" />
                        View document
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDocVerify(doc.id, 'Verified')}
                          className="flex-1 rounded-[8px] border border-[#17b26a]/50 bg-white py-1.5 text-[13px] font-semibold text-[#17b26a] hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDocVerify(doc.id, 'Rejected')}
                          className="flex-1 rounded-[8px] border border-[#f04438]/50 bg-white py-1.5 text-[13px] font-semibold text-[#f04438] hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              4. LOGIN HISTORY (Authentication & Login History - Figma Node 297:46304)
             ========================================================================= */}
          {activeTab === 'login-history' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4 font-sans">
              <div className="border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[20px] font-bold text-[#1f2327]">Authentication & Login History</h3>
                <p className="text-[13px] text-[#6f777f]">Detailed security audit of investor access logs and tokens</p>
              </div>

              <div className="space-y-2.5">
                {investor.loginHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-[10px] border border-[#d3d5d7] bg-white p-4 hover:bg-[#fcfcfc] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-[#f8f9fa] text-[#1f2327]">
                        <LogIn className="size-4 text-[#6f777f]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] text-[#1f2327]">{item.title}</p>
                        <p className="text-[12px] text-[#6f777f]">{item.detail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] font-medium text-[#9da4ae]">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              5. DEVICES & SESSIONS (Connected Devices & Active Sessions - Figma Node 297:46304)
             ========================================================================= */}
          {activeTab === 'devices' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4 font-sans">
              <div className="border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[20px] font-bold text-[#1f2327]">Connected Devices & Active Sessions</h3>
                <p className="text-[13px] text-[#6f777f]">Hardware tokens, browsers, and mobile devices authorized for access</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {investor.devices.map((device) => (
                  <div
                    key={device.name}
                    className="flex flex-col justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-5 space-y-3.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-[#f8f9fa] text-[#1f2327]">
                        {device.name.includes('iPhone') ? <Smartphone className="size-5 text-[#6f777f]" /> : <Monitor className="size-5 text-[#6f777f]" />}
                      </div>
                      {device.current && (
                        <span className="rounded-full bg-[#dfefe8] text-[#17b26a] px-2.5 py-0.5 text-xs font-semibold">
                          Current Session
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-[14px] font-bold text-[#1f2327]">{device.name}</p>
                      <p className="text-[12px] text-[#6f777f] mt-0.5">Location: {device.location}</p>
                      <p className="text-[12px] text-[#6f777f]">IP: {device.ip}</p>
                      <p className="text-[12px] text-[#6f777f]">Last active: {device.lastSeen}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => notify('Session Terminated', `Session for ${device.name} was revoked.`)}
                      className="w-full rounded-[8px] border border-[#d3d5d7] bg-white hover:bg-[#eff1f3] py-2 text-[13px] font-medium text-[#1f2327] transition-colors cursor-pointer ant-wave-btn"
                    >
                      Revoke Device Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              6. TIMELINE (Activity Timeline - Figma Node 297:45269)
             ========================================================================= */}
          {activeTab === 'timeline' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4 font-sans">
              <div className="border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[20px] font-bold text-[#1f2327]">Activity Timeline</h3>
                <p className="text-[13px] text-[#6f777f]">Chronological milestones of account creation, requests, deals, and verifications</p>
              </div>

              <div className="space-y-3">
                {investor.timeline.map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-[10px] border border-[#d3d5d7] bg-white p-4 hover:border-[#00c2cb] transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb] shrink-0">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-[#1f2327]">{event.title}</p>
                        <p className="text-[12px] text-[#6f777f] mt-0.5 leading-relaxed">{event.detail}</p>
                      </div>
                    </div>
                    <span className="text-[12px] text-[#9da4ae] font-medium shrink-0">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              7. PROPERTY REQUESTS
             ========================================================================= */}
          {activeTab === 'requests' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Property Requests ({investor.requestsList.length})</h3>
                  <p className="text-xs text-muted-foreground">Investor acquisition criteria matched with UAE licensed brokers</p>
                </div>
              </div>

              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {investor.requestsList.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onViewDetails={() => setSelectedRequest(req)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
          {/* =========================================================================
              8. OFFERS RECEIVED (Figma Node 312:33338)
             ========================================================================= */}
          {activeTab === 'offers' && (
            <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-6 sm:p-7 shadow-xs space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">
                    Submitted Property Offers ({investor.offersReceived.length})
                  </h3>
                  <p className="text-xs text-[#6f777f]">Property options pitched directly to this investor by verified agents matching Figma specs.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[8px] border border-[#d3d5d7] bg-[#F9FAFB] px-3.5 py-1.5 text-xs font-semibold text-[#1f2327] shadow-2xs">
                    Showing {investor.offersReceived.length} offers
                  </span>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
                {investor.offersReceived.map((offer, idx) => {
                  const offerData: AgentOfferData = {
                    id: offer.id,
                    requestId: offer.requestId ? (offer.requestId.startsWith('#') ? offer.requestId : `#${offer.requestId}`) : `#REQ-${1024 + idx}`,
                    status: (offer.status as any) || 'Under review',
                    name: offer.agentName,
                    agentName: offer.agentName,
                    agentId: offer.agentId || `AG-${1057 - idx}`,
                    dealsCount: 64 - idx * 4,
                    rating: offer.rating || 4.9,
                    subscriptionPlan: 'Pro agent',
                    isVerified: true,
                    timeAgo: offer.submitted || '4 min ago',
                    proposalDescription:
                      offer.description ||
                      `Exclusive proposal for ${offer.propertyTitle}. Premium finishes and prime location.`,
                    note: offer.paymentPlan ? `Payment Plan: ${offer.paymentPlan}` : 'Family-friendly community with schools and parks nearby.',
                    photos: (offer.photos && offer.photos.length > 0)
                      ? offer.photos
                      : [
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
                        ],
                    location: offer.location || 'Palm Jumeirah, Dubai',
                    brochureName: 'Brochure.pdf',
                    amount: offer.price,
                  }

                  return (
                    <AgentOfferCard
                      key={offer.id}
                      offer={offerData}
                      onOpenChat={() => {
                        const matchedChat = investor.conversations.find(
                          (c) => c.offerRef === offer.id || c.requestRef === offer.requestId || c.with === offer.agentName
                        )
                        if (matchedChat) {
                          setActiveChatId(matchedChat.id)
                        }
                        setActiveTab('conversations')
                        notify('Chat opened', `Opening conversation with ${offer.agentName}.`, 'info')
                      }}
                      onViewDetails={() =>
                        setSelectedOfferModal({
                          id: offer.id,
                          agentName: offer.agentName,
                          agentId: offer.agentId || `AG-${1040 + idx}`,
                          agentDeals: 64,
                          agentRating: offer.rating || 4.9,
                          agentSubscription: 'Pro agent',
                          agentVerified: true,
                          proposalText: offer.description || `Proposal for ${offer.propertyTitle}. Offered Price: ${offer.price}.`,
                          photos: (offer.photos && offer.photos.length > 0)
                            ? offer.photos
                            : [
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
                                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
                              ],
                          price: offer.price,
                        })
                      }
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              9. ACCEPTED OFFERS (Figma Node 312:33338)
             ========================================================================= */}
          {activeTab === 'accepted-offers' && (
            <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-6 sm:p-7 shadow-xs space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">
                    Accepted Offers ({investor.acceptedOffers.length})
                  </h3>
                  <p className="text-xs text-[#6f777f]">Offers accepted by the investor and moved into escrow/closing phase.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[8px] border border-[#d3d5d7] bg-[#F9FAFB] px-3.5 py-1.5 text-xs font-semibold text-[#1f2327] shadow-2xs">
                    Showing {investor.acceptedOffers.length} accepted offers
                  </span>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
                {investor.acceptedOffers.map((offer, idx) => {
                  const offerData: AgentOfferData = {
                    id: offer.id,
                    requestId: offer.requestId ? (offer.requestId.startsWith('#') ? offer.requestId : `#${offer.requestId}`) : `#REQ-${1024 + idx}`,
                    status: 'Accepted',
                    name: offer.agentName,
                    agentName: offer.agentName,
                    agentId: offer.agentId || `AG-${1050 + idx}`,
                    dealsCount: 42,
                    rating: offer.rating || 4.9,
                    subscriptionPlan: 'Pro agent',
                    isVerified: true,
                    timeAgo: offer.submitted || 'Today',
                    proposalDescription:
                      offer.description ||
                      `Accepted offer on ${offer.propertyTitle}. Payment plan: ${offer.paymentPlan || '10% Escrow Deposit / Balance at DLD'}. Premium finishing and ready for closing.`,
                    note: 'Escrow account active. Title deed conveyance scheduled.',
                    photos: (offer.photos && offer.photos.length > 0)
                      ? offer.photos
                      : [
                          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
                        ],
                    location: offer.location || 'Palm Jumeirah, Dubai',
                    brochureName: 'Brochure.pdf',
                    amount: offer.price,
                  }

                  return (
                    <AgentOfferCard
                      key={offer.id}
                      offer={offerData}
                      onOpenChat={() => {
                        const matchedChat = investor.conversations.find(
                          (c) => c.offerRef === offer.id || c.requestRef === offer.requestId || c.with === offer.agentName
                        )
                        if (matchedChat) {
                          setActiveChatId(matchedChat.id)
                        }
                        setActiveTab('conversations')
                        notify('Chat opened', `Opening conversation with ${offer.agentName}.`, 'info')
                      }}
                      onViewDetails={() =>
                        setSelectedOfferModal({
                          id: offer.id,
                          agentName: offer.agentName,
                          agentId: offer.agentId || `AG-${1050 + idx}`,
                          agentDeals: 42,
                          agentRating: offer.rating || 4.9,
                          agentSubscription: 'Pro agent',
                          agentVerified: true,
                          proposalText: offer.description || `Accepted offer for ${offer.propertyTitle}. Agreed Price: ${offer.price}.`,
                          photos: (offer.photos && offer.photos.length > 0)
                            ? offer.photos
                            : [
                                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
                              ],
                          price: offer.price,
                        })
                      }
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              10. DEALS & ESCROW (Figma Node 297:46017)
             ========================================================================= */}
          {activeTab === 'deals' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4 font-sans">
              <div className="border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[20px] font-bold text-[#1f2327]">Deals & Escrow Transactions ({investor.dealList.length})</h3>
                <p className="text-[13px] text-[#6f777f]">Official real estate sales agreements and escrow status</p>
              </div>

              <div className="space-y-3">
                {investor.dealList.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[10px] border border-[#d3d5d7] bg-white p-4 hover:border-[#00c2cb] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#fff4e5] text-[#b54708] font-bold shrink-0">
                        <Sparkles className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[15px] text-[#1f2327]">{deal.property}</p>
                          <span className="font-mono text-[11px] font-semibold text-[#00c2cb] bg-[#e5f6f7] px-2 py-0.5 rounded-[4px]">
                            {deal.id}
                          </span>
                          <span className="rounded-full bg-[#dfefe8] text-[#17b26a] px-2 py-0.5 text-[11px] font-semibold">
                            {deal.status || 'Completed'}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#6f777f]">Agent: {deal.agent} ({deal.agency}) • Closed {deal.date || 'Today, 11:30'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:text-right">
                      <div>
                        <span className="text-[11px] text-[#6f777f] block">Commission</span>
                        <span className="font-semibold text-[13px] text-[#1f2327]">{deal.commission}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#6f777f] block">Total Amount</span>
                        <span className="font-bold text-[16px] text-[#1f2327]">{deal.amount}</span>
                      </div>
                      <Link
                        href={`/deals?search=${deal.id}`}
                        className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0"
                      >
                        <span>View Deal</span>
                        <ExternalLink className="size-3 text-[#00c2cb]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              11. CONVERSATIONS & NEGOTIATIONS (Figma Nodes 300:4068 & 99:30669)
             ========================================================================= */}
          {activeTab === 'conversations' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Live Negotiation & Client Chats</h3>
                  <p className="text-xs text-[#6f777f]">Direct moderation room, broker negotiations, and message audits.</p>
                </div>
              </div>
              <ChatModerator
                key={activeChatId || investor.conversations[0]?.id || 'CHAT-DEAL-4820'}
                initialThreadId={activeChatId || investor.conversations[0]?.id || 'CHAT-DEAL-4820'}
              />
            </div>
          )}

          {/* =========================================================================
              12. REPORTS & AUDITS
             ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5 font-sans">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Compliance Reports & Audit Logs</h3>
                  <p className="text-xs text-muted-foreground">Automated compliance screenings, AML checks, and audit trails</p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Report Generated', 'New KYC & AML audit certificate exported.')}
                  className="rounded-xl border border-border bg-secondary/80 hover:bg-secondary px-3.5 py-2 text-xs font-bold text-foreground"
                >
                  Generate Audit Report
                </button>
              </div>

              <div className="divide-y divide-border">
                {displayReports.map((report) => (
                  <div key={report.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-foreground">{report.title}</p>
                        <span className="text-xs font-mono text-muted-foreground">{report.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{report.detail}</p>
                      {report.author && (
                        <p className="text-[11px] text-muted-foreground mt-1">Auditor: <strong>{report.author}</strong></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              13. NOTIFICATIONS (Investor Notifications - Figma Node 297:45269)
             ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <div>
                  <h3 className="text-[20px] font-bold text-[#1f2327]">Investor Notifications ({investor.notifications.length})</h3>
                  <p className="text-[13px] text-[#6f777f]">Automated alerts, push updates, and compliance notices delivered to user</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifModalOpen(true)}
                  className="rounded-[8px] bg-[#1f2327] px-3.5 py-2 text-[13px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Send New Notice
                </button>
              </div>

              <div className="space-y-2.5">
                {investor.notifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3.5 rounded-[10px] border border-[#d3d5d7] bg-white p-4 hover:bg-[#fcfcfc] transition-colors">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb]">
                      <Bell className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[14px] text-[#1f2327]">{notif.title}</p>
                        <span className="text-[12px] font-medium text-[#9da4ae]">{notif.date}</span>
                      </div>
                      <p className="text-[12px] text-[#6f777f] mt-0.5">{notif.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              14. INTERNAL NOTES (Figma Node 297:45269)
             ========================================================================= */}
          {activeTab === 'notes' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4 font-sans">
              <div className="border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[20px] font-bold text-[#1f2327]">Internal Notes ({investor.internalNotes.length})</h3>
                <p className="text-[13px] text-[#6f777f]">Private administrative notes visible exclusively to Duseat staff</p>
              </div>

              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type an internal note about this investor..."
                  className="h-[40px] flex-1 rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb]"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="h-[40px] rounded-[8px] bg-[#00c2cb] px-5 text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-2.5 pt-1">
                {investor.internalNotes.map((note) => (
                  <div key={note.id} className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[13px] font-bold text-[#1f2327]">
                      <span>{note.author}</span>
                      <span className="text-[12px] text-[#9da4ae] font-normal">{note.date}</span>
                    </div>
                    <p className="text-[13px] text-[#6f777f] leading-relaxed">{note.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              15. ACTIVITY SCORE (Investor Reputation & Trust Score - Figma Node 297:45269)
             ========================================================================= */}
          {activeTab === 'activity-score' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6 font-sans">
              <div className="border-b border-[#d3d5d7] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-[20px] font-bold text-[#1f2327]">Investor Reputation & Trust Score Breakdown</h3>
                  <p className="text-[13px] text-[#6f777f]">Composite real-time reliability index computed from response time, transactions, and verified KYC</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#dfefe8] text-[#17b26a] px-3 py-1 text-xs font-bold">
                    Top 3% Tier 1 Buyer
                  </span>
                </div>
              </div>

              {/* Main Score Display Banner */}
              <div className="grid gap-6 sm:grid-cols-12 items-center bg-[#f8f9fa] p-6 rounded-[12px] border border-[#d3d5d7]">
                <div className="sm:col-span-4 text-center sm:text-left space-y-1">
                  <span className="text-[12px] uppercase font-bold text-[#6f777f] tracking-wider">Overall Score</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[#00c2cb]">95</span>
                    <span className="text-xl text-[#6f777f] font-semibold">/ 100</span>
                  </div>
                  <p className="text-xs text-[#17b26a] font-semibold">Excellent • Highest Trust Rank</p>
                </div>

                <div className="sm:col-span-8 grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-[8px] border border-[#d3d5d7]">
                    <span className="text-[#6f777f] text-[12px]">KYC Trust Level</span>
                    <p className="mt-1 text-[15px] font-bold text-[#1f2327]">100%</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-[8px] border border-[#d3d5d7]">
                    <span className="text-[#6f777f] text-[12px]">Payment Reliability</span>
                    <p className="mt-1 text-[15px] font-bold text-[#1f2327]">96%</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-[8px] border border-[#d3d5d7]">
                    <span className="text-[#6f777f] text-[12px]">Average Response Time</span>
                    <p className="mt-1 text-[15px] font-bold text-[#1f2327]">&lt; 10 min</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-[8px] border border-[#d3d5d7]">
                    <span className="text-[#6f777f] text-[12px]">Fraud Risk</span>
                    <p className="mt-1 text-[15px] font-bold text-[#17b26a]">0.01% (Ultra Low)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleRequestStatusUpdate}
          onOpenChatWithAgent={() => {
            setSelectedRequest(null)
            setActiveTab('conversations')
          }}
        />
      )}

      {/* Document Viewer & Verification Modal */}
      {selectedDocId && (
        <DocumentViewerModal
          documents={investor.verificationDocs}
          initialDocId={selectedDocId}
          userName={investor.name}
          userCountry={investor.country}
          userRole="Investor"
          onClose={() => setSelectedDocId(null)}
          onUpdateStatus={handleDocVerify}
        />
      )}

      {/* Send Notification Modal */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] ant-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg space-y-4 ant-modal-zoom">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-foreground font-sans">Send Notification</h3>
              <button onClick={() => setNotifModalOpen(false)} className="ant-wave-btn">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <textarea
              value={notifMsg}
              onChange={(e) => setNotifMsg(e.target.value)}
              placeholder="Enter notification message text..."
              className="h-24 w-full rounded-lg border border-input p-3 text-xs outline-none focus:ring-1 focus:ring-ring font-sans ant-input-glow"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNotifModalOpen(false)}
                className="rounded-lg border border-input px-4 py-2 text-xs font-medium font-sans ant-wave-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotifModalOpen(false)
                  setNotifMsg('')
                  notify('Notification Sent', `Delivered to ${investor.name}.`)
                }}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 font-sans ant-wave-btn"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
      {isEditProfileOpen && (
        <EditInvestorProfileModal
          investor={investor}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updatedInvestor) => {
            setInvestor(updatedInvestor)
            try {
              localStorage.setItem(storageKey, JSON.stringify(updatedInvestor))
              const recordsStr = localStorage.getItem('duseat_investors_records')
              if (recordsStr) {
                const records: PlatformInvestor[] = JSON.parse(recordsStr)
                const next = records.map((r) => (r.id === updatedInvestor.id ? updatedInvestor : r))
                localStorage.setItem('duseat_investors_records', JSON.stringify(next))
              }
            } catch {}
            notify('Profile Updated', `${updatedInvestor.name}'s profile has been updated successfully.`)
          }}
        />
      )}
      {selectedOfferModal && (
        <OfferDetailsModal
          isOpen={!!selectedOfferModal}
          offer={selectedOfferModal}
          onClose={() => setSelectedOfferModal(null)}
          onEdit={(off) => notify('Edit Offer', `Editing offer ${off.id}`)}
          onDelete={(off) => {
            notify('Offer Deleted', `Offer ${off.id} was removed.`, 'error')
            setSelectedOfferModal(null)
          }}
          onAccept={(off) => {
            notify('Offer Accepted', `Offer ${off.id} accepted! Moving to closing phase.`)
            setSelectedOfferModal(null)
          }}
        />
      )}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={(reqId, newStatus) => {
            handleRequestStatusUpdate(reqId, newStatus)
            setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null))
          }}
          onUpdateRequest={(updatedReq) => {
            const updated = investor.requestsList.map((r) => (r.id === updatedReq.id ? updatedReq : r))
            saveInvestor({ ...investor, requestsList: updated })
            setSelectedRequest(updatedReq)
          }}
        />
      )}
    </PlatformShell>
  )
}

export function InvestorProfile({ investor }: { investor: PlatformInvestor }) {
  return (
    <ToastProvider>
      <InvestorProfileInner investor={investor} />
    </ToastProvider>
  )
}
