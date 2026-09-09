'use client'

import * as React from 'react'
import { ArrowUpDown, SlidersHorizontal, RotateCcw, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { FigmaTableFilterHeader, type FigmaTabItem, type FigmaFilterChipConfig } from '@/components/ui/figma-table-layout'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { cn } from '@/lib/utils'

interface MetricRecord {
  id: string
  metric: string
  metricSubtitle: string
  category: 'executive' | 'users' | 'investors' | 'agents' | 'revenue'
  segment: string
  dimension: string
  status: 'Active' | 'Optimal' | 'Pending' | 'Review' | 'Critical'
  currentValue: string
  trend: 'up' | 'down' | 'neutral'
  trendPct: string
  period: string
  country: string
  channel: string
}

const METRIC_RECORDS: MetricRecord[] = [
  {
    id: 'M-01',
    metric: 'Gross Deal Volume (GMV)',
    metricSubtitle: 'Closed escrow contract transactions',
    category: 'revenue',
    segment: 'High-Net-Worth (HNW)',
    dimension: 'Primary Off-Plan Sales',
    status: 'Optimal',
    currentValue: 'AED 84,290,000',
    trend: 'up',
    trendPct: '+18.4%',
    period: 'Current Month (MTD)',
    country: 'UAE',
    channel: 'Direct Broker',
  },
  {
    id: 'M-02',
    metric: 'Monthly Recurring Revenue (MRR)',
    metricSubtitle: 'Active agent & developer subscriptions',
    category: 'revenue',
    segment: 'Enterprise & Pro Plans',
    dimension: 'Subscription Billing',
    status: 'Active',
    currentValue: '$342,800',
    trend: 'up',
    trendPct: '+12.8%',
    period: 'Last 30 Days',
    country: 'UAE',
    channel: 'Online Checkout',
  },
  {
    id: 'M-03',
    metric: 'Investor KYC Verification Rate',
    metricSubtitle: 'Biometric passport pass-through',
    category: 'users',
    segment: 'International Investors',
    dimension: 'Onboarding Funnel',
    status: 'Optimal',
    currentValue: '94.6%',
    trend: 'up',
    trendPct: '+3.2%',
    period: 'Last 7 Days',
    country: 'Saudi Arabia',
    channel: 'Mobile App',
  },
  {
    id: 'M-04',
    metric: 'Average Deal Cycle Time',
    metricSubtitle: 'Request submission to digital signature',
    category: 'executive',
    segment: 'Luxury Residential',
    dimension: 'Operational Velocity',
    status: 'Active',
    currentValue: '4.2 Days',
    trend: 'down',
    trendPct: '-14.0%',
    period: 'Current Quarter (Q3)',
    country: 'UAE',
    channel: 'Platform Match',
  },
  {
    id: 'M-05',
    metric: 'Verified Agent Response SLA',
    metricSubtitle: 'Median time to initial qualified offer',
    category: 'agents',
    segment: 'Top-Tier Verified Brokers',
    dimension: 'Marketplace Responsiveness',
    status: 'Active',
    currentValue: '18 Minutes',
    trend: 'down',
    trendPct: '-22.5%',
    period: 'Real-Time Telemetry',
    country: 'UAE',
    channel: 'Agent Webhook',
  },
  {
    id: 'M-06',
    metric: 'Off-Plan Investor Match Rate',
    metricSubtitle: 'AI algorithm suitability score > 85%',
    category: 'investors',
    segment: 'Off-Plan Portfolios',
    dimension: 'AI Matchmaking Engine',
    status: 'Optimal',
    currentValue: '88.2%',
    trend: 'up',
    trendPct: '+6.1%',
    period: 'Last 30 Days',
    country: 'Qatar',
    channel: 'Direct Portal',
  },
  {
    id: 'M-07',
    metric: 'Platform Commission Revenue',
    metricSubtitle: 'Net brokerage success fee share',
    category: 'revenue',
    segment: 'All Deal Types',
    dimension: 'Finance Operations',
    status: 'Active',
    currentValue: 'AED 4,820,400',
    trend: 'up',
    trendPct: '+24.6%',
    period: 'Current Quarter (Q3)',
    country: 'UAE',
    channel: 'Escrow Settlement',
  },
  {
    id: 'M-08',
    metric: 'Escrow Dispute Rate',
    metricSubtitle: 'Disputed earnest money deposits',
    category: 'executive',
    segment: 'Escrow Settlements',
    dimension: 'Risk & Compliance',
    status: 'Optimal',
    currentValue: '0.04%',
    trend: 'down',
    trendPct: '-0.02%',
    period: 'Trailing 12 Months',
    country: 'UAE',
    channel: 'Central Escrow',
  },
]

const TABS: FigmaTabItem[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'users', label: 'Users' },
  { id: 'investors', label: 'Investors' },
  { id: 'agents', label: 'Agents' },
  { id: 'revenue', label: 'Revenue' },
]

export function FigmaMetricsTable() {
  const [activeTab, setActiveTab] = React.useState('revenue')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [countryFilter, setCountryFilter] = React.useState('all')
  const [segmentFilter, setSegmentFilter] = React.useState('all')
  const [channelFilter, setChannelFilter] = React.useState('all')
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sortField, setSortField] = React.useState<'metric' | 'currentValue' | 'status'>('metric')
  const [sortAsc, setSortAsc] = React.useState(true)

  const filterChips: FigmaFilterChipConfig[] = [
    {
      id: 'status',
      label: 'Status',
      selectedValue: statusFilter,
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Active', value: 'Active' },
        { label: 'Optimal', value: 'Optimal' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Review', value: 'Review' },
      ],
    },
    {
      id: 'country',
      label: 'Country',
      selectedValue: countryFilter,
      options: [
        { label: 'All Countries', value: 'all' },
        { label: 'UAE', value: 'UAE' },
        { label: 'Saudi Arabia', value: 'Saudi Arabia' },
        { label: 'Qatar', value: 'Qatar' },
      ],
    },
    {
      id: 'segment',
      label: 'Segment',
      selectedValue: segmentFilter,
      options: [
        { label: 'All Segments', value: 'all' },
        { label: 'High-Net-Worth (HNW)', value: 'High-Net-Worth (HNW)' },
        { label: 'Enterprise & Pro Plans', value: 'Enterprise & Pro Plans' },
        { label: 'Luxury Residential', value: 'Luxury Residential' },
      ],
    },
    {
      id: 'channel',
      label: 'Channel',
      selectedValue: channelFilter,
      options: [
        { label: 'All Channels', value: 'all' },
        { label: 'Direct Broker', value: 'Direct Broker' },
        { label: 'Online Checkout', value: 'Online Checkout' },
        { label: 'Mobile App', value: 'Mobile App' },
      ],
    },
  ]

  const handleFilterChange = (chipId: string, value: string) => {
    if (chipId === 'status') setStatusFilter(value)
    if (chipId === 'country') setCountryFilter(value)
    if (chipId === 'segment') setSegmentFilter(value)
    if (chipId === 'channel') setChannelFilter(value)
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
    setCountryFilter('all')
    setSegmentFilter('all')
    setChannelFilter('all')
  }

  const filteredData = React.useMemo(() => {
    return METRIC_RECORDS.filter((r) => {
      const matchesTab = activeTab === 'executive' || r.category === activeTab || (activeTab === 'revenue' && r.category === 'revenue')
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesCountry = countryFilter === 'all' || r.country === countryFilter
      const matchesSegment = segmentFilter === 'all' || r.segment === segmentFilter
      const matchesChannel = channelFilter === 'all' || r.channel === channelFilter
      return matchesTab && matchesStatus && matchesCountry && matchesSegment && matchesChannel
    })
  }, [activeTab, statusFilter, countryFilter, segmentFilter, channelFilter])

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredData.map((d) => d.id)))
    }
  }

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  return (
    <div className="rounded-2xl border border-[#d3d5d7] bg-white shadow-2xs overflow-hidden w-full">
      {/* 1. Standard Figma Filter Header */}
      <FigmaTableFilterHeader
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCustomizeColumns={() => {}}
        onResetFilters={handleResetFilters}
        filterChips={filterChips}
        onFilterChange={handleFilterChange}
        totalCount={filteredData.length}
        countLabel="records found"
      />

      {/* 2. Full-Width Clean Table View */}
      <div className="overflow-x-auto w-full table-scrollbar">
        <table className="w-full text-left text-xs text-[#344054] border-collapse min-w-[850px]">
          <thead className="bg-[#fafbfc] border-b border-[#e2e8f0] text-slate-900 font-bold">
            <tr>
              <th className="w-12 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all rows"
                  className="size-4 rounded border-[#d3d5d7] text-[#00c2cb] focus:ring-[#00c2cb] cursor-pointer"
                />
              </th>
              <th
                className="px-4 py-3 select-none cursor-pointer hover:text-[#00c2cb] transition-colors"
                onClick={() => {
                  setSortField('metric')
                  setSortAsc(!sortAsc)
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Metric
                  <ArrowUpDown className="size-3 text-slate-400" />
                </span>
              </th>
              <th className="px-4 py-3 select-none">
                <span className="inline-flex items-center gap-1">
                  Segment
                  <ArrowUpDown className="size-3 text-slate-400" />
                </span>
              </th>
              <th className="px-4 py-3 select-none">
                <span className="inline-flex items-center gap-1">
                  Dimension
                  <ArrowUpDown className="size-3 text-slate-400" />
                </span>
              </th>
              <th
                className="px-4 py-3 select-none cursor-pointer hover:text-[#00c2cb] transition-colors"
                onClick={() => {
                  setSortField('status')
                  setSortAsc(!sortAsc)
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Status
                  <ArrowUpDown className="size-3 text-slate-400" />
                </span>
              </th>
              <th
                className="px-4 py-3 select-none cursor-pointer hover:text-[#00c2cb] transition-colors"
                onClick={() => {
                  setSortField('currentValue')
                  setSortAsc(!sortAsc)
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Current value
                  <ArrowUpDown className="size-3 text-slate-400" />
                </span>
              </th>
              <th className="px-4 py-3 select-none text-right">
                <span className="inline-flex items-center gap-1">
                  Period
                  <ArrowUpDown className="size-3 text-slate-400" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f5]">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="size-6 text-slate-400" />
                    <p className="font-semibold text-slate-700">0 records found</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters or active category tab.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const isSelected = selectedIds.has(row.id)
                return (
                  <tr
                    key={row.id}
                    className={cn('hover:bg-slate-50/80 transition-colors', isSelected ? 'bg-teal-50/30' : '')}
                  >
                    <td className="w-12 px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(row.id)}
                        aria-label={`Select ${row.metric}`}
                        className="size-4 rounded border-[#d3d5d7] text-[#00c2cb] focus:ring-[#00c2cb] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{row.metric}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{row.metricSubtitle}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {row.segment}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{row.dimension}</td>
                    <td className="px-4 py-3.5">
                      <FigmaStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-[13px]">{row.currentValue}</span>
                        <span
                          className={cn(
                            'inline-flex items-center text-[11px] font-bold',
                            row.trend === 'up' ? 'text-emerald-600' : 'text-slate-600'
                          )}
                        >
                          {row.trend === 'up' ? (
                            <TrendingUp className="size-3 mr-0.5" />
                          ) : (
                            <TrendingDown className="size-3 mr-0.5" />
                          )}
                          {row.trendPct}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-slate-500">{row.period}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
