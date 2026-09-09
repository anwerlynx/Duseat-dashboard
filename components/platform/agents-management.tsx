'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileDown,
  Filter,
  KeyRound,
  LogIn,
  MoreHorizontal,
  Pencil,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  X,
  Plus,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Mail,
  Building2,
  Award,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { EditAgentBadgeModal } from './edit-agent-badge-modal'
import { EditAgentProfileModal } from './edit-agent-profile-modal'
import { CustomizeTableDialog } from './customize-table-dialog'
import { ScheduleExportModal } from './schedule-export-modal'
import { DateRangePicker } from './date-range-picker'
import { agents as initialAgents, type PlatformAgent } from '@/lib/platform-users'
import { TableCheckbox } from '@/components/ui/table-checkbox'

import { AgentPlanBadge, FigmaStatusBadge, RateBadge, CounterBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import { FilterTabs, MetricCard, SearchInput, Pagination, EmptyState, TableAvatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Agent = PlatformAgent

const columns = [
  'Agent ID',
  'Name',
  'Agency',
  'RERA Number',
  'License',
  'Subscription',
  'Rating',
  'Offers',
  'Accepted Offers',
  'Revenue',
  'Last Login',
  'Actions',
]

function AgentsInner() {
  const router = useRouter()
  const { toast } = useToast()
  const storageKey = 'duseat_agents_records'
  const deletedStorageKey = 'duseat_deleted_agents_records'

  const [badgeAgent, setBadgeAgent] = React.useState<Agent | null>(null)
  const [editProfileAgent, setEditProfileAgent] = React.useState<Agent | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState('All Time')
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)

  const [rows, setRows] = React.useState<Agent[]>(initialAgents)
  const [deletedRows, setDeletedRows] = React.useState<Agent[]>([
    {
      id: 'AG-1039',
      name: 'Khaled Mansoor',
      agency: 'Elite Towers Real Estate',
      email: 'khaled@elitetowers.ae',
      phone: '+971 50 119 4022',
      country: 'United Arab Emirates',
      countryFlag: '🇦🇪',
      reraNumber: 'BRN-19042',
      verification: 'Documents',
      status: 'Deleted',
      license: 'TL 190-420',
      joined: '12 Jan 2026',
      rating: 3.8,
      offers: 22,
      accepted: 4,
      subscription: 'Standard agent',
      revenue: 'AED 84,000',
      lastLogin: '18 Apr 2026',
      company: { tradeName: 'Elite Towers', legalName: 'Elite Towers Real Estate LLC', address: 'Business Bay Tower A', emirate: 'Dubai', teamSize: '5 agents', website: 'elitetowers.ae' },
      tradeLicense: { number: 'TL-190-420', expiry: '12 Jan 2027', issuer: 'Dubai DED', status: 'Expired' },
      reraVerification: { number: 'BRN-19042', category: 'Broker', expiry: '12 Jan 2027', status: 'Expired' },
      documents: [],
      performance: { responseRate: '60%', conversionRate: '12%', avgResponse: '45 min', rating: '3.8 / 5', activeDeals: 0 },
      offersList: [],
      requestsWon: [],
      dealList: [],
      chats: [],
      payments: [],
      reports: [],
      timeline: [],
      notes: [{ id: 'dn1', title: 'Deleted by Admin', detail: 'Account removed on 18 Apr 2026 at broker request.', date: '18 Apr 2026', tone: 'warning' }],
    },
  ])

  const [query, setQuery] = React.useState('')
  const [tab, setTab] = React.useState<'All agents' | 'Verified' | 'Pending verification' | 'Suspended' | 'Expired license' | 'Deleted users'>('All agents')
  const [agencyFilter, setAgencyFilter] = React.useState('All agencies')
  const [subscriptionFilter, setSubscriptionFilter] = React.useState('All subscriptions')
  const [countryFilter, setCountryFilter] = React.useState('All countries')
  const [verificationFilter, setVerificationFilter] = React.useState('All verifications')
  const [statusFilter, setStatusFilter] = React.useState('All statuses')
  const [showFilters, setShowFilters] = React.useState(true)
  const [sortOption, setSortOption] = React.useState('newest')

  const [selected, setSelected] = React.useState<string[]>([])
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState(columns.slice(0, -1))
  const [confirm, setConfirm] = React.useState<ConfirmRequest | null>(null)

  // Load from local storage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) setRows(parsed)
      }
      const savedDeleted = localStorage.getItem(deletedStorageKey)
      if (savedDeleted) {
        const parsedDel = JSON.parse(savedDeleted)
        if (Array.isArray(parsedDel)) setDeletedRows(parsedDel)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const saveRows = (newRows: Agent[]) => {
    setRows(newRows)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRows))
    } catch (e) {
      // ignore
    }
  }

  const saveDeletedRows = (newDel: Agent[]) => {
    setDeletedRows(newDel)
    try {
      localStorage.setItem(deletedStorageKey, JSON.stringify(newDel))
    } catch (e) {
      // ignore
    }
  }

  // Active dataset depending on Deleted users tab
  const activeDataset = tab === 'Deleted users' ? deletedRows : rows

  const filtered = activeDataset.filter((agent) => {
    const matchesQuery = Object.values(agent).join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesAgency = agencyFilter === 'All agencies' || agent.agency === agencyFilter
    const matchesSubscription = subscriptionFilter === 'All subscriptions' || agent.subscription.toLowerCase().includes(subscriptionFilter.toLowerCase().replace(' agent', ''))
    const matchesCountry = countryFilter === 'All countries' || agent.country === countryFilter
    const matchesVerification = verificationFilter === 'All verifications' || agent.verification === verificationFilter
    const matchesStatus = statusFilter === 'All statuses' || agent.status === statusFilter

    if (tab === 'Deleted users') {
      return matchesQuery
    }

    const matchesTab =
      tab === 'All agents' ||
      (tab === 'Verified' && agent.status === 'Verified') ||
      (tab === 'Pending verification' && ['Pending', 'Under review'].includes(agent.status)) ||
      (tab === 'Suspended' && agent.status === 'Suspended') ||
      (tab === 'Expired license' && (agent.tradeLicense?.status === 'Expired' || agent.status === 'Rejected'))

    return matchesQuery && matchesAgency && matchesSubscription && matchesCountry && matchesVerification && matchesStatus && matchesTab
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginatedAgents = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [filtered, currentPage, rowsPerPage])

  const notify = (title: string, description: string, variant: 'success' | 'info' | 'error' = 'success') =>
    toast({ variant, title, description })

  const patchRows = (ids: string[], patch: Partial<Agent>) => {
    const updated = rows.map((row) => (ids.includes(row.id) ? { ...row, ...patch } : row))
    saveRows(updated)
  }

  const applyAction = (kind: string, ids: string[], label: string) => {
    switch (kind) {
      case 'approve':
      case 'verify':
        patchRows(ids, { status: 'Verified', verification: 'RERA + KYC' })
        notify('Agent verified', `${label} approved and verified with RERA + KYC.`)
        break
      case 'reject':
        patchRows(ids, { status: 'Rejected' })
        notify('Agent rejected', `${label} application was rejected.`, 'error')
        break
      case 'suspend':
        patchRows(ids, { status: 'Suspended' })
        notify('Agent suspended', `${label} has been suspended.`, 'error')
        break
      case 'delete':
        const toDelete = rows.filter((r) => ids.includes(r.id))
        const remaining = rows.filter((r) => !ids.includes(r.id))
        saveRows(remaining)
        saveDeletedRows([...deletedRows, ...toDelete.map((a) => ({ ...a, status: 'Deleted' }))])
        setSelected([])
        notify('Agent deleted', `${label} moved to Deleted Users archive.`, 'error')
        break
      case 'restore':
        const toRestore = deletedRows.filter((r) => ids.includes(r.id))
        const remainingDeleted = deletedRows.filter((r) => !ids.includes(r.id))
        saveDeletedRows(remainingDeleted)
        saveRows([...rows, ...toRestore.map((a) => ({ ...a, status: 'Pending' }))])
        setSelected([])
        notify('Agent restored', `${label} restored to active directory.`, 'success')
        break
      case 'upgrade-plan':
        patchRows(ids, { subscription: 'Elite agent' })
        notify('Plan upgraded', `${label} upgraded to Elite agent.`)
        break
      case 'downgrade-plan':
        patchRows(ids, { subscription: 'Power agent' })
        notify('Plan downgraded', `${label} moved to Power agent.`, 'info')
        break
      case 'reset-password':
        notify('Reset link sent', `Password reset link emailed to ${label}.`)
        break
      case 'send-notification':
        notify('Notification sent', `Notification delivered to ${label}.`)
        break
      case 'login-as':
        notify('Login as agent', `Impersonation session started for ${label}.`, 'info')
        break
      case 'export':
        handleExportCsv(rows.filter((r) => ids.includes(r.id)))
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
    reject: {
      title: 'Reject Agent',
      confirmLabel: 'Reject Application',
      icon: 'ban',
      tone: 'danger',
      describe: (label) => `${label} will be notified that their registration was rejected.`,
    },
    suspend: {
      title: 'Suspend Agent Account',
      confirmLabel: 'Suspend Agent',
      icon: 'suspend',
      tone: 'warning',
      describe: (label) => `${label} will be blocked from submitting property offers until reactivated.`,
    },
    delete: {
      title: 'Delete Agent Account',
      confirmLabel: 'Move to Deleted Users',
      icon: 'delete',
      tone: 'danger',
      describe: (label) => `${label} will be archived to Deleted Users with a 30-day restore guarantee.`,
    },
    'reset-password': {
      title: 'Reset Password',
      confirmLabel: 'Send Reset Link',
      icon: 'reset',
      tone: 'brand',
      describe: (label) => `A secure password reset link will be sent to ${label} via email.`,
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

  const handleAgentAction = (kind: string, agent: Agent) => {
    if (kind === 'view-profile') {
      router.push(`/agents/${agent.id}`)
      return
    }
    if (kind === 'edit-profile') {
      setEditProfileAgent(agent)
      return
    }
    if (kind === 'edit-badge') {
      setBadgeAgent(agent)
      return
    }
    runAction(kind, [agent.id], agent.name)
  }

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((agent) => agent.id))

  const handleExportCsv = (agentsToExport = filtered) => {
    const headers = ['Agent ID', 'Name', 'Agency', 'Email', 'Phone', 'Country', 'RERA Number', 'License', 'Subscription', 'Rating', 'Offers', 'Accepted', 'Revenue', 'Status', 'Joined']
    const rowsCsv = agentsToExport.map((a) => [
      a.id,
      `"${a.name}"`,
      `"${a.agency}"`,
      a.email,
      `"${a.phone}"`,
      `"${a.country}"`,
      `"${a.reraNumber}"`,
      a.license,
      `"${a.subscription}"`,
      a.rating,
      a.offers,
      a.accepted,
      `"${a.revenue}"`,
      a.status,
      `"${a.joined}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rowsCsv.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `duseat_agents_directory_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Export started', `${agentsToExport.length} agents exported to CSV.`)
  }

  return (
    <PlatformShell
      title="Agents Management"
      eyebrow="Users"
      query={query}
      onQueryChange={setQuery}
      actions={
        <button
          type="button"
          onClick={() => handleExportCsv(filtered)}
          className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
        >
          <FileDown className="size-4" />
          <span>Export CSV</span>
        </button>
      }
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">Agents Directory & Compliance</h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage licensed brokers, verify RERA & trade licenses, monitor offer metrics and manage subscriptions.
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
                href="/admin"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <KeyRound className="size-4 text-[#6f777f]" />
                <span>Admin Accounts</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Total Agents"
              value={rows.length}
              tone="neutral"
              active={tab === 'All agents'}
              onClick={() => setTab('All agents')}
            />
            <MetricCard
              label="Verified RERA"
              value={rows.filter((a) => a.status === 'Verified').length}
              tone="success"
              active={false}
              onClick={() => {
                setTab('All agents')
                setStatusFilter('Verified')
              }}
            />
            <MetricCard
              label="Pending Review"
              value={rows.filter((a) => ['Pending', 'Under review'].includes(a.status)).length}
              tone="warning"
              active={tab === 'Pending verification'}
              onClick={() => setTab('Pending verification')}
            />
            <MetricCard
              label="Suspended / Expired"
              value={rows.filter((r) => ['Suspended', 'Rejected'].includes(r.status)).length}
              tone="destructive"
              active={tab === 'Suspended' || tab === 'Expired license'}
              onClick={() => setTab('Suspended')}
            />
          </div>
        </header>

        {/* Table & Filter Container (Original GitHub Repo Layout) */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(['All agents', 'Verified', 'Pending verification', 'Suspended', 'Expired license', 'Deleted users'] as const).map((item) => {
                  const count =
                    item === 'All agents'
                      ? rows.length
                      : item === 'Verified'
                      ? rows.filter((r) => r.status === 'Verified').length
                      : item === 'Pending verification'
                      ? rows.filter((r) => ['Pending', 'Under review'].includes(r.status)).length
                      : item === 'Suspended'
                      ? rows.filter((r) => r.status === 'Suspended').length
                      : item === 'Expired license'
                      ? rows.filter((r) => r.tradeLicense?.status === 'Expired' || r.status === 'Rejected').length
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
                          item === 'Suspended' || item === 'Expired license'
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

            {/* 6 Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, agency, RERA, license…"
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
                options={['All statuses', 'Verified', 'Pending', 'Suspended', 'Rejected'].map((item) => ({
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

              {/* Plan Filter */}
              <Dropdown
                align="start"
                value={subscriptionFilter}
                onSelect={setSubscriptionFilter}
                ariaLabel="Filter by Plan"
                options={['All subscriptions', 'Pro agent', 'Elite agent', 'Power agent', 'Standard agent'].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <Award className="size-4 text-[#6f777f]" />
                    <span>{subscriptionFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Agency Filter */}
              <Dropdown
                align="start"
                value={agencyFilter}
                onSelect={setAgencyFilter}
                ariaLabel="Filter by Agency"
                options={[
                  'All agencies',
                  'Harbor Homes',
                  'Crescent Realty',
                  'Emirates Living',
                  'Avenue Realty',
                  'Nexus Properties',
                  'Vista Estates',
                ].map((item) => ({
                  label: item,
                  value: item,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                    <Building2 className="size-4 text-[#6f777f]" />
                    <span>{agencyFilter}</span>
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
                subscriptionFilter !== 'All subscriptions' ||
                agencyFilter !== 'All agencies' ||
                countryFilter !== 'All countries') && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('All statuses')
                    setSubscriptionFilter('All subscriptions')
                    setAgencyFilter('All agencies')
                    setCountryFilter('All countries')
                  }}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Bar (Figma Node 234:12116) */}
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
                      onClick={() => runAction('verify', selected, `${selected.length} agents`)}
                      className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction('suspend', selected, `${selected.length} agents`)}
                      className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                    >
                      Suspend
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction('send-notification', selected, `${selected.length} agents`)}
                      className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                    >
                      Send notification
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction('delete', selected, `${selected.length} agents`)}
                      className="h-[34px] rounded-[8px] px-3.5 text-[13px] font-semibold text-[#f04438] hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => runAction('restore', selected, `${selected.length} agents`)}
                    className="h-[34px] rounded-[8px] bg-[#17b26a] px-3.5 text-[13px] font-semibold text-white hover:bg-[#159a5c] transition-colors cursor-pointer"
                  >
                    Restore Agents
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
          <div className="overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1500px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12">
                  <th className="w-12 px-4">
                    <TableCheckbox
                      ariaLabel="Select all agents"
                      checked={filtered.length > 0 && selected.length === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  {columns.map((column) =>
                    visibleColumns.includes(column) || column === 'Actions' ? (
                      <th key={column} className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] font-sans">
                        {column}
                      </th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginatedAgents.map((agent) => (
                  <AgentRow
                    key={agent.id}
                    agent={agent}
                    isDeleted={tab === 'Deleted users'}
                    selected={selected.includes(agent.id)}
                    onSelect={() =>
                      setSelected((items) =>
                        items.includes(agent.id) ? items.filter((id) => id !== agent.id) : [...items, agent.id]
                      )
                    }
                    visibleColumns={visibleColumns}
                    onAction={handleAgentAction}
                  />
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <EmptyState
                title="No agents found"
                description="Try adjusting your search query or reset your active filters."
                actionLabel="Reset filters"
                onAction={() => {
                  setQuery('')
                  setAgencyFilter('All agencies')
                  setSubscriptionFilter('All plans')
                  setCountryFilter('All countries')
                  setVerificationFilter('All verification')
                  setStatusFilter('All statuses')
                }}
              />
            )}
          </div>

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
              itemLabel="agents"
            />
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
      {editProfileAgent && (
        <EditAgentProfileModal
          agent={editProfileAgent}
          isOpen={!!editProfileAgent}
          onClose={() => setEditProfileAgent(null)}
          onSave={(updatedAgent) => {
            setRows((prev) => {
              const next = prev.map((r) => (r.id === updatedAgent.id ? updatedAgent : r))
              try {
                localStorage.setItem(storageKey, JSON.stringify(next))
              } catch {}
              return next
            })
            notify('Profile Updated', `${updatedAgent.name}'s profile has been updated successfully.`)
          }}
        />
      )}
      {badgeAgent && (
        <EditAgentBadgeModal
          agent={badgeAgent}
          isOpen={!!badgeAgent}
          onClose={() => setBadgeAgent(null)}
          onSave={(plan, badge) => {
            patchRows([badgeAgent.id], { subscription: `${plan} agent` })
            notify('Plan & badge updated', `${badgeAgent.name} assigned ${plan} plan with badge: ${badge || 'Standard'}.`)
          }}
        />
      )}
      <ScheduleExportModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={(data) => {
          notify('Export scheduled', `Scheduled ${data.frequency} export (${data.format.toUpperCase()}) to ${data.recipients.join(', ')}.`)
        }}
        defaultName="Agents Directory - Weekly Export"
      />
    </PlatformShell>
  )
}

function AgentRow({
  agent,
  isDeleted,
  selected,
  onSelect,
  visibleColumns,
  onAction,
}: {
  agent: Agent
  isDeleted?: boolean
  selected: boolean
  onSelect: () => void
  visibleColumns: string[]
  onAction: (kind: string, agent: Agent) => void
}) {
  const router = useRouter()
  const cell = (column: string, content: React.ReactNode) =>
    visibleColumns.includes(column) ? <td className="whitespace-nowrap px-4 text-[14px] font-sans">{content}</td> : null

  return (
    <tr className="h-14 bg-white hover:bg-[#f8f9fa] transition-colors">
      <td className="px-4">
        <TableCheckbox ariaLabel={`Select ${agent.name}`} checked={selected} onChange={onSelect} />
      </td>

      {/* 0. Agent ID */}
      {cell(
        'Agent ID',
        <button
          type="button"
          onClick={() => router.push(`/agents/${agent.id}`)}
          className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
        >
          {agent.id}
        </button>
      )}

      {/* 1. Name */}
      {cell(
        'Name',
        <div className="flex items-center gap-3">
          <TableAvatar
            src={agent.avatar}
            name={agent.name}
            countryCode={getCountryCode(agent.country || 'United Arab Emirates')}
            size="md"
            variant="brand"
            onClick={() => router.push(`/agents/${agent.id}`)}
          />
          <div className="flex flex-col min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/agents/${agent.id}`)}
              className="text-left font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] truncate cursor-pointer transition-colors"
            >
              {agent.name}
            </button>
            <span className="text-[12px] leading-[16px] text-[#6f777f] truncate">{agent.email}</span>
          </div>
        </div>
      )}

      {/* 2. Agency */}
      {cell(
        'Agency',
        <div className="flex items-center gap-1.5 font-normal text-[14px] leading-[20px] text-[#1f2327]">
          <Building2 className="size-4 text-[#9da4ae]" />
          <span>{agent.agency}</span>
        </div>
      )}

      {/* 3. RERA Number */}
      {cell(
        'RERA Number',
        <span className="font-mono text-xs font-semibold text-[#1f2327] bg-[#eff1f3] px-2 py-1 rounded-[6px]">
          {agent.reraNumber || 'BRN-61284'}
        </span>
      )}

      {/* 4. License */}
      {cell(
        'License',
        <span className="font-mono text-xs text-[#6f777f]">
          {agent.license}
        </span>
      )}

      {/* 5. Subscription */}
      {cell(
        'Subscription',
        <AgentPlanBadge plan={agent.subscription} />
      )}

      {/* 6. Rating */}
      {cell(
        'Rating',
        <RateBadge rate={agent.rating.toFixed(1)} />
      )}

      {/* 7. Offers */}
      {cell(
        'Offers',
        <span className="font-semibold text-[#1f2327]">{agent.offers}</span>
      )}

      {/* 8. Accepted Offers */}
      {cell(
        'Accepted Offers',
        <span className="font-semibold text-[#17b26a]">{agent.accepted}</span>
      )}

      {/* 9. Revenue */}
      {cell(
        'Revenue',
        <span className="font-bold text-[#1f2327]">{agent.revenue}</span>
      )}

      {/* 10. Last Login */}
      {cell(
        'Last Login',
        <span className="text-[13px] text-[#6f777f]">{agent.lastLogin}</span>
      )}

      {/* 11. Actions */}
      <td className="whitespace-nowrap px-4 text-[14px]">
        <div className="flex items-center gap-2">
          {!isDeleted ? (
            <>
              <button
                type="button"
                onClick={() => router.push(`/agents/${agent.id}`)}
                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                title="View Profile"
              >
                <Eye className="size-4" />
              </button>

              <Dropdown
                align="end"
                ariaLabel="More actions"
                floating
                options={[
                  { label: 'View Profile', value: 'view-profile', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                  { label: 'Edit Profile', value: 'edit-profile', icon: <Pencil className="size-4 text-[#00c2cb]" /> },
                  { label: 'Edit Plan & Badge Preset', value: 'edit-badge', icon: <Award className="size-4 text-[#00c2cb]" /> },
                  ...(agent.status !== 'Verified'
                    ? [{ label: 'Approve & Verify', value: 'approve', icon: <UserCheck className="size-4 text-emerald-600" /> }]
                    : []),
                  { label: 'Upgrade Plan', value: 'upgrade-plan', icon: <ArrowUpRight className="size-4 text-[#00c2cb]" /> },
                  { label: 'Downgrade Plan', value: 'downgrade-plan', icon: <TrendingUp className="size-4 text-[#6f777f]" /> },
                  { label: 'Reset Password', value: 'reset-password', icon: <KeyRound className="size-4 text-[#6f777f]" /> },
                  { label: 'Login as Agent', value: 'login-as', icon: <LogIn className="size-4 text-[#1f2327]" /> },
                  { label: 'Send Notification', value: 'send-notification', icon: <Mail className="size-4 text-[#00c2cb]" /> },
                  ...(agent.status !== 'Suspended'
                    ? [{ label: 'Suspend Agent', value: 'suspend', icon: <UserX className="size-4 text-amber-600" />, destructive: true }]
                    : []),
                  { label: 'Reject Application', value: 'reject', icon: <AlertCircle className="size-4 text-rose-600" />, destructive: true },
                  { label: 'Delete Agent', value: 'delete', icon: <Trash2 className="size-4 text-rose-600" />, destructive: true },
                ]}
                onSelect={(val) => onAction(val, agent)}
                trigger={
                  <span className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer">
                    <MoreHorizontal className="size-4" />
                  </span>
                }
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => onAction('restore', agent)}
              className="flex items-center gap-1.5 rounded-[6px] bg-[#17b26a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#159a5c] transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Restore</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export function AgentsManagement() {
  return (
    <ToastProvider>
      <AgentsInner />
    </ToastProvider>
  )
}

