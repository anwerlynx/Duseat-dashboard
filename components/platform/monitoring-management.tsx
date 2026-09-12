'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Database,
  Radio,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Download,
  Clock,
  Zap,
  Terminal,
  Layers,
  ArrowUpRight,
  TrendingUp,
  X,
  Copy,
  Check,
  AlertCircle,
  Key,
  ChevronDown,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import {
  MetricCard,
  TableCheckbox,
  Pagination,
} from '@/components/ui'
import { cn, exportToCsv } from '@/lib/utils'

export type MonitorTab =
  | 'Cluster Health'
  | 'Database & Cache'
  | 'Job Queues & Workers'
  | 'Storage & CDN'
  | 'Crash & Error Logs'

export interface SystemService {
  name: string
  category: string
  status: 'Operational' | 'Degraded' | 'Critical'
  uptime: string
  latency: string
  load: string
}

export interface JobQueue {
  id: string
  name: string
  status: 'Running' | 'Idle' | 'Congested'
  activeWorkers: number
  pendingJobs: number
  processed1h: number
  failedCount: number
  avgLatencyMs: number
}

export interface SystemErrorLog {
  id: string
  timestamp: string
  service: string
  level: 'Error' | 'Critical' | 'Warning'
  message: string
  occurrences: number
  stackTrace: string
  environment: string
  resolved: boolean
}

const SERVICES: SystemService[] = [
  { name: 'Core API Gateway (K8s)', category: 'Application', status: 'Operational', uptime: '99.99%', latency: '24ms', load: '32%' },
  { name: 'PostgreSQL Primary (RDS)', category: 'Database', status: 'Operational', uptime: '99.98%', latency: '4.2ms', load: '48%' },
  { name: 'Redis Cache & Session Cluster', category: 'Cache', status: 'Operational', uptime: '100%', latency: '0.8ms', load: '22%' },
  { name: 'Elasticsearch Match Engine', category: 'Search', status: 'Operational', uptime: '99.95%', latency: '18ms', load: '41%' },
  { name: 'Firebase Cloud Messaging (Push)', category: 'Messaging', status: 'Operational', uptime: '99.99%', latency: '65ms', load: '15%' },
  { name: 'Cloudflare R2 Object Storage', category: 'Storage', status: 'Operational', uptime: '100%', latency: '35ms', load: '12%' },
]

const QUEUES: JobQueue[] = [
  { id: 'Q-01', name: 'notification.dispatch.push', status: 'Running', activeWorkers: 8, pendingJobs: 14, processed1h: 3840, failedCount: 0, avgLatencyMs: 42 },
  { id: 'Q-02', name: 'ocr.verification.documents', status: 'Running', activeWorkers: 4, pendingJobs: 3, processed1h: 182, failedCount: 1, avgLatencyMs: 1240 },
  { id: 'Q-03', name: 'request.matching.engine', status: 'Running', activeWorkers: 6, pendingJobs: 0, processed1h: 920, failedCount: 0, avgLatencyMs: 68 },
  { id: 'Q-04', name: 'billing.escrow.sync', status: 'Idle', activeWorkers: 2, pendingJobs: 0, processed1h: 84, failedCount: 0, avgLatencyMs: 310 },
  { id: 'Q-05', name: 'email.marketing.digest', status: 'Running', activeWorkers: 4, pendingJobs: 42, processed1h: 12400, failedCount: 3, avgLatencyMs: 95 },
]

const ERROR_LOGS: SystemErrorLog[] = [
  {
    id: 'ERR-9021',
    timestamp: '2026-09-11 10:24:19',
    service: 'payment-gateway',
    level: 'Critical',
    message: 'StripeWebhookTimeout: Escrow intent confirmation callback exceeded 5000ms threshold',
    occurrences: 4,
    stackTrace: `Error: GatewayTimeoutException at /var/app/services/stripe.ts:184:12\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)\n  at async handleWebhookEvent (/var/app/routes/stripe.ts:42:9)\n  at async Route.dispatch (/var/app/node_modules/express/router.js:284:10)`,
    environment: 'production-uae-1',
    resolved: false,
  },
  {
    id: 'ERR-9020',
    timestamp: '2026-09-11 09:41:02',
    service: 'verification-worker',
    level: 'Error',
    message: 'OCRWorkerUnreadableException: Failed to parse skewed Emirates ID back surface JPEG',
    occurrences: 2,
    stackTrace: `WorkerError: OCRConfidenceTooLow (38% < 85% requirement)\n  at OCRProcessor.parseDocument (/var/workers/ocr.ts:89:15)\n  at async Job.execute (/var/workers/queue.ts:55:7)`,
    environment: 'production-uae-1',
    resolved: false,
  },
  {
    id: 'ERR-9019',
    timestamp: '2026-09-11 08:15:33',
    service: 'fcm-push-service',
    level: 'Warning',
    message: 'FCMTokenExpired: Unregistered device token pruned from database for investor USR-INV-8821',
    occurrences: 18,
    stackTrace: `Warning: DeviceTokenNotRegistered\n  at sendPushNotification (/var/app/notifications/fcm.ts:64:18)`,
    environment: 'production-uae-1',
    resolved: true,
  },
]

export function MonitoringManagement() {
  const [activeTab, setActiveTab] = React.useState<MonitorTab>('Cluster Health')
  const [errorLogs, setErrorLogs] = React.useState<SystemErrorLog[]>(ERROR_LOGS)
  const [inspectError, setInspectError] = React.useState<SystemErrorLog | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [levelFilter, setLevelFilter] = React.useState<string>('All levels')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const tabs: MonitorTab[] = [
    'Cluster Health',
    'Database & Cache',
    'Job Queues & Workers',
    'Storage & CDN',
    'Crash & Error Logs',
  ]

  const filteredErrors = React.useMemo(() => {
    return errorLogs.filter((err) => {
      if (levelFilter !== 'All levels' && err.level !== levelFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          err.message.toLowerCase().includes(q) ||
          err.service.toLowerCase().includes(q) ||
          err.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [errorLogs, searchQuery, levelFilter])

  const totalPages = Math.max(1, Math.ceil(filteredErrors.length / pageSize))
  const paginatedErrors = filteredErrors.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleResolve = (id: string) => {
    setErrorLogs((prev) =>
      prev.map((err) => (err.id === id ? { ...err, resolved: !err.resolved } : err))
    )
    if (inspectError?.id === id) {
      setInspectError((prev) => (prev ? { ...prev, resolved: !prev.resolved } : null))
    }
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_error_telemetry_${new Date().toISOString().split('T')[0]}`,
      ['ID', 'Timestamp', 'Service', 'Level', 'Message', 'Occurrences', 'Environment', 'Resolved'],
      filteredErrors.map((err) => [
        err.id,
        err.timestamp,
        err.service,
        err.level,
        err.message,
        err.occurrences,
        err.environment,
        err.resolved ? 'YES' : 'NO',
      ])
    )
  }

  const handleCopyStack = (trace: string) => {
    navigator.clipboard.writeText(trace)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const unresolvedErrorCount = errorLogs.filter((e) => !e.resolved).length

  return (
    <PlatformShell
      title="System Health & Monitoring"
      eyebrow="Operations & Reliability"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                System Health & Monitoring
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Real-time telemetry across cluster nodes, database read/write replicas, redis queues, push notification dispatchers, and application error logs.
              </p>
            </div>

            {/* Quick Actions Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/activity"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Activity className="size-4 text-[#00c2cb]" />
                <span>Audit Logs</span>
              </Link>
              <Link
                href="/admin"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Key className="size-4 text-[#6f777f]" />
                <span>Admin Accounts</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Global API Uptime"
              value="99.99%"
              tone="success"
              active={activeTab === 'Cluster Health'}
              onClick={() => setActiveTab('Cluster Health')}
            />
            <MetricCard
              label="Cluster CPU Load"
              value="28.4%"
              tone="neutral"
              active={false}
            />
            <MetricCard
              label="Memory / RAM Pool"
              value="39.2 GB"
              tone="info"
              active={activeTab === 'Database & Cache'}
              onClick={() => setActiveTab('Database & Cache')}
            />
            <MetricCard
              label="Active Queue Workers"
              value="24 Active"
              tone="warning"
              active={activeTab === 'Job Queues & Workers'}
              onClick={() => setActiveTab('Job Queues & Workers')}
            />
          </div>
        </header>

        {/* Single Unified Section Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Pill Tabs & Actions */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 py-0.5 max-w-full">
                {tabs.map((t) => {
                  const isActive = activeTab === t
                  const count = t === 'Crash & Error Logs' ? unresolvedErrorCount : undefined
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        setActiveTab(t)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap',
                        isActive
                          ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{t}</span>
                      {count !== undefined && (
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                            isActive ? 'bg-white/20 text-white' : 'bg-[#feebee] text-[#dc2626]'
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {activeTab === 'Crash & Error Logs' && (
                  <button
                    type="button"
                    onClick={handleExport}
                    className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                  >
                    <Download className="size-4 text-white" />
                    <span className="whitespace-nowrap">Export Telemetry CSV</span>
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#00a870] px-2.5 py-1 rounded-[6px] bg-[#e6f9f3]">
                  <span className="size-2 rounded-full bg-[#00a870] animate-pulse" />
                  <span>Live 1s</span>
                </div>
              </div>
            </div>

            {/* Error Logs Filter Controls */}
            {activeTab === 'Crash & Error Logs' && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="Search errors, services, IDs…"
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

                <Dropdown
                  align="start"
                  value={levelFilter}
                  onSelect={(val) => {
                    setLevelFilter(val)
                    setCurrentPage(1)
                  }}
                  ariaLabel="Filter by Error Level"
                  options={[
                    { label: 'All levels', value: 'All levels' },
                    { label: 'Critical', value: 'Critical' },
                    { label: 'Error', value: 'Error' },
                    { label: 'Warning', value: 'Warning' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                      <AlertTriangle className="size-4 text-[#6f777f]" />
                      <span>{levelFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {(searchQuery || levelFilter !== 'All levels') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setLevelFilter('All levels')
                      setCurrentPage(1)
                    }}
                    className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer shrink-0"
                  >
                    <X className="size-3.5" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* TAB 1: Cluster Health */}
          {activeTab === 'Cluster Health' && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((svc) => (
                  <div
                    key={svc.name}
                    className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-[#8f969e]">{svc.category}</span>
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#00a870] bg-[#e6f9f3] px-2 py-0.5 rounded">
                        <CheckCircle2 className="size-3" />
                        <span>{svc.status}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[15px] font-bold text-[#1f2327]">{svc.name}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#d3d5d7] text-[12px]">
                      <div>
                        <span className="text-[#8f969e] block">Uptime</span>
                        <span className="font-semibold text-[#1f2327]">{svc.uptime}</span>
                      </div>
                      <div>
                        <span className="text-[#8f969e] block">Latency</span>
                        <span className="font-semibold text-[#00848b]">{svc.latency}</span>
                      </div>
                      <div>
                        <span className="text-[#8f969e] block">Load</span>
                        <span className="font-semibold text-[#1f2327]">{svc.load}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Job Queues & Workers */}
          {activeTab === 'Job Queues & Workers' && (
            <div className="hidden md:block overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1000px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 whitespace-nowrap text-[14px] font-semibold text-[#1f2327]">
                    <th className="px-4">Queue Identifier</th>
                    <th className="px-4">Status</th>
                    <th className="px-4">Workers</th>
                    <th className="px-4">Pending</th>
                    <th className="px-4">Processed (1h)</th>
                    <th className="px-4">Failed</th>
                    <th className="px-4 text-right">Avg Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {QUEUES.map((q) => (
                    <tr key={q.id} className="h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa]">
                      <td className="whitespace-nowrap px-4 font-mono text-[13px] font-semibold text-[#1f2327]">
                        {q.name}
                      </td>
                      <td className="whitespace-nowrap px-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold',
                            q.status === 'Running' && 'bg-[#e6f9f3] text-[#00a870]',
                            q.status === 'Idle' && 'bg-[#eff1f3] text-[#5a6068]'
                          )}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 font-semibold text-[#1f2327]">{q.activeWorkers} pods</td>
                      <td className="whitespace-nowrap px-4">
                        <span className={cn('font-semibold', q.pendingJobs > 20 ? 'text-[#b27b00]' : 'text-[#1f2327]')}>
                          {q.pendingJobs}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 font-medium text-[#1f2327]">{q.processed1h.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-4">
                        <span className={cn('font-semibold', q.failedCount > 0 ? 'text-[#dc2626]' : 'text-[#00a870]')}>
                          {q.failedCount}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 text-right font-mono text-[13px] text-[#00848b]">
                        {q.avgLatencyMs} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3 & 4: Database / Cache / Storage */}
          {(activeTab === 'Database & Cache' || activeTab === 'Storage & CDN') && (
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#1f2327]">Read / Write Replica Pool</h3>
                  <span className="text-[12px] text-[#00a870] font-semibold bg-[#e6f9f3] px-2 py-0.5 rounded">100% In Sync</span>
                </div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between py-1.5 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Transactions / sec (TPS)</span>
                    <span className="font-semibold text-[#1f2327]">1,420 TPS</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Replication Lag</span>
                    <span className="font-semibold text-[#00a870]">0.12 ms</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Database Disk Storage</span>
                    <span className="font-semibold text-[#1f2327]">124 GB / 500 GB (24.8%)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#6f777f]">Slow Queries (&gt;250ms)</span>
                    <span className="font-semibold text-[#00a870]">0 reported</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#1f2327]">CDN & Object Assets</h3>
                  <span className="text-[12px] text-[#00a870] font-semibold bg-[#e6f9f3] px-2 py-0.5 rounded">Edge Cached (DXB)</span>
                </div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between py-1.5 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Document & Image Storage</span>
                    <span className="font-semibold text-[#1f2327]">482 GB (R2 Buckets)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Edge Cache Hit Ratio</span>
                    <span className="font-semibold text-[#00a870]">96.4%</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Total Verified Assets</span>
                    <span className="font-semibold text-[#1f2327]">18,490 files</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#6f777f]">Bandwidth (Monthly)</span>
                    <span className="font-semibold text-[#1f2327]">2.8 TB Transferred</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Crash & Error Logs Table */}
          {activeTab === 'Crash & Error Logs' && (
            <>
              <div className="hidden md:block overflow-x-auto table-scrollbar flex-1">
                <table className="w-full min-w-[1100px] border-collapse text-left text-[14px] font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 whitespace-nowrap text-[14px] font-semibold text-[#1f2327]">
                      <th className="px-4">Error ID</th>
                      <th className="px-4">Timestamp</th>
                      <th className="px-4">Service</th>
                      <th className="px-4">Level</th>
                      <th className="px-4">Exception Summary</th>
                      <th className="px-4">Count</th>
                      <th className="px-4">Status</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {paginatedErrors.map((err) => (
                      <tr key={err.id} className="h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa]">
                        <td className="whitespace-nowrap px-4 font-mono text-[13px] font-semibold text-[#1f2327]">
                          {err.id}
                        </td>
                        <td className="whitespace-nowrap px-4 font-mono text-[12px] text-[#6f777f]">
                          {err.timestamp}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span className="font-semibold text-[12.5px] text-[#1f2327] bg-[#eff1f3] px-2 py-0.5 rounded">
                            {err.service}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold',
                              err.level === 'Critical' && 'bg-[#feebee] text-[#dc2626]',
                              err.level === 'Error' && 'bg-[#feebee] text-[#dc2626]',
                              err.level === 'Warning' && 'bg-[#fff8e6] text-[#b27b00]'
                            )}
                          >
                            {err.level}
                          </span>
                        </td>
                        <td className="px-4 text-[13px] font-medium text-[#1f2327] max-w-[320px] truncate">
                          {err.message}
                        </td>
                        <td className="whitespace-nowrap px-4 font-semibold text-[#1f2327]">{err.occurrences}x</td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold',
                              err.resolved ? 'bg-[#e6f9f3] text-[#00a870]' : 'bg-[#fff8e6] text-[#b27b00]'
                            )}
                          >
                            {err.resolved ? 'Resolved' : 'Active'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectError(err)}
                            className="h-[32px] px-2.5 rounded-[6px] border border-[#d3d5d7] bg-white hover:bg-[#eff1f3] text-[12px] font-semibold text-[#1f2327] transition-colors cursor-pointer"
                          >
                            Inspect Stack
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Integrated Pagination Footer */}
              <div className="border-t border-[#d3d5d7] px-4 py-3 sm:px-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredErrors.length}
                  rowsPerPage={pageSize}
                  rowsOptions={[10, 20, 30]}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={(n) => {
                    setPageSize(n)
                    setCurrentPage(1)
                  }}
                  itemLabel="errors"
                />
              </div>
            </>
          )}
        </section>

        {/* Stack Trace Slide-over Drawer */}
        {inspectError && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-[#d3d5d7]">
              <div className="p-5 border-b border-[#d3d5d7] flex items-center justify-between bg-[#f8f9fa]">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-[8px] bg-[#feebee] text-[#dc2626] flex items-center justify-center font-bold">
                    <Terminal className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#1f2327] leading-tight">
                      Exception Detail: {inspectError.id}
                    </h2>
                    <p className="text-[12px] text-[#6f777f]">Occurred on {inspectError.timestamp}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectError(null)}
                  className="size-8 rounded-[6px] hover:bg-[#e4e7eb] text-[#5a6068] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="p-4 rounded-[8px] bg-[#f8f9fa] border border-[#d3d5d7] text-[13px] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8f969e]">Service / Worker</span>
                    <span className="font-semibold text-[#1f2327]">{inspectError.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f969e]">Environment</span>
                    <span className="font-mono text-[#1f2327]">{inspectError.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f969e]">Frequency</span>
                    <span className="font-bold text-[#dc2626]">{inspectError.occurrences} total occurrences</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-[#1f2327] mb-1.5">Error Message</h3>
                  <div className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-[13px] text-red-900 font-mono">
                    {inspectError.message}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[13px] font-bold text-[#1f2327]">Full Stack Trace</h3>
                    <button
                      type="button"
                      onClick={() => handleCopyStack(inspectError.stackTrace)}
                      className="text-[12px] font-semibold text-[#00848b] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-[#00a870]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy Trace</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-[8px] bg-[#1a1d21] text-[#f87171] font-mono text-[12px] overflow-x-auto leading-relaxed border border-[#33383f]">
                    {inspectError.stackTrace}
                  </pre>
                </div>
              </div>

              <div className="p-4 border-t border-[#d3d5d7] bg-[#f8f9fa] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleResolve(inspectError.id)}
                  className="h-[36px] px-4 rounded-[6px] border border-[#d3d5d7] bg-white text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  {inspectError.resolved ? 'Reopen Incident' : 'Mark as Resolved'}
                </button>
                <button
                  type="button"
                  onClick={() => setInspectError(null)}
                  className="h-[36px] px-4 rounded-[6px] bg-[#1f2327] text-white text-[13px] font-semibold hover:bg-[#33383f] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
