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
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { EditInvestorProfileModal } from './edit-investor-profile-modal'
import { CustomizeTableDialog } from './customize-table-dialog'
import { ScheduleExportModal } from './schedule-export-modal'
import { DateRangePicker } from './date-range-picker'
import { investors as initialInvestors, type PlatformInvestor } from '@/lib/platform-users'
import { Flag, getCountryCode } from '@/components/ui/flag'
import { Tag, StatusTag } from '@/components/ui/badge-tag'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { FigmaStatusBadge, CounterBadge, RateBadge } from '@/components/ui/figma-badges'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  fetchInvestorsList,
  setInvestorActiveStatus,
  deleteInvestorAccount,
  reviewInvestorKYC,
} from '@/lib/api/investors'

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
  'Actions',
]

function InvestorsInner() {
  const router = useRouter()
  const { toast } = useToast()
  const storageKey = 'duseat_investors_records'
  const deletedStorageKey = 'duseat_deleted_investors_records'

  const [rows, setRows] = React.useState<Investor[]>(initialInvestors)
  const [deletedRows, setDeletedRows] = React.useState<Investor[]>([])
  const [loading, setLoading] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [tab, setTab] = React.useState<'All investors' | 'Verified' | 'Pending verification' | 'Suspended' | 'Deleted users'>('All investors')
  const [statusFilter, setStatusFilter] = React.useState('All statuses')
  const [verificationFilter, setVerificationFilter] = React.useState('All verification')
  const [countryFilter, setCountryFilter] = React.useState('All countries')
  const [dateRange, setDateRange] = React.useState('All Time')
  const [rowsPerPage, setRowsPerPage] = React.useState(50)
  const [selected, setSelected] = React.useState<string[]>([])
  const [confirm, setConfirm] = React.useState<ConfirmRequest | null>(null)
  const [editProfileInvestor, setEditProfileInvestor] = React.useState<Investor | null>(null)
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState(columns)
  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false)

  // Load from API and fallback to localStorage/mock
  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchInvestorsList({ search: query })
      if (res.items && res.items.length > 0) {
        setRows(res.items)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [query])

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
    } catch {
      // ignore
    }
    loadData()
  }, [loadData])

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
        ids.forEach((id) => reviewInvestorKYC(id, 'APPROVE').catch(() => {}))
        notify('Account verified', `${label} verified successfully.`)
        break
      case 'suspend':
        patchRows(ids, { status: 'Suspended' })
        ids.forEach((id) => setInvestorActiveStatus(id, false).catch(() => {}))
        notify('Account suspended', `${label} has been suspended.`, 'info')
        break
      case 'ban':
        patchRows(ids, { status: 'Banned', verification: 'Revoked' })
        ids.forEach((id) => setInvestorActiveStatus(id, false).catch(() => {}))
        notify('Account banned', `${label} has been banned.`, 'error')
        break
      case 'delete': {
        const toDelete = rows.filter((r) => ids.includes(r.id))
        const remaining = rows.filter((r) => !ids.includes(r.id))
        saveRows(remaining, [...deletedRows, ...toDelete])
        setSelected([])
        ids.forEach((id) => deleteInvestorAccount(id).catch(() => {}))
        notify('Account deleted', `${label} moved to deleted records.`, 'error')
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
      case 'reset-password':
        notify('Reset link sent', `Password reset token emailed to ${label}.`)
        break
      case 'send-notification':
        notify('Notification sent', `Broadcast notification delivered to ${label}.`)
        break
      case 'login-as-user':
        notify('Impersonation', `Logged in as ${label}. Redirecting...`, 'info')
        break
      default:
        notify('Action complete', `${label} updated.`)
    }
  }

  const confirmMeta: Record<
    string,
    {
      title: string
      confirmLabel: string
      icon: ConfirmRequest['icon']
      tone: ConfirmRequest['tone']
      describe: (label: string) => string
    }
  > = {
    suspend: {
      title: 'Suspend Investor Account',
      confirmLabel: 'Suspend Account',
      icon: 'suspend',
      tone: 'warning',
      describe: (label) => `${label} will lose access to submit new property requests.`,
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
      describe: (label) => `${label} will be moved to archive with 30-day restore period.`,
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

  const activeDataset = tab === 'Deleted users' ? deletedRows : rows

  const filtered = activeDataset.filter((item) => {
    const text = `${item.id} ${item.name} ${item.email} ${item.phone} ${item.country}`.toLowerCase()
    const matchesQuery = !query || text.includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'All statuses' || item.status === statusFilter
    const matchesVerification = verificationFilter === 'All verification' || item.verification === verificationFilter
    const matchesCountry = countryFilter === 'All countries' || item.country === countryFilter
    const tabMatch =
      tab === 'All investors' ||
      (tab === 'Verified' && item.verification === 'Verified') ||
      (tab === 'Pending verification' && (item.status === 'Pending' || item.verification === 'Under review')) ||
      (tab === 'Suspended' && item.status === 'Suspended') ||
      tab === 'Deleted users'
    return matchesQuery && matchesStatus && matchesVerification && matchesCountry && tabMatch
  })

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
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-[#00c2cb]">Verified Network</span>
                <span className="inline-flex items-center rounded-[6px] bg-[#dfefe8] px-2 py-0.5 text-[12px] leading-[16px] font-semibold text-[#17b26a]">
                  Compliance Active
                </span>
              </div>
              <h1 className="mt-1 text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">Investors Directory & KYC</h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage verified investors, track KYC & proof of funds, monitor active requests and deal flow.
              </p>
            </div>

            {/* Quick Links to Additional User Sections */}
            <div className="flex flex-wrap items-center gap-2">
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

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Total Investors</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#1f2327]">{rows.length}</p>
            </div>
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
              <p className="text-[14px] leading-[20px] text-[#6f777f]">KYC Verified</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#17b26a]">
                {rows.filter((r) => r.verification === 'Verified').length}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Pending Review</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#00c2cb]">
                {rows.filter((r) => ['Pending', 'Under review'].includes(r.status) || r.verification === 'Under review').length}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white px-4 py-2.5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
              <p className="text-[14px] leading-[20px] text-[#6f777f]">Suspended / Deleted</p>
              <p className="mt-0.5 text-[24px] leading-[32px] font-bold text-[#f79009]">
                {rows.filter((r) => r.status === 'Suspended').length + deletedRows.length}
              </p>
            </div>
          </div>
        </header>

        {/* Table & Filter Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(['All investors', 'Verified', 'Pending verification', 'Suspended', 'Deleted users'] as const).map((item) => {
                  const count =
                    item === 'All investors'
                      ? rows.length
                      : item === 'Verified'
                      ? rows.filter((r) => r.verification === 'Verified').length
                      : item === 'Pending verification'
                      ? rows.filter((r) => ['Pending', 'Under review'].includes(r.status) || r.verification === 'Under review').length
                      : item === 'Suspended'
                      ? rows.filter((r) => r.status === 'Suspended').length
                      : deletedRows.length

                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setTab(item)}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn',
                        tab === item
                          ? 'bg-[#1f2327] text-white shadow-2xs'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{item}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          item === 'Suspended'
                            ? 'bg-[#f79009] text-white'
                            : tab === item
                            ? 'bg-white/20 text-white'
                            : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setColumnsOpen(true)}
                  className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
                >
                  <Settings2 className="size-4 text-[#6f777f]" />
                  <span>Customize columns</span>
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
                      className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans"
                    >
                      <Download className="size-4 text-white" />
                      <span>Export</span>
                      <ChevronDown className="size-3.5 opacity-70" />
                    </button>
                  }
                  ariaLabel="Export options"
                />
              </div>
            </div>

            {/* 5 Filters Row: Search, Status, Verification, Country, DateRangePicker */}
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

              {/* Status Filter */}
              <Dropdown
                align="start"
                value={statusFilter}
                onSelect={setStatusFilter}
                ariaLabel="Filter by Status"
                options={['All statuses', 'Active', 'Pending', 'Suspended', 'Banned'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <Filter className="size-4 text-[#6f777f]" />
                    <span>{statusFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

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
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <ShieldCheck className="size-4 text-[#6f777f]" />
                    <span>{verificationFilter}</span>
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
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <span>🌍</span>
                    <span>{countryFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Date Range Picker */}
              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {(statusFilter !== 'All statuses' ||
                verificationFilter !== 'All verification' ||
                countryFilter !== 'All countries') && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('All statuses')
                    setVerificationFilter('All verification')
                    setCountryFilter('All countries')
                  }}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
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
                {tab !== 'Deleted users' ? (
                  <>
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
                      onClick={() => runAction('delete', selected, `${selected.length} investors`)}
                      className="h-[34px] rounded-[8px] px-3.5 text-[13px] font-semibold text-[#f04438] hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => runAction('restore', selected, `${selected.length} investors`)}
                    className="h-[34px] rounded-[8px] bg-[#17b26a] px-3.5 text-[13px] font-semibold text-white hover:bg-[#159a5c] transition-colors cursor-pointer"
                  >
                    Restore Investors
                  </button>
                )}
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

          {/* Table */}
          <div className="overflow-x-auto">
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
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">ID</th>
                  {columns.map((col) =>
                    visibleColumns.includes(col) || col === 'Actions' ? (
                      <th key={col} className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">
                        {col}
                      </th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {filtered.map((investor) => (
                  <InvestorRow
                    key={investor.id}
                    investor={investor}
                    isDeleted={tab === 'Deleted users'}
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

            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-[18px] font-semibold text-[#1f2327]">No investors found</p>
                <p className="mt-1 text-[14px] text-[#6f777f]">Try adjusting your search query or reset your active filters.</p>
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d3d5d7] px-5 py-3.5 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#6f777f]">Rows per page</span>
              <Dropdown
                align="start"
                options={[5, 10, 25, 50, 75].map((count) => ({
                  label: `${count}`,
                  value: `${count}`,
                }))}
                value={`${rowsPerPage}`}
                onSelect={(val) => setRowsPerPage(Number(val))}
                trigger={
                  <span className="inline-flex h-[32px] items-center gap-2 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <span>{rowsPerPage}</span>
                    <ChevronDown className="size-3 text-[#9da4ae]" />
                  </span>
                }
              />
              <span className="text-[14px] text-[#6f777f]">
                Showing 1–{Math.min(filtered.length, rowsPerPage)} of {activeDataset.length} investors
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    'flex size-8 items-center justify-center rounded-[8px] text-[14px] font-semibold transition-colors cursor-pointer ant-wave-btn',
                    page === 1 ? 'bg-[#00c2cb] text-white shadow-2xs' : 'hover:bg-[#eff1f3] text-[#6f777f]'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <CustomizeTableDialog
        isOpen={columnsOpen}
        visibleColumns={visibleColumns}
        onApply={(cols) => {
          setVisibleColumns(cols)
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
  const countryCode = getCountryCode(investor.country)

  return (
    <tr className={cn('h-[60px] transition-colors font-sans hover:bg-[#f8f9fa]', selected && 'bg-[#e5f6f7]/40')}>
      <td className="px-4">
        <TableCheckbox ariaLabel={`Select ${investor.name}`} checked={selected} onChange={onSelect} />
      </td>

      {visibleColumns.includes('Investor ID') && (
        <td className="px-4">
          <Link
            href={`/investors/${investor.id}`}
            className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline"
          >
            {investor.id}
          </Link>
        </td>
      )}

      {visibleColumns.includes('Investor') && (
        <td className="px-4">
          <Link
            href={`/investors/${investor.id}`}
            className="flex items-center gap-3 font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] transition-colors"
          >
            <div className="relative size-9 shrink-0">
              <div className="size-9 rounded-full overflow-hidden bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-[12px] shadow-2xs">
                {investor.avatar ? (
                  <img src={investor.avatar} alt={investor.name} className="size-full object-cover" />
                ) : (
                  investor.name.split(' ').map((n) => n[0]).join('')
                )}
              </div>
              <div className="absolute -left-1 -top-1">
                <Flag code={countryCode} size="s" />
              </div>
            </div>
            <div>
              <p className="leading-[20px]">{investor.name}</p>
              <p className="text-[12px] leading-[16px] font-normal text-[#6f777f]">{investor.personalInfo?.occupation || 'Private Investor'}</p>
            </div>
          </Link>
        </td>
      )}

      {visibleColumns.includes('Email') && (
        <td className="px-4 text-[14px] leading-[20px] text-[#6f777f]">{investor.email}</td>
      )}

      {visibleColumns.includes('Phone') && (
        <td className="px-4 text-[14px] leading-[20px] text-[#6f777f] font-mono">{investor.phone}</td>
      )}

      {visibleColumns.includes('Country') && (
        <td className="px-4 text-[14px] leading-[20px] text-[#1f2327]">
          <div className="flex items-center gap-1.5">
            <Flag code={countryCode} size="s" />
            <span>{investor.country}</span>
          </div>
        </td>
      )}

      {visibleColumns.includes('Status') && (
        <td className="px-4">
          <FigmaStatusBadge status={investor.status} />
        </td>
      )}

      {visibleColumns.includes('Verification') && (
        <td className="px-4">
          <FigmaStatusBadge status={investor.verification} />
        </td>
      )}

      {visibleColumns.includes('Requests') && (
        <td className="px-4 font-bold text-[14px] leading-[20px] text-[#1f2327]">{investor.requests}</td>
      )}

      {visibleColumns.includes('Deals') && (
        <td className="px-4 font-bold text-[14px] leading-[20px] text-[#1f2327]">{investor.deals}</td>
      )}

      {visibleColumns.includes('Score') && (
        <td className="px-4 font-bold text-[#00c2cb]">{investor.score} / 100</td>
      )}

      {visibleColumns.includes('Last Login') && (
        <td className="px-4 text-[13px] text-[#6f777f]">{investor.lastLogin}</td>
      )}

      {visibleColumns.includes('Joined') && (
        <td className="px-4 text-[13px] text-[#6f777f]">{investor.joined}</td>
      )}

      <td className="px-4">
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

export function InvestorsManagement() {
  return (
    <ToastProvider>
      <InvestorsInner />
    </ToastProvider>
  )
}
