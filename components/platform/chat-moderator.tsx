'use client'

import * as React from 'react'
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
  Printer,
  FileDown,
  Share2,
} from 'lucide-react'
import { FigmaStatusBadge, AgentPlanBadge, RateBadge } from '@/components/ui/figma-badges'
import { Flag as CountryFlag, getCountryCode } from '@/components/ui/flag'
import { Dropdown } from '@/components/dashboard/menu'
import { useToast } from '@/components/dashboard/toast'
import { cn } from '@/lib/utils'
import {
  type ChatThread,
  type ChatMessage,
  type PropertyCardData,
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

  // Active Thread
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0]

  // Composer State
  const [inputText, setInputText] = React.useState('')
  const [sendAs, setSendAs] = React.useState<'admin' | 'agent' | 'system'>('admin')
  const [systemNoticeType, setSystemNoticeType] = React.useState<'warning' | 'info' | 'deal_secured'>('info')
  const [showSystemDialog, setShowSystemDialog] = React.useState(false)
  const [systemNoticeText, setSystemNoticeText] = React.useState('')

  // Edit Message State
  const [editingMessage, setEditingMessage] = React.useState<ChatMessage | null>(null)
  const [editText, setEditText] = React.useState('')

  // Audio Playback Simulation State
  const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null)
  const [playbackProgress, setPlaybackProgress] = React.useState(0)

  // Lightbox Media Viewer
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null)

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
          return prev + 4
        })
      }, 100)
    } else {
      setPlaybackProgress(0)
    }
    return () => clearInterval(interval)
  }, [playingVoiceId])

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  // Thread Actions
  const handleToggleChatLock = () => {
    const nextStatus = activeThread.status === 'closed' ? 'active' : 'closed'
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, status: nextStatus } : t))
    )
    if (nextStatus === 'closed') {
      const closedNotice: ChatMessage = {
        id: `m-${Date.now()}`,
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_notice',
        systemType: 'chat_closed',
        text: 'The chat is closed by administrator. Messaging is disabled temporarily.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id ? { ...t, messages: [...t.messages, closedNotice] } : t
        )
      )
      notify('Chat Closed', `Chat ${activeThread.id} is now closed. Users cannot send messages.`, 'info')
    } else {
      notify('Chat Reopened', `Chat ${activeThread.id} reopened for negotiations.`)
    }
  }

  // Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: sendAs === 'admin' ? 'admin' : sendAs === 'agent' ? 'agent' : 'system',
      senderName: sendAs === 'admin' ? 'Duseat Admin' : activeThread.agent.name,
      senderRole: sendAs === 'admin' ? 'Moderator' : 'Agent',
      type: 'text',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, newMsg], lastActivity: 'Just now' }
          : t
      )
    )
    setInputText('')
    notify('Message Sent', 'Message posted to the negotiation room.')
  }

  // Broadcast System Notice
  const handleBroadcastSystemNotice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!systemNoticeText.trim()) return

    const sysMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      senderName: 'Duseat System',
      type: 'system_notice',
      systemType: systemNoticeType,
      text: systemNoticeText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id ? { ...t, messages: [...t.messages, sysMsg] } : t
      )
    )
    setShowSystemDialog(false)
    setSystemNoticeText('')
    notify('System Notice Posted', 'Official notice delivered to both parties.')
  }

  // Edit Message
  const handleSaveEditMessage = () => {
    if (!editingMessage || !editText.trim()) return
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: t.messages.map((m) =>
                m.id === editingMessage.id ? { ...m, text: editText.trim(), isEdited: true } : m
              ),
            }
          : t
      )
    )
    setEditingMessage(null)
    setEditText('')
    notify('Message Edited', 'Message has been modified and updated with admin signature.')
  }

  // Delete Message for User / Everyone
  const handleDeleteMessage = (msgId: string, deletePermanently = false) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: deletePermanently
                ? t.messages.filter((m) => m.id !== msgId)
                : t.messages.map((m) =>
                    m.id === msgId
                      ? {
                          ...m,
                          isDeleted: true,
                          text: '🚫 This message was removed by administrator.',
                        }
                      : m
                  ),
            }
          : t
      )
    )
    notify(
      deletePermanently ? 'Message Permanently Deleted' : 'Message Revoked',
      'The message content was cleared from user and agent feeds.'
    )
  }

  // Pin Message
  const handleTogglePin = (msgId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: t.messages.map((m) =>
                m.id === msgId ? { ...m, isPinned: !m.isPinned } : m
              ),
            }
          : t
      )
    )
    notify('Pin Updated', 'Message pinned state updated.')
  }

  // Open in Dedicated Tab
  const handleOpenInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(`/chats/${activeThread.id}`, '_blank')
    }
  }

  // Export as PDF / Print Official Transcript
  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print()
      notify('Printing / Saving as PDF', 'Document formatted for PDF export.')
    }
  }

  // Export Transcript (TXT)
  const handleExportTranscript = () => {
    const header = `DUSEAT LIVE NEGOTIATION TRANSCRIPT\nChat ID: ${activeThread.id}\nRequest: ${activeThread.requestId}\nContext: ${activeThread.context}\nAgent: ${activeThread.agent.name} (${activeThread.agent.id})\nInvestor: ${activeThread.investor.name} (${activeThread.investor.id})\nStatus: ${activeThread.status.toUpperCase()}\nExported At: ${new Date().toISOString()}\n----------------------------------------------------\n\n`
    const body = activeThread.messages
      .map((m) => `[${m.time}] ${m.senderName} (${m.sender}): ${m.text || `[${m.type.toUpperCase()} CONTENT]`}`)
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `duseat_chat_${activeThread.id}.txt`
    link.click()
    notify('Transcript Exported', `Downloaded transcript for ${activeThread.id}.`)
  }

  // Filter Threads
  const filteredThreads = threads.filter((t) => {
    const matchesQuery =
      !searchQuery ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.context.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      statusTab === 'All' ||
      (statusTab === 'Active' && t.status === 'active') ||
      (statusTab === 'Closed' && t.status === 'closed') ||
      (statusTab === 'Flagged' && t.status === 'flagged')
    return matchesQuery && matchesTab
  })

  // Pinned Message in Active Thread
  const pinnedMessage = activeThread.messages.find((m) => m.isPinned)

  return (
    <div
      className={cn(
        'flex w-full bg-[#f8f9fa] font-sans overflow-hidden border border-[#d3d5d7] rounded-[16px] shadow-sm',
        isModal ? 'h-[85vh] max-h-[850px]' : 'h-[750px] min-h-[600px]'
      )}
    >
      {/* =========================================================================
          LEFT SIDEBAR: Thread List & Filter Controls
         ========================================================================= */}
      <div className="hidden md:flex w-[320px] lg:w-[360px] flex-col border-r border-[#d3d5d7] bg-white shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-[#d3d5d7] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#1f2327]">Live Negotiation Chats</h2>
            <span className="rounded-[8px] bg-[#e5f6f7] px-2.5 py-0.5 text-xs font-bold text-[#00a4ac]">
              {threads.length} Rooms
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-[#9da4ae]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat ID, agent, investor..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-[#f8f9fa] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#00c2cb] focus:bg-white transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex gap-1.5 pt-1">
            {(['All', 'Active', 'Closed', 'Flagged'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusTab(tab)}
                className={cn(
                  'flex-1 rounded-[6px] py-1.5 text-xs font-semibold transition-colors cursor-pointer text-center',
                  statusTab === tab
                    ? 'bg-[#00c2cb] text-white shadow-2xs'
                    : 'bg-[#eff1f3] text-[#6f777f] hover:bg-[#e4e7eb]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#eff1f3]">
          {filteredThreads.map((t) => {
            const isActive = t.id === activeThread.id
            const lastMsg = t.messages[t.messages.length - 1]
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveThreadId(t.id)}
                className={cn(
                  'w-full text-left p-4 transition-colors flex items-start gap-3 cursor-pointer',
                  isActive ? 'bg-[#e5f6f7]/60 border-l-4 border-[#00c2cb]' : 'hover:bg-[#fcfcfc]'
                )}
              >
                {/* Agent Avatar */}
                <div className="relative size-11 shrink-0">
                  <div className="size-11 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                    {t.agent.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  {t.agent.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-[#17b26a] border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-[14px] leading-[20px] text-[#1f2327] truncate">{t.agent.name}</p>
                    <span className="text-[12px] leading-[16px] text-[#9da4ae] shrink-0">{t.lastActivity.split(', ')[1] || t.lastActivity}</span>
                  </div>

                  <p className="text-[12px] leading-[16px] text-[#00c2cb] font-semibold truncate mt-0.5">{t.context}</p>

                  <p className="text-[12px] leading-[16px] text-[#6f777f] truncate mt-1">
                    {lastMsg ? (
                      <span>
                        <strong className="font-medium text-[#1f2327]">{lastMsg.senderName.split(' ')[0]}:</strong>{' '}
                        {lastMsg.text || `[${lastMsg.type.toUpperCase()}]`}
                      </span>
                    ) : (
                      'No messages yet'
                    )}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-[12px] leading-[16px] font-semibold text-[#9da4ae]">{t.id}</span>
                    {t.status === 'closed' ? (
                      <span className="rounded-[4px] bg-[#f3e1e0] px-1.5 py-0.5 text-[12px] leading-[16px] font-semibold text-[#d92d20] flex items-center gap-1">
                        <Lock className="size-3" />
                        <span>Closed</span>
                      </span>
                    ) : (
                      <span className="rounded-[4px] bg-[#dfefe8] px-1.5 py-0.5 text-[12px] leading-[16px] font-semibold text-[#17b26a]">
                        ● Active
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          RIGHT MAIN: Figma Chat Room (Nodes 300:4068 & 99:30669)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] relative">
        {/* 1. Header Bar (matching Figma) */}
        <div className="border-b border-[#d3d5d7] bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="size-8 rounded-[8px] border border-[#d3d5d7] flex items-center justify-center text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            )}

            {/* Participant Profile */}
            <div className="relative size-10 shrink-0">
              <div className="size-10 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-[14px] shadow-2xs">
                {activeThread.agent.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="absolute -top-1 -left-1">
                <CountryFlag code={getCountryCode(activeThread.agent.country || 'Egypt')} size="s" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1f2327] truncate">{activeThread.agent.name}</h3>
                <Check className="size-4 text-[#00c2cb] shrink-0" />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[12px] leading-[16px] text-[#00c2cb]">
                <span>Rera verified | {activeThread.agent.plan}</span>
                <span className="text-[#d3d5d7]">•</span>
                <span className="text-[#17b26a] flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#17b26a]" />
                  <span>Online now</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in Dedicated Tab Button */}
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-xs font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer shadow-2xs"
              title="Open chat in standalone browser tab"
            >
              <ExternalLink className="size-3.5 text-[#00c2cb]" />
              <span>Open in Tab</span>
            </button>

            {/* Export / Print PDF Button */}
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#00c2cb] bg-white px-3 text-xs font-semibold text-[#00a4ac] hover:bg-[#00c2cb]/10 transition-colors cursor-pointer shadow-2xs ant-wave-btn"
              title="Print or Save Chat as Official PDF Document"
            >
              <FileDown className="size-3.5" />
              <span>Export PDF</span>
            </button>

            {/* View Request Link */}
            <button
              type="button"
              onClick={() => notify('Request Details', `Viewing ${activeThread.requestId} details`)}
              className="flex size-9 items-center justify-center rounded-[8px] bg-[#00c2cb] text-white hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
              title="View Request / Deal Link"
            >
              <ExternalLink className="size-4" />
            </button>

            <Dropdown
              align="end"
              floating
              ariaLabel="Chat Moderation Options"
              options={[
                {
                  label: 'Open in Dedicated Browser Tab',
                  value: 'open-tab',
                  icon: <ExternalLink className="size-4 text-[#00c2cb]" />,
                },
                {
                  label: 'Export as Official PDF Document (حفظ كـ PDF)',
                  value: 'export-pdf',
                  icon: <Printer className="size-4 text-[#00a4ac]" />,
                },
                {
                  label: 'Export Chat Transcript (TXT)',
                  value: 'export-txt',
                  icon: <Download className="size-4 text-[#6f777f]" />,
                },
                {
                  label: activeThread.status === 'closed' ? 'Reopen Chat Room' : 'Lock / Close Chat Room',
                  value: 'toggle-lock',
                  icon: activeThread.status === 'closed' ? <Unlock className="size-4 text-emerald-600" /> : <Lock className="size-4 text-amber-600" />,
                },
                {
                  label: 'Broadcast Official System Notice',
                  value: 'system-notice',
                  icon: <Sparkles className="size-4 text-[#00c2cb]" />,
                },
                {
                  label: 'Flag as Suspicious / Inappropriate',
                  value: 'flag',
                  icon: <Flag className="size-4 text-amber-600" />,
                },
              ]}
              onSelect={(val) => {
                if (val === 'open-tab') handleOpenInNewTab()
                else if (val === 'export-pdf') handlePrintPdf()
                else if (val === 'export-txt') handleExportTranscript()
                else if (val === 'toggle-lock') handleToggleChatLock()
                else if (val === 'system-notice') setShowSystemDialog(true)
                else if (val === 'flag') notify('Chat Flagged', `Chat ${activeThread.id} flagged for compliance audit.`, 'error')
              }}
              trigger={
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              }
            />
          </div>
        </div>

        {/* 2. Top Deal Context Chip Bar */}
        <div className="bg-[#eef8f8] border-b border-[#d3e9e9] py-2 px-4 flex items-center justify-center shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-[#b2e5e8] px-4 py-1 text-xs font-semibold text-[#1f2327] shadow-2xs">
            <span>{activeThread.context}</span>
            {activeThread.dealPrice && (
              <>
                <span className="text-[#d3d5d7]">•</span>
                <span className="text-[#00a4ac]">{activeThread.dealPrice}</span>
              </>
            )}
          </div>
        </div>

        {/* 3. Pinned Message Notice (if any) */}
        {pinnedMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-800 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Pin className="size-3.5 text-amber-600 shrink-0" />
              <span className="font-semibold shrink-0">Pinned:</span>
              <span className="truncate">{pinnedMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => handleTogglePin(pinnedMessage.id)}
              className="text-amber-600 hover:text-amber-900 font-medium ml-2 shrink-0 cursor-pointer"
            >
              Unpin
            </button>
          </div>
        )}

        {/* 4. Chat Messages Scroll Area with Duseat Pattern Wallpaper */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative"
          style={{
            backgroundColor: '#eaf6f6',
            backgroundImage: `radial-gradient(#00c2cb 0.65px, transparent 0.65px), radial-gradient(#00a4ac 0.65px, #eaf6f6 0.65px)`,
            backgroundSize: '26px 26px',
            backgroundPosition: '0 0, 13px 13px',
          }}
        >
          {/* Date separator */}
          <div className="flex justify-center">
            <span className="rounded-full bg-white/80 backdrop-blur-xs border border-[#d3d5d7] px-3.5 py-0.5 text-[11px] font-semibold text-[#6f777f] shadow-2xs">
              Yesterday
            </span>
          </div>

          {/* Message List */}
          {activeThread.messages.map((msg) => {
            const isAgent = msg.sender === 'agent' || msg.sender === 'admin'
            const isSystem = msg.sender === 'system'

            // System Notification Bubble
            if (isSystem) {
              const isDealSecured = msg.systemType === 'deal_secured'
              return (
                <div key={msg.id} className="flex justify-start my-2">
                  <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
                    {/* Duseat System Icon */}
                    <div className="size-8 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white shrink-0 shadow-2xs mt-1">
                      <Sparkles className="size-4" />
                    </div>

                    <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-4 shadow-sm space-y-2">
                      <p className={cn('text-xs font-bold', isDealSecured ? 'text-amber-600' : 'text-[#00a4ac]')}>
                        {isDealSecured ? 'Congratulations!' : 'System Notification'}
                      </p>
                      <p className="text-xs text-[#1f2327] leading-relaxed font-normal">{msg.text}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#9da4ae] pt-1 border-t border-[#f0f2f5]">
                        <span>System message</span>
                        <div className="flex items-center gap-1">
                          <span>{msg.time}</span>
                          {isDealSecured ? <span>👑</span> : <span>ℹ️</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            // Message Options Menu Items
            const messageActions = [
              {
                label: 'Edit Message (تعديل الرسالة)',
                value: 'edit',
                icon: <Pencil className="size-3.5 text-[#00c2cb]" />,
              },
              {
                label: 'Delete from User (مسح من عند اليوزر)',
                value: 'delete-user',
                destructive: true,
                icon: <Trash2 className="size-3.5 text-rose-600" />,
              },
              {
                label: 'Permanently Delete Message',
                value: 'delete-perm',
                destructive: true,
                icon: <Trash2 className="size-3.5 text-rose-700" />,
              },
              {
                label: msg.isPinned ? 'Unpin Message' : 'Pin Message (تثبيت)',
                value: 'pin',
                icon: <Pin className="size-3.5 text-amber-600" />,
              },
              {
                label: 'Copy Message Text',
                value: 'copy',
                icon: <Copy className="size-3.5 text-[#6f777f]" />,
              },
            ]

            const handleMsgAction = (val: string) => {
              if (val === 'edit') {
                setEditingMessage(msg)
                setEditText(msg.text || '')
              } else if (val === 'delete-user') {
                handleDeleteMessage(msg.id, false)
              } else if (val === 'delete-perm') {
                handleDeleteMessage(msg.id, true)
              } else if (val === 'pin') {
                handleTogglePin(msg.id)
              } else if (val === 'copy') {
                navigator.clipboard?.writeText(msg.text || '')
                notify('Copied', 'Message copied to clipboard.')
              }
            }

            return (
              <div
                key={msg.id}
                className={cn('flex items-end gap-2 group', isAgent ? 'justify-end' : 'justify-start')}
              >
                {/* Left Participant Avatar */}
                {!isAgent && (
                  <div className="size-7 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-[10px] shrink-0 mb-1 shadow-2xs">
                    {msg.senderName.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className="relative max-w-[85%] sm:max-w-[70%]">
                  {/* Action Menu (Visible on hover) */}
                  <div
                    className={cn(
                      'absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10',
                      isAgent ? '-left-8' : '-right-8'
                    )}
                  >
                    <Dropdown
                      align={isAgent ? 'start' : 'end'}
                      floating
                      options={messageActions}
                      onSelect={handleMsgAction}
                      trigger={
                        <button
                          type="button"
                          className="size-6 rounded-full bg-white/90 shadow-sm border border-[#d3d5d7] flex items-center justify-center text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                        >
                          <MoreHorizontal className="size-3" />
                        </button>
                      }
                    />
                  </div>

                  {/* 1. Video Message */}
                  {msg.type === 'video' && (
                    <div className="rounded-[16px] overflow-hidden border border-[#d3d5d7] bg-white shadow-sm">
                      <div className="relative h-[220px] sm:h-[260px] bg-black group/video cursor-pointer">
                        <img
                          src={msg.videoThumbnail}
                          alt="Video Preview"
                          className="size-full object-cover opacity-90 group-hover/video:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => notify('Video Player', 'Opening video playback player')}
                          className="absolute inset-0 m-auto size-14 rounded-full bg-[#00c2cb]/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="size-6 fill-white ml-0.5" />
                        </button>
                        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                          {msg.duration}
                        </div>
                      </div>
                      <div className="p-2.5 flex justify-end text-[11px] text-[#9da4ae]">
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Photo Gallery Grid */}
                  {msg.type === 'gallery' && msg.photos && (
                    <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-2 shadow-sm space-y-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        {msg.photos.map((src, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setLightboxImage(src)}
                            className="size-[120px] sm:size-[140px] rounded-[10px] overflow-hidden border border-[#d3d5d7] relative group/photo cursor-pointer"
                          >
                            <img
                              src={src}
                              alt="Gallery Preview"
                              className="size-full object-cover group-hover/photo:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="size-4 text-white drop-shadow-md" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[11px] text-[#9da4ae] px-1">
                        <span>{msg.time}</span>
                        <Check className="size-3 text-[#00c2cb]" />
                      </div>
                    </div>
                  )}

                  {/* 3. Voice Note Audio Player (Figma Waveform) */}
                  {msg.type === 'voice' && (
                    <div
                      className={cn(
                        'rounded-[16px] p-3.5 shadow-sm min-w-[240px] sm:min-w-[280px]',
                        isAgent ? 'bg-[#00737a] text-white' : 'bg-white text-[#1f2327] border border-[#d3d5d7]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (playingVoiceId === msg.id) setPlayingVoiceId(null)
                            else setPlayingVoiceId(msg.id)
                          }}
                          className={cn(
                            'size-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-transform hover:scale-105',
                            isAgent ? 'bg-white text-[#00737a]' : 'bg-[#00c2cb] text-white'
                          )}
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="size-4 fill-current" />
                          ) : (
                            <Play className="size-4 fill-current ml-0.5" />
                          )}
                        </button>

                        {/* Waveform Bars */}
                        <div className="flex-1 flex items-center gap-0.5 h-6">
                          {[40, 60, 25, 90, 75, 30, 85, 100, 45, 60, 80, 35, 70, 95, 50, 65, 30, 85, 40].map(
                            (height, barIdx) => {
                              const barProgress = (barIdx / 19) * 100
                              const isPast = playingVoiceId === msg.id && playbackProgress >= barProgress
                              return (
                                <div
                                  key={barIdx}
                                  className={cn(
                                    'w-1 rounded-full transition-colors',
                                    isPast
                                      ? isAgent ? 'bg-white' : 'bg-[#00c2cb]'
                                      : isAgent ? 'bg-white/40' : 'bg-[#d3d5d7]'
                                  )}
                                  style={{ height: `${height}%` }}
                                />
                              )
                            }
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] mt-2 pt-1 border-t border-white/20 opacity-85">
                        <span>{playingVoiceId === msg.id ? 'Playing audio...' : msg.duration || '00:25'}</span>
                        <div className="flex items-center gap-1">
                          <span>{msg.time}</span>
                          {isAgent && <CheckCheck className="size-3 text-cyan-200" />}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Text Message */}
                  {msg.type === 'text' && (
                    <div
                      className={cn(
                        'rounded-[16px] px-4 py-3 shadow-sm text-[14px] leading-relaxed',
                        msg.sender === 'admin'
                          ? 'bg-gradient-to-r from-[#005f66] to-[#00737a] text-white border border-[#00c2cb]/40 rounded-br-[4px]'
                          : isAgent
                          ? 'bg-[#00737a] text-white rounded-br-[4px]'
                          : 'bg-white text-[#1f2327] border border-[#d3d5d7] rounded-bl-[4px]'
                      )}
                    >
                      {msg.sender === 'admin' && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-200 mb-1 pb-1 border-b border-white/15">
                          <Shield className="size-3" />
                          <span>Duseat Administrator (Official)</span>
                        </div>
                      )}
                      {msg.isDeleted ? (
                        <p className="italic text-xs opacity-75">{msg.text}</p>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}
                      {msg.isEdited && (
                        <span className="block text-[10px] opacity-75 mt-1 font-sans">
                          (edited by admin)
                        </span>
                      )}
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-75 mt-1.5 text-right">
                        <span>{msg.time}</span>
                        {isAgent && <CheckCheck className="size-3 text-cyan-200" />}
                      </div>
                    </div>
                  )}

                  {/* 5. Property Card Embed Message */}
                  {msg.type === 'property_card' && msg.propertyCard && (
                    <div
                      className={cn(
                        'rounded-[16px] overflow-hidden shadow-sm border',
                        isAgent
                          ? 'bg-[#00737a] text-white border-transparent'
                          : 'bg-white text-[#1f2327] border-[#d3d5d7]'
                      )}
                    >
                      {/* Quoted reply card if present */}
                      {msg.replyTo && (
                        <div className="bg-black/10 px-3.5 py-2 border-b border-white/10 text-xs">
                          <p className="font-bold opacity-90">{msg.replyTo.senderName}</p>
                          <p className="text-[11px] opacity-75 truncate">{msg.replyTo.snippet}</p>
                        </div>
                      )}

                      {/* Property Preview Container */}
                      <div className="p-3">
                        <div className="rounded-[10px] overflow-hidden bg-black/10 border border-white/10 flex items-center gap-3 p-2">
                          <img
                            src={msg.propertyCard.image}
                            alt="Property"
                            className="size-14 rounded-[8px] object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-[13px] truncate">{msg.propertyCard.title}</p>
                            <p className="text-[11px] opacity-80 truncate">{msg.propertyCard.subtitle}</p>
                            <p className="text-[11px] font-semibold text-cyan-300 mt-0.5">
                              {msg.propertyCard.price}
                            </p>
                          </div>
                        </div>

                        <a
                          href={msg.propertyCard.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block text-xs underline text-cyan-200 hover:text-white truncate"
                        >
                          {msg.propertyCard.url}
                        </a>
                      </div>

                      <div className="px-3 pb-2 flex items-center justify-end gap-1 text-[10px] opacity-75">
                        <span>{msg.time}</span>
                        {isAgent && <CheckCheck className="size-3 text-cyan-200" />}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Floating Action Button in Chat: Chat Summary */}
          <div className="flex justify-center my-4">
            <button
              type="button"
              onClick={() =>
                notify('Chat Summary', `Generated full negotiation summary for ${activeThread.id}`)
              }
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-xs border border-[#00c2cb] px-4 py-1.5 text-xs font-semibold text-[#00a4ac] shadow-2xs hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer"
            >
              <FileText className="size-3.5" />
              <span>Chat summary</span>
            </button>
          </div>
        </div>

        {/* 5. Bottom Controls Bar: Always Available for Admin Override */}
        <div className="p-4 bg-white border-t border-[#d3d5d7] shrink-0 space-y-3">
          {/* If Closed: Show Lock Status Notice with Reopen button */}
          {activeThread.status === 'closed' && (
            <div className="rounded-[12px] border border-amber-200 bg-amber-50/80 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
                  <Lock className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[13px] text-amber-900">Chat closed for participants</p>
                    <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                      Admin Override Active 🛡️
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Participants cannot send messages. As an Administrator, you can still post official notices and messages anytime.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleChatLock}
                className="inline-flex h-[32px] items-center justify-center gap-1.5 rounded-[8px] bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer ant-wave-btn shadow-2xs shrink-0"
              >
                <Unlock className="size-3.5" />
                <span>Reopen Chat</span>
              </button>
            </div>
          )}

          {/* Admin Composer Bar (Always Active) */}
          <div className="space-y-2">
            {/* Send As Selector & System Notice Action */}
            <div className="flex items-center justify-between text-xs text-[#6f777f]">
              <div className="flex items-center gap-2">
                <span className="font-medium">Send as:</span>
                <div className="flex items-center gap-1 rounded-[6px] bg-[#eff1f3] p-0.5">
                  <button
                    type="button"
                    onClick={() => setSendAs('admin')}
                    className={cn(
                      'rounded-[4px] px-2 py-0.5 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1',
                      sendAs === 'admin' ? 'bg-white text-[#1f2327] shadow-2xs font-bold' : 'text-[#6f777f]'
                    )}
                  >
                    <Shield className="size-3 text-[#00c2cb]" />
                    <span>Admin (Official)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendAs('agent')}
                    className={cn(
                      'rounded-[4px] px-2 py-0.5 text-xs font-semibold cursor-pointer transition-colors',
                      sendAs === 'agent' ? 'bg-white text-[#1f2327] shadow-2xs font-bold' : 'text-[#6f777f]'
                    )}
                  >
                    Agent (Impersonate)
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSystemDialog(true)}
                className="text-xs text-[#00c2cb] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="size-3" />
                <span>Insert System Notice</span>
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center rounded-[10px] border border-[#d3d5d7] bg-[#f8f9fa] focus-within:border-[#00c2cb] focus-within:bg-white transition-colors">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeThread.status === 'closed'
                      ? 'Type official message (Admin override enabled on closed chat)...'
                      : 'Type a message to investor or agent...'
                  }
                  className="flex-1 bg-transparent py-2.5 pl-3.5 pr-20 text-sm outline-none text-[#1f2327]"
                />

                {/* Right Tools: Attach + Camera */}
                <div className="absolute right-2.5 flex items-center gap-2 text-[#6f777f]">
                  <button
                    type="button"
                    onClick={() => notify('Attachment', 'Select image or PDF brochure to send.')}
                    className="p-1 hover:text-[#1f2327] cursor-pointer"
                    title="Attach file / brochure"
                  >
                    <Paperclip className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => notify('Media Upload', 'Capture or upload property video.')}
                    className="p-1 hover:text-[#1f2327] cursor-pointer"
                    title="Upload camera photo / video"
                  >
                    <Camera className="size-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="size-10 rounded-full bg-[#00c2cb] flex items-center justify-center text-white hover:bg-[#00a8b0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-2xs ant-wave-btn"
                title="Send message as Admin"
              >
                <Send className="size-4 fill-white ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALS & DIALOGS
         ========================================================================= */}

      {/* 1. Edit Message Dialog */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h4 className="font-bold text-[16px] text-[#1f2327]">Edit Message (تعديل الرسالة)</h4>
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="size-7 rounded-full flex items-center justify-center text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6f777f]">Modified Message Content</label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full rounded-[8px] border border-[#d3d5d7] p-3 text-sm outline-none focus:border-[#00c2cb]"
                rows={4}
              />
              <p className="text-[11px] text-[#9da4ae]">
                An official `(edited by admin)` marker will be added to this message.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#d3d5d7]">
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="rounded-[8px] border border-[#d3d5d7] px-4 py-2 text-xs font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditMessage}
                className="rounded-[8px] bg-[#00c2cb] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00a8b0] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Broadcast System Notice Dialog */}
      {showSystemDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h4 className="font-bold text-[16px] text-[#1f2327]">Broadcast System Notice</h4>
              <button
                type="button"
                onClick={() => setShowSystemDialog(false)}
                className="size-7 rounded-full flex items-center justify-center text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleBroadcastSystemNotice} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#6f777f]">Notice Category</label>
                <select
                  value={systemNoticeType}
                  onChange={(e) => setSystemNoticeType(e.target.value as any)}
                  className="mt-1 w-full rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 text-xs outline-none focus:border-[#00c2cb]"
                >
                  <option value="info">ℹ️ General Notice / Policy Reminder</option>
                  <option value="deal_secured">👑 Deal Secured / Milestone Announcement</option>
                  <option value="warning">⚠️ Compliance Warning / Escrow Notice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6f777f]">Notice Text</label>
                <textarea
                  value={systemNoticeText}
                  onChange={(e) => setSystemNoticeText(e.target.value)}
                  placeholder="Enter official Duseat system notice to be displayed to both parties..."
                  className="mt-1 w-full rounded-[8px] border border-[#d3d5d7] p-3 text-xs outline-none focus:border-[#00c2cb]"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#d3d5d7]">
                <button
                  type="button"
                  onClick={() => setShowSystemDialog(false)}
                  className="rounded-[8px] border border-[#d3d5d7] px-4 py-2 text-xs font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[8px] bg-[#00c2cb] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00a8b0] cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Lightbox Image Viewer */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out print:hidden"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-[12px] overflow-hidden">
            <img src={lightboxImage} alt="Fullscreen View" className="size-full object-contain" />
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINT-ONLY OFFICIAL DUSEAT PDF REPORT (Formatted for window.print() / Save as PDF)
         ========================================================================= */}
      <div className="hidden print:block fixed inset-0 z-[9999] bg-white text-black p-10 font-sans space-y-6">
        {/* Official Duseat Header */}
        <div className="border-b-2 border-[#00c2cb] pb-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#00c2cb] tracking-wide">DUSEAT</h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
              Official Real Estate Marketplace & Negotiation Audit
            </p>
          </div>
          <div className="text-right text-xs text-gray-600 space-y-1">
            <p>Chat Reference: <strong className="text-gray-900 font-mono">{activeThread.id}</strong></p>
            <p>Request ID: <strong className="text-gray-900 font-mono">{activeThread.requestId}</strong></p>
            <p>Export Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p>Status: <strong className="uppercase text-[#00a4ac] font-bold">{activeThread.status}</strong></p>
          </div>
        </div>

        {/* Participants & Deal Metadata */}
        <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Agent Profile</p>
            <p className="text-sm font-bold text-gray-900">{activeThread.agent.name} ({activeThread.agent.id})</p>
            <p className="text-gray-600">License: RERA Verified • Plan: {activeThread.agent.plan}</p>
            <p className="text-gray-600">Country: {activeThread.agent.country || 'United Arab Emirates'}</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Investor Profile</p>
            <p className="text-sm font-bold text-gray-900">{activeThread.investor.name} ({activeThread.investor.id})</p>
            <p className="text-gray-600">Verification: KYC Approved • Trust Score: {activeThread.investor.score}/100</p>
            <p className="text-gray-600">Country: {activeThread.investor.country || 'United Arab Emirates'}</p>
          </div>
        </div>

        {/* Property Context Banner */}
        <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-xs flex items-center justify-between text-cyan-950">
          <div>
            <span className="font-bold">Property Requirement: </span>
            <span>{activeThread.context}</span>
          </div>
          {activeThread.dealPrice && (
            <div>
              <span className="font-bold">Agreed Value: </span>
              <span className="font-bold text-[#00737a]">{activeThread.dealPrice}</span>
            </div>
          )}
        </div>

        {/* Chronological Chat Messages Log */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
            Official Chronological Chat Transcript ({activeThread.messages.length} Events)
          </h2>
          <div className="space-y-3">
            {activeThread.messages.map((m) => {
              const isAgent = m.sender === 'agent' || m.sender === 'admin'
              const isSys = m.sender === 'system'
              return (
                <div key={m.id} className="border-b border-gray-100 pb-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span
                      className={
                        isSys
                          ? 'text-amber-700'
                          : isAgent
                          ? 'text-teal-700'
                          : 'text-indigo-700'
                      }
                    >
                      [{m.sender.toUpperCase()}] {m.senderName} {m.isEdited && '(edited)'}
                    </span>
                    <span className="text-gray-400 font-normal">{m.date ? `${m.date} • ` : ''}{m.time}</span>
                  </div>
                  <p className="mt-1 text-gray-800 leading-relaxed font-normal whitespace-pre-wrap">
                    {m.text || `[Attachment: ${m.type.toUpperCase()}${m.duration ? ` (${m.duration})` : ''}]`}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Official Compliance Stamp & Legal Footer */}
        <div className="pt-8 mt-8 border-t border-gray-300 flex items-center justify-between text-[10px] text-gray-500">
          <p>This transcript is generated automatically by the Duseat Compliance & Audit Engine. Confidential and legally privileged.</p>
          <div className="text-right">
            <p className="font-mono font-bold text-gray-700">DUSEAT-VERIFIED-TRANSCRIPT-SECURE</p>
            <p>Authorized Admin Audit Log</p>
          </div>
        </div>
      </div>
    </div>
  )
}
