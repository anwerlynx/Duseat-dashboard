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
  MoreHorizontal,
  Settings2,
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
import { CustomizeTableDialog, type TableViewPreset, type ColumnCategory } from './customize-table-dialog'

const OFFER_DEFAULT_COLUMNS = [
  'Offer ID',
  'Agent & Agency',
  'Target Investor Request',
  'Property Specs',
  'Location',
  'Offer Price',
  'Docs',
  'Status',
  'Submitted Date',
]

const defaultOfferPresets: TableViewPreset[] = [
  {
    id: 'default',
    name: 'Default Overview',
    columns: OFFER_DEFAULT_COLUMNS,
    isBuiltIn: true,
  },
  {
    id: 'property-financials',
    name: 'Property & Financials',
    columns: [
      'Offer ID',
      'Property Specs',
      'Location',
      'Offer Price',
      'Commission',
      'Payment Plan',
      'Handover Date',
      'Status',
    ],
    isBuiltIn: true,
  },
  {
    id: 'agent-focus',
    name: 'Agent & Brokerage',
    columns: [
      'Offer ID',
      'Agent & Agency',
      'Agent ID',
      'Agent Rating',
      'Agent Plan',
      'Offer Price',
      'Docs',
      'Status',
      'Submitted Date',
    ],
    isBuiltIn: true,
  },
  {
    id: 'compliance-audit',
    name: 'Compliance & Audit',
    columns: [
      'Offer ID',
      'Agent & Agency',
      'Target Investor Request',
      'Docs',
      'Status',
      'Submitted Date',
      'Expiry Date',
    ],
    isBuiltIn: true,
  },
]

const OFFER_COLUMN_CATEGORIES: ColumnCategory[] = [
  {
    id: 'general',
    name: 'General & Status',
    items: [
      { id: 'Offer ID', label: 'Offer ID' },
      { id: 'Status', label: 'Status' },
      { id: 'Submitted Date', label: 'Submitted Date' },
      { id: 'Expiry Date', label: 'Expiry Date' },
    ],
  },
  {
    id: 'agent',
    name: 'Agent Details',
    items: [
      { id: 'Agent & Agency', label: 'Agent & Agency' },
      { id: 'Agent ID', label: 'Agent ID' },
      { id: 'Agent Rating', label: 'Agent Rating' },
      { id: 'Agent Plan', label: 'Agent Plan' },
    ],
  },
  {
    id: 'request',
    name: 'Investor & Request',
    items: [
      { id: 'Target Investor Request', label: 'Target Investor Request' },
      { id: 'Investor Name', label: 'Investor Name' },
      { id: 'Request ID', label: 'Request ID' },
    ],
  },
  {
    id: 'property',
    name: 'Property Details',
    items: [
      { id: 'Property Specs', label: 'Property Specs' },
      { id: 'Property Title', label: 'Property Title' },
      { id: 'Location', label: 'Location' },
      { id: 'Property Type', label: 'Property Type' },
      { id: 'Handover Date', label: 'Handover Date' },
    ],
  },
  {
    id: 'financials',
    name: 'Financials & Docs',
    items: [
      { id: 'Offer Price', label: 'Offer Price' },
      { id: 'Commission', label: 'Commission' },
      { id: 'Payment Plan', label: 'Payment Plan' },
      { id: 'Docs', label: 'Docs' },
    ],
  },
]

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

function renderOfferCell(
  column: string,
  item: PlatformOffer,
  setSelectedOffer: (o: PlatformOffer) => void
) {
  switch (column) {
    case 'Offer ID':
      return (
        <button
          type="button"
          onClick={() => setSelectedOffer(item)}
          className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
        >
          {item.id}
        </button>
      )

    case 'Agent & Agency':
      return (
        <div className="flex items-center gap-2.5 whitespace-nowrap font-sans">
          <Link href={`/agents/${item.agentId}`} className="cursor-pointer">
            <TableAvatar
              src={item.agentAvatar}
              name={item.agentName}
              size="md"
              variant="brand"
            />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/agents/${item.agentId}`}
                className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors block"
              >
                {item.agentName}
              </Link>
              <span className="font-mono text-[11px] font-semibold text-[#00c2cb] bg-[#00c2cb]/10 px-1.5 py-0.2 rounded-[4px] shrink-0">
                {item.agentId}
              </span>
            </div>
            <span className="text-[12px] leading-[16px] text-[#6f777f] block whitespace-nowrap">{item.agentAgency}</span>
          </div>
        </div>
      )

    case 'Agent ID':
      return (
        <Link
          href={`/agents/${item.agentId}`}
          className="font-mono text-[13px] font-semibold text-[#00c2cb] hover:underline"
        >
          {item.agentId}
        </Link>
      )

    case 'Agent Rating':
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-[#1f2327] text-[13px]">
          ★ {item.agentRating.toFixed(1)}
        </span>
      )

    case 'Agent Plan':
      return <AgentPlanBadge plan={item.agentPlan} />

    case 'Target Investor Request':
      return (
        <div>
          <Link
            href={`/investors/${item.investorId || 'IN-2045'}`}
            className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors block"
          >
            {item.investorName}
          </Link>
          <Link
            href={`/request-insights?id=${item.requestId}`}
            className="font-mono text-[12px] text-[#00c2cb] hover:underline block"
          >
            {item.requestId}
          </Link>
        </div>
      )

    case 'Investor Name':
      return (
        <Link
          href={`/investors/${item.investorId || 'IN-2045'}`}
          className="font-semibold text-[#1f2327] text-[14px] leading-[20px] hover:text-[#00c2cb] hover:underline transition-colors"
        >
          {item.investorName}
        </Link>
      )

    case 'Request ID':
      return (
        <Link
          href={`/request-insights?id=${item.requestId}`}
          className="font-mono text-[13px] text-[#00c2cb] hover:underline"
        >
          {item.requestId}
        </Link>
      )

    case 'Property Specs':
      return (
        <div>
          <p className="font-semibold text-[#1f2327] text-[14px] leading-[20px]">{item.propertyTitle}</p>
          <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#6f777f]">
            <span>{item.propertyType}</span>
            <span>•</span>
            <span>{item.bedrooms}</span>
            <span>•</span>
            <span>{item.sizeSqFt} sq.ft</span>
          </div>
        </div>
      )

    case 'Property Title':
      return <span className="font-semibold text-[#1f2327] text-[14px]">{item.propertyTitle}</span>

    case 'Property Type':
      return (
        <span className="rounded-[6px] bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">
          {item.propertyType}
        </span>
      )

    case 'Location':
      return (
        <span className="text-[13px] leading-[18px] text-[#1f2327] flex items-center gap-1.5">
          <MapPin className="size-3.5 text-[#00c2cb]" />
          {item.propertyLocation}
        </span>
      )

    case 'Offer Price':
      return <span className="font-semibold text-[#1f2327] text-[14px] leading-[20px]">{item.price}</span>

    case 'Commission':
      return <span className="font-medium text-[#1f2327] text-[13px]">{item.commission}</span>

    case 'Payment Plan':
      return <span className="text-[13px] text-[#6f777f]">{item.paymentPlan}</span>

    case 'Handover Date':
      return <span className="text-[13px] text-[#6f777f]">{item.handoverDate}</span>

    case 'Docs':
      return (
        <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">
          <FileCheck className="size-3.5 text-[#17b26a]" />
          {item.documents.length} files
        </span>
      )

    case 'Status':
      return <FigmaStatusBadge status={item.status} />

    case 'Submitted Date':
      return <span className="text-[13px] leading-[18px] text-[#6f777f]">{item.submittedAt}</span>

    case 'Expiry Date':
      return <span className="text-[13px] text-[#6f777f]">{item.expiryDate}</span>

    default:
      return <span className="text-xs text-[#6f777f]">{(item as any)[column] || '—'}</span>
  }
}

export function OffersManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const storageKey = 'duseat_platform_offers_records'

  const [offers, setOffers] = React.useState<PlatformOffer[]>(initialPlatformOffers)
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table')
  const [query, setQuery] = React.useState('')
  const initialStatus = searchParams?.get('status') || searchParams?.get('tab') || 'All'
  const [statusFilter, setStatusFilter] = React.useState<string>(initialStatus)
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
  const [headerCollapsed, setHeaderCollapsed] = React.useState(false)

  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(OFFER_DEFAULT_COLUMNS)
  const [activePresetId, setActivePresetId] = React.useState('default')
  const [presets, setPresets] = React.useState<TableViewPreset[]>(defaultOfferPresets)

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
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-3.5 sm:gap-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start justify-between sm:block gap-2">
              <div>
                <h1 className="text-[20px] sm:text-[32px] font-bold leading-[28px] sm:leading-[40px] text-[#1f2327]">
                  Offers & Proposals
                </h1>
                <p className={cn("mt-0.5 text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-[#6f777f]", headerCollapsed && "hidden sm:block")}>
                  Audit, review, and moderate property proposals submitted by licensed RERA agents to verified investor briefs.
                </p>
              </div>

              {/* Mobile Collapse Toggle Button */}
              <button
                type="button"
                onClick={() => setHeaderCollapsed(!headerCollapsed)}
                className="flex sm:hidden h-[30px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-[#f8f9fa] px-2.5 text-[11.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors shrink-0 cursor-pointer select-none"
                aria-label={headerCollapsed ? 'Expand header details' : 'Collapse header details'}
              >
                <span>{headerCollapsed ? 'Stats & Tools' : 'Collapse'}</span>
                {headerCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
              </button>
            </div>

            <div className={cn("flex flex-wrap items-center gap-2 sm:gap-2.5", headerCollapsed && "hidden sm:flex")}>
              {/* View Switchers */}
              <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium transition-all cursor-pointer',
                    viewMode === 'table' ? 'bg-[#1f2327] text-white shadow-2xs font-semibold' : 'text-[#6f777f] hover:text-[#1f2327]'
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
                    viewMode === 'grid' ? 'bg-[#1f2327] text-white shadow-2xs font-semibold' : 'text-[#6f777f] hover:text-[#1f2327]'
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
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span className="whitespace-nowrap">Export CSV</span>
              </button>
            </div>
          </div>

          {/* 5 Stat Metric Cards */}
          <div className={cn("grid grid-cols-2 gap-2.5 lg:grid-cols-5 lg:gap-3", headerCollapsed && "hidden sm:grid")}>
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
              tone="info"
            />
          </div>
        </header>

        {/* =========================================================================
            3. TABLE WORKSPACE (Original GitHub Design: Top Tabs + Horizontal Filter Toolbar + Table)
           ========================================================================= */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Status Tabs & Actions Header Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Left Status Tabs - Swipeable */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none max-w-full py-1 -mx-1 px-1 sm:mx-0 sm:px-0 select-none">
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
                    <a
                      key={item.id}
                      href={`/offers?status=${encodeURIComponent(item.id)}`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          return
                        }
                        e.preventDefault()
                        setStatusFilter(item.id as OfferStatus | 'All')
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap no-underline',
                        isActive
                          ? item.id === 'Accepted'
                            ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                            : item.id === 'Pending'
                            ? 'bg-[#f79009] text-white shadow-2xs font-semibold'
                            : item.id === 'Rejected' || item.id === 'Flagged' || item.id === 'Expired'
                            ? 'bg-[#d92d20] text-white shadow-2xs font-semibold'
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
                            : item.id === 'Rejected' || item.id === 'Flagged' || item.id === 'Expired'
                            ? 'bg-[#fef3f2] text-[#d92d20]'
                            : item.id === 'Pending'
                            ? 'bg-[#fff5e5] text-[#f79009]'
                            : item.id === 'Accepted'
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

              {/* Right Controls: Sort, Switcher, Export */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between sm:justify-end pt-2 lg:pt-0 border-t border-[#f2f4f7] lg:border-t-0">
                <Dropdown
                  align="end"
                  value={sortOption}
                  onSelect={setSortOption}
                  ariaLabel="Sort by"
                  options={[
                    { label: 'Newest Submitted', value: 'newest' },
                    { label: 'Highest Price', value: 'highest-price' },
                    { label: 'Lowest Price', value: 'lowest-price' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                      <ArrowUpDown className="size-3.5 text-[#6f777f]" />
                      <span className="whitespace-nowrap">
                        {sortOption === 'highest-price'
                          ? 'Highest Price'
                          : sortOption === 'lowest-price'
                          ? 'Lowest Price'
                          : 'Newest Submitted'}
                      </span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium transition-all cursor-pointer whitespace-nowrap',
                      viewMode === 'table' ? 'bg-[#1f2327] text-white shadow-2xs font-semibold' : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    <List className="size-3.5" />
                    <span className="hidden sm:inline whitespace-nowrap">Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex h-[30px] items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium transition-all cursor-pointer whitespace-nowrap',
                      viewMode === 'grid' ? 'bg-[#1f2327] text-white shadow-2xs font-semibold' : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    <LayoutGrid className="size-3.5" />
                    <span className="hidden sm:inline whitespace-nowrap">Cards</span>
                  </button>
                </div>

                <Dropdown
                  align="end"
                  floating
                  options={presets.map((p) => ({ label: p.name, value: p.id }))}
                  onSelect={(val) => {
                    const preset = presets.find((p) => p.id === val)
                    if (preset) {
                      setActivePresetId(preset.id)
                      setVisibleColumns(preset.columns)
                      toast({ variant: 'info', title: 'View Applied', description: `Switched view template to "${preset.name}".` })
                    }
                  }}
                  trigger={
                    <button
                      type="button"
                      className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap shadow-2xs"
                    >
                      <SlidersHorizontal className="size-4 text-[#6f777f]" />
                      <span className="max-w-[90px] sm:max-w-[130px] truncate text-left">
                        {presets.find((p) => p.id === activePresetId)?.name || 'Custom View'}
                      </span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </button>
                  }
                  ariaLabel="Select table template view"
                />

                <button
                  type="button"
                  onClick={() => setColumnsOpen(true)}
                  className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 sm:px-3.5 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap shadow-2xs"
                >
                  <Settings2 className="size-4 text-[#6f777f]" />
                  <span className="hidden sm:inline">Customize </span>
                  <span>Columns</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 sm:px-3.5 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap"
                >
                  <Download className="size-4 text-[#6f777f]" />
                  <span className="whitespace-nowrap">Export</span>
                </button>
              </div>
            </div>

            {/* Horizontal Filters Toolbar Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ID, agent, property..."
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-8 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 transition-all"
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

              <Dropdown
                align="start"
                value={typeFilter}
                onSelect={setTypeFilter}
                ariaLabel="Filter by Property Type"
                options={[{ label: 'All Property Types', value: 'All' }, ...PROPERTY_TYPE_OPTIONS]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                    <Building className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{typeFilter === 'All' ? 'All Property Types' : typeFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              <Dropdown
                align="start"
                value={priceFilter}
                onSelect={setPriceFilter}
                ariaLabel="Filter by Price Tier"
                options={PRICE_RANGE_OPTIONS}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                    <DollarSign className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{PRICE_RANGE_OPTIONS.find((p) => p.value === priceFilter)?.label || priceFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              <Dropdown
                align="start"
                value={agencyFilter}
                onSelect={setAgencyFilter}
                ariaLabel="Filter by Agency"
                options={agencyOptions}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0">
                    <Building className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{agencyFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {(query ||
                statusFilter !== 'All' ||
                typeFilter !== 'All' ||
                priceFilter !== 'All' ||
                agencyFilter !== 'All' ||
                dateRange !== 'All Time') && (
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
                    {visibleColumns.map((col) => (
                      <th key={col} className="px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                    <th className="px-4 text-right text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedOffers.length === 0 ? (
                    <tr>
                      <td colSpan={visibleColumns.length + 2} className="py-8 text-center text-[#6f777f]">
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
                          className={cn(
                            'h-[64px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap',
                            isSelected && 'bg-[#e5f6f7]/40'
                          )}
                        >
                          <td className="w-12 px-4 whitespace-nowrap">
                            <TableCheckbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(item.id, !isSelected)}
                              ariaLabel={`Select offer ${item.id}`}
                            />
                          </td>
                          {visibleColumns.map((col) => (
                            <td key={col} className="px-4 whitespace-nowrap font-sans">
                              {renderOfferCell(col, item, setSelectedOffer)}
                            </td>
                          ))}
                          <td className="px-4 whitespace-nowrap text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedOffer(item)}
                                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                                title="Inspect Offer 360"
                              >
                                <Eye className="size-4" />
                              </button>
                              <Dropdown
                                align="end"
                                floating
                                ariaLabel={`Actions for offer ${item.id}`}
                                options={[
                                  { label: 'Inspect Offer 360', value: 'inspect', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                                  ...(item.status !== 'Accepted' ? [
                                    { label: 'Approve Offer', value: 'approve', icon: <CheckCircle2 className="size-4 text-emerald-600" /> },
                                  ] : []),
                                  ...(item.status !== 'Rejected' ? [
                                    { label: 'Reject Offer', value: 'reject', destructive: true, icon: <XCircle className="size-4 text-rose-600" /> },
                                  ] : []),
                                  { label: 'Flag for Review', value: 'flag', icon: <FlagIcon className="size-4 text-amber-600" /> },
                                  { label: 'Delete Record', value: 'delete', destructive: true, icon: <Trash2 className="size-4 text-rose-600" /> },
                                ]}
                                onSelect={(val) => {
                                  if (val === 'inspect') setSelectedOffer(item)
                                  else if (val === 'approve') handleApprove(item.id)
                                  else if (val === 'reject') handleReject(item.id, 'Standard compliance rejection')
                                  else if (val === 'flag') handleFlag(item.id, 'Flagged during dashboard review')
                                  else if (val === 'delete') handleDelete(item.id)
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

      {/* CUSTOMIZE TABLE DIALOG */}
      <CustomizeTableDialog
        isOpen={columnsOpen}
        visibleColumns={visibleColumns}
        activePresetId={activePresetId}
        presets={presets}
        categories={OFFER_COLUMN_CATEGORIES}
        storageKeyPrefix="offers"
        onPresetsChange={(newPresets) => setPresets(newPresets)}
        onApply={(cols, presetId) => {
          setVisibleColumns(cols)
          if (presetId) setActivePresetId(presetId)
          toast({ variant: 'success', title: 'Table customized', description: `${cols.length} visible columns applied.` })
        }}
        onClose={() => setColumnsOpen(false)}
      />
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
