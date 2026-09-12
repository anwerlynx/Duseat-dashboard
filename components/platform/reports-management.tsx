'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  AlertOctagon,
  UserCheck,
  UserX,
  FileText,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Download,
  RotateCcw,
  MoreHorizontal,
  X,
  Eye,
  Send,
  Plus,
  Trash2,
  Paperclip,
  Camera,
  Play,
  Copy,
  Check,
  Shield,
  User,
  Building,
  Flag,
  Calendar,
  Layers,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  FileDown,
  SlidersHorizontal,
  Sparkles,
  Info,
  ChevronLeft,
  Share2,
  CheckCheck,
  HelpCircle,
  Printer,
  FileSpreadsheet,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { useToast } from '@/components/dashboard/toast'
import { FigmaStatusBadge, AgentPlanBadge } from '@/components/ui/figma-badges'
import { TableCheckbox } from '@/components/ui/table-checkbox'

import { Dropdown } from '@/components/dashboard/menu'
import { TableAvatar } from '@/components/ui/table-avatar'
import { Pagination } from '@/components/ui'
import { MetricCard } from '@/components/ui/metric-card'
import { cn } from '@/lib/utils'
import {
  type ReportItem,
  type ReportStatus,
  type ReportCategory,
  type ReportEvidence,
  type ReportTimelineEvent,
  type ReportInternalNote,
  initialReports,
} from '@/lib/reports-data'

const ALL_CATEGORIES: ('All' | ReportCategory)[] = [
  'All',
  'Spam',
  'Fake Agent',
  'Fake Investor',
  'Fraud',
  'Abuse',
  'Harassment',
  'Offensive Content',
  'Fake Property',
  'Copyright',
  'Payment Issue',
  'Technical Issue',
  'Other',
]

const MODERATORS_LIST = [
  { id: 'MOD-101', name: 'Ahmad Khaled', role: 'Operations Moderator', email: 'ahmad.khaled@duseat.ae' },
  { id: 'MOD-102', name: 'Sarah Jenkins', role: 'Senior Trust Officer', email: 'sarah.jenkins@duseat.ae' },
  { id: 'MOD-103', name: 'Khalid Al-Nuaimi', role: 'Head of Trust & Safety', email: 'khalid.nuaimi@duseat.ae' },
]

function ReportsManagementInner() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_moderation_reports_records'

  // Reports State
  const [reports, setReports] = React.useState<ReportItem[]>(initialReports)
  const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<'All' | ReportCategory>('All')
  const [statusFilter, setStatusFilter] = React.useState<'All' | ReportStatus>('All')
  const [moderatorFilter, setModeratorFilter] = React.useState('All')
  const [reporterFilter, setReporterFilter] = React.useState('All')
  const [reportedUserFilter, setReportedUserFilter] = React.useState('All')
  const [dateFilter, setDateFilter] = React.useState('All Time')

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  // Modals & Action States
  const [assignModalReport, setAssignModalReport] = React.useState<ReportItem | null>(null)
  const [resolveModalReport, setResolveModalReport] = React.useState<ReportItem | null>(null)
  const [resolveReason, setResolveReason] = React.useState('Violation confirmed — enforcement action applied.')
  const [escalateModalReport, setEscalateModalReport] = React.useState<ReportItem | null>(null)
  const [escalateDept, setEscalateDept] = React.useState('Legal & Regulatory Compliance')
  const [warnModalReport, setWarnModalReport] = React.useState<ReportItem | null>(null)
  const [warnReason, setWarnReason] = React.useState('Formal warning issued for policy non-compliance.')
  const [suspendModalReport, setSuspendModalReport] = React.useState<ReportItem | null>(null)
  const [suspendDuration, setSuspendDuration] = React.useState('7 days')
  const [banModalReport, setBanModalReport] = React.useState<ReportItem | null>(null)
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null)
  const [videoModalUrl, setVideoModalUrl] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(true)

  // Drawer Tabs: 'overview' | 'evidence' | 'timeline' | 'notes' | 'reply'
  const [drawerTab, setDrawerTab] = React.useState<'overview' | 'evidence' | 'timeline' | 'notes' | 'reply'>('overview')

  // Reply Form in Drawer
  const [replyRecipient, setReplyRecipient] = React.useState<'reporter' | 'reported'>('reporter')
  const [replyMessage, setReplyMessage] = React.useState('')

  // New Internal Note Form
  const [newNoteText, setNewNoteText] = React.useState('')
  const [newNoteCategory, setNewNoteCategory] = React.useState<'Investigation' | 'Legal' | 'Action Log' | 'Risk'>('Investigation')

  // Load from local storage & searchParams
  React.useEffect(() => {
    let currentReports = initialReports
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentReports = parsed
          setReports(parsed)
        }
      }
    } catch {}

    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      const found = currentReports.find((r) => r.id.toLowerCase() === idFromUrl.toLowerCase())
      if (found) {
        setSelectedReportId(found.id)
      } else {
        setSearchQuery(idFromUrl)
      }
    }
  }, [searchParams])

  const saveReports = (newReports: ReportItem[]) => {
    setReports(newReports)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newReports))
    } catch {}
  }

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    notify('Copied', `${id} copied to clipboard.`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Active Report in Drawer
  const activeReport = reports.find((r) => r.id === selectedReportId) || null

  // KPI Calculations
  const totalCount = reports.length
  const pendingCount = reports.filter((r) => r.status === 'pending').length
  const underReviewCount = reports.filter((r) => r.status === 'under_review').length
  const waitingCount = reports.filter((r) => r.status === 'waiting_user').length
  const escalatedCount = reports.filter((r) => r.status === 'escalated').length
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length
  const rejectedCount = reports.filter((r) => r.status === 'rejected').length

  // Filtered Reports
  const filteredReports = React.useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false
      if (moderatorFilter !== 'All') {
        if (moderatorFilter === 'Unassigned' && r.assignedModerator !== null) return false
        if (moderatorFilter !== 'Unassigned' && r.assignedModerator?.name !== moderatorFilter) return false
      }
      if (reporterFilter !== 'All' && r.reporter.name !== reporterFilter) return false
      if (reportedUserFilter !== 'All' && r.reportedUser.name !== reportedUserFilter) return false

      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        r.id.toLowerCase().includes(q) ||
        r.reporter.name.toLowerCase().includes(q) ||
        r.reportedUser.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.relatedRequest?.id && r.relatedRequest.id.toLowerCase().includes(q)) ||
        (r.relatedConversation?.id && r.relatedConversation.id.toLowerCase().includes(q))
      )
    })
  }, [reports, statusFilter, selectedCategory, moderatorFilter, reporterFilter, reportedUserFilter, searchQuery])

  // Pagination Slice
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage) || 1
  const paginatedReports = filteredReports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredReports.map((r) => r.id) : [])
  }

  const handleSelectRow = (reportId: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, reportId] : prev.filter((id) => id !== reportId)))
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setStatusFilter('All')
    setModeratorFilter('All')
    setReporterFilter('All')
    setReportedUserFilter('All')
    setDateFilter('All Time')
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    statusFilter !== 'All' ||
    moderatorFilter !== 'All' ||
    reporterFilter !== 'All' ||
    reportedUserFilter !== 'All' ||
    dateFilter !== 'All Time'

  // Unique Lists
  const uniqueReporters = React.useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.reporter.name)))
  }, [reports])

  const uniqueReportedUsers = React.useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.reportedUser.name)))
  }, [reports])

  // Handlers
  const handleRefreshQueue = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      notify('Queue Synchronized', 'Moderation tickets and surveillance signals updated.')
    }, 600)
  }

  const handleAssignModerator = (reportId: string, mod: typeof MODERATORS_LIST[0]) => {
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: `Assigned to ${mod.name} (${mod.role})`,
          actor: 'Admin Dispatcher',
          actorRole: 'System',
          timestamp: 'Just now',
          type: 'assignment',
        }
        return {
          ...r,
          assignedModerator: mod,
          status: r.status === 'pending' ? ('under_review' as ReportStatus) : r.status,
          timeline: [newTimelineEvent, ...r.timeline],
          lastActivity: 'Just now',
        }
      }
      return r
    })
    saveReports(updated)
    notify('Moderator Assigned', `${mod.name} has been assigned to ${reportId}.`)
    setAssignModalReport(null)
  }

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
          actor: 'Current Admin',
          actorRole: 'Moderator',
          timestamp: 'Just now',
          type: 'review',
        }
        return {
          ...r,
          status: newStatus,
          timeline: [newTimelineEvent, ...r.timeline],
          lastActivity: 'Just now',
        }
      }
      return r
    })
    saveReports(updated)
    notify('Status Updated', `Report ${reportId} is now ${newStatus.replace('_', ' ')}.`)
  }

  const handleResolveReport = () => {
    if (!resolveModalReport) return
    const updated = reports.map((r) => {
      if (r.id === resolveModalReport.id) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: 'Report formally resolved and closed',
          actor: 'Senior Trust Officer',
          actorRole: 'Moderator',
          timestamp: 'Just now',
          note: resolveReason,
          type: 'decision',
        }
        return {
          ...r,
          status: 'resolved' as ReportStatus,
          timeline: [newTimelineEvent, ...r.timeline],
          resolution: {
            decision: 'resolved' as const,
            reason: resolveReason,
            actionTaken: 'Enforcement action applied and parties notified.',
            resolvedBy: 'Senior Trust Officer',
            resolvedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          },
          lastActivity: 'Just now',
        }
      }
      return r
    })
    saveReports(updated)
    notify('Report Resolved', `Case ${resolveModalReport.id} resolved successfully.`)
    setResolveModalReport(null)
  }

  const handleRejectReport = (reportId: string) => {
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: 'Report dismissed after investigation',
          actor: 'Senior Trust Officer',
          actorRole: 'Moderator',
          timestamp: 'Just now',
          type: 'decision',
        }
        return {
          ...r,
          status: 'rejected' as ReportStatus,
          timeline: [newTimelineEvent, ...r.timeline],
          resolution: {
            decision: 'rejected' as const,
            reason: 'No policy violation established upon review.',
            actionTaken: 'Dismissed without penalty.',
            resolvedBy: 'Senior Trust Officer',
            resolvedAt: 'Just now',
          },
          lastActivity: 'Just now',
        }
      }
      return r
    })
    saveReports(updated)
    notify('Report Dismissed', `Case ${reportId} marked as dismissed.`, 'info')
  }

  const handleEscalateReport = () => {
    if (!escalateModalReport) return
    const updated = reports.map((r) => {
      if (r.id === escalateModalReport.id) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: `Escalated to ${escalateDept}`,
          actor: 'Moderation Officer',
          actorRole: 'Moderator',
          timestamp: 'Just now',
          type: 'escalation',
        }
        return {
          ...r,
          status: 'escalated' as ReportStatus,
          priority: 'critical' as const,
          timeline: [newTimelineEvent, ...r.timeline],
          lastActivity: 'Just now',
        }
      }
      return r
    })
    saveReports(updated)
    notify('Report Escalated', `Case ${escalateModalReport.id} escalated to ${escalateDept}.`, 'error')
    setEscalateModalReport(null)
  }

  const handleWarnUser = () => {
    if (!warnModalReport) return
    const updated = reports.map((r) => {
      if (r.id === warnModalReport.id) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: `Official warning issued to ${r.reportedUser.name}`,
          actor: 'Trust Desk',
          actorRole: 'Moderator',
          timestamp: 'Just now',
          note: warnReason,
          type: 'action',
        }
        return {
          ...r,
          reportedUser: {
            ...r.reportedUser,
            accountStatus: 'Warned' as const,
            previousStrikes: r.reportedUser.previousStrikes + 1,
          },
          timeline: [newTimelineEvent, ...r.timeline],
        }
      }
      return r
    })
    saveReports(updated)
    notify('Warning Issued', `Official warning sent to ${warnModalReport.reportedUser.name}. Strike incremented.`, 'info')
    setWarnModalReport(null)
  }

  const handleSuspendUser = () => {
    if (!suspendModalReport) return
    const updated = reports.map((r) => {
      if (r.id === suspendModalReport.id) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: `Account suspended for ${suspendDuration} (${r.reportedUser.name})`,
          actor: 'Head of Trust & Safety',
          actorRole: 'Admin',
          timestamp: 'Just now',
          type: 'action',
        }
        return {
          ...r,
          reportedUser: {
            ...r.reportedUser,
            accountStatus: 'Suspended' as const,
          },
          timeline: [newTimelineEvent, ...r.timeline],
        }
      }
      return r
    })
    saveReports(updated)
    notify('Account Suspended', `User ${suspendModalReport.reportedUser.name} suspended for ${suspendDuration}.`, 'error')
    setSuspendModalReport(null)
  }

  const handleBanUser = () => {
    if (!banModalReport) return
    const updated = reports.map((r) => {
      if (r.id === banModalReport.id) {
        const newTimelineEvent: ReportTimelineEvent = {
          id: `tl-${Date.now()}`,
          event: `Permanent platform ban applied to ${r.reportedUser.name}`,
          actor: 'Head of Trust & Safety',
          actorRole: 'Admin',
          timestamp: 'Just now',
          type: 'action',
        }
        return {
          ...r,
          status: 'resolved' as ReportStatus,
          reportedUser: {
            ...r.reportedUser,
            accountStatus: 'Banned' as const,
          },
          timeline: [newTimelineEvent, ...r.timeline],
        }
      }
      return r
    })
    saveReports(updated)
    notify('User Banned', `User ${banModalReport.reportedUser.name} has been permanently banned from Duseat.`, 'error')
    setBanModalReport(null)
  }

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeReport || !newNoteText.trim()) return

    const newNote: ReportInternalNote = {
      id: `in-${Date.now()}`,
      author: 'Admin Moderator',
      authorRole: 'Compliance Officer',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      text: newNoteText.trim(),
      category: newNoteCategory,
    }

    const updated = reports.map((r) => {
      if (r.id === activeReport.id) {
        return {
          ...r,
          internalNotes: [newNote, ...r.internalNotes],
        }
      }
      return r
    })

    saveReports(updated)
    setNewNoteText('')
    notify('Internal Note Added', 'Private compliance note saved.')
  }

  const handleDeleteNote = (noteId: string) => {
    if (!activeReport) return
    const updated = reports.map((r) => {
      if (r.id === activeReport.id) {
        return {
          ...r,
          internalNotes: r.internalNotes.filter((n) => n.id !== noteId),
        }
      }
      return r
    })
    saveReports(updated)
    notify('Note Removed', 'Internal note deleted.')
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeReport || !replyMessage.trim()) return

    const recipientName = replyRecipient === 'reporter' ? activeReport.reporter.name : activeReport.reportedUser.name
    const newTimelineEvent: ReportTimelineEvent = {
      id: `tl-${Date.now()}`,
      event: `Official communication dispatched to ${replyRecipient.toUpperCase()} (${recipientName})`,
      actor: 'Trust Desk Officer',
      actorRole: 'Moderator',
      timestamp: 'Just now',
      note: replyMessage.trim(),
      type: 'communication',
    }

    const updated = reports.map((r) => {
      if (r.id === activeReport.id) {
        return {
          ...r,
          status: 'waiting_user' as ReportStatus,
          timeline: [newTimelineEvent, ...r.timeline],
          lastActivity: 'Just now',
        }
      }
      return r
    })

    saveReports(updated)
    setReplyMessage('')
    notify('Message Dispatched', `Official communication delivered to ${recipientName}.`)
  }

  const handleExportCSV = () => {
    const headers = ['Report ID', 'Category', 'Status', 'Priority', 'Reporter', 'Reported User', 'Moderator', 'Related Request', 'Related Chat', 'Created At']
    const rows = filteredReports.map((r) => [
      `"${r.id}"`,
      `"${r.category}"`,
      `"${r.status}"`,
      `"${r.priority}"`,
      `"${r.reporter.name} (${r.reporter.userType})"`,
      `"${r.reportedUser.name} (${r.reportedUser.userType})"`,
      `"${r.assignedModerator?.name || 'Unassigned'}"`,
      `"${r.relatedRequest?.id || 'None'}"`,
      `"${r.relatedConversation?.id || 'None'}"`,
      `"${r.createdAt}"`,
    ])
    const csv = headers.join(',') + '\n' + rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `duseat_reports_moderation_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportMenu(false)
    notify('Export Complete', 'Moderation audit CSV downloaded successfully.')
  }

  return (
    <PlatformShell
      title="Reports & Moderation"
      eyebrow="Trust & Safety"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            1. TOP HEADER (Canonical Users Design Standard)
           ========================================================================= */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Reports & Moderation
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Review user reports, investigate evidence, and take moderation actions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 relative">
              {/* Export Dropdown */}
              <Dropdown
                align="end"
                options={[
                  { label: 'Export CSV Ledger', value: 'csv', icon: <FileSpreadsheet className="size-4 text-[#17b26a]" /> },
                  { label: 'Export JSON Audit', value: 'json', icon: <FileText className="size-4 text-[#00c2cb]" /> },
                ]}
                onSelect={(val) => {
                  if (val === 'csv') handleExportCSV()
                  else notify('Export Generated', 'Audit JSON schema ready.')
                }}
                trigger={
                  <button
                    type="button"
                    className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                  >
                    <Download className="size-4 text-[#6f777f]" />
                    <span>Export</span>
                    <ChevronDown className="size-3.5 text-[#6f777f]" />
                  </button>
                }
                ariaLabel="Export options"
              />

              {/* Refresh Queue */}
              <button
                type="button"
                onClick={handleRefreshQueue}
                disabled={isRefreshing}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                title="Synchronize queue"
              >
                <RotateCcw className={cn('size-4 text-[#6f777f]', isRefreshing && 'animate-spin text-[#00c2cb]')} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* 8 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-3">
            <MetricCard
              label="Total Reports"
              value={totalCount}
              tone="neutral"
              active={statusFilter === 'All'}
              onClick={() => setStatusFilter('All')}
            />
            <MetricCard
              label="Pending"
              value={pendingCount}
              tone="warning"
              active={statusFilter === 'pending'}
              onClick={() => setStatusFilter('pending')}
            />
            <MetricCard
              label="Under Review"
              value={underReviewCount}
              tone="info"
              active={statusFilter === 'under_review'}
              onClick={() => setStatusFilter('under_review')}
            />
            <MetricCard
              label="Waiting User"
              value={waitingCount}
              tone="neutral"
              active={statusFilter === 'waiting_user'}
              onClick={() => setStatusFilter('waiting_user')}
            />
            <MetricCard
              label="Escalated"
              value={escalatedCount}
              tone="destructive"
              active={statusFilter === 'escalated'}
              onClick={() => setStatusFilter('escalated')}
            />
            <MetricCard
              label="Resolved"
              value={resolvedCount}
              tone="success"
              active={statusFilter === 'resolved'}
              onClick={() => setStatusFilter('resolved')}
            />
            <MetricCard
              label="Rejected"
              value={rejectedCount}
              tone="destructive"
              active={statusFilter === 'rejected'}
              onClick={() => setStatusFilter('rejected')}
            />
            <MetricCard
              label="Avg Resolution"
              value="4.8h"
              tone="brand"
              subtitle="18m response"
            />
          </div>
        </header>

        {/* =========================================================================
            3. TABLE WORKSPACE (Original GitHub Design: Top Tabs + Horizontal Filter Toolbar + Table)
           ========================================================================= */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          {/* Top Status Tabs & Horizontal Filters Toolbar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                {(
                  [
                    { id: 'All', label: 'All reports', count: totalCount },
                    { id: 'pending', label: 'Pending', count: pendingCount },
                    { id: 'under_review', label: 'Under review', count: underReviewCount },
                    { id: 'waiting_user', label: 'Waiting user', count: waitingCount },
                    { id: 'escalated', label: 'Escalated', count: escalatedCount },
                    { id: 'resolved', label: 'Resolved', count: resolvedCount },
                    { id: 'rejected', label: 'Rejected', count: rejectedCount },
                  ] as const
                ).map((item) => {
                  const isActive = statusFilter === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatusFilter(item.id as ReportStatus | 'All')}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn whitespace-nowrap shrink-0',
                        isActive
                          ? item.id === 'resolved'
                            ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                            : item.id === 'escalated'
                            ? 'bg-[#f04438] text-white shadow-2xs font-semibold'
                            : 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          item.id === 'escalated'
                            ? 'bg-[#f04438] text-white'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {item.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="size-4 text-[#6f777f]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Horizontal Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports, users, IDs, keywords..."
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Violation Category Filter */}
              <Dropdown
                align="start"
                value={selectedCategory}
                onSelect={(val) => setSelectedCategory(val as any)}
                ariaLabel="Filter by Category"
                options={ALL_CATEGORIES.map((cat) => ({
                  label: cat === 'All' ? 'All Categories' : cat,
                  value: cat,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                    <AlertTriangle className="size-4 text-[#6f777f]" />
                    <span>{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Assigned Moderator Filter */}
              <Dropdown
                align="start"
                value={moderatorFilter}
                onSelect={setModeratorFilter}
                ariaLabel="Filter by Moderator"
                options={[
                  { label: 'All Moderators', value: 'All' },
                  { label: 'Unassigned', value: 'Unassigned' },
                  ...MODERATORS_LIST.map((m) => ({ label: m.name, value: m.name })),
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                    <UserCheck className="size-4 text-[#6f777f]" />
                    <span>{moderatorFilter === 'All' ? 'All Moderators' : moderatorFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reporter Filter */}
              <Dropdown
                align="start"
                value={reporterFilter}
                onSelect={setReporterFilter}
                ariaLabel="Filter by Reporter"
                options={[{ label: 'All Reporters', value: 'All' }, ...uniqueReporters.map((rep) => ({ label: rep, value: rep }))]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                    <User className="size-4 text-[#6f777f]" />
                    <span>{reporterFilter === 'All' ? 'All Reporters' : reporterFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reported User Filter */}
              <Dropdown
                align="start"
                value={reportedUserFilter}
                onSelect={setReportedUserFilter}
                ariaLabel="Filter by Reported User"
                options={[{ label: 'All Reported Users', value: 'All' }, ...uniqueReportedUsers.map((u) => ({ label: u, value: u }))]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                    <UserX className="size-4 text-[#6f777f]" />
                    <span>{reportedUserFilter === 'All' ? 'All Reported Users' : reportedUserFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reset Filters Link */}
              {(searchQuery ||
                statusFilter !== 'All' ||
                selectedCategory !== 'All' ||
                moderatorFilter !== 'All' ||
                reporterFilter !== 'All' ||
                reportedUserFilter !== 'All') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Batch Selection Action Bar if items are selected */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-6 py-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-semibold text-[14px] text-[#1f2327]">
                <span>{selectedIds.length} reports selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => notify('Batch Action', `Bulk assigned ${selectedIds.length} tickets to Senior Desk.`)}
                  className="h-[32px] px-3.5 rounded-[8px] bg-[#00c2cb] text-[#1f2327] text-[13px] font-semibold hover:bg-[#00a8b0] cursor-pointer"
                >
                  Assign Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-[13px] text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                >
                  Deselect
                </button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1300px] text-left text-[14px] border-collapse font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                  <th className="w-12 px-4 text-center">
                    <TableCheckbox
                      checked={selectedIds.length === filteredReports.length && filteredReports.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4">Report ID</th>
                  <th className="px-4">Reporter</th>
                  <th className="px-4">Reported User</th>
                  <th className="px-4">Category</th>
                  <th className="px-4 hidden md:table-cell">Related Request</th>
                  <th className="px-4 hidden lg:table-cell">Related Chat</th>
                  <th className="px-4">Assigned Moderator</th>
                  <th className="px-4">Status</th>
                  <th className="px-4 hidden sm:table-cell">Created At</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-[#6f777f]">
                      <div className="mx-auto max-w-sm space-y-2">
                        <ShieldAlert className="size-8 mx-auto text-[#9da4ae]" />
                        <p className="font-bold text-[14px] text-[#1f2327]">No moderation reports found</p>
                        <p className="text-[12px]">Try clearing filters or search queries.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((report) => {
                    const isSelected = selectedIds.includes(report.id)
                    const isActiveInDrawer = selectedReportId === report.id

                    return (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReportId(report.id)}
                        className={cn(
                          'h-[64px] whitespace-nowrap font-sans transition-colors cursor-pointer',
                          isActiveInDrawer
                            ? 'bg-[#e5f6f7]/60'
                            : isSelected
                            ? 'bg-[#eff1f3]/70'
                            : 'hover:bg-[#f8f9fa]'
                        )}
                      >
                        {/* Checkbox */}
                        <td className="w-12 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <TableCheckbox
                            checked={isSelected}
                            onChange={(checked) => handleSelectRow(report.id, checked)}
                          />
                        </td>

                        {/* Report ID */}
                        <td className="px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleCopyId(report.id, e)}
                              className="font-mono text-[13px] font-bold text-[#00c2cb] hover:underline flex items-center gap-1"
                              title="Click to copy Report ID"
                            >
                              <span>{report.id}</span>
                              {copiedId === report.id ? <Check className="size-2.5 text-[#17b26a]" /> : <Copy className="size-2.5" />}
                            </button>
                            {report.priority === 'critical' && (
                              <span className="size-2 rounded-full bg-[#d92d20]" title="Critical Priority" />
                            )}
                          </div>
                        </td>

                        {/* Reporter */}
                        <td className="px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            <Link
                              href={report.reporter.userType === 'Agent' ? `/agents/${report.reporter.id || 'AG-1046'}` : `/investors/${report.reporter.id || 'IN-2048'}`}
                            >
                              <TableAvatar
                                src={report.reporter.avatar}
                                name={report.reporter.name}
                                size="md"
                                variant="subtle"
                              />
                            </Link>
                            <div className="min-w-0">
                              <Link
                                href={report.reporter.userType === 'Agent' ? `/agents/${report.reporter.id || 'AG-1046'}` : `/investors/${report.reporter.id || 'IN-2048'}`}
                                className="font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] hover:underline transition-colors block truncate"
                              >
                                {report.reporter.name}
                              </Link>
                              <span className="text-[12px] leading-[16px] text-[#6f777f] block truncate">{report.reporter.userType}</span>
                            </div>
                          </div>
                        </td>

                        {/* Reported User */}
                        <td className="px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            <Link
                              href={report.reportedUser.userType === 'Agent' ? `/agents/${report.reportedUser.id || 'AG-1046'}` : `/investors/${report.reportedUser.id || 'IN-2048'}`}
                            >
                              <TableAvatar
                                src={report.reportedUser.avatar}
                                name={report.reportedUser.name}
                                size="md"
                                variant="brand"
                              />
                            </Link>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={report.reportedUser.userType === 'Agent' ? `/agents/${report.reportedUser.id || 'AG-1046'}` : `/investors/${report.reportedUser.id || 'IN-2048'}`}
                                  className="font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] hover:underline transition-colors truncate"
                                >
                                  {report.reportedUser.name}
                                </Link>
                                {report.reportedUser.verified && (
                                  <CheckCircle2 className="size-3.5 text-[#00c2cb] shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#6f777f]">
                                <span>{report.reportedUser.userType}</span>
                                {report.reportedUser.previousStrikes > 0 && (
                                  <span className="text-[#d92d20] font-semibold">({report.reportedUser.previousStrikes} strikes)</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">
                            <span>{report.category}</span>
                          </span>
                        </td>

                        {/* Related Request */}
                        <td className="px-4 whitespace-nowrap hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                          {report.relatedRequest ? (
                            <Link
                              href={`/requests?id=${report.relatedRequest.id}`}
                              className="font-mono text-[12px] text-[#00c2cb] hover:underline flex items-center gap-1 font-semibold"
                              title={`Open Request ${report.relatedRequest.id}`}
                            >
                              <span>{report.relatedRequest.id}</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          ) : (
                            <span className="text-[#9da4ae] text-[12px]">—</span>
                          )}
                        </td>

                        {/* Related Chat */}
                        <td className="px-4 whitespace-nowrap hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                          {report.relatedConversation ? (
                            <Link
                              href={`/chats/${report.relatedConversation.id}`}
                              className="font-mono text-[12px] text-[#00c2cb] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>{report.relatedConversation.id}</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          ) : (
                            <span className="text-[#9da4ae] text-[12px]">—</span>
                          )}
                        </td>

                        {/* Assigned Moderator */}
                        <td className="px-4 whitespace-nowrap">
                          {report.assignedModerator ? (
                            <div className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-[#17b26a]" />
                              <span className="text-[13px] font-medium text-[#1f2327]">{report.assignedModerator.name}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setAssignModalReport(report)
                              }}
                              className="rounded-[6px] bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#00c2cb] hover:bg-[#d3d5d7] cursor-pointer"
                            >
                              + Assign
                            </button>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 whitespace-nowrap">
                          <FigmaStatusBadge
                            status={
                              report.status === 'resolved'
                                ? 'Verified'
                                : report.status === 'under_review'
                                ? 'Active'
                                : report.status === 'pending' || report.status === 'waiting_user'
                                ? 'Pending'
                                : report.status === 'escalated'
                                ? 'Rejected'
                                : 'Suspended'
                            }
                          />
                        </td>

                        {/* Created At */}
                        <td className="px-4 whitespace-nowrap hidden sm:table-cell text-[12px] font-sans text-[#6f777f]">
                          {report.createdAt}
                        </td>

                        {/* Actions */}
                        <td className="px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedReportId(report.id)}
                              className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                              title="View details"
                            >
                              <Eye className="size-4" />
                            </button>

                            <Dropdown
                              align="end"
                              floating
                              ariaLabel={`Actions for report ${report.id}`}
                              options={[
                                { label: 'View Details', value: 'view', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                                { label: 'Assign Moderator', value: 'assign', icon: <UserCheck className="size-4 text-[#00c2cb]" /> },
                                { label: 'Escalate to Senior Desk', value: 'escalate', icon: <AlertTriangle className="size-4 text-amber-600" /> },
                                { label: 'Mark as Resolved', value: 'resolve', icon: <CheckCircle2 className="size-4 text-emerald-600" /> },
                                { label: 'Reject Report', value: 'reject', destructive: true, icon: <X className="size-4 text-rose-600" /> },
                              ]}
                              onSelect={(val) => {
                                if (val === 'view') setSelectedReportId(report.id)
                                else if (val === 'assign') setAssignModalReport(report)
                                else if (val === 'escalate') setEscalateModalReport(report)
                                else if (val === 'resolve') setResolveModalReport(report)
                                else if (val === 'reject') handleRejectReport(report.id)
                              }}
                              trigger={
                                <button
                                  type="button"
                                  className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                                  title="More actions"
                                >
                                  <MoreHorizontal className="size-4" />
                                </button>
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - glued to bottom with mt-auto */}
          <div className="p-3 border-t border-[#d3d5d7] bg-[#fcfcfc] mt-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows)
                setCurrentPage(1)
              }}
              totalItems={filteredReports.length}
            />
          </div>
        </section>

        {/* =========================================================================
            6. LARGE RIGHT-SIDE REPORT DETAILS DRAWER (580px - 640px)
           ========================================================================= */}
        {activeReport && (
          <div className="fixed inset-0 z-40 flex justify-end bg-black/45 backdrop-blur-xs ant-fade-in">
            <div className="relative flex h-full w-full max-w-2xl sm:max-w-xl md:max-w-2xl lg:max-w-[620px] flex-col bg-white shadow-2xl border-l border-[#d3d5d7] ant-modal-zoom overflow-hidden">
              {/* Drawer Top Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] p-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-[8px] bg-[#fee4e2] text-[#d92d20] flex items-center justify-center font-bold shrink-0">
                    <ShieldAlert className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[14px] font-bold text-[#1f2327]">{activeReport.id}</span>
                      <span className="rounded bg-[#eff1f3] px-2 py-0.2 text-[10.5px] font-bold text-[#1f2327]">
                        {activeReport.category}
                      </span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.2 text-[10px] font-bold uppercase',
                          activeReport.priority === 'critical' ? 'bg-[#fee4e2] text-[#d92d20]' : 'bg-[#eff1f3] text-[#6f777f]'
                        )}
                      >
                        {activeReport.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6f777f]">Submitted {activeReport.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEscalateModalReport(activeReport)}
                    className="h-[30px] px-2.5 rounded-[5px] border border-[#d92d20] bg-[#fee4e2] text-[#d92d20] text-[11px] font-bold hover:bg-[#fecdca] cursor-pointer"
                  >
                    Escalate
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolveModalReport(activeReport)}
                    className="h-[30px] px-3 rounded-[5px] bg-[#1f2327] text-white text-[11px] font-bold hover:bg-black cursor-pointer shadow-2xs"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReportId(null)}
                    className="size-7.5 rounded-[5px] text-[#6f777f] hover:bg-[#eff1f3] flex items-center justify-center cursor-pointer ml-1"
                    title="Close Details Workspace"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="border-b border-[#d3d5d7] bg-[#f8f9fa] px-3.5 py-2">
                <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none text-[11px]">
                  {(['pending', 'under_review', 'waiting_user', 'escalated', 'resolved'] as ReportStatus[]).map(
                    (st) => {
                      const isCurrent = activeReport.status === st
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(activeReport.id, st)}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] font-bold transition-all cursor-pointer shrink-0',
                            isCurrent
                              ? st === 'resolved'
                                ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                                : st === 'escalated'
                                ? 'bg-[#f04438] text-white shadow-2xs font-semibold'
                                : 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                              : 'bg-white border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3]'
                          )}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          <span className="capitalize">{st.replace('_', ' ')}</span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Drawer Navigation Tabs */}
              <div className="flex border-b border-[#d3d5d7] bg-white px-3.5">
                {(['overview', 'evidence', 'timeline', 'notes', 'reply'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDrawerTab(tab)}
                    className={cn(
                      'py-2.5 px-3 font-bold text-[12px] border-b-2 transition-colors cursor-pointer capitalize flex items-center gap-1.5',
                      drawerTab === tab
                        ? 'border-[#00c2cb] text-[#00848b]'
                        : 'border-transparent text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    <span>{tab}</span>
                    {tab === 'evidence' && activeReport.evidence.length > 0 && (
                      <span className="rounded-full bg-[#eff1f3] px-1.5 py-0.2 text-[9.5px] text-[#1f2327]">
                        {activeReport.evidence.length}
                      </span>
                    )}
                    {tab === 'notes' && activeReport.internalNotes.length > 0 && (
                      <span className="rounded-full bg-[#eff1f3] px-1.5 py-0.2 text-[9.5px] text-[#1f2327]">
                        {activeReport.internalNotes.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Drawer Main Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans scrollbar-thin">
                {/* ================= TAB 1: OVERVIEW ================= */}
                {drawerTab === 'overview' && (
                  <div className="space-y-3.5">
                    {/* Reporter & Reported User Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Reporter Card */}
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold text-[#6f777f] uppercase">Reporter</span>
                          <span className="rounded bg-[#eff1f3] px-1.5 py-0.2 text-[9.5px] font-bold text-[#1f2327]">
                            {activeReport.reporter.userType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={activeReport.reporter.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                            alt=""
                            className="size-9 rounded-full object-cover border border-[#d3d5d7]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[12.5px] text-[#1f2327] truncate">{activeReport.reporter.name}</p>
                            <p className="text-[11px] text-[#6f777f] truncate">{activeReport.reporter.email}</p>
                            <p className="text-[10.5px] text-[#6f777f] font-mono">{activeReport.reporter.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Reported User Card */}
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold text-[#d92d20] uppercase">Reported Party</span>
                          <span className="rounded bg-[#fee4e2] px-1.5 py-0.2 text-[9.5px] font-bold text-[#d92d20]">
                            {activeReport.reportedUser.accountStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={activeReport.reportedUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                            alt=""
                            className="size-9 rounded-full object-cover border border-[#d3d5d7]"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <p className="font-bold text-[12.5px] text-[#1f2327] truncate">{activeReport.reportedUser.name}</p>
                              {activeReport.reportedUser.verified && (
                                <CheckCircle2 className="size-3 text-[#00c2cb]" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#6f777f] truncate">{activeReport.reportedUser.agency || activeReport.reportedUser.email}</p>
                            <div className="flex items-center gap-2 text-[10.5px] font-semibold mt-0.5">
                              <span className="text-[#d92d20]">Risk: {activeReport.reportedUser.riskScore}/100</span>
                              <span>•</span>
                              <span>Strikes: {activeReport.reportedUser.previousStrikes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Complaint Description Card */}
                    <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-3.5 space-y-1.5">
                      <span className="text-[10.5px] font-bold text-[#6f777f] uppercase">Complaint Narrative</span>
                      <p className="text-[12.5px] text-[#1f2327] leading-relaxed whitespace-pre-wrap">
                        {activeReport.description}
                      </p>
                    </div>

                    {/* Related Context Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Related Request */}
                      {activeReport.relatedRequest ? (
                        <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-[#6f777f] uppercase">Related Request</span>
                            <Link
                              href="/requests"
                              className="text-[10.5px] font-bold text-[#00c2cb] hover:underline flex items-center gap-0.5"
                            >
                              <span>View</span>
                              <ChevronRight className="size-3" />
                            </Link>
                          </div>
                          <p className="font-mono text-[11.5px] font-bold text-[#1f2327]">{activeReport.relatedRequest.id}</p>
                          <p className="font-bold text-[12px] text-[#1f2327]">{activeReport.relatedRequest.title}</p>
                          <p className="text-[11px] text-[#00c2cb] font-bold">{activeReport.relatedRequest.budget}</p>
                        </div>
                      ) : null}

                      {/* Related Conversation */}
                      {activeReport.relatedConversation ? (
                        <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-[#6f777f] uppercase">Related Conversation</span>
                            <Link
                              href={`/chats/${activeReport.relatedConversation.id}`}
                              className="text-[10.5px] font-bold text-[#00c2cb] hover:underline flex items-center gap-0.5"
                            >
                              <span>Open Live Chat</span>
                              <ChevronRight className="size-3" />
                            </Link>
                          </div>
                          <p className="font-mono text-[11.5px] font-bold text-[#1f2327]">{activeReport.relatedConversation.id}</p>
                          <p className="text-[11.5px] text-[#1f2327] font-medium truncate">{activeReport.relatedConversation.context}</p>
                          <p className="text-[10.5px] text-[#6f777f] italic line-clamp-1">"{activeReport.relatedConversation.lastMessage}"</p>
                        </div>
                      ) : null}
                    </div>

                    {/* Related Property (if available) */}
                    {activeReport.relatedProperty && (
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1">
                        <span className="text-[10.5px] font-bold text-[#6f777f] uppercase">Related Property</span>
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="font-bold text-[#1f2327]">{activeReport.relatedProperty.title}</span>
                          <span className="font-bold text-[#00c2cb]">{activeReport.relatedProperty.price}</span>
                        </div>
                        <p className="text-[11px] text-[#6f777f]">{activeReport.relatedProperty.location}</p>
                      </div>
                    )}

                    {/* Resolution Summary if already resolved */}
                    {activeReport.resolution && (
                      <div className="rounded-[8px] border border-[#17b26a] bg-[#f6fef9] p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[#027a48] font-bold text-[12px]">
                          <CheckCircle2 className="size-4" />
                          <span>Formal Resolution Record</span>
                        </div>
                        <p className="text-[12px] text-[#1f2327]">{activeReport.resolution.reason}</p>
                        <p className="text-[11px] text-[#6f777f]">
                          Enforced by {activeReport.resolution.resolvedBy} on {activeReport.resolution.resolvedAt}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= TAB 2: EVIDENCE ================= */}
                {drawerTab === 'evidence' && (
                  <div className="space-y-3">
                    {activeReport.evidence.length === 0 ? (
                      <div className="p-8 text-center text-[#6f777f] space-y-1">
                        <p className="font-bold text-[13px] text-[#1f2327]">No evidence items attached</p>
                        <p className="text-[11.5px]">Use the reply tab to request screenshots or documentation from the reporter.</p>
                      </div>
                    ) : (
                      activeReport.evidence.map((ev) => (
                        <div key={ev.id} className="rounded-[8px] border border-[#d3d5d7] bg-white p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-[#eff1f3] px-2 py-0.5 text-[10px] font-bold uppercase text-[#1f2327]">
                                {ev.type}
                              </span>
                              <span className="font-bold text-[12px] text-[#1f2327]">{ev.title}</span>
                            </div>
                            {ev.timestamp && <span className="font-mono text-[10px] text-[#6f777f]">{ev.timestamp}</span>}
                          </div>

                          {/* Image Evidence */}
                          {ev.type === 'image' && ev.url && (
                            <div
                              onClick={() => setLightboxImage(ev.url!)}
                              className="overflow-hidden rounded-[6px] border border-black/10 cursor-pointer max-w-sm"
                            >
                              <img src={ev.url} alt="" className="h-40 w-full object-cover hover:scale-102 transition-transform" />
                            </div>
                          )}

                          {/* Document Evidence */}
                          {ev.type === 'document' && (
                            <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#fcfcfc] border border-[#d3d5d7]">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="size-4 text-[#d92d20] shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-bold text-[12px] truncate">{ev.title}</p>
                                  <p className="text-[10px] text-[#6f777f]">{ev.size || 'PDF Document'}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => notify('Downloading File', `Downloading ${ev.title}…`)}
                                className="flex size-7 items-center justify-center rounded-[5px] bg-white border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]"
                              >
                                <Download className="size-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Reported Message Snippet */}
                          {ev.type === 'message' && ev.messageData && (
                            <div className="rounded-[6px] bg-[#fef3f2] border border-[#d92d20]/30 p-2.5 space-y-1">
                              <div className="flex justify-between text-[10.5px] text-[#d92d20] font-bold">
                                <span>{ev.messageData.sender} ({ev.messageData.senderRole})</span>
                                <span className="font-mono">{ev.messageData.time}</span>
                              </div>
                              <p className="text-[12px] text-[#1f2327] font-medium leading-snug">
                                "{ev.messageData.text}"
                              </p>
                              <span className="text-[9.5px] text-[#6f777f] block font-mono">{ev.messageData.context}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ================= TAB 3: TIMELINE ================= */}
                {drawerTab === 'timeline' && (
                  <div className="space-y-3 pt-1">
                    {activeReport.timeline.map((ev) => (
                      <div key={ev.id} className="relative pl-4 pb-2 border-l-2 border-[#00c2cb]/40 last:border-l-0 space-y-0.5">
                        <span className="absolute -left-[5px] top-0.5 size-2 rounded-full bg-[#00c2cb]" />
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-[12px] text-[#1f2327]">{ev.event}</p>
                          <span className="font-mono text-[10px] text-[#6f777f]">{ev.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#6f777f]">Actor: <span className="font-semibold text-[#1f2327]">{ev.actor}</span> ({ev.actorRole})</p>
                        {ev.note && <p className="text-[11.5px] text-[#1f2327] bg-[#fcfcfc] p-2 rounded border border-[#d3d5d7] mt-1">{ev.note}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= TAB 4: INTERNAL NOTES ================= */}
                {drawerTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="rounded-[6px] bg-[#fef7ee] border border-[#f79009]/40 p-2 text-[11px] text-[#b54708] font-bold flex items-center gap-1.5">
                      <Lock className="size-3.5" />
                      <span>Internal Notes — Confidential & not visible to users</span>
                    </div>

                    {/* Add Note Form */}
                    <form onSubmit={handleAddInternalNote} className="space-y-2">
                      <textarea
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Add private moderator note…"
                        className="w-full h-18 p-2.5 rounded-[6px] border border-[#d3d5d7] text-[12px] outline-none focus:border-[#00c2cb] resize-none font-sans"
                      />
                      <div className="flex justify-between items-center">
                        <select
                          value={newNoteCategory}
                          onChange={(e) => setNewNoteCategory(e.target.value as any)}
                          className="h-[28px] px-2 rounded-[5px] border border-[#d3d5d7] text-[11px] outline-none"
                        >
                          <option value="Investigation">Investigation</option>
                          <option value="Legal">Legal</option>
                          <option value="Action Log">Action Log</option>
                          <option value="Risk">Risk</option>
                        </select>
                        <button
                          type="submit"
                          disabled={!newNoteText.trim()}
                          className="h-[28px] px-3.5 rounded-[5px] bg-[#1f2327] text-white text-[11px] font-bold hover:bg-black disabled:opacity-40 cursor-pointer"
                        >
                          Save Note
                        </button>
                      </div>
                    </form>

                    {/* Notes Feed */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pt-1">
                      {activeReport.internalNotes.map((note) => (
                        <div key={note.id} className="rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] p-2.5 space-y-1 group">
                          <div className="flex justify-between items-center text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#1f2327]">{note.author}</span>
                              <span className="rounded bg-[#eff1f3] px-1 py-0.2 text-[9.5px] font-bold text-[#6f777f]">
                                {note.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9.5px] text-[#6f777f]">{note.date}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 text-[#d92d20] hover:text-[#b42318] cursor-pointer"
                                title="Delete note"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11.5px] text-[#1f2327] leading-snug">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= TAB 5: SEND REPLY ================= */}
                {drawerTab === 'reply' && (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#6f777f]">Recipient</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyRecipient('reporter')}
                          className={cn(
                            'flex-1 h-[32px] rounded-[6px] text-[11.5px] font-bold border transition-colors cursor-pointer',
                            replyRecipient === 'reporter'
                              ? 'border-[#00c2cb] bg-[#e5f6f7] text-[#00848b]'
                              : 'border-[#d3d5d7] bg-white text-[#6f777f]'
                          )}
                        >
                          Reporter ({activeReport.reporter.name})
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyRecipient('reported')}
                          className={cn(
                            'flex-1 h-[32px] rounded-[6px] text-[11.5px] font-bold border transition-colors cursor-pointer',
                            replyRecipient === 'reported'
                              ? 'border-[#00c2cb] bg-[#e5f6f7] text-[#00848b]'
                              : 'border-[#d3d5d7] bg-white text-[#6f777f]'
                          )}
                        >
                          Reported ({activeReport.reportedUser.name})
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#6f777f]">Official Message Body</label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={`Type official communication to ${replyRecipient === 'reporter' ? activeReport.reporter.name : activeReport.reportedUser.name}…`}
                        className="w-full h-28 p-3 rounded-[6px] border border-[#d3d5d7] text-[12px] outline-none focus:border-[#00c2cb] resize-none font-sans"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button
                        type="button"
                        onClick={() => notify('Attachment', 'Attach compliance notice PDF…')}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                      >
                        <Paperclip className="size-3.5" />
                        <span>Attach Document</span>
                      </button>

                      <button
                        type="submit"
                        disabled={!replyMessage.trim()}
                        className="flex h-[32px] items-center gap-1.5 rounded-[6px] bg-[#1f2327] px-4 text-[11.5px] font-bold text-white hover:bg-black disabled:opacity-40 cursor-pointer shadow-2xs"
                      >
                        <span>Send Official Message</span>
                        <Send className="size-3" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Sticky Bottom Moderator Action Bar */}
              <div className="shrink-0 border-t border-[#d3d5d7] bg-[#fcfcfc] p-3 flex items-center justify-between gap-2 flex-wrap">
                {/* Secondary Actions (Left) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setWarnModalReport(activeReport)}
                    className="h-[28px] px-2.5 rounded-[5px] border border-[#d3d5d7] bg-white text-[11px] font-bold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shadow-2xs"
                  >
                    Warn User
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectReport(activeReport.id)}
                    className="h-[28px] px-2.5 rounded-[5px] border border-[#d3d5d7] bg-white text-[11px] font-bold text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer shadow-2xs"
                  >
                    Dismiss
                  </button>
                </div>

                {/* High-Risk Actions (Right) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSuspendModalReport(activeReport)}
                    className="h-[28px] px-2.5 rounded-[5px] border border-[#d92d20] bg-white text-[11px] font-bold text-[#d92d20] hover:bg-[#fee4e2] cursor-pointer shadow-2xs"
                  >
                    Suspend User
                  </button>
                  <button
                    type="button"
                    onClick={() => setBanModalReport(activeReport)}
                    className="h-[28px] px-2.5 rounded-[5px] bg-[#d92d20] text-white text-[11px] font-bold hover:bg-[#b42318] cursor-pointer shadow-2xs"
                  >
                    Ban User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            7. INTERACTIVE ACTION CONFIRMATION MODALS
           ========================================================================= */}

        {/* 1. Assign Moderator Modal */}
        {assignModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#1f2327]">Assign Moderator to {assignModalReport.id}</h3>
                <button type="button" onClick={() => setAssignModalReport(null)} className="text-[#6f777f]">
                  <X className="size-4" />
                </button>
              </div>
              <p className="text-[12.5px] text-[#6f777f]">
                Select a trust & safety officer to investigate and adjudicate this report.
              </p>
              <div className="space-y-2">
                {MODERATORS_LIST.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleAssignModerator(assignModalReport.id, mod)}
                    className="w-full flex items-center justify-between p-2.5 rounded-[6px] border border-[#d3d5d7] hover:border-[#00c2cb] hover:bg-[#e5f6f7]/40 transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-[12.5px] text-[#1f2327]">{mod.name}</p>
                      <p className="text-[11px] text-[#6f777f]">{mod.role}</p>
                    </div>
                    <ChevronRight className="size-4 text-[#6f777f]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Resolve Report Modal */}
        {resolveModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
              <div className="flex items-center gap-2 text-[#00c2cb]">
                <CheckCircle2 className="size-5" />
                <h3 className="text-[15px] font-bold text-[#1f2327]">Resolve Report {resolveModalReport.id}</h3>
              </div>
              <p className="text-[12.5px] text-[#6f777f]">
                Record the final moderation outcome and enforcement action taken for audit archives.
              </p>
              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-[#6f777f]">Resolution Statement</label>
                <textarea
                  value={resolveReason}
                  onChange={(e) => setResolveReason(e.target.value)}
                  className="w-full h-20 p-2.5 rounded-[6px] border border-[#d3d5d7] text-[12.5px] outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setResolveModalReport(null)}
                  className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12px] font-bold text-[#1f2327]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResolveReport}
                  className="h-[34px] px-4 rounded-[6px] bg-[#1f2327] text-white text-[12px] font-bold hover:bg-black"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Escalate Modal */}
        {escalateModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
              <div className="flex items-center gap-2 text-[#d92d20]">
                <AlertTriangle className="size-5" />
                <h3 className="text-[15px] font-bold text-[#1f2327]">Escalate Report {escalateModalReport.id}</h3>
              </div>
              <p className="text-[12.5px] text-[#6f777f]">
                Escalating this case immediately triggers senior review and legal consultation.
              </p>
              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-[#6f777f]">Target Department</label>
                <select
                  value={escalateDept}
                  onChange={(e) => setEscalateDept(e.target.value)}
                  className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12.5px] outline-none"
                >
                  <option value="Legal & Regulatory Compliance">Legal & Regulatory Compliance</option>
                  <option value="Executive Trust & Safety Committee">Executive Trust & Safety Committee</option>
                  <option value="Escrow & Financial Fraud Unit">Escrow & Financial Fraud Unit</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEscalateModalReport(null)}
                  className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12px] font-bold text-[#1f2327]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEscalateReport}
                  className="h-[34px] px-4 rounded-[6px] bg-[#d92d20] text-white text-[12px] font-bold hover:bg-[#b42318]"
                >
                  Confirm Escalation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Warn User Modal */}
        {warnModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
              <div className="flex items-center gap-2 text-[#f79009]">
                <AlertOctagon className="size-5" />
                <h3 className="text-[15px] font-bold text-[#1f2327]">Issue Formal Warning</h3>
              </div>
              <p className="text-[12.5px] text-[#6f777f]">
                Issuing a formal warning increments the user's strike counter to{' '}
                <strong>{warnModalReport.reportedUser.previousStrikes + 1}</strong>.
              </p>
              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-[#6f777f]">Warning Notice Content</label>
                <textarea
                  value={warnReason}
                  onChange={(e) => setWarnReason(e.target.value)}
                  className="w-full h-20 p-2.5 rounded-[6px] border border-[#d3d5d7] text-[12.5px] outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWarnModalReport(null)}
                  className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12px] font-bold text-[#1f2327]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleWarnUser}
                  className="h-[34px] px-4 rounded-[6px] bg-[#f79009] text-white text-[12px] font-bold hover:bg-[#dc6803]"
                >
                  Issue Warning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Suspend User Modal */}
        {suspendModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
              <div className="flex items-center gap-2 text-[#d92d20]">
                <UserX className="size-5" />
                <h3 className="text-[15px] font-bold text-[#1f2327]">
                  Suspend {suspendModalReport.reportedUser.name}?
                </h3>
              </div>
              <p className="text-[12.5px] text-[#6f777f]">
                Temporarily suspends all marketplace activity, chat permissions, and active listings for this user.
              </p>
              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-[#6f777f]">Suspension Duration</label>
                <select
                  value={suspendDuration}
                  onChange={(e) => setSuspendDuration(e.target.value)}
                  className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12.5px] outline-none"
                >
                  <option value="24 hours">24 hours</option>
                  <option value="7 days">7 days</option>
                  <option value="30 days">30 days</option>
                  <option value="Indefinite (Pending Review)">Indefinite (Pending Review)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSuspendModalReport(null)}
                  className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12px] font-bold text-[#1f2327]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSuspendUser}
                  className="h-[34px] px-4 rounded-[6px] bg-[#d92d20] text-white text-[12px] font-bold hover:bg-[#b42318]"
                >
                  Confirm Suspension
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Ban User Modal */}
        {banModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-3.5 ant-modal-zoom">
              <div className="flex items-center gap-2 text-[#d92d20]">
                <UserX className="size-5" />
                <h3 className="text-[15px] font-bold text-[#1f2327]">
                  Permanently Ban {banModalReport.reportedUser.name}?
                </h3>
              </div>
              <p className="text-[12.5px] text-[#6f777f] leading-relaxed">
                This is a critical destructive action. The user will be immediately logged out, blacklisted from re-registration, and all active listings and proposals will be revoked.
              </p>
              <div className="p-2.5 rounded-[6px] bg-[#fef3f2] border border-[#d92d20]/30 text-[11.5px] text-[#b42318]">
                <strong>Warning:</strong> Ban confirmation will be logged in the permanent compliance audit ledger.
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBanModalReport(null)}
                  className="h-[34px] px-3.5 rounded-[6px] border border-[#d3d5d7] bg-white text-[12px] font-bold text-[#1f2327]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBanUser}
                  className="h-[34px] px-4 rounded-[6px] bg-[#d92d20] text-white text-[12px] font-bold hover:bg-[#b42318]"
                >
                  Permanently Ban User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Lightbox Image Viewer */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs cursor-pointer ant-fade-in"
          >
            <img src={lightboxImage} alt="" className="max-h-[85vh] max-w-[85vw] rounded-[8px] object-contain shadow-2xl" />
          </div>
        )}
      </div>
    </PlatformShell>
  )
}

export function ReportsManagement() {
  return (
    <React.Suspense fallback={null}>
      <ReportsManagementInner />
    </React.Suspense>
  )
}
