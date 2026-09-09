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
  Flag as FlagIcon,
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
  X,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { AgentPlanBadge, FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { FilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { Dropdown } from '@/components/dashboard/menu'
import { DateRangePicker } from './date-range-picker'
import { cn } from '@/lib/utils'
import {
  type PlatformOffer,
  type OfferStatus,
  initialPlatformOffers,
} from '@/lib/offers-data'
import { OfferReviewModal } from './offer-review-modal'

const OFFER_STATUSES: (OfferStatus | 'All')[] = [
  'All',
  'Pending',
  'Accepted',
  'Rejected',
  'Withdrawn',
  'Expired',
  'Flagged',
]

const PRICE_RANGE_OPTIONS = [
  { label: 'All Prices', value: 'All' },
  { label: 'Under 2M AED', value: 'Under 2M' },
  { label: '2M – 5M AED', value: '2M-5M' },
  { label: '5M – 10M AED', value: '5M-10M' },
  { label: '10M+ AED (Ultra Luxury)', value: '10M+' },
]

const PROPERTY_TYPE_OPTIONS = [
  { label: 'All Types', value: 'All' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Townhouse', value: 'Townhouse' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Office', value: 'Office' },
]

export function OffersManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_platform_offers_records'

  const [offers, setOffers] = React.useState<PlatformOffer[]>(initialPlatformOffers)
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table')
  const [query, setQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')
  const [priceFilter, setPriceFilter] = React.useState<string>('All')
  const [typeFilter, setTypeFilter] = React.useState<string>('All')
  const [agencyFilter, setAgencyFilter] = React.useState<string>('All')
  const [dateRange, setDateRange] = React.useState<string>('All Time')

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [selectedOffer, setSelectedOffer] = React.useState<PlatformOffer | null>(null)
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)
  const [showFilters, setShowFilters] = React.useState(true)
  const [sortOption, setSortOption] = React.useState('newest')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  // Load from localStorage & check searchParams
  React.useEffect(() => {
    let currentOffers = initialPlatformOffers
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentOffers = parsed
          setOffers(parsed)
        }
      }
    } catch {}

    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      const found = currentOffers.find((o) => o.id.toLowerCase() === idFromUrl.toLowerCase())
      if (found) {
        setSelectedOffer(found)
      } else {
        setQuery(idFromUrl)
      }
    }
  }, [searchParams])

  const saveOffers = (newOffers: PlatformOffer[]) => {
    setOffers(newOffers)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newOffers))
    } catch {}
  }

  // Agency unique list
  const agencyOptions = React.useMemo(() => {
    const list = Array.from(new Set(offers.map((o) => o.agentAgency))).sort()
    return [{ label: 'All Brokerages', value: 'All' }, ...list.map((a) => ({ label: a, value: a }))]
  }, [offers])

  // Filtered offers
  const filteredOffers = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return offers.filter((item) => {
      const matchesQuery =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.propertyTitle.toLowerCase().includes(q) ||
        item.agentName.toLowerCase().includes(q) ||
        item.agentAgency.toLowerCase().includes(q) ||
        item.investorName.toLowerCase().includes(q) ||
        item.propertyLocation.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter

      let matchesPrice = true
      if (priceFilter === 'Under 2M') {
        matchesPrice = item.priceNumber < 2000000
      } else if (priceFilter === '2M-5M') {
        matchesPrice = item.priceNumber >= 2000000 && item.priceNumber <= 5000000
      } else if (priceFilter === '5M-10M') {
        matchesPrice = item.priceNumber > 5000000 && item.priceNumber <= 10000000
      } else if (priceFilter === '10M+') {
        matchesPrice = item.priceNumber > 10000000
      }

      const matchesType = typeFilter === 'All' || item.propertyType.toLowerCase() === typeFilter.toLowerCase()
      const matchesAgency = agencyFilter === 'All' || item.agentAgency === agencyFilter

      return matchesQuery && matchesStatus && matchesPrice && matchesType && matchesAgency
    })
  }, [offers, query, statusFilter, priceFilter, typeFilter, agencyFilter])

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / rowsPerPage))
  const paginatedOffers = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredOffers.slice(start, start + rowsPerPage)
  }, [filteredOffers, currentPage, rowsPerPage])

  // Stats calculation
  const stats = React.useMemo(() => {
    const total = offers.length
    const pending = offers.filter((o) => o.status === 'Pending').length
    const accepted = offers.filter((o) => o.status === 'Accepted').length
    const rejected = offers.filter((o) => o.status === 'Rejected').length
    const flagged = offers.filter((o) => o.status === 'Flagged').length
    const withdrawn = offers.filter((o) => o.status === 'Withdrawn').length
    const expired = offers.filter((o) => o.status === 'Expired').length
    return { total, pending, accepted, rejected, flagged, withdrawn, expired }
  }, [offers])

  // Handlers for Actions: Approve, Reject, Delete, Flag
  const handleApprove = (offerId: string) => {
    const updated = offers.map((o) =>
      o.id === offerId
        ? {
            ...o,
            status: 'Accepted' as OfferStatus,
            history: [
              {
                id: String(Date.now()),
                action: 'Offer Approved',
                actor: 'Compliance Officer',
                actorRole: 'Admin',
                timestamp: 'Just now',
                details: 'Offer verified and marked approved for investor',
              },
              ...o.history,
            ],
          }
        : o
    )
    saveOffers(updated)
    if (selectedOffer && selectedOffer.id === offerId) {
      setSelectedOffer(updated.find((o) => o.id === offerId) || null)
    }
    toast({ variant: 'success', title: 'Offer Approved', description: `Proposal #${offerId} accepted.` })
  }

  const handleReject = (offerId: string, reason: string) => {
    const updated = offers.map((o) =>
      o.id === offerId
        ? {
            ...o,
            status: 'Rejected' as OfferStatus,
            rejectionReason: reason,
            history: [
              {
                id: String(Date.now()),
                action: 'Offer Rejected',
                actor: 'Compliance Officer',
                actorRole: 'Admin',
                timestamp: 'Just now',
                details: `Reason: ${reason}`,
              },
              ...o.history,
            ],
          }
        : o
    )
    saveOffers(updated)
    if (selectedOffer && selectedOffer.id === offerId) {
      setSelectedOffer(updated.find((o) => o.id === offerId) || null)
    }
    toast({ variant: 'error', title: 'Offer Rejected', description: `Proposal #${offerId} rejected.` })
  }

  const handleFlag = (offerId: string, reason: string) => {
    const updated = offers.map((o) =>
      o.id === offerId
        ? {
            ...o,
            status: 'Flagged' as OfferStatus,
            flagReason: reason,
            history: [
              {
                id: String(Date.now()),
                action: 'Offer Flagged',
                actor: 'Compliance Officer',
                actorRole: 'Admin',
                timestamp: 'Just now',
                details: `Flag: ${reason}`,
              },
              ...o.history,
            ],
          }
        : o
    )
    saveOffers(updated)
    if (selectedOffer && selectedOffer.id === offerId) {
      setSelectedOffer(updated.find((o) => o.id === offerId) || null)
    }
    toast({ variant: 'info', title: 'Offer Flagged', description: `Proposal #${offerId} flagged for audit.` })
  }

  const handleDelete = (offerId: string) => {
    setConfirmDialog({
      title: 'Delete Property Proposal',
      description: `Are you sure you want to permanently delete proposal #${offerId}? All uploaded certificates and photos will be removed.`,
      confirmLabel: 'Delete Permanently',
      tone: 'danger',
      icon: 'delete',
      onConfirm: () => {
        const next = offers.filter((o) => o.id !== offerId)
        saveOffers(next)
        setSelectedIds((prev) => prev.filter((id) => id !== offerId))
        if (selectedOffer && selectedOffer.id === offerId) {
          setSelectedOffer(null)
        }
        toast({ variant: 'error', title: 'Offer Deleted', description: `Proposal #${offerId} removed.` })
        setConfirmDialog(null)
      },
    })
  }

  const handleExportCSV = () => {
    const headers = [
      'Offer ID',
      'Agent Name',
      'Agency',
      'Investor',
      'Request ID',
      'Property Title',
      'Type',
      'Bedrooms',
      'Location',
      'Price',
      'Status',
      'Submitted At',
    ]
    const rows = filteredOffers.map((o) => [
      o.id,
      o.agentName,
      o.agentAgency,
      o.investorName,
      o.requestId,
      `"${o.propertyTitle}"`,
      o.propertyType,
      o.bedrooms,
      `"${o.propertyLocation}"`,
      o.price,
      o.status,
      o.submittedAt,
    ])
    const csv = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `duseat_offers_${Date.now()}.csv`
    a.click()
    toast({ variant: 'success', title: 'Report Exported', description: `Exported ${filteredOffers.length} offers to CSV.` })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredOffers.map((o) => o.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const resetAllFilters = () => {
    setQuery('')
    setStatusFilter('All')
    setPriceFilter('All')
    setTypeFilter('All')
    setAgencyFilter('All')
    setDateRange('All Time')
  }

  const hasActiveFilters =
    query !== '' ||
    statusFilter !== 'All' ||
    priceFilter !== 'All' ||
    typeFilter !== 'All' ||
    agencyFilter !== 'All' ||
    dateRange !== 'All Time'

  return (
    <PlatformShell title="Property Offers" eyebrow="marketplace" query={query} onQueryChange={setQuery}>
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            1. TOP HEADER CARD
           ========================================================================= */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Offers & Proposals
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Audit, review, and moderate property proposals submitted by licensed RERA agents to verified investor briefs.
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
                  <span>Grid Cards</span>
                </button>
              </div>

              {/* Export Action */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. KPI STAT CARDS (5 Metrics)
           ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5 lg:gap-3">
          <MetricCard
            label="Total Offers"
            value={stats.total}
            tone="neutral"
            active={statusFilter === 'All'}
            onClick={() => setStatusFilter('All')}
          />
          <MetricCard
            label="Pending Review"
            value={stats.pending}
            tone="warning"
            active={statusFilter === 'Pending'}
            onClick={() => setStatusFilter('Pending')}
          />
          <MetricCard
            label="Accepted Deals"
            value={stats.accepted}
            tone="success"
            active={statusFilter === 'Accepted'}
            onClick={() => setStatusFilter('Accepted')}
          />
          <MetricCard
            label="Rejected / Flagged"
            value={stats.rejected + stats.flagged}
            tone="destructive"
            active={statusFilter === 'Rejected' || statusFilter === 'Flagged'}
            onClick={() => setStatusFilter('Rejected')}
          />
          <MetricCard
            label="Avg Offer Price"
            value={
              offers.length > 0
                ? `AED ${(offers.reduce((sum, o) => sum + o.priceNumber, 0) / offers.length / 1_000_000).toFixed(1)}M`
                : '—'
            }
            tone="brand"
          />
        </div>

        {/* =========================================================================
            3. TABLE WORKSPACE (Original GitHub Design: Top Tabs + Horizontal Filter Toolbar + Table)
           ========================================================================= */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          {/* Top Status Tabs & Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'All', label: 'All offers', count: stats.total },
                  { id: 'Pending', label: 'Pending review', count: stats.pending },
                  { id: 'Accepted', label: 'Accepted deals', count: stats.accepted },
                  { id: 'Rejected', label: 'Rejected', count: stats.rejected },
                  { id: 'Flagged', label: 'Flagged', count: stats.flagged },
                  { id: 'Withdrawn', label: 'Withdrawn', count: stats.withdrawn },
                  { id: 'Expired', label: 'Expired', count: stats.expired },
                ] as const
              ).map((item) => {
                const isActive = statusFilter === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatusFilter(item.id as OfferStatus | 'All')}
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
                        item.id === 'Flagged'
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

            <div className="flex items-center gap-2">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-[13px] text-[#6f777f]">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="newest">Newest Submitted</option>
                  <option value="highest-price">Highest Price</option>
                  <option value="lowest-price">Lowest Price</option>
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
                placeholder="Search ID, agent, property..."
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

            {/* Property Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
            >
              <option value="All">All Property Types</option>
              {PROPERTY_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Price Tier Filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
            >
              {PRICE_RANGE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
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
              statusFilter !== 'All' ||
              typeFilter !== 'All' ||
              priceFilter !== 'All' ||
              agencyFilter !== 'All' ||
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

          {/* BULK ACTIONS BAR */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#e5f6f7] px-4 py-2.5 sm:px-6 border-b border-[#00c2cb]/30 ant-fade-in">
              <span className="text-[13px] font-medium text-[#00848b]">
                {selectedIds.length} offer(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = offers.map((o) => (selectedIds.includes(o.id) ? { ...o, status: 'Accepted' as OfferStatus } : o))
                    saveOffers(updated)
                    setSelectedIds([])
                    toast({ variant: 'success', title: 'Batch Approved', description: `Approved ${selectedIds.length} proposals.` })
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#17b26a] px-3 text-[12px] font-medium text-white hover:bg-[#139757] transition-colors cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Approve Selected</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = offers.map((o) => (selectedIds.includes(o.id) ? { ...o, status: 'Rejected' as OfferStatus, rejectionReason: 'Batch rejected by admin' } : o))
                    saveOffers(updated)
                    setSelectedIds([])
                    toast({ variant: 'error', title: 'Batch Rejected', description: `Rejected ${selectedIds.length} proposals.` })
                  }}
                  className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3 text-[12px] font-medium text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer shadow-2xs"
                >
                  <XCircle className="size-3.5" />
                  <span>Reject Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: TABLE MODE
             ========================================================================= */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1300px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 whitespace-nowrap">
                    <th className="w-12 px-4 whitespace-nowrap">
                      <TableCheckbox
                        checked={filteredOffers.length > 0 && selectedIds.length === filteredOffers.length}
                        onChange={() => handleSelectAll(selectedIds.length !== filteredOffers.length)}
                        ariaLabel="Select all offers"
                      />
                    </th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Offer ID</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Agent & Agency</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Target Investor Request</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Property Specs</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Location</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Offer Price</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Docs</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Status</th>
                    <th className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Submitted Date</th>
                    <th className="px-4 text-right text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedOffers.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-[#6f777f]">
                        <EmptyState
                          title="No property offers found"
                          description="Try adjusting your filters or search keywords"
                          actionLabel="Reset filters"
                          onAction={resetAllFilters}
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedOffers.map((item) => {
                      const isSelected = selectedIds.includes(item.id)

                      return (
                        <tr
                          key={item.id}
                          className={cn('h-[60px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap', isSelected && 'bg-[#e5f6f7]/40')}
                        >
                          <td className="w-12 px-4 whitespace-nowrap">
                            <TableCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(item.id, !isSelected)}
                              ariaLabel={`Select offer ${item.id}`}
                            />
                          </td>
                          <td className="px-4 font-mono text-[13px] font-semibold text-[#1f2327] whitespace-nowrap">
                            {item.id}
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5 whitespace-nowrap">
                              <TableAvatar
                                src={item.agentAvatar}
                                name={item.agentName}
                                size="md"
                                variant="brand"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-[#1f2327] text-[13px]">{item.agentName}</p>
                                <span className="text-[11px] text-[#6f777f] block whitespace-nowrap">{item.agentAgency}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <div>
                              <p className="font-semibold text-[#1f2327] text-[13px]">{item.investorName}</p>
                              <p className="font-mono text-[11px] text-[#6f777f]">{item.requestId}</p>
                            </div>
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-[#1f2327] text-[13px]">{item.propertyTitle}</p>
                              <div className="flex items-center gap-1 text-[11px] text-[#6f777f]">
                                <span>{item.propertyType}</span>
                                <span>•</span>
                                <span>{item.bedrooms}</span>
                                <span>•</span>
                                <span>{item.sizeSqFt} sq.ft</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <span className="text-[13px] text-[#6f777f] flex items-center gap-1">
                              <MapPin className="size-3 text-[#00c2cb]" />
                              {item.propertyLocation}
                            </span>
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <span className="font-semibold text-[#1f2327] text-[13px]">{item.price}</span>
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-[#eff1f3] px-2 py-0.5 text-[11px] font-medium text-[#1f2327]">
                              <FileCheck className="size-3 text-[#17b26a]" />
                              {item.documents.length} files
                            </span>
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <FigmaStatusBadge status={item.status} />
                          </td>
                          <td className="px-4 text-[13px] text-[#6f777f] whitespace-nowrap">
                            {item.submittedAt}
                          </td>
                          <td className="px-4 whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedOffer(item)}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-[#eff1f3] hover:bg-[#d3d5d7] transition-colors cursor-pointer"
                                title="Inspect Offer 360"
                              >
                                <Eye className="size-4 text-[#00c2cb]" />
                              </button>

                              {item.status !== 'Accepted' && (
                                <button
                                  type="button"
                                  onClick={() => handleApprove(item.id)}
                                  className="flex size-8 items-center justify-center rounded-[6px] border border-[#17b26a]/30 bg-[#dfefe8] text-[#17b26a] hover:bg-[#dfefe8]/80 cursor-pointer"
                                  title="Approve Offer"
                                >
                                  <CheckCircle2 className="size-4" />
                                </button>
                              )}

                              {item.status !== 'Rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleReject(item.id, 'Standard compliance rejection')}
                                  className="flex size-8 items-center justify-center rounded-[6px] border border-[#d92d20]/30 bg-[#f3e1e0] text-[#d92d20] hover:bg-[#f3e1e0]/80 cursor-pointer"
                                  title="Reject Offer"
                                >
                                  <XCircle className="size-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleFlag(item.id, 'Flagged during dashboard review')}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#f79009]/30 bg-[#fffaf0] text-[#b54708] hover:bg-[#fffaf0]/80 cursor-pointer"
                                title="Flag for Review"
                              >
                                <FlagIcon className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
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
              VIEW 2: GRID CARDS VIEW
             ========================================================================= */}
          {viewMode === 'grid' && (
            <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedOffers.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs hover:border-[#00c2cb] transition-colors flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-black/10 overflow-hidden">
                    <img src={item.photos[0]} alt={item.propertyTitle} className="size-full object-cover" />
                    <div className="absolute top-2.5 left-2.5">
                      <FigmaStatusBadge status={item.status} />
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-medium text-white">
                      {item.price}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[12px] text-[#6f777f]">
                        <span className="font-mono">{item.id}</span>
                        <span>{item.submittedAt}</span>
                      </div>
                      <h3 className="font-medium text-[15px] text-[#1f2327] line-clamp-1">{item.propertyTitle}</h3>
                      <p className="text-[12px] text-[#6f777f] flex items-center gap-1">
                        <MapPin className="size-3 text-[#00c2cb]" />
                        {item.propertyLocation}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#d3d5d7] text-[12px]">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.agentAvatar}
                          alt=""
                          className="size-7 rounded-full object-cover border border-[#d3d5d7]"
                        />
                        <div className="leading-tight">
                          <p className="font-semibold text-[#1f2327] text-[12px]">{item.agentName}</p>
                          <p className="text-[11px] text-[#6f777f]">{item.agentAgency}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] text-[#6f777f]">Investor Brief</p>
                        <p className="font-semibold text-[#1f2327] text-[12px]">{item.investorName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedOffer(item)}
                        className="flex-1 h-[34px] rounded-[8px] bg-[#00c2cb] text-[13px] font-medium text-white hover:bg-[#00a8b0] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                      >
                        Inspect Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="flex size-8 items-center justify-center rounded-[8px] bg-[#dfefe8] text-[#17b26a] hover:bg-[#17b26a] hover:text-white transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <CheckCircle2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Global Pagination Bar */}
          <div className="mt-auto border-t border-[#d3d5d7]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOffers.length}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(newSize) => {
                setRowsPerPage(newSize)
                setCurrentPage(1)
              }}
              itemLabel="offers"
            />
          </div>
        </section>
      </div>

      {/* 360 OFFER REVIEW MODAL */}
      {selectedOffer && (
        <OfferReviewModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onFlag={handleFlag}
          onDelete={handleDelete}
        />
      )}

      {/* CONFIRM DIALOG */}
      {confirmDialog && (
        <ConfirmDialog request={confirmDialog} onClose={() => setConfirmDialog(null)} />
      )}
    </PlatformShell>
  )
}

export function OffersManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <OffersManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
