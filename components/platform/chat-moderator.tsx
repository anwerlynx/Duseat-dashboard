'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  Send,
  Paperclip,
  Camera,
  Mic,
  MoreHorizontal,
  Lock,
  Unlock,
  Trash2,
  Pencil,
  Flag,
  Copy,
  Pin,
  Download,
  AlertCircle,
  Check,
  CheckCheck,
  ExternalLink,
  Shield,
  User,
  Sparkles,
  Info,
  Award,
  FileText,
  X,
  Search,
  Maximize2,
  Volume2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Share2,
  ShieldCheck,
  Building,
  MapPin,
  DollarSign,
  Plus,
  Eye,
  PanelRightClose,
  PanelRight,
  Phone,
  Mail,
  Layers,
  Calendar,
  CheckCircle2,
  Compass,
  ArrowLeft,
  SlidersHorizontal,
  Radio,
  FileSpreadsheet,
  MessageSquare,
  LayoutGrid,
} from 'lucide-react'
import { FigmaStatusBadge, AgentPlanBadge } from '@/components/ui/figma-badges'
import { Flag as CountryFlag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { useToast } from '@/components/dashboard/toast'
import { cn } from '@/lib/utils'
import {
  type ChatThread,
  type ChatMessage,
  type PropertyCardData,
  type TimelineEvent,
  type InternalComplianceNote,
  initialChatThreads,
} from '@/lib/platform-chats'

export { initialChatThreads, type ChatThread, type ChatMessage, type PropertyCardData }

export function ChatModerator({
  initialThreadId = 'CHAT-917212',
  onClose,
  isModal = false,
}: {
  initialThreadId?: string
  onClose?: () => void
  isModal?: boolean
}) {
  const { toast } = useToast()
  const [threads, setThreads] = React.useState<ChatThread[]>(initialChatThreads)
  const [activeThreadId, setActiveThreadId] = React.useState(initialThreadId)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusTab, setStatusTab] = React.useState<'All' | 'Active' | 'Closed' | 'Flagged'>('All')

  // Mobile View Navigation: 'list' | 'chat'
  const [mobileView, setMobileView] = React.useState<'list' | 'chat'>('chat')

  // View Mode: Details Sidebar is hidden by default to maximize chat width
  const [showRightPanel, setShowRightPanel] = React.useState(false)
  const [showLeftPanel, setShowLeftPanel] = React.useState(true)

  // Active Thread
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0]

  // Composer State
  const [inputText, setInputText] = React.useState('')
  const [sendAs, setSendAs] = React.useState<'admin' | 'agent' | 'system'>('admin')
  const [systemNoticeType, setSystemNoticeType] = React.useState<
    'warning' | 'info' | 'deal_secured' | 'deal_created' | 'offer_accepted' | 'chat_closed'
  >('info')
  const [showSystemDialog, setShowSystemDialog] = React.useState(false)
  const [systemNoticeText, setSystemNoticeText] = React.useState('')

  // Audio Playback Simulation State
  const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null)
  const [playbackProgress, setPlaybackProgress] = React.useState(0)
  const [playbackSpeed, setPlaybackSpeed] = React.useState<1 | 1.5 | 2>(1)

  // Media & Modals
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null)
  const [videoModalUrl, setVideoModalUrl] = React.useState<string | null>(null)
  const [deleteMessageTarget, setDeleteMessageTarget] = React.useState<ChatMessage | null>(null)
  const [showCloseModal, setShowCloseModal] = React.useState(false)
  const [showFlagModal, setShowFlagModal] = React.useState(false)
  const [flagReason, setFlagReason] = React.useState('Suspicious contact sharing attempt')
  const [showExportModal, setShowExportModal] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<'csv' | 'txt' | 'json'>('csv')
  const [copiedId, setCopiedId] = React.useState(false)
  const [showMoreMenu, setShowMoreMenu] = React.useState(false)

  // Typing indicator simulation
  const [isTyping, setIsTyping] = React.useState(false)

  // Right Panel Accordion States
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    participants: true,
    property: true,
    overview: false,
    media: true,
    timeline: false,
    surveillance: false,
    compliance: true,
  })

  // Media Tab Filter in Sidebar
  const [mediaTabFilter, setMediaTabFilter] = React.useState<'all' | 'images' | 'docs' | 'voice'>('all')

  // Internal Notes State
  const [newNoteText, setNewNoteText] = React.useState('')
  const [newNoteCategory, setNewNoteCategory] = React.useState<'compliance' | 'negotiation' | 'risk'>('compliance')

  // Audio simulation timer
  React.useEffect(() => {
    let interval: any
    if (playingVoiceId) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setPlayingVoiceId(null)
            return 0
          }
          return prev + 4 * playbackSpeed
        })
      }, 100)
    } else {
      setPlaybackProgress(0)
    }
    return () => clearInterval(interval)
  }, [playingVoiceId, playbackSpeed])

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(activeThread.id)
    setCopiedId(true)
    notify('Copied', `${activeThread.id} copied to clipboard.`)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Close / Reopen Chat Handler
  const handleToggleChatLock = () => {
    const nextStatus = activeThread.status === 'closed' ? 'active' : 'closed'
    const systemMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'system',
      senderName: 'Duseat Moderator',
      type: 'system_event',
      systemType: nextStatus === 'closed' ? 'chat_closed' : 'chat_reopened',
      text:
        nextStatus === 'closed'
          ? 'Conversation officially closed by administrator. Participant messaging disabled.'
          : 'Conversation reopened by administrator for active negotiation.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              status: nextStatus,
              messages: [...t.messages, systemMsg],
              lastActivity: 'Just now',
            }
          : t
      )
    )

    if (nextStatus === 'closed') {
      notify('Conversation Closed', `Chat ${activeThread.id} is now closed. Participants cannot reply.`, 'info')
    } else {
      notify('Conversation Reopened', `Chat ${activeThread.id} reopened for negotiations.`, 'success')
    }
    setShowCloseModal(false)
  }

  // Flag Thread
  const handleFlagSubmit = () => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              status: 'flagged',
              isFlagged: true,
              flagReason,
            }
          : t
      )
    )
    notify('Room Flagged', `Thread ${activeThread.id} marked for surveillance review.`, 'error')
    setShowFlagModal(false)
  }

  // Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: sendAs === 'admin' ? 'admin' : sendAs === 'agent' ? 'agent' : 'system',
      senderName: sendAs === 'admin' ? 'Duseat Compliance Desk' : activeThread.agent.name,
      senderRole: sendAs === 'admin' ? 'Admin Official' : 'Agent Proxy',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent',
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastActivity: 'Just now',
              totalMessages: t.totalMessages + 1,
            }
          : t
      )
    )

    setInputText('')

    // Simulate brief typing response
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2200)
    }, 600)
  }

  // Send System Notice
  const handleSendSystemNotice = () => {
    if (!systemNoticeText.trim()) return
    const sysMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'system',
      senderName: 'Duseat Automated Sentinel',
      text: systemNoticeText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system_notice',
      systemType: systemNoticeType,
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [...t.messages, sysMsg],
              lastActivity: 'Just now',
              totalMessages: t.totalMessages + 1,
            }
          : t
      )
    )

    setSystemNoticeText('')
    setShowSystemDialog(false)
    notify('System Notice Broadcasted', 'Notice has been displayed to all participants.')
  }

  // Delete Message Confirmation
  const handleConfirmDeleteMessage = () => {
    if (!deleteMessageTarget) return
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: t.messages.filter((m) => m.id !== deleteMessageTarget.id),
              totalMessages: Math.max(0, t.totalMessages - 1),
            }
          : t
      )
    )
    notify('Message Deleted', 'Message permanently removed from negotiation transcript.', 'error')
    setDeleteMessageTarget(null)
  }

  // Add Internal Compliance Note
  const handleAddComplianceNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return

    const newNote: InternalComplianceNote = {
      id: `note-${Date.now()}`,
      author: 'Admin Moderator',
      authorRole: 'Compliance Officer',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      text: newNoteText.trim(),
      category: newNoteCategory,
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              complianceNotes: [newNote, ...(t.complianceNotes || [])],
            }
          : t
      )
    )

    setNewNoteText('')
    notify('Internal Note Saved', 'Private note added to surveillance audit log.')
  }

  // Delete Compliance Note
  const handleDeleteNote = (noteId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              complianceNotes: t.complianceNotes.filter((n) => n.id !== noteId),
            }
          : t
      )
    )
    notify('Note Removed', 'Internal compliance note deleted.', 'info')
  }

  // Export Conversation Handler
  const handleExportDownload = () => {
    if (exportFormat === 'csv') {
      const rows = activeThread.messages.map((m) => [
        `"${m.id}"`,
        `"${m.sender}"`,
        `"${m.senderName}"`,
        `"${m.type}"`,
        `"${(m.text || m.document?.name || m.linkPreview?.title || 'Media attachment').replace(/"/g, '""')}"`,
        `"${m.time}"`,
        `"${m.date || 'Today'}"`,
      ])
      const csv = 'Message ID,Sender Role,Sender Name,Type,Content,Time,Date\n' + rows.map((r) => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `transcript_${activeThread.id}_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (exportFormat === 'json') {
      const json = JSON.stringify(activeThread, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `thread_${activeThread.id}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const text = activeThread.messages
        .map((m) => `[${m.time}] ${m.senderName} (${m.sender}): ${m.text || m.type}`)
        .join('\n')
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `transcript_${activeThread.id}.txt`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    setShowExportModal(false)
    notify('Export Generated', `Transcript for ${activeThread.id} downloaded successfully.`)
  }

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    if (statusTab === 'Active' && t.status !== 'active') return false
    if (statusTab === 'Closed' && t.status !== 'closed') return false
    if (statusTab === 'Flagged' && t.status !== 'flagged' && !t.isFlagged && !t.isReported) return false

    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      t.id.toLowerCase().includes(q) ||
      t.investor.name.toLowerCase().includes(q) ||
      t.agent.name.toLowerCase().includes(q) ||
      t.context.toLowerCase().includes(q) ||
      t.requestId.toLowerCase().includes(q)
    )
  })

  // Extract attachments for the active thread
  const threadAttachments = React.useMemo(() => {
    const images: { url: string; title: string; time: string }[] = []
    const videos: { url: string; thumbnail?: string; time: string; duration?: string }[] = []
    const voiceNotes: { id: string; time: string; duration?: string }[] = []
    const docs: { name: string; size: string; ext: string; url: string; time: string }[] = []
    const links: { title: string; domain: string; url: string; time: string }[] = []

    activeThread.messages.forEach((m) => {
      if (m.type === 'image' && m.mediaUrl) {
        images.push({ url: m.mediaUrl, title: 'Chat Photo', time: m.time })
      }
      if (m.type === 'video' && m.videoThumbnail) {
        videos.push({ url: m.mediaUrl || '', thumbnail: m.videoThumbnail, time: m.time, duration: m.duration })
      }
      if (m.type === 'voice') {
        voiceNotes.push({ id: m.id, time: m.time, duration: m.duration })
      }
      if (m.type === 'document' && m.document) {
        docs.push({ ...m.document, time: m.time })
      }
      if (m.type === 'link_preview' && m.linkPreview) {
        links.push({ ...m.linkPreview, time: m.time })
      }
    })

    return { images, videos, voiceNotes, docs, links }
  }, [activeThread])

  const investorCountryCode = getCountryCode(activeThread.investor.country || 'United Arab Emirates')
  const agentCountryCode = getCountryCode(activeThread.agent.country || 'United Arab Emirates')

  return (
    <div className="flex h-[calc(100vh-90px)] min-h-[600px] w-full flex-col bg-white overflow-hidden rounded-[10px] border border-[#d3d5d7] font-sans shadow-xs">
      {/* 2-COLUMN MAIN WORKSPACE (Left Queue + Wide Full-Width Center Chat) */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* =========================================================================
            COLUMN 1: LEFT CONVERSATION LIST (280px - 320px)
           ========================================================================= */}
        <div
          className={cn(
            'flex flex-col border-r border-[#d3d5d7] bg-white transition-all duration-200 shrink-0 z-20',
            mobileView === 'list'
              ? 'w-full flex absolute inset-0 md:relative md:w-72 lg:w-80'
              : 'hidden md:flex md:w-72 lg:w-80',
            !showLeftPanel && 'md:hidden'
          )}
        >
          {/* Header & Search */}
          <div className="p-3 border-b border-[#d3d5d7] space-y-2 bg-[#fcfcfc]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#1f2327]">Conversations</span>
                <span className="rounded-full bg-[#eff1f3] px-2 py-0.2 text-[11px] font-semibold text-[#6f777f]">
                  {filteredThreads.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => notify('Syncing', 'Updating live conversations queue…')}
                className="text-[#6f777f] hover:text-[#1f2327] text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                title="Sync queue"
              >
                <RotateCcw className="size-3" />
                <span className="hidden sm:inline">Sync</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6f777f]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations, ID, users…"
                className="h-[32px] w-full rounded-[6px] border border-[#d3d5d7] bg-white pl-8 pr-7 text-[12px] text-[#1f2327] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6f777f] hover:text-[#1f2327]"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {(['All', 'Active', 'Closed', 'Flagged'] as const).map((tab) => {
                const count =
                  tab === 'All'
                    ? threads.length
                    : tab === 'Active'
                    ? threads.filter((t) => t.status === 'active').length
                    : tab === 'Closed'
                    ? threads.filter((t) => t.status === 'closed').length
                    : threads.filter((t) => t.status === 'flagged' || t.isFlagged || t.isReported).length

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusTab(tab)}
                    className={cn(
                      'h-[26px] px-2 rounded-[5px] text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1',
                      statusTab === tab
                        ? 'bg-[#1f2327] text-white shadow-2xs'
                        : 'text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                    )}
                  >
                    <span>{tab}</span>
                    <span
                      className={cn(
                        'text-[9.5px] px-1 rounded-full',
                        statusTab === tab ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#6f777f]'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conversation Rows List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#d3d5d7]/50">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-[12.5px] text-[#6f777f] space-y-1">
                <p className="font-semibold text-[#1f2327]">No conversations found</p>
                <p className="text-[11.5px]">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isActive = thread.id === activeThread.id
                const lastMsg = thread.messages[thread.messages.length - 1]
                const preview =
                  lastMsg?.text ||
                  (lastMsg?.type === 'video'
                    ? '📹 Video message'
                    : lastMsg?.type === 'voice'
                    ? '🎙️ Voice note'
                    : lastMsg?.type === 'document'
                    ? `📄 ${lastMsg.document?.name || 'Document'}`
                    : lastMsg?.type === 'link_preview'
                    ? `🔗 ${lastMsg.linkPreview?.title || 'Shared link'}`
                    : '📷 Media message')

                const hasFlag = thread.status === 'flagged' || thread.isFlagged || thread.isReported

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => {
                      setActiveThreadId(thread.id)
                      setMobileView('chat')
                    }}
                    className={cn(
                      'w-full text-left p-3 transition-colors cursor-pointer flex flex-col gap-1.5',
                      isActive ? 'bg-[#e5f6f7]/60 border-l-4 border-l-[#00c2cb]' : 'hover:bg-[#fcfcfc]'
                    )}
                  >
                    {/* Top Row: ID, Badges, Time */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-[11px] font-bold text-[#00c2cb]">{thread.id}</span>
                        {hasFlag && (
                          <span className="flex items-center gap-0.5 rounded bg-[#fee4e2] px-1 py-0.2 text-[9.5px] font-bold text-[#d92d20]">
                            <Flag className="size-2.5" />
                            <span>Flagged</span>
                          </span>
                        )}
                        <FigmaStatusBadge
                          status={thread.status === 'active' ? 'Active' : thread.status === 'closed' ? 'Closed' : 'Flagged'}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#6f777f] shrink-0">{thread.lastActivity}</span>
                    </div>

                    {/* Middle Row: Avatars & Participant Names */}
                    <div className="flex items-center gap-2">
                      <div className="relative shrink-0">
                        <img
                          src={thread.investor.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                          alt={thread.investor.name}
                          className="size-7 rounded-full object-cover border border-[#d3d5d7]"
                        />
                        <img
                          src={thread.agent.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'}
                          alt={thread.agent.name}
                          className="size-4.5 rounded-full object-cover border border-white absolute -bottom-1 -right-1 shadow-2xs"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold text-[#1f2327] truncate">
                          {thread.investor.name} <span className="font-normal text-[#6f777f]">↔</span> {thread.agent.name}
                        </p>
                        <p className="text-[11px] font-medium text-[#6f777f] truncate">{thread.context}</p>
                      </div>
                    </div>

                    {/* Bottom Row: Last Message Snippet */}
                    <div className="flex items-center justify-between text-[11px] text-[#6f777f]">
                      <span className="truncate max-w-[200px]">{preview}</span>
                      {thread.unreadCount && thread.unreadCount > 0 ? (
                        <span className="size-3.5 rounded-full bg-[#00c2cb] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                          {thread.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2: FULL-WIDTH CENTER LIVE CHAT (Dominant, Wide Workspace)
           ========================================================================= */}
        <div
          className={cn(
            'flex flex-1 flex-col min-w-0 bg-[#f8f9fa] relative z-10',
            mobileView === 'list' && 'hidden md:flex'
          )}
        >
          {/* =========================================================================
              COMPACT CHAT HEADER (48px - 52px)
             ========================================================================= */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#d3d5d7] bg-white px-3 sm:px-4 py-2">
            {/* Left Header Group */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden flex size-7 items-center justify-center rounded-[5px] border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]"
                title="Back to conversation list"
              >
                <ArrowLeft className="size-3.5" />
              </button>

              {/* Investor Avatar with Country Flag & Online Dot */}
              <div className="relative shrink-0">
                <AvatarFlagOverlay code={investorCountryCode}>
                  <img
                    src={activeThread.investor.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                    alt={activeThread.investor.name}
                    className="size-8 rounded-full object-cover border border-[#d3d5d7]"
                  />
                </AvatarFlagOverlay>
                <span className="absolute bottom-0 right-0 size-2 rounded-full bg-[#17b26a] border border-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-[13.5px] font-bold text-[#1f2327] truncate">{activeThread.investor.name}</h3>
                  <span className="text-[11px] text-[#6f777f]">with</span>
                  <span className="font-semibold text-[12.5px] text-[#1f2327] truncate">{activeThread.agent.name}</span>
                  <AgentPlanBadge plan={activeThread.agent.plan || 'Elite'} compact />
                  <FigmaStatusBadge
                    status={activeThread.status === 'active' ? 'Active' : activeThread.status === 'closed' ? 'Closed' : 'Flagged'}
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#6f777f] mt-0.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="font-mono text-[#00c2cb] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    title="Click to copy Conversation ID"
                  >
                    <span>{activeThread.id}</span>
                    {copiedId ? <Check className="size-2.5 text-[#17b26a]" /> : <Copy className="size-2.5" />}
                  </button>
                  <span>•</span>
                  <span className="font-mono text-[#1f2327]">Req: {activeThread.requestId}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline font-medium text-[#1f2327] truncate max-w-[240px]">
                    {activeThread.property.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Header Controls (Compact, Clean, Toggleable Details Drawer) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* VIEW MODE TOGGLE (Chat View / Details) */}
              <div className="flex items-center rounded-[6px] border border-[#d3d5d7] bg-[#eff1f3] p-0.5">
                <button
                  type="button"
                  onClick={() => setShowRightPanel(false)}
                  className={cn(
                    'h-[26px] px-2.5 rounded-[4px] text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1',
                    !showRightPanel
                      ? 'bg-white text-[#1f2327] shadow-2xs font-bold'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                  title="Full-Width Chat Mode"
                >
                  <MessageSquare className="size-3" />
                  <span className="hidden sm:inline">Chat View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRightPanel(true)}
                  className={cn(
                    'h-[26px] px-2.5 rounded-[4px] text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1',
                    showRightPanel
                      ? 'bg-white text-[#1f2327] shadow-2xs font-bold'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                  title="Open Conversation Details Drawer"
                >
                  <SlidersHorizontal className="size-3" />
                  <span>Details</span>
                </button>
              </div>

              {/* Reopen / Close Action Button */}
              <button
                type="button"
                onClick={() => setShowCloseModal(true)}
                className={cn(
                  'flex h-[28px] items-center gap-1 rounded-[6px] border px-2 text-[11.5px] font-semibold transition-colors cursor-pointer',
                  activeThread.status === 'closed'
                    ? 'border-[#17b26a] bg-[#dfefe8] text-[#17b26a] hover:bg-[#c9e8dc]'
                    : 'border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3]'
                )}
                title={activeThread.status === 'closed' ? 'Reopen negotiation room' : 'Close negotiation room'}
              >
                {activeThread.status === 'closed' ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
                <span className="hidden lg:inline">{activeThread.status === 'closed' ? 'Reopen' : 'Close'}</span>
              </button>

              {/* Flag Action Button */}
              <button
                type="button"
                onClick={() => setShowFlagModal(true)}
                className={cn(
                  'flex size-[28px] items-center justify-center rounded-[6px] border transition-colors cursor-pointer',
                  activeThread.isFlagged
                    ? 'border-[#d92d20] bg-[#fee4e2] text-[#d92d20]'
                    : 'border-[#d3d5d7] bg-white text-[#6f777f] hover:text-[#d92d20] hover:bg-[#fee4e2]'
                )}
                title="Flag conversation for surveillance review"
              >
                <Flag className="size-3.5" />
              </button>

              {/* Open in Dedicated Tab */}
              <Link
                href={`/chats/${activeThread.id}`}
                target="_blank"
                className="hidden sm:flex size-[28px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3]"
                title="Open in full standalone tab"
              >
                <ExternalLink className="size-3.5" />
              </Link>

              {/* Export Transcript Trigger */}
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="hidden sm:flex size-[28px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3]"
                title="Export Transcript"
              >
                <FileDown className="size-3.5" />
              </button>

              {/* Modal Close Button if presented in popup modal */}
              {isModal && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Compact Single-Line Property / Deal Strip */}
          <div className="flex items-center justify-between bg-[#f4f5f6] border-b border-[#d3d5d7] px-4 py-1 text-[11.5px] text-[#1f2327]">
            <div className="flex items-center gap-2 min-w-0">
              <Building className="size-3 text-[#00c2cb] shrink-0" />
              <span className="font-bold truncate">{activeThread.property.title}</span>
              <span className="text-[#6f777f]">•</span>
              <span className="font-bold text-[#00c2cb] shrink-0">{activeThread.property.price}</span>
              <span className="text-[#6f777f] hidden md:inline">•</span>
              <span className="text-[#6f777f] hidden md:inline truncate">{activeThread.property.location}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline rounded bg-white px-1.5 py-0.2 text-[10.5px] font-medium border border-[#d3d5d7] text-[#6f777f]">
                {activeThread.property.requestStatus}
              </span>
              <Link
                href="/requests"
                className="font-semibold text-[#00c2cb] hover:underline text-[11px] flex items-center gap-0.5"
              >
                <span>Request</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Closed State Banner Notice (Thin, Non-intrusive) */}
          {activeThread.status === 'closed' && (
            <div className="bg-[#fee4e2]/80 border-b border-[#d92d20]/30 px-4 py-1.5 flex items-center justify-between ant-fade-in text-[12px]">
              <div className="flex items-center gap-2 text-[#d92d20]">
                <Lock className="size-3.5 shrink-0" />
                <span className="font-bold">Chat closed for participants.</span>
                <span className="text-[#6f777f] hidden sm:inline">
                  Participants cannot send messages. Admin override mode is active.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleChatLock}
                className="text-[11.5px] font-bold text-[#00c2cb] hover:underline cursor-pointer ml-2"
              >
                Reopen Chat →
              </button>
            </div>
          )}

          {/* =========================================================================
              MESSAGE STREAM AREA (Dominant, Natural Messaging Layout)
             ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 scrollbar-thin">
            {/* Date Separator */}
            <div className="flex items-center justify-center my-2">
              <span className="rounded-full bg-[#eff1f3] px-3 py-0.5 text-[11px] font-semibold text-[#6f777f] border border-[#d3d5d7]/50 shadow-2xs">
                {activeThread.startedDate} • Verified Negotiation Log
              </span>
            </div>

            {activeThread.messages.map((msg) => {
              const isInvestor = msg.sender === 'investor'
              const isAgent = msg.sender === 'agent'
              const isAdmin = msg.sender === 'admin'
              const isSystemEvent = msg.type === 'system_event'
              const isSystemNotice = msg.type === 'system_notice'

              // System Event (Centered pill)
              if (isSystemEvent) {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <div className="max-w-md rounded-full bg-[#f4f5f6] border border-[#d3d5d7] px-3.5 py-1 text-center text-[11.5px] text-[#6f777f] flex items-center gap-2 shadow-2xs">
                      <ShieldCheck className="size-3.5 text-[#00c2cb] shrink-0" />
                      <span className="font-medium">{msg.text}</span>
                      <span className="font-mono text-[10px] opacity-75">{msg.time}</span>
                    </div>
                  </div>
                )
              }

              // System Notice Broadcast Card
              if (isSystemNotice) {
                return (
                  <div key={msg.id} className="flex justify-center my-3.5">
                    <div className="max-w-lg w-full rounded-[8px] bg-[#f6efe0] border border-[#fdb022]/60 p-3 text-center space-y-1 shadow-2xs">
                      <div className="flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-[#b54708]">
                        <Sparkles className="size-3.5" />
                        <span>{msg.senderName}</span>
                      </div>
                      <p className="text-[12.5px] text-[#1f2327] leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] font-mono text-[#6f777f] block">{msg.time}</span>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'group flex flex-col max-w-[75%] sm:max-w-[560px] space-y-1',
                    isInvestor ? 'mr-auto items-start' : 'ml-auto items-end'
                  )}
                >
                  {/* Sender Name & Timestamp Header */}
                  <div className="flex items-center gap-1.5 text-[10.5px] text-[#6f777f] px-1">
                    <span className="font-bold text-[#1f2327]">{msg.senderName}</span>
                    <span className="rounded bg-[#eff1f3] px-1.5 py-0.2 text-[9.5px] font-semibold text-[#6f777f]">
                      {msg.senderRole || (isInvestor ? 'Investor' : isAdmin ? 'Admin' : 'Agent')}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{msg.time}</span>
                  </div>

                  {/* Message Bubble Container with Action Hover */}
                  <div className="relative flex items-center gap-1.5">
                    {/* Delete Action (visible on hover) */}
                    <button
                      type="button"
                      onClick={() => setDeleteMessageTarget(msg)}
                      className={cn(
                        'opacity-0 group-hover:opacity-100 size-6 rounded-full bg-white border border-[#d3d5d7] text-[#6f777f] hover:text-[#d92d20] flex items-center justify-center transition-opacity shadow-2xs cursor-pointer',
                        isInvestor ? 'order-last' : 'order-first'
                      )}
                      title="Delete message from audit log"
                    >
                      <Trash2 className="size-3" />
                    </button>

                    <div
                      className={cn(
                        'rounded-[10px] p-3 text-[13px] leading-[19px] shadow-2xs font-sans space-y-2.5',
                        isInvestor
                          ? 'bg-white border border-[#d3d5d7] text-[#1f2327]'
                          : isAdmin
                          ? 'bg-[#e5f6f7] border border-[#00c2cb]/50 text-[#1f2327]'
                          : 'bg-[#1f2327] text-white'
                      )}
                    >
                      {/* Text */}
                      {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                      {/* Photo Attachment (Constrained aspect-ratio + Lightbox trigger) */}
                      {msg.type === 'image' && msg.mediaUrl && (
                        <div
                          onClick={() => setLightboxImage(msg.mediaUrl!)}
                          className="overflow-hidden rounded-[8px] border border-black/10 cursor-pointer max-w-sm group/img"
                        >
                          <img
                            src={msg.mediaUrl}
                            alt="Attached Image"
                            className="max-h-56 w-full object-cover group-hover/img:scale-102 transition-transform"
                          />
                        </div>
                      )}

                      {/* Video Attachment with Preview & Modal Playback */}
                      {msg.type === 'video' && msg.videoThumbnail && (
                        <div
                          onClick={() => setVideoModalUrl(msg.mediaUrl || 'https://sample-videos.com')}
                          className="relative overflow-hidden rounded-[8px] border border-black/10 cursor-pointer max-w-sm group/video"
                        >
                          <img
                            src={msg.videoThumbnail}
                            alt="Video Preview"
                            className="max-h-56 w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/video:bg-black/55 transition-colors">
                            <div className="flex size-11 items-center justify-center rounded-full bg-white/90 text-[#1f2327] shadow-md group-hover/video:scale-105 transition-transform">
                              <Play className="size-4.5 ml-0.5" />
                            </div>
                          </div>
                          {msg.duration && (
                            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                              {msg.duration}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Voice Note Audio Waveform Player */}
                      {msg.type === 'voice' && (
                        <div
                          className={cn(
                            'flex items-center gap-2.5 p-2 rounded-[8px] min-w-[240px]',
                            isAgent && !isAdmin ? 'bg-white/10' : 'bg-[#eff1f3]'
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                            className="flex size-8 items-center justify-center rounded-full bg-[#00c2cb] text-[#1f2327] shrink-0 cursor-pointer hover:opacity-90 shadow-2xs"
                          >
                            {playingVoiceId === msg.id ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            {/* Waveform Visualization */}
                            <div className="flex items-end gap-0.5 h-6">
                              {(msg.waveform || [30, 60, 40, 90, 70, 50, 80, 100, 65, 45, 75, 90, 55, 35, 65, 80, 45, 60]).map(
                                (h, i) => (
                                  <span
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className={cn(
                                      'w-1 rounded-full transition-colors',
                                      playingVoiceId === msg.id && i < (playbackProgress / 100) * 18
                                        ? 'bg-[#00c2cb]'
                                        : isAgent && !isAdmin
                                        ? 'bg-white/40'
                                        : 'bg-[#9da4ae]'
                                    )}
                                  />
                                )
                              )}
                            </div>
                            <div className="flex justify-between text-[10px] opacity-75 font-mono">
                              <span>{msg.duration || '00:28'}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))
                                }}
                                className="font-bold hover:underline cursor-pointer"
                              >
                                {playbackSpeed}x
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Document Attachment */}
                      {msg.type === 'document' && msg.document && (
                        <div
                          className={cn(
                            'flex items-center justify-between p-2.5 rounded-[8px] gap-3 border',
                            isAgent && !isAdmin
                              ? 'bg-white/10 border-white/20'
                              : 'bg-white border-[#d3d5d7]'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-[5px] bg-[#fee4e2] text-[#d92d20] flex items-center justify-center font-bold text-[9.5px] shrink-0">
                              {msg.document.ext}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[12px] truncate">{msg.document.name}</p>
                              <p className="text-[10.5px] opacity-75 font-mono">{msg.document.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => notify('Document Download', `Downloading ${msg.document?.name}…`)}
                            className="flex size-6.5 items-center justify-center rounded-[5px] bg-[#f4f5f6] text-[#1f2327] hover:bg-[#d3d5d7] cursor-pointer shrink-0"
                            title="Download Document"
                          >
                            <Download className="size-3" />
                          </button>
                        </div>
                      )}

                      {/* Link Preview Card */}
                      {msg.type === 'link_preview' && msg.linkPreview && (
                        <a
                          href={msg.linkPreview.url}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(
                            'block overflow-hidden rounded-[8px] border transition-colors',
                            isAgent && !isAdmin
                              ? 'bg-white/10 border-white/20 hover:bg-white/15'
                              : 'bg-white border-[#d3d5d7] hover:bg-[#fcfcfc]'
                          )}
                        >
                          {msg.linkPreview.image && (
                            <img
                              src={msg.linkPreview.image}
                              alt=""
                              className="h-28 w-full object-cover border-b border-inherit"
                            />
                          )}
                          <div className="p-2.5 space-y-1 text-left">
                            <span className="text-[9.5px] font-mono text-[#00c2cb] block">{msg.linkPreview.domain}</span>
                            <p className="font-bold text-[12px] line-clamp-1">{msg.linkPreview.title}</p>
                            <p className="text-[10.5px] opacity-75 line-clamp-2">{msg.linkPreview.description}</p>
                          </div>
                        </a>
                      )}

                      {/* Property Card Attachment */}
                      {msg.type === 'property_card' && msg.propertyCard && (
                        <div className="overflow-hidden rounded-[8px] border border-[#d3d5d7] bg-white text-[#1f2327] p-2 space-y-2">
                          <img
                            src={msg.propertyCard.image}
                            alt=""
                            className="h-28 w-full object-cover rounded-[6px]"
                          />
                          <div>
                            <p className="font-bold text-[12.5px]">{msg.propertyCard.title}</p>
                            <p className="text-[10.5px] text-[#6f777f]">{msg.propertyCard.subtitle}</p>
                            <p className="font-bold text-[12.5px] text-[#00c2cb] mt-0.5">{msg.propertyCard.price}</p>
                          </div>
                        </div>
                      )}

                      {/* Status / Receipts */}
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>{msg.time}</span>
                        {!isInvestor && <CheckCheck className="size-3 text-[#00c2cb]" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[11px] text-[#6f777f] pl-1 ant-fade-in">
                <span className="size-1.5 rounded-full bg-[#00c2cb] animate-pulse" />
                <span>{activeThread.agent.name} is typing…</span>
              </div>
            )}
          </div>

          {/* =========================================================================
              COMPOSER BAR (Sticky at bottom, multi-persona admin switchers)
             ========================================================================= */}
          <div className="shrink-0 border-t border-[#d3d5d7] bg-white p-2.5 sm:p-3 space-y-2">
            {/* Persona Switchers */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-[#6f777f]">Transmit as:</span>
                <button
                  type="button"
                  onClick={() => setSendAs('admin')}
                  className={cn(
                    'h-[24px] px-2 rounded-[5px] text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1',
                    sendAs === 'admin'
                      ? 'bg-[#00c2cb] text-[#1f2327] shadow-2xs'
                      : 'bg-[#eff1f3] text-[#6f777f] hover:bg-[#d3d5d7]'
                  )}
                >
                  <Shield className="size-3" />
                  <span>Admin Official</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSendAs('agent')}
                  className={cn(
                    'h-[24px] px-2 rounded-[5px] text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1',
                    sendAs === 'agent'
                      ? 'bg-[#7f56d9] text-white shadow-2xs'
                      : 'bg-[#eff1f3] text-[#6f777f] hover:bg-[#d3d5d7]'
                  )}
                >
                  <User className="size-3" />
                  <span>Agent Proxy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSystemDialog(true)}
                  className="h-[24px] px-2 rounded-[5px] bg-[#f6efe0] text-[#b54708] text-[10.5px] font-bold hover:bg-[#fbd08a] transition-colors cursor-pointer flex items-center gap-1 border border-[#fdb022]/40"
                >
                  <Sparkles className="size-3" />
                  <span>Broadcast Notice</span>
                </button>
              </div>

              <span className="text-[10px] text-[#9da4ae] hidden lg:inline font-mono">
                Press Enter ↵ to send
              </span>
            </div>

            {/* Input Row */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => notify('Document Attachment', 'Upload PDF or CAD agreement…')}
                  className="flex size-8 items-center justify-center rounded-[5px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                  title="Attach File"
                >
                  <Paperclip className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => notify('Photo Upload', 'Select image scan or property render…')}
                  className="flex size-8 items-center justify-center rounded-[5px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                  title="Upload Image"
                >
                  <Camera className="size-4" />
                </button>
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeThread.status === 'closed'
                    ? 'Transmitting official administrative override message…'
                    : sendAs === 'admin'
                    ? 'Type official compliance message…'
                    : `Impersonate message as ${activeThread.agent.name}…`
                }
                className="flex-1 h-[36px] px-3 rounded-[6px] border border-[#d3d5d7] bg-white text-[12.5px] outline-none focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb] font-sans"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-[36px] items-center gap-1.5 rounded-[6px] bg-[#1f2327] px-3.5 text-[12.5px] font-bold text-white hover:bg-black disabled:opacity-40 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                <span>Send</span>
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================================
            DRAWER / SIDEBAR: CONVERSATION DETAILS (Opened via Toggle)
           ========================================================================= */}
        {showRightPanel && (
          <div
            className={cn(
              'w-80 sm:w-96 flex flex-col border-l border-[#d3d5d7] bg-white overflow-y-auto shrink-0 divide-y divide-[#d3d5d7] z-30 transition-all',
              'absolute right-0 top-0 bottom-0 shadow-2xl bg-white ant-fade-in'
            )}
          >
            {/* Drawer Header */}
            <div className="p-3 bg-[#fcfcfc] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-[13px] text-[#1f2327]">Conversation Details</h4>
                <span className="rounded bg-[#eff1f3] px-1.5 py-0.2 text-[10px] font-mono text-[#6f777f]">
                  {activeThread.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRightPanel(false)}
                className="size-6.5 rounded-[5px] text-[#6f777f] hover:bg-[#eff1f3] flex items-center justify-center cursor-pointer"
                title="Close Details Drawer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Accordion 1: Participants */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('participants')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>1. Participants</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.participants && '-rotate-90')}
                />
              </button>

              {expandedSections.participants && (
                <div className="space-y-2 text-[12px]">
                  {/* Investor */}
                  <div className="rounded-[6px] border border-[#d3d5d7] p-2.5 space-y-1 bg-[#fcfcfc]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#6f777f]">Investor (Buyer)</span>
                      <Link
                        href={`/investors/${activeThread.investor.id}`}
                        className="text-[10.5px] font-bold text-[#00c2cb] hover:underline flex items-center gap-0.5"
                      >
                        <span>Profile</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                    <p className="font-bold text-[#1f2327] text-[12.5px]">{activeThread.investor.name}</p>
                    <div className="space-y-0.5 text-[11px] text-[#6f777f]">
                      <p className="flex items-center gap-1.5">
                        <Mail className="size-3 text-[#9da4ae]" />
                        <span>{activeThread.investor.email || 'investor@duseat.ae'}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3 text-[#9da4ae]" />
                        <span>{activeThread.investor.phone || '+971 50 000 0000'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Agent */}
                  <div className="rounded-[6px] border border-[#d3d5d7] p-2.5 space-y-1 bg-[#fcfcfc]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#6f777f]">Licensed Broker</span>
                      <Link
                        href={`/agents/${activeThread.agent.id}`}
                        className="text-[10.5px] font-bold text-[#00c2cb] hover:underline flex items-center gap-0.5"
                      >
                        <span>Profile</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#1f2327] text-[12.5px]">{activeThread.agent.name}</p>
                      <AgentPlanBadge plan={activeThread.agent.plan || 'Elite'} compact />
                    </div>
                    <p className="text-[11px] font-semibold text-[#1f2327]">{activeThread.agent.agency}</p>
                    <div className="space-y-0.5 text-[10.5px] text-[#6f777f]">
                      <p>License: <span className="font-mono text-[#1f2327]">{activeThread.agent.licenseNo}</span></p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3 text-[#9da4ae]" />
                        <span>{activeThread.agent.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Request & Property Context */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('property')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>2. Request & Property</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.property && '-rotate-90')}
                />
              </button>

              {expandedSections.property && (
                <div className="space-y-2 text-[11.5px]">
                  <div className="rounded-[6px] border border-[#d3d5d7] overflow-hidden bg-white">
                    <img
                      src={activeThread.property.image}
                      alt=""
                      className="h-24 w-full object-cover"
                    />
                    <div className="p-2 space-y-1">
                      <p className="font-bold text-[12px] text-[#1f2327]">{activeThread.property.title}</p>
                      <div className="flex justify-between font-semibold">
                        <span className="text-[#6f777f]">Price</span>
                        <span className="font-bold text-[#00c2cb]">{activeThread.property.price}</span>
                      </div>
                      <div className="flex justify-between text-[#6f777f]">
                        <span>Bedrooms</span>
                        <span className="text-[#1f2327] font-medium">{activeThread.property.bedrooms} Beds</span>
                      </div>
                      <div className="flex justify-between text-[#6f777f]">
                        <span>Area</span>
                        <span className="text-[#1f2327] font-medium">{activeThread.property.area}</span>
                      </div>
                      <div className="flex justify-between text-[#6f777f]">
                        <span>Location</span>
                        <span className="text-[#1f2327] font-medium">{activeThread.property.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Conversation Overview */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('overview')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>3. Room Metrics</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.overview && '-rotate-90')}
                />
              </button>

              {expandedSections.overview && (
                <div className="space-y-1 text-[11.5px]">
                  <div className="flex justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Status</span>
                    <FigmaStatusBadge
                      status={activeThread.status === 'active' ? 'Active' : activeThread.status === 'closed' ? 'Closed' : 'Flagged'}
                    />
                  </div>
                  <div className="flex justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Started</span>
                    <span className="font-mono text-[#1f2327]">{activeThread.startedDate}</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Duration</span>
                    <span className="font-bold text-[#1f2327]">{activeThread.duration}</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Messages</span>
                    <span className="font-bold text-[#1f2327]">{activeThread.messages.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Media & Attachments */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('media')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>4. Media & Attachments</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.media && '-rotate-90')}
                />
              </button>

              {expandedSections.media && (
                <div className="space-y-2 text-[11.5px]">
                  {/* Filter Pills */}
                  <div className="flex gap-1 overflow-x-auto pb-0.5">
                    {(['all', 'images', 'docs', 'voice'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setMediaTabFilter(filter)}
                        className={cn(
                          'h-[22px] px-2 rounded-[4px] text-[10px] font-bold capitalize transition-colors cursor-pointer',
                          mediaTabFilter === filter
                            ? 'bg-[#1f2327] text-white'
                            : 'bg-[#eff1f3] text-[#6f777f] hover:bg-[#d3d5d7]'
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Media Grid */}
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {threadAttachments.docs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileText className="size-3 text-[#d92d20] shrink-0" />
                          <span className="font-semibold truncate text-[11px]">{doc.name}</span>
                        </div>
                        <span className="font-mono text-[9.5px] text-[#6f777f] shrink-0">{doc.size}</span>
                      </div>
                    ))}

                    {threadAttachments.videos.map((vid, idx) => (
                      <div
                        key={idx}
                        onClick={() => setVideoModalUrl(vid.url)}
                        className="flex items-center justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7] cursor-pointer hover:bg-[#eff1f3]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Play className="size-3 text-[#00c2cb] shrink-0" />
                          <span className="font-semibold truncate text-[11px]">Video Tour</span>
                        </div>
                        <span className="font-mono text-[9.5px] text-[#6f777f] shrink-0">{vid.duration}</span>
                      </div>
                    ))}

                    {threadAttachments.voiceNotes.map((vn, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Volume2 className="size-3 text-[#00c2cb] shrink-0" />
                          <span className="font-semibold truncate text-[11px]">Voice memo</span>
                        </div>
                        <span className="font-mono text-[9.5px] text-[#6f777f] shrink-0">{vn.duration}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => notify('Download Media', 'Downloading all media attachments archive (.zip)…')}
                    className="w-full h-[28px] rounded-[5px] border border-[#d3d5d7] bg-white text-[11px] font-bold text-[#1f2327] hover:bg-[#eff1f3] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="size-3" />
                    <span>Download All Attachments</span>
                  </button>
                </div>
              )}
            </div>

            {/* Accordion 5: Timeline */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('timeline')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>5. Milestone Timeline</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.timeline && '-rotate-90')}
                />
              </button>

              {expandedSections.timeline && (
                <div className="space-y-2.5 pt-0.5 text-[11px]">
                  {activeThread.timeline?.map((ev) => (
                    <div key={ev.id} className="relative pl-3.5 pb-1 border-l-2 border-[#00c2cb]/40 last:border-l-0">
                      <span className="absolute -left-[4.5px] top-0 size-2 rounded-full bg-[#00c2cb]" />
                      <p className="font-bold text-[#1f2327] text-[11.5px]">{ev.title}</p>
                      <p className="text-[10.5px] text-[#6f777f] leading-snug">{ev.description}</p>
                      <span className="font-mono text-[9.5px] text-[#9da4ae]">{ev.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 6: Surveillance & Risk Signals */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('surveillance')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>6. Surveillance & Signals</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.surveillance && '-rotate-90')}
                />
              </button>

              {expandedSections.surveillance && (
                <div className="space-y-1.5 text-[11.5px]">
                  <div className="flex items-center justify-between p-1.5 rounded-[5px] bg-[#dfefe8] text-[#17b26a] font-bold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      <span>AI Safety Score</span>
                    </span>
                    <span>CLEARED (99.4%)</span>
                  </div>

                  <div className="flex justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Contact Leaks</span>
                    <span className="font-bold text-[#17b26a]">0 Triggers</span>
                  </div>

                  <div className="flex justify-between p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Escrow Protection</span>
                    <span className="font-bold text-[#00c2cb]">Enforced</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 7: Internal Compliance Notes */}
            <div className="p-3 space-y-2">
              <button
                type="button"
                onClick={() => toggleSection('compliance')}
                className="w-full flex items-center justify-between font-bold text-[12px] text-[#1f2327] cursor-pointer"
              >
                <span>7. Compliance Notes ({activeThread.complianceNotes?.length || 0})</span>
                <ChevronDown
                  className={cn('size-3.5 text-[#6f777f] transition-transform', !expandedSections.compliance && '-rotate-90')}
                />
              </button>

              {expandedSections.compliance && (
                <div className="space-y-2 text-[11.5px]">
                  <form onSubmit={handleAddComplianceNote} className="space-y-1">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add private moderator note…"
                      className="w-full h-14 p-1.5 rounded-[5px] border border-[#d3d5d7] text-[11.5px] outline-none focus:border-[#00c2cb] resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <select
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value as any)}
                        className="h-[24px] px-1.5 rounded-[4px] border border-[#d3d5d7] text-[10.5px] outline-none"
                      >
                        <option value="compliance">Compliance</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="risk">Risk Signal</option>
                      </select>
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className="h-[24px] px-2.5 rounded-[4px] bg-[#1f2327] text-white text-[10.5px] font-bold hover:bg-black disabled:opacity-50 cursor-pointer"
                      >
                        Add Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pt-0.5">
                    {activeThread.complianceNotes?.map((note) => (
                      <div
                        key={note.id}
                        className="p-1.5 rounded-[5px] bg-[#fcfcfc] border border-[#d3d5d7] space-y-0.5 group/note"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1f2327] text-[11px]">{note.author}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[9px] text-[#6f777f]">{note.date}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              className="opacity-0 group-hover/note:opacity-100 text-[#d92d20] hover:text-[#b42318] cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 className="size-2.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[#1f2327] text-[11px] leading-snug">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS & CONFIRMATION DIALOGS
         ========================================================================= */}

      {/* 1. Image Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs cursor-pointer ant-fade-in"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 size-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40"
            >
              <X className="size-5" />
            </button>
            <img
              src={lightboxImage}
              alt="High-Res Attachment"
              className="max-h-[85vh] max-w-[85vw] rounded-[8px] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* 2. Video Player Modal */}
      {videoModalUrl && (
        <div
          onClick={() => setVideoModalUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs ant-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-[12px] bg-black shadow-2xl ant-modal-zoom"
          >
            <div className="flex items-center justify-between p-3 bg-zinc-900 text-white border-b border-zinc-800">
              <span className="text-[13px] font-bold">Property Video Tour Playback</span>
              <button
                type="button"
                onClick={() => setVideoModalUrl(null)}
                className="size-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="aspect-video w-full flex items-center justify-center bg-zinc-950 text-white">
              <div className="text-center space-y-2 p-6">
                <Play className="size-12 mx-auto text-[#00c2cb]" />
                <p className="font-bold text-[14px]">High Definition Video Stream Active</p>
                <p className="text-[12px] text-zinc-400">Inspecting negotiation recording for {activeThread.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Message Confirmation Modal */}
      {deleteMessageTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
          <div className="w-full max-w-sm rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
            <div className="flex items-center gap-2.5 text-[#d92d20]">
              <AlertTriangle className="size-5 shrink-0" />
              <h3 className="text-[15px] font-bold text-[#1f2327]">Delete Message?</h3>
            </div>
            <p className="text-[12.5px] text-[#6f777f]">
              Are you sure you want to permanently delete this message from the negotiation audit log? This action cannot be undone.
            </p>
            <div className="p-2.5 bg-[#fcfcfc] border border-[#d3d5d7] rounded-[6px] text-[12px] text-[#1f2327] max-h-20 overflow-y-auto">
              {deleteMessageTarget.text || 'Media Message'}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteMessageTarget(null)}
                className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMessage}
                className="h-[34px] px-4 rounded-[6px] bg-[#d92d20] text-white text-[12.5px] font-bold hover:bg-[#b42318]"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Close / Reopen Chat Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
          <div className="w-full max-w-md rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
            <div className="flex items-center gap-2.5 text-[#00c2cb]">
              <Lock className="size-5 shrink-0" />
              <h3 className="text-[15px] font-bold text-[#1f2327]">
                {activeThread.status === 'closed' ? 'Reopen Negotiation Room?' : 'Close Negotiation Room?'}
              </h3>
            </div>
            <p className="text-[12.5px] text-[#6f777f] leading-relaxed">
              {activeThread.status === 'closed'
                ? 'Reopening this room will restore messaging permissions for both the investor and agent.'
                : 'Closing this chat will disable participant messaging. Only administrative announcements and official override messages can be sent.'}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleChatLock}
                className="h-[34px] px-4 rounded-[6px] bg-[#1f2327] text-white text-[12.5px] font-bold hover:bg-black"
              >
                {activeThread.status === 'closed' ? 'Confirm Reopen' : 'Confirm Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Flag Room Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
          <div className="w-full max-w-md rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
            <div className="flex items-center gap-2.5 text-[#d92d20]">
              <Flag className="size-5 shrink-0" />
              <h3 className="text-[15px] font-bold text-[#1f2327]">Flag Conversation for Review</h3>
            </div>
            <p className="text-[12.5px] text-[#6f777f]">
              Flagging this room marks it as high priority in the moderation dashboard and alerts the legal compliance team.
            </p>
            <div>
              <label className="text-[11.5px] font-bold text-[#6f777f]">Primary Violation Category</label>
              <select
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[12.5px] outline-none mt-1"
              >
                <option value="Suspicious contact sharing attempt">Suspicious contact sharing attempt (Phone/Email)</option>
                <option value="Off-platform payment negotiation">Off-platform payment / commission bypass</option>
                <option value="Abusive or unprofessional communication">Abusive or unprofessional communication</option>
                <option value="False property representation">False property representation</option>
                <option value="Other compliance breach">Other compliance breach</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowFlagModal(false)}
                className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFlagSubmit}
                className="h-[34px] px-4 rounded-[6px] bg-[#d92d20] text-white text-[12.5px] font-bold hover:bg-[#b42318]"
              >
                Flag Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Export Transcript Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
          <div className="w-full max-w-sm rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
            <div className="flex items-center gap-2.5 text-[#00c2cb]">
              <FileDown className="size-5 shrink-0" />
              <h3 className="text-[15px] font-bold text-[#1f2327]">Export Audit Transcript</h3>
            </div>
            <p className="text-[12.5px] text-[#6f777f]">
              Choose the preferred format to export the entire message transcript, timestamps, and participants record.
            </p>
            <div className="space-y-1.5">
              {(['csv', 'txt', 'json'] as const).map((fmt) => (
                <label
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={cn(
                    'flex items-center justify-between p-2.5 rounded-[6px] border cursor-pointer text-[12.5px]',
                    exportFormat === fmt ? 'border-[#00c2cb] bg-[#e5f6f7]/50 font-bold text-[#1f2327]' : 'border-[#d3d5d7] text-[#6f777f]'
                  )}
                >
                  <span className="uppercase">{fmt} Archive</span>
                  <input
                    type="radio"
                    name="export_format"
                    checked={exportFormat === fmt}
                    onChange={() => setExportFormat(fmt)}
                    className="accent-[#00c2cb]"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExportDownload}
                className="h-[34px] px-4 rounded-[6px] bg-[#00c2cb] text-[#1f2327] text-[12.5px] font-bold hover:bg-[#00a8b0]"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. System Notice Broadcast Dialog */}
      {showSystemDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
          <div className="w-full max-w-md rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#b54708]">
                <Sparkles className="size-4.5" />
                <h3 className="text-[15px] font-bold text-[#1f2327]">Broadcast System Notice</h3>
              </div>
              <button type="button" onClick={() => setShowSystemDialog(false)} className="text-[#6f777f]">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11.5px] font-bold text-[#6f777f]">Notice Category</label>
                <select
                  value={systemNoticeType}
                  onChange={(e) => setSystemNoticeType(e.target.value as any)}
                  className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[12.5px] outline-none mt-1"
                >
                  <option value="info">General Policy / Informational Notice</option>
                  <option value="warning">Compliance Warning / Caution</option>
                  <option value="deal_secured">Official Escrow Milestone Secured</option>
                </select>
              </div>

              <div>
                <label className="text-[11.5px] font-bold text-[#6f777f]">Notice Message</label>
                <textarea
                  value={systemNoticeText}
                  onChange={(e) => setSystemNoticeText(e.target.value)}
                  placeholder="Enter notice text to broadcast to participants…"
                  className="w-full h-24 p-2.5 rounded-[6px] border border-[#d3d5d7] text-[12.5px] outline-none resize-none mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSystemDialog(false)}
                className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12.5px] font-semibold text-[#1f2327]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendSystemNotice}
                disabled={!systemNoticeText.trim()}
                className="h-[34px] px-4 rounded-[6px] bg-[#00c2cb] text-[#1f2327] text-[12.5px] font-bold disabled:opacity-40"
              >
                Broadcast Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
