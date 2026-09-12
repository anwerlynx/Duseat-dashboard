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
  ChevronUp,
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
  MoreHorizontal,
  FileCheck,
  Bookmark,
  Settings2,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { RequestCard } from './request-card'
import { RequestDetailModal } from './request-detail-modal'
import { EditRequestModal } from './edit-request-modal'
import { AssignAdminModal } from './assign-admin-modal'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { CustomizeTableDialog, type TableViewPreset, type ColumnCategory } from './customize-table-dialog'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { FigmaTag } from '@/components/ui/figma-tag'
import { MainButton } from '@/components/ui/main-button'
import { StatusTag } from '@/components/ui/badge-tag'
import { FilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { DateRangePicker, type DateRange } from './date-range-picker'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { Dropdown } from '@/components/dashboard/menu'
import { cn } from '@/lib/utils'
import type { PropertyRequest } from '@/lib/platform-users'
import { allPlatformRequests, investorById } from '@/lib/platform-users'

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

const REQUEST_DEFAULT_COLUMNS = [
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

const defaultRequestPresets: TableViewPreset[] = [
  {
    id: 'default',
    name: 'Default Overview',
    columns: [
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
    ],
    isBuiltIn: true,
  },
  {
    id: 'financials',
    name: 'Budget & Financials',
    columns: [
      'Request ID',
      'Investor',
      'Budget',
      'Property Type',
      'Offers Count',
      'Status',
      'Created Date',
    ],
    isBuiltIn: true,
  },
  {
    id: 'specs-location',
    name: 'Specs & Location',
    columns: [
      'Request ID',
      'Investor',
      'Property Type',
      'Bedrooms',
      'Area',
      'Country',
      'City',
      'Status',
    ],
    isBuiltIn: true,
  },
]

const requestColumnCategories: ColumnCategory[] = [
  {
    id: 'general',
    name: 'General',
    items: [
      { id: 'Request ID', label: 'Request ID' },
      { id: 'Investor', label: 'Investor Name & Avatar' },
      { id: 'Status', label: 'Status' },
      { id: 'Created Date', label: 'Created Date' },
    ],
  },
  {
    id: 'property',
    name: 'Property Specs',
    items: [
      { id: 'Property Type', label: 'Property Type' },
      { id: 'Bedrooms', label: 'Bedrooms' },
      { id: 'Area', label: 'Area (sq ft)' },
      { id: 'Budget', label: 'Budget Range' },
      { id: 'Offers Count', label: 'Offers Count' },
    ],
  },
  {
    id: 'location',
    name: 'Location',
    items: [
      { id: 'Country', label: 'Country' },
      { id: 'City', label: 'City' },
    ],
  },
]

function renderRequestCell(
  col: string,
  req: PropertyRequest,
  options: {
    setSelectedRequest: (req: PropertyRequest) => void
    investorObj: any
    avatarSrc?: string
    cCode: string
    countryName: string
  }
) {
  const { setSelectedRequest, investorObj, avatarSrc, cCode, countryName } = options
  switch (col) {
    case 'Request ID':
      return (
        <button
          type="button"
          onClick={() => setSelectedRequest(req)}
          className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline cursor-pointer whitespace-nowrap"
        >
          {req.id}
        </button>
      )
    case 'Investor':
      return (
        <Link
          href={`/investors/${req.investorId || (req.investorName === 'Omar Nasser' ? 'IN-2045' : 'IN-2048')}`}
          className="flex items-center gap-3 font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] transition-colors whitespace-nowrap"
        >
          <TableAvatar
            src={avatarSrc}
            name={req.investorName}
            countryCode={cCode}
            size="md"
            variant="brand"
          />
          <div className="min-w-0">
            <p className="leading-[20px] whitespace-nowrap font-semibold text-[14px] text-[#1f2327]">
              {req.investorName}
            </p>
            <p className="text-[12px] leading-[16px] font-normal text-[#6f777f] whitespace-nowrap">
              {investorObj?.personalInfo?.occupation || 'Verified Buyer'}
            </p>
          </div>
        </Link>
      )
    case 'Budget':
      return (
        <span className="font-semibold text-[14px] leading-[20px] text-[#1f2327]">
          {req.budget}
        </span>
      )
    case 'Property Type':
      return (
        <div>
          <span className="font-semibold text-[14px] leading-[20px] text-[#1f2327] block whitespace-nowrap">
            {req.propertyType}
          </span>
          <span className="text-[12px] leading-[16px] text-[#6f777f] block whitespace-nowrap">
            {req.purpose}
          </span>
        </div>
      )
    case 'Bedrooms':
      return (
        <span className="font-medium text-[14px] leading-[20px] text-[#1f2327]">
          {req.bedrooms}
        </span>
      )
    case 'Area':
      return (
        <div className="flex items-center gap-1 whitespace-nowrap">
          {req.preferredAreas.slice(0, 2).map((a) => (
            <span
              key={a}
              className="rounded-[4px] bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327] whitespace-nowrap"
            >
              {a}
            </span>
          ))}
          {req.preferredAreas.length > 2 && (
            <span className="text-[12px] text-[#6f777f] font-medium whitespace-nowrap">
              +{req.preferredAreas.length - 2}
            </span>
          )}
        </div>
      )
    case 'Country':
      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap text-[14px] leading-[20px] text-[#1f2327]">
          <Flag code={cCode} size="s" />
          <span className="whitespace-nowrap">{countryName}</span>
        </div>
      )
    case 'City':
      return (
        <span className="text-[14px] leading-[20px] text-[#1f2327]">
          {req.preferredAreas[0] || 'Dubai'}
        </span>
      )
    case 'Offers Count':
      return (
        <FigmaTag
          status="Active"
          size="sm"
          label={`${req.offersCount} offers`}
          leftIcon={<MessageSquare className="size-[16px]" />}
        />
      )
    case 'Status':
      return <FigmaStatusBadge status={req.status} />
    case 'Created Date':
      return (
        <span className="text-[13px] leading-[18px] text-[#6f777f]">
          {req.created || '28 May 2026'}
        </span>
      )
    default:
      return null
  }
}

export function RequestsManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_platform_requests_records'

  const [requests, setRequests] = React.useState<PropertyRequest[]>(allPlatformRequests)
  const [viewMode, setViewMode] = React.useState<ViewMode>('table')
  const [query, setQuery] = React.useState('')
  const initialStatus = searchParams?.get('status') || searchParams?.get('tab') || 'All'
  const [statusFilter, setStatusFilter] = React.useState<string>(initialStatus)
  const [budgetFilter, setBudgetFilter] = React.useState<string>('All')
  const [countryFilter, setCountryFilter] = React.useState<string>('All')
  const [areaFilter, setAreaFilter] = React.useState<string>('All')
  const [propertyTypeFilter, setPropertyTypeFilter] = React.useState<string>('All')
  const [investorFilter, setInvestorFilter] = React.useState<string>('All')
  const [dateRange, setDateRange] = React.useState<string>('All Time')

  // Table customization state
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(REQUEST_DEFAULT_COLUMNS)
  const [activePresetId, setActivePresetId] = React.useState<string>('default')
  const [presets, setPresets] = React.useState<TableViewPreset[]>(defaultRequestPresets)

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
  const [headerCollapsed, setHeaderCollapsed] = React.useState(false)

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
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-3.5 sm:gap-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start justify-between sm:block gap-2">
              <div>
                <h1 className="text-[20px] sm:text-[32px] font-bold leading-[28px] sm:leading-[40px] text-[#1f2327]">
                  Property Requests
                </h1>
                <p className={cn("mt-0.5 text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-[#6f777f]", headerCollapsed && "hidden sm:block")}>
                  Monitor investor property briefs, track matching agents, manage proposal bids and pipeline closures.
                </p>
              </div>

              {/* Mobile Collapse Toggle Button */}
              <button
                type="button"
                onClick={() => setHeaderCollapsed(!headerCollapsed)}
                className="flex sm:hidden h-[30px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-[#f8f9fa] px-2.5 text-[11.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors shrink-0 cursor-pointer select-none"
                aria-label={headerCollapsed ? 'Expand header details' : 'Collapse header details'}
              >
                <span>{headerCollapsed ? 'Stats & Links' : 'Collapse'}</span>
                {headerCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
              </button>
            </div>

            {/* Quick Links */}
            <div className={cn("flex flex-wrap items-center gap-2", headerCollapsed && "hidden sm:flex")}>
              <Link
                href="/deals"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <FileCheck className="size-4 text-[#00c2cb]" />
                <span>Live Deals</span>
                <span className="rounded-full bg-[#dfefe8] px-1.5 py-0.2 text-[12px] leading-[16px] font-medium text-[#17b26a]">
                  {stats.closedCount}
                </span>
              </Link>
              <Link
                href="/verification"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <CheckCircle2 className="size-4 text-[#6f777f]" />
                <span>Verification Queue</span>
              </Link>
            </div>
          </div>

          {/* 5 Stat Metric Cards */}
          <div className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3", headerCollapsed && "hidden sm:grid")}>
            <MetricCard
              label="Total Requests"
              value={stats.total}
              icon={FileText}
              tone="neutral"
              active={statusFilter === 'All'}
              onClick={() => {
                setStatusFilter('All')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Open & Pitching"
              value={stats.openCount}
              icon={Layers}
              tone="info"
              active={statusFilter === 'Open'}
              onClick={() => {
                setStatusFilter('Open')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Matched & Negotiating"
              value={stats.matchedCount}
              icon={CheckCircle2}
              tone="success"
              active={statusFilter === 'Matched'}
              onClick={() => {
                setStatusFilter('Matched')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Closed & Deals"
              value={stats.closedCount}
              icon={FileCheck}
              tone="neutral"
              active={statusFilter === 'Closed'}
              onClick={() => {
                setStatusFilter('Closed')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Urgent & Priority"
              value={stats.urgentCount}
              icon={Flame}
              tone="warning"
              active={statusFilter === 'Urgent'}
              onClick={() => {
                setStatusFilter('Urgent')
                setCurrentPage(1)
              }}
            />
          </div>
        </header>

        {/* =========================================================================
            2. MAIN TABLE CONTAINER (Top Tabs + Toolbar + Data Table)
           ========================================================================= */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs & Actions Header Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Filter Tabs List - Swipeable on mobile */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none max-w-full py-1 -mx-1 px-1 sm:mx-0 sm:px-0 select-none">
                {(
                  [
                    { id: 'All', label: 'All Requests', count: stats.total },
                    { id: 'Open', label: 'Open', count: stats.openCount },
                    { id: 'Matched', label: 'Matched', count: stats.matchedCount },
                    { id: 'Closed', label: 'Closed', count: stats.closedCount },
                    { id: 'Urgent', label: 'Urgent', count: stats.urgentCount },
                    { id: 'Archived', label: 'Archived', count: requests.filter((r) => r.status === 'Archived').length },
                  ] as const
                ).map((item) => {
                  const isActive = statusFilter === item.id
                  return (
                    <a
                      key={item.id}
                      href={`/requests?status=${encodeURIComponent(item.id)}`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          return
                        }
                        e.preventDefault()
                        setStatusFilter(item.id)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap no-underline',
                        isActive
                          ? item.id === 'Matched'
                            ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                            : item.id === 'Urgent'
                            ? 'bg-[#f79009] text-white shadow-2xs font-semibold'
                            : 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.id === 'Urgent'
                            ? 'bg-[#fff5e5] text-[#f79009]'
                            : item.id === 'Matched'
                            ? 'bg-[#edfcf2] text-[#17b26a]'
                            : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {item.count}
                      </span>
                    </a>
                  )
                })}
              </div>

              {/* View Mode Switcher, Presets, Customize Columns, and Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between sm:justify-end pt-2 lg:pt-0 border-t border-[#f2f4f7] lg:border-t-0">
                <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap',
                      viewMode === 'table'
                        ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
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
                      'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap',
                      viewMode === 'timeline'
                        ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
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
                      'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap',
                      viewMode === 'kanban'
                        ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                        : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                    title="Kanban Board Pipeline"
                  >
                    <LayoutGrid className="size-3.5" />
                    <span>Pipeline</span>
                  </button>
                </div>

                {/* View Presets Dropdown */}
                <Dropdown
                  align="end"
                  floating
                  options={presets.map((p) => ({
                    label: p.name,
                    value: p.id,
                    icon: <Bookmark className="size-4 text-[#00c2cb]" />,
                  }))}
                  onSelect={(presetId) => {
                    const found = presets.find((p) => p.id === presetId)
                    if (found) {
                      setActivePresetId(presetId)
                      setVisibleColumns(found.columns)
                      toast({
                        variant: 'info',
                        title: 'View Changed',
                        description: `Switched to "${found.name}".`,
                      })
                    }
                  }}
                  trigger={
                    <button
                      type="button"
                      className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 sm:px-3 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0"
                    >
                      <Bookmark className="size-4 text-[#00c2cb] shrink-0" />
                      <span className="hidden sm:inline max-w-[120px] truncate whitespace-nowrap">
                        {presets.find((p) => p.id === activePresetId)?.name || 'Custom View'}
                      </span>
                      <ChevronDown className="size-3 text-[#9da4ae] shrink-0" />
                    </button>
                  }
                  ariaLabel="Select table template view"
                />

                {/* Customize Columns Button with responsive text */}
                <button
                  type="button"
                  onClick={() => setColumnsOpen(true)}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 sm:px-3 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap"
                  title="Customize Columns"
                >
                  <Settings2 className="size-4 text-[#6f777f] shrink-0" />
                  <span className="hidden sm:inline">Customize </span>
                  <span>Columns</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 sm:px-3 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap"
                >
                  <Download className="size-4 text-[#6f777f] shrink-0" />
                  <span className="hidden sm:inline">Export </span>
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap"
                >
                  <Plus className="size-4 text-white" />
                  <span className="whitespace-nowrap">Add Request</span>
                </button>
              </div>
            </div>

            {/* Horizontal Filter Toolbar: Search, Property Type, Country, Budget, DateRangePicker */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search requests by title, investor, or ID…"
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setCurrentPage(1)
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Property Type Filter */}
              <Dropdown
                align="start"
                value={propertyTypeFilter === 'All' ? 'All Types' : propertyTypeFilter}
                onSelect={(val) => {
                  setPropertyTypeFilter(val === 'All Types' ? 'All' : val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Property Type"
                options={['All Types', 'Residential', 'Commercial', 'Land', 'Hospitality', 'Industrial'].map((t) => ({
                  label: t,
                  value: t,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                    <Building2 className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{propertyTypeFilter === 'All' ? 'All Types' : propertyTypeFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Country Filter */}
              <Dropdown
                align="start"
                value={countryFilter === 'All' ? 'All Countries' : countryFilter}
                onSelect={(val) => {
                  setCountryFilter(val === 'All Countries' ? 'All' : val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Country"
                options={['All Countries', 'Saudi Arabia', 'Egypt', 'United Arab Emirates', 'United Kingdom'].map((c) => ({
                  label: c,
                  value: c,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                    <span>🌍</span>
                    <span className="whitespace-nowrap">{countryFilter === 'All' ? 'All Countries' : countryFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Budget Filter */}
              <Dropdown
                align="start"
                value={budgetFilter === 'All' ? 'All Budgets' : budgetFilter}
                onSelect={(val) => {
                  setBudgetFilter(val === 'All Budgets' ? 'All' : val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Budget Range"
                options={['All Budgets', 'Under $500k', '$500k - $1M', '$1M - $2M', '$2M+'].map((b) => ({
                  label: b,
                  value: b,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                    <DollarSign className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{budgetFilter === 'All' ? 'All Budgets' : budgetFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

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
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Reset filters
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
              VIEW 1: TABLE MODE (Standardized to Gold Standard Layout)
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
                    {visibleColumns.map((col) => (
                      <th key={col} className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">
                        {col}
                      </th>
                    ))}
                    <th className="whitespace-nowrap px-4 text-right text-[14px] font-semibold text-[#1f2327]">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={visibleColumns.length + 2} className="py-8 text-center text-[#6f777f]">
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
                      const investorObj = investorById(req.investorId) || investorById(req.investorName)
                      const avatarSrc = req.investorAvatar || investorObj?.avatar

                      return (
                        <tr
                          key={req.id}
                          className={cn(
                            'h-[64px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap',
                            isSelected && 'bg-[#e5f6f7]/40'
                          )}
                        >
                          <td className="w-12 px-4 text-center whitespace-nowrap">
                            <TableCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(req.id, !isSelected)}
                              ariaLabel={`Select request ${req.id}`}
                            />
                          </td>

                          {visibleColumns.map((col) => (
                            <td key={col} className="px-4 whitespace-nowrap font-sans">
                              {renderRequestCell(col, req, {
                                setSelectedRequest,
                                investorObj,
                                avatarSrc,
                                cCode,
                                countryName,
                              })}
                            </td>
                          ))}

                          {/* Actions */}
                          <td className="px-4 whitespace-nowrap text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/request-insights?id=${req.id}`}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#00c2cb] hover:bg-[#e5f6f7] transition-colors cursor-pointer"
                                title="Request AI Insights"
                              >
                                <Sparkles className="size-4" />
                              </Link>
                              <Dropdown
                                align="end"
                                floating
                                ariaLabel={`Actions for request ${req.id}`}
                                options={[
                                  { label: 'View Details', value: 'view', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                                  { label: 'Edit Request', value: 'edit', icon: <Pencil className="size-4 text-[#00c2cb]" /> },
                                  { label: 'Assign Admin', value: 'assign-admin', icon: <UserCheck className="size-4 text-emerald-600" /> },
                                  { label: 'Archive Request', value: 'archive', icon: <Archive className="size-4 text-[#6f777f]" /> },
                                  { label: 'Delete Request', value: 'delete', destructive: true, icon: <Trash2 className="size-4 text-rose-600" /> },
                                ]}
                                onSelect={(val) => {
                                  if (val === 'view') setSelectedRequest(req)
                                  else if (val === 'edit') setEditingRequest(req)
                                  else if (val === 'assign-admin') {
                                    setAssignAdminTargetRequests([req])
                                    setIsAssignAdminOpen(true)
                                  } else if (val === 'archive') handleArchiveRequest(req.id)
                                  else if (val === 'delete') handleDeleteRequest(req.id)
                                }}
                                trigger={
                                  <button
                                    type="button"
                                    className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
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

      {/* 6. Customize Table Dialog */}
      <CustomizeTableDialog
        isOpen={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        visibleColumns={visibleColumns}
        onApply={(cols, presetId) => {
          setVisibleColumns(cols)
          if (presetId) setActivePresetId(presetId)
        }}
        categories={requestColumnCategories}
        storageKeyPrefix="requests"
        activePresetId={activePresetId}
        presets={presets}
        onPresetsChange={setPresets}
      />
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
