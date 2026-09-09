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
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Building,
  DollarSign,
  Layers,
  FileCheck,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  SlidersHorizontal,
  LayoutGrid,
  List,
  UserCheck,
  X,
  FileText,
  User,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { DealDetailModal } from './deal-detail-modal'
import { CompleteDealModal } from './complete-deal-modal'
import { CancelDealModal } from './cancel-deal-modal'
import { AssignDealManagerModal } from './assign-deal-manager-modal'
import { ScheduleExportModal } from './schedule-export-modal'
import { AgentPlanBadge, FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { StatusFilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { Dropdown } from '@/components/dashboard/menu'
import { DateRangePicker } from './date-range-picker'
import { cn } from '@/lib/utils'
import {
  type PlatformDeal,
  type DealStatus,
  initialPlatformDeals,
} from '@/lib/deals-data'

const STATUS_TABS: { id: DealStatus | 'All'; label: string }[] = [
  { id: 'All', label: 'All Deals' },
  { id: 'Active', label: 'Active' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Cancelled', label: 'Cancelled' },
  { id: 'Failed', label: 'Failed' },
]

const PROPERTY_TYPES = [
  { label: 'All Property Types', value: 'All Types' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Office', value: 'Office' },
  { label: 'Townhouse', value: 'Townhouse' },
]

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Failed', value: 'Failed' },
]

export function DealsManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_deals_records'

  const [deals, setDeals] = React.useState<PlatformDeal[]>(initialPlatformDeals)
  const [query, setQuery] = React.useState('')
  const [statusTab, setStatusTab] = React.useState<DealStatus | 'All'>('All')
  const [statusDropdown, setStatusDropdown] = React.useState('All')
  const [propertyTypeFilter, setPropertyTypeFilter] = React.useState('All Types')
  const [agencyFilter, setAgencyFilter] = React.useState('All Agencies')
  const [investorFilter, setInvestorFilter] = React.useState('All Investors')
  const [dateRange, setDateRange] = React.useState('All Time')
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table')

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [showFilters, setShowFilters] = React.useState(true)
  const [sortOption, setSortOption] = React.useState('newest')

  // Modals state
  const [selectedDeal, setSelectedDeal] = React.useState<PlatformDeal | null>(null)
  const [completeModalDeal, setCompleteModalDeal] = React.useState<PlatformDeal | null>(null)
  const [cancelModalDeal, setCancelModalDeal] = React.useState<PlatformDeal | null>(null)
  const [assignManagerDealId, setAssignManagerDealId] = React.useState<string | null>(null)
  const [scheduleExportOpen, setScheduleExportOpen] = React.useState(false)

  React.useEffect(() => {
    let currentDeals = initialPlatformDeals
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentDeals = parsed
          setDeals(parsed)
        }
      }
    } catch {}

    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      const found = currentDeals.find((d) => d.id.toLowerCase() === idFromUrl.toLowerCase())
      if (found) {
        setSelectedDeal(found)
      } else {
        setQuery(idFromUrl)
      }
    }
  }, [searchParams])

  const saveDeals = (newDeals: PlatformDeal[]) => {
    setDeals(newDeals)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newDeals))
    } catch {}
  }

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  // Complete Deal Handler
  const handleCompleteDeal = (dealId: string) => {
    const updated = deals.map((d) =>
      d.id === dealId
        ? {
            ...d,
            status: 'Completed' as DealStatus,
            escrowStatus: 'Released' as const,
            completedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeline: [
              ...d.timeline,
              {
                id: `t-${Date.now()}`,
                title: 'Deal Completed & Escrow Disbursed',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                done: true,
                desc: 'Official conveyance completed at DLD and commission transferred.',
              },
            ],
          }
        : d
    )
    saveDeals(updated)
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal({ ...selectedDeal, status: 'Completed', escrowStatus: 'Released' })
    }
    notify('Deal Completed', `Transaction ${dealId} has been successfully completed and funds released.`)
  }

  // Cancel Deal Handler
  const handleCancelDeal = (dealId: string, reason: string, notes: string) => {
    const updated = deals.map((d) =>
      d.id === dealId
        ? {
            ...d,
            status: 'Cancelled' as DealStatus,
            escrowStatus: 'Refunding' as const,
            notes: [
              {
                id: `n-${Date.now()}`,
                author: 'Ahmad Khaled (Admin)',
                role: 'Manager',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                text: `Deal cancelled. Reason: ${reason}${notes ? ` - ${notes}` : ''}`,
              },
              ...d.notes,
            ],
            timeline: [
              ...d.timeline,
              {
                id: `t-${Date.now()}`,
                title: 'Deal Cancelled & Escrow Refund Initiated',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                done: true,
                desc: `Reason: ${reason}`,
              },
            ],
          }
        : d
    )
    saveDeals(updated)
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal({ ...selectedDeal, status: 'Cancelled', escrowStatus: 'Refunding' })
    }
    notify('Deal Cancelled', `Transaction ${dealId} marked cancelled and refund initiated.`, 'error')
  }

  // Assign Manager Handler
  const handleAssignManager = (dealId: string, managerName: string) => {
    const updated = deals.map((d) =>
      d.id === dealId
        ? {
            ...d,
            assignedManager: managerName,
            notes: [
              {
                id: `n-${Date.now()}`,
                author: 'System Admin',
                role: 'System',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                text: `Assigned conveyance manager updated to ${managerName}.`,
              },
              ...d.notes,
            ],
          }
        : d
    )
    saveDeals(updated)
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal({ ...selectedDeal, assignedManager: managerName })
    }
    notify('Manager Assigned', `${managerName} assigned as deal manager for ${dealId}.`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const exportRows = filteredDeals.map((d) => [
      d.id,
      `"${d.investorName}"`,
      `"${d.agentName} - ${d.agentAgency}"`,
      `"${d.propertyTitle}"`,
      `"${d.dealValue}"`,
      `"${d.commissionAmount}"`,
      d.status,
      d.startDate,
      d.completedDate || d.expectedCloseDate,
    ])
    const csv =
      'data:text/csv;charset=utf-8,Deal ID,Investor,Agent & Agency,Property,Deal Value,Commission,Status,Created Date,Last Updated\n' +
      exportRows.map((r) => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `duseat_deals_pipeline_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Export Started', 'Deals pipeline CSV downloaded successfully.')
  }

  // Unique Dropdown Options
  const agencyOptions = React.useMemo(() => {
    const set = new Set(deals.map((d) => d.agentAgency))
    return ['All Agencies', ...Array.from(set)].map((a) => ({ label: a, value: a }))
  }, [deals])

  const investorOptions = React.useMemo(() => {
    const set = new Set(deals.map((d) => d.investorName))
    return ['All Investors', ...Array.from(set)].map((i) => ({ label: i, value: i }))
  }, [deals])

  // Filtered dataset
  const filteredDeals = React.useMemo(() => {
    return deals.filter((d) => {
      const matchStatusTab = statusTab === 'All' || d.status === statusTab
      const matchStatusDrop = statusDropdown === 'All' || d.status === statusDropdown
      const matchType = propertyTypeFilter === 'All Types' || d.propertyType === propertyTypeFilter
      const matchAgency = agencyFilter === 'All Agencies' || d.agentAgency === agencyFilter
      const matchInvestor = investorFilter === 'All Investors' || d.investorName === investorFilter
      const matchQuery =
        !query ||
        d.id.toLowerCase().includes(query.toLowerCase()) ||
        d.propertyTitle.toLowerCase().includes(query.toLowerCase()) ||
        d.investorName.toLowerCase().includes(query.toLowerCase()) ||
        d.agentName.toLowerCase().includes(query.toLowerCase()) ||
        d.propertyLocation.toLowerCase().includes(query.toLowerCase())
      return matchStatusTab && matchStatusDrop && matchType && matchAgency && matchInvestor && matchQuery
    })
  }, [deals, statusTab, statusDropdown, propertyTypeFilter, agencyFilter, investorFilter, query])

  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / rowsPerPage))
  const paginatedDeals = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredDeals.slice(start, start + rowsPerPage)
  }, [filteredDeals, currentPage, rowsPerPage])

  // Real-time Status Counts for Filter Tabs
  const statusCounts = React.useMemo(() => {
    return {
      All: deals.length,
      Active: deals.filter((d) => d.status === 'Active').length,
      Completed: deals.filter((d) => d.status === 'Completed').length,
      Cancelled: deals.filter((d) => d.status === 'Cancelled').length,
      Failed: deals.filter((d) => d.status === 'Failed').length,
    }
  }, [deals])

  // 6 Top Metrics
  const totalDealsCount = deals.length
  const activeCount = deals.filter((d) => d.status === 'Active').length
  const completedCount = deals.filter((d) => d.status === 'Completed').length
  const cancelledFailedCount = deals.filter((d) => d.status === 'Cancelled' || d.status === 'Failed').length

  const totalDealValueNumber = deals.reduce((acc, d) => acc + (d.dealValueNumber || 0), 0)
  const totalCommissionNumber = deals.reduce((acc, d) => {
    const val = d.dealValueNumber || 0
    return acc + val * 0.02
  }, 0)

  const formattedTotalValue =
    totalDealValueNumber >= 1000000
      ? `AED ${(totalDealValueNumber / 1000000).toFixed(1)}M`
      : `AED ${(totalDealValueNumber / 1000).toFixed(0)}K`

  const formattedTotalCommission =
    totalCommissionNumber >= 1000000
      ? `AED ${(totalCommissionNumber / 1000000).toFixed(2)}M`
      : `AED ${(totalCommissionNumber / 1000).toFixed(0)}K`

  const hasActiveFilters =
    query !== '' ||
    statusTab !== 'All' ||
    statusDropdown !== 'All' ||
    propertyTypeFilter !== 'All Types' ||
    agencyFilter !== 'All Agencies' ||
    investorFilter !== 'All Investors' ||
    dateRange !== 'All Time'

  const resetAllFilters = () => {
    setQuery('')
    setStatusTab('All')
    setStatusDropdown('All')
    setPropertyTypeFilter('All Types')
    setAgencyFilter('All Agencies')
    setInvestorFilter('All Investors')
    setDateRange('All Time')
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredDeals.map((d) => d.id) : [])
  }

  const handleSelectRow = (dealId: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, dealId] : prev.filter((id) => id !== dealId)))
  }

  const currentManagerForAssign = React.useMemo(() => {
    if (!assignManagerDealId) return ''
    const found = deals.find((d) => d.id === assignManagerDealId)
    return found?.assignedManager || 'Ahmad Khaled'
  }, [assignManagerDealId, deals])

  return (
    <PlatformShell
      title="Deals & Transactions"
      eyebrow="marketplace"
      query={query}
      onQueryChange={setQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            1. TOP HEADER CARD (Clean, No Kicker)
           ========================================================================= */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Deals & Transactions
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Track active transactions, escrow security, legal conveyance, and commission disbursements across the marketplace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switchers */}
              <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium transition-all cursor-pointer',
                    viewMode === 'table' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <List className="size-3.5" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium transition-all cursor-pointer',
                    viewMode === 'grid' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <LayoutGrid className="size-3.5" />
                  <span>Cards</span>
                </button>
              </div>

              {/* Schedule Export */}
              <button
                type="button"
                onClick={() => setScheduleExportOpen(true)}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                <Clock className="size-4 text-[#6f777f]" />
                <span>Schedule Export</span>
              </button>

              {/* Export CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <Download className="size-4" />
                <span>Export Deals</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. KPI SUMMARY SECTION (6 Summary Metric Cards)
           ========================================================================= */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard
            label="Total Deals"
            value={totalDealsCount}
            tone="neutral"
            active={statusTab === 'All'}
            onClick={() => setStatusTab('All')}
          />
          <MetricCard
            label="Active Deals"
            value={activeCount}
            tone="brand"
            active={statusTab === 'Active'}
            onClick={() => setStatusTab('Active')}
          />
          <MetricCard
            label="Completed Deals"
            value={completedCount}
            tone="success"
            active={statusTab === 'Completed'}
            onClick={() => setStatusTab('Completed')}
          />
          <MetricCard
            label="Cancelled / Failed"
            value={cancelledFailedCount}
            tone="destructive"
            active={statusTab === 'Cancelled' || statusTab === 'Failed'}
            onClick={() => setStatusTab('Cancelled')}
          />
          <MetricCard
            label="Total Deal Value"
            value={formattedTotalValue}
            tone="brand"
          />
          <MetricCard
            label="Total Commission"
            value={formattedTotalCommission}
            tone="warning"
          />
        </div>

        {/* =========================================================================
            3. TABLE WORKSPACE (Original GitHub Design: Top Tabs + Horizontal Filter Toolbar + Table)
           ========================================================================= */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          {/* Top Status Tabs & Quick View Switcher Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'All', label: 'All deals', count: statusCounts.All },
                  { id: 'Active', label: 'Active pipeline', count: statusCounts.Active },
                  { id: 'Completed', label: 'Completed', count: statusCounts.Completed },
                  { id: 'Cancelled', label: 'Cancelled', count: statusCounts.Cancelled },
                  { id: 'Failed', label: 'Failed', count: statusCounts.Failed },
                ] as const
              ).map((item) => {
                const isActive = statusTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatusTab(item.id as DealStatus | 'All')}
                    className={cn(
                      'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn',
                      isActive
                        ? 'bg-[#1f2327] text-white shadow-2xs'
                        : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                        isActive ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                      )}
                    >
                      {item.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-[13px] text-[#6f777f]">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest-value">Highest Value</option>
                  <option value="highest-commission">Highest Commission</option>
                </select>
              </div>

              {/* View Switchers */}
              <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium transition-all cursor-pointer',
                    viewMode === 'table' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <List className="size-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium transition-all cursor-pointer',
                    viewMode === 'grid' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Filters Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 p-4 sm:p-5 pb-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID, investor, agent, property…"
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

            {/* Milestone Status Filter */}
            <select
              value={statusDropdown}
              onChange={(e) => setStatusDropdown(e.target.value)}
              className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Property Type Filter */}
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
            >
              <option value="All Types">All Property Types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Brokerage Agency Filter */}
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
            >
              {agencyOptions.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* Date Range Picker */}
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            {/* Reset Filters Link */}
            {(query ||
              statusTab !== 'All' ||
              statusDropdown !== 'All' ||
              propertyTypeFilter !== 'All Types' ||
              agencyFilter !== 'All Agencies' ||
              investorFilter !== 'All Investors' ||
              dateRange !== 'All Time') && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* BULK ACTIONS STRIP */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#e5f6f7] px-4 py-2.5 sm:px-6 border-b border-[#00c2cb]/30 ant-fade-in">
              <span className="text-[13px] font-semibold text-[#00848b]">
                {selectedIds.length} deal(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = deals.map((d) => (selectedIds.includes(d.id) ? { ...d, status: 'Completed' as DealStatus, escrowStatus: 'Released' as const } : d))
                    saveDeals(updated)
                    setSelectedIds([])
                    notify('Batch Completed', `Completed ${selectedIds.length} deals and released funds.`)
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#17b26a] px-3 text-[12px] font-semibold text-white hover:bg-[#139757] transition-colors cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Complete Selected</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = deals.map((d) => (selectedIds.includes(d.id) ? { ...d, status: 'Cancelled' as DealStatus, escrowStatus: 'Refunding' as const } : d))
                    saveDeals(updated)
                    setSelectedIds([])
                    notify('Batch Cancelled', `Cancelled ${selectedIds.length} transactions.`, 'error')
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3 text-[12px] font-semibold text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer shadow-2xs"
                >
                  <XCircle className="size-3.5" />
                  <span>Cancel Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: TABLE MODE (10 Columns matching Specification)
             ========================================================================= */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1350px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 whitespace-nowrap">
                    <th className="w-12 px-4 whitespace-nowrap">
                      <TableCheckbox
                        checked={filteredDeals.length > 0 && selectedIds.length === filteredDeals.length}
                        onChange={() => handleSelectAll(selectedIds.length !== filteredDeals.length)}
                        ariaLabel="Select all deals"
                      />
                    </th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Deal ID</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Investor</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Agent & Agency</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Property</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Deal Value</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Commission</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Status</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Created Date</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Last Updated</th>
                    <th className="px-4 text-right text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedDeals.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-[#6f777f]">
                        <EmptyState
                          title="No pipeline deals found"
                          description="Try adjusting your search query or reset your active filters."
                          actionLabel="Reset filters"
                          onAction={resetAllFilters}
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedDeals.map((deal) => {
                      const isSelected = selectedIds.includes(deal.id)
                      const countryCode = getCountryCode(deal.investorCountry)
                      const agentCountryCode = getCountryCode(deal.agentCountry)

                      return (
                        <tr
                          key={deal.id}
                          className={cn(
                            'h-[60px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap',
                            isSelected && 'bg-[#e5f6f7]/40'
                          )}
                        >
                          <td className="w-12 px-4 whitespace-nowrap">
                            <TableCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(deal.id, !isSelected)}
                              ariaLabel={`Select deal ${deal.id}`}
                            />
                          </td>

                          {/* 1. Deal ID */}
                          <td className="px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedDeal(deal)}
                              className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline cursor-pointer whitespace-nowrap"
                            >
                              {deal.id}
                            </button>
                          </td>

                          {/* 2. Investor */}
                          <td className="px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5 whitespace-nowrap">
                              <Link href={`/investors/${deal.investorId}`} className="cursor-pointer">
                                <TableAvatar
                                  src={deal.investorAvatar}
                                  name={deal.investorName}
                                  countryCode={countryCode}
                                  size="md"
                                  variant="brand"
                                />
                              </Link>
                              <div className="min-w-0">
                                <Link
                                  href={`/investors/${deal.investorId}`}
                                  className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors whitespace-nowrap"
                                >
                                  {deal.investorName}
                                </Link>
                                <span className="text-[12px] leading-[16px] text-[#6f777f] block whitespace-nowrap">{deal.investorCountry}</span>
                              </div>
                            </div>
                          </td>

                          {/* 3. Agent & Agency */}
                          <td className="px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5 whitespace-nowrap">
                              <Link href={`/agents/${deal.agentId}`} className="cursor-pointer">
                                <TableAvatar
                                  src={deal.agentAvatar}
                                  name={deal.agentName}
                                  countryCode={agentCountryCode}
                                  size="md"
                                  variant="brand"
                                />
                              </Link>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                  <Link
                                    href={`/agents/${deal.agentId}`}
                                    className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors whitespace-nowrap"
                                  >
                                    {deal.agentName}
                                  </Link>
                                  <AgentPlanBadge plan={deal.agentPlan} compact />
                                </div>
                                <span className="text-[12px] leading-[16px] text-[#6f777f] block whitespace-nowrap">{deal.agentAgency}</span>
                              </div>
                            </div>
                          </td>

                          {/* 4. Property */}
                          <td className="px-4 whitespace-nowrap">
                            <div>
                              <span className="font-semibold text-[#1f2327] text-[14px] leading-[20px] block max-w-[240px] truncate">{deal.propertyTitle}</span>
                              <span className="text-[12px] leading-[16px] text-[#6f777f] block whitespace-nowrap">{deal.propertyType} • {deal.propertyLocation}</span>
                            </div>
                          </td>

                          {/* 5. Deal Value */}
                          <td className="px-4 whitespace-nowrap">
                            <span className="font-semibold text-[#1f2327] text-[14px] leading-[20px]">{deal.dealValue}</span>
                          </td>

                          {/* 6. Commission */}
                          <td className="px-4 whitespace-nowrap">
                            <div>
                              <span className="font-semibold text-[#17b26a] text-[14px] leading-[20px] block">{deal.commissionAmount}</span>
                              <span className="text-[11px] leading-[14px] text-[#6f777f] block whitespace-nowrap">{deal.commissionRate} Split</span>
                            </div>
                          </td>

                          {/* 7. Status */}
                          <td className="px-4 whitespace-nowrap">
                            <FigmaStatusBadge status={deal.status} />
                          </td>

                          {/* 8. Created Date */}
                          <td className="px-4 whitespace-nowrap text-[13px] leading-[18px] text-[#6f777f]">
                            {deal.startDate}
                          </td>

                          {/* 9. Last Updated */}
                          <td className="px-4 whitespace-nowrap text-[13px] leading-[18px] text-[#6f777f]">
                            {deal.completedDate || deal.expectedCloseDate}
                          </td>

                          {/* 10. Actions */}
                          <td className="px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedDeal(deal)}
                                className="flex size-[32px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                                title="Open Deal Inspector"
                              >
                                <Eye className="size-3.5" />
                              </button>

                              {/* Active Deal Actions */}
                              {deal.status === 'Active' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setCompleteModalDeal(deal)}
                                    className="flex size-[32px] items-center justify-center rounded-[6px] bg-[#dfefe8] text-[#17b26a] hover:bg-[#17b26a] hover:text-white transition-colors cursor-pointer"
                                    title="Complete Deal"
                                  >
                                    <CheckCircle2 className="size-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCancelModalDeal(deal)}
                                    className="flex size-[32px] items-center justify-center rounded-[6px] bg-[#fee4e2] text-[#d92d20] hover:bg-[#d92d20] hover:text-white transition-colors cursor-pointer"
                                    title="Cancel Deal"
                                  >
                                    <XCircle className="size-3.5" />
                                  </button>
                                </>
                              )}

                              {/* Completed Actions */}
                              {deal.status === 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedDeal(deal)}
                                  className="flex size-[32px] items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#17b26a] hover:bg-[#dfefe8] transition-colors cursor-pointer"
                                  title="View Documents & Timeline"
                                >
                                  <FileCheck className="size-3.5" />
                                </button>
                              )}
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
              VIEW 2: GRID CARDS MODE
             ========================================================================= */}
          {viewMode === 'grid' && (
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3.5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[13px] font-semibold text-[#00c2cb]">{deal.id}</span>
                      <FigmaStatusBadge status={deal.status} />
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={deal.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                        alt=""
                        className="size-16 rounded-[8px] object-cover border border-[#d3d5d7] shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-[14px] text-[#1f2327] truncate">{deal.propertyTitle}</h4>
                        <p className="text-[12px] text-[#6f777f]">{deal.propertyLocation}</p>
                        <p className="font-bold text-[14px] text-[#00c2cb] mt-1">{deal.dealValue}</p>
                      </div>
                    </div>

                    <div className="border-t border-[#d3d5d7] pt-3 text-[12px] text-[#6f777f] space-y-1">
                      <p>Investor: <strong className="text-[#1f2327]">{deal.investorName}</strong></p>
                      <p>Agent: <strong className="text-[#1f2327]">{deal.agentName}</strong> ({deal.agentAgency})</p>
                      <p>Commission: <strong className="text-[#17b26a]">{deal.commissionAmount}</strong></p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#d3d5d7]">
                      <button
                        type="button"
                        onClick={() => setSelectedDeal(deal)}
                        className="text-[13px] font-semibold text-[#00c2cb] hover:underline"
                      >
                        View Deal Details →
                      </button>
                      {deal.status === 'Active' && (
                        <button
                          type="button"
                          onClick={() => setCompleteModalDeal(deal)}
                          className="h-[30px] rounded-[6px] bg-[#17b26a] px-3 text-[12px] font-semibold text-white hover:bg-[#139757]"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Pagination */}
          <div className="mt-auto border-t border-[#d3d5d7]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredDeals.length}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n)
                setCurrentPage(1)
              }}
              itemLabel="deals"
            />
          </div>
        </section>
      </div>

      {/* =========================================================================
          DIALOGS & MODALS
         ========================================================================= */}
      {/* 1. Main 10-Section Deal Details Modal */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onComplete={(id) => {
            handleCompleteDeal(id)
            setSelectedDeal(null)
          }}
          onCancel={(id) => {
            const found = deals.find((d) => d.id === id)
            if (found) setCancelModalDeal(found)
          }}
          onAssignManager={(id) => setAssignManagerDealId(id)}
        />
      )}

      {/* 2. Complete Deal Confirmation Modal */}
      {completeModalDeal && (
        <CompleteDealModal
          deal={completeModalDeal}
          isOpen={!!completeModalDeal}
          onClose={() => setCompleteModalDeal(null)}
          onConfirm={(id) => handleCompleteDeal(id)}
        />
      )}

      {/* 3. Cancel Deal Confirmation Modal */}
      {cancelModalDeal && (
        <CancelDealModal
          deal={cancelModalDeal}
          isOpen={!!cancelModalDeal}
          onClose={() => setCancelModalDeal(null)}
          onConfirm={(id, reason, notes) => handleCancelDeal(id, reason, notes)}
        />
      )}

      {/* 4. Assign Manager Modal */}
      {assignManagerDealId && (
        <AssignDealManagerModal
          dealId={assignManagerDealId}
          currentManager={currentManagerForAssign}
          isOpen={!!assignManagerDealId}
          onClose={() => setAssignManagerDealId(null)}
          onAssign={(id, name) => handleAssignManager(id, name)}
        />
      )}

      {/* 5. Schedule Export Modal */}
      <ScheduleExportModal
        isOpen={scheduleExportOpen}
        onClose={() => setScheduleExportOpen(false)}
        onSchedule={(data) => {
          notify('Export Scheduled', `Scheduled ${data.frequency} deals export to ${data.recipients.join(', ')}.`)
        }}
        defaultName="Duseat Deals & Escrow Pipeline - Export"
      />
    </PlatformShell>
  )
}

export function DealsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <DealsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
