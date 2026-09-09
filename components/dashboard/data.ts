import type { LucideIcon } from 'lucide-react'
import {
  Users,
  UserRoundCheck,
  BadgeCheck,
  Wallet,
  FileText,
  Handshake,
  ScrollText,
  CircleCheckBig,
  Activity as ActivityIcon,
  Flag,
  ShieldAlert,
  CreditCard,
  UserPlus,
  ShieldCheck,
  Clock,
  Ban,
  TrendingUp,
  DollarSign,
  CalendarDays,
  AlertTriangle,
  UserCheck,
} from 'lucide-react'

export type Trend = 'up' | 'down'

export interface SupportingMetric {
  label: string
  value: string
  delta?: string
  trend?: Trend
}

export interface KpiCard {
  id: string
  title: string
  category: 'users' | 'marketplace' | 'finance' | 'operations'
  icon: LucideIcon
  value: string
  growth: string
  trend: Trend
  href: string
  spark: number[]
  supporting: SupportingMetric[]
}

const s = (arr: number[]) => arr

// 19 Complete KPI Cards as requested
export const allKpiCards: KpiCard[] = [
  // User Ecosystem (8 Cards)
  {
    id: 'total-users',
    title: 'Total Users',
    category: 'users',
    icon: Users,
    value: '12,846',
    growth: '+12.4%',
    trend: 'up',
    href: '/all-tools',
    spark: s([32, 40, 38, 52, 49, 66, 61, 78, 74, 90]),
    supporting: [
      { label: 'Investors', value: '10,240', delta: '79.7%', trend: 'up' },
      { label: 'Agents', value: '2,606', delta: '20.3%', trend: 'up' },
    ],
  },
  {
    id: 'total-investors',
    title: 'Total Investors',
    category: 'users',
    icon: UserRoundCheck,
    value: '10,240',
    growth: '+10.8%',
    trend: 'up',
    href: '/investors',
    spark: s([20, 28, 26, 34, 40, 38, 48, 55, 60, 72]),
    supporting: [
      { label: 'Verified', value: '8,430', delta: '82.3%', trend: 'up' },
      { label: 'Active', value: '6,120', delta: '14.8%', trend: 'up' },
    ],
  },
  {
    id: 'total-agents',
    title: 'Total Agents',
    category: 'users',
    icon: BadgeCheck,
    value: '2,606',
    growth: '+8.6%',
    trend: 'up',
    href: '/agents',
    spark: s([44, 40, 46, 42, 50, 48, 56, 54, 62, 68]),
    supporting: [
      { label: 'Pro & Elite', value: '1,842', delta: '70.7%', trend: 'up' },
      { label: 'Licensed RERA', value: '2,480', delta: '95.2%', trend: 'up' },
    ],
  },
  {
    id: 'online-users',
    title: 'Online Users',
    category: 'users',
    icon: ActivityIcon,
    value: '482',
    growth: '+18.5%',
    trend: 'up',
    href: '/investors',
    spark: s([40, 52, 48, 60, 58, 72, 68, 80, 76, 88]),
    supporting: [
      { label: 'Active Now', value: '482', delta: 'Peak today', trend: 'up' },
      { label: 'Avg Time', value: '24m 12s', delta: '+3m', trend: 'up' },
    ],
  },
  {
    id: 'active-users-today',
    title: 'Active Users Today',
    category: 'users',
    icon: UserCheck,
    value: '3,420',
    growth: '+14.2%',
    trend: 'up',
    href: '/investors',
    spark: s([28, 35, 42, 50, 65, 70, 78, 85, 90, 96]),
    supporting: [
      { label: 'Unique Logins', value: '3,420', delta: '+412', trend: 'up' },
      { label: 'Mobile Sessions', value: '68%', delta: '+4.2%', trend: 'up' },
    ],
  },
  {
    id: 'new-registrations-today',
    title: 'New Registrations Today',
    category: 'users',
    icon: UserPlus,
    value: '84',
    growth: '+22.6%',
    trend: 'up',
    href: '/investors',
    spark: s([12, 18, 15, 24, 30, 28, 45, 52, 68, 84]),
    supporting: [
      { label: '62 Investors', value: '73.8%', delta: '+18%', trend: 'up' },
      { label: '22 Agents', value: '26.2%', delta: '+34%', trend: 'up' },
    ],
  },
  {
    id: 'verified-users',
    title: 'Verified Users',
    category: 'users',
    icon: ShieldCheck,
    value: '10,910',
    growth: '+9.4%',
    trend: 'up',
    href: '/verification',
    spark: s([60, 64, 68, 72, 75, 80, 84, 88, 92, 95]),
    supporting: [
      { label: 'Passports / EID', value: '8,430', delta: 'Verified', trend: 'up' },
      { label: 'RERA Brokers', value: '2,480', delta: 'Verified', trend: 'up' },
    ],
  },
  {
    id: 'pending-verifications',
    title: 'Pending Verifications',
    category: 'users',
    icon: Clock,
    value: '42',
    growth: '-14.8%',
    trend: 'down',
    href: '/verification',
    spark: s([60, 56, 58, 50, 52, 46, 48, 42, 44, 40]),
    supporting: [
      { label: 'Queue Time', value: '18 min', delta: '-6 min', trend: 'down' },
      { label: 'Resubmitted', value: '8 cases', delta: '', trend: 'up' },
    ],
  },

  // Marketplace & Pipeline (5 Cards)
  {
    id: 'open-requests',
    title: 'Open Requests',
    category: 'marketplace',
    icon: FileText,
    value: '487',
    growth: '+9.3%',
    trend: 'up',
    href: '/requests',
    spark: s([30, 34, 40, 38, 44, 48, 46, 52, 58, 62]),
    supporting: [
      { label: 'New This Week', value: '156', delta: '+11.2%', trend: 'up' },
      { label: 'Avg Budget', value: 'AED 4.8M', delta: '+6.4%', trend: 'up' },
    ],
  },
  {
    id: 'active-offers',
    title: 'Active Offers',
    category: 'marketplace',
    icon: ScrollText,
    value: '1,248',
    growth: '+6.8%',
    trend: 'up',
    href: '/offers',
    spark: s([50, 48, 54, 52, 58, 60, 57, 64, 62, 70]),
    supporting: [
      { label: 'Under Review', value: '612', delta: '+5.2%', trend: 'up' },
      { label: 'Acceptance Rate', value: '28.4%', delta: '+3.1%', trend: 'up' },
    ],
  },
  {
    id: 'active-deals',
    title: 'Active Deals',
    category: 'marketplace',
    icon: Handshake,
    value: '365',
    growth: '+7.4%',
    trend: 'up',
    href: '/deals',
    spark: s([22, 26, 24, 30, 28, 34, 32, 40, 44, 48]),
    supporting: [
      { label: 'In Escrow', value: '214', delta: 'AED 482M', trend: 'up' },
      { label: 'Closing Soon', value: '86', delta: 'Within 7d', trend: 'up' },
    ],
  },
  {
    id: 'completed-deals',
    title: 'Completed Deals',
    category: 'marketplace',
    icon: CircleCheckBig,
    value: '845',
    growth: '+12.1%',
    trend: 'up',
    href: '/deals',
    spark: s([28, 34, 38, 44, 50, 48, 58, 64, 70, 82]),
    supporting: [
      { label: 'Total Volume', value: 'AED 2.8B', delta: '+18.4%', trend: 'up' },
      { label: 'Success Rate', value: '78.6%', delta: '+4.2%', trend: 'up' },
    ],
  },
  {
    id: 'cancelled-deals',
    title: 'Cancelled Deals',
    category: 'marketplace',
    icon: Ban,
    value: '28',
    growth: '-8.2%',
    trend: 'down',
    href: '/deals',
    spark: s([45, 42, 38, 36, 32, 35, 30, 28, 26, 22]),
    supporting: [
      { label: 'Drop Rate', value: '2.4%', delta: '-0.8%', trend: 'down' },
      { label: 'Refunded', value: '100%', delta: 'Clear', trend: 'up' },
    ],
  },

  // Revenue & Monetization (6 Cards)
  {
    id: 'revenue-today',
    title: 'Revenue Today',
    category: 'finance',
    icon: Wallet,
    value: 'AED 34,800',
    growth: '+16.2%',
    trend: 'up',
    href: '/finance',
    spark: s([18, 24, 22, 30, 28, 40, 36, 52, 60, 74]),
    supporting: [
      { label: 'Subscriptions', value: 'AED 21.4K', delta: '61.5%', trend: 'up' },
      { label: 'Commissions', value: 'AED 13.4K', delta: '38.5%', trend: 'up' },
    ],
  },
  {
    id: 'revenue-this-month',
    title: 'Revenue This Month',
    category: 'finance',
    icon: DollarSign,
    value: 'AED 824,500',
    growth: '+18.3%',
    trend: 'up',
    href: '/finance',
    spark: s([40, 45, 52, 58, 64, 70, 78, 85, 92, 100]),
    supporting: [
      { label: 'Target Met', value: '108%', delta: '+8%', trend: 'up' },
      { label: 'MRR Growth', value: '+14.6%', delta: 'MoM', trend: 'up' },
    ],
  },
  {
    id: 'revenue-this-year',
    title: 'Revenue This Year',
    category: 'finance',
    icon: TrendingUp,
    value: 'AED 9.84M',
    growth: '+24.6%',
    trend: 'up',
    href: '/finance',
    spark: s([20, 28, 35, 44, 52, 60, 72, 80, 88, 98]),
    supporting: [
      { label: 'ARR Forecast', value: 'AED 12.4M', delta: '+28%', trend: 'up' },
      { label: 'Gross Margin', value: '91.2%', delta: '+1.4%', trend: 'up' },
    ],
  },
  {
    id: 'active-subscriptions',
    title: 'Active Subscriptions',
    category: 'finance',
    icon: CreditCard,
    value: '1,842',
    growth: '+8.4%',
    trend: 'up',
    href: '/subscriptions',
    spark: s([50, 54, 52, 58, 56, 62, 60, 66, 64, 72]),
    supporting: [
      { label: 'Elite / Power', value: '742', delta: '40.3%', trend: 'up' },
      { label: 'Pro Agents', value: '1,100', delta: '59.7%', trend: 'up' },
    ],
  },
  {
    id: 'expiring-subscriptions',
    title: 'Expiring Subscriptions',
    category: 'finance',
    icon: CalendarDays,
    value: '38',
    growth: '-6.4%',
    trend: 'down',
    href: '/subscriptions',
    spark: s([55, 50, 48, 44, 42, 40, 38, 36, 34, 30]),
    supporting: [
      { label: 'Within 7 Days', value: '38', delta: 'Auto-renew 88%', trend: 'up' },
      { label: 'Churn Risk', value: '1.2%', delta: '-0.4%', trend: 'down' },
    ],
  },
  {
    id: 'pending-reports',
    title: 'Pending Reports',
    category: 'operations',
    icon: AlertTriangle,
    value: '18',
    growth: '-12.4%',
    trend: 'down',
    href: '/reports',
    spark: s([40, 38, 42, 36, 34, 30, 32, 26, 24, 18]),
    supporting: [
      { label: 'High Priority', value: '3', delta: 'Immediate', trend: 'down' },
      { label: 'Resolved Today', value: '28', delta: '+14%', trend: 'up' },
    ],
  },
]

// Legacy mapping support
export const platformOverview = allKpiCards.slice(0, 4)
export const marketplaceMetrics = allKpiCards.slice(8, 12)
export const operationalMetrics = allKpiCards.slice(13, 17)

// 8 Complete Charts Dataset
export interface MultiChartDataPoint {
  label: string
  userGrowth: number
  investors: number
  agents: number
  revenue: number
  requestsGrowth: number
  offersGrowth: number
  dealsGrowth: number
  subscriptionGrowth: number
  agentPerformance: number
  investorActivity: number
}

export const multiChartsData: MultiChartDataPoint[] = [
  { label: 'Jan', userGrowth: 1420, investors: 1120, agents: 300, revenue: 580000, requestsGrowth: 180, offersGrowth: 460, dealsGrowth: 140, subscriptionGrowth: 820, agentPerformance: 84, investorActivity: 78 },
  { label: 'Feb', userGrowth: 1840, investors: 1460, agents: 380, revenue: 640000, requestsGrowth: 220, offersGrowth: 580, dealsGrowth: 180, subscriptionGrowth: 980, agentPerformance: 86, investorActivity: 82 },
  { label: 'Mar', userGrowth: 2350, investors: 1880, agents: 470, revenue: 720000, requestsGrowth: 280, offersGrowth: 710, dealsGrowth: 220, subscriptionGrowth: 1140, agentPerformance: 88, investorActivity: 85 },
  { label: 'Apr', userGrowth: 2890, investors: 2310, agents: 580, revenue: 810000, requestsGrowth: 340, offersGrowth: 890, dealsGrowth: 270, subscriptionGrowth: 1320, agentPerformance: 89, investorActivity: 89 },
  { label: 'May', userGrowth: 3480, investors: 2790, agents: 690, revenue: 920000, requestsGrowth: 410, offersGrowth: 1080, dealsGrowth: 320, subscriptionGrowth: 1580, agentPerformance: 92, investorActivity: 94 },
  { label: 'Jun', userGrowth: 4120, investors: 3310, agents: 810, revenue: 1040000, requestsGrowth: 487, offersGrowth: 1248, dealsGrowth: 365, subscriptionGrowth: 1842, agentPerformance: 95, investorActivity: 98 },
]

export const revenueSeries = {
  week: [
    { date: 'Jan 11', label: '11 Jan 2026', value: 8000, deals: 6 },
    { date: 'Jan 12', label: '12 Jan 2026', value: 32000, deals: 9 },
    { date: 'Jan 13', label: '13 Jan 2026', value: 61000, deals: 12 },
    { date: 'Jan 14', label: '14 Jan 2026', value: 78000, deals: 14 },
    { date: 'Jan 15', label: '15 Jan 2026', value: 34000, deals: 8 },
    { date: 'Jan 16', label: '16 Jan 2026', value: 96000, deals: 18 },
  ],
  month: [
    { date: 'Wk 1', label: 'Week 1', value: 180000, deals: 42 },
    { date: 'Wk 2', label: 'Week 2', value: 245000, deals: 58 },
    { date: 'Wk 3', label: 'Week 3', value: 210000, deals: 51 },
    { date: 'Wk 4', label: 'Week 4', value: 320500, deals: 74 },
  ],
  year: [
    { date: 'Q1', label: 'Quarter 1', value: 2100000, deals: 180 },
    { date: 'Q2', label: 'Quarter 2', value: 2450000, deals: 214 },
    { date: 'Q3', label: 'Quarter 3', value: 2600000, deals: 198 },
    { date: 'Q4', label: 'Quarter 4', value: 2690000, deals: 245 },
  ],
}

export const dealStatus = [
  { key: 'completed', label: 'Completed', value: 487, percent: 39, color: '#17b26a' },
  { key: 'active', label: 'Active', value: 365, percent: 29, color: '#00c2cb' },
  { key: 'cancelled', label: 'Cancelled', value: 28, percent: 8, color: '#d92d20' },
]

// 9 Real-Time Live Activity Feed Items
export interface LiveActivityItem {
  id: string
  category: 'user' | 'request' | 'offer' | 'deal' | 'subscription' | 'report' | 'verification' | 'admin'
  title: string
  detail: string
  time: string
  actor: string
  actorAvatar?: string
  badge?: string
  href?: string
}

export const initialLiveActivityFeed: LiveActivityItem[] = [
  {
    id: 'act-1',
    category: 'user',
    title: 'New Investor Registered',
    detail: 'Amal Haddad created verified buyer profile for Palm Jumeirah luxury villas.',
    time: '2m ago',
    actor: 'Amal Haddad',
    actorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    badge: 'Investor',
    href: '/investors/IN-2048',
  },
  {
    id: 'act-2',
    category: 'user',
    title: 'New Agent Registered',
    detail: 'Omar Nasser registered with BRN-61284 under Avenue Realty Dubai.',
    time: '8m ago',
    actor: 'Omar Nasser',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    badge: 'RERA Agent',
    href: '/agents/AG-1048',
  },
  {
    id: 'act-3',
    category: 'request',
    title: 'New Request Posted',
    detail: '4BR Sea-View Villa in Palm Jumeirah · Budget: AED 14,500,000.',
    time: '14m ago',
    actor: 'Anwar Hosny',
    actorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    badge: 'Demand Brief',
    href: '/requests',
  },
  {
    id: 'act-4',
    category: 'offer',
    title: 'New Offer Submitted',
    detail: 'Layla Haddad submitted proposal for REQ-2041 (Luxury Golf-View Villa).',
    time: '21m ago',
    actor: 'Layla Haddad',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    badge: 'AED 4.85M',
    href: '/offers',
  },
  {
    id: 'act-5',
    category: 'deal',
    title: 'Deal Created & Escrow Funded',
    detail: 'Deal #4821 moved to escrow for Nad Al Sheba Gardens luxury residence.',
    time: '34m ago',
    actor: 'Ahmad Khaled',
    badge: 'Escrow Active',
    href: '/deals',
  },
  {
    id: 'act-6',
    category: 'subscription',
    title: 'Subscription Purchased',
    detail: 'Youssef Ali upgraded brokerage account to Elite Agent Plan (Annual).',
    time: '45m ago',
    actor: 'Youssef Ali',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    badge: 'Elite Plan',
    href: '/subscriptions',
  },
  {
    id: 'act-7',
    category: 'report',
    title: 'Report Submitted',
    detail: 'Listing #991 flagged for duplicate photos in Downtown Dubai.',
    time: '56m ago',
    actor: 'Compliance Bot',
    badge: 'Under Review',
    href: '/reports',
  },
  {
    id: 'act-8',
    category: 'verification',
    title: 'Verification Approved',
    detail: 'DLD trade license and passport verified for Tariq Al-Mansoor.',
    time: '1h 12m ago',
    actor: 'Super Admin',
    badge: 'KYC Verified',
    href: '/verification',
  },
  {
    id: 'act-9',
    category: 'admin',
    title: 'Admin Activity',
    detail: 'Ahmad Khaled updated platform commission rules and exported audit CSV.',
    time: '2h ago',
    actor: 'Ahmad Khaled',
    badge: 'Audit Log',
    href: '/activity',
  },
]

export const recentActivity = initialLiveActivityFeed

export interface AgentRow {
  id: string
  name: string
  region: string
  deals: number
  revenue: number
  rating: number
  progress: number
  avatar?: string
}

export const topAgents: AgentRow[] = [
  { id: 'g1', name: 'Youssef Ali', region: 'Dubai Marina & Palm', deals: 42, revenue: 4820000, rating: 4.9, progress: 92, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'g2', name: 'Noura Salem', region: 'Business Bay & Downtown', deals: 38, revenue: 4110000, rating: 4.8, progress: 84, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { id: 'g3', name: 'Ahmed Al Mansoori', region: 'Dubai Hills & Emirates Living', deals: 31, revenue: 3760000, rating: 4.7, progress: 76, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { id: 'g4', name: 'Layla Haddad', region: 'JVC & Arabian Ranches', deals: 27, revenue: 2980000, rating: 4.8, progress: 68, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { id: 'g5', name: 'Omar Nasser', region: 'Downtown Dubai', deals: 24, revenue: 2540000, rating: 4.7, progress: 58, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' },
  { id: 'g6', name: 'Tariq Al-Mansoor', region: 'Al Barsha & Palm Jumeirah', deals: 21, revenue: 2110000, rating: 4.6, progress: 52, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
]

export type RequestStatus = 'open' | 'pending' | 'matched' | 'closed'

export interface RequestRow {
  id: string
  property: string
  investor: string
  investorAvatar?: string
  budget: number
  status: RequestStatus
  submitted: string
}

export const latestRequests: RequestRow[] = [
  { id: 'REQ-2041', property: '4BR Villa · Al Barsha Living', investor: 'Anwar Hosny', investorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', budget: 4850000, status: 'open', submitted: '3 min ago' },
  { id: 'REQ-2040', property: 'Luxury Beach Villa · Palm Jumeirah', investor: 'Omar Nasser', investorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80', budget: 14200000, status: 'pending', submitted: '12 min ago' },
  { id: 'REQ-2039', property: 'Full Floor Office · Business Bay', investor: 'Sarah Johnson', investorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', budget: 6400000, status: 'matched', submitted: '28 min ago' },
  { id: 'REQ-2038', property: 'Penthouse · Downtown Dubai', investor: 'Ahmed Al Mansoori', investorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', budget: 9500000, status: 'open', submitted: '45 min ago' },
  { id: 'REQ-2037', property: 'Lagoon Villa · Dubai Creek Harbour', investor: 'Maya Karim', investorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80', budget: 3800000, status: 'closed', submitted: '1 hr ago' },
  { id: 'REQ-2036', property: '3BR High-Floor Apartment · Dubai Marina', investor: 'Sara Mansour', investorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', budget: 2750000, status: 'pending', submitted: '2 hrs ago' },
]

export function formatAed(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(1)}K`
  return `AED ${n}`
}
