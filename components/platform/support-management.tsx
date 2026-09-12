'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Headphones,
  Search,
  Filter,
  Download,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  User,
  ShieldCheck,
  Send,
  UserCheck,
  ChevronRight,
  ChevronDown,
  X,
  CreditCard,
  Laptop,
  Bug,
  Lightbulb,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import {
  MetricCard,
  TableCheckbox,
  TableAvatar,
  Pagination,
} from '@/components/ui'
import { cn, exportToCsv } from '@/lib/utils'

export type TicketCategory =
  | 'Technical'
  | 'Payment'
  | 'Account'
  | 'Verification'
  | 'General'
  | 'Bug Report'
  | 'Feature Request'

export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low'
export type TicketStatus = 'Open' | 'Pending with User' | 'Escalated' | 'Resolved' | 'Closed'

export interface SupportTicket {
  id: string
  ticketNumber: string
  subject: string
  customerName: string
  customerEmail: string
  customerType: 'Investor' | 'Agent'
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  assignee: string
  createdAt: string
  lastActivity: string
  messagesCount: number
  description: string
  responses: {
    sender: string
    role: 'customer' | 'admin'
    time: string
    text: string
  }[]
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-901',
    ticketNumber: '#SUP-4821',
    subject: 'RERA Broker License verification rejection clarification',
    customerName: 'Fatima Al-Zahra',
    customerEmail: 'fatima@skylineproperties.ae',
    customerType: 'Agent',
    category: 'Verification',
    priority: 'High',
    status: 'Open',
    assignee: 'Sarah Jenkins (Compliance Lead)',
    createdAt: '10 Sep 2026, 09:15 AM',
    lastActivity: '12 mins ago',
    messagesCount: 3,
    description: 'My RERA trade license document was rejected due to blurred QR code scan. I have uploaded the official DED PDF re-attested.',
    responses: [
      { sender: 'Fatima Al-Zahra', role: 'customer', time: '09:15 AM', text: 'Attached clean original digital copy of RERA certificate.' },
      { sender: 'Sarah Jenkins', role: 'admin', time: '10:30 AM', text: 'Document received. Routing directly to Verification Inspector for accelerated clearance.' },
    ],
  },
  {
    id: 'TCK-902',
    ticketNumber: '#SUP-4820',
    subject: 'Stripe subscription invoice not generating VAT number',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@mayfairgroup.co.uk',
    customerType: 'Investor',
    category: 'Payment',
    priority: 'Medium',
    status: 'Pending with User',
    assignee: 'Tariq Al-Mansoor (Finance)',
    createdAt: '09 Sep 2026, 02:40 PM',
    lastActivity: '2 hours ago',
    messagesCount: 4,
    description: 'Our UK accounting entity needs the UAE Federal Tax Authority (FTA) TRN displayed on the AED 1,499 receipt.',
    responses: [
      { sender: 'Marcus Vance', role: 'customer', time: 'Yesterday', text: 'Can you please re-issue with our UK VAT number added?' },
      { sender: 'Tariq Al-Mansoor', role: 'admin', time: 'Yesterday', text: 'Updated billing details in ledger. Please confirm if PDF reflects TRN 1004829104.' },
    ],
  },
  {
    id: 'TCK-903',
    ticketNumber: '#SUP-4819',
    subject: 'Push notifications not received for new Palm Jumeirah offers',
    customerName: 'Rashid Al-Nuaimi',
    customerEmail: 'rashid.nuaimi@holding.ae',
    customerType: 'Investor',
    category: 'Technical',
    priority: 'Urgent',
    status: 'Escalated',
    assignee: 'Karim Mansour (Core Platform Dev)',
    createdAt: '09 Sep 2026, 11:20 AM',
    lastActivity: '35 mins ago',
    messagesCount: 5,
    description: 'Investor brief created for AED 45M Palm Villa had 4 agent offers submitted but no iOS push trigger was delivered.',
    responses: [
      { sender: 'Rashid Al-Nuaimi', role: 'customer', time: '09 Sep', text: 'FCM push was missing on iOS app version 2.4.1.' },
      { sender: 'Karim Mansour', role: 'admin', time: '10 Sep', text: 'Identified APNs device token renewal glitch. Patch deployed to production push queue.' },
    ],
  },
  {
    id: 'TCK-904',
    ticketNumber: '#SUP-4818',
    subject: 'Request for custom CSV export of closed deals in Q2 2026',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@damacgroup.ae',
    customerType: 'Agent',
    category: 'Feature Request',
    priority: 'Low',
    status: 'Resolved',
    assignee: 'Ahmed Al-Maktoum (Operations)',
    createdAt: '08 Sep 2026, 04:10 PM',
    lastActivity: '1 day ago',
    messagesCount: 2,
    description: 'Would appreciate having bulk Deal pipeline export with commission breakdown available in Custom Reports.',
    responses: [
      { sender: 'Ahmed Al-Maktoum', role: 'admin', time: '08 Sep', text: 'Generated custom CSV report and emailed download link to registered broker inbox.' },
    ],
  },
  {
    id: 'TCK-905',
    ticketNumber: '#SUP-4817',
    subject: 'Filter dropdown reset bug on mobile Safari when searching areas',
    customerName: 'Zayd Ibrahim',
    customerEmail: 'zayd.ibrahim@dubairealty.com',
    customerType: 'Agent',
    category: 'Bug Report',
    priority: 'High',
    status: 'Open',
    assignee: 'Karim Mansour (Dev)',
    createdAt: '10 Sep 2026, 08:30 AM',
    lastActivity: '1 hour ago',
    messagesCount: 1,
    description: 'Selecting Downtown Dubai in the multi-select filter clears the budget range input on iOS Safari.',
    responses: [],
  },
]

export function SupportManagement() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || searchParams.get('tab') || 'All'
  const [tickets, setTickets] = React.useState<SupportTicket[]>(INITIAL_TICKETS)
  const [activeTab, setActiveTab] = React.useState<string>(initialCategory)
  const [search, setSearch] = React.useState('')
  const [priorityFilter, setPriorityFilter] = React.useState<string>('All priorities')
  const [statusFilter, setStatusFilter] = React.useState<string>('All statuses')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  // Drawer detail state
  const [activeTicket, setActiveTicket] = React.useState<SupportTicket | null>(null)
  const [replyText, setReplyText] = React.useState('')

  const categories = [
    'All',
    'Technical',
    'Payment',
    'Verification',
    'Account',
    'Bug Report',
    'Feature Request',
  ]

  const filtered = React.useMemo(() => {
    return tickets.filter((t) => {
      if (activeTab !== 'All' && t.category !== activeTab) return false
      if (priorityFilter !== 'All priorities' && t.priority !== priorityFilter) return false
      if (statusFilter !== 'All statuses' && t.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [tickets, activeTab, priorityFilter, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map((t) => t.id) : [])
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSendReply = () => {
    if (!activeTicket || !replyText.trim()) return

    const newResponse = {
      sender: 'Duseat Support Team',
      role: 'admin' as const,
      time: 'Just now',
      text: replyText.trim(),
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? {
              ...t,
              status: 'Pending with User',
              lastActivity: 'Just now',
              messagesCount: t.messagesCount + 1,
              responses: [...t.responses, newResponse],
            }
          : t
      )
    )

    setActiveTicket((prev) =>
      prev ? { ...prev, responses: [...prev.responses, newResponse], messagesCount: prev.messagesCount + 1 } : null
    )
    setReplyText('')
  }

  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    )
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_support_tickets_${new Date().toISOString().split('T')[0]}`,
      ['Ticket #', 'Subject', 'Customer', 'Email', 'Type', 'Category', 'Priority', 'Status', 'Assignee', 'Created'],
      filtered.map((t) => [
        t.ticketNumber,
        t.subject,
        t.customerName,
        t.customerEmail,
        t.customerType,
        t.category,
        t.priority,
        t.status,
        t.assignee,
        t.createdAt,
      ])
    )
  }

  const openTicketsCount = tickets.filter((t) => t.status === 'Open').length
  const pendingUserCount = tickets.filter((t) => t.status === 'Pending with User').length
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length

  return (
    <PlatformShell
      title="Support Center & Helpdesk"
      eyebrow="Operations & Customer Success"
      query={search}
      onQueryChange={setSearch}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Customer Support & Helpdesk
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Triage investor & agent inquiries, resolve technical issues, track SLA response times, and manage ticket escalations.
              </p>
            </div>

            {/* Quick Actions Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/conversations"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <MessageSquare className="size-4 text-[#00c2cb]" />
                <span>Live Chats</span>
              </Link>
              <Link
                href="/activity"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Clock className="size-4 text-[#6f777f]" />
                <span>Audit Trail</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Open Tickets"
              value={openTicketsCount}
              tone="warning"
              active={statusFilter === 'Open'}
              onClick={() => {
                setStatusFilter(statusFilter === 'Open' ? 'All statuses' : 'Open')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Pending User Reply"
              value={pendingUserCount}
              tone="info"
              active={statusFilter === 'Pending with User'}
              onClick={() => {
                setStatusFilter(statusFilter === 'Pending with User' ? 'All statuses' : 'Pending with User')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Escalated Issues"
              value={escalatedCount}
              tone="destructive"
              active={statusFilter === 'Escalated'}
              onClick={() => {
                setStatusFilter(statusFilter === 'Escalated' ? 'All statuses' : 'Escalated')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="SLA Compliance Rate"
              value="98.4%"
              tone="success"
              active={false}
            />
          </div>
        </header>

        {/* Single Unified Section Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Pill Tabs & Actions */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Category Pill Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                {categories.map((cat) => {
                  const count = cat === 'All' ? tickets.length : tickets.filter((t) => t.category === cat).length
                  const isSelected = activeTab === cat
                  return (
                    <a
                      key={cat}
                      href={`/support?category=${encodeURIComponent(cat)}`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          return
                        }
                        e.preventDefault()
                        setActiveTab(cat)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap no-underline',
                        isSelected
                          ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{cat === 'All' ? 'All Inquiries' : cat}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {count}
                      </span>
                    </a>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                >
                  <Download className="size-4 text-white" />
                  <span className="whitespace-nowrap">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search tickets, subject, customer…"
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Priority Filter Dropdown */}
              <Dropdown
                align="start"
                value={priorityFilter}
                onSelect={(val) => {
                  setPriorityFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Priority"
                options={[
                  { label: 'All priorities', value: 'All priorities' },
                  { label: 'Urgent', value: 'Urgent' },
                  { label: 'High', value: 'High' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'Low', value: 'Low' },
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <AlertTriangle className="size-4 text-[#6f777f]" />
                    <span>{priorityFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Status Filter Dropdown */}
              <Dropdown
                align="start"
                value={statusFilter}
                onSelect={(val) => {
                  setStatusFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Status"
                options={[
                  { label: 'All statuses', value: 'All statuses' },
                  { label: 'Open', value: 'Open' },
                  { label: 'Pending with User', value: 'Pending with User' },
                  { label: 'Escalated', value: 'Escalated' },
                  { label: 'Resolved', value: 'Resolved' },
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <Filter className="size-4 text-[#6f777f]" />
                    <span>{statusFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reset Filters */}
              {(search || priorityFilter !== 'All priorities' || statusFilter !== 'All statuses' || activeTab !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPriorityFilter('All priorities')
                    setStatusFilter('All statuses')
                    setActiveTab('All')
                    setCurrentPage(1)
                  }}
                  className="flex h-[38px] items-center gap-1.5 px-2 text-[13px] font-medium text-[#00c2cb] hover:underline cursor-pointer shrink-0"
                >
                  <X className="size-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="hidden md:block overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1150px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                  <th className="w-12 px-4">
                    <TableCheckbox
                      checked={paginated.length > 0 && selectedIds.length === paginated.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Ticket #</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Customer</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Subject & Category</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Priority</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Status</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Assigned Moderator</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Last Activity</th>
                  <th className="whitespace-nowrap px-4 text-right text-[14px] font-semibold text-[#1f2327]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#6f777f]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckCircle2 className="size-8 text-[#00a870]" />
                        <p className="text-[15px] font-semibold text-[#1f2327]">Inbox Zero</p>
                        <p className="text-[13px] text-[#6f777f]">No tickets match the selected filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((t) => {
                    const isChecked = selectedIds.includes(t.id)
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setActiveTicket(t)}
                        className={cn(
                          'h-[64px] transition-colors cursor-pointer whitespace-nowrap font-sans',
                          isChecked ? 'bg-[#e5f6f7]/40' : 'hover:bg-[#f8f9fa]'
                        )}
                      >
                        <td className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
                          <TableCheckbox
                            checked={isChecked}
                            onChange={() => handleSelectOne(t.id)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 font-mono font-semibold text-[13px] text-[#00c2cb]">
                          {t.ticketNumber}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar name={t.customerName} size="md" />
                            <div>
                              <p className="text-[14px] font-semibold text-[#1f2327] leading-tight">
                                {t.customerName}
                              </p>
                              <span className="text-[12px] text-[#6f777f]">{t.customerType}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 max-w-[280px]">
                          <p className="text-[14px] font-medium text-[#1f2327] truncate leading-tight" title={t.subject}>
                            {t.subject}
                          </p>
                          <span className="inline-flex items-center rounded bg-[#eff1f3] px-2 py-0.5 text-[11px] font-semibold text-[#1f2327] mt-1">
                            {t.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
                              t.priority === 'Urgent' && 'bg-[#feebee] text-[#dc2626]',
                              t.priority === 'High' && 'bg-[#fff8e6] text-[#b27b00]',
                              t.priority === 'Medium' && 'bg-[#f4f5f6] text-[#344054]',
                              t.priority === 'Low' && 'bg-[#f2f4f7] text-[#667085]'
                            )}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
                              t.status === 'Open' && 'bg-[#e0f7f8] text-[#00848b]',
                              t.status === 'Escalated' && 'bg-[#feebee] text-[#dc2626]',
                              t.status === 'Resolved' && 'bg-[#e6f9f3] text-[#00a870]',
                              t.status === 'Pending with User' && 'bg-[#fff8e6] text-[#b27b00]'
                            )}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 text-[13px] text-[#1f2327] font-medium">
                          {t.assignee}
                        </td>
                        <td className="whitespace-nowrap px-4 text-[12px] text-[#6f777f]">
                          {t.lastActivity}
                        </td>
                        <td className="whitespace-nowrap px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setActiveTicket(t)}
                            className="h-[32px] px-2.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                          >
                            Open Thread
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Integrated Pagination Footer */}
          <div className="border-t border-[#d3d5d7] px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n)
                setCurrentPage(1)
              }}
              itemLabel="tickets"
            />
          </div>
        </section>

        {/* Ticket Detail Drawer */}
        {activeTicket && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full sm:w-[540px] md:w-[600px] h-full bg-white shadow-2xl flex flex-col border-l border-[#d3d5d7] animate-in slide-in-from-right duration-250">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#d3d5d7] bg-[#fafbfc]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[14px] text-[#00848b]">
                      {activeTicket.ticketNumber}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                        activeTicket.priority === 'Urgent' ? 'bg-[#feebee] text-[#dc2626]' : 'bg-[#e0f7f8] text-[#00848b]'
                      )}
                    >
                      {activeTicket.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#1f2327] mt-1 line-clamp-1">
                    {activeTicket.subject}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="size-8 rounded-[6px] hover:bg-[#eff1f3] text-[#5a6068] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Customer Information Card */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fafbfc] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TableAvatar name={activeTicket.customerName} size="md" />
                    <div>
                      <p className="text-[14px] font-bold text-[#1f2327]">{activeTicket.customerName}</p>
                      <p className="text-[12px] text-[#6f777f]">{activeTicket.customerEmail}</p>
                      <span className="text-[11px] font-semibold text-[#00848b]">{activeTicket.customerType} Account</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[11px] text-[#6f777f] block">Status:</span>
                    <Dropdown
                      align="end"
                      value={activeTicket.status}
                      onSelect={(val) => handleUpdateStatus(activeTicket.id, val as TicketStatus)}
                      options={[
                        { label: 'Open', value: 'Open' },
                        { label: 'Pending with User', value: 'Pending with User' },
                        { label: 'Escalated', value: 'Escalated' },
                        { label: 'Resolved', value: 'Resolved' },
                        { label: 'Closed', value: 'Closed' },
                      ]}
                      trigger={
                        <span className="inline-flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-semibold text-[#1f2327] cursor-pointer">
                          <span>{activeTicket.status}</span>
                          <ChevronDown className="size-3 text-[#9da4ae]" />
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Original Ingestion Brief */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6f777f]">Customer Message</span>
                  <p className="text-[14px] text-[#344054] leading-relaxed">
                    {activeTicket.description}
                  </p>
                  <p className="text-[11px] text-[#8f969e]">Opened at: {activeTicket.createdAt}</p>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">Resolution History</span>
                  {activeTicket.responses.length === 0 ? (
                    <p className="text-[13px] text-[#8f969e] italic">No responses posted yet. Reply below.</p>
                  ) : (
                    activeTicket.responses.map((resp, i) => (
                      <div
                        key={i}
                        className={cn(
                          'p-3.5 rounded-[10px] text-[13.5px] leading-relaxed',
                          resp.role === 'admin'
                            ? 'bg-[#f4fbfc] border border-[#b9e6e8] ml-6 text-[#1f2327]'
                            : 'bg-[#f8f9fa] border border-[#d3d5d7] mr-6 text-[#344054]'
                        )}
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#6f777f] mb-1.5 font-medium">
                          <span className={resp.role === 'admin' ? 'font-bold text-[#00848b]' : 'font-bold'}>
                            {resp.sender}
                          </span>
                          <span>{resp.time}</span>
                        </div>
                        <p>{resp.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Drawer Reply Footer */}
              <div className="p-4 border-t border-[#d3d5d7] bg-white space-y-2.5">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response to customer or internal staff note..."
                  className="w-full rounded-[8px] border border-[#d3d5d7] p-3 text-[13.5px] text-[#1f2327] placeholder:text-[#8f969e] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 font-sans"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeTicket.id, 'Resolved')}
                    className="h-[34px] px-3 rounded-[6px] border border-[#d3d5d7] text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                  >
                    Mark as Resolved
                  </button>

                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="h-[34px] px-4 rounded-[6px] bg-[#1f2327] hover:bg-[#2e3338] text-white text-[13px] font-semibold transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="size-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
