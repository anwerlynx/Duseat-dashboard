'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles,
  Send,
  Users,
  Share2,
  Tag,
  Star,
  Globe,
  BarChart3,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Smartphone,
  Mail,
  Flame,
  Zap,
  Target,
  Gift,
  Award,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  History,
  Maximize2,
  Briefcase,
  Building,
  UserCheck,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { MainButton } from '@/components/ui/main-button'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { TableCheckbox } from '@/components/ui/table-checkbox'

import { Pagination, ScrollableTabsBar } from '@/components/ui'
import { MetricCard } from '@/components/ui/metric-card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { cn, exportToCsv } from '@/lib/utils'

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export type MarketingTab =
  | 'overview'
  | 'campaigns'
  | 'referrals'
  | 'promos'
  | 'featured'
  | 'landing-pages'
  | 'analytics'
  | 'calendar'
  | 'history'

export type CampaignChannel = 'Push' | 'Email' | 'In-App'

export type CampaignStatus =
  | 'Draft'
  | 'Scheduled'
  | 'Running'
  | 'Paused'
  | 'Completed'
  | 'Cancelled'

export interface CampaignItem {
  id: string
  name: string
  description: string
  channel: CampaignChannel
  audience: string
  targetAudienceCount: number
  status: CampaignStatus
  startDate: string
  endDate: string
  reach: number
  openRate?: number
  ctr: number
  conversions: number
  conversionRate: number
  revenueAed: number
  costAed?: number
  roi?: string
  ctaText: string
  ctaDestination: string
  pushContent?: { title: string; message: string; image?: string }
  emailContent?: { subject: string; previewText: string; sender: string; bodyHtml: string }
  inAppContent?: { title: string; message: string; placement: string }
  utmParams: { source: string; medium: string; campaign: string }
  owner: string
  lastUpdated: string
}

export interface ReferralRewardRule {
  id: string
  name: string
  trigger: 'User KYC Verified' | 'First Request Created' | 'First Offer Sent' | 'Subscription Purchased' | 'Deal Completed'
  rewardType: 'Cash / Bank Transfer' | 'Platform Wallet Credit' | 'Subscription Discount (30%)' | 'Offer Credits (10)'
  rewardValue: string
  eligibility: 'All Users' | 'Verified Investors' | 'Licensed Agents'
  maxMonthlyCap: number
  status: 'Active' | 'Paused'
}

export interface TopReferrerUser {
  rank: number
  id: string
  name: string
  userType: 'Agent' | 'Investor'
  agencyOrCity: string
  totalInvites: number
  successfulReferrals: number
  conversionRate: number
  totalRewardsAed: number
  revenueGeneratedAed: number
}

export interface PromoCodeMarketingItem {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: string
  assignedPlan: string
  assignedCountry: string
  usageLimit: number
  usedCount: number
  campaignName: string
  status: 'Active' | 'Scheduled' | 'Expired' | 'Disabled'
  expiresAt: string
}

export interface FeaturedListingItem {
  id: string
  entityId: string
  entityName: string
  entityType: 'Agent' | 'Developer' | 'Prime Request' | 'Luxury Property'
  placement: 'Homepage Hero Carousel' | 'Search Spotlight' | 'Investor Feed Priority'
  priority: number
  country: string
  startDate: string
  endDate: string
  status: 'Active' | 'Scheduled' | 'Ended'
  impressions: number
  clicks: number
  ctr: number
}

export interface MarketingLandingPage {
  id: string
  title: string
  slug: string
  campaign: string
  views: number
  ctr: number
  conversions: number
  conversionRate: number
  revenueAed: number
  status: 'Published' | 'Draft' | 'Scheduled'
  lastUpdated: string
}

export interface MarketingAuditLog {
  id: string
  action: string
  entityType: string
  entityName: string
  actor: string
  date: string
  time: string
  details: string
}

// ==========================================
// INITIAL SEED DATA
// ==========================================

export const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'CMP-101',
    name: 'Summer Prime Investor Matchmaking Push',
    description: 'Targeted mobile push to high-net-worth Gulf investors showcasing exclusive off-plan Palm Jumeirah villas.',
    channel: 'Push',
    audience: 'Verified Investors (UAE & Saudi)',
    targetAudienceCount: 14820,
    status: 'Running',
    startDate: '01 Sep 2026',
    endDate: '30 Sep 2026',
    reach: 14820,
    openRate: 24.8,
    ctr: 8.4,
    conversions: 384,
    conversionRate: 2.6,
    revenueAed: 482000,
    costAed: 18000,
    roi: '26.7x',
    ctaText: 'View Palm Dossier',
    ctaDestination: '/requests',
    pushContent: {
      title: '🌴 New Off-Market Palm Villa Allocation',
      message: 'Direct developer pricing from AED 28M with 50/50 handover payment plan. Review investor memorandum.',
    },
    utmParams: { source: 'push_notification', medium: 'mobile_app', campaign: 'summer_investor_push' },
    owner: 'Elena Rostova (Growth Lead)',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'CMP-102',
    name: 'Power Agent VIP Tier Expansion Newsletter',
    description: 'Email newsletter targeting top 500 licensed Dubai agents offering 20% discount on annual subscriptions.',
    channel: 'Email',
    audience: 'Active Licensed Agents',
    targetAudienceCount: 3420,
    status: 'Running',
    startDate: '05 Sep 2026',
    endDate: '20 Sep 2026',
    reach: 3420,
    openRate: 48.2,
    ctr: 14.6,
    conversions: 184,
    conversionRate: 5.4,
    revenueAed: 184000,
    costAed: 4500,
    roi: '40.8x',
    ctaText: 'Claim 20% Discount',
    ctaDestination: '/subscriptions',
    emailContent: {
      subject: 'Elevate your agency reach: Power Agent 2026 Edition',
      previewText: 'Unlimited offer submissions, VIP investor priority, and verified badge.',
      sender: 'partnerships@duseat.ae',
      bodyHtml: '<p>Join the elite top 5% of brokers in the UAE closing luxury off-plan deals faster.</p>',
    },
    utmParams: { source: 'email_newsletter', medium: 'crm_sendgrid', campaign: 'power_agent_upgrade' },
    owner: 'Tariq Al-Mansoor (Super Admin)',
    lastUpdated: '3 hours ago',
  },
  {
    id: 'CMP-103',
    name: 'In-App Onboarding KYC Completion Banner',
    description: 'In-app popup prompt displayed to newly registered investors who have not uploaded passport/Emirates ID.',
    channel: 'In-App',
    audience: 'Unverified New Users (0-7 Days)',
    targetAudienceCount: 4210,
    status: 'Running',
    startDate: '25 Aug 2026',
    endDate: '31 Dec 2026',
    reach: 4210,
    ctr: 32.4,
    conversions: 1420,
    conversionRate: 33.7,
    revenueAed: 0,
    ctaText: 'Complete Verification in 2 Mins',
    ctaDestination: '/verification',
    inAppContent: {
      title: 'Unlock Direct Agent Proposals',
      message: 'Upload your ID to access verified developer pricing and private buyer chats.',
      placement: 'Dashboard Modal Overlay',
    },
    utmParams: { source: 'in_app_prompt', medium: 'mobile_modal', campaign: 'kyc_activation' },
    owner: 'Sarah Jenkins (Trust Lead)',
    lastUpdated: '1 day ago',
  },
  {
    id: 'CMP-104',
    name: 'Autumn Riyadh Real Estate Expo Push',
    description: 'Geotargeted mobile campaign for Saudi investors attending Cityscape Riyadh.',
    channel: 'Push',
    audience: 'Saudi Arabia HNW Investors',
    targetAudienceCount: 8900,
    status: 'Scheduled',
    startDate: '18 Sep 2026',
    endDate: '24 Sep 2026',
    reach: 8900,
    ctr: 0,
    conversions: 0,
    conversionRate: 0,
    revenueAed: 0,
    ctaText: 'Explore Dubai Commercial Portfolios',
    ctaDestination: '/properties',
    pushContent: {
      title: '🏙️ Cityscape Riyadh VIP Showcase',
      message: 'Zero tax, 8.4% average net rental yield on Dubai commercial towers.',
    },
    utmParams: { source: 'push_notification', medium: 'geo_riyadh', campaign: 'cityscape_2026' },
    owner: 'Elena Rostova (Growth Lead)',
    lastUpdated: '2 days ago',
  },
  {
    id: 'CMP-105',
    name: 'Elite Broker Referral Cash Kickback Campaign',
    description: 'Special promo giving existing Power Agents AED 1,000 for each verified agency coworker invited.',
    channel: 'Email',
    audience: 'Power Agent & Elite Subscribers',
    targetAudienceCount: 780,
    status: 'Completed',
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    reach: 780,
    openRate: 64.2,
    ctr: 22.8,
    conversions: 94,
    conversionRate: 12.1,
    revenueAed: 141000,
    costAed: 94000,
    roi: '1.5x',
    ctaText: 'Copy Referral Link',
    ctaDestination: '/referrals',
    utmParams: { source: 'email', medium: 'referral_blast', campaign: 'broker_referrals' },
    owner: 'Tariq Al-Mansoor (Super Admin)',
    lastUpdated: '01 Sep 2026',
  },
]

export const INITIAL_REFERRAL_RULES: ReferralRewardRule[] = [
  {
    id: 'RUL-01',
    name: 'Investor KYC Verification Bonus',
    trigger: 'User KYC Verified',
    rewardType: 'Platform Wallet Credit',
    rewardValue: 'AED 250 Credit',
    eligibility: 'All Users',
    maxMonthlyCap: 10,
    status: 'Active',
  },
  {
    id: 'RUL-02',
    name: 'Licensed Agent Onboarding Kickback',
    trigger: 'Subscription Purchased',
    rewardType: 'Cash / Bank Transfer',
    rewardValue: 'AED 1,000 Cash',
    eligibility: 'Licensed Agents',
    maxMonthlyCap: 5,
    status: 'Active',
  },
  {
    id: 'RUL-03',
    name: 'First Deal Closing Milestone',
    trigger: 'Deal Completed',
    rewardType: 'Subscription Discount (30%)',
    rewardValue: '30% Off Annual Plan',
    eligibility: 'All Users',
    maxMonthlyCap: 3,
    status: 'Active',
  },
]

export const INITIAL_TOP_REFERRERS: TopReferrerUser[] = [
  {
    rank: 1,
    id: 'AG-1048',
    name: 'Amal Haddad',
    userType: 'Agent',
    agencyOrCity: 'Emaar Platinum Group',
    totalInvites: 84,
    successfulReferrals: 38,
    conversionRate: 45.2,
    totalRewardsAed: 38000,
    revenueGeneratedAed: 380000,
  },
  {
    rank: 2,
    id: 'AG-1046',
    name: 'Maya Karim',
    userType: 'Agent',
    agencyOrCity: 'Damac Premier Partners',
    totalInvites: 62,
    successfulReferrals: 27,
    conversionRate: 43.5,
    totalRewardsAed: 27000,
    revenueGeneratedAed: 270000,
  },
  {
    rank: 3,
    id: 'IN-2048',
    name: 'Rashid Al-Maktoum',
    userType: 'Investor',
    agencyOrCity: 'Dubai Hills Family Office',
    totalInvites: 41,
    successfulReferrals: 19,
    conversionRate: 46.3,
    totalRewardsAed: 4750,
    revenueGeneratedAed: 190000,
  },
  {
    rank: 4,
    id: 'AG-1044',
    name: 'Sara Mansour',
    userType: 'Agent',
    agencyOrCity: 'Sobha Elite Network',
    totalInvites: 39,
    successfulReferrals: 16,
    conversionRate: 41.0,
    totalRewardsAed: 16000,
    revenueGeneratedAed: 160000,
  },
  {
    rank: 5,
    id: 'IN-2047',
    name: 'Michael Sterling',
    userType: 'Investor',
    agencyOrCity: 'Sterling Capital London',
    totalInvites: 28,
    successfulReferrals: 12,
    conversionRate: 42.8,
    totalRewardsAed: 3000,
    revenueGeneratedAed: 120000,
  },
]

export const INITIAL_PROMO_CODES: PromoCodeMarketingItem[] = [
  {
    id: 'PRM-001',
    code: 'POWER20',
    discountType: 'percentage',
    discountValue: '20% OFF',
    assignedPlan: 'Power Agent',
    assignedCountry: 'UAE',
    usageLimit: 500,
    usedCount: 184,
    campaignName: 'Power Agent VIP Expansion',
    status: 'Active',
    expiresAt: '20 Sep 2026',
  },
  {
    id: 'PRM-002',
    code: 'RIYADHEXPO',
    discountType: 'percentage',
    discountValue: '15% OFF',
    assignedPlan: 'Elite / Pro',
    assignedCountry: 'Saudi Arabia',
    usageLimit: 300,
    usedCount: 42,
    campaignName: 'Cityscape Riyadh Push',
    status: 'Active',
    expiresAt: '31 Oct 2026',
  },
  {
    id: 'PRM-003',
    code: 'DUSEATVIP500',
    discountType: 'fixed',
    discountValue: 'AED 500 Fixed',
    assignedPlan: 'All Plans',
    assignedCountry: 'All',
    usageLimit: 100,
    usedCount: 98,
    campaignName: 'Executive Direct Outreach',
    status: 'Active',
    expiresAt: '15 Sep 2026',
  },
]

export const INITIAL_FEATURED_LISTINGS: FeaturedListingItem[] = [
  {
    id: 'FEAT-001',
    entityId: 'AG-1048',
    entityName: 'Amal Haddad (Emaar Platinum Group)',
    entityType: 'Agent',
    placement: 'Homepage Hero Carousel',
    priority: 1,
    country: 'UAE',
    startDate: '01 Sep 2026',
    endDate: '30 Sep 2026',
    status: 'Active',
    impressions: 48200,
    clicks: 3410,
    ctr: 7.1,
  },
  {
    id: 'FEAT-002',
    entityId: 'DEV-201',
    entityName: 'Sobha Realty (Waterfront District)',
    entityType: 'Developer',
    placement: 'Search Spotlight',
    priority: 2,
    country: 'UAE',
    startDate: '01 Sep 2026',
    endDate: '15 Sep 2026',
    status: 'Active',
    impressions: 39400,
    clicks: 2840,
    ctr: 7.2,
  },
  {
    id: 'FEAT-003',
    entityId: 'REQ-2048-04',
    entityName: 'AED 35M Palm Villa Ready Cash Buyer',
    entityType: 'Prime Request',
    placement: 'Investor Feed Priority',
    priority: 3,
    country: 'UAE',
    startDate: '05 Sep 2026',
    endDate: '20 Sep 2026',
    status: 'Active',
    impressions: 21800,
    clicks: 1940,
    ctr: 8.9,
  },
]

export const INITIAL_LANDING_PAGES: MarketingLandingPage[] = [
  {
    id: 'LP-001',
    title: 'Palm Jumeirah Ultra-Luxury Showcase',
    slug: '/landing/palm-villas-2026',
    campaign: 'Summer Prime Investor Push',
    views: 18420,
    ctr: 14.8,
    conversions: 412,
    conversionRate: 2.2,
    revenueAed: 412000,
    status: 'Published',
    lastUpdated: '01 Sep 2026',
  },
  {
    id: 'LP-002',
    title: 'Power Agent Membership Fast-Track',
    slug: '/landing/power-agent-pass',
    campaign: 'Power Agent VIP Expansion',
    views: 8940,
    ctr: 21.4,
    conversions: 248,
    conversionRate: 2.8,
    revenueAed: 248000,
    status: 'Published',
    lastUpdated: '05 Sep 2026',
  },
]

export const INITIAL_AUDIT_LOGS: MarketingAuditLog[] = [
  {
    id: 'AUD-MKT-01',
    action: 'Campaign Launched',
    entityType: 'Push Campaign',
    entityName: 'Summer Prime Investor Matchmaking Push',
    actor: 'Elena Rostova',
    date: '01 Sep 2026',
    time: '09:00 AM',
    details: 'Dispatched to 14,820 verified investors with Palm Villa deep link.',
  },
  {
    id: 'AUD-MKT-02',
    action: 'Promo Code Created',
    entityType: 'Promo Code',
    entityName: 'POWER20',
    actor: 'Tariq Al-Mansoor',
    date: '05 Sep 2026',
    time: '11:30 AM',
    details: '20% discount coupon created for Power Agent annual plan.',
  },
  {
    id: 'AUD-MKT-03',
    action: 'Referral Rule Created',
    entityType: 'Referral Rule',
    entityName: 'Investor KYC Verification Bonus',
    actor: 'Sarah Jenkins',
    date: '15 Aug 2026',
    time: '02:15 PM',
    details: 'Configured AED 250 wallet credit upon new user identity approval.',
  },
]

// ==========================================
// MAIN COMPONENT INNER
// ==========================================

function MarketingManagementInner() {
  const { toast } = useToast()

  // Navigation State
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab') as MarketingTab | null

  const [activeTab, setActiveTab] = React.useState<MarketingTab>(() => {
    if (
      tabParam &&
      [
        'overview',
        'campaigns',
        'referrals',
        'promos',
        'featured',
        'landing-pages',
        'analytics',
        'calendar',
        'history',
      ].includes(tabParam)
    ) {
      return tabParam
    }
    return 'overview'
  })

  React.useEffect(() => {
    if (
      tabParam &&
      [
        'overview',
        'campaigns',
        'referrals',
        'promos',
        'featured',
        'landing-pages',
        'analytics',
        'calendar',
        'history',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // Data Collections
  const [campaigns, setCampaigns] = React.useState<CampaignItem[]>(INITIAL_CAMPAIGNS)
  const [referralRules, setReferralRules] = React.useState<ReferralRewardRule[]>(INITIAL_REFERRAL_RULES)
  const [topReferrers, setTopReferrers] = React.useState<TopReferrerUser[]>(INITIAL_TOP_REFERRERS)
  const [promoCodes, setPromoCodes] = React.useState<PromoCodeMarketingItem[]>(INITIAL_PROMO_CODES)
  const [featuredListings, setFeaturedListings] = React.useState<FeaturedListingItem[]>(INITIAL_FEATURED_LISTINGS)
  const [landingPages, setLandingPages] = React.useState<MarketingLandingPage[]>(INITIAL_LANDING_PAGES)
  const [auditLogs, setAuditLogs] = React.useState<MarketingAuditLog[]>(INITIAL_AUDIT_LOGS)

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState('')
  const [channelFilter, setChannelFilter] = React.useState<string>('All')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')
  const [showFilters, setShowFilters] = React.useState(true)

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // ==========================================
  // CAMPAIGN BUILDER (8-STEP WORKSPACE)
  // ==========================================
  const [isBuildingCampaign, setIsBuildingCampaign] = React.useState(false)
  const [builderStep, setBuilderStep] = React.useState<number>(1)
  const [builderName, setBuilderName] = React.useState('')
  const [builderDesc, setBuilderDesc] = React.useState('')
  const [builderChannel, setBuilderChannel] = React.useState<CampaignChannel>('Push')
  const [builderAudience, setBuilderAudience] = React.useState('Verified Investors')
  const [builderCtaText, setBuilderCtaText] = React.useState('View Property Dossier')
  const [builderCtaDest, setBuilderCtaDest] = React.useState('/requests')
  const [builderPushTitle, setBuilderPushTitle] = React.useState('Prime Dubai Real Estate Update')
  const [builderPushMessage, setBuilderPushMessage] = React.useState('Exclusive off-market opportunities in Palm Jumeirah and Downtown Dubai.')
  const [builderEmailSubject, setBuilderEmailSubject] = React.useState('Exclusive Investment Memorandum — Q3 UAE Portfolios')
  const [builderScheduleOption, setBuilderScheduleOption] = React.useState<'now' | 'schedule'>('now')
  const [builderUtmCampaign, setBuilderUtmCampaign] = React.useState('autumn_investor_growth')
  const [isLaunching, setIsLaunching] = React.useState(false)

  // Modals State
  const [newRuleModal, setNewRuleModal] = React.useState(false)
  const [ruleName, setRuleName] = React.useState('')
  const [ruleTrigger, setRuleTrigger] = React.useState<ReferralRewardRule['trigger']>('User KYC Verified')
  const [ruleRewardType, setRuleRewardType] = React.useState<ReferralRewardRule['rewardType']>('Platform Wallet Credit')
  const [ruleValue, setRuleValue] = React.useState('AED 500')

  const [newPromoModal, setNewPromoModal] = React.useState(false)
  const [promoCodeInput, setPromoCodeInput] = React.useState('')
  const [promoDiscountVal, setPromoDiscountVal] = React.useState('20%')
  const [promoPlan, setPromoPlan] = React.useState('Power Agent')

  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<{ type: string; id: string; name: string } | null>(null)
  const [pauseConfirmCampaign, setPauseConfirmCampaign] = React.useState<CampaignItem | null>(null)

  // Handlers
  const handleLaunchCampaign = () => {
    if (!builderName.trim()) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Campaign name is required.' })
      return
    }
    setIsLaunching(true)

    setTimeout(() => {
      const newCmp: CampaignItem = {
        id: `CMP-${String(campaigns.length + 101)}`,
        name: builderName,
        description: builderDesc || 'Multi-channel strategic marketing campaign.',
        channel: builderChannel,
        audience: builderAudience,
        targetAudienceCount: builderAudience === 'All Users' ? 42800 : 14820,
        status: builderScheduleOption === 'now' ? 'Running' : 'Scheduled',
        startDate: 'Today',
        endDate: '30 Sep 2026',
        reach: builderScheduleOption === 'now' ? 14820 : 0,
        openRate: builderChannel === 'Email' ? 38.5 : undefined,
        ctr: 7.8,
        conversions: 0,
        conversionRate: 0,
        revenueAed: 0,
        ctaText: builderCtaText,
        ctaDestination: builderCtaDest,
        pushContent: { title: builderPushTitle, message: builderPushMessage },
        emailContent: {
          subject: builderEmailSubject,
          previewText: 'High-yield investment memorandum.',
          sender: 'marketing@duseat.ae',
          bodyHtml: '<p>Verified property opportunities.</p>',
        },
        utmParams: { source: builderChannel.toLowerCase(), medium: 'marketing', campaign: builderUtmCampaign },
        owner: 'Admin User',
        lastUpdated: 'Just now',
      }

      setCampaigns((prev) => [newCmp, ...prev])
      setAuditLogs((prev) => [
        {
          id: `AUD-MKT-${Date.now()}`,
          action: builderScheduleOption === 'now' ? 'Campaign Launched' : 'Campaign Scheduled',
          entityType: 'Campaign',
          entityName: newCmp.name,
          actor: 'Admin User',
          date: 'Today',
          time: 'Just now',
          details: `Dispatched campaign via ${newCmp.channel} to ${newCmp.audience}.`,
        },
        ...prev,
      ])

      setIsLaunching(false)
      setIsBuildingCampaign(false)
      setActiveTab('campaigns')
      toast({
        variant: 'success',
        title: builderScheduleOption === 'now' ? 'Campaign Launched Successfully' : 'Campaign Scheduled',
        description: `"${newCmp.name}" is now ${newCmp.status.toLowerCase()}.`,
      })
    }, 700)
  }

  // Toggle Campaign Pause / Resume
  const handleToggleCampaignPause = (campaign: CampaignItem) => {
    const nextStatus: CampaignStatus = campaign.status === 'Running' ? 'Paused' : 'Running'
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: nextStatus, lastUpdated: 'Just now' } : c))
    )
    setAuditLogs((prev) => [
      {
        id: `AUD-MKT-${Date.now()}`,
        action: nextStatus === 'Paused' ? 'Campaign Paused' : 'Campaign Resumed',
        entityType: 'Campaign',
        entityName: campaign.name,
        actor: 'Admin User',
        date: 'Today',
        time: 'Just now',
        details: `Campaign status transitioned to ${nextStatus}.`,
      },
      ...prev,
    ])
    setPauseConfirmCampaign(null)
    toast({
      variant: 'info',
      title: nextStatus === 'Paused' ? 'Campaign Paused' : 'Campaign Resumed',
      description: `"${campaign.name}" is now ${nextStatus.toLowerCase()}.`,
    })
  }

  // Duplicate Campaign
  const handleDuplicateCampaign = (campaign: CampaignItem) => {
    const copy: CampaignItem = {
      ...campaign,
      id: `CMP-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'Draft',
      reach: 0,
      conversions: 0,
      revenueAed: 0,
      lastUpdated: 'Just now',
    }
    setCampaigns([copy, ...campaigns])
    toast({ variant: 'success', title: 'Campaign Duplicated', description: `Created draft "${copy.name}".` })
  }

  // Create Referral Rule
  const handleCreateRule = () => {
    if (!ruleName.trim()) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Rule name is required.' })
      return
    }
    const newRule: ReferralRewardRule = {
      id: `RUL-${String(referralRules.length + 1).padStart(2, '0')}`,
      name: ruleName,
      trigger: ruleTrigger,
      rewardType: ruleRewardType,
      rewardValue: ruleValue,
      eligibility: 'All Users',
      maxMonthlyCap: 5,
      status: 'Active',
    }
    setReferralRules([...referralRules, newRule])
    setNewRuleModal(false)
    setRuleName('')
    toast({ variant: 'success', title: 'Referral Rule Created', description: `"${newRule.name}" is now active.` })
  }

  // Create Promo Code
  const handleCreatePromo = () => {
    if (!promoCodeInput.trim()) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Promo code string is required.' })
      return
    }
    const newPromo: PromoCodeMarketingItem = {
      id: `PRM-${String(promoCodes.length + 1).padStart(3, '0')}`,
      code: promoCodeInput.toUpperCase().trim(),
      discountType: 'percentage',
      discountValue: promoDiscountVal,
      assignedPlan: promoPlan,
      assignedCountry: 'UAE',
      usageLimit: 200,
      usedCount: 0,
      campaignName: 'Direct Marketing Outreach',
      status: 'Active',
      expiresAt: '31 Oct 2026',
    }
    setPromoCodes([newPromo, ...promoCodes])
    setNewPromoModal(false)
    setPromoCodeInput('')
    toast({ variant: 'success', title: 'Promo Code Created', description: `Code "${newPromo.code}" generated.` })
  }

  // Filtered Campaigns
  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = c.name.toLowerCase().includes(q)
        const matchAud = c.audience.toLowerCase().includes(q)
        if (!matchName && !matchAud) return false
      }
      if (channelFilter !== 'All' && c.channel !== channelFilter) return false
      if (statusFilter !== 'All' && c.status !== statusFilter) return false
      return true
    })
  }, [campaigns, searchQuery, channelFilter, statusFilter])

  const totalPages = Math.ceil(filteredCampaigns.length / rowsPerPage) || 1
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <PlatformShell
      title="Marketing Operations"
      eyebrow="Growth Engine"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            TOP HEADER CARD (Canonical Users Design Standard)
           ========================================================================= */}
        {!isBuildingCampaign ? (
          <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[24px] sm:text-[30px] font-bold leading-[32px] sm:leading-[38px] text-[#1f2327]">
                    Marketing Operations & Campaigns
                  </h1>
                  <span className="rounded-[6px] bg-[#eff1f3] px-2.5 py-0.5 text-[11px] font-bold text-[#6f777f] border border-[#d3d5d7]">
                    Growth Engine
                  </span>
                </div>
                <p className="mt-1 text-[14px] leading-[20px] text-[#6f777f]">
                  Manage multi-channel growth campaigns, referral tiers, promo discount codes, and user acquisition funnels.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    exportToCsv(
                      'duseat_marketing_campaigns',
                      ['Campaign ID', 'Name', 'Channel', 'Audience', 'Status', 'Reach', 'CTR %', 'Conversions', 'Revenue (AED)'],
                      campaigns.map((c) => [c.id, c.name, c.channel, c.audience, c.status, c.reach, c.ctr, c.conversions, c.revenueAed])
                    )
                  }}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  <Download className="size-4 text-[#6f777f]" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBuildingCampaign(true)
                    setBuilderStep(1)
                  }}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[14px] font-bold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn"
                >
                  <Plus className="size-4" />
                  <span>Create Campaign</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Metric Cards */}
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
              <MetricCard
                label="Active Campaigns"
                value={campaigns.filter((c) => c.status === 'Running').length}
                trend={{ value: 'Push & Email', isPositive: true }}
                icon={Send}
                tone="info"
              />
              <MetricCard
                label="Total Reach"
                value="42,840"
                trend={{ value: '+18.4% this mo', isPositive: true }}
                icon={Users}
                tone="neutral"
              />
              <MetricCard
                label="Total Conversions"
                value="2,082"
                trend={{ value: 'Qualified leads', isPositive: true }}
                icon={CheckCircle2}
                tone="success"
              />
              <MetricCard
                label="Campaign Revenue"
                value="AED 1.12M"
                trend={{ value: '+24.2% pacing', isPositive: true }}
                icon={DollarSign}
                tone="brand"
              />
            </div>
          </header>
        ) : (
          <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-[#1f2327]">Create Multi-Channel Campaign</h1>
              <p className="text-[13px] text-[#6f777f]">Step {builderStep} of 4 — Target audience & campaign setup</p>
            </div>
            <button
              type="button"
              onClick={() => setIsBuildingCampaign(false)}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4 text-[#6f777f]" />
              <span>Exit Builder</span>
            </button>
          </header>
        )}

        {/* ==========================================
            MARKETING SUB-NAVIGATION TABS
        ========================================== */}
        {!isBuildingCampaign && (
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 border-b border-[#d3d5d7] pb-3">
            <ScrollableTabsBar className="flex-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3, count: undefined },
                { id: 'campaigns', label: 'Campaigns', icon: Send, count: campaigns.length },
                { id: 'referrals', label: 'Referral Program', icon: Share2, count: referralRules.length },
                { id: 'promos', label: 'Promo Codes', icon: Tag, count: promoCodes.length },
                { id: 'featured', label: 'Featured Spotlight', icon: Star, count: featuredListings.length },
                { id: 'landing-pages', label: 'Landing Pages', icon: Globe, count: landingPages.length },
                { id: 'analytics', label: 'Marketing Funnel', icon: Flame, count: undefined },
                { id: 'calendar', label: 'Marketing Calendar', icon: CalendarIcon, count: undefined },
                { id: 'history', label: 'Audit Log', icon: History, count: auditLogs.length },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(e) => {
                      setActiveTab(tab.id as MarketingTab)
                      setCurrentPage(1)
                      if (typeof window !== 'undefined') {
                        const newUrl = tab.id === 'overview' ? '/marketing' : `/marketing?tab=${tab.id}`
                        window.history.replaceState(null, '', newUrl)
                      }
                      try {
                        ;(e.currentTarget as HTMLElement).scrollIntoView({
                          behavior: 'smooth',
                          inline: 'nearest',
                          block: 'nearest',
                        })
                      } catch {
                        // ignore if unsupported
                      }
                    }}
                    className={cn(
                      'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[13px] sm:text-[14px] leading-[20px] font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap',
                      isActive
                        ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                        : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                          isActive ? 'bg-white/25 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </ScrollableTabsBar>

            <div className="flex items-center gap-2 text-[12px] text-[#6f777f] shrink-0 whitespace-nowrap self-start xl:self-auto bg-white px-2.5 py-1.5 rounded-[8px] border border-[#d3d5d7] shadow-2xs">
              <Clock className="size-3.5 text-[#00c2cb]" />
              <span>Attribution window: <strong className="text-[#1f2327]">30 Days (Last-Touch)</strong></span>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 1: MARKETING OVERVIEW / COMMAND CENTER (Spec 14.1)
           ========================================================================= */}
        {activeTab === 'overview' && !isBuildingCampaign && (
          <div className="space-y-6 ant-fade-in">
            {/* Top KPIs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              <MetricCard
                label="Active Campaigns"
                value={campaigns.filter((c) => c.status === 'Running').length}
                trend={{ value: 'Push & Email', isPositive: true }}
                icon={Send}
                tone="brand"
              />
              <MetricCard
                label="Total Reach"
                value="42,840"
                trend={{ value: '+18.4% this mo', isPositive: true }}
                icon={Users}
                tone="neutral"
              />
              <MetricCard
                label="Total Conversions"
                value="2,082"
                trend={{ value: 'Qualified leads', isPositive: true }}
                icon={Target}
                tone="success"
              />
              <MetricCard
                label="Avg Conversion"
                value="4.86%"
                trend={{ value: '+0.8% benchmark', isPositive: true }}
                icon={TrendingUp}
                tone="warning"
              />
              <MetricCard
                label="Referral Revenue"
                value="AED 960k"
                trend={{ value: '112 invites', isPositive: true }}
                icon={Gift}
                tone="neutral"
              />
              <MetricCard
                label="Marketing Gross"
                value="AED 1.84M"
                trend={{ value: '18.2x ROI', isPositive: true }}
                icon={DollarSign}
                tone="brand"
              />
            </div>

            {/* Performance Chart & Active Campaigns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left 2 Cols: Performance Matrix */}
              <div className="lg:col-span-2 rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1f2327]">Marketing Performance Trends</h3>
                    <p className="text-[12px] text-[#6f777f]">Aggregated multi-channel conversions, reach velocity, and generated revenue.</p>
                  </div>
                  <span className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[11px] font-bold text-[#00c2cb]">
                    Last 30 Days
                  </span>
                </div>

                {/* Recharts Channel Revenue Bar Visualization */}
                <div className="h-[175px] w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Mobile Push', rev: 482, conv: 384 },
                        { name: 'Email VIP', rev: 184, conv: 184 },
                        { name: 'In-App Prompts', rev: 394, conv: 1420 },
                        { name: 'Broker Referrals', rev: 960, conv: 112 },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f4" vertical={false} />
                      <XAxis dataKey="name" stroke="#6f777f" fontSize={11} tickLine={false} axisLine={{ stroke: '#eef0f2' }} />
                      <YAxis stroke="#6f777f" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2327',
                          borderRadius: 8,
                          border: 'none',
                          color: '#fff',
                          fontSize: 12,
                        }}
                        formatter={(value: any, name: any) => [
                          name === 'rev' ? `AED ${value}k` : `${value} leads`,
                          name === 'rev' ? 'Revenue' : 'Conversions',
                        ]}
                      />
                      <Bar dataKey="rev" fill="#00c2cb" radius={[4, 4, 0, 0]} name="rev" maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Performance Channel Breakdown Bars */}
                <div className="space-y-3 pt-2 border-t border-[#f0f2f4]">
                  {[
                    { channel: 'Mobile Push Notifications', reach: '14,820', ctr: '8.4%', conv: '384', rev: 'AED 482,000', pct: 85 },
                    { channel: 'Email VIP Newsletters', reach: '3,420', ctr: '14.6%', conv: '184', rev: 'AED 184,000', pct: 60 },
                    { channel: 'In-App KYC & Deal Prompts', reach: '4,210', ctr: '32.4%', conv: '1,420', rev: 'AED 394,000', pct: 75 },
                    { channel: 'Broker Peer Referrals', reach: '840', ctr: '45.2%', conv: '112', rev: 'AED 960,000', pct: 95 },
                  ].map((row, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[12.5px]">
                        <span className="font-bold text-[#1f2327]">{row.channel}</span>
                        <div className="flex items-center gap-4 text-[12px]">
                          <span className="text-[#6f777f]">CTR: <strong className="text-[#1f2327]">{row.ctr}</strong></span>
                          <span className="text-[#6f777f]">Conv: <strong className="text-[#1f2327]">{row.conv}</strong></span>
                          <span className="font-bold text-[#00c2cb]">{row.rev}</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-[#eef0f2] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#00c2cb] to-[#009da4]"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Top Referrers Spotlight */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                  <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-1.5">
                    <Award className="size-4 text-[#00c2cb]" /> Top Growth Referrers
                  </h3>
                  <button onClick={() => setActiveTab('referrals')} className="text-[11px] font-bold text-[#00c2cb] hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {topReferrers.slice(0, 4).map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between rounded-[8px] border border-[#eef0f2] p-2.5 text-[12px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#00c2cb]/10 font-bold text-[#00c2cb] text-[11px]">
                          #{ref.rank}
                        </div>
                        <div>
                          <div className="font-bold text-[#1f2327]">{ref.name}</div>
                          <div className="text-[10.5px] text-[#6f777f]">{ref.agencyOrCity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#10b981]">{ref.revenueGeneratedAed > 0 ? `AED ${(ref.revenueGeneratedAed / 1000).toFixed(0)}k` : 'Active'}</div>
                        <div className="text-[10px] text-[#6f777f]">{ref.successfulReferrals} converted</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: CAMPAIGNS MANAGEMENT (Spec 14.2)
           ========================================================================= */}
        {activeTab === 'campaigns' && !isBuildingCampaign && (
            <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              {/* Top Status Tabs & Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'All', label: 'All campaigns' },
                      { id: 'Running', label: 'Running' },
                      { id: 'Scheduled', label: 'Scheduled' },
                      { id: 'Completed', label: 'Completed' },
                      { id: 'Draft', label: 'Draft' },
                      { id: 'Paused', label: 'Paused' },
                    ] as const
                  ).map((item) => {
                    const isActive = statusFilter === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStatusFilter(item.id)}
                        className={cn(
                          'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn',
                          isActive
                            ? 'bg-[#1f2327] text-white shadow-2xs'
                            : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                        )}
                      >
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <MainButton
                    variant="Secondary"
                    size="sm"
                    iconLeft={<Download className="size-3.5" />}
                    label="Export CSV"
                    onClick={() => {
                      exportToCsv(
                        'duseat_marketing_campaigns',
                        ['Campaign ID', 'Name', 'Channel', 'Audience', 'Status', 'Reach', 'CTR %', 'Conversions', 'Revenue (AED)'],
                        filteredCampaigns.map((c) => [c.id, c.name, c.channel, c.audience, c.status, c.reach, c.ctr, c.conversions, c.revenueAed])
                      )
                    }}
                  />
                  <MainButton
                    variant="Primary"
                    size="sm"
                    iconLeft={<Plus className="size-3.5" />}
                    label="Create Campaign"
                    onClick={() => setIsBuildingCampaign(true)}
                  />
                </div>
              </div>

              {/* Horizontal Filters Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 p-4 sm:p-5 pb-3">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search campaigns by title or target audience..."
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

                {/* Channel Filter */}
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Channels</option>
                  <option value="Push">Mobile Push</option>
                  <option value="Email">Email Newsletter</option>
                  <option value="In-App">In-App Prompt</option>
                </select>

                {/* Reset Filters Link */}
                {(searchQuery || channelFilter !== 'All' || statusFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setChannelFilter('All')
                      setStatusFilter('All')
                    }}
                    className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>

                  {/* Campaigns Table */}
                  <div className="overflow-x-auto table-scrollbar">
                    <table className="w-full text-left text-[14px] border-collapse font-sans">
                      <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                        <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                          <th className="w-12 px-4 text-center">
                            <TableCheckbox
                              checked={
                                paginatedCampaigns.length > 0 &&
                                paginatedCampaigns.every((c) => selectedIds.includes(c.id))
                              }
                              onChange={(checked) => {
                                if (checked) {
                                  setSelectedIds(Array.from(new Set([...selectedIds, ...paginatedCampaigns.map((c) => c.id)])))
                                } else {
                                  setSelectedIds(selectedIds.filter((id) => !paginatedCampaigns.some((c) => c.id === id)))
                                }
                              }}
                            />
                          </th>
                          <th className="px-4">Campaign & Channel</th>
                          <th className="px-4">Target Audience</th>
                          <th className="px-4">Reach & CTR</th>
                          <th className="px-4">Conversions</th>
                          <th className="px-4">Revenue Generated</th>
                          <th className="px-4">Status</th>
                          <th className="px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d3d5d7]">
                        {paginatedCampaigns.map((cmp) => {
                          const isSelected = selectedIds.includes(cmp.id)
                          return (
                            <tr
                              key={cmp.id}
                              className={cn(
                                'h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa]',
                                isSelected && 'bg-[#e5f6f7]/40'
                              )}
                            >
                              <td className="w-12 px-4 text-center">
                                <TableCheckbox
                                  checked={isSelected}
                                  onChange={(checked) => {
                                    if (checked) {
                                      setSelectedIds([...selectedIds, cmp.id])
                                    } else {
                                      setSelectedIds(selectedIds.filter((id) => id !== cmp.id))
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 font-semibold text-[14px] text-[#1f2327]">
                                    {cmp.channel === 'Push' ? (
                                      <Smartphone className="size-3.5 text-[#00c2cb]" />
                                    ) : cmp.channel === 'Email' ? (
                                      <Mail className="size-3.5 text-[#3b82f6]" />
                                    ) : (
                                      <Zap className="size-3.5 text-[#8b5cf6]" />
                                    )}
                                    <span>{cmp.name}</span>
                                  </div>
                                  <p className="text-[12px] text-[#6f777f] line-clamp-1 max-w-sm">{cmp.description}</p>
                                </div>
                              </td>
                              <td className="px-4">
                                <span className="rounded bg-[#f4f5f6] px-2 py-0.5 text-[11px] font-semibold text-[#1f2327]">
                                  {cmp.audience}
                                </span>
                              </td>
                              <td className="px-4 text-[#4b5563]">
                                <div className="text-[13px]"><strong>{cmp.reach.toLocaleString()}</strong> users</div>
                                <div className="text-[11px] text-[#008f95] font-bold">CTR: {cmp.ctr}%</div>
                              </td>
                              <td className="px-4">
                                <div className="font-semibold text-[13px] text-[#1f2327]">{cmp.conversions} leads</div>
                                <div className="text-[11px] text-[#6f777f]">{cmp.conversionRate}% rate</div>
                              </td>
                              <td className="px-4 font-semibold text-[#00c2cb] text-[13px]">
                                {cmp.revenueAed > 0 ? `AED ${cmp.revenueAed.toLocaleString()}` : '—'}
                              </td>
                              <td className="px-4">
                                <FigmaStatusBadge
                                  status={
                                    cmp.status === 'Running'
                                      ? 'Completed'
                                      : cmp.status === 'Scheduled'
                                      ? 'In progress'
                                      : cmp.status === 'Paused'
                                      ? 'Pending'
                                      : 'Cancelled'
                                  }
                                />
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleToggleCampaignPause(cmp)}
                                    className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                    title={cmp.status === 'Running' ? 'Pause Campaign' : 'Resume Campaign'}
                                  >
                                    {cmp.status === 'Running' ? <Pause className="size-4" /> : <Play className="size-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateCampaign(cmp)}
                                    className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                    title="Duplicate"
                                  >
                                    <Copy className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmItem({ type: 'campaign', id: cmp.id, name: cmp.name })}
                                    className="rounded-[6px] p-1.5 text-[#dc2626] hover:bg-[#fef2f2]"
                                    title="Delete"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Pagination */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d3d5d7] px-4 py-3">
                    <div className="text-[12px] text-[#6f777f]">
                      Showing <strong className="text-[#1f2327]">{filteredCampaigns.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</strong> to{' '}
                      <strong className="text-[#1f2327]">{Math.min(currentPage * rowsPerPage, filteredCampaigns.length)}</strong> of{' '}
                      <strong className="text-[#1f2327]">{filteredCampaigns.length}</strong> campaigns
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredCampaigns.length}
                      rowsPerPage={rowsPerPage}
                      onPageChange={setCurrentPage}
                      onRowsPerPageChange={setRowsPerPage}
                    />
                  </div>
                </section>
              )}

        {/* =========================================================================
            SECTION 3: 8-STEP CAMPAIGN BUILDER (Spec 14.3 - 14.11)
           ========================================================================= */}
        {isBuildingCampaign && (
          <div className="space-y-5 ant-fade-in">
            {/* Step Progress Header */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Create Multi-Channel Marketing Campaign</h3>
                  <p className="text-[12px] text-[#6f777f]">Step {builderStep} of 8: Configure targeting, content, and launch parameters.</p>
                </div>
                <div className="flex items-center gap-2">
                  {builderStep > 1 && (
                    <MainButton
                      variant="Secondary"
                      size="sm"
                      iconLeft={<ChevronLeft className="size-3.5" />}
                      label="Previous Step"
                      onClick={() => setBuilderStep((prev) => Math.max(1, prev - 1))}
                    />
                  )}
                  {builderStep < 8 ? (
                    <MainButton
                      variant="Primary"
                      size="sm"
                      iconRight={<ChevronRight className="size-3.5" />}
                      label="Next Step"
                      onClick={() => setBuilderStep((prev) => Math.min(8, prev + 1))}
                    />
                  ) : (
                    <MainButton
                      variant="Primary"
                      size="sm"
                      iconLeft={isLaunching ? <RefreshCw className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                      label={isLaunching ? 'Launching...' : 'Launch Campaign'}
                      disabled={isLaunching}
                      onClick={handleLaunchCampaign}
                    />
                  )}
                </div>
              </div>

              {/* Step Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                {[
                  '1. Info',
                  '2. Audience',
                  '3. Channel',
                  '4. Content',
                  '5. CTA & Destination',
                  '6. Schedule',
                  '7. Tracking (UTM)',
                  '8. Review & Launch',
                ].map((stepLabel, idx) => {
                  const stepNum = idx + 1
                  const isCurrent = builderStep === stepNum
                  const isPast = builderStep > stepNum
                  return (
                    <button
                      key={stepNum}
                      onClick={() => setBuilderStep(stepNum)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer',
                        isCurrent
                          ? 'bg-[#00c2cb] text-white shadow-2xs'
                          : isPast
                          ? 'bg-[#e6f9fa] text-[#008f95]'
                          : 'bg-[#f4f5f6] text-[#6f777f]'
                      )}
                    >
                      {isPast ? <Check className="size-3" /> : null}
                      <span>{stepLabel}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Form Fields (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {builderStep === 1 && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3 ant-fade-in">
                    <h4 className="text-[14px] font-bold text-[#1f2327]">1. Campaign Information</h4>
                    <div>
                      <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Campaign Name *</label>
                      <input
                        type="text"
                        value={builderName}
                        onChange={(e) => setBuilderName(e.target.value)}
                        placeholder="e.g. Autumn 2026 Dubai Investor Push"
                        className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6f777f] mb-1">Description & Objective</label>
                      <textarea
                        rows={3}
                        value={builderDesc}
                        onChange={(e) => setBuilderDesc(e.target.value)}
                        placeholder="Explain the growth or activation goal..."
                        className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                      />
                    </div>
                  </div>
                )}

                {builderStep === 2 && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 ant-fade-in">
                    <h4 className="text-[14px] font-bold text-[#1f2327]">2. Audience Targeting</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Verified Investors',
                        'Licensed Agents',
                        'All Users',
                        'Saudi Arabia Gulf HNW',
                        'Unverified Users (0-7 Days)',
                        'Power Agent Subscribers',
                      ].map((aud) => (
                        <button
                          key={aud}
                          type="button"
                          onClick={() => setBuilderAudience(aud)}
                          className={cn(
                            'p-3 rounded-[8px] border text-left text-[12px] font-bold transition-all cursor-pointer',
                            builderAudience === aud
                              ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb]'
                              : 'border-[#d3d5d7] bg-white text-[#4b5563] hover:border-[#00c2cb]'
                          )}
                        >
                          {aud}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-[8px] bg-[#f4f5f6] p-3 text-[12px] text-[#4b5563] flex items-center justify-between">
                      <span>Estimated Eligible Reach:</span>
                      <strong className="text-[14px] text-[#1f2327]">14,820 active profiles</strong>
                    </div>
                  </div>
                )}

                {builderStep === 3 && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 ant-fade-in">
                    <h4 className="text-[14px] font-bold text-[#1f2327]">3. Delivery Channel</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { ch: 'Push', label: 'Mobile Push', icon: Smartphone, desc: 'Instant iOS & Android alerts' },
                        { ch: 'Email', label: 'Email Broadcast', icon: Mail, desc: 'Rich newsletters & digests' },
                        { ch: 'In-App', label: 'In-App Prompt', icon: Zap, desc: 'Modal popups & banners' },
                      ].map((c) => {
                        const Icon = c.icon
                        const isSel = builderChannel === c.ch
                        return (
                          <button
                            key={c.ch}
                            type="button"
                            onClick={() => setBuilderChannel(c.ch as CampaignChannel)}
                            className={cn(
                              'p-3.5 rounded-[10px] border text-left space-y-1 transition-all cursor-pointer',
                              isSel ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb]' : 'border-[#d3d5d7] bg-white text-[#4b5563]'
                            )}
                          >
                            <Icon className="size-5 mb-1 text-[#00c2cb]" />
                            <div className="font-bold text-[13px]">{c.label}</div>
                            <div className="text-[10.5px] text-[#6f777f]">{c.desc}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {builderStep === 4 && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3 ant-fade-in">
                    <h4 className="text-[14px] font-bold text-[#1f2327]">4. Campaign Message & Copy</h4>
                    {builderChannel === 'Push' && (
                      <>
                        <div>
                          <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Push Title</label>
                          <input
                            type="text"
                            value={builderPushTitle}
                            onChange={(e) => setBuilderPushTitle(e.target.value)}
                            className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Push Body Message</label>
                          <textarea
                            rows={3}
                            value={builderPushMessage}
                            onChange={(e) => setBuilderPushMessage(e.target.value)}
                            className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                          />
                        </div>
                      </>
                    )}
                    {builderChannel === 'Email' && (
                      <>
                        <div>
                          <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Email Subject Line</label>
                          <input
                            type="text"
                            value={builderEmailSubject}
                            onChange={(e) => setBuilderEmailSubject(e.target.value)}
                            className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {builderStep >= 5 && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 ant-fade-in">
                    <h4 className="text-[14px] font-bold text-[#1f2327]">Launch Checklist & Confirmation</h4>
                    <div className="space-y-2 text-[12.5px]">
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <CheckCircle2 className="size-4 shrink-0" /> Target Audience validated ({builderAudience})
                      </div>
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <CheckCircle2 className="size-4 shrink-0" /> Deep link route active ({builderCtaDest})
                      </div>
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <CheckCircle2 className="size-4 shrink-0" /> Fastly CDN caching rules prepared
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Interactive Device Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3 sticky top-4">
                  <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5 border-b border-[#eef0f2] pb-2">
                    <Eye className="size-4 text-[#00c2cb]" /> Live Channel Preview ({builderChannel})
                  </span>

                  {builderChannel === 'Push' && (
                    <div className="rounded-[14px] bg-[#1f2327] p-4 text-white space-y-2 shadow-lg max-w-[320px] mx-auto">
                      <div className="flex items-center justify-between text-[11px] text-[#9ca3af]">
                        <span className="font-bold flex items-center gap-1 text-[#00c2cb]">
                          <Smartphone className="size-3" /> DUSEAT
                        </span>
                        <span>now</span>
                      </div>
                      <div className="font-bold text-[13px]">{builderPushTitle}</div>
                      <div className="text-[11.5px] text-[#d1d5db] leading-relaxed">{builderPushMessage}</div>
                    </div>
                  )}

                  {builderChannel === 'Email' && (
                    <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2 text-left">
                      <span className="text-[11px] text-[#6f777f]">From: partnerships@duseat.ae</span>
                      <h5 className="font-bold text-[14px] text-[#1f2327]">{builderEmailSubject}</h5>
                      <p className="text-[12px] text-[#4b5563]">Exclusive high-net-worth real estate allocations.</p>
                      <button className="rounded bg-[#00c2cb] px-3 py-1.5 text-[11px] font-bold text-white">
                        {builderCtaText}
                      </button>
                    </div>
                  )}

                  {builderChannel === 'In-App' && (
                    <div className="rounded-[12px] border-2 border-[#00c2cb] bg-[#e6f9fa] p-4 space-y-2 text-center">
                      <Sparkles className="size-6 text-[#00c2cb] mx-auto" />
                      <h5 className="font-bold text-[14px] text-[#1f2327]">Exclusive Member Update</h5>
                      <p className="text-[12px] text-[#4b5563]">Discover off-market villas and direct seller proposals.</p>
                      <button className="rounded bg-[#00c2cb] px-4 py-1.5 text-[11px] font-bold text-white">
                        {builderCtaText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: REFERRAL PROGRAM (Spec 14.13 - 14.16)
           ========================================================================= */}
        {activeTab === 'referrals' && !isBuildingCampaign && (
          <div className="space-y-6 ant-fade-in">
            {/* Referral KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Invites Dispatched', value: '1,840', sub: 'Via personalized links' },
                { label: 'Successful KYC Conversions', value: '412', sub: '22.4% conversion pace' },
                { label: 'Referral Rewards Issued', value: 'AED 114,500', sub: 'Cash & wallet credits' },
                { label: 'Referral Generated Revenue', value: 'AED 1,180,000', sub: 'From closed deals' },
                { label: 'Net Referral ROI', value: '10.3x', sub: 'Clean profit contribution' },
              ].map((kpi, idx) => (
                <div key={idx} className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-1">
                  <span className="text-[11.5px] font-semibold text-[#6f777f]">{kpi.label}</span>
                  <div className="text-[20px] font-bold text-[#1f2327]">{kpi.value}</div>
                  <p className="text-[10.5px] text-[#008f95] font-semibold">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Referral Rules & Top Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Col: Reward Rules */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                  <h3 className="text-[14px] font-bold text-[#1f2327]">Referral Reward Rules</h3>
                  <MainButton
                    variant="Primary"
                    size="sm"
                    label="+ New Rule"
                    onClick={() => setNewRuleModal(true)}
                  />
                </div>

                <div className="space-y-3">
                  {referralRules.map((rule) => (
                    <div key={rule.id} className="rounded-[8px] border border-[#eef0f2] p-3 text-[12px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1f2327]">{rule.name}</span>
                        <FigmaStatusBadge status={rule.status === 'Active' ? 'Completed' : 'Pending'} />
                      </div>
                      <div className="text-[#6f777f]">Trigger: <strong>{rule.trigger}</strong></div>
                      <div className="text-[#00c2cb] font-bold">Reward: {rule.rewardValue}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 2 Cols: Top Referrers Leaderboard */}
              <div className="lg:col-span-2 rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1f2327]">Top Referrers Leaderboard</h3>
                    <p className="text-[12px] text-[#6f777f]">Brokers and investors driving peer platform acquisition.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#d3d5d7] bg-[#f8f9fa] text-[11px] font-bold uppercase text-[#6f777f]">
                        <th className="py-2.5 px-3">Rank & Member</th>
                        <th className="py-2.5 px-3">Invites</th>
                        <th className="py-2.5 px-3">Converted</th>
                        <th className="py-2.5 px-3">Conv %</th>
                        <th className="py-2.5 px-3">Rewards</th>
                        <th className="py-2.5 px-3 text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef0f2]">
                      {topReferrers.map((r) => (
                        <tr key={r.id} className="hover:bg-[#fafbfc]">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="flex size-6 items-center justify-center rounded-full bg-[#00c2cb]/10 font-bold text-[#00c2cb] text-[11px]">
                                #{r.rank}
                              </span>
                              <div>
                                <div className="font-bold text-[#1f2327]">{r.name}</div>
                                <div className="text-[10.5px] text-[#6f777f]">{r.agencyOrCity}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">{r.totalInvites}</td>
                          <td className="py-2.5 px-3 font-bold text-[#1f2327]">{r.successfulReferrals}</td>
                          <td className="py-2.5 px-3 text-[#008f95] font-semibold">{r.conversionRate}%</td>
                          <td className="py-2.5 px-3 text-[#6f777f]">AED {r.totalRewardsAed.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#00c2cb]">
                            AED {r.revenueGeneratedAed.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: PROMO CODES (Spec 14.17)
           ========================================================================= */}
        {activeTab === 'promos' && !isBuildingCampaign && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Promotional Coupons & Plan Discounts</h3>
                <p className="text-[12px] text-[#6f777f]">Integrated with Subscriptions engine to track campaign redemption rates.</p>
              </div>
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Plus className="size-3.5" />}
                label="+ Create Promo Code"
                onClick={() => setNewPromoModal(true)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {promoCodes.map((promo) => (
                <div key={promo.id} className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-[6px] border border-[#00c2cb]/30 bg-[#e6f9fa] px-2.5 py-1 text-[13px] font-mono font-bold text-[#008f95]">
                      {promo.code}
                    </span>
                    <FigmaStatusBadge status="Completed" />
                  </div>
                  <div className="space-y-1 text-[12.5px]">
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Discount:</span>
                      <strong className="text-[#1f2327]">{promo.discountValue}</strong>
                    </div>
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Assigned Plan:</span>
                      <strong className="text-[#1f2327]">{promo.assignedPlan}</strong>
                    </div>
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Usage:</span>
                      <strong className="text-[#00c2cb]">{promo.usedCount} / {promo.usageLimit} redeemed</strong>
                    </div>
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Expires:</span>
                      <span>{promo.expiresAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 6: FEATURED SPOTLIGHT LISTINGS (Spec 14.18)
           ========================================================================= */}
        {activeTab === 'featured' && !isBuildingCampaign && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Featured Spotlights & Verified Allocations</h3>
                <p className="text-[12px] text-[#6f777f]">Top carousel and search priority placements for agents and developer towers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredListings.map((feat) => (
                <div key={feat.id} className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#00c2cb]">
                      Priority #{feat.priority} • {feat.entityType}
                    </span>
                    <FigmaStatusBadge status="Completed" />
                  </div>
                  <h4 className="text-[14px] font-bold text-[#1f2327]">{feat.entityName}</h4>
                  <div className="text-[12px] text-[#6f777f] space-y-1 border-t border-[#f0f2f5] pt-2">
                    <div>Placement: <strong>{feat.placement}</strong></div>
                    <div>Impressions: <strong>{feat.impressions.toLocaleString()}</strong> ({feat.ctr}% CTR)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 7: MARKETING FUNNEL & ATTRIBUTION (Spec 14.22 - 14.26)
           ========================================================================= */}
        {activeTab === 'analytics' && !isBuildingCampaign && (
          <div className="space-y-6 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1f2327]">8-Stage Marketing Conversion Funnel</h3>
                  <p className="text-[12px] text-[#6f777f]">From initial push/email impression through to closed deal and realized revenue.</p>
                </div>
              </div>

              {/* 8 Stages */}
              <div className="space-y-2.5 pt-2">
                {[
                  { stage: '1. Total Audience Reach', count: '42,840 users', pct: 100 },
                  { stage: '2. Message Impressions', count: '31,780 views', pct: 74.2 },
                  { stage: '3. CTA Clicks / App Opens', count: '14,050 clicks', pct: 32.8 },
                  { stage: '4. Landing Page Visits', count: '12,170 sessions', pct: 28.4 },
                  { stage: '5. New Registrations', count: '6,940 users', pct: 16.2 },
                  { stage: '6. KYC Verified Profiles', count: '5,310 verified', pct: 12.4 },
                  { stage: '7. Subscribed / Offer Placed', count: '3,470 actions', pct: 8.1 },
                  { stage: '8. Realized Platform Revenue', count: 'AED 1,840,000', pct: 5.2 },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[12px] font-semibold text-[#1f2327]">
                      <span>{s.stage}</span>
                      <span className="font-bold text-[#00c2cb]">{s.count} ({s.pct}%)</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-[#f4f5f6] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00c2cb] to-[#008f95] transition-all duration-500"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 8: MARKETING CALENDAR (Spec 14.27)
           ========================================================================= */}
        {activeTab === 'calendar' && !isBuildingCampaign && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 ant-fade-in">
            <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
              <div>
                <h3 className="text-[15px] font-bold text-[#1f2327]">Marketing Dispatch Calendar (September 2026)</h3>
                <p className="text-[12px] text-[#6f777f]">Scheduled campaigns, promo expiration windows, and featured listing cycles.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { date: '01 Sep 2026', title: 'Summer Investor Push Launch', type: 'Push Campaign', status: 'Running' },
                { date: '05 Sep 2026', title: 'Power Agent 20% Discount Email', type: 'Email Campaign', status: 'Running' },
                { date: '15 Sep 2026', title: 'Autumn Luxury Showcase', type: 'Landing Page', status: 'Scheduled' },
                { date: '18 Sep 2026', title: 'Cityscape Riyadh Expo Blast', type: 'Push Campaign', status: 'Scheduled' },
                { date: '20 Sep 2026', title: 'POWER20 Promo Code Expiration', type: 'Promo Code', status: 'Active' },
                { date: '30 Sep 2026', title: 'Q3 Growth Wrap & Monthly Digest', type: 'Email Campaign', status: 'Scheduled' },
              ].map((ev, idx) => (
                <div key={idx} className="rounded-[8px] border border-[#eef0f2] p-3.5 space-y-1.5 bg-[#fafbfc]">
                  <span className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[10.5px] font-bold text-[#00c2cb]">
                    {ev.date}
                  </span>
                  <h4 className="text-[13px] font-bold text-[#1f2327]">{ev.title}</h4>
                  <div className="flex justify-between text-[11px] text-[#6f777f] pt-1 border-t border-[#eef0f2]">
                    <span>{ev.type}</span>
                    <strong className="text-[#1f2327]">{ev.status}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 9: AUDIT LOG (Spec 14.33)
           ========================================================================= */}
        {activeTab === 'history' && !isBuildingCampaign && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 ant-fade-in">
            <h3 className="text-[15px] font-bold text-[#1f2327]">Marketing Action & Campaign Audit Trail</h3>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between rounded-[8px] border border-[#eef0f2] p-3 text-[12px]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-[4px] bg-[#00c2cb]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#00c2cb]">
                        {log.action}
                      </span>
                      <strong className="text-[#1f2327]">{log.entityName}</strong>
                      <span className="text-[#9ca3af]">({log.entityType})</span>
                    </div>
                    <p className="text-[#6f777f]">{log.details}</p>
                  </div>
                  <span className="text-[11px] text-[#9ca3af]">{log.date} at {log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            MODALS: NEW RULE, PROMO, DELETE
        ========================================== */}
        {/* New Rule Modal */}
        {newRuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Add Referral Reward Rule</h3>
                <button onClick={() => setNewRuleModal(false)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Rule Name</label>
                  <input
                    type="text"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="e.g. Verified Broker Bonus"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Trigger Event</label>
                  <select
                    value={ruleTrigger}
                    onChange={(e) => setRuleTrigger(e.target.value as typeof ruleTrigger)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="User KYC Verified">User KYC Verified</option>
                    <option value="First Request Created">First Request Created</option>
                    <option value="Subscription Purchased">Subscription Purchased</option>
                    <option value="Deal Completed">Deal Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Reward Value</label>
                  <input
                    type="text"
                    value={ruleValue}
                    onChange={(e) => setRuleValue(e.target.value)}
                    placeholder="e.g. AED 500 Credit"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setNewRuleModal(false)} />
                <MainButton variant="Primary" size="sm" label="Save Rule" onClick={handleCreateRule} />
              </div>
            </div>
          </div>
        )}

        {/* New Promo Modal */}
        {newPromoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Create Campaign Promo Code</h3>
                <button onClick={() => setNewPromoModal(false)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Promo Code String</label>
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="e.g. AUTUMN25"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb] font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Discount Value</label>
                  <input
                    type="text"
                    value={promoDiscountVal}
                    onChange={(e) => setPromoDiscountVal(e.target.value)}
                    placeholder="e.g. 25% OFF"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Assigned Plan</label>
                  <select
                    value={promoPlan}
                    onChange={(e) => setPromoPlan(e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="Power Agent">Power Agent</option>
                    <option value="Elite">Elite Plan</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="All Plans">All Plans</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setNewPromoModal(false)} />
                <MainButton variant="Primary" size="sm" label="Create Code" onClick={handleCreatePromo} />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626]">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1f2327]">Delete {deleteConfirmItem.type}?</h3>
                  <p className="text-[12px] text-[#6f777f]">This action will remove "{deleteConfirmItem.name}".</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setDeleteConfirmItem(null)} />
                <MainButton
                  variant="Primary"
                  size="sm"
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                  label="Delete"
                  onClick={() => {
                    setCampaigns((prev) => prev.filter((c) => c.id !== deleteConfirmItem.id))
                    setDeleteConfirmItem(null)
                    toast({ variant: 'success', title: 'Deleted', description: 'Item removed.' })
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}

export function MarketingManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={<div className="p-8 text-center text-[#6f777f]">Loading Marketing Operations...</div>}>
        <MarketingManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
