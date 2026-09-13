'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Activity,
  Search,
  Filter,
  Download,
  Shield,
  User,
  Key,
  CreditCard,
  FileCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ChevronDown,
  X,
  Clock,
  Globe,
  SlidersHorizontal,
  Copy,
  Check,
  Terminal,
  Layers,
  FileText,
  Bookmark,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import {
  MetricCard,
  TableCheckbox,
  TableAvatar,
  Pagination,
  EmptyState,
} from '@/components/ui'
import { cn, exportToCsv } from '@/lib/utils'

export type LogCategory =
  | 'All'
  | 'Admin Actions'
  | 'Investor Activities'
  | 'Agent Activities'
  | 'Security & Logins'
  | 'Financial & Billing'
  | 'API & System Logs'

export type LogSeverity = 'info' | 'success' | 'warning' | 'critical'

export interface ActivityLog {
  id: string
  timestamp: string
  actor: {
    name: string
    email: string
    role: 'Super Admin' | 'Moderator' | 'Agent' | 'Investor' | 'System Bot'
    avatar?: string
  }
  module: 'Users' | 'Verification' | 'Requests' | 'Offers' | 'Deals' | 'Billing' | 'Security' | 'API' | 'Settings'
  action: string
  severity: LogSeverity
  targetId: string
  targetType: string
  ipAddress: string
  location: string
  metadata: Record<string, any>
}

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-88910',
    timestamp: '2026-09-11 10:48:15',
    actor: {
      name: 'Tariq Al-Mansoor',
      email: 'tariq.admin@duseat.ae',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    module: 'Verification',
    action: 'Approved RERA Trade License & Emirates ID',
    severity: 'success',
    targetId: 'AGT-9012',
    targetType: 'Agent',
    ipAddress: '194.170.82.14',
    location: 'Dubai, UAE',
    metadata: {
      agency: 'Prestige Royal Properties LLC',
      licenseNo: 'TL-98214-DXB',
      approvedDocuments: ['Trade_License_2026.pdf', 'Emirates_ID_Front.jpg'],
      auditNote: 'Verified valid against DED portal API validation.',
    },
  },
  {
    id: 'LOG-88909',
    timestamp: '2026-09-11 10:32:04',
    actor: {
      name: 'Elena Rostova',
      email: 'elena.r@dubai-invest.ch',
      role: 'Investor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    module: 'Requests',
    action: 'Published High-Yield Request (AED 12.5M)',
    severity: 'info',
    targetId: 'REQ-2048-04',
    targetType: 'Request',
    ipAddress: '83.136.107.21',
    location: 'Zurich, Switzerland',
    metadata: {
      budget: 'AED 12,500,000',
      propertyType: 'Penthouse / Waterfront',
      location: 'Palm Jumeirah',
      targetedAgentsCount: 42,
    },
  },
  {
    id: 'LOG-88908',
    timestamp: '2026-09-11 10:14:49',
    actor: {
      name: 'Security Shield Bot',
      email: 'waf-shield@internal.duseat.ae',
      role: 'System Bot',
    },
    module: 'Security',
    action: 'Brute force login prevention trigger: IP Rate Limited',
    severity: 'critical',
    targetId: 'IP-45.155.205.233',
    targetType: 'Firewall Rule',
    ipAddress: '45.155.205.233',
    location: 'Frankfurt, Germany',
    metadata: {
      failedAttempts: 12,
      targetAccount: 'admin@duseat.ae',
      actionTaken: 'Banned IP for 24 hours via Cloudflare WAF',
    },
  },
  {
    id: 'LOG-88907',
    timestamp: '2026-09-11 09:55:22',
    actor: {
      name: 'Marcus Vance',
      email: 'marcus.vance@apexluxury.ae',
      role: 'Agent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    module: 'Offers',
    action: 'Submitted Verified Off-Market Offer (AED 11.9M)',
    severity: 'info',
    targetId: 'OFR-4410-09',
    targetType: 'Offer',
    ipAddress: '94.200.112.55',
    location: 'Dubai, UAE',
    metadata: {
      requestId: 'REQ-2048-04',
      offeredPrice: 'AED 11,900,000',
      developer: 'Omniyat',
      commissionExpected: 'AED 238,000 (2.0%)',
    },
  },
  {
    id: 'LOG-88906',
    timestamp: '2026-09-11 09:20:11',
    actor: {
      name: 'Nouf Al-Zaabi',
      email: 'nouf.support@duseat.ae',
      role: 'Moderator',
    },
    module: 'Users',
    action: 'Suspended Account due to duplicate broker registration',
    severity: 'warning',
    targetId: 'AGT-8821',
    targetType: 'Agent',
    ipAddress: '194.170.82.19',
    location: 'Abu Dhabi, UAE',
    metadata: {
      suspensionDurationDays: 14,
      reasonCode: 'POLICY_VIOLATION_UNAUTHORIZED_SUBAGENCY',
      ticketRef: 'TCK-2026-1049',
    },
  },
  {
    id: 'LOG-88905',
    timestamp: '2026-09-11 08:45:30',
    actor: {
      name: 'Stripe Webhook Worker',
      email: 'stripe-billing@internal.duseat.ae',
      role: 'System Bot',
    },
    module: 'Billing',
    action: 'Subscription Renewed: Power Agent Yearly (AED 14,990)',
    severity: 'success',
    targetId: 'SUB-YR-4029',
    targetType: 'Subscription',
    ipAddress: '54.187.174.169',
    location: 'US East (AWS)',
    metadata: {
      amount: 'AED 14,990.00',
      currency: 'AED',
      invoiceNo: 'INV-2026-8831',
      agentId: 'AGT-7712',
    },
  },
  {
    id: 'LOG-88904',
    timestamp: '2026-09-11 08:12:00',
    actor: {
      name: 'Omar Khader',
      email: 'omar.dev@duseat.ae',
      role: 'Super Admin',
    },
    module: 'Settings',
    action: 'Updated Marketplace Commission Floor to 1.75%',
    severity: 'warning',
    targetId: 'CFG-COMMISSION-MATRIX',
    targetType: 'System Config',
    ipAddress: '86.97.142.10',
    location: 'Dubai, UAE',
    metadata: {
      previousValue: '1.50%',
      newValue: '1.75%',
      scope: 'Global UAE Off-plan & Secondary',
    },
  },
  {
    id: 'LOG-88903',
    timestamp: '2026-09-11 07:30:18',
    actor: {
      name: 'Kareem Fahmy',
      email: 'kareem.f@investcorp.ae',
      role: 'Investor',
    },
    module: 'Deals',
    action: 'Escrow Milestone 1 Deposit Confirmed (AED 1,200,000)',
    severity: 'success',
    targetId: 'DEAL-9912',
    targetType: 'Deal',
    ipAddress: '185.193.88.12',
    location: 'Dubai, UAE',
    metadata: {
      property: 'One Canal Luxury Penthouse',
      agentId: 'AGT-9012',
      escrowBank: 'Emirates NBD Escrow Trust',
    },
  },
]

export function ActivityLogsManagement() {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get('category') as any) || (searchParams.get('tab') as any) || 'All'
  const [logs] = React.useState<ActivityLog[]>(INITIAL_LOGS)
  const [selectedLogs, setSelectedLogs] = React.useState<string[]>([])
  const [activeCategory, setActiveCategory] = React.useState<LogCategory>(initialCategory)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [moduleFilter, setModuleFilter] = React.useState<string>('All modules')
  const [severityFilter, setSeverityFilter] = React.useState<string>('All severities')
  const [inspectLog, setInspectLog] = React.useState<ActivityLog | null>(null)
  const [copiedKey, setCopiedKey] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const categories: LogCategory[] = [
    'All',
    'Admin Actions',
    'Investor Activities',
    'Agent Activities',
    'Security & Logins',
    'Financial & Billing',
    'API & System Logs',
  ]

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (activeCategory === 'Admin Actions' && log.actor.role !== 'Super Admin' && log.actor.role !== 'Moderator') return false
      if (activeCategory === 'Investor Activities' && log.actor.role !== 'Investor') return false
      if (activeCategory === 'Agent Activities' && log.actor.role !== 'Agent') return false
      if (activeCategory === 'Security & Logins' && log.module !== 'Security') return false
      if (activeCategory === 'Financial & Billing' && log.module !== 'Billing') return false
      if (activeCategory === 'API & System Logs' && log.actor.role !== 'System Bot') return false

      // Module filter
      if (moduleFilter !== 'All modules' && log.module !== moduleFilter) return false

      // Severity filter
      if (severityFilter !== 'All severities' && log.severity !== severityFilter.toLowerCase()) return false

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchActor = log.actor.name.toLowerCase().includes(query) || log.actor.email.toLowerCase().includes(query)
        const matchAction = log.action.toLowerCase().includes(query)
        const matchTarget = log.targetId.toLowerCase().includes(query)
        const matchIp = log.ipAddress.toLowerCase().includes(query)
        if (!matchActor && !matchAction && !matchTarget && !matchIp) return false
      }

      return true
    })
  }, [logs, activeCategory, moduleFilter, severityFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(paginatedLogs.map((l) => l.id))
    } else {
      setSelectedLogs([])
    }
  }

  const handleToggleLog = (id: string) => {
    setSelectedLogs((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_audit_logs_${new Date().toISOString().split('T')[0]}`,
      ['ID', 'Timestamp', 'Actor', 'Email', 'Role', 'Module', 'Action', 'Severity', 'Target', 'IP', 'Location'],
      filteredLogs.map((log) => [
        log.id,
        log.timestamp,
        log.actor.name,
        log.actor.email,
        log.actor.role,
        log.module,
        log.action,
        log.severity.toUpperCase(),
        `${log.targetType} (${log.targetId})`,
        log.ipAddress,
        log.location,
      ])
    )
  }

  const handleCopyJson = (obj: any) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2))
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const getSeverityBadge = (severity: LogSeverity) => {
    switch (severity) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#e6f9f3] text-[#00a870]">
            <CheckCircle2 className="size-3" />
            <span>Success</span>
          </span>
        )
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#fff8e6] text-[#b27b00]">
            <AlertTriangle className="size-3" />
            <span>Warning</span>
          </span>
        )
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#feebee] text-[#dc2626]">
            <XCircle className="size-3" />
            <span>Critical</span>
          </span>
        )
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#f0f4f8] text-[#1e40af]">
            <Info className="size-3" />
            <span>Info</span>
          </span>
        )
    }
  }

  const getRoleBadge = (role: ActivityLog['actor']['role']) => {
    switch (role) {
      case 'Super Admin':
        return <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-[#1f2327] text-white">Admin</span>
      case 'Moderator':
        return <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-[#00c2cb]/15 text-[#00848b]">Staff</span>
      case 'Agent':
        return <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-[#ebf5ff] text-[#0284c7]">Agent</span>
      case 'Investor':
        return <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-[#f5f3ff] text-[#7c3aed]">Investor</span>
      case 'System Bot':
        return <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-[#f3f4f6] text-[#4b5563]">System</span>
    }
  }

  return (
    <PlatformShell
      title="Activity & Audit Logs"
      eyebrow="Operations & Compliance"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card matching Users page */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">Activity & Audit Logs</h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Immutable chronological trail of administrative interventions, authentication security events, API operations, and financial transactions.
              </p>
            </div>

            {/* Top Right Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Key className="size-4 text-[#00c2cb]" />
                <span>Admin Accounts</span>
              </Link>
              <Link
                href="/monitoring"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Activity className="size-4 text-[#6f777f]" />
                <span>System Health</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Recorded Events (24h)"
              value={logs.length * 1780}
              tone="neutral"
              active={activeCategory === 'All'}
              onClick={() => setActiveCategory('All')}
            />
            <MetricCard
              label="Security & WAF Blocks"
              value={38}
              tone="destructive"
              active={activeCategory === 'Security & Logins'}
              onClick={() => setActiveCategory('Security & Logins')}
            />
            <MetricCard
              label="Admin Interventions"
              value={logs.filter((l) => l.actor.role === 'Super Admin' || l.actor.role === 'Moderator').length}
              tone="brand"
              active={activeCategory === 'Admin Actions'}
              onClick={() => setActiveCategory('Admin Actions')}
            />
            <MetricCard
              label="API Health Rate"
              value="99.98%"
              tone="success"
              active={activeCategory === 'API & System Logs'}
              onClick={() => setActiveCategory('API & System Logs')}
            />
          </div>
        </header>

        {/* Unified Table & Filter Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs & Filter Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-2 py-0.5 max-w-full">
                {categories.map((c) => {
                  const count =
                    c === 'All'
                      ? logs.length
                      : c === 'Admin Actions'
                      ? logs.filter((l) => l.actor.role === 'Super Admin' || l.actor.role === 'Moderator').length
                      : c === 'Investor Activities'
                      ? logs.filter((l) => l.actor.role === 'Investor').length
                      : c === 'Agent Activities'
                      ? logs.filter((l) => l.actor.role === 'Agent').length
                      : c === 'Security & Logins'
                      ? logs.filter((l) => l.module === 'Security').length
                      : c === 'Financial & Billing'
                      ? logs.filter((l) => l.module === 'Billing').length
                      : logs.filter((l) => l.actor.role === 'System Bot').length

                  return (
                    <a
                      key={c}
                      href={`/activity?category=${encodeURIComponent(c)}`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          return
                        }
                        e.preventDefault()
                        setActiveCategory(c)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap no-underline',
                        activeCategory === c
                          ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span className="whitespace-nowrap">{c}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          activeCategory === c ? 'bg-white/25 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {count}
                      </span>
                    </a>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                >
                  <Download className="size-4 text-white" />
                  <span className="whitespace-nowrap">Export Audit CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search actor, action, IP, target ID…"
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Module Dropdown Filter */}
              <Dropdown
                align="start"
                value={moduleFilter}
                onSelect={(val) => {
                  setModuleFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Module"
                options={['All modules', 'Users', 'Verification', 'Requests', 'Offers', 'Deals', 'Billing', 'Security', 'Settings'].map((m) => ({
                  label: m,
                  value: m,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <Layers className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{moduleFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Severity Dropdown Filter */}
              <Dropdown
                align="start"
                value={severityFilter}
                onSelect={(val) => {
                  setSeverityFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Severity"
                options={['All severities', 'Info', 'Success', 'Warning', 'Critical'].map((s) => ({
                  label: s,
                  value: s,
                }))}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <SlidersHorizontal className="size-4 text-[#6f777f]" />
                    <span className="whitespace-nowrap">{severityFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {(moduleFilter !== 'All modules' || severityFilter !== 'All severities' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setModuleFilter('All modules')
                    setSeverityFilter('All severities')
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedLogs.length > 0 && (
            <div className="flex items-center justify-between border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-6 py-2.5 animate-in fade-in duration-150">
              <span className="text-[14px] font-semibold text-[#1f2327]">
                {selectedLogs.length} audit logs selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Export Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLogs([])}
                  className="rounded p-1 text-[#6f777f] hover:bg-[#c7ecee]/50 hover:text-[#1f2327] transition-colors cursor-pointer"
                  aria-label="Clear selection"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Desktop & Tablet Table */}
          <div className="overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1250px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                  <th className="w-12 px-4">
                    <TableCheckbox
                      ariaLabel="Select all logs"
                      checked={filteredLogs.length > 0 && selectedLogs.length === filteredLogs.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Timestamp</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Actor / Operator</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Module</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Event & Action</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Severity</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Target Entity</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">IP & Location</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <EmptyState
                        title="No audit events found"
                        description="Try resetting search keywords or changing selected category filters."
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => {
                    const isSelected = selectedLogs.includes(log.id)
                    return (
                      <tr
                        key={log.id}
                        className={cn(
                          'h-[64px] transition-colors cursor-pointer whitespace-nowrap font-sans',
                          isSelected ? 'bg-[#e5f6f7]/40' : 'hover:bg-[#f8f9fa]'
                        )}
                        onClick={() => setInspectLog(log)}
                      >
                        <td className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
                          <TableCheckbox
                            checked={isSelected}
                            onChange={() => handleToggleLog(log.id)}
                          />
                        </td>

                        {/* Timestamp */}
                        <td className="whitespace-nowrap px-4 text-[13px] text-[#5a6068] font-mono">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-[#9da4ae]" />
                            <span>{log.timestamp}</span>
                          </div>
                        </td>

                        {/* Actor */}
                        <td className="whitespace-nowrap px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar name={log.actor.name} src={log.actor.avatar} size="md" />
                            <div className="leading-tight">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[14px] text-[#1f2327]">{log.actor.name}</span>
                                {getRoleBadge(log.actor.role)}
                              </div>
                              <span className="text-[12px] text-[#6f777f]">{log.actor.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Module */}
                        <td className="whitespace-nowrap px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[12px] font-semibold bg-[#eff1f3] text-[#33383f]">
                            {log.module}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 text-[13.5px] font-medium text-[#1f2327] max-w-[320px] truncate" title={log.action}>
                          {log.action}
                        </td>

                        {/* Severity */}
                        <td className="whitespace-nowrap px-4">
                          {getSeverityBadge(log.severity)}
                        </td>

                        {/* Target Entity */}
                        <td className="whitespace-nowrap px-4">
                          <div className="text-[12px] leading-tight">
                            <span className="font-mono font-semibold text-[#00848b] bg-[#e0f7f8] px-1.5 py-0.5 rounded">
                              {log.targetId}
                            </span>
                            <span className="block text-[#8f969e] text-[11px] mt-0.5">{log.targetType}</span>
                          </div>
                        </td>

                        {/* IP & Location */}
                        <td className="whitespace-nowrap px-4 text-[12.5px] font-mono text-[#5a6068]">
                          <div className="flex items-center gap-1">
                            <Globe className="size-3 text-[#9da4ae]" />
                            <span>{log.ipAddress}</span>
                          </div>
                          <span className="text-[11px] font-sans text-[#8f969e]">{log.location}</span>
                        </td>

                        {/* Inspect action */}
                        <td className="whitespace-nowrap px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setInspectLog(log)}
                            className="h-[32px] px-2.5 rounded-[6px] border border-[#d3d5d7] bg-white hover:bg-[#eff1f3] text-[12px] font-semibold text-[#1f2327] transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Payload</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer matching Gold Standard */}
          <div className="border-t border-[#d3d5d7] px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredLogs.length}
              rowsPerPage={pageSize}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => {
                setPageSize(n)
                setCurrentPage(1)
              }}
              itemLabel="logs"
            />
          </div>
        </section>
      </div>

      {/* Slide-over Audit Payload Inspector */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-[#d3d5d7]">
            <div className="p-5 border-b border-[#e4e7eb] flex items-center justify-between bg-[#f8f9fa]">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-[8px] bg-[#1f2327] text-white flex items-center justify-center font-mono font-bold text-[13px]">
                  <Terminal className="size-4" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#1f2327] leading-tight">
                    Audit Log Payload: {inspectLog.id}
                  </h2>
                  <p className="text-[12px] text-[#6f777f]">Recorded on {inspectLog.timestamp}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="size-8 rounded-[6px] hover:bg-[#e4e7eb] text-[#6f777f] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-[8px] bg-[#f8f9fa] border border-[#e4e7eb] text-[13px]">
                <div>
                  <span className="text-[#8f969e] block text-[11px] uppercase font-bold">Actor</span>
                  <span className="font-semibold text-[#1f2327]">{inspectLog.actor.name}</span>
                  <span className="text-[11px] text-[#6f777f] block">{inspectLog.actor.email}</span>
                </div>
                <div>
                  <span className="text-[#8f969e] block text-[11px] uppercase font-bold">Severity</span>
                  {getSeverityBadge(inspectLog.severity)}
                </div>
                <div>
                  <span className="text-[#8f969e] block text-[11px] uppercase font-bold">Module / Target</span>
                  <span className="font-medium text-[#1f2327]">{inspectLog.module} &rarr; {inspectLog.targetType} ({inspectLog.targetId})</span>
                </div>
                <div>
                  <span className="text-[#8f969e] block text-[11px] uppercase font-bold">IP / Network</span>
                  <span className="font-mono text-[#1f2327]">{inspectLog.ipAddress}</span>
                  <span className="text-[11px] text-[#6f777f] block">{inspectLog.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-[#1f2327] mb-1.5">Action Executed</h3>
                <p className="p-3 rounded-[8px] bg-white border border-[#d3d5d7] text-[13.5px] text-[#1f2327] font-medium">
                  {inspectLog.action}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-bold text-[#1f2327]">Context Metadata & Diff</h3>
                  <button
                    type="button"
                    onClick={() => handleCopyJson(inspectLog.metadata)}
                    className="text-[12px] font-semibold text-[#00848b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="size-3.5 text-[#00a870]" />
                        <span>Copied JSON</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Raw JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-[8px] bg-[#1a1d21] text-[#a5d6a7] font-mono text-[12.5px] overflow-x-auto leading-relaxed border border-[#33383f]">
                  {JSON.stringify(inspectLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-[#e4e7eb] bg-[#f8f9fa] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="h-[36px] px-4 rounded-[6px] bg-[#1f2327] text-white text-[13px] font-semibold hover:bg-[#33383f] transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}
