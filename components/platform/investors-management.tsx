'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  ShieldCheck,
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  KeyRound,
  LogIn,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  UserCheck,
  UserX,
  Eye,
  Settings2,
  Building2,
  Award,
  Sparkles,
  Calendar,
  Bookmark,
  Users,
  Clock,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { EditInvestorProfileModal } from './edit-investor-profile-modal'
import { CustomizeTableDialog, type TableViewPreset } from './customize-table-dialog'
import { ScheduleExportModal } from './schedule-export-modal'
import { DateRangePicker } from './date-range-picker'
import { investors as initialInvestors, type PlatformInvestor } from '@/lib/platform-users'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { FigmaStatusBadge, CounterBadge, RateBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { FilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Investor = PlatformInvestor

const columns = [
  'Investor ID',
  'Investor',
  'Email',
  'Phone',
  'Country',
  'Status',
  'Verification',
  'Requests',
  'Deals',
  'Score',
  'Last Login',
  'Joined',
]

const defaultInvestorPresets: TableViewPreset[] = [
  {
    id: 'default',
    name: 'Default Overview',
    columns: [
      'Investor ID',
      'Investor',
      'Email',
      'Phone',
      'Country',
      'Status',
      'Verification',
      'Requests',
      'Deals',
      'Score',
      'Last Login',
      'Joined',
    ],
    isBuiltIn: true,
  },
  {
    id: 'deals-volume',
    name: 'Deals & Volume',
    columns: [
      'Investor',
      'Deals',
      'Active Deals',
      'Score',
      'Revenue',
      'Requests',
      'Status',
      'Last Login',
    ],
    isBuiltIn: true,
  },
  {
    id: 'kyc-verification',
    name: 'KYC & Verification',
    columns: [
      'Investor',
      'Country',
      'City',
      'Verification',
      'Verification Type',
      'Status',
      'Joined',
      'Phone',
    ],
    isBuiltIn: true,
  },
  {
    id: 'contacts',
    name: 'Contact Details',
    columns: [
      'Investor',
      'Email',
      'Phone',
      'Country',
      'City',
      'Last Active',
      'Joined',
    ],
    isBuiltIn: true,
  },
]

function InvestorsInner() {
  const router = useRouter()
  const { toast } = useToast()
  const storageKey = 'duseat_investors_records'
  const deletedStorageKey = 'duseat_deleted_investors_records'

  const [rows, setRows] = React.useState<Investor[]>(initialInvestors)
  const [deletedRows, setDeletedRows] = React.useState<Investor[]>([])
  const [query, setQuery] = React.useState('')
  const [tab, setTab] = React.useState<'All investors' | 'Verified' | 'Pending verification'>('All investors')
  const [verificationFilter, setVerificationFilter] = React.useState('All verification')
  const [countryFilter, setCountryFilter] = React.useState('All countries')
  const [dateRange, setDateRange] = React.useState('All Time')
  const [showFilters, setShowFilters] = React.useState(true)
  const [sortOption, setSortOption] = React.useState('newest')
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selected, setSelected] = React.useState<string[]>([])
  const [confirm, setConfirm] = React.useState<ConfirmRequest | null>(null)
  const [editProfileInvestor, setEditProfileInvestor] = React.useState<Investor | null>(null)
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState(columns)
  const [activePresetId, setActivePresetId] = React.useState('default')
  const [presets, setPresets] = React.useState<TableViewPreset[]>(defaultInvestorPresets)
  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false)
  const [headerCollapsed, setHeaderCollapsed] = React.useState(false)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) setRows(parsed)
      }
      const savedDeleted = localStorage.getItem(deletedStorageKey)
      if (savedDeleted) {
        const parsedDeleted = JSON.parse(savedDeleted)
        if (Array.isArray(parsedDeleted)) setDeletedRows(parsedDeleted)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const saveRows = (newRows: Investor[], newDeleted = deletedRows) => {
    setRows(newRows)
    setDeletedRows(newDeleted)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRows))
      localStorage.setItem(deletedStorageKey, JSON.stringify(newDeleted))
    } catch (e) {
      // ignore
    }
  }

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const patchRows = (ids: string[], patch: Partial<Investor>) => {
    const updated = rows.map((row) => (ids.includes(row.id) ? { ...row, ...patch } : row))
    saveRows(updated)
  }

  const applyAction = (kind: string, ids: string[], label: string) => {
    switch (kind) {
      case 'verify':
        patchRows(ids, { status: 'Active', verification: 'Verified' })
        notify('Account verified', `${label} verified successfully.`)
        break
      case 'suspend':
        patchRows(ids, { status: 'Suspended' })
        notify('Account suspended', `${label} has been suspended. Managed in Suspended Users directory.`, 'info')
        break
      case 'ban':
        patchRows(ids, { status: 'Banned', verification: 'Revoked' })
        notify('Account banned', `${label} has been banned.`, 'error')
        break
      case 'delete': {
        const toDelete = rows.filter((r) => ids.includes(r.id))
        const remaining = rows.filter((r) => !ids.includes(r.id))
        saveRows(remaining, [...deletedRows, ...toDelete])
        setSelected([])
        notify('Account deleted', `${label} moved to Deleted Users Archive.`, 'error')
        break
      }
      case 'restore': {
        const toRestore = deletedRows.filter((r) => ids.includes(r.id))
        const remainingDeleted = deletedRows.filter((r) => !ids.includes(r.id))
        saveRows([...rows, ...toRestore], remainingDeleted)
        setSelected([])
        notify('Accounts restored', `${label} restored to active directory.`)
        break
      }
      default:
        break
    }
  }

  const confirmMeta: Record<string, { title: string; confirmLabel: string; icon: any; tone: any; describe: (l: string) => string }> = {
    verify: {
      title: 'Verify Investor Account',
      confirmLabel: 'Verify Account',
      icon: 'verify',
      tone: 'success',
      describe: (label) => `${label} will be granted full verified investor status across the platform.`,
    },
    suspend: {
      title: 'Suspend Investor',
      confirmLabel: 'Suspend Account',
      icon: 'suspend',
      tone: 'warning',
      describe: (label) => `${label} will lose access to submit new property requests and moved to Suspended Users directory.`,
    },
    ban: {
      title: 'Ban Account',
      confirmLabel: 'Ban Account',
      icon: 'ban',
      tone: 'danger',
      describe: (label) => `${label} will be permanently banned and all active requests cancelled.`,
    },
    delete: {
      title: 'Delete Investor',
      confirmLabel: 'Delete Record',
      icon: 'delete',
      tone: 'danger',
      describe: (label) => `${label} will be moved to Deleted Users Archive with 30-day restore period.`,
    },
    'reset-password': {
      title: 'Reset Password',
      confirmLabel: 'Send Reset Link',
      icon: 'reset',
      tone: 'brand',
      describe: (label) => `A password reset link will be sent to ${label} via email.`,
    },
  }

  const runAction = (kind: string, ids: string[], label: string) => {
    const meta = confirmMeta[kind]
    if (meta) {
      setConfirm({
        title: meta.title,
        description: meta.describe(label),
        confirmLabel: meta.confirmLabel,
        tone: meta.tone,
        icon: meta.icon,
        onConfirm: () => applyAction(kind, ids, label),
      })
      return
    }
    applyAction(kind, ids, label)
  }

  const activeDataset = rows

  const filtered = activeDataset.filter((item) => {
    const text = `${item.id} ${item.name} ${item.email} ${item.phone} ${item.country}`.toLowerCase()
    const matchesQuery = !query || text.includes(query.toLowerCase())
    const matchesVerification = verificationFilter === 'All verification' || item.verification === verificationFilter
    const matchesCountry = countryFilter === 'All countries' || item.country === countryFilter
    const tabMatch =
      tab === 'All investors' ||
      (tab === 'Verified' && item.verification === 'Verified') ||
      (tab === 'Pending verification' && (item.status === 'Pending' || item.verification === 'Under review'))
    return matchesQuery && matchesVerification && matchesCountry && tabMatch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginatedInvestors = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [filtered, currentPage, rowsPerPage])

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((item) => item.id))

  const handleExportCsv = (investorsToExport = filtered) => {
    const headers = [
      'ID',
      'Investor',
      'Email',
      'Phone',
      'Country',
      'Status',
      'Verification',
      'Requests Count',
      'Deals Count',
      'Score',
      'Last Login',
      'Joined',
    ]
    const rowsCsv = investorsToExport.map((i) => [
      i.id,
      `"${i.name}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.country}"`,
      i.status,
      i.verification,
      i.requests,
      i.deals,
      i.score,
      `"${i.lastLogin}"`,
      `"${i.joined}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rowsCsv.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `duseat_investors_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Export Complete', `${investorsToExport.length} investors exported to CSV.`)
  }

  return (
    <PlatformShell
      title="Investors Management"
      eyebrow="users"
      query={query}
      onQueryChange={setQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-3.5 sm:gap-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start justify-between sm:block gap-2">
              <div>
                <h1 className="text-[20px] sm:text-[32px] font-bold leading-[28px] sm:leading-[40px] text-[#1f2327]">Investors Directory & KYC</h1>
                <p className={cn("mt-0.5 text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-[#6f777f]", headerCollapsed && "hidden sm:block")}>
                  Manage verified investors, track KYC & proof of funds, monitor active requests and deal flow.
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

            {/* Quick Links to Additional User Sections */}
            <div className={cn("flex flex-wrap items-center gap-2", headerCollapsed && "hidden sm:flex")}>
              <Link
                href="/verification"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <ShieldCheck className="size-4 text-[#00c2cb]" />
                <span>Verification Queue</span>
                <span className="rounded-full bg-[#dfefe8] px-1.5 py-0.2 text-[12px] leading-[16px] font-medium text-[#17b26a]">184</span>
              </Link>
              <Link
                href="/requests"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <FileText className="size-4 text-[#6f777f]" />
                <span>Live Requests</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className={cn("grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3", headerCollapsed && "hidden sm:grid")}>
            <MetricCard
              label="Total Investors"
              value={rows.length}
              icon={Users}
              tone="neutral"
              active={tab === 'All investors'}
              onClick={() => setTab('All investors')}
            />
            <MetricCard
              label="KYC Verified"
              value={rows.filter((r) => r.verification === 'Verified').length}
              icon={ShieldCheck}
              tone="success"
              active={tab === 'Verified'}
              onClick={() => setTab('Verified')}
            />
            <MetricCard
              label="Pending Review"
              value={rows.filter((r) => ['Pending', 'Under review'].includes(r.status) || r.verification === 'Under review').length}
              icon={Clock}
              tone="warning"
              active={tab === 'Pending verification'}
              onClick={() => setTab('Pending verification')}
            />
            <MetricCard
              label="Active In Deals"
              value={rows.filter((r) => r.deals > 0).length}
              icon={Award}
              tone="info"
            />
          </div>
        </header>

        {/* Table & Filter Container (Original GitHub Repo Layout) */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Horizontal scrollable / swipeable tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none max-w-full py-1 -mx-1 px-1 sm:mx-0 sm:px-0 select-none">
                {(['All investors', 'Verified', 'Pending verification'] as const).map((item) => {
                  const count =
                    item === 'All investors'
                      ? rows.length
                      : item === 'Verified'
                      ? rows.filter((r) => r.verification === 'Verified').length
                      : rows.filter((r) => ['Pending', 'Under review'].includes(r.status) || r.verification === 'Under review').length

                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setTab(item)}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap',
                        tab === item
                          ? item === 'Verified'
                            ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                            : item === 'Pending verification'
                            ? 'bg-[#f79009] text-white shadow-2xs font-semibold'
                            : 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span className="whitespace-nowrap">{item}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          tab === item
                            ? 'bg-white/25 text-white'
                            : item === 'Pending verification'
                            ? 'bg-[#fff5e5] text-[#f79009]'
                            : item === 'Verified'
                            ? 'bg-[#edfcf2] text-[#17b26a]'
                            : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Action Toolbar on the right */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between sm:justify-end pt-2 lg:pt-0 border-t border-[#f2f4f7] lg:border-t-0">
                {/* Saved View / Preset Selector */}
                <Dropdown
                  align="end"
                  floating
                  value={activePresetId}
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
                      notify('View Changed', `Switched to "${found.name}".`)
                    }
                  }}
                  trigger={
                    <button
                      type="button"
                      className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 sm:px-3.5 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap"
                    >
                      <Bookmark className="size-4 text-[#00c2cb]" />
                      <span className="max-w-[100px] sm:max-w-[140px] truncate">
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
                  className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 sm:px-3.5 text-[13px] sm:text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap"
                >
                  <Settings2 className="size-4 text-[#6f777f]" />
                  <span className="hidden sm:inline">Customize </span>
                  <span>Columns</span>
                </button>

                <Dropdown
                  align="end"
                  floating
                  options={[
                    { label: 'Export Visible Rows (CSV)', value: 'csv' },
                    { label: 'Schedule Export...', value: 'schedule' },
                  ]}
                  onSelect={(val) => {
                    if (val === 'schedule') setScheduleModalOpen(true)
                    else handleExportCsv()
                  }}
                  trigger={
                    <button
                      type="button"
                      className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3 sm:px-3.5 text-[13px] sm:text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                    >
                      <Download className="size-4 text-white" />
                      <span className="whitespace-nowrap">Export</span>
                      <ChevronDown className="size-3.5 opacity-70" />
                    </button>
                  }
                  ariaLabel="Export options"
                />
              </div>
            </div>

            {/* 4 Filters Row: Search, Verification, Country, DateRangePicker */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, phone, ID…"
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

              {/* Verification Filter */}
              <Dropdown
                align="start"
                value={verificationFilter}
                onSelect={setVerificationFilter}
                ariaLabel="Filter by Verification"
                options={['All verification', 'Verified', 'Under review', 'Revoked'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <ShieldCheck className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{verificationFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Country Filter */}
              <Dropdown
                align="start"
                value={countryFilter}
                onSelect={setCountryFilter}
                ariaLabel="Filter by Country"
                options={['All countries', 'United Arab Emirates', 'Saudi Arabia', 'Egypt'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <span>🌍</span>
                    <span className="whitespace-nowrap">{countryFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Date Range Picker */}
              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {(verificationFilter !== 'All verification' ||
                countryFilter !== 'All countries' ||
                dateRange !== 'All Time') && (
                <button
                  type="button"
                  onClick={() => {
                    setVerificationFilter('All verification')
                    setCountryFilter('All countries')
                    setDateRange('All Time')
                  }}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Bar (Figma Node 234:12116 Unified) */}
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-6 py-2.5 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[14px] font-semibold text-[#1f2327]">
                  {selected.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => runAction('verify', selected, `${selected.length} investors`)}
                  className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => runAction('suspend', selected, `${selected.length} investors`)}
                  className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => runAction('send-notification', selected, `${selected.length} investors`)}
                  className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Send notification
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selRows = rows.filter((r) => selected.includes(r.id))
                    const csv = 'data:text/csv;charset=utf-8,ID,Name,Email,Phone,Country,Status\n' + selRows.map(r => `${r.id},"${r.name}",${r.email},${r.phone},${r.country},${r.status}`).join('\n')
                    const link = document.createElement('a')
                    link.setAttribute('href', encodeURI(csv))
                    link.setAttribute('download', `selected_investors_${Date.now()}.csv`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    notify('Export Started', `${selected.length} investors CSV downloaded.`)
                  }}
                  className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => runAction('delete', selected, `${selected.length} investors`)}
                  className="h-[34px] rounded-[8px] px-3.5 text-[13px] font-semibold text-[#f04438] hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded p-1 text-[#6f777f] hover:bg-[#c7ecee]/50 hover:text-[#1f2327] transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Mobile View (< 768px): Compact Entity Cards (Section 10) */}
          <div className="block md:hidden p-3 space-y-3">
            {paginatedInvestors.map((investor) => (
              <InvestorMobileCard
                key={investor.id}
                investor={investor}
                isDeleted={false}
                selected={selected.includes(investor.id)}
                onSelect={() =>
                  setSelected((items) =>
                    items.includes(investor.id) ? items.filter((id) => id !== investor.id) : [...items, investor.id]
                  )
                }
                onAction={(kind) => {
                  if (kind === 'edit-profile') {
                    setEditProfileInvestor(investor)
                    return
                  }
                  runAction(kind, [investor.id], investor.name)
                }}
              />
            ))}
          </div>

          {/* Desktop & Tablet Table (>= 768px) */}
          <div className="hidden md:block overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1400px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12">
                  <th className="w-12 px-4">
                    <TableCheckbox
                      ariaLabel="Select all investors"
                      checked={filtered.length > 0 && selected.length === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  {visibleColumns.map((col) => (
                    <th key={col} className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">
                      {col}
                    </th>
                  ))}
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginatedInvestors.map((investor) => (
                  <InvestorRow
                    key={investor.id}
                    investor={investor}
                    isDeleted={false}
                    selected={selected.includes(investor.id)}
                    onSelect={() =>
                      setSelected((items) =>
                        items.includes(investor.id) ? items.filter((id) => id !== investor.id) : [...items, investor.id]
                      )
                    }
                    visibleColumns={visibleColumns}
                    onAction={(kind) => {
                      if (kind === 'edit-profile') {
                        setEditProfileInvestor(investor)
                        return
                      }
                      runAction(kind, [investor.id], investor.name)
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

            {filtered.length === 0 && (
              <EmptyState
                title="No investors found"
                description="Try adjusting your search query or reset your active filters."
                actionLabel="Reset filters"
                onAction={() => {
                  setQuery('')
                  setVerificationFilter('All verification')
                  setCountryFilter('All countries')
                  setDateRange('All Time')
                  setTab('All investors')
                }}
              />
            )}

          {/* Footer Pagination */}
          <div className="mt-auto border-t border-[#d3d5d7]">
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
              itemLabel="investors"
            />
          </div>
        </section>
      </div>

      <CustomizeTableDialog
        isOpen={columnsOpen}
        visibleColumns={visibleColumns}
        activePresetId={activePresetId}
        presets={presets}
        storageKeyPrefix="investors"
        onPresetsChange={(newPresets) => setPresets(newPresets)}
        onApply={(cols, presetId) => {
          setVisibleColumns(cols)
          if (presetId) setActivePresetId(presetId)
          notify('Table customized', `${cols.length} visible columns applied.`)
        }}
        onClose={() => setColumnsOpen(false)}
      />

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />

      {editProfileInvestor && (
        <EditInvestorProfileModal
          investor={editProfileInvestor}
          isOpen={!!editProfileInvestor}
          onClose={() => setEditProfileInvestor(null)}
          onSave={(updatedInvestor) => {
            setRows((prev) => {
              const next = prev.map((r) => (r.id === updatedInvestor.id ? updatedInvestor : r))
              try {
                localStorage.setItem(storageKey, JSON.stringify(next))
              } catch {}
              return next
            })
            notify('Profile Updated', `${updatedInvestor.name}'s profile has been updated successfully.`)
          }}
        />
      )}

      <ScheduleExportModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={(data) => {
          notify('Export scheduled', `Scheduled ${data.frequency} export (${data.format.toUpperCase()}) to ${data.recipients.join(', ')}.`)
        }}
        defaultName="Investors Directory - Weekly Export"
      />
    </PlatformShell>
  )
}

function renderInvestorCell(column: string, investor: Investor, router: ReturnType<typeof useRouter>) {
  const countryCode = getCountryCode(investor.country)

  switch (column) {
    case 'Investor ID':
    case 'ID':
      return (
        <Link
          href={`/investors/${investor.id}`}
          className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline whitespace-nowrap"
        >
          {investor.id}
        </Link>
      )

    case 'Investor':
    case 'Name':
      return (
        <Link
          href={`/investors/${investor.id}`}
          className="flex items-center gap-3 font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] transition-colors whitespace-nowrap"
        >
          <TableAvatar
            src={(investor as any).avatar}
            name={investor.name}
            countryCode={countryCode}
            size="md"
            variant="brand"
          />
          <div className="min-w-0">
            <p className="leading-[20px] whitespace-nowrap">{investor.name}</p>
            <p className="text-[12px] leading-[16px] font-normal text-[#6f777f] whitespace-nowrap">{investor.personalInfo?.occupation || 'Private Investor'}</p>
          </div>
        </Link>
      )

    case 'Email':
      return <span className="text-[14px] leading-[20px] text-[#6f777f] whitespace-nowrap">{investor.email}</span>

    case 'Phone':
      return <span className="text-[14px] leading-[20px] text-[#6f777f] font-mono whitespace-nowrap">{investor.phone}</span>

    case 'Country':
      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap text-[14px] leading-[20px] text-[#1f2327]">
          <Flag code={countryCode} size="s" />
          <span className="whitespace-nowrap">{investor.country}</span>
        </div>
      )

    case 'City':
      return <span className="text-[14px] leading-[20px] text-[#1f2327] whitespace-nowrap">{investor.personalInfo?.address || 'Dubai'}</span>

    case 'Role':
      return <span className="rounded-[6px] bg-[#eff1f3] px-2 py-0.5 text-xs font-medium text-[#1f2327] whitespace-nowrap">Investor</span>

    case 'Status':
    case 'Account Status':
      return <FigmaStatusBadge status={investor.status} />

    case 'Verification':
    case 'Verification Status':
      return <FigmaStatusBadge status={investor.verification} />

    case 'Verification Type':
      return <span className="rounded-[6px] bg-[#eff1f3] px-2 py-0.5 text-xs font-medium text-[#1f2327] whitespace-nowrap">Emirates ID + KYC</span>

    case 'Requests':
    case 'Total Requests':
      return <span className="font-bold text-[14px] leading-[20px] text-[#1f2327] whitespace-nowrap">{investor.requests}</span>

    case 'Deals':
    case 'Total Deals':
    case 'Completed Deals':
      return <span className="font-bold text-[14px] leading-[20px] text-[#1f2327] whitespace-nowrap">{investor.deals}</span>

    case 'Active Deals':
      return <span className="font-bold text-[14px] leading-[20px] text-[#00c2cb] whitespace-nowrap">{Math.max(1, Math.floor(investor.deals / 2))}</span>

    case 'Score':
    case 'Rating':
      return <span className="font-bold text-[#00c2cb] whitespace-nowrap">{investor.score} / 100</span>

    case 'Revenue':
      return <span className="font-bold text-[14px] leading-[20px] text-[#1f2327] whitespace-nowrap">{`AED ${(investor.deals * 120000).toLocaleString()}`}</span>

    case 'Subscription':
      return <span className="rounded-[6px] bg-[#eff1f3] px-2 py-0.5 text-xs font-medium text-[#1f2327] whitespace-nowrap">VIP Investor</span>

    case 'Last Login':
      return <span className="text-[13px] text-[#6f777f] whitespace-nowrap">{investor.lastLogin}</span>

    case 'Last Active':
      return <span className="text-[13px] text-[#6f777f] whitespace-nowrap">{investor.lastLogin || 'Today'}</span>

    case 'Joined':
    case 'Join Date':
      return <span className="text-[13px] text-[#6f777f] whitespace-nowrap">{investor.joined}</span>

    default:
      return (
        <span className="text-xs text-[#6f777f] whitespace-nowrap">
          {(investor as any)[column.toLowerCase()] || (investor as any)[column] || '—'}
        </span>
      )
  }
}

function InvestorRow({
  investor,
  isDeleted,
  selected,
  onSelect,
  visibleColumns,
  onAction,
}: {
  investor: Investor
  isDeleted: boolean
  selected: boolean
  onSelect: () => void
  visibleColumns: string[]
  onAction: (kind: string) => void
}) {
  const router = useRouter()

  return (
    <tr className={cn('h-[64px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap', selected && 'bg-[#e5f6f7]/40')}>
      <td className="px-4 whitespace-nowrap">
        <TableCheckbox ariaLabel={`Select ${investor.name}`} checked={selected} onChange={onSelect} />
      </td>

      {visibleColumns.map((col) => (
        <td key={col} className="px-4 whitespace-nowrap font-sans">
          {renderInvestorCell(col, investor, router)}
        </td>
      ))}

      <td className="px-4 whitespace-nowrap">
        <Dropdown
          align="end"
          floating
          ariaLabel={`Actions for ${investor.name}`}
          options={
            isDeleted
              ? [
                  { label: 'Restore Investor', value: 'restore', icon: <UserCheck className="size-4 text-emerald-600" /> },
                  { label: 'Permanent Delete', value: 'delete', destructive: true, icon: <Trash2 className="size-4 text-rose-600" /> },
                ]
              : [
                  { label: 'View Profile', value: 'view', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                  { label: 'Edit Profile', value: 'edit-profile', icon: <Pencil className="size-4 text-[#00c2cb]" /> },
                  { label: 'Login as Investor', value: 'login-as-user', icon: <LogIn className="size-4 text-[#6f777f]" /> },
                  { label: 'Verify / Approve KYC', value: 'verify', icon: <ShieldCheck className="size-4 text-emerald-600" /> },
                  { label: 'Reset Password', value: 'reset-password', icon: <KeyRound className="size-4 text-[#6f777f]" /> },
                  { label: 'Suspend Investor', value: 'suspend', destructive: true, icon: <UserX className="size-4 text-amber-600" /> },
                  { label: 'Delete Record', value: 'delete', destructive: true, icon: <Trash2 className="size-4 text-rose-600" /> },
                ]
          }
          onSelect={(val) => {
            if (val === 'view') router.push(`/investors/${investor.id}`)
            else onAction(val)
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
      </td>
    </tr>
  )
}

function InvestorMobileCard({
  investor,
  isDeleted,
  selected,
  onSelect,
  onAction,
}: {
  investor: Investor
  isDeleted: boolean
  selected: boolean
  onSelect: () => void
  onAction: (kind: string) => void
}) {
  const router = useRouter()
  const countryCode = getCountryCode(investor.country)

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[12px] border border-[#E2E5E8] bg-white p-4 shadow-xs transition-colors',
        selected && 'bg-[#E8F9FB]/40 border-[#06B6C9]/40'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <TableCheckbox
            ariaLabel={`Select ${investor.name}`}
            checked={selected}
            onChange={onSelect}
          />
          <Link href={`/investors/${investor.id}`} className="cursor-pointer">
            <TableAvatar
              src={investor.avatar}
              name={investor.name}
              countryCode={countryCode}
              size="md"
              variant="brand"
            />
          </Link>
          <div className="min-w-0">
            <Link
              href={`/investors/${investor.id}`}
              className="font-bold text-[#202428] text-[14px] hover:text-[#06B6C9] hover:underline truncate block"
            >
              {investor.name}
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-[#68727D]">
              <span className="font-mono font-medium">{investor.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flag code={countryCode} size="s" />
                {investor.country}
              </span>
            </div>
          </div>
        </div>

        <FigmaStatusBadge status={investor.status} />
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-b border-[#E2E5E8] py-2 text-[12px]">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8A939D] block">Verification</span>
          <span className="font-medium text-[#16A86B] truncate block">{investor.verification}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8A939D] block">Requests</span>
          <span className="font-bold text-[#202428] block">{investor.requests} briefs</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8A939D] block">Deals</span>
          <span className="font-bold text-[#202428] block">{investor.deals} closed</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-[11px] text-[#8A939D]">
          Joined {investor.joined}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => router.push(`/investors/${investor.id}`)}
            className="h-[30px] rounded-[6px] border border-[#E2E5E8] bg-white px-2.5 text-[12px] font-medium text-[#202428] hover:bg-[#F8F9FA]"
          >
            View
          </button>
          <Dropdown
            align="end"
            options={
              !isDeleted
                ? [
                    { label: 'View Profile', value: 'view' },
                    { label: 'Edit Details', value: 'edit-profile' },
                    { label: 'Verify Investor', value: 'verify' },
                    { label: 'Suspend Investor', value: 'suspend' },
                    { label: 'Delete Account', value: 'delete', destructive: true },
                  ]
                : [{ label: 'Restore Account', value: 'restore' }]
            }
            onSelect={(kind) => {
              if (kind === 'view') router.push(`/investors/${investor.id}`)
              else onAction(kind)
            }}
            trigger={
              <button
                type="button"
                className="flex size-7.5 items-center justify-center rounded-[6px] border border-[#E2E5E8] text-[#68727D] hover:bg-[#F8F9FA]"
                aria-label={`More actions for ${investor.name}`}
              >
                <MoreHorizontal className="size-3.5" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  )
}


export function InvestorsManagement() {
  return (
    <ToastProvider>
      <InvestorsInner />
    </ToastProvider>
  )
}
