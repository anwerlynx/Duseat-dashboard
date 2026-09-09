'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Home,
  Briefcase,
  DollarSign,
  Flame,
  LayoutGrid,
  List,
  SlidersHorizontal,
  FileSpreadsheet,
  Layers,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Tag as TagIcon,
  KeyRound,
  FileText,
  Check,
  X,
  ExternalLink,
  Archive,
  UserCheck,
  Calendar,
  RefreshCw,
  RotateCcw,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { RequestCard } from './request-card'
import { RequestDetailModal } from './request-detail-modal'
import { EditRequestModal } from './edit-request-modal'
import { AssignAdminModal } from './assign-admin-modal'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { FigmaTag } from '@/components/ui/figma-tag'
import { MainButton } from '@/components/ui/main-button'
import { StatusTag } from '@/components/ui/badge-tag'
import { FilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { DateRangePicker, type DateRange } from './date-range-picker'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { cn } from '@/lib/utils'
import type { PropertyRequest } from '@/lib/platform-users'
import { allPlatformRequests } from '@/lib/platform-users'

type ViewMode = 'timeline' | 'table' | 'kanban'

// Request statuses specified in module requirement
const REQUEST_STATUSES = [
  'All',
  'Draft',
  'Open',
  'Matched',
  'Closed',
  'Expired',
  'Archived',
] as const

const BUDGET_OPTIONS = [
  { label: 'All Budgets', value: 'All' },
  { label: 'Under 2M AED', value: 'Under 2M' },
  { label: '2M – 5M AED', value: '2M-5M' },
  { label: '5M – 10M AED', value: '5M-10M' },
  { label: '10M+ AED (Ultra-Luxury)', value: '10M+' },
]

const PROPERTY_TYPES = [
  { label: 'All Types', value: 'All' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Townhouse', value: 'Townhouse' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Office', value: 'Office' },
  { label: 'Retail Shop', value: 'Retail Shop' },
  { label: 'Warehouse', value: 'Warehouse' },
]

const COUNTRY_OPTIONS = [
  { label: 'All Countries', value: 'All' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'United Kingdom', value: 'United Kingdom' },
]

const AREA_OPTIONS = [
  { label: 'All Areas', value: 'All' },
  { label: 'Dubai Hills Estate', value: 'Dubai Hills Estate' },
  { label: 'Downtown Dubai', value: 'Downtown Dubai' },
  { label: 'Palm Jumeirah', value: 'Palm Jumeirah' },
  { label: 'Business Bay', value: 'Business Bay' },
  { label: 'Nad Al Sheba', value: 'Nad Al Sheba' },
  { label: 'Meydan', value: 'Meydan' },
  { label: 'Dubai Marina', value: 'Dubai Marina' },
]

export function RequestsManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_platform_requests_records'

  const [requests, setRequests] = React.useState<PropertyRequest[]>(allPlatformRequests)
  const [viewMode, setViewMode] = React.useState<ViewMode>('table')
  const [query, setQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')
  const [budgetFilter, setBudgetFilter] = React.useState<string>('All')
  const [countryFilter, setCountryFilter] = React.useState<string>('All')
  const [areaFilter, setAreaFilter] = React.useState<string>('All')
  const [propertyTypeFilter, setPropertyTypeFilter] = React.useState<string>('All')
  const [investorFilter, setInvestorFilter] = React.useState<string>('All')
  const [dateRange, setDateRange] = React.useState<string>('All Time')

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [sortField, setSortField] = React.useState<'time' | 'budget' | 'offers'>('time')
  const [sortAsc, setSortAsc] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  // Modals state
  const [selectedRequest, setSelectedRequest] = React.useState<PropertyRequest | null>(null)
  const [editingRequest, setEditingRequest] = React.useState<PropertyRequest | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isAssignAdminOpen, setIsAssignAdminOpen] = React.useState(false)
  const [assignAdminTargetRequests, setAssignAdminTargetRequests] = React.useState<PropertyRequest[]>([])
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)

  // Load from localStorage on mount & check searchParams
  React.useEffect(() => {
    let currentRequests = allPlatformRequests
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentRequests = parsed
          setRequests(parsed)
        }
      }
    } catch {}

    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      const found = currentRequests.find((r) => r.id.toLowerCase() === idFromUrl.toLowerCase())
      if (found) {
        setSelectedRequest(found)
      } else {
        setQuery(idFromUrl)
      }
    }
  }, [searchParams])

  const saveRequests = (newRequests: PropertyRequest[]) => {
    setRequests(newRequests)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRequests))
    } catch {}
  }

  // Unique investor names for filter
  const uniqueInvestors = React.useMemo(() => {
    const list = Array.from(new Set(requests.map((r) => r.investorName))).sort()
    return [{ label: 'All Investors', value: 'All' }, ...list.map((name) => ({ label: name, value: name }))]
  }, [requests])

  // Filtered requests based on all 7 filter criteria
  const filteredRequests = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return requests
      .filter((req) => {
        // Query search
        const matchesQuery =
          !q ||
          req.title.toLowerCase().includes(q) ||
          req.investorName.toLowerCase().includes(q) ||
          req.id.toLowerCase().includes(q) ||
          req.preferredAreas.some((a) => a.toLowerCase().includes(q)) ||
          req.propertyType.toLowerCase().includes(q)

        // Status Filter
        let matchesStatus = true
        if (statusFilter !== 'All') {
          if (statusFilter === 'Open') {
            matchesStatus = req.status === 'Open' || req.status === 'Receiving offers'
          } else {
            matchesStatus = req.status.toLowerCase() === statusFilter.toLowerCase()
          }
        }

        // Budget Filter
        let matchesBudget = true
        if (budgetFilter === 'Under 2M') {
          matchesBudget = req.budget.includes('1.') || req.budget.includes('1M') || req.budget.includes('800K')
        } else if (budgetFilter === '2M-5M') {
          matchesBudget = req.budget.includes('2.') || req.budget.includes('3.') || req.budget.includes('4.') || req.budget.includes('4M')
        } else if (budgetFilter === '5M-10M') {
          matchesBudget = req.budget.includes('5.') || req.budget.includes('6M') || req.budget.includes('8M')
        } else if (budgetFilter === '10M+') {
          matchesBudget = req.budget.includes('10M') || req.budget.includes('12M') || req.budget.includes('15M') || req.budget.includes('20M')
        }

        // Country Filter
        let matchesCountry = true
        if (countryFilter !== 'All') {
          if (countryFilter === 'United Arab Emirates') {
            matchesCountry = !req.countryFlag || req.countryFlag === '🇦🇪'
          } else if (countryFilter === 'Saudi Arabia') {
            matchesCountry = req.countryFlag === '🇸🇦'
          } else if (countryFilter === 'Egypt') {
            matchesCountry = req.countryFlag === '🇪🇬'
          } else if (countryFilter === 'United Kingdom') {
            matchesCountry = req.countryFlag === '🇬🇧'
          }
        }

        // Area Filter
        let matchesArea = true
        if (areaFilter !== 'All') {
          matchesArea = req.preferredAreas.some((a) => a.toLowerCase().includes(areaFilter.toLowerCase()))
        }

        // Property Type Filter
        let matchesType = true
        if (propertyTypeFilter !== 'All') {
          matchesType = req.propertyType.toLowerCase() === propertyTypeFilter.toLowerCase()
        }

        // Investor Filter
        let matchesInvestor = true
        if (investorFilter !== 'All') {
          matchesInvestor = req.investorName === investorFilter
        }

        return (
          matchesQuery &&
          matchesStatus &&
          matchesBudget &&
          matchesCountry &&
          matchesArea &&
          matchesType &&
          matchesInvestor
        )
      })
      .sort((a, b) => {
        if (sortField === 'offers') {
          return sortAsc ? a.offersCount - b.offersCount : b.offersCount - a.offersCount
        }
        return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      })
  }, [
    requests,
    query,
    statusFilter,
    budgetFilter,
    countryFilter,
    areaFilter,
    propertyTypeFilter,
    investorFilter,
    sortField,
    sortAsc,
  ])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / rowsPerPage))
  const paginatedRequests = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredRequests.slice(start, start + rowsPerPage)
  }, [filteredRequests, currentPage, rowsPerPage])

  // KPIs
  const stats = React.useMemo(() => {
    const total = requests.length
    const draftCount = requests.filter((r) => r.status === 'Draft').length
    const openCount = requests.filter((r) => r.status === 'Open' || r.status === 'Receiving offers').length
    const matchedCount = requests.filter((r) => r.status === 'Matched' || r.dealConfirmed).length
    const closedCount = requests.filter((r) => r.status === 'Closed').length
    const urgentCount = requests.filter((r) => (r.status as string) === 'Urgent' || (r as any).isUrgent).length
    const expiredCount = requests.filter((r) => r.status === 'Expired').length
    const archivedCount = requests.filter((r) => r.status === 'Archived').length
    const totalOffers = requests.reduce((acc, r) => acc + (r.offersCount || 0), 0)
    return { total, draftCount, openCount, matchedCount, closedCount, urgentCount, expiredCount, archivedCount, totalOffers }
  }, [requests])

  // Action Handlers
  const handleUpdateStatus = (requestId: string, newStatus: PropertyRequest['status']) => {
    const updated = requests.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    saveRequests(updated)
    toast({
      variant: 'success',
      title: 'Status Updated',
      description: `Request ${requestId} status changed to ${newStatus}.`,
    })
  }

  const handleCloseRequest = (reqId: string) => {
    handleUpdateStatus(reqId, 'Closed')
  }

  const handleArchiveRequest = (reqId: string) => {
    handleUpdateStatus(reqId, 'Archived')
  }

  const handleDeleteRequest = (reqId: string) => {
    setConfirmDialog({
      title: 'Delete Property Request',
      description: `Are you sure you want to permanently delete request ${reqId}? This will remove all associated agent proposals and audit records.`,
      confirmLabel: 'Delete Permanently',
      tone: 'danger',
      icon: 'delete',
      onConfirm: () => {
        const next = requests.filter((r) => r.id !== reqId)
        saveRequests(next)
        setSelectedIds((prev) => prev.filter((id) => id !== reqId))
        toast({
          variant: 'error',
          title: 'Request Deleted',
          description: `Request ${reqId} has been removed.`,
        })
        setConfirmDialog(null)
      },
    })
  }

  const handleSaveRequest = (updatedRequest: PropertyRequest) => {
    const exists = requests.some((r) => r.id === updatedRequest.id)
    let next: PropertyRequest[]
    if (exists) {
      next = requests.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    } else {
      next = [updatedRequest, ...requests]
    }
    saveRequests(next)
    setEditingRequest(null)
    setIsCreateModalOpen(false)
    if (selectedRequest && selectedRequest.id === updatedRequest.id) {
      setSelectedRequest(updatedRequest)
    }
    toast({
      variant: 'success',
      title: exists ? 'Request Updated' : 'Request Created',
      description: `Request ${updatedRequest.id} has been saved successfully.`,
    })
  }

  const handleAssignAdminConfirm = (adminName: string, notes?: string) => {
    const targetIds = assignAdminTargetRequests.map((r) => r.id)
    const updated = requests.map((r) => {
      if (targetIds.includes(r.id)) {
        return {
          ...r,
          assignedAdmin: { name: adminName },
        }
      }
      return r
    })
    saveRequests(updated)
    setIsAssignAdminOpen(false)
    setAssignAdminTargetRequests([])
    toast({
      variant: 'success',
      title: 'Admin Assigned',
      description: `Assigned ${targetIds.length} request(s) to ${adminName}.`,
    })
  }

  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Investor',
      'Budget',
      'Property Type',
      'Bedrooms',
      'Area',
      'Country',
      'City',
      'Offers Count',
      'Status',
      'Created Date',
    ]
    const rows = filteredRequests.map((r) => [
      r.id,
      r.investorName,
      r.budget,
      r.propertyType,
      r.bedrooms,
      `"${r.preferredAreas.join(', ')}"`,
      r.countryFlag === '🇸🇦' ? 'Saudi Arabia' : r.countryFlag === '🇪🇬' ? 'Egypt' : r.countryFlag === '🇬🇧' ? 'United Kingdom' : 'United Arab Emirates',
      r.preferredAreas[0] || 'Dubai',
      r.offersCount,
      r.status,
      r.created || 'Today',
    ])
    const csv = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `duseat_requests_${Date.now()}.csv`
    a.click()
    toast({
      variant: 'success',
      title: 'Report Exported',
      description: `Exported ${filteredRequests.length} requests to CSV.`,
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRequests.map((r) => r.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const resetAllFilters = () => {
    setQuery('')
    setStatusFilter('All')
    setBudgetFilter('All')
    setCountryFilter('All')
    setAreaFilter('All')
    setPropertyTypeFilter('All')
    setInvestorFilter('All')
    setDateRange('All Time')
  }

  const hasActiveFilters =
    query !== '' ||
    statusFilter !== 'All' ||
    budgetFilter !== 'All' ||
    countryFilter !== 'All' ||
    areaFilter !== 'All' ||
    propertyTypeFilter !== 'All' ||
    investorFilter !== 'All' ||
    dateRange !== 'All Time'

  return (
    <PlatformShell
      title="Property Requests"
      eyebrow="marketplace"
      query={query}
      onQueryChange={setQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            1. TOP HEADER CARD
           ========================================================================= */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Property Requests
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Monitor investor property briefs, track matching agents, manage proposal bids and pipeline closures.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switchers */}
              <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-semibold transition-all cursor-pointer',
                    viewMode === 'table'
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                  title="Data Table View"
                >
                  <List className="size-3.5" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-semibold transition-all cursor-pointer',
                    viewMode === 'timeline'
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                  title="Timeline Feed Mode"
                >
                  <Layers className="size-3.5" />
                  <span>Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-semibold transition-all cursor-pointer',
                    viewMode === 'kanban'
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                  title="Kanban Board Pipeline"
                >
                  <LayoutGrid className="size-3.5" />
                  <span>Pipeline</span>
                </button>
              </div>

              {/* Export Action */}
              <MainButton
                variant="Secondary"
                size="sm"
                iconLeft={<Download className="size-[18px]" />}
                label="Export CSV"
                onClick={handleExportCSV}
              />

              {/* Add Request Action */}
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Plus className="size-[18px]" />}
                label="+ Add Request"
                onClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. KPI STAT CARDS (5 Metrics)
           ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5 lg:gap-3">
          <MetricCard
            label="Total Requests"
            value={stats.total}
            tone="neutral"
            active={statusFilter === 'All'}
            onClick={() => setStatusFilter('All')}
          />
          <MetricCard
            label="Open & Pitching"
            value={stats.openCount}
            tone="brand"
            active={statusFilter === 'Open'}
            onClick={() => setStatusFilter('Open')}
          />
          <MetricCard
            label="Matched & Negotiating"
            value={stats.matchedCount}
            tone="success"
            active={statusFilter === 'Matched'}
            onClick={() => setStatusFilter('Matched')}
          />
          <MetricCard
            label="Closed & Deals"
            value={stats.closedCount}
            tone="neutral"
            active={statusFilter === 'Closed'}
            onClick={() => setStatusFilter('Closed')}
          />
          <MetricCard
            label="Urgent & Priority"
            value={stats.urgentCount}
            tone="warning"
            active={statusFilter === 'Urgent'}
            onClick={() => setStatusFilter('Urgent')}
          />
        </div>

        {/* =========================================================================
            3. MAIN CONTENT CONTAINER (Top Tabs + Filter Row + Views + Pagination)
           ========================================================================= */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          {/* Top Tabs */}
          <FilterTabs
            tabs={[
              { id: 'All', label: 'All Requests', count: stats.total },
              { id: 'Open', label: 'Open', count: stats.openCount },
              { id: 'Matched', label: 'Matched', count: stats.matchedCount },
              { id: 'Closed', label: 'Closed', count: stats.closedCount },
              { id: 'Urgent', label: 'Urgent', count: stats.urgentCount },
              { id: 'Archived', label: 'Archived', count: requests.filter((r) => r.status === 'Archived').length },
            ]}
            activeTab={statusFilter}
            onChange={(tabId) => {
              setStatusFilter(tabId as any)
              setCurrentPage(1)
            }}
          />

          {/* Horizontal Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d3d5d7] p-3 sm:p-4 bg-white">
            <div className="flex flex-1 flex-wrap items-center gap-2.5">
              <SearchInput
                value={query}
                onChange={(v: string) => {
                  setQuery(v)
                  setCurrentPage(1)
                }}
                placeholder="Search requests by title, investor, or ID..."
                className="w-full sm:w-[260px] lg:w-[300px]"
              />

              <div className="relative">
                <select
                  value={propertyTypeFilter}
                  aria-label="Filter by Property Type"
                  onChange={(e) => {
                    setPropertyTypeFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-[36px] appearance-none rounded-[6px] border border-[#d3d5d7] bg-white pl-3 pr-8 text-[13px] font-medium text-[#1f2327] outline-none transition-colors hover:border-[#00c2cb] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Industrial">Industrial</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6f777f]" />
              </div>

              <div className="relative">
                <select
                  value={countryFilter}
                  aria-label="Filter by Country"
                  onChange={(e) => {
                    setCountryFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-[36px] appearance-none rounded-[6px] border border-[#d3d5d7] bg-white pl-3 pr-8 text-[13px] font-medium text-[#1f2327] outline-none transition-colors hover:border-[#00c2cb] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Countries</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Egypt">Egypt</option>
                  <option value="United Arab Emirates">UAE</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6f777f]" />
              </div>

              <div className="relative">
                <select
                  value={budgetFilter}
                  aria-label="Filter by Budget Range"
                  onChange={(e) => {
                    setBudgetFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-[36px] appearance-none rounded-[6px] border border-[#d3d5d7] bg-white pl-3 pr-8 text-[13px] font-medium text-[#1f2327] outline-none transition-colors hover:border-[#00c2cb] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Budgets</option>
                  <option value="Under $500k">Under $500k</option>
                  <option value="$500k - $1M">$500k - $1M</option>
                  <option value="$1M - $2M">$1M - $2M</option>
                  <option value="$2M+">$2M+</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6f777f]" />
              </div>

              <DateRangePicker
                value={dateRange}
                onChange={(val) => {
                  setDateRange(val)
                  setCurrentPage(1)
                }}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-[13px] font-semibold text-[#6f777f] hover:text-[#e02d3c] transition-colors cursor-pointer ml-1"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* BULK SELECTION BAR */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#e5f6f7] px-4 py-2.5 sm:px-6 border-b border-[#00c2cb]/30 ant-fade-in">
              <span className="text-[13px] font-bold text-[#00848b]">
                {selectedIds.length} request(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targets = requests.filter((r) => selectedIds.includes(r.id))
                    setAssignAdminTargetRequests(targets)
                    setIsAssignAdminOpen(true)
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-white border border-[#00c2cb] px-3 text-[12px] font-bold text-[#00848b] hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer shadow-2xs"
                >
                  <UserCheck className="size-3.5" />
                  <span>Assign Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = requests.map((r) => (selectedIds.includes(r.id) ? { ...r, status: 'Closed' as const } : r))
                    saveRequests(updated)
                    setSelectedIds([])
                    toast({ variant: 'success', title: 'Batch Closed', description: `Closed ${selectedIds.length} requests.` })
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#1f2327] px-3 text-[12px] font-semibold text-white hover:bg-[#2e3338] transition-colors cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5 text-[#17b26a]" />
                  <span>Close Selected</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = requests.map((r) => (selectedIds.includes(r.id) ? { ...r, status: 'Archived' as const } : r))
                    saveRequests(updated)
                    setSelectedIds([])
                    toast({ variant: 'success', title: 'Batch Archived', description: `Archived ${selectedIds.length} requests.` })
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer shadow-2xs"
                >
                  <Archive className="size-3.5 text-[#6f777f]" />
                  <span>Archive Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: TABLE MODE (All 11 Columns matching Specification)
             ========================================================================= */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1300px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="w-12 px-4 text-center">
                      <TableCheckbox
                        checked={
                          filteredRequests.length > 0 && selectedIds.length === filteredRequests.length
                        }
                        onChange={() => handleSelectAll(selectedIds.length !== filteredRequests.length)}
                        ariaLabel="Select all requests"
                      />
                    </th>
                    <th className="px-4">Request ID</th>
                    <th className="px-4">Investor</th>
                    <th className="px-4">Budget</th>
                    <th className="px-4">Property Type</th>
                    <th className="px-4">Bedrooms</th>
                    <th className="px-4">Area</th>
                    <th className="px-4">Country</th>
                    <th className="px-4">City</th>
                    <th className="px-4">Offers Count</th>
                    <th className="px-4">Status</th>
                    <th className="px-4">Created Date</th>
                    <th className="px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-8 text-center text-[#6f777f]">
                        <EmptyState
                          title="No property requests found"
                          description="Try adjusting your search query or reset your active filters."
                          actionLabel="Reset filters"
                          onAction={resetAllFilters}
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((req) => {
                      const isSelected = selectedIds.includes(req.id)
                      const countryName =
                        req.countryFlag === '🇸🇦'
                          ? 'Saudi Arabia'
                          : req.countryFlag === '🇪🇬'
                          ? 'Egypt'
                          : req.countryFlag === '🇬🇧'
                          ? 'United Kingdom'
                          : 'United Arab Emirates'
                      const cCode = getCountryCode(countryName)

                      return (
                        <tr
                          key={req.id}
                          className={cn(
                            'h-[60px] transition-colors hover:bg-[#f8f9fa] whitespace-nowrap',
                            isSelected && 'bg-[#e5f6f7]/40'
                          )}
                        >
                          <td className="w-12 px-4 text-center">
                            <TableCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(req.id, !isSelected)}
                              ariaLabel={`Select request ${req.id}`}
                            />
                          </td>

                          {/* 1. Request ID */}
                          <td className="px-4">
                            <button
                              type="button"
                              onClick={() => setSelectedRequest(req)}
                              className="font-mono text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
                            >
                              {req.id}
                            </button>
                          </td>

                          {/* 2. Investor */}
                          <td className="px-4">
                            <div className="flex items-center gap-2.5">
                              <Link href={`/investors/${req.investorId || 'IN-2048'}`} className="cursor-pointer">
                                <TableAvatar
                                  src={req.investorAvatar}
                                  name={req.investorName}
                                  countryCode={cCode}
                                  size="md"
                                  variant="brand"
                                />
                              </Link>
                              <div className="min-w-0">
                                <Link
                                  href={`/investors/${req.investorId || 'IN-2048'}`}
                                  className="font-medium text-[#1f2327] text-[14px] hover:text-[#00c2cb] hover:underline transition-colors whitespace-nowrap block"
                                >
                                  {req.investorName}
                                </Link>
                                <span className="text-[11px] text-[#17b26a] font-medium whitespace-nowrap">Verified Buyer</span>
                              </div>
                            </div>
                          </td>

                          {/* 3. Budget */}
                          <td className="px-4 py-3.5 font-bold text-[#00c2cb] text-[14px] whitespace-nowrap">
                            {req.budget}
                          </td>

                          {/* 4. Property Type */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-medium text-[#1f2327] whitespace-nowrap">{req.propertyType}</span>
                            <span className="block text-[12px] text-[#6f777f] whitespace-nowrap">{req.purpose}</span>
                          </td>

                          {/* 5. Bedrooms */}
                          <td className="px-4 py-3.5 font-medium text-[#1f2327] whitespace-nowrap">
                            {req.bedrooms}
                          </td>

                          {/* 6. Area */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              {req.preferredAreas.slice(0, 2).map((a) => (
                                <span
                                  key={a}
                                  className="rounded-[4px] bg-[#eff1f3] px-2 py-0.5 text-[11px] font-medium text-[#1f2327] whitespace-nowrap"
                                >
                                  {a}
                                </span>
                              ))}
                              {req.preferredAreas.length > 2 && (
                                <span className="text-[11px] text-[#6f777f] font-medium whitespace-nowrap">
                                  +{req.preferredAreas.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 7. Country */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <Flag code={cCode} size="s" />
                              <span className="text-[13px] text-[#1f2327] whitespace-nowrap">{countryName}</span>
                            </div>
                          </td>

                          {/* 8. City */}
                          <td className="px-4 py-3.5 text-[13px] text-[#1f2327] whitespace-nowrap">
                            {req.preferredAreas[0] ? 'Dubai' : 'Dubai'}
                          </td>

                          {/* 9. Offers Count */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <FigmaTag
                              status="Active"
                              size="sm"
                              label={`${req.offersCount} offers`}
                              leftIcon={<MessageSquare className="size-[16px]" />}
                            />
                          </td>

                          {/* 10. Status */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <FigmaStatusBadge status={req.status} />
                          </td>

                          {/* 11. Created Date */}
                          <td className="px-4 py-3.5 text-[13px] text-[#6f777f] whitespace-nowrap">
                            {req.created || '28 May 2026'}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="size-4 text-[#00c2cb]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingRequest(req)}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
                                title="Edit Request"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignAdminTargetRequests([req])
                                  setIsAssignAdminOpen(true)
                                }}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
                                title="Assign Admin"
                              >
                                <UserCheck className="size-4 text-[#17b26a]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleArchiveRequest(req.id)}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
                                title="Archive"
                              >
                                <Archive className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(req.id)}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#f3e1e0] hover:text-[#d92d20] cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
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
          )}

          {/* =========================================================================
              VIEW 2: TIMELINE FEED MODE
             ========================================================================= */}
          {viewMode === 'timeline' && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 space-y-4 hover:border-[#00c2cb] transition-colors shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.investorAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'}
                          alt={req.investorName}
                          className="size-10 rounded-full object-cover border border-[#d3d5d7]"
                        />
                        <div>
                          <p className="font-bold text-[14px] text-[#1f2327]">{req.investorName}</p>
                          <p className="text-[12px] text-[#6f777f]">{req.timeAgo || 'Recently'}</p>
                        </div>
                      </div>
                      <FigmaStatusBadge status={req.status} />
                    </div>

                    <div>
                      <p className="font-bold text-[15px] text-[#1f2327] line-clamp-2">{req.title}</p>
                      <p className="text-[13px] text-[#6f777f] mt-1 line-clamp-1">📄 {req.note || 'Family-friendly layout preferred.'}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-2 text-center text-[12px]">
                      <div>
                        <span className="text-[#6f777f] block">Budget</span>
                        <strong className="text-[#00c2cb] truncate block">{req.budget}</strong>
                      </div>
                      <div>
                        <span className="text-[#6f777f] block">Type</span>
                        <strong className="text-[#1f2327] truncate block">{req.propertyType}</strong>
                      </div>
                      <div>
                        <span className="text-[#6f777f] block">Offers</span>
                        <strong className="text-[#17b26a] truncate block">{req.offersCount} bids</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(req)}
                        className="flex-1 h-[36px] rounded-[8px] bg-[#00c2cb] text-[13px] font-bold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingRequest(req)}
                        className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
                      >
                        <Pencil className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: KANBAN BOARD PIPELINE
             ========================================================================= */}
          {viewMode === 'kanban' && (
            <div className="p-5 overflow-x-auto">
              <div className="flex items-start gap-4 min-w-[1000px]">
                {(['Open', 'Matched', 'Closed', 'Archived'] as const).map((stage) => {
                  const stageRequests = requests.filter((r) => {
                    if (stage === 'Open') return r.status === 'Open' || r.status === 'Receiving offers'
                    return r.status === stage
                  })

                  return (
                    <div key={stage} className="flex-1 rounded-[12px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#d3d5d7]">
                        <h4 className="text-[14px] font-bold text-[#1f2327]">{stage}</h4>
                        <span className="rounded-full bg-[#eff1f3] px-2 py-0.5 text-[12px] font-bold text-[#1f2327]">
                          {stageRequests.length}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {stageRequests.map((req) => (
                          <div
                            key={req.id}
                            onClick={() => setSelectedRequest(req)}
                            className="rounded-[8px] border border-[#d3d5d7] bg-white p-3 space-y-2 shadow-2xs hover:border-[#00c2cb] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-[#6f777f]">{req.id}</span>
                              <span className="text-[11px] font-bold text-[#00c2cb]">{req.budget}</span>
                            </div>
                            <p className="font-bold text-[13px] text-[#1f2327] line-clamp-2">{req.title}</p>
                            <div className="flex items-center justify-between text-[11px] text-[#6f777f] pt-1 border-t border-[#d3d5d7]/50">
                              <span>{req.investorName}</span>
                              <span className="text-[#17b26a] font-semibold">{req.offersCount} offers</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Global Pagination Bar */}
          <div className="p-3 border-t border-[#d3d5d7] bg-[#fcfcfc] mt-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRequests.length}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows)
                setCurrentPage(1)
              }}
              itemLabel="requests"
            />
          </div>
        </section>
      </div>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* 1. Request Detail Modal (Full 360 review) */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateRequest={handleSaveRequest}
          onDeleteRequest={handleDeleteRequest}
          onArchiveRequest={handleArchiveRequest}
        />
      )}

      {/* 2. Edit Request Modal */}
      {editingRequest && (
        <EditRequestModal
          isOpen={true}
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onSave={handleSaveRequest}
        />
      )}

      {/* 3. Create Request Modal */}
      {isCreateModalOpen && (
        <EditRequestModal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveRequest}
        />
      )}

      {/* 4. Assign Admin Modal */}
      {isAssignAdminOpen && (
        <AssignAdminModal
          requests={assignAdminTargetRequests}
          onClose={() => {
            setIsAssignAdminOpen(false)
            setAssignAdminTargetRequests([])
          }}
          onAssign={handleAssignAdminConfirm}
        />
      )}

      {/* 5. Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          request={confirmDialog}
          onClose={() => setConfirmDialog(null)}
        />
      )}
    </PlatformShell>
  )
}

export function RequestsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <RequestsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
