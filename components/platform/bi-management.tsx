'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  Target,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Sparkles,
  Zap,
  Building2,
  Award,
  Filter,
  CheckCircle2,
  Layers,
  Search,
  ChevronDown,
  X,
  FileText,
  CreditCard,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import {
  MetricCard,
  TableAvatar,
  Pagination,
} from '@/components/ui'
import { cn, exportToCsv } from '@/lib/utils'

export type BiTab =
  | 'Marketplace Funnel'
  | 'Unit Economics (LTV/CAC)'
  | 'AI Forecasting'
  | 'Agency Leaderboard'

export interface AgencyLeaderboardEntry {
  rank: number
  agencyName: string
  logo?: string
  activeBrokers: number
  offersSubmitted: number
  dealsClosed: number
  totalDealVolumeAed: number
  platformRevenueAed: number
  conversionRate: number
  avgCloseDays: number
  tier: 'Elite Partner' | 'Gold Tier' | 'Verified Agency'
}

const LEADERBOARD: AgencyLeaderboardEntry[] = [
  {
    rank: 1,
    agencyName: 'Prestige Royal Properties LLC',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80',
    activeBrokers: 34,
    offersSubmitted: 612,
    dealsClosed: 89,
    totalDealVolumeAed: 142500000,
    platformRevenueAed: 2850000,
    conversionRate: 14.5,
    avgCloseDays: 14.2,
    tier: 'Elite Partner',
  },
  {
    rank: 2,
    agencyName: 'Apex Luxury Real Estate DXB',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    activeBrokers: 28,
    offersSubmitted: 488,
    dealsClosed: 71,
    totalDealVolumeAed: 98400000,
    platformRevenueAed: 1968000,
    conversionRate: 14.5,
    avgCloseDays: 16.5,
    tier: 'Elite Partner',
  },
  {
    rank: 3,
    agencyName: 'Damac Hills Prime Associates',
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
    activeBrokers: 19,
    offersSubmitted: 340,
    dealsClosed: 48,
    totalDealVolumeAed: 64200000,
    platformRevenueAed: 1284000,
    conversionRate: 14.1,
    avgCloseDays: 18.0,
    tier: 'Gold Tier',
  },
  {
    rank: 4,
    agencyName: 'Metropolitan Capital Real Estate',
    activeBrokers: 22,
    offersSubmitted: 405,
    dealsClosed: 44,
    totalDealVolumeAed: 58900000,
    platformRevenueAed: 1178000,
    conversionRate: 10.8,
    avgCloseDays: 21.4,
    tier: 'Gold Tier',
  },
  {
    rank: 5,
    agencyName: 'Emaar Signature Specialists',
    activeBrokers: 15,
    offersSubmitted: 290,
    dealsClosed: 36,
    totalDealVolumeAed: 51200000,
    platformRevenueAed: 1024000,
    conversionRate: 12.4,
    avgCloseDays: 19.1,
    tier: 'Verified Agency',
  },
]

export function BusinessIntelligenceManagement() {
  const [activeTab, setActiveTab] = React.useState<BiTab>('Marketplace Funnel')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [timeRange, setTimeRange] = React.useState('YTD (2026)')
  const [tierFilter, setTierFilter] = React.useState('All Tiers')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const tabs: BiTab[] = [
    'Marketplace Funnel',
    'Unit Economics (LTV/CAC)',
    'AI Forecasting',
    'Agency Leaderboard',
  ]

  const filteredAgencies = React.useMemo(() => {
    return LEADERBOARD.filter((a) => {
      if (tierFilter !== 'All Tiers' && a.tier !== tierFilter) return false
      if (searchQuery.trim()) {
        return a.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
  }, [searchQuery, tierFilter])

  const totalPages = Math.max(1, Math.ceil(filteredAgencies.length / pageSize))
  const paginatedAgencies = filteredAgencies.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleExport = () => {
    exportToCsv(
      `duseat_bi_leaderboard_${new Date().toISOString().split('T')[0]}`,
      ['Rank', 'Agency', 'Active Brokers', 'Offers Submitted', 'Deals Closed', 'Deal Volume (AED)', 'Commission Yield (AED)', 'Conversion Rate', 'Avg Close Days', 'Tier'],
      LEADERBOARD.map((a) => [
        a.rank,
        a.agencyName,
        a.activeBrokers,
        a.offersSubmitted,
        a.dealsClosed,
        a.totalDealVolumeAed,
        a.platformRevenueAed,
        `${a.conversionRate}%`,
        a.avgCloseDays,
        a.tier,
      ])
    )
  }

  return (
    <PlatformShell
      title="Business Intelligence & Unit Economics"
      eyebrow="Executive Decision Room"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Business Intelligence & Unit Economics
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Real-time visibility into marketplace conversion drop-offs, unit economics (LTV/CAC), cohort retention curves, and revenue forecasting.
              </p>
            </div>

            {/* Quick Actions Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/reports"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <FileText className="size-4 text-[#00c2cb]" />
                <span>Custom Reports</span>
              </Link>
              <Link
                href="/finance"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <CreditCard className="size-4 text-[#6f777f]" />
                <span>Escrow Ledger</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="LTV / CAC Ratio"
              value="5.4x"
              tone="success"
              active={activeTab === 'Unit Economics (LTV/CAC)'}
              onClick={() => setActiveTab('Unit Economics (LTV/CAC)')}
            />
            <MetricCard
              label="Gross Deal Volume"
              value="AED 415.2M"
              tone="brand"
              active={false}
            />
            <MetricCard
              label="Net Take Rate"
              value="2.14%"
              tone="neutral"
              active={false}
            />
            <MetricCard
              label="Avg Time to Close"
              value="16.8 Days"
              tone="warning"
              active={false}
            />
          </div>
        </header>

        {/* Single Unified Section Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Pill Tabs Bar */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                {tabs.map((t) => {
                  const isActive = activeTab === t
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
                          ? 'bg-[#1f2327] text-white shadow-2xs'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{t}</span>
                    </button>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Dropdown
                  align="end"
                  value={timeRange}
                  onSelect={setTimeRange}
                  options={[
                    { label: 'Last 30 Days', value: 'Last 30 Days' },
                    { label: 'This Quarter (Q3 2026)', value: 'This Quarter (Q3 2026)' },
                    { label: 'YTD (2026)', value: 'YTD (2026)' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13.5px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                      <Calendar className="size-3.5 text-[#6f777f]" />
                      <span>{timeRange}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {activeTab === 'Agency Leaderboard' && (
                  <button
                    type="button"
                    onClick={handleExport}
                    className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                  >
                    <Download className="size-4 text-white" />
                    <span className="whitespace-nowrap">Export Leaderboard CSV</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls for Agency Leaderboard */}
            {activeTab === 'Agency Leaderboard' && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="Search agency name…"
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
                  value={tierFilter}
                  onSelect={(val) => {
                    setTierFilter(val)
                    setCurrentPage(1)
                  }}
                  ariaLabel="Filter by Agency Tier"
                  options={[
                    { label: 'All Tiers', value: 'All Tiers' },
                    { label: 'Elite Partner', value: 'Elite Partner' },
                    { label: 'Gold Tier', value: 'Gold Tier' },
                    { label: 'Verified Agency', value: 'Verified Agency' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                      <Award className="size-4 text-[#6f777f]" />
                      <span>{tierFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {(searchQuery || tierFilter !== 'All Tiers') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setTierFilter('All Tiers')
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

          {/* TAB 1: Marketplace Funnel */}
          {activeTab === 'Marketplace Funnel' && (
            <div className="p-4 sm:p-6 space-y-6">
              <div>
                <h2 className="text-[16px] font-bold text-[#1f2327]">Full Marketplace Lifecycle Conversion Funnel</h2>
                <p className="text-[13px] text-[#6f777f]">
                  Tracking conversion velocity and attrition from registered Investor to closed Escrow Deal.
                </p>
              </div>

              {/* 5-Step Funnel Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-[#f8f9fa] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#8f969e]">Stage 1</div>
                  <h3 className="text-[14px] font-bold text-[#1f2327]">Investors</h3>
                  <div className="text-[22px] font-bold text-[#1f2327]">12,480</div>
                  <span className="text-[11.5px] text-[#6f777f] block">Verified buyers</span>
                  <div className="mt-3 pt-2 border-t border-[#d3d5d7] flex items-center justify-between text-[11.5px] font-semibold text-[#00848b]">
                    <span>Convert to Req</span>
                    <span>64.2%</span>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-[#f8f9fa] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#8f969e]">Stage 2</div>
                  <h3 className="text-[14px] font-bold text-[#1f2327]">Requests Published</h3>
                  <div className="text-[22px] font-bold text-[#1f2327]">8,012</div>
                  <span className="text-[11.5px] text-[#6f777f] block">Active mandates</span>
                  <div className="mt-3 pt-2 border-t border-[#d3d5d7] flex items-center justify-between text-[11.5px] font-semibold text-[#00848b]">
                    <span>Receive Offers</span>
                    <span>88.5%</span>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-[#f8f9fa] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#8f969e]">Stage 3</div>
                  <h3 className="text-[14px] font-bold text-[#1f2327]">Agent Offers</h3>
                  <div className="text-[22px] font-bold text-[#1f2327]">38,450</div>
                  <span className="text-[11.5px] text-[#6f777f] block">4.8 offers / req</span>
                  <div className="mt-3 pt-2 border-t border-[#d3d5d7] flex items-center justify-between text-[11.5px] font-semibold text-[#00848b]">
                    <span>Engage in Chat</span>
                    <span>42.1%</span>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#d3d5d7] p-4 bg-[#f8f9fa] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#8f969e]">Stage 4</div>
                  <h3 className="text-[14px] font-bold text-[#1f2327]">Active Chats</h3>
                  <div className="text-[22px] font-bold text-[#1f2327]">16,180</div>
                  <span className="text-[11.5px] text-[#6f777f] block">Direct negotiations</span>
                  <div className="mt-3 pt-2 border-t border-[#d3d5d7] flex items-center justify-between text-[11.5px] font-semibold text-[#00848b]">
                    <span>Formalize Deal</span>
                    <span>31.4%</span>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#00a870]/30 p-4 bg-[#e6f9f3] space-y-2">
                  <div className="text-[11px] font-bold uppercase text-[#00a870]">Stage 5 (Closed)</div>
                  <h3 className="text-[14px] font-bold text-[#1f2327]">Escrow Deals</h3>
                  <div className="text-[22px] font-bold text-[#00a870]">5,082</div>
                  <span className="text-[11.5px] text-[#6f777f] block">AED 415.2M closed</span>
                  <div className="mt-3 pt-2 border-t border-[#00a870]/20 flex items-center justify-between text-[11.5px] font-bold text-[#00a870]">
                    <span>Gross Win Rate</span>
                    <span>40.7% of req</span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 sm:p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-2">
                  <span className="text-[12px] font-bold text-[#8f969e] uppercase">Velocity Metric</span>
                  <h4 className="text-[15px] font-bold text-[#1f2327]">Time to First Offer</h4>
                  <div className="text-[24px] font-bold text-[#00848b]">4.2 Hours</div>
                  <p className="text-[12.5px] text-[#6f777f]">
                    72% of investor requests receive their first off-plan or secondary offer within 4 hours.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-2">
                  <span className="text-[12px] font-bold text-[#8f969e] uppercase">Funnel Health</span>
                  <h4 className="text-[15px] font-bold text-[#1f2327]">Offers per Request</h4>
                  <div className="text-[24px] font-bold text-[#1f2327]">4.8 Proposals</div>
                  <p className="text-[12.5px] text-[#6f777f]">
                    Healthy marketplace competition prevents agent monopolies and ensures price discovery.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-2">
                  <span className="text-[12px] font-bold text-[#8f969e] uppercase">Escrow Success</span>
                  <h4 className="text-[15px] font-bold text-[#1f2327]">Deal Completion Rate</h4>
                  <div className="text-[24px] font-bold text-[#00a870]">94.2%</div>
                  <p className="text-[12.5px] text-[#6f777f]">
                    Only 5.8% of formalized escrow deals are aborted due to financing or title deed disputes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Unit Economics */}
          {activeTab === 'Unit Economics (LTV/CAC)' && (
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-4">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Agent Monetization Economics</h3>
                <div className="space-y-3 text-[13.5px]">
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Customer Acquisition Cost (CAC)</span>
                    <span className="font-bold text-[#1f2327]">AED 1,840</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Average Revenue Per Agent (ARPU)</span>
                    <span className="font-bold text-[#1f2327]">AED 9,920 / yr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Estimated Lifetime Value (LTV)</span>
                    <span className="font-bold text-[#00a870]">AED 28,400</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">CAC Payback Period</span>
                    <span className="font-bold text-[#1f2327]">2.2 Months</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#6f777f]">Annual Churn Rate</span>
                    <span className="font-bold text-[#00a870]">4.8% (Elite retention)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-4">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Investor Marketplace Economics</h3>
                <div className="space-y-3 text-[13.5px]">
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Investor Acquisition Cost (Blended CAC)</span>
                    <span className="font-bold text-[#1f2327]">AED 420</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Average Deal Value Closed</span>
                    <span className="font-bold text-[#1f2327]">AED 3,850,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Platform Commission Yield per Closed Deal</span>
                    <span className="font-bold text-[#00a870]">AED 77,000 (2.0%)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#d3d5d7]">
                    <span className="text-[#6f777f]">Repeat Investor Rate (2+ Deals)</span>
                    <span className="font-bold text-[#1f2327]">24.8%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#6f777f]">Organic vs Paid Referral Ratio</span>
                    <span className="font-bold text-[#00a870]">62% Organic</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI Forecasting */}
          {activeTab === 'AI Forecasting' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="p-5 rounded-[12px] border border-[#d3d5d7] bg-[#f8f9fa] space-y-3">
                <div className="flex items-center gap-2 text-[#00848b]">
                  <Sparkles className="size-5" />
                  <h3 className="text-[15px] font-bold text-[#1f2327]">Q4 2026 AI Revenue & Volume Projections</h3>
                </div>
                <p className="text-[13.5px] text-[#6f777f] leading-relaxed">
                  Neural forecasting trained on 18 months of Dubai Land Department off-plan registrations and seasonal Q4 UAE property surge projects a <span className="font-bold text-[#1f2327]">+34% spike</span> in luxury penthouse and villa requests over AED 10M.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 sm:p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-2">
                  <span className="text-[12px] font-bold text-[#8f969e] uppercase">Projected Escrow Volume</span>
                  <div className="text-[24px] font-bold text-[#1f2327]">AED 580M</div>
                  <span className="text-[12px] font-medium text-[#00a870]">&uarr; 38% projected Q4</span>
                </div>
                <div className="p-4 sm:p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-2">
                  <span className="text-[12px] font-bold text-[#8f969e] uppercase">Projected Platform Revenue</span>
                  <div className="text-[24px] font-bold text-[#00a870]">AED 12.4M</div>
                  <span className="text-[12px] font-medium text-[#00a870]">&uarr; Escrow + Power Agent tier</span>
                </div>
                <div className="p-4 sm:p-5 rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] space-y-2">
                  <span className="text-[12px] font-bold text-[#8f969e] uppercase">Estimated Active Agents</span>
                  <div className="text-[24px] font-bold text-[#1f2327]">1,450 Verified</div>
                  <span className="text-[12px] font-medium text-[#6f777f]">+180 net new agencies</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Agency Leaderboard Table */}
          {activeTab === 'Agency Leaderboard' && (
            <>
              <div className="hidden md:block overflow-x-auto table-scrollbar flex-1">
                <table className="w-full min-w-[1000px] border-collapse text-left text-[14px] font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 whitespace-nowrap text-[14px] font-semibold text-[#1f2327]">
                      <th className="w-16 px-4">Rank</th>
                      <th className="px-4">Agency</th>
                      <th className="px-4">Brokers</th>
                      <th className="px-4">Offers</th>
                      <th className="px-4">Deals Won</th>
                      <th className="px-4">Closed Volume</th>
                      <th className="px-4">Commission Yield</th>
                      <th className="px-4">Conversion</th>
                      <th className="px-4 text-right">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {paginatedAgencies.map((agency) => (
                      <tr key={agency.rank} className="h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa]">
                        <td className="px-4 font-bold text-[14px] text-[#1f2327]">
                          #{agency.rank}
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar name={agency.agencyName} src={agency.logo} size="md" />
                            <span className="font-semibold text-[14px] text-[#1f2327]">{agency.agencyName}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 font-medium text-[#1f2327]">{agency.activeBrokers}</td>
                        <td className="whitespace-nowrap px-4 font-medium text-[#6f777f]">{agency.offersSubmitted}</td>
                        <td className="whitespace-nowrap px-4 font-semibold text-[#00a870]">{agency.dealsClosed}</td>
                        <td className="whitespace-nowrap px-4 font-semibold text-[#1f2327]">
                          AED {(agency.totalDealVolumeAed / 1000000).toFixed(1)}M
                        </td>
                        <td className="whitespace-nowrap px-4 font-semibold text-[#00848b]">
                          AED {(agency.platformRevenueAed / 1000).toFixed(0)}k
                        </td>
                        <td className="whitespace-nowrap px-4 font-semibold text-[#1f2327]">{agency.conversionRate}%</td>
                        <td className="whitespace-nowrap px-4 text-right">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold',
                              agency.tier === 'Elite Partner' && 'bg-[#e0f7f8] text-[#00848b]',
                              agency.tier === 'Gold Tier' && 'bg-[#fff8e6] text-[#b27b00]',
                              agency.tier === 'Verified Agency' && 'bg-[#eff1f3] text-[#5a6068]'
                            )}
                          >
                            {agency.tier}
                          </span>
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
                  totalItems={filteredAgencies.length}
                  rowsPerPage={pageSize}
                  rowsOptions={[10, 20, 30]}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={(n) => {
                    setPageSize(n)
                    setCurrentPage(1)
                  }}
                  itemLabel="agencies"
                />
              </div>
            </>
          )}
        </section>
      </div>
    </PlatformShell>
  )
}
