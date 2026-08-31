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
} from 'lucide-react'

export type Trend = 'up' | 'down'

export interface SupportingMetric {
  label: string
  value: string
  delta: string
  trend: Trend
}

export interface KpiCard {
  id: string
  title: string
  icon: LucideIcon
  value: string
  growth: string
  trend: Trend
  href: string
  spark: number[]
  supporting: SupportingMetric[]
}

// Small helper to build sparkline series
const s = (arr: number[]) => arr

export const platformOverview: KpiCard[] = [
  {
    id: 'total-users',
    title: 'Total Users',
    icon: Users,
    value: '12,000',
    growth: '+12.4%',
    trend: 'up',
    href: '#users',
    spark: s([32, 40, 38, 52, 49, 66, 61, 78, 74, 90]),
    supporting: [
      { label: 'Investors', value: '9,612', delta: '80.1%', trend: 'up' },
      { label: 'Agents', value: '2,388', delta: '19.9%', trend: 'up' },
      { label: 'New users', value: '324', delta: '8.6%', trend: 'up' },
    ],
  },
  {
    id: 'total-investors',
    title: 'Total Investors',
    icon: UserRoundCheck,
    value: '8,430',
    growth: '+10.8%',
    trend: 'up',
    href: '#investors',
    spark: s([20, 28, 26, 34, 40, 38, 48, 55, 60, 72]),
    supporting: [
      { label: 'New This Week', value: '256', delta: '11.7%', trend: 'up' },
      { label: 'Active This Week', value: '5,612', delta: '9.3%', trend: 'up' },
      { label: 'Returning', value: '3,874', delta: '14.8%', trend: 'up' },
    ],
  },
  {
    id: 'total-agents',
    title: 'Total Agents',
    icon: BadgeCheck,
    value: '2,156',
    growth: '+8.6%',
    trend: 'up',
    href: '#agents',
    spark: s([44, 40, 46, 42, 50, 48, 56, 54, 62, 68]),
    supporting: [
      { label: 'New This Week', value: '86', delta: '10.5%', trend: 'up' },
      { label: 'Active This Week', value: '1,342', delta: '7.6%', trend: 'up' },
      { label: 'Verified', value: '2,041', delta: '15.3%', trend: 'up' },
    ],
  },
  {
    id: 'revenue-today',
    title: 'Revenue Today',
    icon: Wallet,
    value: 'AED 12.0K',
    growth: '+14.0%',
    trend: 'up',
    href: '#revenue',
    spark: s([18, 24, 22, 30, 28, 40, 36, 52, 60, 74]),
    supporting: [
      { label: 'This Week', value: 'AED 75.0K', delta: '14.0%', trend: 'up' },
      { label: 'This Month', value: 'AED 320.5K', delta: '18.3%', trend: 'up' },
      { label: 'This Year', value: 'AED 2.34M', delta: '24.6%', trend: 'up' },
    ],
  },
]

export const marketplaceMetrics: KpiCard[] = [
  {
    id: 'open-requests',
    title: 'Open Requests',
    icon: FileText,
    value: '487',
    growth: '+9.3%',
    trend: 'up',
    href: '#requests',
    spark: s([30, 34, 40, 38, 44, 48, 46, 52, 58, 62]),
    supporting: [
      { label: 'New This Week', value: '156', delta: '11.2%', trend: 'up' },
      { label: 'Unresponded', value: '74', delta: '4.1%', trend: 'down' },
      { label: 'Avg. Response Time', value: '2h 34m', delta: '8.6%', trend: 'down' },
    ],
  },
  {
    id: 'active-offers',
    title: 'Active Offers',
    icon: ScrollText,
    value: '1,248',
    growth: '+6.8%',
    trend: 'up',
    href: '#offers',
    spark: s([50, 48, 54, 52, 58, 60, 57, 64, 62, 70]),
    supporting: [
      { label: 'New This Week', value: '378', delta: '9.1%', trend: 'up' },
      { label: 'Pending Investor', value: '612', delta: '5.2%', trend: 'up' },
      { label: 'Expiring Soon', value: '48', delta: '6.3%', trend: 'down' },
    ],
  },
  {
    id: 'active-deals',
    title: 'Active Deals',
    icon: Handshake,
    value: '324',
    growth: '+5.8%',
    trend: 'up',
    href: '#deals',
    spark: s([22, 26, 24, 30, 28, 34, 32, 40, 44, 48]),
    supporting: [
      { label: 'New This Week', value: '74', delta: '8.0%', trend: 'up' },
      { label: 'In Progress', value: '214', delta: '6.5%', trend: 'up' },
      { label: 'On Hold', value: '36', delta: '12.2%', trend: 'down' },
    ],
  },
  {
    id: 'completed-deals',
    title: 'Completed Deals',
    icon: CircleCheckBig,
    value: '845',
    growth: '+12.1%',
    trend: 'up',
    href: '#deals',
    spark: s([28, 34, 38, 44, 50, 48, 58, 64, 70, 82]),
    supporting: [
      { label: 'This Week', value: '126', delta: '10.3%', trend: 'up' },
      { label: 'This Month', value: '845', delta: '12.1%', trend: 'up' },
      { label: 'Success Rate', value: '78%', delta: '4.6%', trend: 'up' },
    ],
  },
]

export const operationalMetrics: KpiCard[] = [
  {
    id: 'online-users',
    title: 'Online Users',
    icon: ActivityIcon,
    value: '324',
    growth: '+18.5%',
    trend: 'up',
    href: '#users',
    spark: s([40, 52, 48, 60, 58, 72, 68, 80, 76, 88]),
    supporting: [
      { label: 'Peak Today', value: '482', delta: '', trend: 'up' },
      { label: 'Avg. Time Online', value: '18m 24s', delta: '', trend: 'up' },
    ],
  },
  {
    id: 'pending-verifications',
    title: 'Pending Verifications',
    icon: Flag,
    value: '42',
    growth: '-5.8%',
    trend: 'down',
    href: '#verification',
    spark: s([60, 56, 58, 50, 52, 46, 48, 42, 44, 40]),
    supporting: [
      { label: 'New This Week', value: '56', delta: '', trend: 'up' },
      { label: 'Verified This Week', value: '72', delta: '', trend: 'up' },
    ],
  },
  {
    id: 'pending-reports',
    title: 'Pending Reports',
    icon: ShieldAlert,
    value: '18',
    growth: '-12.4%',
    trend: 'down',
    href: '#reports',
    spark: s([40, 38, 42, 36, 34, 30, 32, 26, 24, 18]),
    supporting: [
      { label: 'New This Week', value: '24', delta: '', trend: 'up' },
      { label: 'Resolved This Week', value: '28', delta: '', trend: 'up' },
    ],
  },
  {
    id: 'active-subscriptions',
    title: 'Active Subscriptions',
    icon: CreditCard,
    value: '1,842',
    growth: '+4.2%',
    trend: 'up',
    href: '#subscriptions',
    spark: s([50, 54, 52, 58, 56, 62, 60, 66, 64, 72]),
    supporting: [
      { label: 'New This Week', value: '86', delta: '', trend: 'up' },
      { label: 'Expiring This Month', value: '112', delta: '', trend: 'down' },
    ],
  },
]

export interface RevenuePoint {
  date: string
  label: string
  value: number
  deals: number
}

export const revenueSeries: Record<string, RevenuePoint[]> = {
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
    { date: 'Q1', label: 'Quarter 1', value: 520000, deals: 180 },
    { date: 'Q2', label: 'Quarter 2', value: 610000, deals: 214 },
    { date: 'Q3', label: 'Quarter 3', value: 580000, deals: 198 },
    { date: 'Q4', label: 'Quarter 4', value: 690000, deals: 245 },
  ],
}

export interface DealSegment {
  key: string
  label: string
  value: number
  percent: number
  color: string
}

export const dealStatus: DealSegment[] = [
  { key: 'completed', label: 'Completed', value: 487, percent: 39, color: '#17b26a' },
  { key: 'active', label: 'Active', value: 365, percent: 29, color: '#01ccd2' },
  { key: 'cancelled', label: 'Cancelled', value: 280, percent: 22, color: '#d92d20' },
]

export type ActivityType = 'deal' | 'user' | 'report' | 'verification' | 'offer'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  meta: string
  time: string
}

export const recentActivity: ActivityItem[] = [
  { id: 'a1', type: 'deal', title: 'Deal #4821 marked completed', meta: 'Marina Heights · AED 1.2M', time: '2m ago' },
  { id: 'a2', type: 'user', title: 'New investor registered', meta: 'Layla Al Marri', time: '11m ago' },
  { id: 'a3', type: 'verification', title: 'Agent verification approved', meta: 'Omar Haddad', time: '24m ago' },
  { id: 'a4', type: 'report', title: 'Listing reported for review', meta: 'Report #1180', time: '38m ago' },
  { id: 'a5', type: 'offer', title: 'Offer accepted by investor', meta: 'Offer #9931 · AED 640K', time: '52m ago' },
  { id: 'a6', type: 'deal', title: 'Deal #4819 moved to escrow', meta: 'Downtown Views', time: '1h ago' },
]

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
