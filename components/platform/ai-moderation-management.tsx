'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Brain,
  Search,
  Filter,
  Download,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  X,
  FileWarning,
  MessageSquare,
  FileText,
  UserX,
  Sparkles,
  Zap,
  ArrowUpRight,
  TrendingDown,
  Cpu,
  ChevronRight,
  ChevronDown,
  ExternalLink,
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

export type AnomalyType =
  | 'All'
  | 'Spam Requests'
  | 'Fake Documents'
  | 'Suspicious Chats'
  | 'Duplicate Offers'
  | 'Financial Fraud'

export type RiskLevel = 'High' | 'Medium' | 'Low'
export type ModerationStatus = 'Pending Review' | 'Enforced' | 'Dismissed'

export interface ModerationIncident {
  id: string
  detectedAt: string
  type: 'Spam Requests' | 'Fake Documents' | 'Suspicious Chats' | 'Duplicate Offers' | 'Financial Fraud'
  entityType: 'Request' | 'Agent' | 'Investor' | 'Offer' | 'Conversation'
  entityId: string
  subject: {
    name: string
    role: 'Agent' | 'Investor'
    email: string
    avatar?: string
  }
  triggerReason: string
  confidenceScore: number
  riskLevel: RiskLevel
  aiRecommendation: 'Recommend Suspension' | 'Recommend Manual Review' | 'Require Re-verification' | 'Block Entity'
  status: ModerationStatus
  evidence: {
    summary: string
    snippet?: string
    factors: string[]
  }
}

const INITIAL_INCIDENTS: ModerationIncident[] = [
  {
    id: 'AIM-4019',
    detectedAt: '2026-09-11 10:42:00',
    type: 'Suspicious Chats',
    entityType: 'Conversation',
    entityId: 'CHAT-8821',
    subject: {
      name: 'Rami Al-Saleh',
      role: 'Agent',
      email: 'rami.broker@alrawabi.ae',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    triggerReason: 'Circumvention pattern: Phone number and external payment solicitation detected',
    confidenceScore: 96,
    riskLevel: 'High',
    aiRecommendation: 'Recommend Suspension',
    status: 'Pending Review',
    evidence: {
      summary: 'Automated NLP detected agent attempting to route escrow payment off-platform via direct wire transfer.',
      snippet: '"Call me on +971-50-992-1144 directly. We can bypass the 2% portal commission and make escrow privately."',
      factors: [
        'Phone number obfuscation detected (separated digits)',
        'Keyword match: "bypass commission", "escrow privately"',
        'Zero prior completed deals with this investor',
      ],
    },
  },
  {
    id: 'AIM-4018',
    detectedAt: '2026-09-11 09:50:12',
    type: 'Fake Documents',
    entityType: 'Agent',
    entityId: 'AGT-7740',
    subject: {
      name: 'Alexander Weber',
      role: 'Agent',
      email: 'alex.w@vanguard-dxb.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    triggerReason: 'Forged RERA Certificate font mismatch & barcode collision',
    confidenceScore: 92,
    riskLevel: 'High',
    aiRecommendation: 'Require Re-verification',
    status: 'Pending Review',
    evidence: {
      summary: 'OCR signature and RERA registration barcode matched an already revoked 2023 license number in Dubai Land Dept registry.',
      factors: [
        'Font kerning inconsistency in license expiration date field',
        'Barcode hashes to entity "Oasis Realty (Dissolved)"',
        'Emirates ID photo matches another agent registered under different passport',
      ],
    },
  },
  {
    id: 'AIM-4017',
    detectedAt: '2026-09-11 08:35:44',
    type: 'Spam Requests',
    entityType: 'Request',
    entityId: 'REQ-1994',
    subject: {
      name: 'Viktor Romanov',
      role: 'Investor',
      email: 'v.romanov@transbalkan.ro',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    },
    triggerReason: 'Automated bot activity: 14 identical luxury requests submitted in 3 minutes',
    confidenceScore: 88,
    riskLevel: 'Medium',
    aiRecommendation: 'Recommend Manual Review',
    status: 'Pending Review',
    evidence: {
      summary: 'High velocity request flood targeting 100+ agents without specific investor criteria.',
      factors: [
        'Request submission speed < 1.2s between posts',
        'Copy-paste prompt text with placeholders unchanged',
        'New account registered less than 20 minutes ago',
      ],
    },
  },
  {
    id: 'AIM-4016',
    detectedAt: '2026-09-11 07:18:20',
    type: 'Duplicate Offers',
    entityType: 'Offer',
    entityId: 'OFR-3829',
    subject: {
      name: 'Suresh Patel',
      role: 'Agent',
      email: 'suresh@dubaimetro.ae',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    triggerReason: 'Duplicate unit listing collision with registered Agency master inventory',
    confidenceScore: 78,
    riskLevel: 'Medium',
    aiRecommendation: 'Recommend Manual Review',
    status: 'Pending Review',
    evidence: {
      summary: 'Submitted unit at Atlantis The Royal matches exact title deed registered by another exclusive broker.',
      factors: [
        'Unit number collision: Sky Villa 1402',
        'Title deed registration conflict',
      ],
    },
  },
  {
    id: 'AIM-4015',
    detectedAt: '2026-09-10 18:40:11',
    type: 'Financial Fraud',
    entityType: 'Investor',
    entityId: 'USR-INV-9941',
    subject: {
      name: 'Arthur Pendelton',
      role: 'Investor',
      email: 'a.pendelton@apexholding.co.uk',
    },
    triggerReason: 'Proof of Funds bank statement metadata tampered with PDF editor signature',
    confidenceScore: 98,
    riskLevel: 'High',
    aiRecommendation: 'Block Entity',
    status: 'Enforced',
    evidence: {
      summary: 'Forensic PDF metadata indicates Barclays balance statement was generated via Adobe Illustrator with font substitution.',
      factors: [
        'Creator tool: Adobe Illustrator 28.1 (tampered)',
        'Font kerning artifacts in currency columns',
      ],
    },
  },
]

export function AiModerationManagement() {
  const [incidents, setIncidents] = React.useState<ModerationIncident[]>(INITIAL_INCIDENTS)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [activeCategory, setActiveCategory] = React.useState<AnomalyType>('All')
  const [riskFilter, setRiskFilter] = React.useState<string>('All Risk Levels')
  const [statusFilter, setStatusFilter] = React.useState<string>('All Statuses')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [inspectIncident, setInspectIncident] = React.useState<ModerationIncident | null>(null)

  const categories: AnomalyType[] = [
    'All',
    'Spam Requests',
    'Fake Documents',
    'Suspicious Chats',
    'Duplicate Offers',
    'Financial Fraud',
  ]

  const filteredIncidents = React.useMemo(() => {
    return incidents.filter((incident) => {
      if (activeCategory !== 'All' && incident.type !== activeCategory) return false

      if (riskFilter !== 'All Risk Levels') {
        if (riskFilter.startsWith('High') && incident.riskLevel !== 'High') return false
        if (riskFilter.startsWith('Medium') && incident.riskLevel !== 'Medium') return false
        if (riskFilter.startsWith('Low') && incident.riskLevel !== 'Low') return false
      }

      if (statusFilter !== 'All Statuses' && incident.status !== statusFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          incident.id.toLowerCase().includes(q) ||
          incident.subject.name.toLowerCase().includes(q) ||
          incident.subject.email.toLowerCase().includes(q) ||
          incident.triggerReason.toLowerCase().includes(q) ||
          incident.entityId.toLowerCase().includes(q)
        )
      }

      return true
    })
  }, [incidents, activeCategory, riskFilter, statusFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize))
  const paginated = filteredIncidents.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginated.map((i) => i.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleAction = (incidentId: string, newStatus: ModerationStatus) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: newStatus } : i))
    )
    if (inspectIncident?.id === incidentId) {
      setInspectIncident((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_ai_incidents_${new Date().toISOString().split('T')[0]}`,
      ['Incident ID', 'Detected At', 'Type', 'Entity ID', 'Subject', 'Email', 'Role', 'Trigger Reason', 'Risk Level', 'Confidence', 'AI Recommendation', 'Status'],
      filteredIncidents.map((i) => [
        i.id,
        i.detectedAt,
        i.type,
        i.entityId,
        i.subject.name,
        i.subject.email,
        i.subject.role,
        i.triggerReason,
        i.riskLevel,
        `${i.confidenceScore}%`,
        i.aiRecommendation,
        i.status,
      ])
    )
  }

  const getRiskBadge = (risk: RiskLevel, score: number) => {
    switch (risk) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[12px] font-bold bg-[#feebee] text-[#dc2626]">
            <ShieldAlert className="size-3" />
            <span>{score}% High</span>
          </span>
        )
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[12px] font-bold bg-[#fff8e6] text-[#b27b00]">
            <AlertTriangle className="size-3" />
            <span>{score}% Medium</span>
          </span>
        )
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[12px] font-bold bg-[#e6f9f3] text-[#00a870]">
            <ShieldCheck className="size-3" />
            <span>{score}% Low</span>
          </span>
        )
    }
  }

  const getRecommendationBadge = (rec: ModerationIncident['aiRecommendation']) => {
    switch (rec) {
      case 'Recommend Suspension':
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#dc2626]">
            <UserX className="size-3.5" />
            <span>Suspend User</span>
          </span>
        )
      case 'Require Re-verification':
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#b27b00]">
            <FileWarning className="size-3.5" />
            <span>Audit License</span>
          </span>
        )
      case 'Block Entity':
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#dc2626]">
            <XCircle className="size-3.5" />
            <span>Block Entity</span>
          </span>
        )
      case 'Recommend Manual Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#00848b]">
            <Eye className="size-3.5" />
            <span>Staff Review</span>
          </span>
        )
    }
  }

  const pendingCount = incidents.filter((i) => i.status === 'Pending Review').length
  const highRiskCount = incidents.filter((i) => i.riskLevel === 'High').length

  return (
    <PlatformShell
      title="AI Moderation & Anomaly Engine"
      eyebrow="Operations & Compliance"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card matching Gold Standard */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                AI Moderation & Anomaly Engine
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Automated neural detection for spam requests, falsified broker licenses, duplicate listings, and off-platform transaction circumvention.
              </p>
            </div>

            {/* Quick Actions Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/verification"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <ShieldCheck className="size-4 text-[#00c2cb]" />
                <span>Verification Queue</span>
              </Link>
              <Link
                href="/activity"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Sparkles className="size-4 text-[#6f777f]" />
                <span>Audit Logs</span>
              </Link>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Active Flags in Queue"
              value={pendingCount}
              tone="destructive"
              active={statusFilter === 'Pending Review'}
              onClick={() => {
                setStatusFilter(statusFilter === 'Pending Review' ? 'All Statuses' : 'Pending Review')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="High Risk Threshold (>80%)"
              value={highRiskCount}
              tone="warning"
              active={riskFilter.startsWith('High')}
              onClick={() => {
                setRiskFilter(riskFilter.startsWith('High') ? 'All Risk Levels' : 'High Risk (>80%)')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Model Precision"
              value="98.6%"
              tone="brand"
              active={false}
            />
            <MetricCard
              label="Fraud Intercepted (30d)"
              value="AED 4.2M"
              tone="success"
              active={false}
            />
          </div>
        </header>

        {/* Unified Table & Filter Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Tabs & Export Row */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Category Pill Tabs */}
              <div className="flex flex-wrap items-center gap-2 py-0.5 max-w-full">
                {categories.map((c) => {
                  const count = c === 'All' ? incidents.length : incidents.filter((i) => i.type === c).length
                  const isActive = activeCategory === c
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setActiveCategory(c)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap',
                        isActive
                          ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span className="whitespace-nowrap">{c}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          isActive ? 'bg-white/25 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {count}
                      </span>
                    </button>
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
                  <span className="whitespace-nowrap">Export Incidents CSV</span>
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
                  placeholder="Search subject, reason, or incident ID…"
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

              {/* Risk Level Filter Dropdown */}
              <Dropdown
                align="start"
                value={riskFilter}
                onSelect={(val) => {
                  setRiskFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Risk Level"
                options={[
                  { label: 'All Risk Levels', value: 'All Risk Levels' },
                  { label: 'High Risk (>80%)', value: 'High Risk (>80%)' },
                  { label: 'Medium Risk (50-79%)', value: 'Medium Risk (50-79%)' },
                  { label: 'Low Risk (<50%)', value: 'Low Risk (<50%)' },
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <ShieldAlert className="size-4 text-[#6f777f]" />
                    <span>{riskFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Status Filter Dropdown */}
              <Dropdown
                align="start"
                value={statusFilter}
                onSelect={(val) => {
                  setStatusFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Status"
                options={[
                  { label: 'All Statuses', value: 'All Statuses' },
                  { label: 'Pending Review', value: 'Pending Review' },
                  { label: 'Enforced', value: 'Enforced' },
                  { label: 'Dismissed', value: 'Dismissed' },
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <Filter className="size-4 text-[#6f777f]" />
                    <span>{statusFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reset Filters */}
              {(searchQuery || riskFilter !== 'All Risk Levels' || statusFilter !== 'All Statuses' || activeCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setRiskFilter('All Risk Levels')
                    setStatusFilter('All Statuses')
                    setActiveCategory('All')
                    setCurrentPage(1)
                  }}
                  className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer shrink-0"
                >
                  <X className="size-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1250px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 whitespace-nowrap text-[14px] font-semibold text-[#1f2327]">
                  <th className="w-12 px-4">
                    <TableCheckbox
                      checked={paginated.length > 0 && selectedIds.length === paginated.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4">Incident ID</th>
                  <th className="px-4">Anomaly Type</th>
                  <th className="px-4">Offender / Subject</th>
                  <th className="px-4">Target Entity</th>
                  <th className="px-4">AI Detection Trigger</th>
                  <th className="px-4">Risk Confidence</th>
                  <th className="px-4">Recommendation</th>
                  <th className="px-4">Status</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[#6f777f]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShieldCheck className="size-8 text-[#00a870]" />
                        <p className="text-[15px] font-semibold text-[#1f2327]">All clear! No anomalies detected.</p>
                        <p className="text-[13px] text-[#6f777f]">The neural moderation engine has not flagged any violations for this filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((incident) => {
                    const isSelected = selectedIds.includes(incident.id)
                    return (
                      <tr
                        key={incident.id}
                        className={cn(
                          'h-[64px] transition-colors',
                          isSelected ? 'bg-[#f0fafb]' : 'hover:bg-[#fcfcfc]'
                        )}
                      >
                        <td className="w-12 px-4">
                          <TableCheckbox
                            checked={isSelected}
                            onChange={() => handleToggle(incident.id)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 font-mono text-[13px] font-semibold text-[#1f2327]">
                          {incident.id}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[12px] font-medium bg-[#eff1f3] text-[#1f2327]">
                            {incident.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar name={incident.subject.name} src={incident.subject.avatar} size="md" />
                            <div className="leading-tight">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[14px] text-[#1f2327]">{incident.subject.name}</span>
                                <span
                                  className={cn(
                                    'text-[10.5px] font-bold px-1.5 py-0.2 rounded',
                                    incident.subject.role === 'Agent'
                                      ? 'bg-[#ebf5ff] text-[#0284c7]'
                                      : 'bg-[#f5f3ff] text-[#7c3aed]'
                                  )}
                                >
                                  {incident.subject.role}
                                </span>
                              </div>
                              <span className="text-[12px] text-[#8f969e]">{incident.subject.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span className="font-mono text-[12px] font-semibold text-[#00848b] bg-[#e0f7f8] px-2 py-0.5 rounded">
                            {incident.entityId}
                          </span>
                        </td>
                        <td className="px-4 text-[13px] text-[#1f2327] max-w-[280px] truncate">
                          {incident.triggerReason}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          {getRiskBadge(incident.riskLevel, incident.confidenceScore)}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          {getRecommendationBadge(incident.aiRecommendation)}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold',
                              incident.status === 'Pending Review' && 'bg-[#fff8e6] text-[#b27b00]',
                              incident.status === 'Enforced' && 'bg-[#feebee] text-[#dc2626]',
                              incident.status === 'Dismissed' && 'bg-[#e6f9f3] text-[#00a870]'
                            )}
                          >
                            {incident.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectIncident(incident)}
                            className="h-[32px] px-2.5 rounded-[6px] border border-[#d3d5d7] bg-white hover:bg-[#eff1f3] text-[12px] font-semibold text-[#1f2327] transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="size-3.5 text-[#5a6068]" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Integrated Pagination Footer */}
          <div className="border-t border-[#d3d5d7] px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredIncidents.length}
              rowsPerPage={pageSize}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => {
                setPageSize(n)
                setCurrentPage(1)
              }}
              itemLabel="incidents"
            />
          </div>
        </section>

        {/* Slide-over Review & Enforcement Drawer */}
        {inspectIncident && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-[#d3d5d7]">
              <div className="p-5 border-b border-[#d3d5d7] flex items-center justify-between bg-[#f8f9fa]">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-[8px] bg-[#feebee] text-[#dc2626] flex items-center justify-center">
                    <ShieldAlert className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#1f2327] leading-tight">
                      Security Review: {inspectIncident.id}
                    </h2>
                    <p className="text-[12px] text-[#6f777f]">Detected at {inspectIncident.detectedAt}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectIncident(null)}
                  className="size-8 rounded-[6px] hover:bg-[#e4e7eb] text-[#5a6068] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Score & Category Header */}
                <div className="p-4 rounded-[10px] bg-[#f8f9fa] border border-[#d3d5d7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#8f969e] uppercase">Risk Assessment</span>
                    {getRiskBadge(inspectIncident.riskLevel, inspectIncident.confidenceScore)}
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8f969e] uppercase font-bold block">Trigger Rule</span>
                    <p className="text-[14px] font-semibold text-[#1f2327] mt-0.5">{inspectIncident.triggerReason}</p>
                  </div>
                </div>

                {/* Offender Info */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#1f2327] mb-2">Subject Information</h3>
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TableAvatar name={inspectIncident.subject.name} src={inspectIncident.subject.avatar} className="size-10 text-[13px]" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[14px] text-[#1f2327]">{inspectIncident.subject.name}</span>
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#eff1f3] text-[#5a6068]">
                            {inspectIncident.subject.role}
                          </span>
                        </div>
                        <span className="text-[12.5px] text-[#8f969e]">{inspectIncident.subject.email}</span>
                      </div>
                    </div>
                    <Link
                      href={inspectIncident.subject.role === 'Agent' ? `/users/agents` : `/users/investors`}
                      className="text-[12px] font-semibold text-[#00848b] hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Evidence Snippet */}
                {inspectIncident.evidence.snippet && (
                  <div>
                    <h3 className="text-[13px] font-bold text-[#1f2327] mb-1.5">Intercepted Content Snippet</h3>
                    <div className="p-3.5 rounded-[8px] bg-[#fff8e6] border border-[#f59e0b]/30 text-[13px] text-[#92400e] font-mono leading-relaxed">
                      {inspectIncident.evidence.snippet}
                    </div>
                  </div>
                )}

                {/* Detailed Evidence Rationale */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#1f2327] mb-2">AI Neural Analysis Factors</h3>
                  <div className="space-y-2">
                    {inspectIncident.evidence.factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-[8px] bg-white border border-[#d3d5d7] text-[13px]"
                      >
                        <Zap className="size-4 text-[#b27b00] shrink-0 mt-0.5" />
                        <span className="text-[#1f2327] font-medium">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enforcement Footer */}
              <div className="p-4 border-t border-[#d3d5d7] bg-white flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleAction(inspectIncident.id, 'Dismissed')}
                  className="h-[38px] px-3 rounded-[6px] border border-[#d3d5d7] text-[13px] font-medium text-[#5a6068] hover:bg-[#eff1f3] cursor-pointer"
                >
                  Dismiss False Positive
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(inspectIncident.id, 'Enforced')}
                    className="h-[38px] px-4 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[13px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <UserX className="size-3.5" />
                    <span>Enforce Penalty / Suspend</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
