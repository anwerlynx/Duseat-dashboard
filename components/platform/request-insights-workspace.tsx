'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  TrendingUp,
  Clock,
  Users,
  Eye,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Share2,
  Bookmark,
  Smartphone,
  Globe,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
  Calendar,
  ChevronRight,
  MapPin,
  Flame,
  FileSpreadsheet,
  FileText,
  Filter,
  Check,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { StatusBadge } from '@/components/ui/figma-badges'
import { cn } from '@/lib/utils'

interface RequestInsightData {
  id: string
  investorName: string
  investorEmail: string
  propertyType: string
  budget: string
  location: string
  city: string
  status: string
  createdDate: string
  lastActivity: string
  timeUntilFirstOffer: string
  totalReach: number
  totalViews: number
  totalOffers: number
  totalChats: number
  dealStatus: string
  overallScore: number
  profileCompleteness: number
  budgetAccuracy: number
  locationPopularity: number
  propertyDemand: number
  investorVerification: number
  historicalBehavior: number
  engagementScore: number
  successRate: number
  likelihoodOffers: number
  likelihoodClosing: number
}

const SAMPLE_REQUESTS: RequestInsightData[] = [
  {
    id: 'REQ-IN-2048-04',
    investorName: 'Omar Nasser',
    investorEmail: 'omar.nasser@alrajhi-invest.sa',
    propertyType: 'Office',
    budget: '3.8M–5M AED',
    location: 'Business Bay, DIFC, Downtown Dubai',
    city: 'Dubai, UAE',
    status: 'Matched',
    createdDate: '12 May 2026, 14:30',
    lastActivity: '10 mins ago',
    timeUntilFirstOffer: '1h 18m',
    totalReach: 482,
    totalViews: 318,
    totalOffers: 19,
    totalChats: 7,
    dealStatus: 'Offers Under Review (8.9% ROI)',
    overallScore: 94,
    profileCompleteness: 100,
    budgetAccuracy: 96,
    locationPopularity: 98,
    propertyDemand: 94,
    investorVerification: 100,
    historicalBehavior: 95,
    engagementScore: 98,
    successRate: 92,
    likelihoodOffers: 98,
    likelihoodClosing: 88,
  },
  {
    id: 'REQ-2040',
    investorName: 'Omar Nasser',
    investorEmail: 'omar.nasser@alrajhi-invest.sa',
    propertyType: 'Beachfront Signature Villa',
    budget: 'AED 38,000,000',
    location: 'Palm Jumeirah, Frond N',
    city: 'Dubai, UAE',
    status: 'Closed',
    createdDate: '18 Apr 2026, 10:15',
    lastActivity: '20 May 2026, 01:45',
    timeUntilFirstOffer: '45m',
    totalReach: 520,
    totalViews: 412,
    totalOffers: 14,
    totalChats: 4,
    dealStatus: 'Deal Closed (DEAL-4820)',
    overallScore: 98,
    profileCompleteness: 100,
    budgetAccuracy: 100,
    locationPopularity: 100,
    propertyDemand: 98,
    investorVerification: 100,
    historicalBehavior: 98,
    engagementScore: 99,
    successRate: 100,
    likelihoodOffers: 100,
    likelihoodClosing: 100,
  },
  {
    id: 'REQ-IN-2048-03',
    investorName: 'Mohammed Al-Falasi',
    investorEmail: 'm.falasi@dubaiinvest.com',
    propertyType: 'Luxury Villa',
    budget: 'AED 15,200,000',
    location: 'Palm Jumeirah, Frond G',
    city: 'Dubai, UAE',
    status: 'Open',
    createdDate: '14 May 2026, 09:15',
    lastActivity: '2 hours ago',
    timeUntilFirstOffer: '45m',
    totalReach: 620,
    totalViews: 412,
    totalOffers: 24,
    totalChats: 11,
    dealStatus: 'Offers Under Review',
    overallScore: 96,
    profileCompleteness: 100,
    budgetAccuracy: 98,
    locationPopularity: 99,
    propertyDemand: 94,
    investorVerification: 100,
    historicalBehavior: 95,
    engagementScore: 97,
    successRate: 92,
    likelihoodOffers: 99,
    likelihoodClosing: 89,
  },
  {
    id: 'REQ-IN-2048-02',
    investorName: 'Alexander Wright',
    investorEmail: 'alex.wright@capitalfunds.uk',
    propertyType: 'Commercial Office',
    budget: 'AED 4,800,000',
    location: 'Business Bay, Opus Tower',
    city: 'Dubai, UAE',
    status: 'Closed',
    createdDate: '02 May 2026, 11:00',
    lastActivity: '3 days ago',
    timeUntilFirstOffer: '3h 10m',
    totalReach: 310,
    totalViews: 194,
    totalOffers: 8,
    totalChats: 4,
    dealStatus: 'Deal Completed',
    overallScore: 86,
    profileCompleteness: 90,
    budgetAccuracy: 88,
    locationPopularity: 89,
    propertyDemand: 82,
    investorVerification: 100,
    historicalBehavior: 84,
    engagementScore: 86,
    successRate: 85,
    likelihoodOffers: 90,
    likelihoodClosing: 82,
  },
]

export function RequestInsightsWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialId = searchParams.get('id') || 'REQ-IN-2048-04'

  const [selectedId, setSelectedId] = React.useState<string>(initialId)
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'funnel' | 'engagement' | 'timeline' | 'agencies' | 'budget' | 'ai'
  >('overview')

  const currentReq =
    SAMPLE_REQUESTS.find((r) => r.id === selectedId) || SAMPLE_REQUESTS[0]

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        encodeURIComponent(
          `Request ID,${currentReq.id}\n` +
          `Investor,${currentReq.investorName}\n` +
          `Budget,${currentReq.budget}\n` +
          `Property,${currentReq.propertyType}\n` +
          `Areas,"${currentReq.location}"\n`
        )
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', csvContent)
      downloadAnchor.setAttribute('download', `request_${currentReq.id}.csv`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      return
    }
    alert(`Exporting Request Insights for ${currentReq.id} as ${format.toUpperCase()}`)
  }

  // Funnel steps calculation
  const funnelSteps = [
    { label: 'Eligible Agents', count: 540, drop: '0%' },
    { label: 'Reached Agents', count: currentReq.totalReach, drop: '89.2%' },
    { label: 'Viewed Request', count: currentReq.totalViews, drop: '66.0%' },
    { label: 'Interested', count: 184, drop: '57.8%' },
    { label: 'Started Offer', count: 48, drop: '26.1%' },
    { label: 'Submitted Offer', count: currentReq.totalOffers, drop: '39.5%' },
    { label: 'Accepted Offer', count: 2, drop: '10.5%' },
    { label: 'Chat Started', count: currentReq.totalChats, drop: '100%' },
    { label: 'Deal Created', count: 1, drop: '50%' },
    { label: 'Deal Closed', count: currentReq.status === 'Closed' ? 1 : 0, drop: currentReq.status === 'Closed' ? '100%' : 'In progress' },
  ]

  return (
    <PlatformShell
      title="Request Insights"
      eyebrow="Marketplace Intelligence"
      description="Deep analytical intelligence, reach funnel, conversion speed, and AI scoring for individual requests."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
          >
            <FileSpreadsheet className="size-3.5 text-[#16A86B]" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
          >
            <FileText className="size-3.5 text-[#E5484D]" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#f8f9fa] min-h-[calc(100vh-64px)]">
        {/* Top Control Bar: Request Selector & Quick Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium uppercase tracking-wider text-[#6f777f]">
                Active Request:
              </span>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-[#f8f9fa] px-3 text-[13px] font-semibold text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
              >
                {SAMPLE_REQUESTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {r.investorName} ({r.propertyType})
                  </option>
                ))}
              </select>
            </div>
            <StatusBadge status={currentReq.status} />
            <span className="hidden md:inline-block h-4 w-[1px] bg-[#d3d5d7]" />
            <div className="flex items-center gap-1.5 text-[13px] text-[#6f777f]">
              <MapPin className="size-3.5 text-[#6f777f]" />
              <span className="font-medium text-[#1f2327]">{currentReq.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#6f777f]">
              <DollarSign className="size-3.5 text-[#16A86B]" />
              <span className="font-semibold text-[#1f2327]">{currentReq.budget}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => router.push(`/requests?id=${currentReq.id}`)}
              className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              View in Requests
              <ChevronRight className="size-3" />
            </button>
          </div>
        </div>

        {/* Primary Operational KPI Cards (Section 18 & 5: 4-6 primary KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#8A939D]">
                AI Request Score
              </span>
              <Sparkles className="size-4 text-[#06B6C9]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-[#202428]">{currentReq.overallScore}/100</span>
              <span className="text-[11px] font-medium text-[#16A86B]">High</span>
            </div>
            <div className="mt-1 text-[11px] text-[#8A939D]">Top 5% market appeal</div>
          </div>

          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6f777f]">
                Total Reach
              </span>
              <Users className="size-4 text-[#3288D8]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-[#1f2327]">{currentReq.totalReach}</span>
              <span className="text-[11px] font-medium text-[#16A86B]">89% eligible</span>
            </div>
            <div className="mt-1 text-[11px] text-[#6f777f]">Across 68 registered agencies</div>
          </div>

          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6f777f]">
                Total Views
              </span>
              <Eye className="size-4 text-[#E99A18]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-[#1f2327]">{currentReq.totalViews}</span>
              <span className="text-[11px] font-medium text-[#16A86B]">66% view rate</span>
            </div>
            <div className="mt-1 text-[11px] text-[#6f777f]">248 unique agents</div>
          </div>

          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6f777f]">
                Offers Received
              </span>
              <FileCheck className="size-4 text-[#16A86B]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-[#1f2327]">{currentReq.totalOffers}</span>
              <span className="text-[11px] font-medium text-[#16A86B]">2 shortlist</span>
            </div>
            <div className="mt-1 text-[11px] text-[#6f777f]">Avg AED 8.4M</div>
          </div>

          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6f777f]">
                First Offer Time
              </span>
              <Clock className="size-4 text-[#00c2cb]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-[#1f2327]">{currentReq.timeUntilFirstOffer}</span>
              <span className="text-[11px] font-medium text-[#16A86B]">Fast</span>
            </div>
            <div className="mt-1 text-[11px] text-[#6f777f]">Platform avg: 4h 12m</div>
          </div>

          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6f777f]">
                Active Chats
              </span>
              <MessageSquare className="size-4 text-[#3288D8]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-[#1f2327]">{currentReq.totalChats}</span>
              <span className="text-[11px] font-medium text-[#1f2327]">Conversations</span>
            </div>
            <div className="mt-1 text-[11px] text-[#6f777f]">Avg response 8m</div>
          </div>
        </div>

        {/* Workspace Navigation Tabs (Section 10) */}
        <div className="flex items-center gap-1 border-b border-[#d3d5d7] pb-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Conversion' },
            { id: 'funnel', label: 'Reach Funnel' },
            { id: 'engagement', label: 'Engagement & Response' },
            { id: 'timeline', label: 'Milestone Timeline' },
            { id: 'agencies', label: 'Agencies & Devices' },
            { id: 'budget', label: 'Budget vs Market' },
            { id: 'ai', label: 'AI Score Breakdown' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-3.5 py-2 text-[13px] font-medium rounded-[8px] transition-all whitespace-nowrap cursor-pointer',
                activeTab === tab.id
                  ? 'bg-white text-[#1f2327] drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] border border-[#d3d5d7]'
                  : 'text-[#6f777f] hover:text-[#1f2327] hover:bg-white/60'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Conversion */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Conversion Summary & Rates */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Conversion Rates */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
                <h2 className="text-[15px] font-semibold text-[#202428]">
                  Marketplace Conversion Rates
                </h2>
                <p className="text-[12px] text-[#68727D] mt-0.5">
                  How efficiently this request progressed from discovery to negotiation
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                  <div className="p-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#d3d5d7]">
                    <div className="text-[11px] text-[#8A939D] font-medium uppercase">Reach Rate</div>
                    <div className="text-[20px] font-bold text-[#202428] mt-1">89.2%</div>
                    <div className="text-[11px] text-[#16A86B] mt-0.5">482 / 540 agents</div>
                  </div>
                  <div className="p-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#d3d5d7]">
                    <div className="text-[11px] text-[#8A939D] font-medium uppercase">View Rate</div>
                    <div className="text-[20px] font-bold text-[#202428] mt-1">66.0%</div>
                    <div className="text-[11px] text-[#16A86B] mt-0.5">318 / 482 reached</div>
                  </div>
                  <div className="p-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#d3d5d7]">
                    <div className="text-[11px] text-[#8A939D] font-medium uppercase">Interest Rate</div>
                    <div className="text-[20px] font-bold text-[#202428] mt-1">57.8%</div>
                    <div className="text-[11px] text-[#16A86B] mt-0.5">184 bookmarked/saved</div>
                  </div>
                  <div className="p-3.5 rounded-[8px] bg-[#F8F9FA] border border-[#d3d5d7]">
                    <div className="text-[11px] text-[#8A939D] font-medium uppercase">Offer Rate</div>
                    <div className="text-[20px] font-bold text-[#202428] mt-1">6.0%</div>
                    <div className="text-[11px] text-[#16A86B] mt-0.5">19 offers submitted</div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#d3d5d7]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-[#202428]">Offer-to-Chat Conversion</span>
                    <span className="text-[13px] font-semibold text-[#06B6C9]">36.8% (7 chats from 19 offers)</span>
                  </div>
                  <div className="w-full bg-[#F5F6F7] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#06B6C9] h-full rounded-full" style={{ width: '36.8%' }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-[#202428]">Chat-to-Deal Conversion</span>
                    <span className="text-[13px] font-semibold text-[#16A86B]">14.3% (1 deal initiated)</span>
                  </div>
                  <div className="w-full bg-[#F5F6F7] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#16A86B] h-full rounded-full" style={{ width: '14.3%' }} />
                  </div>
                </div>
              </div>

              {/* Response Speed Metrics */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
                <h2 className="text-[15px] font-semibold text-[#202428]">
                  Response Times & Velocity
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                    <span className="text-[11px] text-[#8A939D] uppercase font-medium">Time to First View</span>
                    <div className="text-[16px] font-bold text-[#202428] mt-1">4 minutes</div>
                    <span className="text-[10px] text-[#16A86B]">Top 3% speed</span>
                  </div>
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                    <span className="text-[11px] text-[#8A939D] uppercase font-medium">Time to First Offer</span>
                    <div className="text-[16px] font-bold text-[#202428] mt-1">1h 18m</div>
                    <span className="text-[10px] text-[#16A86B]">Prime agency response</span>
                  </div>
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                    <span className="text-[11px] text-[#8A939D] uppercase font-medium">Chat Response Time</span>
                    <div className="text-[16px] font-bold text-[#202428] mt-1">8m 30s</div>
                    <span className="text-[10px] text-[#16A86B]">Investor highly engaged</span>
                  </div>
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                    <span className="text-[11px] text-[#8A939D] uppercase font-medium">Offer Review Time</span>
                    <div className="text-[16px] font-bold text-[#202428] mt-1">42 minutes</div>
                    <span className="text-[10px] text-[#68727D]">Median platform: 3.5h</span>
                  </div>
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                    <span className="text-[11px] text-[#8A939D] uppercase font-medium">Decision Time</span>
                    <div className="text-[16px] font-bold text-[#202428] mt-1">2.4 days</div>
                    <span className="text-[10px] text-[#16A86B]">Shortlisting speed: High</span>
                  </div>
                  <div className="p-3 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                    <span className="text-[11px] text-[#8A939D] uppercase font-medium">Deal Progression</span>
                    <div className="text-[16px] font-bold text-[#0891A6] mt-1">Contract Prep</div>
                    <span className="text-[10px] text-[#8A939D]">Stage 3 of 4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Investor Details & Deal Status */}
            <div className="flex flex-col gap-6">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
                <h3 className="text-[14px] font-semibold text-[#202428]">
                  Investor Profile
                </h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#06B6C9] text-white font-bold text-sm">
                    {currentReq.investorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428]">
                      {currentReq.investorName}
                    </div>
                    <div className="text-[12px] text-[#68727D]">
                      {currentReq.investorEmail}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 pt-4 border-t border-[#d3d5d7] text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-[#8A939D]">Verification Status</span>
                    <span className="font-medium text-[#16A86B] flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> Verified UAE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A939D]">Trust Score</span>
                    <span className="font-semibold text-[#202428]">98/100 — High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A939D]">Total Requests</span>
                    <span className="font-medium text-[#202428]">
                      {currentReq.investorName === 'Omar Nasser' ? '17 requests' : '4 requests'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A939D]">Deals Completed</span>
                    <span className="font-medium text-[#202428]">
                      {currentReq.investorName === 'Omar Nasser' ? '1 deal (AED 38.0M)' : '2 deals (AED 14.8M)'}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentReq.investorName === 'Omar Nasser') {
                        router.push('/investors/IN-2045')
                      } else {
                        router.push(`/investors?search=${encodeURIComponent(currentReq.investorName)}`)
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 h-[36px] rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA] text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                  >
                    View Investor Profile (IN-2045)
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Deal Status Card */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
                <h3 className="text-[14px] font-semibold text-[#202428]">
                  Deal Stage Pipeline
                </h3>
                <div className="mt-3 p-3 rounded-[8px] bg-[#E8F9FB] border border-[#06B6C9]/20">
                  <div className="text-[11px] font-semibold text-[#0891A6] uppercase tracking-wider">
                    Current Milestone
                  </div>
                  <div className="text-[14px] font-bold text-[#202428] mt-0.5">
                    {currentReq.dealStatus}
                  </div>
                  <div className="text-[12px] text-[#68727D] mt-1">
                    MOU signed. Commission agreement sent for clearance.
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-[#16A86B]">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Offer Accepted (AED 8,350,000)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#16A86B]">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Agent & Investor Identity Cleared</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#06B6C9]">
                    <Clock className="size-4 shrink-0 animate-spin" />
                    <span className="font-semibold text-[#202428]">Contract Drafting & Escrow Setup</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#8A939D]">
                    <div className="size-4 rounded-full border border-[#D4D8DD] shrink-0" />
                    <span>Final Title Deed Transfer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reach Funnel (Exact Section 18 sequence) */}
        {activeTab === 'funnel' && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-xs">
            <div className="max-w-3xl">
              <h2 className="text-[16px] font-semibold text-[#202428]">
                Request Reach & Conversion Funnel
              </h2>
              <p className="text-[13px] text-[#68727D] mt-1">
                Full lifecycle funnel measuring conversion drop-off between each marketplace stage.
              </p>
            </div>

            <div className="mt-8 space-y-3 max-w-4xl">
              {funnelSteps.map((step, idx) => {
                const maxCount = 540
                const pct = Math.max(8, Math.round((step.count / maxCount) * 100))
                return (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className="w-32 sm:w-40 shrink-0 text-right text-[13px] font-medium text-[#202428]">
                      {step.label}
                    </div>
                    <div className="flex-1 bg-[#F5F6F7] h-9 rounded-[8px] overflow-hidden flex items-center px-3 relative">
                      <div
                        className={cn(
                          'absolute left-0 top-0 bottom-0 rounded-[8px] transition-all',
                          idx < 3 ? 'bg-[#06B6C9]/20 border-r-2 border-[#06B6C9]' :
                          idx < 6 ? 'bg-[#3288D8]/20 border-r-2 border-[#3288D8]' :
                          'bg-[#16A86B]/20 border-r-2 border-[#16A86B]'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                      <span className="relative z-10 text-[13px] font-bold text-[#202428]">
                        {step.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-24 shrink-0 text-[12px] text-[#68727D]">
                      {step.drop !== '0%' ? (
                        <span className="font-semibold text-[#202428]">{step.drop}</span>
                      ) : (
                        <span className="text-[#8A939D]">Base pool</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Engagement & Response */}
        {activeTab === 'engagement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
              <h3 className="text-[14px] font-semibold text-[#202428]">
                Engagement Actions
              </h3>
              <div className="mt-4 divide-y divide-[#d3d5d7] text-[13px]">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Total Views</span>
                  <span className="font-semibold text-[#202428]">318</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Unique Agent Views</span>
                  <span className="font-semibold text-[#202428]">248</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Repeat Views</span>
                  <span className="font-semibold text-[#202428]">70 (22.0%)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Saves & Favorites</span>
                  <span className="font-semibold text-[#202428]">184</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Shares</span>
                  <span className="font-semibold text-[#202428]">42</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Offers Withdrawn / Expired</span>
                  <span className="font-semibold text-[#202428]">2 withdrawn</span>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
              <h3 className="text-[14px] font-semibold text-[#202428]">
                Chat & Messaging Breakdown
              </h3>
              <div className="mt-4 divide-y divide-[#d3d5d7] text-[13px]">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Chats Initiated</span>
                  <span className="font-semibold text-[#202428]">7</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Total Messages Exchanged</span>
                  <span className="font-semibold text-[#202428]">148</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Average Chat Duration</span>
                  <span className="font-semibold text-[#202428]">4.2 days</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Floor Plans & Docs Shared</span>
                  <span className="font-semibold text-[#202428]">32 files</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#68727D]">Voice Notes Exchanged</span>
                  <span className="font-semibold text-[#202428]">14 notes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Milestone Timeline */}
        {activeTab === 'timeline' && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-xs">
            <h2 className="text-[15px] font-semibold text-[#202428]">
              Execution Timeline (Section 18)
            </h2>
            <div className="mt-6 space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#d3d5d7]">
              {[
                { time: '12 May 2026, 14:30', title: 'Request Created', desc: 'Sarah Jenkins submitted 8.5M Penthouse requirement in Downtown Dubai.' },
                { time: '12 May 2026, 14:34', title: 'First View', desc: 'Viewed by Prime Estates UAE (Agent: Zayd Ibrahim).' },
                { time: '12 May 2026, 15:48', title: 'First Offer Received', desc: 'Submitted by Zayd Ibrahim (AED 8,600,000 Burj Crown 3BR).' },
                { time: '12 May 2026, 16:15', title: 'Second Offer Received', desc: 'Submitted by Luxury Point Realty (AED 8,350,000).' },
                { time: '12 May 2026, 17:02', title: 'First Chat Opened', desc: 'Investor initiated negotiation with Luxury Point Realty.' },
                { time: '13 May 2026, 11:20', title: 'Offer Shortlisted & Accepted', desc: 'Investor accepted Luxury Point offer at AED 8,350,000.' },
                { time: '13 May 2026, 16:00', title: 'Deal Room Created', desc: 'Deal DEL-4081 generated and assigned to Operations.' },
              ].map((ev) => (
                <div key={ev.title} className="flex items-start gap-4 pl-8 relative">
                  <div className="absolute left-2.5 top-1 size-2.5 rounded-full bg-[#06B6C9] ring-4 ring-[#E8F9FB]" />
                  <div>
                    <span className="text-[11px] font-medium text-[#8A939D]">{ev.time}</span>
                    <div className="text-[14px] font-semibold text-[#202428] mt-0.5">{ev.title}</div>
                    <div className="text-[13px] text-[#68727D] mt-0.5">{ev.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Agencies & Devices */}
        {activeTab === 'agencies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
              <h3 className="text-[14px] font-semibold text-[#202428]">
                Top Agencies Reached
              </h3>
              <div className="mt-4 divide-y divide-[#d3d5d7]">
                {[
                  { name: 'Luxury Point Realty', offers: 3, views: 42, conv: 'Accepted Offer' },
                  { name: 'Prime Estates UAE', offers: 4, views: 38, conv: 'Shortlisted' },
                  { name: 'Emaar Platinum Brokers', offers: 2, views: 29, conv: 'Negotiation' },
                  { name: 'Gulf Horizon Properties', offers: 3, views: 24, conv: 'Reviewed' },
                ].map((ag) => (
                  <div key={ag.name} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium text-[#202428]">{ag.name}</div>
                      <div className="text-[11px] text-[#8A939D]">{ag.views} views • {ag.offers} offers</div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0891A6] bg-[#E8F9FB] px-2 py-0.5 rounded-full">
                      {ag.conv}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-xs">
              <h3 className="text-[14px] font-semibold text-[#202428]">
                Device & Platform Share
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#202428]">iPhone (iOS App)</span>
                    <span className="text-[#68727D]">58%</span>
                  </div>
                  <div className="w-full bg-[#F5F6F7] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#06B6C9] h-full rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#202428]">Desktop Web (Chrome/Safari)</span>
                    <span className="text-[#68727D]">28%</span>
                  </div>
                  <div className="w-full bg-[#F5F6F7] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3288D8] h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#202428]">Android App</span>
                    <span className="text-[#68727D]">14%</span>
                  </div>
                  <div className="w-full bg-[#F5F6F7] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#16A86B] h-full rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Budget vs Market */}
        {activeTab === 'budget' && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-xs">
            <h2 className="text-[15px] font-semibold text-[#202428]">
              Budget vs Market Calibration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div className="p-4 rounded-[8px] bg-[#E8F7F0] border border-[#16A86B]/20">
                <span className="text-[11px] font-bold text-[#16A86B] uppercase">Market Rating</span>
                <div className="text-[18px] font-bold text-[#202428] mt-1">Competitive & Realistic</div>
                <p className="text-[12px] text-[#68727D] mt-1">
                  Budget of AED 8.5M matches average 3-bedroom penthouse listings in Downtown Dubai.
                </p>
              </div>
              <div className="p-4 rounded-[8px] bg-[#F8F9FA] border border-[#d3d5d7]">
                <span className="text-[11px] font-bold text-[#8A939D] uppercase">Average Similar Request</span>
                <div className="text-[18px] font-bold text-[#202428] mt-1">AED 8,250,000</div>
                <p className="text-[12px] text-[#68727D] mt-1">
                  Investor is +3.0% above comparable area median, driving strong agent interest.
                </p>
              </div>
              <div className="p-4 rounded-[8px] bg-[#F8F9FA] border border-[#d3d5d7]">
                <span className="text-[11px] font-bold text-[#8A939D] uppercase">Suggested Offer Band</span>
                <div className="text-[18px] font-bold text-[#202428] mt-1">AED 8.1M – AED 8.7M</div>
                <p className="text-[12px] text-[#68727D] mt-1">
                  100% of received offers landed directly inside the optimal pricing envelope.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: AI Score Breakdown (Exact Section 18 signals) */}
        {activeTab === 'ai' && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#202428]">
                  AI Request Score Signals
                </h2>
                <p className="text-[13px] text-[#68727D] mt-0.5">
                  Algorithmic prediction of offer velocity, budget quality, and closing probability.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[28px] font-bold text-[#06B6C9]">{currentReq.overallScore}</span>
                <span className="text-[14px] text-[#8A939D]">/100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Profile Completeness', score: currentReq.profileCompleteness },
                { label: 'Budget Accuracy', score: currentReq.budgetAccuracy },
                { label: 'Location Popularity', score: currentReq.locationPopularity },
                { label: 'Property Demand', score: currentReq.propertyDemand },
                { label: 'Investor Verification', score: currentReq.investorVerification },
                { label: 'Historical Behavior', score: currentReq.historicalBehavior },
                { label: 'Engagement Score', score: currentReq.engagementScore },
                { label: 'Expected Success Rate', score: currentReq.successRate },
                { label: 'Likelihood of Closing', score: currentReq.likelihoodClosing },
              ].map((sig) => (
                <div key={sig.label} className="p-3.5 rounded-[8px] border border-[#d3d5d7] bg-[#F8F9FA]">
                  <div className="flex justify-between items-center text-[12px] font-medium text-[#202428]">
                    <span>{sig.label}</span>
                    <span className="font-bold text-[#0891A6]">{sig.score}%</span>
                  </div>
                  <div className="w-full bg-[#eff1f3] h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-[#06B6C9] h-full rounded-full" style={{ width: `${sig.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
