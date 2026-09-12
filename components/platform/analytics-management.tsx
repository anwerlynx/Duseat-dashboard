'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserPlus,
  DollarSign,
  Activity,
  Layers,
  MapPin,
  Calendar,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  PieChart,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building,
  Home,
  Briefcase,
  Flame,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  ShieldCheck,
  RotateCcw,
  Globe,
  Smartphone,
  Laptop,
  Mail,
  Send,
  Sliders,
  Check,
  X,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import { MainButton } from '@/components/ui/main-button'
import { TableAvatar } from '@/components/ui/table-avatar'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { MetricCard } from '@/components/ui/metric-card'
import { cn, exportToCsv } from '@/lib/utils'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'


// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type AnalyticsTab =
  | 'executive'
  | 'users'
  | 'investors'
  | 'agents'
  | 'supply-demand'
  | 'requests-offers'
  | 'deals-revenue'
  | 'geography'
  | 'reports'

export type GrowthMetric = 'Users' | 'Investors' | 'Agents' | 'Requests' | 'Deals' | 'Revenue'

export interface AgentPerformanceRecord {
  id: string
  agentName: string
  agency: string
  avatar?: string
  plan: 'Power Agent' | 'Elite' | 'Pro' | 'Free'
  offersSubmitted: number
  offersAccepted: number
  acceptanceRate: number
  avgResponseTimeMin: number
  dealsClosed: number
  revenueAed: number
  rating: number
  country: string
}

export interface SupplyDemandRecord {
  id: string
  area: string
  city: string
  propertyType: string
  requestsCount: number
  availableProperties: number
  offersCount: number
  supplyDemandStatus: 'High Demand / Low Supply' | 'Balanced' | 'High Demand / High Supply' | 'Low Demand / High Supply'
  avgBudgetAed: number
  avgMatchRate: number
}

export interface CohortRow {
  cohort: string
  totalUsers: number
  d1: number
  d7: number
  d30: number
  d60: number
  d90: number
}

export interface SavedReport {
  id: string
  name: string
  category: string
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'On-Demand'
  recipients: string[]
  lastGenerated: string
  format: 'PDF' | 'Excel' | 'CSV'
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const AGENT_PERFORMANCE_DATA: AgentPerformanceRecord[] = [
  {
    id: 'AG-1048',
    agentName: 'Amal Haddad',
    agency: 'Palm Luxury Real Estate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    plan: 'Power Agent',
    offersSubmitted: 64,
    offersAccepted: 42,
    acceptanceRate: 65.6,
    avgResponseTimeMin: 14,
    dealsClosed: 18,
    revenueAed: 1420000,
    rating: 4.9,
    country: 'United Arab Emirates',
  },
  {
    id: 'AG-1047',
    agentName: 'Omar Nasser',
    agency: 'Avenue Capital Properties',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    plan: 'Elite',
    offersSubmitted: 88,
    offersAccepted: 45,
    acceptanceRate: 51.1,
    avgResponseTimeMin: 22,
    dealsClosed: 15,
    revenueAed: 980000,
    rating: 4.8,
    country: 'United Arab Emirates',
  },
  {
    id: 'AG-1046',
    agentName: 'Youssef Ali',
    agency: 'Marina Bay Realty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    plan: 'Pro',
    offersSubmitted: 45,
    offersAccepted: 24,
    acceptanceRate: 53.3,
    avgResponseTimeMin: 35,
    dealsClosed: 9,
    revenueAed: 640000,
    rating: 4.7,
    country: 'United Arab Emirates',
  },
  {
    id: 'AG-1045',
    agentName: 'Sarah Johnson',
    agency: 'Downtown Premier Partners',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    plan: 'Power Agent',
    offersSubmitted: 52,
    offersAccepted: 38,
    acceptanceRate: 73.1,
    avgResponseTimeMin: 11,
    dealsClosed: 14,
    revenueAed: 1180000,
    rating: 5.0,
    country: 'United Kingdom',
  },
  {
    id: 'AG-1044',
    agentName: 'Khalid Al Mansoori',
    agency: 'Emirates Living Estates',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    plan: 'Pro',
    offersSubmitted: 38,
    offersAccepted: 19,
    acceptanceRate: 50.0,
    avgResponseTimeMin: 40,
    dealsClosed: 7,
    revenueAed: 480000,
    rating: 4.6,
    country: 'Saudi Arabia',
  },
]

const SUPPLY_DEMAND_DATA: SupplyDemandRecord[] = [
  {
    id: 'SD-1',
    area: 'Palm Jumeirah',
    city: 'Dubai',
    propertyType: '4BR-5BR Luxury Beachfront Villa',
    requestsCount: 142,
    availableProperties: 18,
    offersCount: 38,
    supplyDemandStatus: 'High Demand / Low Supply',
    avgBudgetAed: 18500000,
    avgMatchRate: 88.4,
  },
  {
    id: 'SD-2',
    area: 'Downtown Dubai',
    city: 'Dubai',
    propertyType: '2BR-3BR High-Floor Apartment',
    requestsCount: 290,
    availableProperties: 310,
    offersCount: 420,
    supplyDemandStatus: 'High Demand / High Supply',
    avgBudgetAed: 4800000,
    avgMatchRate: 94.2,
  },
  {
    id: 'SD-3',
    area: 'Business Bay',
    city: 'Dubai',
    propertyType: 'Commercial Full Floor Office',
    requestsCount: 84,
    availableProperties: 12,
    offersCount: 28,
    supplyDemandStatus: 'High Demand / Low Supply',
    avgBudgetAed: 9200000,
    avgMatchRate: 76.5,
  },
  {
    id: 'SD-4',
    area: 'Dubai Hills Estate',
    city: 'Dubai',
    propertyType: '3BR-4BR Park Townhouse',
    requestsCount: 185,
    availableProperties: 190,
    offersCount: 215,
    supplyDemandStatus: 'Balanced',
    avgBudgetAed: 5400000,
    avgMatchRate: 91.0,
  },
  {
    id: 'SD-5',
    area: 'Jumeirah Village Circle (JVC)',
    city: 'Dubai',
    propertyType: '1BR Studio Off-Plan',
    requestsCount: 95,
    availableProperties: 480,
    offersCount: 520,
    supplyDemandStatus: 'Low Demand / High Supply',
    avgBudgetAed: 950000,
    avgMatchRate: 62.0,
  },
]

const RETENTION_COHORT_DATA: CohortRow[] = [
  { cohort: 'May 2026', totalUsers: 2420, d1: 88.4, d7: 64.2, d30: 48.5, d60: 41.2, d90: 38.0 },
  { cohort: 'Jun 2026', totalUsers: 2890, d1: 90.1, d7: 68.5, d30: 52.0, d60: 45.1, d90: 42.4 },
  { cohort: 'Jul 2026', totalUsers: 3340, d1: 91.8, d7: 71.4, d30: 56.2, d60: 48.0, d90: 45.1 },
  { cohort: 'Aug 2026', totalUsers: 3810, d1: 93.5, d7: 74.0, d30: 59.8, d60: 51.5, d90: 48.2 },
]

const SAVED_REPORTS_DATA: SavedReport[] = [
  {
    id: 'REP-1',
    name: 'Executive Leadership Weekly Briefing',
    category: 'Executive KPIs',
    frequency: 'Weekly',
    recipients: ['cfo@duseat.com', 'ceo@duseat.com', 'ops@duseat.com'],
    lastGenerated: '08 Sep 2026, 06:00 AM GST',
    format: 'PDF',
  },
  {
    id: 'REP-2',
    name: 'High-Demand / Low-Supply Inventory Gaps',
    category: 'Marketplace Operations',
    frequency: 'Daily',
    recipients: ['marketplace-growth@duseat.com'],
    lastGenerated: '08 Sep 2026, 08:00 AM GST',
    format: 'Excel',
  },
  {
    id: 'REP-3',
    name: 'Broker Leaderboard & Conversion Yield',
    category: 'Agent Performance',
    frequency: 'Monthly',
    recipients: ['partnerships@duseat.com'],
    lastGenerated: '01 Sep 2026, 09:00 AM GST',
    format: 'CSV',
  },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function AnalyticsManagementInner() {
  const { toast } = useToast()

  // Primary Tab Navigation
  const [activeTab, setActiveTab] = React.useState<AnalyticsTab>('executive')

  // Global Controls (Spec 12.1)
  const [dateRangePreset, setDateRangePreset] = React.useState<'Today' | '7D' | '30D' | '90D' | '12M' | 'YTD'>('30D')
  const [comparisonPeriod, setComparisonPeriod] = React.useState<'Previous Period' | 'Previous Year' | 'No Comparison'>('Previous Period')
  const [selectedCountry, setSelectedCountry] = React.useState<string>('All')
  const [selectedGrowthMetric, setSelectedGrowthMetric] = React.useState<GrowthMetric>('Revenue')

  // Heatmap Metric Switcher (Spec 12.3)
  const [heatmapMetric, setHeatmapMetric] = React.useState<'Users' | 'Sessions' | 'Requests' | 'Messages'>('Requests')

  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<'CSV' | 'Excel' | 'PDF'>('CSV')
  const [exportScope, setExportScope] = React.useState<string>('Executive & Marketplace Health')

  // Sorting for Agent Table
  const [agentSortField, setAgentSortField] = React.useState<keyof AgentPerformanceRecord>('revenueAed')
  const [agentSortAsc, setAgentSortAsc] = React.useState(false)

  // Sorted Agents
  const sortedAgents = React.useMemo(() => {
    return [...AGENT_PERFORMANCE_DATA].sort((a, b) => {
      const valA = a[agentSortField]
      const valB = b[agentSortField]
      if (typeof valA === 'number' && typeof valB === 'number') {
        return agentSortAsc ? valA - valB : valB - valA
      }
      return 0
    })
  }, [agentSortField, agentSortAsc])

  // Export CSV Handler
  const handleExportAnalytics = () => {
    if (activeTab === 'agents') {
      const headers = ['Agent Name', 'Agency', 'Plan', 'Offers Submitted', 'Offers Accepted', 'Acceptance Rate %', 'Avg Response Time (min)', 'Deals Closed', 'Revenue (AED)', 'Rating', 'Country']
      const rows = sortedAgents.map((a) => [
        a.agentName,
        a.agency,
        a.plan,
        a.offersSubmitted,
        a.offersAccepted,
        a.acceptanceRate,
        a.avgResponseTimeMin,
        a.dealsClosed,
        a.revenueAed,
        a.rating,
        a.country,
      ])
      exportToCsv('agent_performance_analytics.csv', headers, rows)
    } else {
      const headers = ['Area', 'City', 'Property Type', 'Requests Count', 'Available Properties', 'Offers Count', 'Supply / Demand Status', 'Avg Budget (AED)', 'Match Rate %']
      const rows = SUPPLY_DEMAND_DATA.map((s) => [
        s.area,
        s.city,
        s.propertyType,
        s.requestsCount,
        s.availableProperties,
        s.offersCount,
        s.supplyDemandStatus,
        s.avgBudgetAed,
        s.avgMatchRate,
      ])
      exportToCsv('supply_demand_analytics.csv', headers, rows)
    }

    toast({
      variant: 'success',
      title: 'Analytics report generated',
      description: `Downloaded comprehensive ${dateRangePreset} dataset (${exportFormat}).`,
    })
    setExportModalOpen(false)
  }

  return (
    <PlatformShell
      title="Analytics & Business Intelligence"
      eyebrow="Decision Support"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card (Canonical Users Page Standard) */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Executive Analytics & Intelligence
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Executive performance metrics, demand analytics, conversion funnels, and market insights.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span>Export Report</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  toast({
                    variant: 'success',
                    title: 'AI Growth Briefing ready',
                    description: 'Identified 3 high-yield demand pockets in Palm Jumeirah and Downtown Dubai.',
                  })
                }}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <Sparkles className="size-4 text-white" />
                <span>Generate AI Briefing</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Monthly Active Users"
              value="128,420"
              trend="+18.2%"
              trendDirection="up"
              icon={Users}
              tone="neutral"
              subtitle="vs 108,600 prev month"
            />
            <MetricCard
              label="Gross Deal Volume"
              value="AED 184.2M"
              trend="+24.5%"
              trendDirection="up"
              icon={DollarSign}
              tone="info"
              subtitle="YTD pacing on track"
            />
            <MetricCard
              label="Broker Conversion Rate"
              value="68.4%"
              trend="3.2x vs norm"
              trendDirection="up"
              icon={TrendingUp}
              tone="success"
              subtitle="Power Agent top cohort"
            />
            <MetricCard
              label="Avg Match Latency"
              value="8.4 min"
              trend="-3.2m speed"
              trendDirection="up"
              icon={Zap}
              tone="brand"
              subtitle="Automated broker routing"
            />
          </div>
        </header>

        {/* =========================================================================
            GLOBAL CONTROL BAR (Spec 12.1 - Presets, Comparisons, Country, Freshness)
           ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Preset Selector */}
            <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
              {(['Today', '7D', '30D', '90D', '12M', 'YTD'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDateRangePreset(preset)}
                  className={cn(
                    'h-[28px] rounded-[6px] px-2.5 text-[12px] font-semibold transition-all cursor-pointer',
                    dateRangePreset === preset
                      ? 'bg-white text-[#1f2327] shadow-2xs'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Comparison Selector */}
            <Dropdown
              align="start"
              value={comparisonPeriod}
              onSelect={(val) => setComparisonPeriod(val as any)}
              options={[
                { label: 'vs Previous Period', value: 'Previous Period' },
                { label: 'vs Previous Year', value: 'Previous Year' },
                { label: 'No Comparison', value: 'No Comparison' },
              ]}
              trigger={
                <span className="inline-flex h-[32px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                  <span className="text-[#6f777f]">Compare:</span>
                  <span>{comparisonPeriod}</span>
                  <ChevronDown className="size-3 text-[#9da4ae]" />
                </span>
              }
            />

            {/* Country Filter */}
            <Dropdown
              align="start"
              value={selectedCountry}
              onSelect={(val) => setSelectedCountry(val)}
              options={[
                { label: 'All Markets (Global)', value: 'All' },
                { label: 'United Arab Emirates (UAE)', value: 'United Arab Emirates' },
                { label: 'Saudi Arabia (KSA)', value: 'Saudi Arabia' },
                { label: 'United Kingdom (UK)', value: 'United Kingdom' },
              ]}
              trigger={
                <span className="inline-flex h-[32px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                  <span className="text-[#6f777f]">Market:</span>
                  <span>{selectedCountry}</span>
                  <ChevronDown className="size-3 text-[#9da4ae]" />
                </span>
              }
            />
          </div>

          {/* Data Freshness Indicator (Spec 12.1 & 12.19) */}
          <div className="flex items-center gap-2 text-[11.5px] font-medium text-[#6f777f]">
            <span className="flex items-center gap-1 font-bold text-[#027a48]">
              <span className="size-2 rounded-full bg-[#12b76a] animate-pulse" />
              Live Feed
            </span>
            <span className="text-[#d3d5d7]">•</span>
            <span>Updated 4 mins ago (GST +04:00)</span>
          </div>
        </div>

        {/* =========================================================================
            NAVIGATION SUB-TABS (Spec 12.28)
           ========================================================================= */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'executive', label: 'Executive Dashboard', icon: <BarChart3 className="size-4" /> },
              { id: 'users', label: 'User Demographics', icon: <Users className="size-4" /> },
              { id: 'investors', label: 'Investor Funnel', icon: <Briefcase className="size-4" /> },
              { id: 'agents', label: 'Agent Performance', icon: <Award className="size-4" /> },
              { id: 'supply-demand', label: 'Supply vs Demand', icon: <Flame className="size-4 text-[#f79009]" /> },
              { id: 'requests-offers', label: 'Requests & Offers', icon: <Layers className="size-4" /> },
              { id: 'deals-revenue', label: 'Deals & Revenue', icon: <DollarSign className="size-4" /> },
              { id: 'geography', label: 'Geography', icon: <Globe className="size-4" /> },
              { id: 'reports', label: 'Saved Reports', icon: <FileText className="size-4" /> },
            ].map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'inline-flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-all cursor-pointer select-none',
                    active
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* =========================================================================
            1. TAB CONTENT: EXECUTIVE DASHBOARD (Spec 12.2, 12.30, 12.31)
           ========================================================================= */}
        {activeTab === 'executive' && (
          <div className="space-y-6 ant-fade-in">
            {/* Executive AI Insights & Anomaly Detection (Spec 12.30 & 12.31) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="rounded-[12px] border border-[#00c2cb]/40 bg-[#e5f6f7] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#00838f]">
                    <Sparkles className="size-4 text-[#00c2cb]" /> Market Opportunity Insight
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#00838f]">
                    Palm Jumeirah
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] text-[#1f2327] font-medium leading-relaxed">
                  Demand for <strong>4BR-5BR Beachfront Villas</strong> is up <strong>+42%</strong>, while broker offer inventory is constrained by <strong>88%</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('supply-demand')}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#00838f] hover:underline cursor-pointer"
                >
                  View Supply vs Demand Matrix <ArrowUpRight className="size-3.5" />
                </button>
              </div>

              <div className="rounded-[12px] border border-[#12b76a]/40 bg-[#ecfdf3] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#027a48]">
                    <TrendingUp className="size-4 text-[#12b76a]" /> Broker Conversion Yield
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#027a48]">
                    Power Agent Tier
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] text-[#1f2327] font-medium leading-relaxed">
                  Brokers on <strong>Power Agent</strong> subscription demonstrate a <strong>73.1%</strong> offer acceptance rate (2.8x higher than standard brokers).
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('agents')}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#027a48] hover:underline cursor-pointer"
                >
                  View Agent Leaderboards <ArrowUpRight className="size-3.5" />
                </button>
              </div>

              <div className="rounded-[12px] border border-[#fda29b] bg-[#fffbfa] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#d92d20]">
                    <AlertTriangle className="size-4 text-[#f04438]" /> Operational Anomaly
                  </span>
                  <span className="rounded-full bg-[#fef3f2] px-2 py-0.5 text-[10.5px] font-bold text-[#d92d20]">
                    Match Latency
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] text-[#1f2327] font-medium leading-relaxed">
                  Average time to first offer in <strong>Commercial Business Bay</strong> increased to <strong>3h 12m</strong> (+45m variance from benchmark).
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('requests-offers')}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#d92d20] hover:underline cursor-pointer"
                >
                  Investigate Request Pipeline <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Top Compact KPI Row (Spec 12.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">DAU</span>
                <span className="text-[18px] font-bold text-[#1f2327] block mt-0.5">34,120</span>
                <span className="text-[10px] font-bold text-[#12b76a]">+12.4% vs LM</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">WAU</span>
                <span className="text-[18px] font-bold text-[#1f2327] block mt-0.5">78,400</span>
                <span className="text-[10px] font-bold text-[#12b76a]">+15.1% vs LM</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">MAU</span>
                <span className="text-[18px] font-bold text-[#00838f] block mt-0.5">128,420</span>
                <span className="text-[10px] font-bold text-[#12b76a]">+18.2% vs LM</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">DAU / MAU</span>
                <span className="text-[18px] font-bold text-[#1f2327] block mt-0.5">26.5%</span>
                <span className="text-[10px] font-bold text-[#027a48]">High Stickiness</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">Active Investors</span>
                <span className="text-[18px] font-bold text-[#1f2327] block mt-0.5">14,820</span>
                <span className="text-[10px] font-bold text-[#12b76a]">+14.6%</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">Active Brokers</span>
                <span className="text-[18px] font-bold text-[#1f2327] block mt-0.5">3,208</span>
                <span className="text-[10px] font-bold text-[#12b76a]">+8.2%</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">30D Retention</span>
                <span className="text-[18px] font-bold text-[#12b76a] block mt-0.5">59.8%</span>
                <span className="text-[10px] font-bold text-[#12b76a]">+4.2%</span>
              </div>

              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f] block">User Churn</span>
                <span className="text-[18px] font-bold text-[#1f2327] block mt-0.5">1.4%</span>
                <span className="text-[10px] font-bold text-[#12b76a]">−0.6% Churn</span>
              </div>
            </div>

            {/* Platform Growth Chart (Spec 12.2) */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Executive Growth Trajectory</h3>
                  <p className="text-[12px] text-[#6f777f]">
                    Select primary platform signal to inspect historical growth pacing.
                  </p>
                </div>
                <div className="flex flex-wrap items-center rounded-[6px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
                  {(['Revenue', 'Users', 'Investors', 'Agents', 'Requests', 'Deals'] as const).map((metric) => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => setSelectedGrowthMetric(metric)}
                      className={cn(
                        'h-[26px] rounded-[4px] px-2.5 text-[11.5px] font-bold transition-all cursor-pointer',
                        selectedGrowthMetric === metric
                          ? 'bg-white text-[#1f2327] shadow-2xs'
                          : 'text-[#6f777f] hover:text-[#1f2327]'
                      )}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visual with Recharts */}
              <div className="h-[250px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { m: 'Jan', val: 42 },
                      { m: 'Feb', val: 55 },
                      { m: 'Mar', val: 68 },
                      { m: 'Apr', val: 82 },
                      { m: 'May', val: 104 },
                      { m: 'Jun', val: 125 },
                      { m: 'Jul', val: 148 },
                      { m: 'Aug', val: 172 },
                      { m: 'Sep', val: 205 },
                      { m: 'Oct', val: 242 },
                      { m: 'Nov', val: 288 },
                      { m: 'Dec', val: 340 },
                    ].map((d) => {
                      const multiplier =
                        selectedGrowthMetric === 'Revenue'
                          ? 2400
                          : selectedGrowthMetric === 'Users'
                          ? 38
                          : selectedGrowthMetric === 'Investors'
                          ? 6
                          : selectedGrowthMetric === 'Agents'
                          ? 4
                          : selectedGrowthMetric === 'Requests'
                          ? 12
                          : 8
                      return {
                        ...d,
                        val: d.val * multiplier,
                      }
                    })}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00c2cb" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#00c2cb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
                    <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 11 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6f777f', fontSize: 11 }}
                      tickFormatter={(v) =>
                        selectedGrowthMetric === 'Revenue'
                          ? `AED ${(v / 1000).toFixed(0)}k`
                          : v >= 1000
                          ? `${(v / 1000).toFixed(1)}k`
                          : v
                      }
                    />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        const val = payload[0].value
                        return (
                          <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                            <p className="font-bold text-[#1f2327] mb-1">{label} 2026</p>
                            <p className="text-[#6f777f]">
                              {selectedGrowthMetric}:{' '}
                              <strong className="text-[#00a4ac]">
                                {selectedGrowthMetric === 'Revenue'
                                  ? `AED ${Number(val).toLocaleString()}`
                                  : Number(val).toLocaleString()}
                              </strong>
                            </p>
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke="#00c2cb"
                      strokeWidth={2.5}
                      fill="url(#growthGrad)"
                      activeDot={{ r: 5, strokeWidth: 2, fill: '#00c2cb', stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Retention Cohort Analysis Table (Spec 12.2) */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <div className="px-5 py-4 border-b border-[#e5e7eb] bg-[#fafbfc]">
                <h4 className="text-[14px] font-bold text-[#1f2327]">User & Subscription Retention Cohorts</h4>
                <p className="text-[12px] text-[#6f777f]">
                  Percentage of active platform users returning after Day 1, Day 7, Day 30, Day 60, and Day 90.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="px-5">Registration Cohort</th>
                      <th className="px-3">Total Acquired</th>
                      <th className="px-3">Day 1</th>
                      <th className="px-3">Day 7</th>
                      <th className="px-3">Day 30</th>
                      <th className="px-3">Day 60</th>
                      <th className="px-5 text-right">Day 90</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {RETENTION_COHORT_DATA.map((c, idx) => (
                      <tr key={idx} className="h-[64px] hover:bg-[#f8f9fa] transition-colors font-sans whitespace-nowrap">
                        <td className="px-5 py-3.5 font-bold text-[#1f2327]">{c.cohort}</td>
                        <td className="px-3 py-3.5 font-medium text-[#6f777f]">{c.totalUsers.toLocaleString()} users</td>
                        <td className="px-3 py-3.5">
                          <span className="rounded bg-[#e5f6f7] px-2 py-0.5 font-bold text-[#00838f]">{c.d1}%</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="rounded bg-[#ecfdf3] px-2 py-0.5 font-bold text-[#027a48]">{c.d7}%</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="rounded bg-[#ecfdf3] px-2 py-0.5 font-bold text-[#027a48]">{c.d30}%</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="rounded bg-[#f4f5f6] px-2 py-0.5 font-bold text-[#1f2327]">{c.d60}%</span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-[#1f2327]">{c.d90}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. TAB CONTENT: USER ANALYTICS & HEATMAP (Spec 12.3)
           ========================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6 ant-fade-in">
            {/* Active Hours 24x7 Heatmap (Spec 12.3) */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Peak Activity Heatmap (Day × Hour)</h3>
                  <p className="text-[12px] text-[#6f777f]">
                    Analyze high-traffic windows to optimize push notifications, deal drops, and moderator staffing.
                  </p>
                </div>
                <div className="flex items-center rounded-[6px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
                  {(['Requests', 'Sessions', 'Users', 'Messages'] as const).map((metric) => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => setHeatmapMetric(metric)}
                      className={cn(
                        'h-[26px] rounded-[4px] px-2.5 text-[11.5px] font-bold transition-all cursor-pointer',
                        heatmapMetric === metric
                          ? 'bg-white text-[#1f2327] shadow-2xs'
                          : 'text-[#6f777f] hover:text-[#1f2327]'
                      )}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="mt-4 space-y-1.5 overflow-x-auto">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-8 font-bold text-[#6f777f] shrink-0">{day}</span>
                    <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 flex-1 min-w-[500px]">
                      {Array.from({ length: 24 }).map((_, hour) => {
                        const intensity = (hour >= 9 && hour <= 19) ? ((hour % 3 === 0) ? 'high' : 'med') : 'low'
                        return (
                          <div
                            key={hour}
                            className={cn(
                              'h-5 rounded-[2px] transition-all cursor-pointer hover:scale-110',
                              intensity === 'high' && 'bg-[#00c2cb]',
                              intensity === 'med' && 'bg-[#00c2cb]/50',
                              intensity === 'low' && 'bg-[#f4f5f6]'
                            )}
                            title={`${day} ${hour}:00 — ${intensity === 'high' ? 'Peak Volume' : 'Standard'}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics & Devices Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <h4 className="text-[13px] font-bold text-[#1f2327] mb-3">Device & Platform Share</h4>
                <div className="space-y-3 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#1f2327] font-medium">
                      <Smartphone className="size-4 text-[#00c2cb]" /> iOS Mobile App
                    </span>
                    <span className="font-bold text-[#1f2327]">62.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#1f2327] font-medium">
                      <Smartphone className="size-4 text-[#12b76a]" /> Android Mobile App
                    </span>
                    <span className="font-bold text-[#1f2327]">24.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#1f2327] font-medium">
                      <Laptop className="size-4 text-[#7a5af8]" /> Web & Desktop Portal
                    </span>
                    <span className="font-bold text-[#1f2327]">12.8%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <h4 className="text-[13px] font-bold text-[#1f2327] mb-3">Top User Nationalities</h4>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between font-bold text-[#1f2327]">
                    <span>United Arab Emirates (UAE)</span>
                    <span>42.5%</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1f2327]">
                    <span>Saudi Arabia & GCC</span>
                    <span>28.0%</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1f2327]">
                    <span>United Kingdom & Europe</span>
                    <span>18.5%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <h4 className="text-[13px] font-bold text-[#1f2327] mb-3">Feature Adoption & Engagement</h4>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between font-bold text-[#1f2327]">
                    <span>AI Valuation & ROI Predictor</span>
                    <span className="text-[#027a48]">78.2%</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1f2327]">
                    <span>Live Verified Broker Chat</span>
                    <span className="text-[#027a48]">91.4%</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1f2327]">
                    <span>Automated Demand Alerts</span>
                    <span className="text-[#027a48]">64.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. TAB CONTENT: INVESTOR ANALYTICS & FUNNEL (Spec 12.4)
           ========================================================================= */}
        {activeTab === 'investors' && (
          <div className="space-y-6 ant-fade-in">
            {/* End-to-End Investor Conversion Funnel (Spec 12.4) */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <h3 className="text-[16px] font-bold text-[#1f2327]">End-to-End Investor Conversion Funnel</h3>
              <p className="text-[12px] text-[#6f777f] mb-5">
                Conversion yield from investor onboarding to accepted property offer and escrow settlement.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center">
                {[
                  { stage: '1. Registered', count: '14,820', conv: '100%' },
                  { stage: '2. Verified ID', count: '12,410', conv: '83.7%' },
                  { stage: '3. Created Request', count: '9,280', conv: '74.8%' },
                  { stage: '4. Received Offers', count: '8,650', conv: '93.2%' },
                  { stage: '5. In Negotiation', count: '4,120', conv: '47.6%' },
                  { stage: '6. Offer Accepted', count: '2,840', conv: '68.9%' },
                  { stage: '7. Closed Deal', count: '1,940', conv: '68.3%' },
                ].map((st, i) => (
                  <div key={i} className="rounded-[8px] border border-[#d3d5d7] bg-[#fafbfc] p-3">
                    <span className="text-[11px] font-bold text-[#6f777f] block">{st.stage}</span>
                    <span className="text-[16px] font-bold text-[#1f2327] block mt-1">{st.count}</span>
                    <span className="rounded-full bg-[#e5f6f7] px-2 py-0.5 text-[10.5px] font-bold text-[#00838f] mt-1 inline-block">
                      {st.conv} yield
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Budget Distribution (Spec 12.4) */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <h3 className="text-[16px] font-bold text-[#1f2327] mb-3">Investor Budget Segments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-[12px]">
                <div className="p-3 border border-[#d3d5d7] rounded-[8px] bg-white">
                  <span className="text-[#8f969e] font-semibold block">&lt; AED 1M</span>
                  <span className="text-[18px] font-bold text-[#1f2327] block mt-1">2,410 investors</span>
                  <span className="text-[11px] text-[#6f777f]">Entry buyers & studios</span>
                </div>
                <div className="p-3 border border-[#d3d5d7] rounded-[8px] bg-white">
                  <span className="text-[#8f969e] font-semibold block">AED 1M – 3M</span>
                  <span className="text-[18px] font-bold text-[#1f2327] block mt-1">5,820 investors</span>
                  <span className="text-[11px] text-[#6f777f]">High velocity off-plan</span>
                </div>
                <div className="p-3 border border-[#d3d5d7] rounded-[8px] bg-white">
                  <span className="text-[#8f969e] font-semibold block">AED 3M – 8M</span>
                  <span className="text-[18px] font-bold text-[#00838f] block mt-1">4,190 investors</span>
                  <span className="text-[11px] text-[#6f777f]">Townhouses & luxury units</span>
                </div>
                <div className="p-3 border border-[#d3d5d7] rounded-[8px] bg-white">
                  <span className="text-[#8f969e] font-semibold block">AED 8M – 20M</span>
                  <span className="text-[18px] font-bold text-[#1f2327] block mt-1">1,840 investors</span>
                  <span className="text-[11px] text-[#6f777f]">Prime villas & penthouses</span>
                </div>
                <div className="p-3 border border-[#d3d5d7] rounded-[8px] bg-white">
                  <span className="text-[#8f969e] font-semibold block">AED 20M+ (VIP Fund)</span>
                  <span className="text-[18px] font-bold text-[#12b76a] block mt-1">560 investors</span>
                  <span className="text-[11px] text-[#6f777f]">Ultra-luxury & commercial</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            4. TAB CONTENT: AGENT PERFORMANCE (Spec 12.5)
           ========================================================================= */}
        {activeTab === 'agents' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Agent Performance Leaderboard</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Rank active brokers by closed revenue, acceptance conversion rate, response speed, and client ratings.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              <table className="w-full min-w-[800px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 whitespace-nowrap text-[14px] font-semibold text-[#1f2327]">
                    <th className="px-4">Broker & Agency</th>
                    <th className="px-4">Sub Tier</th>
                    <th className="px-4">Offers Pitch</th>
                    <th className="px-4">Acceptance Rate</th>
                    <th className="px-4">Avg Response</th>
                    <th className="px-4">Deals Closed</th>
                    <th className="px-4">Revenue (AED)</th>
                    <th className="px-4 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {sortedAgents.map((a) => (
                    <tr key={a.id} className="h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa]">
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <TableAvatar name={a.agentName} src={a.avatar} size="md" />
                          <div>
                            <div className="font-semibold text-[14px] text-[#1f2327]">{a.agentName}</div>
                            <div className="text-[12px] text-[#6f777f]">{a.agency}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="inline-flex items-center rounded-full bg-[#e5f6f7] px-2.5 py-0.5 text-[12px] font-semibold text-[#00838f]">
                          {a.plan}
                        </span>
                      </td>
                      <td className="px-4 text-[14px] leading-[20px] text-[#1f2327]">
                        {a.offersSubmitted} ({a.offersAccepted} won)
                      </td>
                      <td className="px-4 text-[14px] leading-[20px] font-semibold text-[#12b76a]">
                        {a.acceptanceRate}%
                      </td>
                      <td className="px-4 text-[14px] leading-[20px] text-[#6f777f] font-mono">
                        {a.avgResponseTimeMin}m
                      </td>
                      <td className="px-4 text-[14px] leading-[20px] font-semibold text-[#1f2327]">
                        {a.dealsClosed} deals
                      </td>
                      <td className="px-4 text-[14px] leading-[20px] font-semibold text-[#1f2327]">
                        AED {a.revenueAed.toLocaleString()}
                      </td>
                      <td className="px-4 text-right text-[14px] leading-[20px] font-semibold text-[#f79009]">
                        ★ {a.rating.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. TAB CONTENT: SUPPLY VS DEMAND (Spec 12.6 - Core Decision Matrix)
           ========================================================================= */}
        {activeTab === 'supply-demand' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <h3 className="text-[16px] font-bold text-[#1f2327]">Supply vs Demand Opportunity Matrix</h3>
              <p className="text-[12px] text-[#6f777f]">
                Identify high-demand real estate inventory bottlenecks where buyers are waiting for broker supply.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              <table className="w-full min-w-[800px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 whitespace-nowrap text-[14px] font-semibold text-[#1f2327]">
                    <th className="px-4">Area & City</th>
                    <th className="px-4">Target Property Type</th>
                    <th className="px-4">Buyer Requests</th>
                    <th className="px-4">Supply Inventory</th>
                    <th className="px-4">Broker Offers</th>
                    <th className="px-4">Market Opportunity</th>
                    <th className="px-4 text-right">Avg Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {SUPPLY_DEMAND_DATA.map((sd) => (
                    <tr key={sd.id} className="h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa]">
                      <td className="px-4 text-[14px] leading-[20px] font-semibold text-[#1f2327]">
                        {sd.area} <span className="text-[12px] font-normal text-[#6f777f]">({sd.city})</span>
                      </td>
                      <td className="px-4 text-[14px] leading-[20px] text-[#1f2327]">{sd.propertyType}</td>
                      <td className="px-4 text-[14px] leading-[20px] font-semibold text-[#1f2327]">{sd.requestsCount}</td>
                      <td className="px-4 text-[14px] leading-[20px] text-[#6f777f]">{sd.availableProperties} units</td>
                      <td className="px-4 text-[14px] leading-[20px] text-[#6f777f]">{sd.offersCount}</td>
                      <td className="px-4 text-[14px] leading-[20px]">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
                            sd.supplyDemandStatus === 'High Demand / Low Supply' && 'bg-[#fef3f2] text-[#d92d20] border border-[#fda29b]',
                            sd.supplyDemandStatus === 'Balanced' && 'bg-[#ecfdf3] text-[#027a48]',
                            sd.supplyDemandStatus === 'High Demand / High Supply' && 'bg-[#e5f6f7] text-[#00838f]',
                            sd.supplyDemandStatus === 'Low Demand / High Supply' && 'bg-[#fffaeb] text-[#b54708]'
                          )}
                        >
                          {sd.supplyDemandStatus}
                        </span>
                      </td>
                      <td className="px-4 text-right text-[14px] leading-[20px] font-semibold text-[#1f2327]">
                        AED {sd.avgBudgetAed.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            6. TAB CONTENT: SAVED & SCHEDULED REPORTS (Spec 12.22 - 12.23)
           ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Automated Scheduled Reports</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Configure recurring automated PDF and Excel analytics dispatches to executive leadership.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/reports">
                  <MainButton
                    variant="Secondary"
                    size="sm"
                    iconLeft={<Sparkles className="size-3.5 text-[#00c2cb]" />}
                    label="Open Report Builder"
                  />
                </Link>
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={<Plus className="size-3.5" />}
                  label="+ New Scheduled Report"
                  onClick={() => {
                    toast({
                      variant: 'info',
                      title: 'Report Scheduler',
                      description: 'Configure new recurring automated dispatch in the next release.',
                    })
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAVED_REPORTS_DATA.map((rep) => (
                <div key={rep.id} className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1f2327]">{rep.name}</span>
                    <span className="rounded bg-[#f4f5f6] px-2 py-0.5 text-[11px] font-bold text-[#1f2327]">
                      {rep.format}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#6f777f] space-y-1">
                    <div>Frequency: <strong className="text-[#1f2327]">{rep.frequency}</strong></div>
                    <div>Recipients: <span className="text-[#8f969e]">{rep.recipients.join(', ')}</span></div>
                    <div>Last Dispatched: <span className="text-[#8f969e]">{rep.lastGenerated}</span></div>
                  </div>
                  <div className="pt-2 border-t border-[#f0f2f5] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        toast({
                          variant: 'success',
                          title: 'Report dispatched',
                          description: `Sent ${rep.name} to ${rep.recipients.length} recipients.`,
                        })
                      }}
                      className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#00838f] hover:underline"
                    >
                      <Send className="size-3" /> Run & Send Now
                    </button>
                    <span className="text-[11px] font-mono text-[#8f969e]">{rep.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ANALYTICS EXPORT MODAL (Spec 12.21)
         ========================================================================= */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7] space-y-4">
            <h3 className="text-[16px] font-bold text-[#1f2327]">Export Analytics & Intelligence</h3>
            <p className="text-[12px] text-[#6f777f]">
              Download complete business intelligence datasets for external modeling or board presentations.
            </p>

            <div className="space-y-3 text-[12.5px]">
              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Report Scope</label>
                <select
                  value={exportScope}
                  onChange={(e) => setExportScope(e.target.value)}
                  className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] p-2 font-bold outline-none"
                >
                  <option value="Executive & Marketplace Health">Executive & Marketplace Health Summary</option>
                  <option value="Supply vs Demand Opportunity Matrix">Supply vs Demand Bottleneck Matrix</option>
                  <option value="Agent Performance & Leaderboards">Agent Leaderboards & Yield</option>
                  <option value="Investor Funnel & Conversion Yield">Investor Funnel & Conversion Rates</option>
                </select>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">File Format</label>
                <div className="mt-1 flex gap-2">
                  {(['CSV', 'Excel', 'PDF'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      className={cn(
                        'flex-1 rounded-[6px] border py-1.5 text-[12px] font-bold transition-all',
                        exportFormat === fmt
                          ? 'border-[#00c2cb] bg-[#e5f6f7] text-[#00838f]'
                          : 'border-[#d3d5d7] text-[#1f2327] hover:bg-[#f4f5f6]'
                      )}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExportAnalytics}
                className="rounded-[6px] bg-[#00c2cb] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#00838f]"
              >
                Download Export
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}

export function AnalyticsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <AnalyticsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
