'use client'

import * as React from 'react'
import Link from 'next/link'
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
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { RequestCard } from './request-card'
import { RequestDetailModal } from './request-detail-modal'
import { EditRequestModal } from './edit-request-modal'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { Flag, getCountryCode } from '@/components/ui/flag'
import { cn } from '@/lib/utils'
import type { PropertyRequest } from '@/lib/platform-users'
import { allPlatformRequests } from '@/lib/platform-users'

type ViewMode = 'timeline' | 'table' | 'kanban'

export function RequestsManagementInner() {
  const { toast } = useToast()
  const storageKey = 'duseat_platform_requests_records'

  const [requests, setRequests] = React.useState<PropertyRequest[]>(allPlatformRequests)
  const [viewMode, setViewMode] = React.useState<ViewMode>('timeline')
  const [query, setQuery] = React.useState('')
  const [purposeFilter, setPurposeFilter] = React.useState<'All' | 'Living' | 'Investment'>('All')
  const [unitStatusFilter, setUnitStatusFilter] = React.useState<'All' | 'Ready' | 'Offplan'>('All')
  const [paymentFilter, setPaymentFilter] = React.useState<'All' | 'Cash' | 'Mortgage'>('All')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [sortField, setSortField] = React.useState<'time' | 'budget' | 'offers'>('time')
  const [sortAsc, setSortAsc] = React.useState(false)

  // Modals state
  const [selectedRequest, setSelectedRequest] = React.useState<PropertyRequest | null>(null)
  const [editingRequest, setEditingRequest] = React.useState<PropertyRequest | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRequests(parsed)
        }
      }
    } catch {}
  }, [])

  const saveRequests = (newRequests: PropertyRequest[]) => {
    setRequests(newRequests)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRequests))
    } catch {}
  }

  // Filtered requests
  const filteredRequests = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return requests
      .filter((req) => {
        const matchesQuery =
          !q ||
          req.title.toLowerCase().includes(q) ||
          req.investorName.toLowerCase().includes(q) ||
          req.id.toLowerCase().includes(q) ||
          req.preferredAreas.some((a) => a.toLowerCase().includes(q)) ||
          req.propertyType.toLowerCase().includes(q)

        const matchesPurpose = purposeFilter === 'All' || req.purpose === purposeFilter
        const matchesUnitStatus =
          unitStatusFilter === 'All' ||
          (unitStatusFilter === 'Ready' && req.unitStatus === 'Ready') ||
          (unitStatusFilter === 'Offplan' && (req.unitStatus === 'Offplan' || req.unitStatus === 'Off-plan'))

        const matchesPayment = paymentFilter === 'All' || req.paymentMethod === paymentFilter
        const matchesStatus = statusFilter === 'All' || req.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesQuery && matchesPurpose && matchesUnitStatus && matchesPayment && matchesStatus
      })
      .sort((a, b) => {
        if (sortField === 'offers') {
          return sortAsc ? a.offersCount - b.offersCount : b.offersCount - a.offersCount
        }
        return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      })
  }, [requests, query, purposeFilter, unitStatusFilter, paymentFilter, statusFilter, sortField, sortAsc])

  // KPIs
  const stats = React.useMemo(() => {
    const total = requests.length
    const openCount = requests.filter((r) => r.status === 'Open' || r.status === 'Receiving offers').length
    const matchedCount = requests.filter((r) => r.status === 'Matched').length
    const confirmedCount = requests.filter((r) => r.status === 'Deal confirmed').length
    const totalOffers = requests.reduce((acc, r) => acc + (r.offersCount || 0), 0)
    return { total, openCount, matchedCount, confirmedCount, totalOffers }
  }, [requests])

  // Handlers
  const handleUpdateStatus = (requestId: string, newStatus: PropertyRequest['status']) => {
    const updated = requests.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    saveRequests(updated)
    toast({
      variant: 'success',
      title: 'Status Updated',
      description: `Request ${requestId} status changed to ${newStatus}.`,
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
  }

  const handleDeleteRequest = (reqId: string) => {
    setConfirmDialog({
      title: 'Delete Request',
      message: `Are you sure you want to permanently delete request ${reqId}? This will remove all associated offers.`,
      confirmLabel: 'Delete Permanently',
      danger: true,
      onConfirm: () => {
        const next = requests.filter((r) => r.id !== reqId)
        saveRequests(next)
        toast({
          variant: 'error',
          title: 'Request Deleted',
          description: `Request ${reqId} has been removed.`,
        })
        setConfirmDialog(null)
      },
    })
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Investor', 'Purpose', 'Type', 'Bedrooms', 'Status', 'Budget', 'Locations', 'Payment', 'Offers', 'Date']
    const rows = filteredRequests.map((r) => [
      r.id,
      r.investorName,
      r.purpose,
      r.propertyType,
      r.bedrooms,
      r.unitStatus,
      r.budget,
      `"${r.preferredAreas.join(', ')}"`,
      r.paymentMethod,
      r.offersCount,
      r.created,
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

  return (
    <PlatformShell>
      <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8 font-sans">
        {/* Top Header & Overview Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[28px] sm:text-[32px] leading-[38px] font-bold text-[#1f2327]">
                Property Requests
              </h1>
              <span className="rounded-full bg-[#00c2cb]/10 px-3 py-1 text-[13px] font-bold text-[#00848b]">
                {requests.length} Total Requests
              </span>
            </div>
            <p className="text-[14px] leading-[20px] text-[#6f777f] mt-1">
              Live marketplace stream of verified investor acquisition briefs across the UAE network
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher (Timeline vs Table vs Kanban) */}
            <div className="flex items-center rounded-[10px] border border-[#d3d5d7] bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={cn(
                  'flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[13px] font-semibold transition-all cursor-pointer',
                  viewMode === 'timeline'
                    ? 'bg-[#00c2cb] text-white shadow-2xs'
                    : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
                title="Timeline Feed Mode (Figma App Flow)"
              >
                <Layers className="size-3.5" />
                <span>Timeline Feed</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[13px] font-semibold transition-all cursor-pointer',
                  viewMode === 'table'
                    ? 'bg-[#00c2cb] text-white shadow-2xs'
                    : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
                title="Table View (Data Grid)"
              >
                <List className="size-3.5" />
                <span>Table</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[13px] font-semibold transition-all cursor-pointer',
                  viewMode === 'kanban'
                    ? 'bg-[#00c2cb] text-white shadow-2xs'
                    : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
                title="Kanban Board View (Pipeline)"
              >
                <LayoutGrid className="size-3.5" />
                <span>Pipeline</span>
              </button>
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex h-[38px] items-center gap-1.5 rounded-[10px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
            >
              <Download className="size-3.5 text-[#6f777f]" />
              <span>Export CSV</span>
            </button>

            {/* Add Request Button (Figma Flow) */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex h-[38px] items-center gap-1.5 rounded-[10px] bg-[#00c2cb] px-4 text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer ant-wave-btn shadow-2xs"
            >
              <Plus className="size-4" />
              <span>+ Add Request / إضافة طلب</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6f777f]">Active Pipeline</p>
              <p className="text-[24px] font-bold text-[#1f2327] mt-0.5">{stats.total}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#e5f6f7] text-[#00c2cb]">
              <Building2 className="size-5" />
            </div>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6f777f]">Receiving Offers</p>
              <p className="text-[24px] font-bold text-[#00848b] mt-0.5">{stats.openCount}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#e5f6f7] text-[#00c2cb]">
              <Flame className="size-5" />
            </div>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6f777f]">Matched & Negotiating</p>
              <p className="text-[24px] font-bold text-[#17b26a] mt-0.5">{stats.matchedCount}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#ecfdf3] text-[#17b26a]">
              <CheckCircle2 className="size-5" />
            </div>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-[#6f777f]">Total Pitches Submitted</p>
              <p className="text-[24px] font-bold text-[#b54708] mt-0.5">{stats.totalOffers}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#fff4e5] text-[#f79009]">
              <MessageSquare className="size-5" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#d3d5d7] bg-white p-3.5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
          {/* Search Box */}
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6f777f]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by investor, title, location, ID..."
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6f777f] hover:text-[#1f2327]"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Purpose Filter */}
          <div className="flex items-center gap-1">
            {(['All', 'Living', 'Investment'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurposeFilter(p)}
                className={cn(
                  'h-[34px] rounded-[8px] px-3 text-[13px] font-medium transition-colors cursor-pointer',
                  purposeFilter === p
                    ? 'bg-[#00c2cb] text-white font-semibold shadow-2xs'
                    : 'bg-[#f8f9fa] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                {p === 'All' ? 'All Purposes' : p}
              </button>
            ))}
          </div>

          {/* Unit Status Filter */}
          <div className="flex items-center gap-1">
            {(['All', 'Ready', 'Offplan'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setUnitStatusFilter(s)}
                className={cn(
                  'h-[34px] rounded-[8px] px-3 text-[13px] font-medium transition-colors cursor-pointer',
                  unitStatusFilter === s
                    ? 'bg-[#1f2327] text-white font-semibold'
                    : 'bg-[#f8f9fa] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                {s === 'All' ? 'All Statuses' : s}
              </button>
            ))}
          </div>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] outline-none cursor-pointer"
          >
            <option value="All">All Payments (Cash & Mortgage)</option>
            <option value="Cash">Cash Only</option>
            <option value="Mortgage">Mortgage Only</option>
          </select>
        </div>

        {/* =========================================================================
            VIEW 1: TIMELINE FEED MODE (Exact Figma App Flow - node 2061:3942)
           ========================================================================= */}
        {viewMode === 'timeline' && (
          <div className="space-y-4">
            {/* Top Add Request CTA Card (Figma node 2061:3942 Header Card) */}
            <div className="rounded-[18px] bg-gradient-to-r from-[#050B20] via-[#09153a] to-[#0d1d4d] p-5 sm:p-6 text-white shadow-md flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-[600px]">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#00c2cb]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#00c2cb]">
                    Investor Network
                  </span>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-white">Add new property request</h3>
                </div>
                <p className="text-[13px] sm:text-[14px] text-[#9da4ae]">
                  Post your investment or residential brief and let verified RERA agents compete with tailored proposals.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#00c2cb] text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
                title="Post new request"
              >
                <Plus className="size-6" />
              </button>
            </div>

            {/* Timeline Heading */}
            <div className="flex items-center justify-between pt-2">
              <h3 className="text-[18px] leading-[26px] font-bold text-[#1f2327]">Investors' Requests Stream</h3>
              <span className="text-[13px] text-[#6f777f]">Showing {filteredRequests.length} matching briefs</span>
            </div>

            {/* Feed Cards List (Exact Figma Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-[18px] border border-[#d3d5d7] bg-white p-5 shadow-xs hover:border-[#00c2cb]/50 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  {/* Top Row: User Avatar, Flag, Name, Verified, Time */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative size-11 shrink-0">
                        <div className="size-11 rounded-full overflow-hidden border-2 border-white shadow-2xs bg-[#f0f2f5]">
                          <img
                            src={
                              req.investorAvatar ||
                              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
                            }
                            alt={req.investorName}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="absolute -left-1 -top-1">
                          <Flag code={getCountryCode(req.countryFlag === '🇦🇪' ? 'UAE' : 'Egypt')} size="s" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[15px] font-bold text-[#1f2327] truncate">{req.investorName}</p>
                          <svg className="size-3.5 shrink-0 text-[#00c2cb]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-[#9da4ae]">
                          <span className="size-1.5 rounded-full bg-[#17b26a]" />
                          <span>{req.onlineStatus || 'Online (Avg 10m)'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[12px] text-[#9da4ae] shrink-0">
                      <Clock className="size-3.5" />
                      <span>{req.timeAgo}</span>
                    </div>
                  </div>

                  {/* Title & Note */}
                  <div className="space-y-2">
                    <p className="text-[15px] leading-[22px] font-bold text-[#1f2327] line-clamp-2">
                      {req.title}
                    </p>
                    <div className="flex items-start gap-1.5 text-[13px] text-[#6f777f]">
                      <FileText className="size-3.5 shrink-0 text-[#90969c] mt-0.5" />
                      <p className="line-clamp-1 flex-1">
                        <strong className="font-medium text-[#6f777f]">Note:</strong> {req.note || 'Family-friendly community preferred.'}
                      </p>
                    </div>
                  </div>

                  {/* 3 Meta Info Capsules (Figma Style) */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-[10px] bg-[#f8f8f8] p-2 flex flex-col items-start min-w-0">
                      <div className="flex items-center gap-1 text-[11px] text-[#9da4ae]">
                        <TagIcon className="size-3 shrink-0" />
                        <span>Budget</span>
                      </div>
                      <p className="text-[13px] font-bold text-[#1f2327] truncate w-full mt-0.5">{req.budget}</p>
                    </div>

                    <div className="rounded-[10px] bg-[#f8f8f8] p-2 flex flex-col items-start min-w-0">
                      <div className="flex items-center gap-1 text-[11px] text-[#9da4ae]">
                        <Home className="size-3 shrink-0" />
                        <span>Type</span>
                      </div>
                      <p className="text-[13px] font-bold text-[#1f2327] truncate w-full mt-0.5">{req.purpose}</p>
                    </div>

                    <div className="rounded-[10px] bg-[#f8f8f8] p-2 flex flex-col items-start min-w-0">
                      <div className="flex items-center gap-1 text-[11px] text-[#9da4ae]">
                        <KeyRound className="size-3 shrink-0" />
                        <span>Method</span>
                      </div>
                      <p className="text-[13px] font-bold text-[#1f2327] truncate w-full mt-0.5">{req.unitStatus}</p>
                    </div>
                  </div>

                  {/* Offers Pill Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#c7ecee] px-2.5 py-1 text-[12px] font-bold text-[#00848b]">
                      <MessageSquare className="size-3.5" />
                      <span>{req.offersCount} offers</span>
                    </div>

                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                      req.status === 'Deal confirmed' ? 'bg-[#dfefe8] text-[#17b26a]' : 'bg-[#eff1f3] text-[#6f777f]'
                    )}>
                      {req.status}
                    </span>
                  </div>

                  {/* Action Buttons: View Details & Quick Edit */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="flex-1 h-[42px] rounded-[12px] bg-[#00c2cb] text-[14px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-2xs ant-wave-btn flex items-center justify-center gap-1"
                    >
                      <span>View details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingRequest(req)}
                      className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                      title="Edit specifications"
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
            VIEW 2: TABLE MODE (Data Grid for Power Admins)
           ========================================================================= */}
        {viewMode === 'table' && (
          <div className="overflow-hidden rounded-[16px] border border-[#d3d5d7] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-[#d3d5d7] bg-[#f8fafc] text-left text-[12px] font-bold uppercase text-[#6f777f]">
                    <th className="py-3.5 pl-4 pr-2">ID</th>
                    <th className="py-3.5 px-3">Investor</th>
                    <th className="py-3.5 px-3">Purpose & Specs</th>
                    <th className="py-3.5 px-3">Budget</th>
                    <th className="py-3.5 px-3">Locations</th>
                    <th className="py-3.5 px-3">Payment</th>
                    <th className="py-3.5 px-3">Offers</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-[#f8fcfd] transition-colors cursor-pointer"
                      onClick={() => setSelectedRequest(req)}
                    >
                      <td className="py-3 pl-4 pr-2 font-mono text-[12px] font-semibold text-[#6f777f]">
                        {req.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              req.investorAvatar ||
                              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
                            }
                            alt=""
                            className="size-7 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#1f2327] text-[13px]">{req.investorName}</p>
                            <p className="text-[11px] text-[#9da4ae]">{req.timeAgo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#1f2327] text-[13px]">
                          {req.bedrooms !== 'N/A' ? `${req.bedrooms} ` : ''}{req.propertyType}
                        </p>
                        <p className="text-[11px] text-[#00848b]">
                          {req.purpose} • {req.unitStatus}
                        </p>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#00c2cb] text-[13px]">
                        {req.budget}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {req.preferredAreas.slice(0, 2).map((a) => (
                            <span key={a} className="rounded bg-[#f0f2f5] px-1.5 py-0.5 text-[11px] text-[#1f2327]">
                              {a}
                            </span>
                          ))}
                          {req.preferredAreas.length > 2 && (
                            <span className="text-[11px] text-[#6f777f]">+{req.preferredAreas.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex rounded-full bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 text-[11px] font-medium text-[#1f2327]">
                          {req.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#c7ecee] px-2 py-0.5 text-[12px] font-bold text-[#00848b]">
                          <MessageSquare className="size-3" />
                          {req.offersCount}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          req.status === 'Deal confirmed'
                            ? 'bg-[#dfefe8] text-[#17b26a]'
                            : req.status === 'Matched'
                            ? 'bg-[#e5f6f7] text-[#00848b]'
                            : 'bg-[#f8f9fa] text-[#6f777f]'
                        )}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]"
                            title="View details"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRequest(req)}
                            className="rounded-[6px] p-1.5 text-[#00c2cb] hover:bg-[#e5f6f7]"
                            title="Edit request"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(req.id)}
                            className="rounded-[6px] p-1.5 text-[#f04438] hover:bg-[#fef3f2]"
                            title="Delete request"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: KANBAN PIPELINE VIEW (Details of Details)
           ========================================================================= */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {(
              [
                { status: 'Open', color: 'bg-blue-500', title: 'Open for Pitches' },
                { status: 'Receiving offers', color: 'bg-amber-500', title: 'Receiving Offers' },
                { status: 'Matched', color: 'bg-teal-500', title: 'Matched & Negotiating' },
                { status: 'Deal confirmed', color: 'bg-emerald-500', title: 'Deal Confirmed' },
                { status: 'Closed', color: 'bg-slate-500', title: 'Closed / Archived' },
              ] as const
            ).map((column) => {
              const colRequests = filteredRequests.filter((r) => r.status.toLowerCase() === column.status.toLowerCase())
              return (
                <div key={column.status} className="rounded-[16px] border border-[#d3d5d7] bg-[#f8fafc] p-3 space-y-3 flex flex-col min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('size-2 rounded-full', column.color)} />
                      <h4 className="text-[13px] font-bold text-[#1f2327]">{column.title}</h4>
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#6f777f] border border-[#d3d5d7]">
                      {colRequests.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[700px]">
                    {colRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs hover:border-[#00c2cb] hover:shadow-xs transition-all cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-[#6f777f]">{req.id}</span>
                          <span className="text-[11px] text-[#9da4ae]">{req.timeAgo}</span>
                        </div>

                        <p className="font-bold text-[13px] text-[#1f2327] leading-snug line-clamp-2">
                          {req.title}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[12px]">
                          <span className="font-bold text-[#00c2cb]">{req.budget}</span>
                          <span className="rounded bg-[#c7ecee] px-1.5 py-0.5 text-[11px] font-bold text-[#00848b]">
                            {req.offersCount} offers
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#f0f2f5] text-[11px] text-[#6f777f]">
                          <span>{req.investorName}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingRequest(req)
                            }}
                            className="text-[#00c2cb] font-semibold hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}

                    {colRequests.length === 0 && (
                      <div className="py-8 text-center text-[12px] text-[#9da4ae]">
                        No requests in this stage
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Selected Request Detail Modal */}
        {selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onUpdateStatus={(reqId, newStatus) => handleUpdateStatus(reqId, newStatus)}
            onUpdateRequest={(updatedReq) => handleSaveRequest(updatedReq)}
          />
        )}

        {/* Edit / Create Request Modal */}
        {(editingRequest || isCreateModalOpen) && (
          <EditRequestModal
            request={editingRequest}
            mode={isCreateModalOpen ? 'create' : 'edit'}
            isOpen={!!editingRequest || isCreateModalOpen}
            onClose={() => {
              setEditingRequest(null)
              setIsCreateModalOpen(false)
            }}
            onSave={(savedReq) => handleSaveRequest(savedReq)}
          />
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog request={confirmDialog} onClose={() => setConfirmDialog(null)} />
      </div>
    </PlatformShell>
  )
}

export function RequestsManagement() {
  return (
    <ToastProvider>
      <RequestsManagementInner />
    </ToastProvider>
  )
}
