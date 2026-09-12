'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  MessageSquare,
  Shield,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Flag,
  Download,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Send,
  MoreHorizontal,
  ChevronDown,
  X,
  FileText,
  User,
  Sparkles,
  Phone,
  FileDown,
  RefreshCw,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ChatModerator } from './chat-moderator'
import { ScheduleExportModal } from './schedule-export-modal'
import { AgentPlanBadge, FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Flag as CountryFlag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { StatusFilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { Dropdown } from '@/components/dashboard/menu'
import { DateRangePicker } from './date-range-picker'
import { cn } from '@/lib/utils'
import {
  type ChatThread,
  type ChatMessage,
  initialChatThreads,
} from '@/lib/platform-chats'

const STATUS_TABS = [
  { id: 'All', label: 'All Conversations' },
  { id: 'active', label: 'Active' },
  { id: 'closed', label: 'Closed' },
  { id: 'flagged', label: 'AI Flagged' },
  { id: 'reported', label: 'Reported' },
]

export function ConversationsManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_conversations_records'

  const [threads, setThreads] = React.useState<ChatThread[]>(initialChatThreads)
  const [activeThreadForModal, setActiveThreadForModal] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')
  const [searchMode, setSearchMode] = React.useState<'keyword' | 'user' | 'request' | 'id'>('keyword')
  const initialStatusTab = (searchParams.get('status') as any) || (searchParams.get('tab') as any) || 'All'
  const [statusTab, setStatusTab] = React.useState<'All' | 'active' | 'closed' | 'flagged' | 'reported'>(initialStatusTab)
  const [statusDropdown, setStatusDropdown] = React.useState('All')
  const [investorFilter, setInvestorFilter] = React.useState('All Investors')
  const [agentFilter, setAgentFilter] = React.useState('All Agents')
  const [dateRange, setDateRange] = React.useState('All Time')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [scheduleExportOpen, setScheduleExportOpen] = React.useState(false)

  React.useEffect(() => {
    let currentThreads = initialChatThreads
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentThreads = parsed
          setThreads(parsed)
        }
      }
    } catch {}

    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      const found = currentThreads.find((t) => t.id.toLowerCase() === idFromUrl.toLowerCase())
      if (found) {
        setActiveThreadForModal(found.id)
      } else {
        setQuery(idFromUrl)
      }
    }
  }, [searchParams])

  const saveThreads = (newThreads: ChatThread[]) => {
    setThreads(newThreads)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newThreads))
    } catch {}
  }

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const handleCloseThread = (threadId: string) => {
    const updated = threads.map((t) => (t.id === threadId ? { ...t, status: 'closed' as const } : t))
    saveThreads(updated)
    notify('Conversation Closed', `Thread ${threadId} has been closed by admin.`)
  }

  const handleReopenThread = (threadId: string) => {
    const updated = threads.map((t) => (t.id === threadId ? { ...t, status: 'active' as const } : t))
    saveThreads(updated)
    notify('Conversation Reopened', `Thread ${threadId} is now active.`)
  }

  const handleFlagThread = (threadId: string) => {
    const updated = threads.map((t) => (t.id === threadId ? { ...t, status: 'flagged' as const } : t))
    saveThreads(updated)
    notify('Conversation Flagged', `Thread ${threadId} flagged for compliance review.`, 'error')
  }

  const handleExportCSV = () => {
    const rows = filteredThreads.map((t) => [
      t.id,
      t.requestId,
      `"${t.investor.name}"`,
      `"${t.agent.name}"`,
      t.status,
      `"${t.messages[t.messages.length - 1]?.text || 'Media Message'}"`,
      t.startedDate || '12 May 2026',
      t.lastActivity,
    ])
    const csv = 'data:text/csv;charset=utf-8,Conversation ID,Request ID,Investor,Agent,Status,Last Message,Started At,Last Activity\n' + rows.map((r) => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `duseat_conversations_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Export Started', 'Conversations audit CSV downloaded.')
  }

  // Unique Dropdowns
  const uniqueInvestors = React.useMemo(() => {
    const set = new Set(threads.map((t) => t.investor.name))
    return ['All Investors', ...Array.from(set)].map((i) => ({ label: i, value: i }))
  }, [threads])

  const uniqueAgents = React.useMemo(() => {
    const set = new Set(threads.map((t) => t.agent.name))
    return ['All Agents', ...Array.from(set)].map((a) => ({ label: a, value: a }))
  }, [threads])

  const filteredThreads = React.useMemo(() => {
    return threads.filter((t) => {
      if (statusTab === 'active' && t.status !== 'active') return false
      if (statusTab === 'closed' && t.status !== 'closed') return false
      if (statusTab === 'flagged' && t.status !== 'flagged' && !t.isFlagged) return false
      if (statusTab === 'reported' && t.status !== 'reported' && !t.isReported) return false

      if (statusDropdown !== 'All' && t.status !== statusDropdown) return false
      if (investorFilter !== 'All Investors' && t.investor.name !== investorFilter) return false
      if (agentFilter !== 'All Agents' && t.agent.name !== agentFilter) return false

      if (!query) return true
      const q = query.toLowerCase()
      if (searchMode === 'user') {
        return t.investor.name.toLowerCase().includes(q) || t.agent.name.toLowerCase().includes(q)
      }
      if (searchMode === 'request') {
        return t.requestId.toLowerCase().includes(q) || t.context.toLowerCase().includes(q)
      }
      if (searchMode === 'id') {
        return t.id.toLowerCase().includes(q)
      }
      // keyword search
      const hasMsg = t.messages.some((m) => m.text?.toLowerCase().includes(q))
      return t.id.toLowerCase().includes(q) || t.context.toLowerCase().includes(q) || hasMsg
    })
  }, [threads, statusTab, statusDropdown, investorFilter, agentFilter, query, searchMode])

  const totalPages = Math.max(1, Math.ceil(filteredThreads.length / rowsPerPage))
  const paginatedThreads = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredThreads.slice(start, start + rowsPerPage)
  }, [filteredThreads, currentPage, rowsPerPage])

  // 7 Dashboard Metrics
  const totalCount = threads.length
  const activeCount = threads.filter((t) => t.status === 'active').length
  const closedCount = threads.filter((t) => t.status === 'closed').length
  const flaggedCount = threads.filter((t) => t.status === 'flagged' || t.isFlagged).length
  const reportedCount = threads.filter((t) => t.status === 'reported' || t.isReported).length

  const statusCounts = React.useMemo(() => {
    return {
      All: totalCount,
      active: activeCount,
      closed: closedCount,
      flagged: flaggedCount,
      reported: reportedCount,
    }
  }, [totalCount, activeCount, closedCount, flaggedCount, reportedCount])

  const hasActiveFilters =
    query !== '' ||
    statusTab !== 'All' ||
    statusDropdown !== 'All' ||
    investorFilter !== 'All Investors' ||
    agentFilter !== 'All Agents' ||
    dateRange !== 'All Time'

  const resetAllFilters = () => {
    setQuery('')
    setStatusTab('All')
    setStatusDropdown('All')
    setInvestorFilter('All Investors')
    setAgentFilter('All Agents')
    setDateRange('All Time')
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredThreads.map((t) => t.id) : [])
  }

  const handleSelectRow = (threadId: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, threadId] : prev.filter((id) => id !== threadId)))
  }

  return (
    <PlatformShell
      title="Conversations & Chat Moderation"
      eyebrow="marketplace"
      query={query}
      onQueryChange={setQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            1. TOP HEADER CARD (Clean, No Kicker)
           ========================================================================= */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Conversations & Live Chat
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Monitor live investor-agent negotiation rooms, audit compliance signals, inspect shared media, and enforce safety guidelines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/chats"
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#00c2cb] bg-[#e5f6f7] px-3.5 text-[14px] font-semibold text-[#00848b] hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer shadow-2xs ant-wave-btn"
              >
                <MessageSquare className="size-4" />
                <span>Open Live Chat Desk</span>
              </Link>

              <button
                type="button"
                onClick={() => setScheduleExportOpen(true)}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                <Clock className="size-4 text-[#6f777f]" />
                <span>Schedule Export</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <Download className="size-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* 7 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7 lg:gap-3">
            <MetricCard
              label="Total Conversations"
              value={totalCount}
              tone="neutral"
              active={statusTab === 'All'}
              onClick={() => setStatusTab('All')}
            />
            <MetricCard
              label="Active Chats"
              value={activeCount}
              tone="info"
              active={statusTab === 'active'}
              onClick={() => setStatusTab('active')}
            />
            <MetricCard
              label="Closed Chats"
              value={closedCount}
              tone="success"
              active={statusTab === 'closed'}
              onClick={() => setStatusTab('closed')}
            />
            <MetricCard
              label="Reported Chats"
              value={reportedCount}
              tone="warning"
              active={statusTab === 'reported'}
              onClick={() => setStatusTab('reported')}
            />
            <MetricCard
              label="AI Flagged"
              value={flaggedCount}
              tone="destructive"
              active={statusTab === 'flagged'}
              onClick={() => setStatusTab('flagged')}
            />
            <MetricCard
              label="Avg Response Time"
              value="12 min"
              tone="brand"
            />
            <MetricCard
              label="Avg Duration"
              value="4.2 days"
              tone="neutral"
            />
          </div>
        </header>

        {/* =========================================================================
            3. MAIN CONTENT CONTAINER (Table + Filters + Tabs)
           ========================================================================= */}
        <section className="flex flex-col justify-between rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] min-h-[580px]">
          {/* FILTER / SEARCH STRIP */}
          <div className="flex flex-col gap-3.5 p-4 sm:p-5 border-b border-[#d3d5d7]">
            {/* Row 1: Unified Status Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusFilterTabs
                tabs={STATUS_TABS}
                counts={statusCounts}
                activeTab={statusTab}
                onChange={(tabId) => setStatusTab(tabId as any)}
                variant="default"
              />

              <div className="text-[13px] text-[#6f777f]">
                Showing <strong className="font-semibold text-[#1f2327]">{filteredThreads.length}</strong> of{' '}
                <strong className="font-semibold text-[#1f2327]">{threads.length}</strong> conversations
              </div>
            </div>

            {/* Row 2: Search + Mode Selectors + Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-full sm:w-[300px]">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder={
                    searchMode === 'user'
                      ? 'Search by investor or agent name…'
                      : searchMode === 'request'
                      ? 'Search by request ID or title…'
                      : searchMode === 'id'
                      ? 'Search by Conversation ID…'
                      : 'Search messages, keywords, text…'
                  }
                />
              </div>

              {/* Search Mode Segmented Pills */}
              <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-1">
                {(['keyword', 'user', 'request', 'id'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSearchMode(m)}
                    className={cn(
                      'h-[28px] px-2.5 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer capitalize',
                      searchMode === m
                        ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                        : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    {m === 'id' ? 'ID' : m}
                  </button>
                ))}
              </div>

              {/* Status Dropdown */}
              <Dropdown
                options={[
                  { label: 'All Statuses', value: 'All' },
                  { label: 'Active', value: 'active' },
                  { label: 'Closed', value: 'closed' },
                  { label: 'Flagged', value: 'flagged' },
                ]}
                value={statusDropdown}
                onSelect={setStatusDropdown}
                label="Status"
              />

              {/* Investor Filter */}
              <Dropdown
                options={uniqueInvestors}
                value={investorFilter}
                onSelect={setInvestorFilter}
                label="Investor"
              />

              {/* Agent Filter */}
              <Dropdown
                options={uniqueAgents}
                value={agentFilter}
                onSelect={setAgentFilter}
                label="Agent"
              />

              {/* Date Range */}
              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex h-[38px] items-center gap-1.5 px-2 text-[13px] font-medium text-[#00c2cb] hover:underline cursor-pointer shrink-0"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* BULK ACTION BAR */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-6 py-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#00848b]" />
                <span className="text-[13px] font-medium text-[#1f2327]">
                  {selectedIds.length} conversation{selectedIds.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = threads.map((t) => (selectedIds.includes(t.id) ? { ...t, status: 'closed' as const } : t))
                    saveThreads(updated)
                    setSelectedIds([])
                    notify('Bulk Closed', `${selectedIds.length} conversations closed.`)
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#1f2327] px-3 text-[12px] font-semibold text-white hover:bg-black transition-colors cursor-pointer shadow-2xs"
                >
                  <Lock className="size-3.5" />
                  <span>Close Selected</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = threads.map((t) => (selectedIds.includes(t.id) ? { ...t, status: 'flagged' as const } : t))
                    saveThreads(updated)
                    setSelectedIds([])
                    notify('Bulk Flagged', `${selectedIds.length} conversations flagged.`, 'error')
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#d92d20] px-3 text-[12px] font-semibold text-white hover:bg-[#b42318] transition-colors cursor-pointer shadow-2xs"
                >
                  <Flag className="size-3.5" />
                  <span>Flag Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              CONVERSATIONS TABLE (8 Core Columns)
             ========================================================================= */}
          <div className="overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1300px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                  <th className="w-12 px-4 whitespace-nowrap">
                    <TableCheckbox
                      checked={selectedIds.length === paginatedThreads.length && paginatedThreads.length > 0}
                      onChange={(checked) => handleSelectAll(checked)}
                      ariaLabel="Select all conversations"
                    />
                  </th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Conversation ID</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Investor</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Agent & Agency</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Request / Property</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Status</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Last Message Preview</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Started At</th>
                  <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Last Activity</th>
                  <th className="px-4 text-right text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#d3d5d7]">
                {paginatedThreads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-[#6f777f]">
                      <EmptyState
                        title="No conversations found"
                        description="Try adjusting your search query or reset your active filters."
                        actionLabel="Reset filters"
                        onAction={resetAllFilters}
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedThreads.map((thread) => {
                    const isSelected = selectedIds.includes(thread.id)
                    const lastMsg = thread.messages[thread.messages.length - 1]
                    const previewText = lastMsg?.text || (lastMsg?.type === 'voice' ? '🎙️ Voice note' : lastMsg?.type === 'image' || lastMsg?.type === 'gallery' ? '📷 Media attachment' : 'Message')
                    const countryCode = getCountryCode(thread.investor.country || 'United Arab Emirates')

                    return (
                      <tr
                        key={thread.id}
                        className={cn(
                          'h-[64px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap',
                          isSelected && 'bg-[#e5f6f7]/40'
                        )}
                      >
                        <td className="w-12 px-4 whitespace-nowrap">
                          <TableCheckbox
                            checked={isSelected}
                            onChange={(checked) => handleSelectRow(thread.id, checked)}
                            ariaLabel={`Select thread ${thread.id}`}
                          />
                        </td>

                        {/* 1. Conversation ID */}
                        <td className="px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setActiveThreadForModal(thread.id)}
                            className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline cursor-pointer whitespace-nowrap"
                          >
                            {thread.id}
                          </button>
                        </td>

                        {/* 2. Investor */}
                        <td className="px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5 whitespace-nowrap">
                            <Link href={`/investors/${thread.investor.id}`} className="cursor-pointer">
                              <TableAvatar
                                src={thread.investor.avatar}
                                name={thread.investor.name}
                                countryCode={countryCode}
                                size="md"
                                variant="brand"
                              />
                            </Link>
                            <div className="min-w-0">
                              <Link
                                href={`/investors/${thread.investor.id}`}
                                className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors whitespace-nowrap"
                              >
                                {thread.investor.name}
                              </Link>
                              <span className="text-[12px] leading-[16px] text-[#6f777f] block whitespace-nowrap">{thread.investor.country || 'UAE'}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Agent & Agency */}
                        <td className="px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5 whitespace-nowrap">
                            <Link href={`/agents/${thread.agent.id}`} className="cursor-pointer">
                              <TableAvatar
                                src={thread.agent.avatar}
                                name={thread.agent.name}
                                countryCode={getCountryCode('United Arab Emirates')}
                                size="md"
                                variant="brand"
                              />
                            </Link>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Link
                                  href={`/agents/${thread.agent.id}`}
                                  className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors whitespace-nowrap"
                                >
                                  {thread.agent.name}
                                </Link>
                                <AgentPlanBadge plan={thread.agent.plan || 'Elite'} compact />
                              </div>
                              <span className="text-[12px] leading-[16px] text-[#6f777f] whitespace-nowrap">{thread.agent.agency}</span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Request / Property */}
                        <td className="px-4 whitespace-nowrap">
                          <div className="min-w-0">
                            <p className="font-semibold text-[14px] text-[#1f2327] max-w-[200px] truncate">{thread.context}</p>
                            <Link
                              href={`/requests?id=${thread.requestId}`}
                              className="text-[12px] font-mono font-bold text-[#00c2cb] hover:underline whitespace-nowrap"
                              title={`Open Request ${thread.requestId}`}
                            >
                              Ref: {thread.requestId}
                            </Link>
                          </div>
                        </td>

                        {/* 5. Status */}
                        <td className="px-4 whitespace-nowrap">
                          <FigmaStatusBadge status={thread.status === 'active' ? 'Active' : thread.status === 'closed' ? 'Closed' : 'Flagged'} />
                        </td>

                        {/* 6. Last Message */}
                        <td className="px-4 whitespace-nowrap">
                          <div className="max-w-[220px] truncate text-[13px] text-[#1f2327]">
                            <span className="font-semibold text-[#6f777f]">{lastMsg?.senderName || 'Agent'}: </span>
                            <span>{previewText}</span>
                          </div>
                        </td>

                        {/* 7. Started At */}
                        <td className="px-4 whitespace-nowrap text-[13px] text-[#6f777f]">
                          {thread.startedDate || '12 May 2026'}
                        </td>

                        {/* 8. Last Activity */}
                        <td className="px-4 whitespace-nowrap text-[13px] text-[#6f777f]">
                          {thread.lastActivity}
                        </td>

                        {/* Actions */}
                        <td className="px-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveThreadForModal(thread.id)}
                              className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#00c2cb] bg-[#e5f6f7] px-2.5 text-[12px] font-semibold text-[#00848b] hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer"
                              title="Open Live Negotiation Room"
                            >
                              <MessageSquare className="size-3.5" />
                              <span>Live Room</span>
                            </button>

                            {thread.status === 'active' ? (
                              <button
                                type="button"
                                onClick={() => handleCloseThread(thread.id)}
                                className="flex size-[32px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                                title="Close Conversation"
                              >
                                <Lock className="size-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReopenThread(thread.id)}
                                className="flex size-[32px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#17b26a] hover:bg-[#dfefe8] transition-colors cursor-pointer"
                                title="Reopen Conversation"
                              >
                                <Unlock className="size-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleFlagThread(thread.id)}
                              className="flex size-[32px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#d92d20] hover:bg-[#fee4e2] transition-colors cursor-pointer"
                              title="Flag Conversation"
                            >
                              <Flag className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="mt-auto p-4 border-t border-[#d3d5d7]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredThreads.length}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n)
                setCurrentPage(1)
              }}
              itemLabel="conversations"
            />
          </div>
        </section>
      </div>

      {/* =========================================================================
          LIVE CHAT MODERATION DESK MODAL
         ========================================================================= */}
      {activeThreadForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs ant-fade-in font-sans"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
            <ChatModerator
              initialThreadId={activeThreadForModal}
              onClose={() => setActiveThreadForModal(null)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Schedule Export Modal */}
      <ScheduleExportModal
        isOpen={scheduleExportOpen}
        onClose={() => setScheduleExportOpen(false)}
        onSchedule={(data) => {
          notify('Export Scheduled', `Scheduled ${data.frequency} conversations audit to ${data.recipients.join(', ')}.`)
        }}
        defaultName="Duseat Conversations & Negotiations Audit"
      />
    </PlatformShell>
  )
}

export function ConversationsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <ConversationsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
