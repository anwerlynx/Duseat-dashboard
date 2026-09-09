'use client'

import * as React from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Users,
  Wallet,
  FileText,
  ScrollText,
  Handshake,
  CreditCard,
  TrendingUp,
  UserCheck,
  ChevronDown,
} from 'lucide-react'
import { multiChartsData, type MultiChartDataPoint } from './data'
import { cn } from '@/lib/utils'

export type ChartType =
  | 'user-growth'
  | 'revenue'
  | 'requests-growth'
  | 'offers-growth'
  | 'deals-growth'
  | 'subscription-growth'
  | 'agent-performance'
  | 'investor-activity'

interface ChartTab {
  id: ChartType
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  unit: string
  total: string
  growth: string
}

const CHART_TABS: ChartTab[] = [
  { id: 'user-growth', label: 'User Growth', icon: Users, color: '#00c2cb', unit: 'Users', total: '12,846', growth: '+12.4%' },
  { id: 'revenue', label: 'Revenue', icon: Wallet, color: '#17b26a', unit: 'AED', total: 'AED 824.5K', growth: '+18.3%' },
  { id: 'requests-growth', label: 'Requests Growth', icon: FileText, color: '#2f54eb', unit: 'Briefs', total: '487', growth: '+9.3%' },
  { id: 'offers-growth', label: 'Offers Growth', icon: ScrollText, color: '#f79009', unit: 'Offers', total: '1,248', growth: '+6.8%' },
  { id: 'deals-growth', label: 'Deals Growth', icon: Handshake, color: '#00c2cb', unit: 'Deals', total: '365', growth: '+7.4%' },
  { id: 'subscription-growth', label: 'Subscription Growth', icon: CreditCard, color: '#722ed1', unit: 'Active', total: '1,842', growth: '+8.4%' },
  { id: 'agent-performance', label: 'Agent Performance', icon: TrendingUp, color: '#17b26a', unit: 'Score', total: '92.4%', growth: '+4.8%' },
  { id: 'investor-activity', label: 'Investor Activity', icon: UserCheck, color: '#eb2f96', unit: 'Index', total: '94.8', growth: '+6.2%' },
]

function CustomTooltip({ active, payload, label, activeTab }: any) {
  if (!active || !payload || !payload.length) return null
  const tab = CHART_TABS.find((t) => t.id === activeTab) || CHART_TABS[0]

  return (
    <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-3 shadow-xl font-sans text-xs">
      <p className="font-bold text-[#1f2327] mb-1">{label} 2026</p>
      {payload.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2 justify-between min-w-[140px]">
          <span className="text-[#6f777f]">{item.name || tab.label}:</span>
          <span className="font-bold font-mono text-[#1f2327]">
            {tab.id === 'revenue' ? `AED ${Number(item.value).toLocaleString()}` : `${Number(item.value).toLocaleString()} ${tab.unit}`}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ChartsGallery() {
  const [activeTab, setActiveTab] = React.useState<ChartType>('user-growth')
  const currentTab = CHART_TABS.find((t) => t.id === activeTab) || CHART_TABS[0]

  return (
    <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs font-sans space-y-4">
      {/* Header & Metric Highlight */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#d3d5d7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#00c2cb]">Platform Intelligence</span>
            <span className="rounded bg-[#dfefe8] text-[#17b26a] px-2 py-0.2 text-[11px] font-bold">{currentTab.growth}</span>
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1f2327] mt-0.5">
            {currentTab.label} Overview
          </h2>
          <p className="text-[13px] text-[#6f777f]">Comprehensive monthly tracking across marketplace performance indicators</p>
        </div>

        <div className="flex items-center gap-3 bg-[#fcfcfc] p-2.5 rounded-[10px] border border-[#d3d5d7]">
          <div>
            <p className="text-xs text-[#6f777f]">Current Value</p>
            <p className="text-xl font-bold text-[#1f2327] font-mono">{currentTab.total}</p>
          </div>
          <div className="h-8 w-px bg-[#d3d5d7]" />
          <div>
            <p className="text-xs text-[#6f777f]">Growth Velocity</p>
            <p className="text-sm font-bold text-[#17b26a]">{currentTab.growth} MoM</p>
          </div>
        </div>
      </div>

      {/* Tabs Strip (8 Charts Switcher) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {CHART_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
                isActive
                  ? 'bg-[#1f2327] text-white shadow-2xs'
                  : 'bg-[#f8f9fa] border border-[#d3d5d7] text-[#6f777f] hover:bg-white hover:text-[#1f2327]'
              )}
            >
              <Icon className={cn('size-3.5', isActive ? 'text-[#00c2cb]' : 'text-[#6f777f]')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'revenue' ? (
            <AreaChart data={multiChartsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#17b26a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#17b26a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} tickFormatter={(v) => `AED ${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
              <Area type="monotone" dataKey="revenue" stroke="#17b26a" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          ) : activeTab === 'user-growth' ? (
            <AreaChart data={multiChartsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c2cb" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00c2cb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
              <Area type="monotone" dataKey="userGrowth" stroke="#00c2cb" strokeWidth={2.5} fill="url(#userGrad)" name="Total Users" />
              <Line type="monotone" dataKey="investors" stroke="#2f54eb" strokeWidth={2} dot={false} name="Investors" />
              <Line type="monotone" dataKey="agents" stroke="#f79009" strokeWidth={2} dot={false} name="Agents" />
            </AreaChart>
          ) : activeTab === 'requests-growth' || activeTab === 'offers-growth' || activeTab === 'deals-growth' ? (
            <BarChart data={multiChartsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
              <Bar
                dataKey={
                  activeTab === 'requests-growth'
                    ? 'requestsGrowth'
                    : activeTab === 'offers-growth'
                    ? 'offersGrowth'
                    : 'dealsGrowth'
                }
                fill={currentTab.color}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={multiChartsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
              <Line
                type="monotone"
                dataKey={
                  activeTab === 'subscription-growth'
                    ? 'subscriptionGrowth'
                    : activeTab === 'agent-performance'
                    ? 'agentPerformance'
                    : 'investorActivity'
                }
                stroke={currentTab.color}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: currentTab.color }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
