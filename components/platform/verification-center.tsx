'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  FileText,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Download,
  Plus,
  Pin,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowUpDown,
  History,
  MessageSquare,
  Check,
  X,
  SlidersHorizontal,
  MoreHorizontal,
  ExternalLink,
  Settings2,
  UserCheck,
  UserX,
  Copy,
  TrendingUp,
  TrendingDown,
  Send,
  Trash2,
  Edit2,
  HelpCircle,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import {
  Flag,
  getCountryCode,
  AvatarFlagOverlay,
  Tag,
  StatusTag,
  TableCheckbox,
  TableAvatar,
  FigmaStatusBadge,
  CountBadge,
  NavigationTabs,
  StatusFilterTabs,
  SearchInput,
  FilterChip,
  FilterChipGroup,
  MetricCard,
  Pagination,
  EmptyState,
} from '@/components/ui'
import { DateRangePicker } from './date-range-picker'
import { cn } from '@/lib/utils'
import {
  initialVerificationCases,
  initialVerificationHistory,
  initialVerificationNotes,
  availableReviewers,
  type VerificationCase,
  type VerificationQueueStatus,
  type VerificationUserRole,
  type VerificationDocumentItem,
  type VerificationHistoryEvent,
  type VerificationNote,
  type ReviewerUser,
  getStoredVerificationCases,
  saveStoredVerificationCases,
  getStoredVerificationHistory,
  saveStoredVerificationHistory,
  getStoredVerificationNotes,
  saveStoredVerificationNotes,
} from '@/lib/verification-data'
import { VerificationDocInspectorModal } from './verification-doc-inspector-modal'
import { AssignReviewerModal } from './assign-reviewer-modal'
import { ApproveVerificationModal } from './approve-verification-modal'
import { RejectVerificationModal } from './reject-verification-modal'
import { RequestResubmissionModal } from './request-resubmission-modal'
import { RequestDocUpdateModal } from './request-doc-update-modal'
import { AddVerificationNoteModal } from './add-verification-note-modal'

type MainTab = 'queue' | 'expired' | 'history' | 'notes'
type StatusFilter = 'All' | 'pending' | 'approved' | 'rejected' | 'expired' | 'resubmitted'

export function VerificationCenterInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Master Data State
  const [cases, setCases] = React.useState<VerificationCase[]>([])
  const [history, setHistory] = React.useState<VerificationHistoryEvent[]>([])
  const [notes, setNotes] = React.useState<VerificationNote[]>([])
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Navigation & URL sync
  const initialTab = (searchParams.get('tab') as MainTab) || 'queue'
  const [activeTab, setActiveTab] = React.useState<MainTab>(initialTab)
  const statusParam = (searchParams.get('status')?.toLowerCase() as StatusFilter) || 'All'
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(statusParam)

  // Filters
  const [query, setQuery] = React.useState(searchParams.get('q') || '')
  const [userTypeFilter, setUserTypeFilter] = React.useState<'All' | 'Investor' | 'Agent'>(
    (searchParams.get('userType') as any) || 'All'
  )
  const [verificationTypeFilter, setVerificationTypeFilter] = React.useState<string>('All types')
  const [reviewerFilter, setReviewerFilter] = React.useState<string>('All reviewers')
  const [countryFilter, setCountryFilter] = React.useState('All countries')
  const [docTypeFilter, setDocTypeFilter] = React.useState('All documents')
  const [dateRange, setDateRange] = React.useState('All Time')

  // Sorting & Pagination
  const [sortField, setSortField] = React.useState<'submitted' | 'updated' | 'expiry' | 'name'>('submitted')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [showFilters, setShowFilters] = React.useState(true)

  // Modals state
  const [inspectDocData, setInspectDocData] = React.useState<{
    documents: VerificationDocumentItem[]
    initialDocId?: string
    name: string
    role: VerificationUserRole
    country?: string
  } | null>(null)

  const [assignModalData, setAssignModalData] = React.useState<{
    caseItem?: VerificationCase
    casesCount?: number
    isBulk?: boolean
  } | null>(null)

  const [approveModalCase, setApproveModalCase] = React.useState<VerificationCase | null>(null)
  const [rejectModalCase, setRejectModalCase] = React.useState<VerificationCase | null>(null)
  const [resubmitModalCase, setResubmitModalCase] = React.useState<VerificationCase | null>(null)
  const [requestUpdateDoc, setRequestUpdateDoc] = React.useState<{
    caseItem: VerificationCase
    document: VerificationDocumentItem
  } | null>(null)
  const [noteTargetCase, setNoteTargetCase] = React.useState<VerificationCase | null>(null)
  const [editingNote, setEditingNote] = React.useState<VerificationNote | null>(null)
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)

  // Load data from localStorage on mount
  React.useEffect(() => {
    setCases(getStoredVerificationCases())
    setHistory(getStoredVerificationHistory())
    setNotes(getStoredVerificationNotes())
  }, [])

  // Sync statusParam with state if URL changes
  React.useEffect(() => {
    const p = (searchParams.get('status')?.toLowerCase() as StatusFilter) || 'All'
    setStatusFilter(p)
  }, [searchParams])

  const saveCases = (newCases: VerificationCase[]) => {
    setCases(newCases)
    saveStoredVerificationCases(newCases)
  }

  const saveHistory = (newHistory: VerificationHistoryEvent[]) => {
    setHistory(newHistory)
    saveStoredVerificationHistory(newHistory)
  }

  const saveNotes = (newNotes: VerificationNote[]) => {
    setNotes(newNotes)
    saveStoredVerificationNotes(newNotes)
  }

  // Header Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const refreshed = getStoredVerificationCases()
      setCases(refreshed)
      setIsRefreshing(false)
      toast({
        variant: 'success',
        title: 'Verification queue updated',
        description: 'Loaded latest KYC verification cases and status updates.',
      })
    }, 600)
  }

  // KPI Card click interaction -> updates URL and filter
  const handleKpiClick = (status: StatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(1)
    if (status === 'All') {
      router.push('/verification')
    } else {
      router.push(`/verification?status=${status}`)
    }
  }

  // Copy Verification ID
  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    toast({
      variant: 'success',
      title: 'Verification ID copied',
      description: `${id} copied to clipboard.`,
    })
  }

  // Export CSV respecting active filters
  const handleExportCsv = () => {
    const headers = [
      'Verification ID',
      'User ID',
      'Applicant Name',
      'User Type',
      'Verification Status',
      'Email',
      'Phone',
      'Country',
      'Risk Score',
      'Reviewer',
      'Submitted At',
      'Documents Count',
    ]
    const rows = filteredCases.map((c) => [
      c.id,
      c.userId,
      `"${c.applicantName}"`,
      c.role,
      c.status,
      c.applicantEmail,
      `"${c.applicantPhone}"`,
      `"${c.country}"`,
      c.riskScore,
      `"${c.assignedReviewer?.name || 'Unassigned'}"`,
      `"${c.submittedDateExact || c.submittedAt}"`,
      c.documents.length,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `duseat_verification_report_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      variant: 'success',
      title: 'Verification report exported successfully',
      description: `Exported ${filteredCases.length} records matching current filters.`,
    })
  }

  // Bulk Actions
  const handleBulkApprove = () => {
    const selectedCases = cases.filter((c) => selectedIds.includes(c.id))
    const eligible = selectedCases.filter((c) => c.documents.every((d) => d.status === 'Verified'))
    const ineligible = selectedCases.filter((c) => !c.documents.every((d) => d.status === 'Verified'))

    if (eligible.length === 0) {
      toast({
        variant: 'error',
        title: 'Unable to approve verifications',
        description: 'Selected cases have incomplete or unverified documents.',
      })
      return
    }

    setConfirmDialog({
      title: `Approve ${eligible.length} eligible verifications?`,
      description:
        ineligible.length > 0
          ? `${eligible.length} cases meet all verification requirements. ${ineligible.length} cases require manual document review and will be skipped.`
          : `Are you sure you want to approve all ${eligible.length} selected verification requests?`,
      confirmLabel: `Approve ${eligible.length} Verifications`,
      tone: 'brand',
      icon: 'warning',
      onConfirm: () => {
        const eligibleIds = eligible.map((c) => c.id)
        const updated = cases.map((c) =>
          eligibleIds.includes(c.id)
            ? {
                ...c,
                status: 'Approved' as const,
                lastUpdatedAt: 'Just now',
                documents: c.documents.map((d) => ({ ...d, status: 'Verified' as const })),
              }
            : c
        )
        saveCases(updated)
        setSelectedIds([])

        toast({
          variant: 'success',
          title: `${eligible.length} verifications approved successfully`,
          description: ineligible.length > 0 ? `${eligible.length} approved, ${ineligible.length} require manual review` : undefined,
        })
      },
    })
  }

  const handleBulkAssign = () => {
    setAssignModalData({ casesCount: selectedIds.length, isBulk: true })
  }

  const handleBulkAssignConfirm = (reviewer: ReviewerUser | null) => {
    const updated = cases.map((c) =>
      selectedIds.includes(c.id)
        ? {
            ...c,
            assignedReviewer: reviewer
              ? {
                  name: reviewer.name,
                  avatar: reviewer.avatar,
                  role: reviewer.role,
                  email: reviewer.email,
                }
              : undefined,
            lastUpdatedAt: 'Just now',
          }
        : c
    )
    saveCases(updated)
    setSelectedIds([])
    toast({
      variant: 'success',
      title: reviewer ? `Verifications assigned to ${reviewer.name}` : 'Reviewers unassigned',
      description: `Updated assignment for ${selectedIds.length} verification cases.`,
    })
  }

  // Single Case Status Updates
  const handleApproveCaseConfirm = (caseItem: VerificationCase) => {
    const updated = cases.map((c) =>
      c.id === caseItem.id
        ? {
            ...c,
            status: 'Approved' as const,
            lastUpdatedAt: 'Just now',
            documents: c.documents.map((d) => ({ ...d, status: 'Verified' as const })),
          }
        : c
    )
    saveCases(updated)

    const newEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: caseItem.id,
      targetName: caseItem.applicantName,
      targetRole: caseItem.role,
      action: 'Case Approved',
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Verification approved. Issued platform badge.`,
      statusFrom: caseItem.status,
      statusTo: 'Approved',
    }
    saveHistory([newEvt, ...history])

    toast({
      variant: 'success',
      title: 'Verification approved successfully',
      description: `Case ${caseItem.id} approved for ${caseItem.applicantName}.`,
      actionLabel: 'View User',
      actionRoute: `/users/${caseItem.userId}`,
    })
  }

  const handleRejectCaseConfirm = (caseItem: VerificationCase, reason: string, notesText: string) => {
    const updated = cases.map((c) =>
      c.id === caseItem.id
        ? {
            ...c,
            status: 'Rejected' as const,
            lastUpdatedAt: 'Just now',
            rejectionReason: reason,
            rejectionNotes: notesText,
          }
        : c
    )
    saveCases(updated)

    const newEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: caseItem.id,
      targetName: caseItem.applicantName,
      targetRole: caseItem.role,
      action: 'Case Rejected',
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Verification rejected: ${reason}. Notes: ${notesText}`,
      statusFrom: caseItem.status,
      statusTo: 'Rejected',
      reason,
    }
    saveHistory([newEvt, ...history])

    toast({
      variant: 'error',
      title: 'Verification rejected',
      description: `Case ${caseItem.id} marked as Rejected.`,
      actionLabel: 'View Details',
      actionRoute: `/verification/${caseItem.id}`,
    })
  }

  const handleResubmitCaseConfirm = (
    caseItem: VerificationCase,
    requirements: string[],
    reason: string,
    message: string
  ) => {
    const updatedDocs = caseItem.documents.map((d) =>
      requirements.includes(d.type)
        ? {
            ...d,
            status: 'Resubmission Required' as const,
            rejectionReason: reason,
            reviewNotes: message,
          }
        : d
    )
    const updated = cases.map((c) =>
      c.id === caseItem.id
        ? {
            ...c,
            status: 'Resubmitted' as const,
            lastUpdatedAt: 'Just now',
            resubmissionItems: requirements,
            documents: updatedDocs,
          }
        : c
    )
    saveCases(updated)

    const newEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: caseItem.id,
      targetName: caseItem.applicantName,
      targetRole: caseItem.role,
      action: 'Resubmission Requested',
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Requested re-upload of [${requirements.join(', ')}]. Reason: ${reason}`,
      statusFrom: caseItem.status,
      statusTo: 'Resubmitted',
      reason,
      notes: message,
    }
    saveHistory([newEvt, ...history])

    toast({
      variant: 'info',
      title: 'Resubmission request sent successfully',
      description: `Applicant instructed to replace ${requirements.join(', ')}.`,
      actionLabel: 'View Details',
      actionRoute: `/verification/${caseItem.id}`,
    })
  }

  // Expired tab action
  const handleRequestDocUpdateConfirm = (message: string) => {
    if (!requestUpdateDoc) return
    const { caseItem, document } = requestUpdateDoc
    const newEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: caseItem.id,
      targetName: caseItem.applicantName,
      targetRole: caseItem.role,
      action: 'Resubmission Requested',
      documentType: document.type,
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Sent update notice for expired ${document.type}. Message: ${message}`,
      statusTo: 'Update Requested',
    }
    saveHistory([newEvt, ...history])

    toast({
      variant: 'info',
      title: 'Document update request sent',
      description: `Renewal notice sent to ${caseItem.applicantName} for ${document.type}.`,
      actionLabel: 'View User',
      actionRoute: `/users/${caseItem.userId}`,
    })
    setRequestUpdateDoc(null)
  }

  // Filtered dataset
  const filteredCases = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return cases.filter((item) => {
      const matchQuery =
        !q ||
        item.applicantName.toLowerCase().includes(q) ||
        item.applicantEmail.toLowerCase().includes(q) ||
        item.applicantPhone.toLowerCase().includes(q) ||
        item.userId.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.documents.some((d) => d.documentNumber?.toLowerCase().includes(q)) ||
        (item.agentDetails?.tradeLicenseNumber && item.agentDetails.tradeLicenseNumber.toLowerCase().includes(q))

      let matchStatus = true
      if (statusFilter !== 'All') {
        matchStatus = item.status.toLowerCase() === statusFilter
      }

      const matchUserType = userTypeFilter === 'All' || item.role === userTypeFilter

      let matchVerType = true
      if (verificationTypeFilter !== 'All types') {
        if (verificationTypeFilter === 'Identity Verification') {
          matchVerType = item.documents.some((d) => d.type === 'Passport' || d.type === 'Emirates ID' || d.type === 'National ID')
        } else if (verificationTypeFilter === 'Business Verification') {
          matchVerType = item.documents.some((d) => d.type === 'Trade License' || d.type === 'Company Documents')
        } else if (verificationTypeFilter === 'License Verification') {
          matchVerType = item.documents.some((d) => d.type === 'RERA Certificate')
        }
      }

      let matchReviewer = true
      if (reviewerFilter !== 'All reviewers') {
        if (reviewerFilter === 'Unassigned') {
          matchReviewer = !item.assignedReviewer
        } else {
          matchReviewer = item.assignedReviewer?.name === reviewerFilter
        }
      }

      const matchCountry = countryFilter === 'All countries' || item.country === countryFilter

      let matchDocType = true
      if (docTypeFilter !== 'All documents') {
        matchDocType = item.documents.some((d) => d.type === docTypeFilter)
      }

      return matchQuery && matchStatus && matchUserType && matchVerType && matchReviewer && matchCountry && matchDocType
    })
  }, [
    cases,
    query,
    statusFilter,
    userTypeFilter,
    verificationTypeFilter,
    reviewerFilter,
    countryFilter,
    docTypeFilter,
  ])

  // Sorting
  const sortedCases = React.useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      let comparison = 0
      if (sortField === 'name') {
        comparison = a.applicantName.localeCompare(b.applicantName)
      } else if (sortField === 'submitted') {
        comparison = a.submittedAt.localeCompare(b.submittedAt)
      } else if (sortField === 'updated') {
        comparison = a.lastUpdatedAt.localeCompare(b.lastUpdatedAt)
      } else if (sortField === 'expiry') {
        const aExp = a.documents[0]?.expiryDate || ''
        const bExp = b.documents[0]?.expiryDate || ''
        comparison = aExp.localeCompare(bExp)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredCases, sortField, sortOrder])

  // Pagination slice
  const paginatedCases = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return sortedCases.slice(start, start + rowsPerPage)
  }, [sortedCases, currentPage, rowsPerPage])

  // Expired documents list
  const expiredDocsList = React.useMemo(() => {
    const list: { caseItem: VerificationCase; document: VerificationDocumentItem }[] = []
    cases.forEach((c) => {
      c.documents.forEach((d) => {
        if (d.status === 'Expired' || (d.daysExpired && d.daysExpired > 0)) {
          list.push({ caseItem: c, document: d })
        }
      })
    })
    return list
  }, [cases])

  // Counts for KPI Cards
  const pendingCount = cases.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length
  const approvedCount = cases.filter((c) => c.status === 'Approved').length
  const rejectedCount = cases.filter((c) => c.status === 'Rejected').length
  const expiredCount = cases.filter((c) => c.status === 'Expired').length
  const resubmittedCount = cases.filter((c) => c.status === 'Resubmitted').length

  const hasActiveFilters =
    query !== '' ||
    statusFilter !== 'All' ||
    userTypeFilter !== 'All' ||
    verificationTypeFilter !== 'All types' ||
    reviewerFilter !== 'All reviewers' ||
    countryFilter !== 'All countries' ||
    docTypeFilter !== 'All documents'

  const clearAllFilters = () => {
    setQuery('')
    setStatusFilter('All')
    setUserTypeFilter('All')
    setVerificationTypeFilter('All types')
    setReviewerFilter('All reviewers')
    setCountryFilter('All countries')
    setDocTypeFilter('All documents')
    setCurrentPage(1)
    router.push('/verification')
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedCases.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedCases.map((c) => c.id))
    }
  }

  return (
    <PlatformShell
      title="Verification Center"
      eyebrow="Trust & Safety Suite"
      query={query}
      onQueryChange={setQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* SECTION 1: HEADER */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-tight text-[#1f2327]">
                Verification Center
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage, review, approve, reject, and track investor and agent verification requests.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <RefreshCw className={cn('size-4 text-[#6f777f]', isRefreshing && 'animate-spin text-[#00c2cb]')} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* 5 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
            <MetricCard
              label="Pending Reviews"
              count={pendingCount}
              trend="+3 today"
              trendDirection="up"
              icon={Clock}
              tone="warning"
              isActive={statusFilter === 'pending'}
              onClick={() => handleKpiClick(statusFilter === 'pending' ? 'All' : 'pending')}
            />
            <MetricCard
              label="Approved"
              count={approvedCount}
              trend="94% rate"
              trendDirection="up"
              icon={CheckCircle2}
              tone="success"
              isActive={statusFilter === 'approved'}
              onClick={() => handleKpiClick(statusFilter === 'approved' ? 'All' : 'approved')}
            />
            <MetricCard
              label="Rejected"
              count={rejectedCount}
              trend="6% rate"
              trendDirection="down"
              icon={XCircle}
              tone="destructive"
              isActive={statusFilter === 'rejected'}
              onClick={() => handleKpiClick(statusFilter === 'rejected' ? 'All' : 'rejected')}
            />
            <MetricCard
              label="Expired"
              count={expiredCount}
              trend="Needs update"
              trendDirection="down"
              icon={AlertTriangle}
              tone="destructive"
              isActive={statusFilter === 'expired'}
              onClick={() => handleKpiClick(statusFilter === 'expired' ? 'All' : 'expired')}
            />
            <MetricCard
              label="Resubmitted"
              count={resubmittedCount}
              trend="2 awaiting check"
              trendDirection="up"
              icon={RefreshCw}
              tone="info"
              isActive={statusFilter === 'resubmitted'}
              onClick={() => handleKpiClick(statusFilter === 'resubmitted' ? 'All' : 'resubmitted')}
            />
          </div>
        </header>

        {/* Table & Filter Container (Original GitHub Repo Layout) */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'Verification Queue', value: 'queue', count: cases.length },
                  { label: 'Expired Documents', value: 'expired', count: expiredDocsList.length },
                  { label: 'Verification History', value: 'history', count: history.length },
                  { label: 'Internal Notes', value: 'notes', count: notes.length },
                ].map((item) => (
                  <a
                    key={item.value}
                    href={`/verification?tab=${encodeURIComponent(item.value)}`}
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey || e.button === 1) {
                        return
                      }
                      e.preventDefault()
                      setActiveTab(item.value as MainTab)
                    }}
                    className={cn(
                      'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn no-underline',
                      activeTab === item.value
                        ? item.value === 'expired'
                          ? 'bg-[#f04438] text-white shadow-2xs font-semibold'
                          : 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                        : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                        item.value === 'expired'
                          ? 'bg-[#f04438] text-white'
                          : activeTab === item.value
                          ? 'bg-white/20 text-white'
                          : 'bg-[#eff1f3] text-[#1f2327]'
                      )}
                    >
                      {item.count}
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
                >
                  <Download className="size-4 text-[#6f777f]" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex size-[36px] items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin text-[#00c2cb]')} />
                </button>
              </div>
            </div>

            {/* 6 Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search name, email, ID, doc #…"
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <Dropdown
                align="start"
                value={statusFilter === 'All' ? 'All statuses' : statusFilter}
                onSelect={(val) => {
                  setStatusFilter(val === 'All statuses' ? 'All' : (val as any))
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Status"
                options={['All statuses', 'pending', 'approved', 'rejected', 'expired', 'resubmitted'].map((item) => ({
                  label: item.charAt(0).toUpperCase() + item.slice(1),
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <CheckCircle2 className="size-4 text-[#6f777f]" />
                    <span className="capitalize">{statusFilter === 'All' ? 'All statuses' : statusFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* User Role Filter */}
              <Dropdown
                align="start"
                value={userTypeFilter === 'All' ? 'All users' : userTypeFilter}
                onSelect={(val) => {
                  setUserTypeFilter(val === 'All users' ? 'All' : (val as any))
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Role"
                options={['All users', 'Investor', 'Agent'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <User className="size-4 text-[#6f777f]" />
                    <span>{userTypeFilter === 'All' ? 'All users' : `${userTypeFilter}s`}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Verification Type Filter */}
              <Dropdown
                align="start"
                value={verificationTypeFilter}
                onSelect={(val) => {
                  setVerificationTypeFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Verification Type"
                options={['All types', 'Identity Verification', 'Business Verification', 'License Verification'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <ShieldCheck className="size-4 text-[#6f777f]" />
                    <span>{verificationTypeFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reviewer Filter */}
              <Dropdown
                align="start"
                value={reviewerFilter}
                onSelect={(val) => {
                  setReviewerFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Reviewer"
                options={['All reviewers', 'Unassigned', ...availableReviewers.map((r) => r.name)].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <UserCheck className="size-4 text-[#6f777f]" />
                    <span>{reviewerFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Country Filter */}
              <Dropdown
                align="start"
                value={countryFilter}
                onSelect={(val) => {
                  setCountryFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Country"
                options={['All countries', 'United Arab Emirates', 'Saudi Arabia', 'Egypt'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <span>🌍</span>
                    <span>{countryFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {(statusFilter !== 'All' ||
                userTypeFilter !== 'All' ||
                verificationTypeFilter !== 'All types' ||
                reviewerFilter !== 'All reviewers' ||
                countryFilter !== 'All countries' ||
                query) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* BULK SELECTION ACTION BAR (SECTION 34) */}
          {selectedIds.length > 0 && activeTab === 'queue' && (
            <div className="flex items-center justify-between border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-5 py-2.5 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[14px] font-bold text-[#1f2327]">
                  {selectedIds.length} verifications selected
                </span>
                <button
                  type="button"
                  onClick={handleBulkApprove}
                  className="h-[32px] rounded-[6px] bg-[#17b26a] px-3 text-[13px] font-bold text-white shadow-2xs hover:bg-[#139757] transition-colors cursor-pointer ant-wave-btn"
                >
                  Bulk Approve Eligible
                </button>
                <button
                  type="button"
                  onClick={handleBulkAssign}
                  className="h-[32px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  Assign Reviewer
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="h-[32px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  Export Selected
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="rounded p-1 text-[#6f777f] hover:bg-[#c7ecee]/50 hover:text-[#1f2327] transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: MAIN VERIFICATION QUEUE TABLE (10 COLUMNS) */}
          {/* ========================================================= */}
          {activeTab === 'queue' && (
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1350px] border-collapse text-left text-[14px]">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327]">
                    <th className="w-12 px-4">
                      <TableCheckbox
                        checked={paginatedCases.length > 0 && selectedIds.length === paginatedCases.length}
                        onChange={toggleSelectAll}
                        ariaLabel="Select all"
                      />
                    </th>
                    <th className="px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSortField('name')
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        }}
                        className="flex items-center gap-1 hover:text-[#00c2cb] cursor-pointer"
                      >
                        <span>User</span>
                        <ArrowUpDown className="size-3.5 text-[#9da4ae]" />
                      </button>
                    </th>
                    <th className="px-4 whitespace-nowrap">User Type</th>
                    <th className="px-4 whitespace-nowrap">Verification ID</th>
                    <th className="px-4 whitespace-nowrap">Verification Type</th>
                    <th className="px-4 whitespace-nowrap">Documents</th>
                    <th className="px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSortField('submitted')
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        }}
                        className="flex items-center gap-1 hover:text-[#00c2cb] cursor-pointer"
                      >
                        <span>Submitted</span>
                        <ArrowUpDown className="size-3.5 text-[#9da4ae]" />
                      </button>
                    </th>
                    <th className="px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSortField('updated')
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        }}
                        className="flex items-center gap-1 hover:text-[#00c2cb] cursor-pointer"
                      >
                        <span>Last Updated</span>
                        <ArrowUpDown className="size-3.5 text-[#9da4ae]" />
                      </button>
                    </th>
                    <th className="px-4 whitespace-nowrap">Status</th>
                    <th className="px-4 whitespace-nowrap">Trust Signal</th>
                    <th className="px-4 whitespace-nowrap">Reviewer</th>
                    <th className="px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedCases.map((caseItem) => {
                    const countryCode = getCountryCode(caseItem.country)
                    const isSelected = selectedIds.includes(caseItem.id)
                    const verifiedDocs = caseItem.documents.filter((d) => d.status === 'Verified').length

                    return (
                      <tr
                        key={caseItem.id}
                        className={cn(
                          'h-[64px] font-sans hover:bg-[#f8f9fa] transition-colors whitespace-nowrap',
                          isSelected && 'bg-[#e5f6f7]/40'
                        )}
                      >
                        {/* Checkbox */}
                        <td className="w-12 px-4 whitespace-nowrap">
                          <TableCheckbox
                            checked={isSelected}
                            onChange={() =>
                              setSelectedIds((prev) =>
                                prev.includes(caseItem.id)
                                  ? prev.filter((id) => id !== caseItem.id)
                                  : [...prev, caseItem.id]
                              )
                            }
                            ariaLabel={`Select ${caseItem.applicantName}`}
                          />
                        </td>

                        {/* 1. User Column (Avatar + Name -> /users/:userId) */}
                        <td className="px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link href={`/users/${caseItem.userId}`} className="cursor-pointer group">
                              <TableAvatar
                                src={caseItem.applicantAvatar}
                                name={caseItem.applicantName}
                                countryCode={countryCode}
                                size="md"
                                variant="brand"
                              />
                            </Link>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/users/${caseItem.userId}`}
                                  className="font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] hover:underline transition-colors truncate"
                                >
                                  {caseItem.applicantName}
                                </Link>
                                <span className="text-[11px] font-mono text-[#6f777f]">({caseItem.userId})</span>
                              </div>
                              <p className="text-[12px] leading-[16px] text-[#6f777f] truncate">{caseItem.applicantEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* 2. User Type Badge */}
                        <td className="px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-[6px] px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider',
                              caseItem.role === 'Agent' ? 'bg-[#eaf2ff] text-[#3366ff]' : 'bg-[#e5f6f7] text-[#00c2cb]'
                            )}
                          >
                            {caseItem.role}
                          </span>
                        </td>

                        {/* 3. Verification ID (Click -> /verification/:id, with copy button) */}
                        <td className="px-4 font-mono text-[13px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/verification/${caseItem.id}`}
                              className="font-bold text-[#1f2327] hover:text-[#00c2cb] hover:underline"
                            >
                              {caseItem.id}
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => handleCopyId(e, caseItem.id)}
                              className="text-[#9da4ae] hover:text-[#1f2327] cursor-pointer"
                              title="Copy ID"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </td>

                        {/* 4. Verification Type */}
                        <td className="px-4 whitespace-nowrap text-[13px] text-[#1f2327]">
                          <Link
                            href={`/verification/${caseItem.id}`}
                            className="hover:text-[#00c2cb] hover:underline"
                          >
                            {caseItem.role === 'Investor'
                              ? 'Identity & Contact Verification'
                              : 'Identity & Brokerage License'}
                          </Link>
                        </td>

                        {/* 5. Documents column */}
                        <td className="px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setInspectDocData({
                                documents: caseItem.documents,
                                name: caseItem.applicantName,
                                role: caseItem.role,
                                country: caseItem.country,
                              })
                            }
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            <span className="font-semibold text-[13px] text-[#1f2327]">
                              {verifiedDocs}/{caseItem.documents.length} Docs
                            </span>
                            <div className="h-1.5 w-12 rounded-full bg-[#eff1f3] overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  verifiedDocs === caseItem.documents.length ? 'bg-[#17b26a]' : 'bg-[#00c2cb]'
                                )}
                                style={{ width: `${(verifiedDocs / caseItem.documents.length) * 100}%` }}
                              />
                            </div>
                          </button>
                        </td>

                        {/* 6. Submitted Date */}
                        <td className="px-4 text-[13px] text-[#6f777f] whitespace-nowrap" title={caseItem.submittedDateExact}>
                          {caseItem.submittedAt}
                        </td>

                        {/* 7. Last Updated */}
                        <td className="px-4 text-[13px] text-[#6f777f] whitespace-nowrap">
                          {caseItem.lastUpdatedAt}
                        </td>

                        {/* 8. Status Badge */}
                        <td className="px-4 whitespace-nowrap">
                          <FigmaStatusBadge status={caseItem.status} />
                        </td>

                        {/* 8.5 Trust Signal per Section 16 */}
                        <td className="px-4 whitespace-nowrap text-[12px]">
                          <span
                            className={cn(
                              'font-semibold',
                              caseItem.riskScore > 75 ? 'text-[#16A86B]' : caseItem.riskScore > 40 ? 'text-[#E99A18]' : 'text-[#E5484D]'
                            )}
                          >
                            Trust: {caseItem.riskScore}/100 ({caseItem.riskScore > 75 ? 'High' : caseItem.riskScore > 40 ? 'Moderate' : 'Low'})
                          </span>
                        </td>

                        {/* 9. Reviewer */}
                        <td className="px-4 whitespace-nowrap text-[13px]">
                          {caseItem.assignedReviewer ? (
                            <div className="flex items-center gap-2">
                              {caseItem.assignedReviewer.avatar && (
                                <img
                                  src={caseItem.assignedReviewer.avatar}
                                  alt={caseItem.assignedReviewer.name}
                                  className="size-6 rounded-full object-cover"
                                />
                              )}
                              <span className="font-medium text-[#1f2327]">
                                {caseItem.assignedReviewer.name.split(' ')[0]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#9da4ae]">Unassigned</span>
                          )}
                        </td>

                        {/* 10. Actions Dropdown */}
                        <td className="px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/verification/${caseItem.id}`}
                              className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                              title="Review Verification"
                            >
                              <Eye className="size-4" />
                            </Link>

                            <Dropdown
                              align="end"
                              floating
                              ariaLabel={`Actions for ${caseItem.applicantName}`}
                              options={[
                                { label: 'Review Verification', value: 'review', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                                { label: 'View User Profile', value: 'view-user', icon: <User className="size-4 text-[#00c2cb]" /> },
                                { label: 'Inspect Documents', value: 'view-docs', icon: <FileText className="size-4 text-[#00c2cb]" /> },
                                { label: 'Assign Reviewer', value: 'assign', icon: <UserCheck className="size-4 text-[#00c2cb]" /> },
                                { label: 'Request Resubmission', value: 'resubmit', icon: <RefreshCw className="size-4 text-amber-600" /> },
                                { label: 'Add Compliance Note', value: 'note', icon: <Edit2 className="size-4 text-[#6f777f]" /> },
                              ]}
                              onSelect={(action) => {
                                if (action === 'review') router.push(`/verification/${caseItem.id}`)
                                else if (action === 'view-user') router.push(`/users/${caseItem.userId}`)
                                else if (action === 'view-docs')
                                  setInspectDocData({
                                    documents: caseItem.documents,
                                    name: caseItem.applicantName,
                                    role: caseItem.role,
                                    country: caseItem.country,
                                  })
                                else if (action === 'assign') setAssignModalData({ caseItem })
                                else if (action === 'resubmit') setResubmitModalCase(caseItem)
                                else if (action === 'note') setNoteTargetCase(caseItem)
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
                  })}
                </tbody>
              </table>

              {/* SECTION 41: EMPTY STATE */}
              {paginatedCases.length === 0 && (
                <EmptyState
                  title={hasActiveFilters ? 'No results match your search' : 'No verification requests yet'}
                  description={
                    hasActiveFilters
                      ? 'Try clearing or resetting your active filter chips.'
                      : 'New investor and agent verification submissions will appear here.'
                  }
                  actionLabel={hasActiveFilters ? 'Clear Search & Filters' : undefined}
                  onAction={hasActiveFilters ? clearAllFilters : undefined}
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: EXPIRED DOCUMENTS VIEW (SECTION 36) */}
          {/* ========================================================= */}
          {activeTab === 'expired' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left text-[14px]">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">User</th>
                    <th className="px-4">Expired Document</th>
                    <th className="px-4">Expiry Date</th>
                    <th className="px-4">Days Expired</th>
                    <th className="px-4">Verification Status</th>
                    <th className="px-4">Assigned Reviewer</th>
                    <th className="px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {expiredDocsList.map(({ caseItem, document }) => (
                    <tr key={`${caseItem.id}-${document.id}`} className="h-[64px] font-sans hover:bg-[#f8f9fa] transition-colors whitespace-nowrap">
                      <td className="px-4 whitespace-nowrap">
                        <Link
                          href={`/users/${caseItem.userId}`}
                          className="font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] hover:underline"
                        >
                          {caseItem.applicantName}
                        </Link>
                        <span className="text-[12px] leading-[16px] text-[#6f777f] block">({caseItem.role})</span>
                      </td>
                      <td className="px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            setInspectDocData({
                              documents: caseItem.documents,
                              initialDocId: document.id,
                              name: caseItem.applicantName,
                              role: caseItem.role,
                            })
                          }
                          className="text-[#00c2cb] font-semibold hover:underline cursor-pointer"
                        >
                          {document.type} ({document.name})
                        </button>
                      </td>
                      <td className="px-4 whitespace-nowrap font-bold text-[#d92d20]">
                        {document.expiryDate || 'Expired'}
                      </td>
                      <td className="px-4 whitespace-nowrap font-mono text-[#d92d20] font-semibold">
                        {document.daysExpired || 90}+ days
                      </td>
                      <td className="px-4 whitespace-nowrap">
                        <FigmaStatusBadge status="Expired" />
                      </td>
                      <td className="px-4 whitespace-nowrap text-[13px] text-[#6f777f]">
                        {caseItem.assignedReviewer?.name || 'Unassigned'}
                      </td>
                      <td className="px-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setRequestUpdateDoc({ caseItem, document })}
                          className="h-[32px] rounded-[6px] bg-[#00c2cb] px-3 text-[13px] font-bold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn"
                        >
                          Request Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {expiredDocsList.length === 0 && (
                <EmptyState
                  title="No expired documents"
                  description="All active broker licenses and IDs are in good standing."
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: GLOBAL VERIFICATION HISTORY */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Global Verification History</h3>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                >
                  <Download className="size-3.5 text-[#6f777f]" />
                  <span>Export History</span>
                </button>
              </div>

              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3d5d7]">
                {history.map((evt) => (
                  <div key={evt.id} className="relative group">
                    <span className="absolute -left-6 top-1.5 flex size-3 rounded-full bg-[#00c2cb] border-2 border-white ring-2 ring-[#00c2cb]/20" />
                    <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-1 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1f2327]">{evt.action}</span>
                          <span className="rounded-[4px] bg-[#eff1f3] px-2 py-0.5 text-[11px] font-semibold text-[#6f777f]">
                            {evt.targetName} ({evt.targetRole})
                          </span>
                          {evt.documentType && (
                            <span className="rounded-[4px] bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[11px] font-semibold">
                              {evt.documentType}
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-[#6f777f] flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#6f777f]">{evt.details}</p>
                      <div className="flex items-center gap-3 pt-1 text-[12px] text-[#6f777f] border-t border-[#d3d5d7]/50 mt-1">
                        <span>
                          Case ID:{' '}
                          <Link href={`/verification/${evt.caseId}`} className="font-mono text-[#00c2cb] font-bold hover:underline">
                            {evt.caseId}
                          </Link>
                        </span>
                        <span>•</span>
                        <span>Reviewer: <strong className="text-[#1f2327]">{evt.reviewer}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: INTERNAL NOTES */}
          {/* ========================================================= */}
          {activeTab === 'notes' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Internal Compliance Notes</h3>
                  <p className="text-[13px] text-[#6f777f]">Auditor remarks and PEP cross-references</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (cases.length > 0) setNoteTargetCase(cases[0])
                  }}
                  className="flex h-[34px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[13px] font-semibold text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
                >
                  <Plus className="size-4" />
                  <span>Add Note</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      'rounded-[10px] border p-4 space-y-2 shadow-xs transition-all',
                      note.isPinned ? 'border-[#f79009]/40 bg-[#fffaf0]' : 'border-[#d3d5d7] bg-white'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {note.isPinned && <Pin className="size-3.5 text-[#f79009]" />}
                        <span className="font-bold text-[14px] text-[#1f2327]">{note.author}</span>
                        <span className="text-[12px] text-[#6f777f]">({note.authorRole})</span>
                      </div>
                      <span className="text-[12px] text-[#6f777f]">{note.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/verification/${note.caseId}`}
                        className="rounded-[4px] bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[11px] font-bold hover:underline"
                      >
                        Target: {note.targetName} ({note.caseId})
                      </Link>
                      <span className="rounded-[4px] bg-[#eff1f3] px-2 py-0.5 text-[11px] font-semibold text-[#6f777f]">
                        {note.tag}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#1f2327] leading-relaxed bg-[#fcfcfc] p-3 rounded-[6px] border border-[#d3d5d7]/60">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 33: STANDARDIZED FOOTER PAGINATION */}
          {activeTab === 'queue' && (
            <div className="mt-auto border-t border-[#d3d5d7]">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(sortedCases.length / rowsPerPage))}
                totalItems={sortedCases.length}
                rowsPerPage={rowsPerPage}
                rowsOptions={[10, 20, 30]}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(rows) => {
                  setRowsPerPage(rows)
                  setCurrentPage(1)
                }}
                itemLabel="verifications"
              />
            </div>
          )}
        </section>
      </div>

      {/* DOCUMENT INSPECTOR MODAL */}
      {inspectDocData && (
        <VerificationDocInspectorModal
          documents={inspectDocData.documents}
          initialDocId={inspectDocData.initialDocId}
          applicantName={inspectDocData.name}
          applicantRole={inspectDocData.role}
          applicantCountry={inspectDocData.country}
          onClose={() => setInspectDocData(null)}
          onUpdateDocumentStatus={(docId, status, notesText, reason) => {
            const updatedCases = cases.map((c) => {
              if (c.documents.some((d) => d.id === docId)) {
                const newDocs = c.documents.map((d) =>
                  d.id === docId
                    ? {
                        ...d,
                        status,
                        reviewedBy: 'Senior Compliance Officer',
                        reviewedAt: 'Today',
                        reviewNotes: notesText,
                        rejectionReason: reason,
                      }
                    : d
                )
                return { ...c, documents: newDocs, lastUpdatedAt: 'Just now' }
              }
              return c
            })
            saveCases(updatedCases)
            setInspectDocData(null)
            toast({
              variant: 'success',
              title: `Document ${status}`,
              description: 'Updated document verification status.',
            })
          }}
        />
      )}

      {/* ASSIGN REVIEWER MODAL */}
      {assignModalData && (
        <AssignReviewerModal
          caseItem={assignModalData.caseItem}
          casesCount={assignModalData.casesCount}
          onClose={() => setAssignModalData(null)}
          onAssign={(reviewer) => {
            if (assignModalData.isBulk) {
              handleBulkAssignConfirm(reviewer)
            } else if (assignModalData.caseItem) {
              const updated = cases.map((c) =>
                c.id === assignModalData.caseItem?.id
                  ? {
                      ...c,
                      assignedReviewer: reviewer
                        ? {
                            name: reviewer.name,
                            avatar: reviewer.avatar,
                            role: reviewer.role,
                            email: reviewer.email,
                          }
                        : undefined,
                    }
                  : c
              )
              saveCases(updated)
              toast({
                variant: 'success',
                title: reviewer ? `Verification assigned to ${reviewer.name}` : 'Reviewer unassigned',
                description: `Case ${assignModalData.caseItem.id} updated.`,
              })
            }
            setAssignModalData(null)
          }}
        />
      )}

      {/* APPROVE VERIFICATION MODAL */}
      {approveModalCase && (
        <ApproveVerificationModal
          caseItem={approveModalCase}
          onClose={() => setApproveModalCase(null)}
          onConfirm={() => {
            handleApproveCaseConfirm(approveModalCase)
            setApproveModalCase(null)
          }}
        />
      )}

      {/* REJECT VERIFICATION MODAL */}
      {rejectModalCase && (
        <RejectVerificationModal
          caseItem={rejectModalCase}
          onClose={() => setRejectModalCase(null)}
          onConfirm={(reason, notesText) => {
            handleRejectCaseConfirm(rejectModalCase, reason, notesText)
            setRejectModalCase(null)
          }}
        />
      )}

      {/* REQUEST RESUBMISSION MODAL */}
      {resubmitModalCase && (
        <RequestResubmissionModal
          caseItem={resubmitModalCase}
          onClose={() => setResubmitModalCase(null)}
          onConfirm={(requirements, reason, message) => {
            handleResubmitCaseConfirm(resubmitModalCase, requirements, reason, message)
            setResubmitModalCase(null)
          }}
        />
      )}

      {/* REQUEST DOC UPDATE MODAL */}
      {requestUpdateDoc && (
        <RequestDocUpdateModal
          caseItem={requestUpdateDoc.caseItem}
          document={requestUpdateDoc.document}
          onClose={() => setRequestUpdateDoc(null)}
          onConfirm={handleRequestDocUpdateConfirm}
        />
      )}

      {/* ADD / EDIT COMPLIANCE NOTE MODAL */}
      {noteTargetCase && (
        <AddVerificationNoteModal
          caseItem={noteTargetCase}
          initialNote={editingNote}
          onClose={() => {
            setNoteTargetCase(null)
            setEditingNote(null)
          }}
          onSaveNote={(noteData) => {
            const newNote: VerificationNote = {
              ...noteData,
              id: `VN-${Date.now()}`,
              createdAt: 'Today, Just now',
            }
            const updatedNotes = [newNote, ...notes]
            saveNotes(updatedNotes)
            setNoteTargetCase(null)
            toast({
              variant: 'success',
              title: 'Note added successfully',
              description: 'Compliance note saved.',
            })
          }}
        />
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog request={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </PlatformShell>
  )
}

export function VerificationCenter() {
  return (
    <ToastProvider>
      <VerificationCenterInner />
    </ToastProvider>
  )
}
