'use client'

import * as React from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageCircle,
  ShieldCheck,
  Send,
  Download,
  ExternalLink,
  Eye,
  Building2,
  Award,
  Star,
  Activity,
  UserCheck,
  KeyRound,
  UserX,
  AlertCircle,
  Trash2,
  Mail,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  LogIn,
  Check,
  Clock,
  Briefcase,
  Layers,
  History,
  FileCheck2,
  DollarSign,
  Plus,
  Pencil,
} from 'lucide-react'
import Link from 'next/link'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { DocumentViewerModal } from './document-viewer-modal'
import { EditAgentBadgeModal } from './edit-agent-badge-modal'
import { EditAgentProfileModal } from './edit-agent-profile-modal'
import { OfferDetailsModal, type OfferDetail } from './offer-details-modal'
import { AgentOfferCard, type AgentOfferData } from './agent-offer-card'
import { ChatModerator } from './chat-moderator'
import { AgentPlanBadge, FigmaStatusBadge, RateBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { AvatarLightboxModal } from '@/components/ui/avatar-lightbox-modal'
import { cn } from '@/lib/utils'
import type { ActivityItem, Conversation, PlatformAgent, VerificationDocument } from '@/lib/platform-users'

const allSections = [
  { id: 'profile', label: 'Profile', category: 'Core' },
  { id: 'company', label: 'Company', category: 'Core' },
  { id: 'trade-license', label: 'Trade License', category: 'Security & Compliance' },
  { id: 'rera-verification', label: 'RERA Verification', category: 'Security & Compliance' },
  { id: 'documents', label: 'Documents', category: 'Security & Compliance' },
  { id: 'performance', label: 'Performance', category: 'Activity & Deals' },
  { id: 'offers', label: 'Offers', category: 'Activity & Deals' },
  { id: 'requests-won', label: 'Requests Won', category: 'Activity & Deals' },
  { id: 'deals', label: 'Deals', category: 'Activity & Deals' },
  { id: 'chats', label: 'Chats', category: 'Activity & Deals' },
  { id: 'payments', label: 'Payments', category: 'Activity & Deals' },
  { id: 'subscription', label: 'Subscription', category: 'Core' },
  { id: 'reports', label: 'Reports', category: 'Security & Compliance' },
  { id: 'timeline', label: 'Timeline', category: 'Core' },
  { id: 'notes', label: 'Internal Notes', category: 'Core' },
] as const

type SectionId = typeof allSections[number]['id']

function AgentProfileInner({ agent: initialAgent }: { agent: PlatformAgent }) {
  const { toast } = useToast()
  const [agent, setAgent] = React.useState<PlatformAgent>(initialAgent)
  const [status, setStatus] = React.useState(agent.status)
  const [subscription, setSubscription] = React.useState(agent.subscription)
  const [activeTab, setActiveTab] = React.useState<SectionId>('profile')
  const [filterCategory, setFilterCategory] = React.useState<'All' | 'Core' | 'Activity & Deals' | 'Security & Compliance'>('Core')
  const [confirm, setConfirm] = React.useState<ConfirmRequest | null>(null)
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null)
  const [selectedOfferModal, setSelectedOfferModal] = React.useState<OfferDetail | null>(null)
  const [isEditBadgeOpen, setIsEditBadgeOpen] = React.useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = React.useState(false)
  const [viewAllMode, setViewAllMode] = React.useState(false)

  // Internal Notes State
  const [notes, setNotes] = React.useState<ActivityItem[]>(agent.notes || [
    { id: 'n1', title: 'Ahmad Khaled (Super Admin)', detail: 'Licensed top performer with over 40 closed deals in Downtown and Palm Jumeirah.', date: 'Today, 09:42', tone: 'info' }
  ])
  const [newNoteText, setNewNoteText] = React.useState('')
  const [isAddingNote, setIsAddingNote] = React.useState(false)

  // Interactive Chats State
  const [threads, setThreads] = React.useState<Conversation[]>(agent.chats || [])
  const [replyText, setReplyText] = React.useState('')

  const agentDocs: VerificationDocument[] = React.useMemo(() => {
    return agent.documents.map((d, i) => ({
      id: `doc-ag-${i + 1}`,
      name: d.name,
      type: (d.name.includes('Trade')
        ? 'Trade License'
        : d.name.includes('RERA')
        ? 'Trade License'
        : d.name.includes('Emirates ID')
        ? 'Emirates ID Front'
        : 'Passport') as any,
      status: (d.status === 'Approved' ? 'Verified' : d.status === 'Rejected' ? 'Rejected' : 'Pending') as any,
      uploadedAt: d.uploaded,
      reviewedBy: 'Duseat Compliance Team',
      reviewNotes: 'Verified with Dubai Land Department (RERA) / DED database.',
    }))
  }, [agent.documents])

  const formattedOffers: AgentOfferData[] = React.useMemo(() => {
    return agent.offersList.map((off, i) => {
      const isAccepted = off.status === 'Accepted'
      const isDeclined = off.status === 'Declined'
      const status: 'Accepted' | 'Pending' | 'Declined' = isAccepted
        ? 'Accepted'
        : isDeclined
        ? 'Declined'
        : 'Pending'

      const photos = off.photos && off.photos.length > 0 ? off.photos : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
      ]

      return {
        id: off.id || `OFF-${agent.id}-${i + 1}`,
        requestId: `#REQ-${1024 + i}`,
        status,
        name: agent.name,
        avatar: agent.avatar,
        agentId: agent.id,
        dealsCount: agent.accepted,
        rating: agent.rating,
        subscriptionPlan: agent.subscription,
        isVerified: agent.verification === 'Verified' || agent.verification === 'RERA + KYC',
        investorName: off.investor,
        investorRole: off.investorRole || 'Investor',
        investorAvatar: off.investorAvatar,
        proposalDescription:
          off.proposalDescription ||
          'Rare chance to own a luxury golf-view villa with premium finishes, spacious interiors, and prime location in Al Barsha. Ideal for upscale living.',
        note: 'Family-friendly community with schools and parks nearby.',
        photos,
        location: off.location || 'Palm Jumeirah',
        brochureName: off.brochureName || 'Brochure.pdf',
        amount: off.amount,
        timeAgo: off.date || `${4 + i * 12} min ago`,
      }
    })
  }, [agent, agent.offersList])

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const applyAction = (kind: string) => {
    switch (kind) {
      case 'approve':
      case 'verify':
        setStatus('Verified')
        setAgent((prev) => ({ ...prev, status: 'Verified', verification: 'RERA + KYC' }))
        notify('Agent verified', `${agent.name} approved and verified with RERA + KYC.`)
        break
      case 'reject':
        setStatus('Rejected')
        setAgent((prev) => ({ ...prev, status: 'Rejected' }))
        notify('Agent rejected', `${agent.name} application was rejected.`, 'error')
        break
      case 'suspend':
        setStatus('Suspended')
        setAgent((prev) => ({ ...prev, status: 'Suspended' }))
        notify('Agent suspended', `${agent.name} has been suspended.`, 'error')
        break
      case 'upgrade':
      case 'upgrade-plan':
        setSubscription('Elite agent')
        setAgent((prev) => ({ ...prev, subscription: 'Elite agent' }))
        notify('Plan upgraded', `${agent.name} upgraded to Elite agent.`)
        break
      case 'downgrade':
      case 'downgrade-plan':
        setSubscription('Power agent')
        setAgent((prev) => ({ ...prev, subscription: 'Power agent' }))
        notify('Plan downgraded', `${agent.name} moved to Power agent.`, 'info')
        break
      case 'reset':
      case 'reset-password':
        notify('Reset link sent', `Password reset link emailed to ${agent.name}.`)
        break
      case 'login':
      case 'login-as':
        notify('Login as agent', `Impersonation session started for ${agent.name}.`, 'info')
        break
      default:
        notify('Action complete', `${agent.name} record updated.`)
    }
  }

  const confirmMeta: Record<
    string,
    { title: string; confirmLabel: string; tone: ConfirmRequest['tone']; icon: ConfirmRequest['icon']; describe: (name: string) => string }
  > = {
    reject: {
      title: 'Reject Agent Application',
      confirmLabel: 'Reject',
      tone: 'danger',
      icon: 'ban',
      describe: (name) => `${name} will be notified that the application was rejected.`,
    },
    suspend: {
      title: 'Suspend Agent Account',
      confirmLabel: 'Suspend',
      tone: 'warning',
      icon: 'suspend',
      describe: (name) => `${name} will not be able to submit property offers until reactivated.`,
    },
    reset: {
      title: 'Reset Password',
      confirmLabel: 'Send Reset Link',
      tone: 'brand',
      icon: 'reset',
      describe: (name) => `A password reset link will be sent to ${name} via email.`,
    },
  }

  const runAction = (kind: string) => {
    const m = confirmMeta[kind]
    if (m) {
      setConfirm({
        title: m.title,
        description: m.describe(agent.name),
        confirmLabel: m.confirmLabel,
        tone: m.tone,
        icon: m.icon,
        onConfirm: () => applyAction(kind),
      })
      return
    }
    applyAction(kind)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    const noteItem: ActivityItem = {
      id: `n-${Date.now()}`,
      title: 'Ahmad Khaled (Super Admin)',
      detail: newNoteText.trim(),
      date: 'Just now',
      tone: 'info',
    }
    setNotes([noteItem, ...notes])
    setNewNoteText('')
    setIsAddingNote(false)
    notify('Note added', 'Internal note recorded successfully.')
  }

  const handleSendReply = (threadId: string) => {
    if (!replyText.trim()) return
    const newMsg = {
      id: `msg-${Date.now()}`,
      from: 'agent' as const,
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, newMsg] } : t))
    )
    setReplyText('')
    notify('Message sent', 'Message delivered to investor negotiation thread.')
  }

  const filteredTabs = React.useMemo(() => {
    if (filterCategory === 'All') return allSections
    return allSections.filter((s) => s.category === filterCategory)
  }, [filterCategory])

  return (
    <PlatformShell title={agent.name} eyebrow="agent">
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* 1. Header Card with Agent Summary & Quick Actions */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Avatar + Identity + Status Badges */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <AvatarFlagOverlay code={getCountryCode(agent.country || 'Egypt')}>
                <div
                  onClick={() => setAvatarModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  title="Click to view and download photo"
                  className="size-[72px] sm:size-[80px] rounded-[12px] overflow-hidden bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#00c2cb] hover:scale-105 active:scale-95 transition-all select-none"
                >
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} className="size-full object-cover" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-white font-sans">
                      {agent.name
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
                  src={agent.avatar}
                  name={agent.name}
                  country={agent.country}
                  countryCode={getCountryCode(agent.country || 'EG')}
                  subtitle={`Agent ID: ${agent.id} • ${agent.agency || 'Licensed Broker'}`}
                />
              )}

              <div className="space-y-1 font-sans">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                    {agent.name}
                  </h1>
                  <FigmaStatusBadge status={status} />
                  <AgentPlanBadge plan={subscription} />
                </div>

                <div className="text-[14px] leading-[20px] text-[#6f777f] flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span>
                    ID : <strong className="font-medium text-[#1f2327]">{agent.id}</strong>
                  </span>
                  <span className="text-[#d3d5d7]">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Flag code={getCountryCode(agent.country || 'Egypt')} size="s" />
                    <span>{agent.country || 'Egypt'}</span>
                  </span>
                  <span className="text-[#d3d5d7]">•</span>
                  <span>
                    Agency: <strong className="font-medium text-[#1f2327]">{agent.agency}</strong>
                  </span>
                  <span className="text-[#d3d5d7]">•</span>
                  <span>
                    RERA: <strong className="font-medium text-[#1f2327]">{agent.reraNumber || 'BRN-61284'}</strong>
                  </span>
                  <span className="text-[#d3d5d7]">•</span>
                  <span>{agent.email}</span>
                </div>

                <div className="text-[12px] leading-[16px] text-[#6f777f] flex flex-wrap items-center gap-2 pt-0.5">
                  <span>
                    Member since <strong className="font-medium text-[#1f2327]">{agent.joined}</strong>
                  </span>
                  <span className="text-[#d3d5d7]">•</span>
                  <span>
                    Last active <strong className="font-medium text-[#1f2327]">{agent.lastLogin}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="flex h-[38px] sm:h-[40px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[14px] leading-[20px] font-semibold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
              >
                <Pencil className="size-4" />
                <span>Edit Profile</span>
              </button>

              {status !== 'Verified' && (
                <button
                  type="button"
                  onClick={() => runAction('approve')}
                  className="flex h-[38px] sm:h-[40px] items-center gap-1.5 rounded-[8px] bg-[#17b26a] px-3.5 text-[14px] leading-[20px] font-semibold text-white hover:bg-[#159a5c] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  <UserCheck className="size-4" />
                  <span>Approve & Verify</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditBadgeOpen(true)}
                className="flex h-[38px] sm:h-[40px] items-center gap-2 rounded-[8px] border border-[#00c2cb] bg-[#e5f6f7]/50 px-3.5 text-[14px] leading-[20px] font-semibold text-[#00a4ac] hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer ant-wave-btn shadow-2xs"
              >
                <Award className="size-4" />
                <span>Edit Plan & Badge</span>
              </button>

              <button
                type="button"
                onClick={() => runAction('login')}
                className="flex h-[38px] sm:h-[40px] items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
              >
                <span>Login as agent</span>
              </button>

              <Dropdown
                align="end"
                ariaLabel="More agent actions"
                floating
                onSelect={(val) => {
                  if (val === 'edit-profile') setIsEditProfileOpen(true)
                  else if (val === 'edit-badge') setIsEditBadgeOpen(true)
                  else runAction(val)
                }}
                options={[
                  { label: 'Edit Full Profile Details', value: 'edit-profile', icon: <Pencil className="size-4 text-[#00c2cb]" /> },
                  { label: 'Edit Plan & Badge Preset', value: 'edit-badge', icon: <Award className="size-4 text-[#00c2cb]" /> },
                  ...(status !== 'Verified'
                    ? [{ label: 'Verify Agent', value: 'verify', icon: <UserCheck className="size-4 text-emerald-600" /> }]
                    : []),
                  { label: 'Upgrade Plan (Elite)', value: 'upgrade', icon: <ArrowUpRight className="size-4 text-[#00c2cb]" /> },
                  { label: 'Downgrade Plan (Power)', value: 'downgrade', icon: <TrendingUp className="size-4 text-[#6f777f]" /> },
                  { label: 'Reset Password', value: 'reset', icon: <KeyRound className="size-4 text-[#6f777f]" /> },
                  ...(status !== 'Suspended'
                    ? [{ label: 'Suspend Account', value: 'suspend', icon: <UserX className="size-4 text-amber-600" />, destructive: true }]
                    : []),
                  { label: 'Reject Application', value: 'reject', icon: <AlertCircle className="size-4 text-destructive" />, destructive: true },
                ]}
                trigger={
                  <span className="flex size-[38px] sm:size-[40px] items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs">
                    <MoreHorizontal className="size-5" />
                  </span>
                }
              />
            </div>
          </div>

          {/* 2. Quick 4 KPI Cards Bar */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3 font-sans">
            <button
              type="button"
              onClick={() => {
                setFilterCategory('Activity & Deals')
                setActiveTab('offers')
              }}
              className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer"
            >
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Requests</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#1f2327]">{agent.requestsWon?.length || 8}</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCategory('Activity & Deals')
                setActiveTab('offers')
              }}
              className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer"
            >
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Offers received</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#1f2327]">{agent.offers || 12}</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCategory('Activity & Deals')
                setActiveTab('deals')
              }}
              className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer"
            >
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Deals completed</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#17b26a]">{agent.accepted || 1}</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCategory('Activity & Deals')
                setActiveTab('performance')
              }}
              className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 text-left shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] hover:border-[#00c2cb]/50 transition-all cursor-pointer"
            >
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Total score</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#00c2cb]">
                {agent.rating ? Math.round(agent.rating * 10) + agent.accepted * 2 : 92}
              </p>
            </button>
          </div>
        </header>

        {/* 3. Navigation Bar: Category Filter & Sub-Tabs */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] font-sans space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#d3d5d7] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[16px] sm:text-[18px] font-semibold text-[#1f2327]">
                Agent Profile Directory ({allSections.length} Sections)
              </span>
            </div>

            {/* View All & Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-[14px]">
              <button
                type="button"
                onClick={() => setViewAllMode(!viewAllMode)}
                className={cn(
                  'h-[34px] px-3.5 rounded-[8px] font-medium transition-colors cursor-pointer ant-wave-btn flex items-center gap-1.5',
                  viewAllMode
                    ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                    : 'border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3]'
                )}
              >
                <Eye className="size-4" />
                <span>{viewAllMode ? 'Tabbed Mode' : 'View All / عرض الكل'}</span>
              </button>

              {(['All', 'Core', 'Activity & Deals', 'Security & Compliance'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setViewAllMode(false)
                    setFilterCategory(cat)
                    if (cat === 'Core') setActiveTab('profile')
                    else if (cat === 'Activity & Deals') setActiveTab('performance')
                    else if (cat === 'Security & Compliance') setActiveTab('trade-license')
                  }}
                  className={cn(
                    'h-[34px] px-3 rounded-[8px] font-medium transition-colors cursor-pointer ant-wave-btn',
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
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            {filteredTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex h-[34px] items-center gap-2 whitespace-nowrap rounded-[8px] px-3.5 text-[14px] sm:text-[15px] font-medium transition-all cursor-pointer ant-wave-btn',
                    isActive
                      ? 'bg-[#00c2cb] text-white shadow-xs font-semibold'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 4. Tab Content: 15 Distinct Section Renderers */}
        <div className="space-y-6 font-sans">
          {/* =========================================================================
              1. PROFILE / OVERVIEW
             ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="grid gap-6 xl:grid-cols-12">
              {/* Left: Key Stats & Company Snapshot */}
              <div className="space-y-6 xl:col-span-8">
                {/* Performance Summary */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[22px] sm:text-[24px] font-bold text-[#1f2327]">Agent Overview & Performance</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('performance')}
                      className="text-[18px] sm:text-[20px] font-normal text-[#00c2cb] underline cursor-pointer hover:opacity-80"
                    >
                      View details
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-[8px] border border-[#d3d5d7] p-3.5 bg-[#fcfcfc]">
                      <p className="text-xs text-[#6f777f]">Response Rate</p>
                      <p className="mt-1 text-xl font-bold text-[#1f2327]">{agent.performance.responseRate}</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] p-3.5 bg-[#fcfcfc]">
                      <p className="text-xs text-[#6f777f]">Conversion Rate</p>
                      <p className="mt-1 text-xl font-bold text-[#17b26a]">{agent.performance.conversionRate}</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] p-3.5 bg-[#fcfcfc]">
                      <p className="text-xs text-[#6f777f]">Avg Response Time</p>
                      <p className="mt-1 text-xl font-bold text-[#1f2327]">{agent.performance.avgResponse}</p>
                    </div>
                    <div className="rounded-[8px] border border-[#d3d5d7] p-3.5 bg-[#fcfcfc]">
                      <p className="text-xs text-[#6f777f]">Active Deals</p>
                      <p className="mt-1 text-xl font-bold text-[#00c2cb]">{agent.performance.activeDeals}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Offers matching Figma cards */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Recent Property Offers</h3>
                      <p className="text-xs text-[#6f777f]">Latest proposals sent to investors with real-time status.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('offers')}
                      className="text-[15px] sm:text-[16px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
                    >
                      View all ({formattedOffers.length})
                    </button>
                  </div>
                  <div className="grid gap-5 grid-cols-1 md:grid-cols-2 pt-2">
                    {formattedOffers.slice(0, 2).map((offer) => (
                      <AgentOfferCard
                        key={offer.id}
                        offer={offer}
                        onOpenChat={() => {
                          setActiveTab('chats')
                          notify('Chat opened', `Opening negotiation thread with ${offer.investorName}.`, 'info')
                        }}
                        onViewDetails={() =>
                          setSelectedOfferModal({
                            id: offer.id,
                            agentName: agent.name,
                            agentId: agent.id,
                            agentDeals: agent.accepted,
                            agentRating: agent.rating,
                            agentSubscription: agent.subscription,
                            agentVerified: agent.verification === 'Verified' || agent.verification === 'RERA + KYC',
                            proposalText: offer.proposalDescription,
                            photos: offer.photos,
                            price: offer.amount || 'AED 2.4M',
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Agency & License Record */}
              <div className="space-y-6 xl:col-span-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[22px] sm:text-[24px] font-bold text-[#1f2327]">Agency & Licensing</h3>
                    <span className="text-[16px] text-[#6f777f]">Official record</span>
                  </div>
                  <div className="space-y-3.5 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6f777f]">Agency / Company</p>
                      <p className="font-semibold text-[#1f2327] mt-0.5">{agent.agency}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6f777f]">RERA Number</p>
                      <p className="font-mono font-semibold text-[#1f2327] mt-0.5">{agent.reraNumber || 'BRN-61284'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6f777f]">Trade License</p>
                      <p className="font-mono font-semibold text-[#1f2327] mt-0.5">{agent.tradeLicense.number}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6f777f]">Country</p>
                      <p className="font-semibold text-[#1f2327] mt-0.5">{agent.country || 'United Arab Emirates'}</p>
                    </div>
                  </div>
                </div>

                {/* Notes Snapshot */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[22px] sm:text-[24px] font-bold text-[#1f2327]">Notes</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('notes')}
                      className="text-[18px] sm:text-[20px] font-normal text-[#00c2cb] underline cursor-pointer hover:opacity-80"
                    >
                      View all
                    </button>
                  </div>
                  <div className="rounded-[8px] border border-[#d3d5d7] p-3 text-xs bg-[#fcfcfc]">
                    <p className="font-semibold text-[#1f2327]">{notes[0]?.title}</p>
                    <p className="mt-1 text-[#6f777f]">{notes[0]?.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. COMPANY
             ========================================================================= */}
          {activeTab === 'company' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-[22px] font-bold text-[#1f2327]">Company Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(agent.company).map(([label, value]) => (
                  <div key={label} className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6f777f]">
                      {label.replaceAll(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="mt-1 text-[16px] font-semibold text-[#1f2327]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              3. TRADE LICENSE
             ========================================================================= */}
          {activeTab === 'trade-license' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#1f2327]">Trade License Verification</h3>
                <span className="rounded-[6px] bg-[#dfefe8] px-3 py-1 text-sm font-semibold text-[#17b26a]">
                  {agent.tradeLicense.status}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">License Number</p>
                  <p className="mt-1 text-[16px] font-bold text-[#1f2327]">{agent.tradeLicense.number}</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">Issuing Authority</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#1f2327]">{agent.tradeLicense.issuer}</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">Expiry Date</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#1f2327]">{agent.tradeLicense.expiry}</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">Status</p>
                  <p className="mt-1 text-[16px] font-bold text-[#17b26a]">{agent.tradeLicense.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. RERA VERIFICATION
             ========================================================================= */}
          {activeTab === 'rera-verification' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[#1f2327]">Dubai Land Department (RERA) Accreditation</h3>
                <span className="rounded-[6px] bg-[#dfefe8] px-3 py-1 text-sm font-semibold text-[#17b26a]">
                  {agent.reraVerification.status}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">Broker Register Number (BRN)</p>
                  <p className="mt-1 text-[16px] font-bold text-[#1f2327]">{agent.reraNumber || agent.reraVerification.number}</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">Category</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#1f2327]">{agent.reraVerification.category}</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">Validity</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#1f2327]">{agent.reraVerification.expiry}</p>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc]">
                  <p className="text-xs text-[#6f777f]">RERA Status</p>
                  <p className="mt-1 text-[16px] font-bold text-[#17b26a]">{agent.reraVerification.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              5. DOCUMENTS
             ========================================================================= */}
          {activeTab === 'documents' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-[22px] font-bold text-[#1f2327]">Submitted Verification Documents</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {agentDocs.map((doc) => (
                  <div key={doc.id} className="rounded-[12px] border border-[#d3d5d7] p-4 flex flex-col justify-between gap-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-[8px] bg-[#c7ecee]/40 flex items-center justify-center text-[#00a4ac]">
                        <FileText className="size-5" />
                      </div>
                      <span className="rounded-[6px] bg-[#dfefe8] px-2.5 py-0.5 text-xs font-semibold text-[#17b26a]">
                        {doc.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-[16px] text-[#1f2327]">{doc.name}</p>
                      <p className="text-xs text-[#6f777f] mt-0.5">Uploaded on {doc.uploadedAt}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDocId(doc.id)}
                      className="flex h-[36px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#00c2cb] text-[#00c2cb] hover:bg-[#00c2cb] hover:text-white transition-colors text-sm font-semibold cursor-pointer"
                    >
                      <Eye className="size-4" />
                      <span>Preview Document (معاينة)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              6. PERFORMANCE (Figma Node 312:38277)
             ========================================================================= */}
          {activeTab === 'performance' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Agent Performance Metrics</h3>
                <span className="text-xs text-[#6f777f]">Updated real-time</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Response Rate', value: agent.performance.responseRate || '90%' },
                  { label: 'Conversion Rate', value: agent.performance.conversionRate || '20.0%' },
                  { label: 'Avg Response', value: agent.performance.avgResponse || '8 min' },
                  { label: 'Rating', value: `${agent.rating.toFixed(1)} / 5` },
                  { label: 'Active Deals', value: String(agent.performance.activeDeals || '3') },
                  { label: 'Total Volume', value: agent.revenue || 'AED 14.5M' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[12px] border border-[#d3d5d7] p-4 bg-[#fcfcfc] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.05),0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  >
                    <p className="text-[14px] text-[#6f777f] font-normal">{item.label}</p>
                    <p className="mt-1 text-[20px] sm:text-[24px] font-bold text-[#1f2327]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              7. OFFERS (Figma Nodes 815:9706, 815:9276, 815:9575)
             ========================================================================= */}
          {activeTab === 'offers' && (
            <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-6 sm:p-7 shadow-xs space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">
                    Submitted Property Offers ({formattedOffers.length})
                  </h3>
                  <p className="text-xs text-[#6f777f]">Active proposals submitted by {agent.name} to investors, matching Figma design specs.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[8px] border border-[#d3d5d7] bg-[#F9FAFB] px-3.5 py-1.5 text-xs font-semibold text-[#1f2327] shadow-2xs">
                    Showing {formattedOffers.length} offers
                  </span>
                </div>
              </div>

              {/* Offer Cards Grid matching Figma Nodes (Declined, Pending, Accepted) scaled to Dashboard */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {formattedOffers.map((offer) => (
                  <AgentOfferCard
                    key={offer.id}
                    offer={offer}
                    onOpenChat={() => {
                      setActiveTab('chats')
                      notify('Chat opened', `Opening negotiation thread with ${offer.investorName}.`, 'info')
                    }}
                    onViewDetails={() =>
                      setSelectedOfferModal({
                        id: offer.id,
                        agentName: agent.name,
                        agentId: agent.id,
                        agentDeals: agent.accepted,
                        agentRating: agent.rating,
                        agentSubscription: agent.subscription,
                        agentVerified: agent.verification === 'Verified' || agent.verification === 'RERA + KYC',
                        proposalText: offer.proposalDescription,
                        photos: offer.photos,
                        price: offer.amount || 'AED 2.4M',
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              8. REQUESTS WON
             ========================================================================= */}
          {activeTab === 'requests-won' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-[22px] font-bold text-[#1f2327]">Requests Won</h3>
              <div className="divide-y divide-[#d3d5d7]">
                {agent.requestsWon.map((req, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-bold text-[#1f2327]">{req.title}</p>
                      <p className="text-xs text-[#6f777f]">Investor: {req.investor} • Won on {req.wonAt}</p>
                    </div>
                    <span className="text-base font-bold text-[#17b26a]">{req.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              9. DEALS
             ========================================================================= */}
          {activeTab === 'deals' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-[22px] font-bold text-[#1f2327]">Closed & In-Progress Deals</h3>
              <div className="divide-y divide-[#d3d5d7]">
                {agent.dealList.map((deal, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-bold text-[#1f2327]">{deal.property}</p>
                      <p className="text-xs text-[#6f777f]">Client: {deal.investor} • {deal.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1f2327]">{deal.amount}</p>
                      <span className="text-xs font-semibold text-[#00c2cb]">{deal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              10. CHATS (Figma Nodes 300:4068 & 99:30669)
             ========================================================================= */}
          {activeTab === 'chats' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Live Negotiation & Client Chats</h3>
                  <p className="text-xs text-[#6f777f]">Direct moderation room, investor negotiations, and message audits.</p>
                </div>
              </div>
              <ChatModerator initialThreadId="CHAT-917212" />
            </div>
          )}

          {/* =========================================================================
              11. PAYMENTS
             ========================================================================= */}
          {activeTab === 'payments' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-[22px] font-bold text-[#1f2327]">Payment Records & Subscriptions</h3>
              <div className="divide-y divide-[#d3d5d7]">
                {agent.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-[#1f2327]">{p.title}</p>
                      <p className="text-xs text-[#6f777f]">{p.detail}</p>
                    </div>
                    <span className="text-xs text-[#9da4ae]">{p.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              12. SUBSCRIPTION (Figma Node 312:38276)
             ========================================================================= */}
          {activeTab === 'subscription' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#d3d5d7] pb-4">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Subscription</h3>
                  <p className="text-xs text-[#6f777f]">Manage active plan, recurring billing cycle, and offer limits.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6f777f]">Agents needed</span>
                  <button
                    type="button"
                    onClick={() => setIsEditBadgeOpen(true)}
                    className="flex h-[36px] items-center gap-2 rounded-[8px] bg-[#1f2327] px-4 text-xs font-semibold text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit plan</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Left Plan Card */}
                <div className="rounded-[12px] border border-[#d3d5d7] p-5 bg-[#fcfcfc] space-y-4">
                  <div>
                    <p className="text-xs text-[#6f777f] font-medium">Current plan</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="text-[20px] font-bold text-[#1f2327]">{subscription}</span>
                      <AgentPlanBadge plan={subscription} />
                    </div>
                    <p className="text-xs text-[#6f777f] mt-1">AED 999 / month</p>
                  </div>
                  <div className="border-t border-[#d3d5d7] pt-3 flex items-center justify-between text-xs text-[#6f777f]">
                    <span>Billing cycle: 01 Jan 2026 – 30 Jun 2026</span>
                    <span className="font-semibold text-[#1f2327]">Next billing: 01 Jul 2026</span>
                  </div>
                </div>

                {/* Right Usage Card */}
                <div className="rounded-[12px] border border-[#d3d5d7] p-5 bg-[#fcfcfc] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6f777f] font-medium">Monthly active offers</p>
                      <p className="mt-1 text-[24px] font-bold text-[#1f2327]">18 / 30</p>
                    </div>
                    <span className="text-xs font-bold text-[#00c2cb] bg-[#e5f6f7] px-2.5 py-1 rounded-[6px]">
                      60%
                    </span>
                  </div>
                  <div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#eff1f3]">
                      <div className="h-full bg-[#00c2cb] rounded-full" style={{ width: '60%' }} />
                    </div>
                    <p className="mt-1.5 text-xs text-[#6f777f]">12 offers remaining this month</p>
                  </div>
                  <div className="border-t border-[#d3d5d7] pt-3 text-xs text-[#6f777f] flex justify-between">
                    <span>Total savings</span>
                    <span className="font-bold text-[#17b26a]">AED 4,567</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              13. REPORTS (Figma Node 312:38275)
             ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Reports</h3>
                  <p className="text-xs text-[#6f777f]">Compliance audit log, moderation flags, and dispute records.</p>
                </div>
                <span className="text-xs text-[#6f777f]">Agent Audit Log</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans whitespace-nowrap">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="whitespace-nowrap">
                      <th className="px-4 py-3 font-semibold text-[#1f2327] whitespace-nowrap">ID</th>
                      <th className="px-4 py-3 font-semibold text-[#1f2327] whitespace-nowrap">Title</th>
                      <th className="px-4 py-3 font-semibold text-[#1f2327] whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 font-semibold text-[#1f2327] whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 font-semibold text-[#1f2327] whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {[
                      { id: 'RPT-1082', title: 'Audit report', date: '28/06/2026', status: 'Resolved' },
                      { id: 'RPT-1044', title: 'Spam report', date: '21/04/2026', status: 'Resolved' },
                      { id: 'RPT-1003', title: 'Verification request', date: '10/01/2026', status: 'Pending' },
                    ].map((rpt) => (
                      <tr key={rpt.id} className="hover:bg-[#f8f9fa] transition-colors whitespace-nowrap">
                        <td className="px-4 py-3 font-mono font-semibold text-[#6f777f] whitespace-nowrap">{rpt.id}</td>
                        <td className="px-4 py-3 font-medium text-[#1f2327] whitespace-nowrap">{rpt.title}</td>
                        <td className="px-4 py-3 text-[#6f777f] whitespace-nowrap">{rpt.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <FigmaStatusBadge status={rpt.status === 'Resolved' ? 'Verified' : 'Pending'} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => notify('Audit Report', `Viewing details for ${rpt.id}`)}
                            className="rounded-[6px] border border-[#d3d5d7] bg-white px-3 py-1 text-xs font-semibold text-[#00c2cb] hover:bg-[#eff1f3] cursor-pointer whitespace-nowrap"
                          >
                            View report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              14. TIMELINE (Figma Node 312:38276)
             ========================================================================= */}
          {activeTab === 'timeline' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Activity Timeline</h3>
                <p className="text-xs text-[#6f777f]">Chronological activity of verified actions, regulatory audits, and notifications.</p>
              </div>
              <div className="divide-y divide-[#d3d5d7]">
                {agent.timeline.map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#dfefe8] flex items-center justify-center text-[#17b26a]">
                        <Check className="size-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1f2327]">{event.title}</p>
                        <p className="text-xs text-[#6f777f]">{event.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#9da4ae]">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              15. NOTES (Figma Node 312:38276)
             ========================================================================= */}
          {activeTab === 'notes' && (
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1f2327]">Internal Notes ({notes.length})</h3>
                <p className="text-xs text-[#6f777f] mt-0.5">Private notes visible only to admins and agents on Duseat CRM</p>
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type an internal note with @mention..."
                  className="flex-1 rounded-[8px] border border-[#d3d5d7] px-4 py-2 text-sm outline-none focus:border-[#00c2cb]"
                />
                <button
                  type="submit"
                  className="h-[38px] rounded-[8px] bg-[#00c2cb] px-5 text-sm font-semibold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer shrink-0"
                >
                  Add note
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-[8px] border border-[#d3d5d7] p-4 bg-[#fcfcfc] flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-[14px] text-[#1f2327]">{n.title}</p>
                      <p className="mt-1 text-sm text-[#6f777f] leading-relaxed">{n.detail}</p>
                    </div>
                    <span className="text-xs text-[#9da4ae] shrink-0">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
      {selectedDocId && (
        <DocumentViewerModal
          documents={agentDocs}
          initialDocId={selectedDocId}
          userName={agent.name}
          userCountry="United Arab Emirates"
          userRole="Agent"
          onClose={() => setSelectedDocId(null)}
          onUpdateStatus={(docId, newStatus) => {
            notify('Document updated', `Status changed to ${newStatus}.`)
          }}
        />
      )}
      {isEditProfileOpen && (
        <EditAgentProfileModal
          agent={agent}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updatedAgent) => {
            setAgent(updatedAgent)
            setStatus(updatedAgent.status)
            setSubscription(updatedAgent.subscription)
            try {
              const recordsStr = localStorage.getItem('duseat_agents_records')
              if (recordsStr) {
                const records: PlatformAgent[] = JSON.parse(recordsStr)
                const next = records.map((r) => (r.id === updatedAgent.id ? updatedAgent : r))
                localStorage.setItem('duseat_agents_records', JSON.stringify(next))
              }
            } catch {}
            notify('Profile Updated', `${updatedAgent.name}'s profile updated successfully.`)
          }}
        />
      )}
      <EditAgentBadgeModal
        agent={agent}
        isOpen={isEditBadgeOpen}
        onClose={() => setIsEditBadgeOpen(false)}
        onSave={(plan, badge) => {
          setSubscription(`${plan} agent`)
          setAgent((prev) => ({ ...prev, subscription: `${plan} agent` }))
          notify('Agent updated', `Assigned ${plan} plan with badge: ${badge || 'Standard'}.`)
        }}
      />
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
            notify('Offer Accepted', `Offer ${off.id} accepted!`)
            setSelectedOfferModal(null)
          }}
        />
      )}
    </PlatformShell>
  )
}

export function AgentProfile({ agent }: { agent: PlatformAgent }) {
  return (
    <ToastProvider>
      <AgentProfileInner agent={agent} />
    </ToastProvider>
  )
}
