'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
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
  AlertTriangle,
  Mail,
  Building2,
  Award,
  Bookmark,
  Users,
  Clock,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { EditAgentBadgeModal } from './edit-agent-badge-modal'
import { EditAgentProfileModal } from './edit-agent-profile-modal'
import { CustomizeTableDialog, defaultTablePresets, type TableViewPreset } from './customize-table-dialog'
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
  const [tab, setTab] = React.useState<'All agents' | 'Verified' | 'Pending verification' | 'Expired license'>('All agents')
  const [agencyFilter, setAgencyFilter] = React.useState('All agencies')
  const [subscriptionFilter, setSubscriptionFilter] = React.useState('All subscriptions')
  const [countryFilter, setCountryFilter] = React.useState('All countries')
  const [showFilters, setShowFilters] = React.useState(true)
  const [sortOption, setSortOption] = React.useState('newest')

  const [selected, setSelected] = React.useState<string[]>([])
  const [columnsOpen, setColumnsOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState(columns)
  const [activePresetId, setActivePresetId] = React.useState('default')
  const [presets, setPresets] = React.useState<TableViewPreset[]>(defaultTablePresets)
  const [confirm, setConfirm] = React.useState<ConfirmRequest | null>(null)
  const [headerCollapsed, setHeaderCollapsed] = React.useState(false)

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

  // Active dataset
  const activeDataset = rows

  const filtered = activeDataset.filter((agent) => {
    const matchesQuery = Object.values(agent).join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesAgency = agencyFilter === 'All agencies' || agent.agency === agencyFilter
    const matchesSubscription = subscriptionFilter === 'All subscriptions' || agent.subscription.toLowerCase().includes(subscriptionFilter.toLowerCase().replace(' agent', ''))
    const matchesCountry = countryFilter === 'All countries' || agent.country === countryFilter
    const matchesTab =
      tab === 'All agents' ||
      (tab === 'Verified' && agent.status === 'Verified') ||
      (tab === 'Pending verification' && ['Pending', 'Under review'].includes(agent.status)) ||
      (tab === 'Expired license' && (agent.tradeLicense?.status === 'Expired' || agent.status === 'Rejected'))
    return matchesQuery && matchesAgency && matchesSubscription && matchesCountry && matchesTab
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
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-3.5 sm:gap-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start justify-between sm:block gap-2">
              <div>
                <h1 className="text-[20px] sm:text-[32px] font-bold leading-[28px] sm:leading-[40px] text-[#1f2327]">Agents Directory & Compliance</h1>
                <p className={cn("mt-0.5 text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-[#6f777f]", headerCollapsed && "hidden sm:block")}>
                  Manage licensed brokers, verify RERA & trade licenses, monitor offer metrics and manage subscriptions.
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
                href="/admin"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <KeyRound className="size-4 text-[#6f777f]" />
                <span>Admin Accounts</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className={cn("grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3", headerCollapsed && "hidden sm:grid")}>
            <MetricCard
              label="Total Agents"
              value={rows.length}
              icon={Users}
              tone="neutral"
              active={tab === 'All agents'}
              onClick={() => setTab('All agents')}
            />
            <MetricCard
              label="Verified RERA"
              value={rows.filter((a) => a.status === 'Verified').length}
              icon={ShieldCheck}
              tone="success"
              active={tab === 'Verified'}
              onClick={() => {
                setTab('Verified')
              }}
            />
            <MetricCard
              label="Pending Review"
              value={rows.filter((a) => ['Pending', 'Under review'].includes(a.status)).length}
              icon={Clock}
              tone="warning"
              active={tab === 'Pending verification'}
              onClick={() => setTab('Pending verification')}
            />
            <MetricCard
              label="Expired License"
              value={rows.filter((r) => r.tradeLicense?.status === 'Expired' || r.status === 'Rejected').length}
              icon={AlertTriangle}
              tone="destructive"
              active={tab === 'Expired license'}
              onClick={() => setTab('Expired license')}
            />
          </div>
        </header>

        {/* Table & Filter Container (Original GitHub Repo Layout) */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Tabs list - swipeable on mobile */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none max-w-full py-1 -mx-1 px-1 sm:mx-0 sm:px-0 select-none">
                {(['All agents', 'Verified', 'Pending verification', 'Expired license'] as const).map((item) => {
                  const count =
                    item === 'All agents'
                      ? rows.length
                      : item === 'Verified'
                      ? rows.filter((r) => r.status === 'Verified').length
                      : item === 'Pending verification'
                      ? rows.filter((r) => ['Pending', 'Under review'].includes(r.status)).length
                      : rows.filter((r) => r.tradeLicense?.status === 'Expired' || r.status === 'Rejected').length

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
                            : item === 'Expired license'
                            ? 'bg-[#d92d20] text-white shadow-2xs font-semibold'
                            : 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{item}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          tab === item
                            ? 'bg-white/25 text-white'
                            : item === 'Expired license'
                            ? 'bg-[#fef3f2] text-[#d92d20]'
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

              {/* Table Tools: Presets, Columns, Export */}
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
                      className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-2.5 sm:px-3.5 text-[13px] sm:text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                    >
                      <Download className="size-4 text-white shrink-0" />
                      <span className="whitespace-nowrap">Export</span>
                      <ChevronDown className="size-3.5 opacity-70 shrink-0" />
                    </button>
                  }
                  ariaLabel="Export options"
                />
              </div>
            </div>

            {/* Filters Row */}
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
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer whitespace-nowrap">
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
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer whitespace-nowrap">
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
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer whitespace-nowrap">
                    <span>🌍</span>
                    <span>{countryFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Date Range Picker */}
              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {(subscriptionFilter !== 'All subscriptions' ||
                agencyFilter !== 'All agencies' ||
                countryFilter !== 'All countries' ||
                dateRange !== 'All Time') && (
                <button
                  type="button"
                  onClick={() => {
                    setSubscriptionFilter('All subscriptions')
                    setAgencyFilter('All agencies')
                    setCountryFilter('All countries')
                    setDateRange('All Time')
                  }}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer whitespace-nowrap"
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
            {paginatedAgents.map((agent) => (
              <AgentMobileCard
                key={agent.id}
                agent={agent}
                isDeleted={false}
                selected={selected.includes(agent.id)}
                onSelect={() =>
                  setSelected((items) =>
                    items.includes(agent.id) ? items.filter((id) => id !== agent.id) : [...items, agent.id]
                  )
                }
                onAction={handleAgentAction}
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
                      ariaLabel="Select all agents"
                      checked={filtered.length > 0 && selected.length === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  {visibleColumns.map((column) => (
                    <th key={column} className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] font-sans">
                      {column}
                    </th>
                  ))}
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] font-sans text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginatedAgents.map((agent) => (
                  <AgentRow
                    key={agent.id}
                    agent={agent}
                    isDeleted={false}
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
          </div>

            {filtered.length === 0 && (
              <EmptyState
                title="No agents found"
                description="Try adjusting your search query or reset your active filters."
                actionLabel="Reset filters"
                onAction={() => {
                  setQuery('')
                  setAgencyFilter('All agencies')
                  setSubscriptionFilter('All subscriptions')
                  setCountryFilter('All countries')
                  setDateRange('All Time')
                  setTab('All agents')
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
              itemLabel="agents"
            />
          </div>
        </section>
      </div>

      <CustomizeTableDialog
        isOpen={columnsOpen}
        visibleColumns={visibleColumns}
        activePresetId={activePresetId}
        presets={presets}
        storageKeyPrefix="agents"
        onPresetsChange={(newPresets) => setPresets(newPresets)}
        onApply={(cols, presetId) => {
          setVisibleColumns(cols)
          if (presetId) setActivePresetId(presetId)
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

function renderAgentCell(column: string, agent: Agent, router: ReturnType<typeof useRouter>) {
  switch (column) {
    case 'Agent ID':
    case 'ID':
      return (
        <button
          type="button"
          onClick={() => router.push(`/agents/${agent.id}`)}
          className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
        >
          {agent.id}
        </button>
      )

    case 'Name':
      return (
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
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => router.push(`/agents/${agent.id}`)}
                className="text-left font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] truncate cursor-pointer transition-colors"
              >
                {agent.name}
              </button>
              <span className="font-mono text-[11px] font-semibold text-[#00c2cb] bg-[#00c2cb]/10 px-1.5 py-0.2 rounded-[4px] shrink-0">
                {agent.id}
              </span>
            </div>
            <span className="text-[12px] leading-[16px] text-[#6f777f] truncate">{agent.email}</span>
          </div>
        </div>
      )

    case 'Email':
      return <span className="text-[14px] text-[#6f777f]">{agent.email}</span>

    case 'Phone':
      return <span className="font-mono text-[14px] text-[#1f2327]">{agent.phone}</span>

    case 'Agency':
      return (
        <div className="flex items-center gap-1.5 font-normal text-[14px] leading-[20px] text-[#1f2327]">
          <Building2 className="size-4 text-[#9da4ae]" />
          <span>{agent.agency}</span>
        </div>
      )

    case 'Country':
      return (
        <div className="flex items-center gap-1.5 text-[14px] text-[#1f2327]">
          <Flag code={getCountryCode(agent.country || 'United Arab Emirates')} size="s" />
          <span>{agent.country}</span>
        </div>
      )

    case 'City':
      return <span className="text-[14px] text-[#1f2327]">{agent.company?.emirate || 'Dubai'}</span>

    case 'Role':
      return (
        <span className="rounded-[6px] bg-[#eff1f3] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">
          {agent.reraVerification?.category || 'Licensed Broker'}
        </span>
      )

    case 'Status':
    case 'Account Status':
      return <FigmaStatusBadge status={agent.status} />

    case 'RERA Number':
    case 'RERA ID':
      return (
        <span className="font-mono text-xs font-semibold text-[#1f2327] bg-[#eff1f3] px-2 py-1 rounded-[6px]">
          {agent.reraNumber || agent.reraVerification?.number || 'BRN-61284'}
        </span>
      )

    case 'Verification Status':
    case 'Verification':
      return <FigmaStatusBadge status={agent.verification || agent.status || 'Verified'} />

    case 'Verification Type':
      return (
        <span className="rounded-[6px] bg-[#dfefe8] border border-[#9cdabd] px-2 py-0.5 text-xs font-medium text-[#17b26a]">
          {agent.verification || 'RERA + KYC'}
        </span>
      )

    case 'License':
    case 'License Status':
      return (
        <span className="font-mono text-xs text-[#6f777f]">
          {agent.license || agent.tradeLicense?.number || 'TL 190-420'}
        </span>
      )

    case 'License Expiry':
      return (
        <span className="text-xs text-[#6f777f]">
          {agent.tradeLicense?.expiry || '12 Jan 2027'}
        </span>
      )

    case 'Verified Date':
      return (
        <span className="text-xs text-[#6f777f]">
          {agent.joined || '12 Jan 2026'}
        </span>
      )

    case 'Subscription':
      return <AgentPlanBadge plan={agent.subscription} />

    case 'Rating':
      return <RateBadge rate={agent.rating.toFixed(1)} />

    case 'Offers':
      return <span className="font-semibold text-[#1f2327]">{agent.offers}</span>

    case 'Accepted Offers':
      return <span className="font-semibold text-[#17b26a]">{agent.accepted}</span>

    case 'Active Deals':
      return (
        <span className="font-semibold text-[#00c2cb]">
          {agent.performance?.activeDeals ?? Math.max(1, agent.accepted)}
        </span>
      )

    case 'Total Deals':
      return (
        <span className="font-semibold text-[#1f2327]">
          {agent.dealList?.length ? agent.dealList.length : (agent.accepted + 3)}
        </span>
      )

    case 'Success Rate':
      return (
        <span className="font-semibold text-[#17b26a]">
          {agent.performance?.conversionRate || `${Math.min(100, Math.round((agent.accepted / Math.max(agent.offers, 1)) * 100))}%`}
        </span>
      )

    case 'Revenue':
      return <span className="font-bold text-[#1f2327]">{agent.revenue}</span>

    case 'Join Date':
      return (
        <span className="text-[13px] text-[#6f777f] flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-[#9da4ae]" />
          {agent.joined}
        </span>
      )

    case 'Last Login':
      return <span className="text-[13px] text-[#6f777f]">{agent.lastLogin}</span>

    case 'Last Active':
      return <span className="text-[13px] text-[#6f777f]">{agent.lastLogin || '1 hour ago'}</span>

    case 'Total Requests':
      return (
        <span className="font-semibold text-[#1f2327]">
          {agent.requestsWon?.length ? agent.requestsWon.length * 3 : 18}
        </span>
      )

    case 'Active Conversations':
      return <span className="font-semibold text-[#1f2327]">{agent.chats?.length || 6}</span>

    case 'Response Rate':
      return (
        <span className="font-semibold text-[#17b26a]">
          {agent.performance?.responseRate || '96%'}
        </span>
      )

    case 'Average Response Time':
      return (
        <span className="text-xs text-[#6f777f]">
          {agent.performance?.avgResponse || '20 min'}
        </span>
      )

    case 'Completed Deals':
      return (
        <span className="font-semibold text-[#1f2327]">
          {agent.dealList?.filter((d) => d.status === 'Completed').length || agent.accepted}
        </span>
      )

    default:
      return (
        <span className="text-xs text-[#6f777f]">
          {(agent as any)[column.toLowerCase()] || (agent as any)[column] || '—'}
        </span>
      )
  }
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

  return (
    <tr className={cn('h-[64px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap', selected && 'bg-[#e5f6f7]/40')}>
      <td className="px-4">
        <TableCheckbox ariaLabel={`Select ${agent.name}`} checked={selected} onChange={onSelect} />
      </td>

      {visibleColumns.map((column) => (
        <td key={column} className="whitespace-nowrap px-4 text-[14px] font-sans">
          {renderAgentCell(column, agent, router)}
        </td>
      ))}

      {/* Actions */}
      <td className="whitespace-nowrap px-4 text-[14px] text-right">
        <div className="flex items-center justify-end gap-1.5">
          {!isDeleted ? (
            <>
              <button
                type="button"
                onClick={() => router.push(`/agents/${agent.id}`)}
                className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
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
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                    title="More actions"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
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

function AgentMobileCard({
  agent,
  isDeleted,
  selected,
  onSelect,
  onAction,
}: {
  agent: Agent
  isDeleted: boolean
  selected: boolean
  onSelect: () => void
  onAction: (kind: string, agent: Agent) => void
}) {
  const router = useRouter()
  const countryCode = getCountryCode(agent.country)

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
            ariaLabel={`Select ${agent.name}`}
            checked={selected}
            onChange={onSelect}
          />
          <Link href={`/agents/${agent.id}`} className="cursor-pointer">
            <TableAvatar
              src={agent.avatar}
              name={agent.name}
              countryCode={countryCode}
              size="md"
              variant="brand"
            />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/agents/${agent.id}`}
                className="font-bold text-[#202428] text-[14px] hover:text-[#06B6C9] hover:underline truncate"
              >
                {agent.name}
              </Link>
              <AgentPlanBadge plan={agent.subscription} compact />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#68727D]">
              <span className="font-semibold text-[#202428] truncate">{agent.agency}</span>
              <span>•</span>
              <span className="font-mono">{agent.id}</span>
            </div>
          </div>
        </div>

        <FigmaStatusBadge status={agent.status} />
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-b border-[#E2E5E8] py-2 text-[12px]">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8A939D] block">RERA License</span>
          <span className="font-mono text-[#202428] truncate block">{agent.reraNumber}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8A939D] block">Rating</span>
          <span className="font-bold text-[#202428] flex items-center gap-1">
            ⭐ {agent.rating}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8A939D] block">Offers / Won</span>
          <span className="font-bold text-[#202428] block">{agent.offers} / {agent.accepted}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-[11px] text-[#8A939D]">
          Revenue: <strong className="text-[#202428] font-semibold">{agent.revenue}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => router.push(`/agents/${agent.id}`)}
            className="h-[30px] rounded-[6px] border border-[#E2E5E8] bg-white px-2.5 text-[12px] font-medium text-[#202428] hover:bg-[#F8F9FA]"
          >
            Profile
          </button>
          <Dropdown
            align="end"
            options={
              !isDeleted
                ? [
                    { label: 'View Profile', value: 'view' },
                    { label: 'Edit Profile', value: 'edit-profile' },
                    { label: 'Edit Badge / Plan', value: 'edit-badge' },
                    { label: 'Verify Agent', value: 'approve' },
                    { label: 'Suspend Agent', value: 'suspend' },
                    { label: 'Delete Record', value: 'delete', destructive: true },
                  ]
                : [{ label: 'Restore Account', value: 'restore' }]
            }
            onSelect={(kind) => onAction(kind, agent)}
            trigger={
              <button
                type="button"
                className="flex size-7.5 items-center justify-center rounded-[6px] border border-[#E2E5E8] text-[#68727D] hover:bg-[#F8F9FA]"
                aria-label={`More actions for ${agent.name}`}
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

export function AgentsManagement() {
  return (
    <ToastProvider>
      <AgentsInner />
    </ToastProvider>
  )
}

