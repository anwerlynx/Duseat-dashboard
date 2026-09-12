'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Table as TableIcon,
  Sparkles,
  RefreshCw,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Share2,
  Sliders,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  User,
  Building,
  Home,
  Briefcase,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  Printer,
  Mail,
  Send,
  Zap,
  HelpCircle,
  Flame,
  Globe,
  Sliders as ControlsIcon,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { MainButton } from '@/components/ui/main-button'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { TableCheckbox } from '@/components/ui/table-checkbox'

import { Pagination, MetricCard } from '@/components/ui'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { cn, exportToCsv } from '@/lib/utils'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export type ReportStatus =
  | 'Draft'
  | 'Ready'
  | 'Scheduled'
  | 'Generating'
  | 'Completed'
  | 'Failed'
  | 'Archived'

export type DataSourceType =
  | 'Users'
  | 'Investors'
  | 'Agents'
  | 'Properties'
  | 'Requests'
  | 'Offers'
  | 'Deals'
  | 'Subscriptions'
  | 'Finance'

export type VisualizationType =
  | 'Table'
  | 'KPI'
  | 'Line Chart'
  | 'Bar Chart'
  | 'Donut Chart'
  | 'Area Chart'
  | 'Funnel'

export type AggregationType =
  | 'Sum'
  | 'Average'
  | 'Count'
  | 'Distinct Count'
  | 'Minimum'
  | 'Maximum'

export interface ReportFilter {
  id: string
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in'
  value: string
  logic: 'AND' | 'OR'
}

export interface ScheduledConfig {
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Custom'
  dayOfWeek?: string
  dayOfMonth?: number
  time: string
  timezone: string
  format: 'PDF' | 'Excel' | 'CSV'
  recipients: string[]
  status: 'Active' | 'Paused'
  lastRun?: string
  nextRun: string
}

export interface ReportItem {
  id: string
  name: string
  description: string
  dataSource: DataSourceType
  secondarySource?: DataSourceType
  metrics: string[]
  metricAggregations: Record<string, AggregationType>
  dimensions: string[]
  dateGrouping?: 'Day' | 'Week' | 'Month' | 'Quarter' | 'Year'
  filters: ReportFilter[]
  datePreset: 'Today' | 'Yesterday' | '7D' | '30D' | '90D' | '12M' | 'YTD' | 'Custom'
  customDateRange?: { start: string; end: string }
  visualization: VisualizationType
  chartConfig?: {
    xAxis?: string
    yAxis?: string
    groupBy?: string
    colorPalette?: string
  }
  status: ReportStatus
  createdBy: string
  createdDate: string
  lastUpdated: string
  lastGenerated: string
  recordsCount: number
  schedule?: ScheduledConfig
  isTemplate?: boolean
  category?: string
}

export interface ReportAuditEntry {
  id: string
  reportId: string
  reportName: string
  action: 'Created' | 'Edited' | 'Generated' | 'Exported' | 'Scheduled' | 'Schedule Updated' | 'Archived' | 'Deleted'
  actor: string
  date: string
  time: string
  details: string
}

// ==========================================
// DATA SOURCES CONFIGURATION
// ==========================================

export const DATA_SOURCES_CONFIG: Record<
  DataSourceType,
  {
    icon: React.ElementType
    name: string
    description: string
    metrics: { name: string; defaultAgg: AggregationType; allowedAggs: AggregationType[] }[]
    dimensions: string[]
    filters: { field: string; label: string; type: 'select' | 'text' | 'number' | 'date'; options?: string[] }[]
    allowedSecondaryJoins: DataSourceType[]
  }
> = {
  Users: {
    icon: User,
    name: 'Users',
    description: 'Analyze user registrations, active cohorts, verification states, and retention.',
    metrics: [
      { name: 'Total Users', defaultAgg: 'Count', allowedAggs: ['Count', 'Distinct Count'] },
      { name: 'Active Users', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'New Users', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Verified Users', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Suspended Users', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Session Duration (min)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
    ],
    dimensions: ['Country', 'City', 'User Type', 'Verification Status', 'Device', 'OS', 'Date'],
    filters: [
      { field: 'Country', label: 'Country', type: 'select', options: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'UK', 'Egypt'] },
      { field: 'User Type', label: 'User Type', type: 'select', options: ['Investor', 'Agent', 'Developer', 'Admin'] },
      { field: 'Status', label: 'Status', type: 'select', options: ['Active', 'Pending', 'Verified', 'Suspended'] },
    ],
    allowedSecondaryJoins: ['Subscriptions', 'Finance'],
  },
  Investors: {
    icon: Briefcase,
    name: 'Investors',
    description: 'Track capital allocations, portfolio budgets, request volume, and closing conversion.',
    metrics: [
      { name: 'Total Investors', defaultAgg: 'Count', allowedAggs: ['Count', 'Distinct Count'] },
      { name: 'Active Investors', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Average Budget ($)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum', 'Sum'] },
      { name: 'Total Requests Created', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Count', 'Average'] },
      { name: 'Deals Closed', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Count'] },
      { name: 'Conversion Rate (%)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
    ],
    dimensions: ['Country', 'City', 'Budget Range', 'Investment Type', 'Property Preference', 'KYC Level', 'Date'],
    filters: [
      { field: 'Budget Range', label: 'Budget Range', type: 'select', options: ['<$100K', '$100K–$250K', '$250K–$500K', '$500K–$1M', '$1M+'] },
      { field: 'Investment Type', label: 'Investment Type', type: 'select', options: ['Residential', 'Commercial', 'Off-plan', 'Ready', 'Rental'] },
      { field: 'Country', label: 'Country', type: 'select', options: ['UAE', 'Saudi Arabia', 'UK', 'Qatar'] },
    ],
    allowedSecondaryJoins: ['Requests', 'Deals'],
  },
  Agents: {
    icon: Building,
    name: 'Agents',
    description: 'Measure agent productivity, response times, offer acceptance, ratings, and commissions.',
    metrics: [
      { name: 'Total Agents', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Active Agents', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Offers Submitted', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Count', 'Average'] },
      { name: 'Accepted Offers', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Count'] },
      { name: 'Deals Closed', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Count'] },
      { name: 'Revenue Generated (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Average Rating (★)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
      { name: 'Response Time (hrs)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
    ],
    dimensions: ['Agency', 'Country', 'City', 'Plan', 'Verification Status', 'License Type', 'Date'],
    filters: [
      { field: 'Plan', label: 'Subscription Plan', type: 'select', options: ['Free', 'Pro', 'Elite', 'Power Agent', 'Enterprise'] },
      { field: 'Agency', label: 'Agency', type: 'select', options: ['Emaar Platinum', 'Damac Partners', 'Sobha Elite', 'Engel & Völkers', 'Independent'] },
      { field: 'Rating', label: 'Min Rating', type: 'select', options: ['4.5+', '4.0+', '3.5+'] },
    ],
    allowedSecondaryJoins: ['Offers', 'Deals', 'Subscriptions'],
  },
  Properties: {
    icon: Home,
    name: 'Properties',
    description: 'Inventory insights, developer distribution, price per sqft, and listing occupancy.',
    metrics: [
      { name: 'Total Listings', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Average Property Price (AED)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum', 'Sum'] },
      { name: 'Avg Price / SqFt', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
      { name: 'Offer Interactions', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Days on Market', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
    ],
    dimensions: ['Developer', 'Area / District', 'Property Type', 'Bedrooms', 'Project Status', 'Country', 'City'],
    filters: [
      { field: 'Developer', label: 'Developer', type: 'select', options: ['Emaar', 'Sobha Realty', 'Damac', 'Nakheel', 'Meraas'] },
      { field: 'Property Type', label: 'Property Type', type: 'select', options: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Office'] },
      { field: 'Project Status', label: 'Project Status', type: 'select', options: ['Off-plan', 'Under Construction', 'Ready / Handover'] },
    ],
    allowedSecondaryJoins: ['Requests', 'Offers'],
  },
  Requests: {
    icon: HelpCircle,
    name: 'Requests',
    description: 'Demand-side requirements, matching efficiency, budget bands, and regional demand velocity.',
    metrics: [
      { name: 'Total Requests', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Open Requests', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Matched Requests', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Closed Requests', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Average Matching Time (min)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
      { name: 'Avg Offers per Request', defaultAgg: 'Average', allowedAggs: ['Average', 'Maximum'] },
    ],
    dimensions: ['Target Area', 'Property Type', 'Budget Tier', 'Urgency', 'Country', 'Status', 'Date'],
    filters: [
      { field: 'Status', label: 'Request Status', type: 'select', options: ['Open', 'Matched', 'Closed', 'Expired'] },
      { field: 'Target Area', label: 'Target Area', type: 'select', options: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Dubai Hills'] },
    ],
    allowedSecondaryJoins: ['Offers', 'Deals'],
  },
  Offers: {
    icon: Flame,
    name: 'Offers',
    description: 'Supply proposals submitted by agents, pricing spreads, negotiation velocity, and win rates.',
    metrics: [
      { name: 'Total Offers', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Accepted Offers', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Rejected Offers', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Average Offer Value (AED)', defaultAgg: 'Average', allowedAggs: ['Average', 'Sum', 'Minimum', 'Maximum'] },
      { name: 'Conversion Rate (%)', defaultAgg: 'Average', allowedAggs: ['Average', 'Maximum'] },
      { name: 'Time to Submit (hrs)', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum'] },
    ],
    dimensions: ['Agent', 'Agency', 'Property Type', 'Area', 'Discount Tier', 'Status', 'Date'],
    filters: [
      { field: 'Status', label: 'Status', type: 'select', options: ['Submitted', 'Viewed', 'Accepted', 'Rejected', 'Withdrawn'] },
      { field: 'Property Type', label: 'Property Type', type: 'select', options: ['Apartment', 'Villa', 'Townhouse', 'Office'] },
    ],
    allowedSecondaryJoins: ['Deals', 'Requests'],
  },
  Deals: {
    icon: CheckCircle2,
    name: 'Deals',
    description: 'Completed property transactions, commission realization, escrow clearance, and cycle times.',
    metrics: [
      { name: 'Total Deals', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Closed Deals', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Total Deal Value (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average', 'Maximum'] },
      { name: 'Platform Commission (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Success Rate (%)', defaultAgg: 'Average', allowedAggs: ['Average'] },
      { name: 'Average Closing Days', defaultAgg: 'Average', allowedAggs: ['Average', 'Minimum', 'Maximum'] },
    ],
    dimensions: ['Country', 'City', 'Area', 'Agent', 'Developer', 'Deal Type', 'Status', 'Date'],
    filters: [
      { field: 'Status', label: 'Deal Status', type: 'select', options: ['Draft', 'Under Contract', 'Escrow Funded', 'Closed Completed', 'Cancelled'] },
      { field: 'Deal Type', label: 'Deal Type', type: 'select', options: ['Primary Off-Plan', 'Secondary Resale', 'Commercial Lease'] },
    ],
    allowedSecondaryJoins: ['Finance', 'Agents'],
  },
  Subscriptions: {
    icon: Zap,
    name: 'Subscriptions',
    description: 'SaaS recurring revenue, tier migrations, churn cohorts, and renewal predictability.',
    metrics: [
      { name: 'Active Subscribers', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'New Subscriptions', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Cancellations', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'MRR (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'ARR (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Churn Rate (%)', defaultAgg: 'Average', allowedAggs: ['Average'] },
      { name: 'ARPU (AED)', defaultAgg: 'Average', allowedAggs: ['Average'] },
    ],
    dimensions: ['Plan', 'Billing Cycle', 'Country', 'User Type', 'Renewal Status', 'Date'],
    filters: [
      { field: 'Plan', label: 'Plan', type: 'select', options: ['Free', 'Pro', 'Elite', 'Power Agent', 'Enterprise'] },
      { field: 'Billing Cycle', label: 'Billing Cycle', type: 'select', options: ['Monthly', 'Annual'] },
    ],
    allowedSecondaryJoins: ['Finance', 'Users'],
  },
  Finance: {
    icon: DollarSign,
    name: 'Finance',
    description: 'Accounting reconciliation, net revenues, VAT settlements, chargebacks, and gateway processing.',
    metrics: [
      { name: 'Gross Revenue (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Net Realized Revenue (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Refunds Total (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Count'] },
      { name: 'VAT Collected (AED)', defaultAgg: 'Sum', allowedAggs: ['Sum', 'Average'] },
      { name: 'Total Transactions', defaultAgg: 'Count', allowedAggs: ['Count'] },
      { name: 'Failed Payment Rate (%)', defaultAgg: 'Average', allowedAggs: ['Average'] },
    ],
    dimensions: ['Payment Method', 'Gateway', 'Currency', 'Country', 'Tax Category', 'Status', 'Date'],
    filters: [
      { field: 'Gateway', label: 'Gateway', type: 'select', options: ['Stripe UAE', 'Checkout.com', 'Network International', 'Direct Wire'] },
      { field: 'Payment Method', label: 'Method', type: 'select', options: ['Credit Card', 'Apple Pay', 'Google Pay', 'Bank Transfer'] },
      { field: 'Status', label: 'Status', type: 'select', options: ['Succeeded', 'Refunded', 'Failed', 'Disputed'] },
    ],
    allowedSecondaryJoins: ['Subscriptions', 'Deals'],
  },
}

// ==========================================
// PREDEFINED REPORT TEMPLATES
// ==========================================

export const REPORT_TEMPLATES: Omit<ReportItem, 'id' | 'createdDate' | 'lastUpdated' | 'lastGenerated'>[] = [
  {
    name: 'Executive Revenue & Yield Report',
    description: 'Comprehensive monthly gross, net revenue, MRR growth, and VAT distribution across Emirates.',
    dataSource: 'Finance',
    metrics: ['Gross Revenue (AED)', 'Net Realized Revenue (AED)', 'VAT Collected (AED)', 'Total Transactions'],
    metricAggregations: { 'Gross Revenue (AED)': 'Sum', 'Net Realized Revenue (AED)': 'Sum', 'VAT Collected (AED)': 'Sum', 'Total Transactions': 'Count' },
    dimensions: ['Country', 'Date'],
    dateGrouping: 'Month',
    filters: [{ id: 'f1', field: 'Status', operator: 'equals', value: 'Succeeded', logic: 'AND' }],
    datePreset: '12M',
    visualization: 'Area Chart',
    status: 'Ready',
    createdBy: 'Chief Financial Officer',
    recordsCount: 14820,
    isTemplate: true,
    category: 'Executive',
  },
  {
    name: 'Agent Performance & Deal Leaderboard',
    description: 'Monthly productivity matrix ranking agents by deals closed, offer acceptance speed, and gross sales.',
    dataSource: 'Agents',
    metrics: ['Deals Closed', 'Revenue Generated (AED)', 'Offers Submitted', 'Average Rating (★)'],
    metricAggregations: { 'Deals Closed': 'Sum', 'Revenue Generated (AED)': 'Sum', 'Offers Submitted': 'Sum', 'Average Rating (★)': 'Average' },
    dimensions: ['Agency', 'Country'],
    filters: [{ id: 'f2', field: 'Plan', operator: 'in', value: 'Pro,Elite,Power Agent', logic: 'AND' }],
    datePreset: '30D',
    visualization: 'Bar Chart',
    status: 'Ready',
    createdBy: 'Operations Lead',
    recordsCount: 842,
    isTemplate: true,
    category: 'Operations',
  },
  {
    name: 'Investor Capital Allocation & Budgets',
    description: 'Breakdown of active investor portfolio ticket sizes, property preferences, and deal closure ratios.',
    dataSource: 'Investors',
    metrics: ['Total Investors', 'Average Budget ($)', 'Deals Closed', 'Conversion Rate (%)'],
    metricAggregations: { 'Total Investors': 'Count', 'Average Budget ($)': 'Average', 'Deals Closed': 'Sum', 'Conversion Rate (%)': 'Average' },
    dimensions: ['Budget Range', 'Investment Type'],
    filters: [{ id: 'f3', field: 'Country', operator: 'equals', value: 'UAE', logic: 'AND' }],
    datePreset: '90D',
    visualization: 'Donut Chart',
    status: 'Ready',
    createdBy: 'Head of Growth',
    recordsCount: 3940,
    isTemplate: true,
    category: 'Marketplace',
  },
  {
    name: 'Marketplace Request Demand Heatmap',
    description: 'High-velocity demand analysis tracking investor requests by prime districts and property types.',
    dataSource: 'Requests',
    metrics: ['Total Requests', 'Open Requests', 'Matched Requests', 'Avg Offers per Request'],
    metricAggregations: { 'Total Requests': 'Count', 'Open Requests': 'Count', 'Matched Requests': 'Count', 'Avg Offers per Request': 'Average' },
    dimensions: ['Target Area', 'Property Type'],
    filters: [],
    datePreset: '30D',
    visualization: 'Table',
    status: 'Ready',
    createdBy: 'Market Intelligence',
    recordsCount: 1820,
    isTemplate: true,
    category: 'Marketplace',
  },
  {
    name: 'Offer-to-Deal Conversion Funnel',
    description: 'Full conversion velocity tracking proposals from agent submission to contract execution.',
    dataSource: 'Offers',
    metrics: ['Total Offers', 'Accepted Offers', 'Conversion Rate (%)', 'Average Offer Value (AED)'],
    metricAggregations: { 'Total Offers': 'Count', 'Accepted Offers': 'Count', 'Conversion Rate (%)': 'Average', 'Average Offer Value (AED)': 'Average' },
    dimensions: ['Property Type'],
    filters: [{ id: 'f4', field: 'Status', operator: 'not_equals', value: 'Withdrawn', logic: 'AND' }],
    datePreset: '30D',
    visualization: 'Funnel',
    status: 'Ready',
    createdBy: 'Product Analytics',
    recordsCount: 5410,
    isTemplate: true,
    category: 'Marketplace',
  },
  {
    name: 'SaaS Subscription Cohort & Churn',
    description: 'Subscriber retention dynamics, upgrades, downgrades, and MRR expansion across plans.',
    dataSource: 'Subscriptions',
    metrics: ['Active Subscribers', 'MRR (AED)', 'New Subscriptions', 'Churn Rate (%)'],
    metricAggregations: { 'Active Subscribers': 'Count', 'MRR (AED)': 'Sum', 'New Subscriptions': 'Count', 'Churn Rate (%)': 'Average' },
    dimensions: ['Plan', 'Billing Cycle'],
    filters: [],
    datePreset: '12M',
    visualization: 'Line Chart',
    status: 'Ready',
    createdBy: 'Monetization Manager',
    recordsCount: 924,
    isTemplate: true,
    category: 'SaaS',
  },
  {
    name: 'User Growth & KYC Verification Trajectory',
    description: 'Daily and weekly user acquisition pace, identity verification approvals, and active ratios.',
    dataSource: 'Users',
    metrics: ['Total Users', 'New Users', 'Verified Users', 'Active Users'],
    metricAggregations: { 'Total Users': 'Count', 'New Users': 'Count', 'Verified Users': 'Count', 'Active Users': 'Count' },
    dimensions: ['User Type', 'Date'],
    dateGrouping: 'Week',
    filters: [{ id: 'f5', field: 'Status', operator: 'not_equals', value: 'Suspended', logic: 'AND' }],
    datePreset: '90D',
    visualization: 'Area Chart',
    status: 'Ready',
    createdBy: 'Trust & Safety',
    recordsCount: 28400,
    isTemplate: true,
    category: 'Platform',
  },
]

// Initial seed reports
export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'REP-001',
    name: 'Dubai Agent Performance — Monthly',
    description: 'Monthly productivity of licensed Dubai agents by closed deals, submitted offers, and revenue.',
    dataSource: 'Agents',
    metrics: ['Deals Closed', 'Revenue Generated (AED)', 'Offers Submitted', 'Average Rating (★)'],
    metricAggregations: { 'Deals Closed': 'Sum', 'Revenue Generated (AED)': 'Sum', 'Offers Submitted': 'Sum', 'Average Rating (★)': 'Average' },
    dimensions: ['Agency', 'City'],
    filters: [{ id: 'f1', field: 'City', operator: 'equals', value: 'Dubai', logic: 'AND' }],
    datePreset: '30D',
    visualization: 'Bar Chart',
    status: 'Scheduled',
    createdBy: 'Tariq Al-Mansoor (Super Admin)',
    createdDate: '15 Aug 2026',
    lastUpdated: '1 hour ago',
    lastGenerated: 'Today, 08:30 AM',
    recordsCount: 684,
    schedule: {
      frequency: 'Monthly',
      dayOfMonth: 1,
      time: '08:00 AM',
      timezone: 'GST (UTC+4)',
      format: 'PDF',
      recipients: ['executives@duseat.ae', 'operations@duseat.ae'],
      status: 'Active',
      lastRun: '01 Sep 2026',
      nextRun: '01 Oct 2026, 08:00 AM',
    },
  },
  {
    id: 'REP-002',
    name: 'Executive Revenue & VAT Reconciliation',
    description: 'Quarterly financial report reconciling gross inflows, payment gateway fees, and VAT liabilities.',
    dataSource: 'Finance',
    metrics: ['Gross Revenue (AED)', 'Net Realized Revenue (AED)', 'VAT Collected (AED)', 'Refunds Total (AED)'],
    metricAggregations: { 'Gross Revenue (AED)': 'Sum', 'Net Realized Revenue (AED)': 'Sum', 'VAT Collected (AED)': 'Sum', 'Refunds Total (AED)': 'Sum' },
    dimensions: ['Gateway', 'Country'],
    filters: [{ id: 'f2', field: 'Status', operator: 'equals', value: 'Succeeded', logic: 'AND' }],
    datePreset: '90D',
    visualization: 'Table',
    status: 'Completed',
    createdBy: 'Sarah Jenkins (Finance Director)',
    createdDate: '01 Aug 2026',
    lastUpdated: '3 hours ago',
    lastGenerated: 'Yesterday, 04:15 PM',
    recordsCount: 4210,
    schedule: {
      frequency: 'Weekly',
      dayOfWeek: 'Monday',
      time: '09:00 AM',
      timezone: 'GST (UTC+4)',
      format: 'Excel',
      recipients: ['finance-audit@duseat.ae'],
      status: 'Active',
      lastRun: '07 Sep 2026',
      nextRun: '14 Sep 2026, 09:00 AM',
    },
  },
  {
    id: 'REP-003',
    name: 'Prime District Investor Demand & Budget Bands',
    description: 'High-net-worth investor preference breakdown across Palm Jumeirah, Downtown, and Dubai Hills.',
    dataSource: 'Investors',
    metrics: ['Total Investors', 'Average Budget ($)', 'Deals Closed'],
    metricAggregations: { 'Total Investors': 'Count', 'Average Budget ($)': 'Average', 'Deals Closed': 'Sum' },
    dimensions: ['Budget Range', 'Property Preference'],
    filters: [{ id: 'f3', field: 'Budget Range', operator: 'in', value: '$500K–$1M,$1M+', logic: 'AND' }],
    datePreset: '30D',
    visualization: 'Donut Chart',
    status: 'Ready',
    createdBy: 'Khalid Al-Nuaimi (Operations)',
    createdDate: '28 Aug 2026',
    lastUpdated: '1 day ago',
    lastGenerated: '06 Sep 2026',
    recordsCount: 1240,
  },
  {
    id: 'REP-004',
    name: 'Weekly Request Matching Efficiency',
    description: 'Platform matchmaking velocity tracking average minutes from request creation to first qualified offer.',
    dataSource: 'Requests',
    metrics: ['Total Requests', 'Matched Requests', 'Average Matching Time (min)'],
    metricAggregations: { 'Total Requests': 'Count', 'Matched Requests': 'Count', 'Average Matching Time (min)': 'Average' },
    dimensions: ['Target Area', 'Date'],
    dateGrouping: 'Week',
    filters: [],
    datePreset: '12M',
    visualization: 'Line Chart',
    status: 'Draft',
    createdBy: 'Ahmad Khaled (Product Analyst)',
    createdDate: '05 Sep 2026',
    lastUpdated: '4 hours ago',
    lastGenerated: 'Never',
    recordsCount: 3120,
  },
  {
    id: 'REP-005',
    name: 'SaaS Subscription Tier Retention & ARR',
    description: 'Annualized recurring run-rate and churn rate tracking by subscriber tier.',
    dataSource: 'Subscriptions',
    metrics: ['Active Subscribers', 'MRR (AED)', 'ARR (AED)', 'Churn Rate (%)'],
    metricAggregations: { 'Active Subscribers': 'Count', 'MRR (AED)': 'Sum', 'ARR (AED)': 'Sum', 'Churn Rate (%)': 'Average' },
    dimensions: ['Plan'],
    filters: [],
    datePreset: '90D',
    visualization: 'KPI',
    status: 'Ready',
    createdBy: 'Elena Rostova (Growth Lead)',
    createdDate: '20 Jul 2026',
    lastUpdated: '2 days ago',
    lastGenerated: '05 Sep 2026',
    recordsCount: 512,
  },
]

export const INITIAL_AUDIT_LOGS: ReportAuditEntry[] = [
  {
    id: 'AUD-901',
    reportId: 'REP-001',
    reportName: 'Dubai Agent Performance — Monthly',
    action: 'Generated',
    actor: 'System Scheduler',
    date: '08 Sep 2026',
    time: '08:30 AM',
    details: 'Automated monthly report generated and PDF dispatched to 2 recipients.',
  },
  {
    id: 'AUD-902',
    reportId: 'REP-002',
    reportName: 'Executive Revenue & VAT Reconciliation',
    action: 'Exported',
    actor: 'Sarah Jenkins',
    date: '07 Sep 2026',
    time: '04:15 PM',
    details: 'Exported Full Dataset (4,210 rows) in XLSX format.',
  },
  {
    id: 'AUD-903',
    reportId: 'REP-001',
    reportName: 'Dubai Agent Performance — Monthly',
    action: 'Schedule Updated',
    actor: 'Tariq Al-Mansoor',
    date: '05 Sep 2026',
    time: '11:20 AM',
    details: 'Changed schedule from Bi-Weekly to Monthly at 08:00 AM GST.',
  },
  {
    id: 'AUD-904',
    reportId: 'REP-004',
    reportName: 'Weekly Request Matching Efficiency',
    action: 'Created',
    actor: 'Ahmad Khaled',
    date: '05 Sep 2026',
    time: '09:40 AM',
    details: 'New draft custom report configured with Requests data source.',
  },
]

// Mock preview dataset generator
function generatePreviewData(source: DataSourceType, metrics: string[], dimensions: string[]) {
  const primaryDim = dimensions[0] || 'Category'
  
  if (source === 'Finance') {
    return [
      { [primaryDim]: 'UAE (Dubai & Abu Dhabi)', 'Gross Revenue (AED)': 1840200, 'Net Realized Revenue (AED)': 1748190, 'VAT Collected (AED)': 92010, 'Total Transactions': 4820 },
      { [primaryDim]: 'Saudi Arabia (Riyadh & Jeddah)', 'Gross Revenue (AED)': 684100, 'Net Realized Revenue (AED)': 581485, 'VAT Collected (AED)': 102615, 'Total Transactions': 1940 },
      { [primaryDim]: 'Qatar (Doha)', 'Gross Revenue (AED)': 342000, 'Net Realized Revenue (AED)': 342000, 'VAT Collected (AED)': 0, 'Total Transactions': 780 },
      { [primaryDim]: 'United Kingdom (London)', 'Gross Revenue (AED)': 218400, 'Net Realized Revenue (AED)': 218400, 'VAT Collected (AED)': 0, 'Total Transactions': 410 },
      { [primaryDim]: 'Egypt (Cairo)', 'Gross Revenue (AED)': 105200, 'Net Realized Revenue (AED)': 105200, 'VAT Collected (AED)': 0, 'Total Transactions': 470 },
    ]
  } else if (source === 'Agents') {
    return [
      { [primaryDim]: 'Emaar Platinum Group', 'Deals Closed': 48, 'Revenue Generated (AED)': 1240000, 'Offers Submitted': 284, 'Average Rating (★)': 4.9 },
      { [primaryDim]: 'Damac Premier Partners', 'Deals Closed': 36, 'Revenue Generated (AED)': 940000, 'Offers Submitted': 210, 'Average Rating (★)': 4.8 },
      { [primaryDim]: 'Sobha Elite Network', 'Deals Closed': 29, 'Revenue Generated (AED)': 780000, 'Offers Submitted': 185, 'Average Rating (★)': 4.7 },
      { [primaryDim]: 'Engel & Völkers Dubai', 'Deals Closed': 24, 'Revenue Generated (AED)': 620000, 'Offers Submitted': 142, 'Average Rating (★)': 4.8 },
      { [primaryDim]: 'Independent Power Agents', 'Deals Closed': 19, 'Revenue Generated (AED)': 490000, 'Offers Submitted': 168, 'Average Rating (★)': 4.6 },
    ]
  } else if (source === 'Investors') {
    return [
      { [primaryDim]: '$1M+ Ultra HNW', 'Total Investors': 480, 'Average Budget ($)': 2850000, 'Deals Closed': 84, 'Conversion Rate (%)': 32.4 },
      { [primaryDim]: '$500K–$1M Prime', 'Total Investors': 920, 'Average Budget ($)': 740000, 'Deals Closed': 142, 'Conversion Rate (%)': 26.8 },
      { [primaryDim]: '$250K–$500K Core', 'Total Investors': 1480, 'Average Budget ($)': 360000, 'Deals Closed': 194, 'Conversion Rate (%)': 21.2 },
      { [primaryDim]: '$100K–$250K Growth', 'Total Investors': 840, 'Average Budget ($)': 180000, 'Deals Closed': 92, 'Conversion Rate (%)': 17.5 },
      { [primaryDim]: '<$100K Entry', 'Total Investors': 220, 'Average Budget ($)': 85000, 'Deals Closed': 18, 'Conversion Rate (%)': 11.2 },
    ]
  } else if (source === 'Requests') {
    return [
      { [primaryDim]: 'Downtown Dubai', 'Total Requests': 482, 'Matched Requests': 458, 'Open Requests': 24, 'Average Matching Time (min)': 8.4 },
      { [primaryDim]: 'Palm Jumeirah', 'Total Requests': 394, 'Matched Requests': 382, 'Open Requests': 12, 'Average Matching Time (min)': 11.2 },
      { [primaryDim]: 'Dubai Marina', 'Total Requests': 310, 'Matched Requests': 294, 'Open Requests': 16, 'Average Matching Time (min)': 6.8 },
      { [primaryDim]: 'Dubai Hills Estate', 'Total Requests': 284, 'Matched Requests': 270, 'Open Requests': 14, 'Average Matching Time (min)': 9.5 },
      { [primaryDim]: 'Business Bay', 'Total Requests': 240, 'Matched Requests': 228, 'Open Requests': 12, 'Average Matching Time (min)': 7.1 },
    ]
  } else if (source === 'Subscriptions') {
    return [
      { [primaryDim]: 'Power Agent Plan', 'Active Subscribers': 284, 'MRR (AED)': 284000, 'ARR (AED)': 3408000, 'Churn Rate (%)': 1.1 },
      { [primaryDim]: 'Elite Plan', 'Active Subscribers': 490, 'MRR (AED)': 245000, 'ARR (AED)': 2940000, 'Churn Rate (%)': 1.4 },
      { [primaryDim]: 'Pro Plan', 'Active Subscribers': 680, 'MRR (AED)': 204000, 'ARR (AED)': 2448000, 'Churn Rate (%)': 2.1 },
      { [primaryDim]: 'Enterprise Tier', 'Active Subscribers': 42, 'MRR (AED)': 84000, 'ARR (AED)': 1008000, 'Churn Rate (%)': 0.4 },
    ]
  } else {
    return [
      { [primaryDim]: 'Category Alpha', Metric1: 1420, Metric2: 890, Metric3: 450 },
      { [primaryDim]: 'Category Beta', Metric1: 1180, Metric2: 740, Metric3: 380 },
      { [primaryDim]: 'Category Gamma', Metric1: 940, Metric2: 610, Metric3: 290 },
      { [primaryDim]: 'Category Delta', Metric1: 620, Metric2: 430, Metric3: 180 },
    ]
  }
}

// ==========================================
// UNIFIED RECHARTS VISUALIZER COMPONENT
// ==========================================
function ReportVisualizer({
  visualization,
  data,
  dimensionKey,
  metricKeys,
}: {
  visualization: VisualizationType
  data: any[]
  dimensionKey: string
  metricKeys: string[]
}) {
  const primaryMetric = metricKeys[0] || 'Value'
  const chartColors = ['#00c2cb', '#17b26a', '#2f54eb', '#f79009', '#722ed1', '#eb2f96']

  if (visualization === 'Bar Chart') {
    return (
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
            <XAxis
              dataKey={dimensionKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 11 }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                    <p className="font-bold text-[#1f2327] mb-1">{label}</p>
                    {payload.map((entry, i) => (
                      <p key={i} className="text-[#6f777f] flex items-center justify-between gap-3">
                        <span>{entry.name}:</span>
                        <strong className="text-[#1f2327]">
                          {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                        </strong>
                      </p>
                    ))}
                  </div>
                )
              }}
            />
            {metricKeys.slice(0, 2).map((m, idx) => (
              <Bar
                key={m}
                dataKey={m}
                fill={chartColors[idx % chartColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (visualization === 'Area Chart') {
    return (
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <defs>
              <linearGradient id="reportAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00c2cb" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00c2cb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
            <XAxis
              dataKey={dimensionKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 11 }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                    <p className="font-bold text-[#1f2327] mb-1">{label}</p>
                    {payload.map((entry, i) => (
                      <p key={i} className="text-[#6f777f] flex items-center justify-between gap-3">
                        <span>{entry.name}:</span>
                        <strong className="text-[#00a4ac]">
                          {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                        </strong>
                      </p>
                    ))}
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey={primaryMetric}
              stroke="#00c2cb"
              strokeWidth={2.5}
              fill="url(#reportAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (visualization === 'Line Chart') {
    return (
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
            <XAxis
              dataKey={dimensionKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 11 }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6f777f', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                    <p className="font-bold text-[#1f2327] mb-1">{label}</p>
                    {payload.map((entry, i) => (
                      <p key={i} className="text-[#6f777f] flex items-center justify-between gap-3">
                        <span>{entry.name}:</span>
                        <strong className="text-[#17b26a]">
                          {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                        </strong>
                      </p>
                    ))}
                  </div>
                )
              }}
            />
            {metricKeys.slice(0, 2).map((m, idx) => (
              <Line
                key={m}
                type="monotone"
                dataKey={m}
                stroke={chartColors[idx % chartColors.length]}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (visualization === 'Donut Chart') {
    const pieData = data.slice(0, 5).map((row, i) => ({
      name: String(row[dimensionKey] || `Item ${i + 1}`),
      value: Number(row[primaryMetric] || 100 * (5 - i)),
    }))
    const totalVal = pieData.reduce((acc, curr) => acc + curr.value, 0)

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-3">
        <div className="relative h-[220px] w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                cornerRadius={5}
                stroke="none"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(val: any) => [typeof val === 'number' ? val.toLocaleString() : val, primaryMetric]}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[18px] font-bold text-[#1f2327]">
              {totalVal >= 1000000
                ? `${(totalVal / 1000000).toFixed(1)}M`
                : totalVal >= 1000
                ? `${(totalVal / 1000).toFixed(0)}K`
                : totalVal}
            </span>
            <span className="text-[10px] text-[#6f777f]">Total Share</span>
          </div>
        </div>
        <div className="space-y-1.5 min-w-[160px] text-xs">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 truncate text-[#4b5563]">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: chartColors[idx % chartColors.length] }} />
                <span className="truncate max-w-[120px]">{item.name}</span>
              </span>
              <strong className="text-[#1f2327] font-mono">
                {totalVal > 0 ? `${((item.value / totalVal) * 100).toFixed(0)}%` : '0%'}
              </strong>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Funnel
  if (visualization === 'Funnel') {
    return (
      <div className="space-y-2 w-full max-w-lg mx-auto py-2">
        {data.slice(0, 5).map((item, idx) => {
          const label = String(item[dimensionKey])
          const pct = Math.max(20, 100 - idx * 18)
          return (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-[#1f2327]">
                <span>{label}</span>
                <span>{pct}% conversion</span>
              </div>
              <div
                className="h-6 rounded-[6px] bg-gradient-to-r from-[#00c2cb] to-[#009da4] flex items-center justify-end px-2 text-[11px] font-bold text-white shadow-2xs transition-all"
                style={{ width: `${pct}%` }}
              >
                {pct}%
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // KPI
  if (visualization === 'KPI') {
    const totalVal = data.reduce((acc, curr) => acc + (Number(curr[primaryMetric]) || 0), 0)
    return (
      <div className="text-center space-y-2 py-8">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">
          {primaryMetric}
        </span>
        <div className="text-[34px] sm:text-[38px] font-extrabold text-[#1f2327] tracking-tight">
          {totalVal > 1000 ? `AED ${totalVal.toLocaleString()}` : totalVal.toLocaleString()}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#dfefe8] px-3 py-1 text-[12px] font-bold text-[#17b26a]">
          <TrendingUp className="size-3.5" /> +18.4% vs previous period
        </div>
      </div>
    )
  }

  // Table fallback
  return (
    <div className="overflow-x-auto w-full py-2">
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-[#d3d5d7] text-[10px] font-bold uppercase text-[#6f777f]">
            <th className="py-2 px-3">{dimensionKey}</th>
            {metricKeys.map((m) => (
              <th key={m} className="py-2 px-3 text-right">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eef0f2]">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/60">
              <td className="py-2.5 px-3 font-semibold text-[#1f2327]">{String(row[dimensionKey])}</td>
              {metricKeys.map((m) => (
                <td key={m} className="py-2.5 px-3 text-right font-mono text-[#4b5563]">
                  {typeof row[m] === 'number' ? (row[m] as number).toLocaleString() : row[m]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ==========================================
// MAIN COMPONENT INNER
// ==========================================

function ReportsManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as any) || 'all'

  // Main navigation / view modes
  const [activeTab, setActiveTab] = React.useState<'all' | 'custom' | 'scheduled' | 'templates' | 'builder' | 'details'>(initialTab)
  const [reports, setReports] = React.useState<ReportItem[]>(INITIAL_REPORTS)
  const [auditLogs, setAuditLogs] = React.useState<ReportAuditEntry[]>(INITIAL_AUDIT_LOGS)
  const [selectedReport, setSelectedReport] = React.useState<ReportItem | null>(null)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>('All')
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>('All')
  const [selectedScheduleFilter, setSelectedScheduleFilter] = React.useState<string>('All')

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // ==========================================
  // BUILDER STATE (3-COLUMN WORKSPACE)
  // ==========================================
  const [builderId, setBuilderId] = React.useState<string | null>(null)
  const [builderName, setBuilderName] = React.useState('')
  const [builderDescription, setBuilderDescription] = React.useState('')
  const [builderSource, setBuilderSource] = React.useState<DataSourceType>('Agents')
  const [builderSecondarySource, setBuilderSecondarySource] = React.useState<DataSourceType | undefined>(undefined)
  const [builderMetrics, setBuilderMetrics] = React.useState<string[]>(['Deals Closed', 'Revenue Generated (AED)'])
  const [builderMetricAggs, setBuilderMetricAggs] = React.useState<Record<string, AggregationType>>({
    'Deals Closed': 'Sum',
    'Revenue Generated (AED)': 'Sum',
  })
  const [builderDimensions, setBuilderDimensions] = React.useState<string[]>(['Agency', 'Country'])
  const [builderDateGrouping, setBuilderDateGrouping] = React.useState<'Day' | 'Week' | 'Month' | 'Quarter' | 'Year'>('Month')
  const [builderFilters, setBuilderFilters] = React.useState<ReportFilter[]>([])
  const [builderDatePreset, setBuilderDatePreset] = React.useState<'Today' | 'Yesterday' | '7D' | '30D' | '90D' | '12M' | 'YTD' | 'Custom'>('30D')
  const [builderCustomDate, setBuilderCustomDate] = React.useState<{ start: string; end: string }>({ start: '2026-08-01', end: '2026-09-08' })
  const [builderVisualization, setBuilderVisualization] = React.useState<VisualizationType>('Bar Chart')
  const [builderActiveStep, setBuilderActiveStep] = React.useState<number>(1) // For mobile step-by-step
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generationStep, setGenerationStep] = React.useState<string>('')
  const [builderErrors, setBuilderErrors] = React.useState<Record<string, string>>({})

  // Modals
  const [exportModalReport, setExportModalReport] = React.useState<ReportItem | null>(null)
  const [exportFormat, setExportFormat] = React.useState<'CSV' | 'Excel' | 'PDF'>('CSV')
  const [exportScope, setExportScope] = React.useState<'current' | 'full'>('full')
  const [isExporting, setIsExporting] = React.useState(false)

  const [scheduleModalReport, setScheduleModalReport] = React.useState<ReportItem | null>(null)
  const [schedFrequency, setSchedFrequency] = React.useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly')
  const [schedTime, setSchedTime] = React.useState('08:00 AM')
  const [schedFormat, setSchedFormat] = React.useState<'PDF' | 'Excel' | 'CSV'>('PDF')
  const [schedRecipients, setSchedRecipients] = React.useState('executives@duseat.ae, operations@duseat.ae')

  const [deleteConfirmReport, setDeleteConfirmReport] = React.useState<ReportItem | null>(null)

  // Details View Tab State
  const [detailsTab, setDetailsTab] = React.useState<'overview' | 'data' | 'visualization' | 'history'>('overview')
  const [detailsVisualization, setDetailsVisualization] = React.useState<VisualizationType>('Bar Chart')

  // Live preview data dynamically generated from current builder state
  const previewData = React.useMemo(() => {
    return generatePreviewData(builderSource, builderMetrics, builderDimensions)
  }, [builderSource, builderMetrics, builderDimensions])

  // Sync builder errors in real-time
  React.useEffect(() => {
    const errors: Record<string, string> = {}
    if (!builderName.trim()) {
      errors.name = 'Report name is required.'
    }
    if (builderMetrics.length === 0) {
      errors.metrics = 'Add at least one metric.'
    }
    if (builderDatePreset === 'Custom' && (!builderCustomDate.start || !builderCustomDate.end)) {
      errors.date = 'Both start and end dates are required for custom range.'
    }
    setBuilderErrors(errors)
  }, [builderName, builderMetrics, builderDatePreset, builderCustomDate])

  // Reset / initialize builder
  const openNewReportBuilder = (template?: typeof REPORT_TEMPLATES[0]) => {
    if (template) {
      setBuilderId(null)
      setBuilderName(template.name)
      setBuilderDescription(template.description)
      setBuilderSource(template.dataSource)
      setBuilderSecondarySource(template.secondarySource)
      setBuilderMetrics([...template.metrics])
      setBuilderMetricAggs({ ...template.metricAggregations })
      setBuilderDimensions([...template.dimensions])
      setBuilderDateGrouping(template.dateGrouping || 'Month')
      setBuilderFilters([...template.filters])
      setBuilderDatePreset(template.datePreset)
      setBuilderVisualization(template.visualization)
    } else {
      setBuilderId(null)
      setBuilderName('')
      setBuilderDescription('')
      setBuilderSource('Agents')
      setBuilderSecondarySource(undefined)
      setBuilderMetrics(['Deals Closed', 'Revenue Generated (AED)'])
      setBuilderMetricAggs({
        'Deals Closed': 'Sum',
        'Revenue Generated (AED)': 'Sum',
      })
      setBuilderDimensions(['Agency', 'Country'])
      setBuilderDateGrouping('Month')
      setBuilderFilters([])
      setBuilderDatePreset('30D')
      setBuilderVisualization('Bar Chart')
    }
    setBuilderActiveStep(1)
    setActiveTab('builder')
  }

  // Open existing report in builder for editing
  const openEditReport = (report: ReportItem) => {
    setBuilderId(report.id)
    setBuilderName(report.name)
    setBuilderDescription(report.description)
    setBuilderSource(report.dataSource)
    setBuilderSecondarySource(report.secondarySource)
    setBuilderMetrics([...report.metrics])
    setBuilderMetricAggs({ ...report.metricAggregations })
    setBuilderDimensions([...report.dimensions])
    setBuilderDateGrouping(report.dateGrouping || 'Month')
    setBuilderFilters([...report.filters])
    setBuilderDatePreset(report.datePreset)
    setBuilderVisualization(report.visualization)
    setBuilderActiveStep(1)
    setActiveTab('builder')
  }

  // Duplicate a report
  const handleDuplicate = (report: ReportItem) => {
    const duplicated: ReportItem = {
      ...report,
      id: `REP-${String(reports.length + 1).padStart(3, '0')}`,
      name: `${report.name} (Copy)`,
      status: 'Draft',
      createdDate: 'Today',
      lastUpdated: 'Just now',
      lastGenerated: 'Never',
      schedule: undefined,
    }
    setReports((prev) => [duplicated, ...prev])

    // Add audit log
    const audit: ReportAuditEntry = {
      id: `AUD-${Date.now()}`,
      reportId: duplicated.id,
      reportName: duplicated.name,
      action: 'Created',
      actor: 'Admin',
      date: 'Today',
      time: 'Just now',
      details: `Duplicated from ${report.name} (${report.id}).`,
    }
    setAuditLogs((prev) => [audit, ...prev])

    toast({
      variant: 'success',
      title: 'Report Duplicated',
      description: `Created "${duplicated.name}". You can now edit and customize it.`,
    })
  }

  // Save report (Draft or Ready)
  const handleSaveReport = (asStatus: 'Draft' | 'Ready') => {
    if (asStatus === 'Ready' && Object.keys(builderErrors).length > 0) {
      toast({
        variant: 'error',
        title: 'Validation Error',
        description: Object.values(builderErrors)[0],
      })
      return
    }

    if (builderId) {
      // Update existing
      setReports((prev) =>
        prev.map((r) =>
          r.id === builderId
            ? {
                ...r,
                name: builderName || 'Untitled Report',
                description: builderDescription,
                dataSource: builderSource,
                secondarySource: builderSecondarySource,
                metrics: builderMetrics,
                metricAggregations: builderMetricAggs,
                dimensions: builderDimensions,
                dateGrouping: builderDateGrouping,
                filters: builderFilters,
                datePreset: builderDatePreset,
                visualization: builderVisualization,
                status: asStatus,
                lastUpdated: 'Just now',
              }
            : r
        )
      )

      setAuditLogs((prev) => [
        {
          id: `AUD-${Date.now()}`,
          reportId: builderId,
          reportName: builderName,
          action: 'Edited',
          actor: 'Admin',
          date: 'Today',
          time: 'Just now',
          details: `Report updated and saved as ${asStatus}.`,
        },
        ...prev,
      ])

      toast({
        variant: 'success',
        title: 'Report Saved',
        description: `"${builderName}" updated successfully.`,
      })
    } else {
      // Create new
      const newId = `REP-${String(reports.length + 1).padStart(3, '0')}`
      const newReport: ReportItem = {
        id: newId,
        name: builderName || 'Untitled Custom Report',
        description: builderDescription || 'Custom business analytics report.',
        dataSource: builderSource,
        secondarySource: builderSecondarySource,
        metrics: builderMetrics,
        metricAggregations: builderMetricAggs,
        dimensions: builderDimensions,
        dateGrouping: builderDateGrouping,
        filters: builderFilters,
        datePreset: builderDatePreset,
        visualization: builderVisualization,
        status: asStatus,
        createdBy: 'Admin User',
        createdDate: 'Today',
        lastUpdated: 'Just now',
        lastGenerated: 'Never',
        recordsCount: previewData.length * 120,
      }

      setReports((prev) => [newReport, ...prev])

      setAuditLogs((prev) => [
        {
          id: `AUD-${Date.now()}`,
          reportId: newId,
          reportName: newReport.name,
          action: 'Created',
          actor: 'Admin',
          date: 'Today',
          time: 'Just now',
          details: `New report created with source ${builderSource}.`,
        },
        ...prev,
      ])

      toast({
        variant: 'success',
        title: 'Report Created',
        description: `"${newReport.name}" saved as ${asStatus}.`,
      })
    }

    setActiveTab('all')
  }

  // Generate Report workflow with progress
  const handleGenerateReport = async () => {
    if (Object.keys(builderErrors).length > 0) {
      toast({
        variant: 'error',
        title: 'Cannot Generate Report',
        description: Object.values(builderErrors)[0],
      })
      return
    }

    setIsGenerating(true)
    setGenerationStep('Preparing data sources & verifying permissions...')
    await new Promise((r) => setTimeout(r, 600))
    setGenerationStep('Querying data warehouse & applying filters...')
    await new Promise((r) => setTimeout(r, 700))
    setGenerationStep('Aggregating metrics & building visualizations...')
    await new Promise((r) => setTimeout(r, 600))
    setGenerationStep('Finalizing dataset & caching output...')
    await new Promise((r) => setTimeout(r, 500))

    setIsGenerating(false)
    handleSaveReport('Ready')

    toast({
      variant: 'success',
      title: 'Report Generated Successfully',
      description: `Data compiled across ${previewData.length * 120} records.`,
    })
  }

  // Open Details view
  const openReportDetails = (report: ReportItem) => {
    setSelectedReport(report)
    setDetailsVisualization(report.visualization)
    setDetailsTab('overview')
    setActiveTab('details')
  }

  // Archive / Delete
  const handleArchive = (report: ReportItem) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: 'Archived', lastUpdated: 'Just now' } : r))
    )
    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        reportId: report.id,
        reportName: report.name,
        action: 'Archived',
        actor: 'Admin',
        date: 'Today',
        time: 'Just now',
        details: 'Report moved to archived status.',
      },
      ...prev,
    ])
    toast({
      variant: 'info',
      title: 'Report Archived',
      description: `"${report.name}" has been moved to archives.`,
    })
  }

  const handleDelete = (report: ReportItem) => {
    setReports((prev) => prev.filter((r) => r.id !== report.id))
    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        reportId: report.id,
        reportName: report.name,
        action: 'Deleted',
        actor: 'Admin',
        date: 'Today',
        time: 'Just now',
        details: 'Report permanently deleted.',
      },
      ...prev,
    ])
    setDeleteConfirmReport(null)
    if (selectedReport?.id === report.id) {
      setActiveTab('all')
      setSelectedReport(null)
    }
    toast({
      variant: 'success',
      title: 'Report Deleted',
      description: `"${report.name}" was permanently removed.`,
    })
  }

  // Schedule handler
  const handleSaveSchedule = () => {
    if (!scheduleModalReport) return
    const updated: ScheduledConfig = {
      frequency: schedFrequency,
      time: schedTime,
      timezone: 'GST (UTC+4)',
      format: schedFormat,
      recipients: schedRecipients.split(',').map((s) => s.trim()),
      status: 'Active',
      nextRun: `Next ${schedFrequency === 'Daily' ? 'Day' : schedFrequency === 'Weekly' ? 'Monday' : '1st of Month'} at ${schedTime}`,
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === scheduleModalReport.id
          ? { ...r, schedule: updated, status: 'Scheduled', lastUpdated: 'Just now' }
          : r
      )
    )

    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        reportId: scheduleModalReport.id,
        reportName: scheduleModalReport.name,
        action: 'Scheduled',
        actor: 'Admin',
        date: 'Today',
        time: 'Just now',
        details: `Configured ${schedFrequency} dispatch at ${schedTime} to ${schedRecipients}.`,
      },
      ...prev,
    ])

    setScheduleModalReport(null)
    toast({
      variant: 'success',
      title: 'Schedule Configured',
      description: `Report will automatically dispatch ${schedFrequency.toLowerCase()} to recipients.`,
    })
  }

  // Export execution
  const handleExecuteExport = () => {
    if (!exportModalReport) return
    setIsExporting(true)

    setTimeout(() => {
      const filename = `report_${exportModalReport.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`
      const headers = [
        exportModalReport.dimensions[0] || 'Dimension',
        ...exportModalReport.metrics,
      ]
      const rows = previewData.map((row) => [
        row[exportModalReport.dimensions[0] || 'Category'] ?? 'N/A',
        ...exportModalReport.metrics.map((m) => (row as Record<string, unknown>)[m] ?? 0),
      ])

      if (exportFormat === 'CSV') {
        exportToCsv(filename, headers, rows as (string | number)[][])
      } else {
        // Simulated Excel/PDF export
        toast({
          variant: 'success',
          title: `${exportFormat} Export Ready`,
          description: `Generated ${filename}.${exportFormat.toLowerCase()} (${exportModalReport.recordsCount} records).`,
        })
      }

      setAuditLogs((prev) => [
        {
          id: `AUD-${Date.now()}`,
          reportId: exportModalReport.id,
          reportName: exportModalReport.name,
          action: 'Exported',
          actor: 'Admin',
          date: 'Today',
          time: 'Just now',
          details: `Exported ${exportScope === 'full' ? 'Full Dataset' : 'Current View'} in ${exportFormat} format.`,
        },
        ...prev,
      ])

      setIsExporting(false)
      setExportModalReport(null)
    }, 800)
  }

  // Filtered reports list
  const filteredReports = React.useMemo(() => {
    return reports.filter((r) => {
      if (activeTab === 'custom' && r.schedule) return false
      if (activeTab === 'scheduled' && !r.schedule) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = r.name.toLowerCase().includes(q)
        const matchDesc = r.description.toLowerCase().includes(q)
        const matchSource = r.dataSource.toLowerCase().includes(q)
        const matchCreatedBy = r.createdBy.toLowerCase().includes(q)
        if (!matchName && !matchDesc && !matchSource && !matchCreatedBy) return false
      }

      if (selectedSourceFilter !== 'All' && r.dataSource !== selectedSourceFilter) return false
      if (selectedStatusFilter !== 'All' && r.status !== selectedStatusFilter) return false
      if (selectedScheduleFilter === 'Scheduled' && !r.schedule) return false
      if (selectedScheduleFilter === 'Not Scheduled' && r.schedule) return false

      return true
    })
  }, [reports, activeTab, searchQuery, selectedSourceFilter, selectedStatusFilter, selectedScheduleFilter])

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage) || 1
  const paginatedReports = filteredReports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const [showFilters, setShowFilters] = React.useState(true)

  const activeSourceConfig = DATA_SOURCES_CONFIG[builderSource]

  return (
    <PlatformShell
      title="Reports & Custom Data Composition"
      eyebrow="Business Intelligence"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            TOP HEADER CARD (Canonical Users Design Standard)
           ========================================================================= */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Custom Reports & Data Composition
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Compose ad-hoc reports, schedule automated export deliveries, and build cross-module business intelligence.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <Sparkles className="size-4 text-[#00c2cb]" />
                <span>Predefined Templates</span>
              </button>
              <button
                type="button"
                onClick={() => openNewReportBuilder()}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <Plus className="size-4" />
                <span>Create Report</span>
              </button>
            </div>
          </div>

          {/* 5 Stat Metric Cards */}
          {activeTab !== 'builder' && activeTab !== 'details' && (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
              <MetricCard
                label="Total Reports"
                value={reports.length}
                icon={FileText}
                tone="neutral"
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
              />
              <MetricCard
                label="Custom Ad-Hoc"
                value={reports.filter((r) => !r.schedule).length}
                icon={SlidersHorizontal}
                tone="info"
                active={activeTab === 'custom'}
                onClick={() => setActiveTab('custom')}
              />
              <MetricCard
                label="Scheduled Automated"
                value={reports.filter((r) => r.schedule).length}
                icon={Clock}
                tone="success"
                active={activeTab === 'scheduled'}
                onClick={() => setActiveTab('scheduled')}
              />
              <MetricCard
                label="Pre-built Templates"
                value={REPORT_TEMPLATES.length}
                icon={Sparkles}
                tone="warning"
                active={activeTab === 'templates'}
                onClick={() => setActiveTab('templates')}
              />
              <MetricCard
                label="Ready for Export"
                value={reports.filter((r) => r.status === 'Ready').length}
                icon={CheckCircle2}
                tone="brand"
              />
            </div>
          )}
        </header>

        {/* Main Tab Switcher (Design System Underline Tabs) */}
        {activeTab !== 'builder' && activeTab !== 'details' && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d3d5d7] pt-1 pb-0">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Reports', count: reports.length, icon: FileText },
                { id: 'custom', label: 'Custom Reports', count: reports.filter((r) => !r.schedule).length, icon: SlidersHorizontal },
                { id: 'scheduled', label: 'Scheduled Reports', count: reports.filter((r) => r.schedule).length, icon: Clock },
                { id: 'templates', label: 'Templates', count: REPORT_TEMPLATES.length, icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <a
                    key={tab.id}
                    href={`/custom-reports?tab=${tab.id}`}
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey || e.button === 1) {
                        return
                      }
                      e.preventDefault()
                      setActiveTab(tab.id as typeof activeTab)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      'relative flex items-center gap-2 pb-3 pt-1 text-[14px] font-medium transition-colors cursor-pointer select-none no-underline shrink-0',
                      isActive
                        ? 'text-[#1f2327] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:rounded-full after:bg-[#00c2cb]'
                        : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    <Icon className={cn('size-4', isActive ? 'text-[#00c2cb]' : 'text-[#6f777f]')} />
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors',
                        isActive ? 'bg-[#e5f6f7] text-[#00a4ac]' : 'bg-[#eff1f3] text-[#6f777f]'
                      )}
                    >
                      {tab.count}
                    </span>
                  </a>
                )
              })}
            </div>

            <div className="flex items-center gap-2 pb-2">
              <span className="text-[12px] text-[#6f777f] flex items-center gap-1.5 bg-[#fcfcfc] px-2.5 py-1 rounded-[6px] border border-[#eff1f3]">
                <Clock className="size-3.5 text-[#00c2cb]" /> Data freshness: <strong className="text-[#1f2327]">Real-time</strong>
              </span>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 1: TEMPLATES VIEW
        ========================================== */}
        {activeTab === 'templates' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                    <Sparkles className="size-4 text-[#00c2cb]" /> Pre-Configured Business Report Templates
                  </h3>
                  <p className="text-[12px] text-[#6f777f]">
                    Launch verified executive, operations, and marketplace reports with 1-click pre-configurations.
                  </p>
                </div>
                <MainButton
                  variant="Secondary"
                  size="sm"
                  label="Close Templates"
                  onClick={() => setActiveTab('all')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TEMPLATES.map((tpl, i) => {
                const SourceIcon = DATA_SOURCES_CONFIG[tpl.dataSource]?.icon || FileText
                return (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs hover:border-[#00c2cb] transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-[8px] bg-[#00c2cb]/10 text-[#00c2cb]">
                            <SourceIcon className="size-4" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00c2cb]">
                              {tpl.dataSource} • {tpl.category}
                            </span>
                            <h4 className="text-[14px] font-bold text-[#1f2327] group-hover:text-[#00c2cb] transition-colors">
                              {tpl.name}
                            </h4>
                          </div>
                        </div>
                        <span className="rounded-[6px] bg-[#f4f5f6] px-2 py-0.5 text-[10px] font-semibold text-[#6f777f]">
                          {tpl.visualization}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#6f777f] line-clamp-2">{tpl.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tpl.metrics.slice(0, 3).map((m, idx) => (
                          <span
                            key={idx}
                            className="rounded-[4px] border border-[#eef0f2] bg-[#fafbfc] px-1.5 py-0.5 text-[10px] font-medium text-[#4b5563]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 mt-2 border-t border-[#eef0f2] flex items-center justify-between">
                      <span className="text-[11px] text-[#6f777f]">Preset: <strong>{tpl.datePreset}</strong></span>
                      <MainButton
                        variant="Primary"
                        size="sm"
                        label="Use Template"
                        iconRight={<ChevronRight className="size-3" />}
                        onClick={() => openNewReportBuilder(tpl)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 2: REPORTS LIST & TABLE (OVERVIEW)
        ========================================== */}
        {(activeTab === 'all' || activeTab === 'custom' || activeTab === 'scheduled') && (
            <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              {/* Top Status Tabs & Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'All', label: 'All Reports', count: reports.length },
                      { id: 'Ready', label: 'Ready', count: reports.filter((r) => r.status === 'Ready').length },
                      { id: 'Scheduled', label: 'Scheduled', count: reports.filter((r) => r.schedule).length },
                      { id: 'Completed', label: 'Completed', count: reports.filter((r) => r.status === 'Completed').length },
                      { id: 'Draft', label: 'Draft', count: reports.filter((r) => r.status === 'Draft').length },
                      { id: 'Archived', label: 'Archived', count: reports.filter((r) => r.status === 'Archived').length },
                    ] as const
                  ).map((item) => {
                    const isActive = selectedStatusFilter === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedStatusFilter(item.id)}
                        className={cn(
                          'flex h-[34px] items-center gap-2 rounded-[8px] px-3 text-[13px] font-medium transition-all cursor-pointer select-none',
                          isActive
                            ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                            : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                        )}
                      >
                        <span>{item.label}</span>
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                            isActive ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                          )}
                        >
                          {item.count}
                        </span>
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
                        'duseat_custom_reports',
                        ['Report ID', 'Name', 'Data Source', 'Created By', 'Last Updated', 'Status', 'Last Run'],
                        filteredReports.map((r) => [r.id, r.name, r.dataSource, r.createdBy, r.lastUpdated, r.status, r.lastGenerated])
                      )
                    }}
                  />
                  <MainButton
                    variant="Primary"
                    size="sm"
                    iconLeft={<Plus className="size-3.5" />}
                    label="New Report"
                    onClick={() => openNewReportBuilder()}
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
                    placeholder="Search reports by name, data source, or author..."
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

                {/* Data Source Filter */}
                <select
                  value={selectedSourceFilter}
                  onChange={(e) => setSelectedSourceFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Data Sources</option>
                  <option value="Users">Users</option>
                  <option value="Investors">Investors</option>
                  <option value="Agents">Agents</option>
                  <option value="Properties">Properties</option>
                  <option value="Requests">Requests</option>
                  <option value="Offers">Offers</option>
                  <option value="Deals">Deals</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Finance">Finance</option>
                </select>

                {/* Scheduling Filter */}
                <select
                  value={selectedScheduleFilter}
                  onChange={(e) => setSelectedScheduleFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Schedules</option>
                  <option value="Scheduled">Scheduled Only</option>
                  <option value="Not Scheduled">Not Scheduled</option>
                </select>

                {/* Reset Filters Link */}
                {(searchQuery || selectedSourceFilter !== 'All' || selectedStatusFilter !== 'All' || selectedScheduleFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedSourceFilter('All')
                      setSelectedStatusFilter('All')
                      setSelectedScheduleFilter('All')
                    }}
                    className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Reports Data Table */}
              <div className="overflow-x-auto table-scrollbar">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="w-12 px-4 text-center">
                        <TableCheckbox
                          checked={
                            paginatedReports.length > 0 &&
                            paginatedReports.every((r) => selectedIds.includes(r.id))
                          }
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedIds(Array.from(new Set([...selectedIds, ...paginatedReports.map((r) => r.id)])))
                            } else {
                              setSelectedIds(selectedIds.filter((id) => !paginatedReports.some((r) => r.id === id)))
                            }
                          }}
                        />
                      </th>
                      <th className="px-4">Report Name & Details</th>
                      <th className="px-4">Data Source</th>
                      <th className="px-4">Created By</th>
                      <th className="px-4">Schedule</th>
                      <th className="px-4">Last Generated</th>
                      <th className="px-4">Status</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {paginatedReports.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-[#6f777f]">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FileText className="size-8 text-[#d3d5d7]" />
                            <p className="text-[14px] font-semibold text-[#1f2327]">No reports found</p>
                            <p className="text-[12px] text-[#6f777f]">Try adjusting your search or filters, or create a new report.</p>
                            <MainButton
                              variant="Primary"
                              size="sm"
                              label="+ Create Report"
                              onClick={() => openNewReportBuilder()}
                            />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedReports.map((report) => {
                        const isSelected = selectedIds.includes(report.id)
                        const SourceIcon = DATA_SOURCES_CONFIG[report.dataSource]?.icon || FileText
                        return (
                          <tr
                            key={report.id}
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
                                    setSelectedIds([...selectedIds, report.id])
                                  } else {
                                    setSelectedIds(selectedIds.filter((id) => id !== report.id))
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4">
                              <div className="space-y-0.5">
                                <button
                                  onClick={() => openReportDetails(report)}
                                  className="text-left font-semibold text-[14px] text-[#1f2327] hover:text-[#00c2cb] transition-colors flex items-center gap-1.5"
                                >
                                  {report.name}
                                </button>
                                <p className="text-[12px] text-[#6f777f] line-clamp-1 max-w-md">
                                  {report.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-4">
                              <div className="flex items-center gap-1.5">
                                <SourceIcon className="size-3.5 text-[#00c2cb]" />
                                <span className="font-semibold text-[#1f2327] text-[13px]">{report.dataSource}</span>
                                {report.secondarySource && (
                                  <span className="text-[11px] text-[#6f777f]">+{report.secondarySource}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 text-[#4b5563]">
                              <div className="text-[13px] font-medium text-[#1f2327]">{report.createdBy}</div>
                              <div className="text-[11px] text-[#9ca3af]">{report.lastUpdated}</div>
                            </td>
                            <td className="px-4">
                              {report.schedule ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#e6f9fa] px-2 py-0.5 text-[11px] font-bold text-[#008f95]">
                                    <Clock className="size-3" /> {report.schedule.frequency}
                                  </span>
                                  <div className="text-[11px] text-[#6f777f]">{report.schedule.format} • {report.schedule.recipients.length} recp</div>
                                </div>
                              ) : (
                                <span className="text-[12px] text-[#9ca3af]">On demand</span>
                              )}
                            </td>
                            <td className="px-4 text-[#4b5563]">
                              <span className="text-[13px]">{report.lastGenerated}</span>
                            </td>
                            <td className="px-4">
                              <FigmaStatusBadge
                                status={
                                  report.status === 'Ready' || report.status === 'Completed'
                                    ? 'Completed'
                                    : report.status === 'Scheduled'
                                    ? 'In progress'
                                    : report.status === 'Draft'
                                    ? 'Pending'
                                    : report.status === 'Failed'
                                    ? 'Failed'
                                    : 'Cancelled'
                                }
                              />
                            </td>
                            <td className="px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => openReportDetails(report)}
                                      className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                      title="View Report Details"
                                    >
                                      <Eye className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => openEditReport(report)}
                                      className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                      title="Edit Report"
                                    >
                                      <Edit className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => setExportModalReport(report)}
                                      className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                      title="Export Report"
                                    >
                                      <Download className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => setScheduleModalReport(report)}
                                      className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                      title="Configure Schedule"
                                    >
                                      <Clock className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDuplicate(report)}
                                      className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                      title="Duplicate"
                                    >
                                      <Copy className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmReport(report)}
                                      className="rounded-[6px] p-1.5 text-[#dc2626] hover:bg-[#fef2f2]"
                                      title="Delete"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer & Pagination */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d3d5d7] px-4 py-3">
                    <div className="text-[12px] text-[#6f777f]">
                      Showing <strong className="text-[#1f2327]">{filteredReports.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</strong> to{' '}
                      <strong className="text-[#1f2327]">{Math.min(currentPage * rowsPerPage, filteredReports.length)}</strong> of{' '}
                      <strong className="text-[#1f2327]">{filteredReports.length}</strong> reports
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredReports.length}
                      rowsPerPage={rowsPerPage}
                      onPageChange={setCurrentPage}
                      onRowsPerPageChange={setRowsPerPage}
                    />
                  </div>
                </section>
              )}

        {/* ==========================================
            VIEW 3: 3-COLUMN REPORT BUILDER WORKSPACE
        ========================================== */}
        {activeTab === 'builder' && (
          <div className="space-y-4 ant-fade-in">
            {/* Builder Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[6px] bg-[#00c2cb]/10 px-2 py-0.5 text-[11px] font-bold text-[#00c2cb]">
                    {builderId ? 'Editing Report' : 'New Custom Report'}
                  </span>
                  <h2 className="text-[18px] font-bold text-[#1f2327]">
                    {builderName.trim() || 'Untitled Report'}
                  </h2>
                </div>
                <p className="text-[12px] text-[#6f777f]">
                  Configure data source, metrics, aggregations, filters, and visualization.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <MainButton
                  variant="Secondary"
                  size="sm"
                  label="Save as Draft"
                  onClick={() => handleSaveReport('Draft')}
                />
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={isGenerating ? <RefreshCw className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
                  label={isGenerating ? 'Generating...' : 'Generate Report'}
                  disabled={isGenerating}
                  onClick={handleGenerateReport}
                />
              </div>
            </div>

            {/* Generation Progress Overlay */}
            {isGenerating && (
              <div className="rounded-[12px] border border-[#00c2cb] bg-[#e6f9fa] p-4 text-center ant-fade-in">
                <div className="flex items-center justify-center gap-2 text-[14px] font-bold text-[#008f95]">
                  <RefreshCw className="size-4 animate-spin" />
                  <span>{generationStep}</span>
                </div>
              </div>
            )}

            {/* 3-Column Layout Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* COLUMN 1: CONFIGURATION CONTROLS (5 COLS) */}
              <div className="lg:col-span-4 space-y-4">
                {/* 1. Report Information */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                      <FileText className="size-4 text-[#00c2cb]" /> 1. Report Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[12px] font-bold text-[#1f2327]">
                        Report Name <span className="text-[#dc2626]">*</span>
                      </label>
                      <input
                        type="text"
                        value={builderName}
                        onChange={(e) => setBuilderName(e.target.value)}
                        placeholder="e.g. Dubai Agent Performance — Monthly"
                        className={cn(
                          'w-full rounded-[8px] border px-3 py-2 text-[13px] outline-none transition-all',
                          builderErrors.name ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#d3d5d7] focus:border-[#00c2cb]'
                        )}
                      />
                      {builderErrors.name && (
                        <p className="text-[11px] text-[#dc2626] mt-0.5">{builderErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6f777f]">
                        Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={builderDescription}
                        onChange={(e) => setBuilderDescription(e.target.value)}
                        placeholder="Brief summary of what this report tracks..."
                        className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Data Source */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                      <Layers className="size-4 text-[#00c2cb]" /> 2. Data Source
                    </h3>
                    <span className="text-[11px] font-semibold text-[#00c2cb]">{builderSource}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(DATA_SOURCES_CONFIG) as DataSourceType[]).map((src) => {
                      const Icon = DATA_SOURCES_CONFIG[src].icon
                      const isSelected = builderSource === src
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => {
                            setBuilderSource(src)
                            setBuilderSecondarySource(undefined)
                            // Set default metrics for this source
                            const defaults = DATA_SOURCES_CONFIG[src].metrics.slice(0, 2).map((m) => m.name)
                            setBuilderMetrics(defaults)
                            const aggs: Record<string, AggregationType> = {}
                            DATA_SOURCES_CONFIG[src].metrics.slice(0, 2).forEach((m) => {
                              aggs[m.name] = m.defaultAgg
                            })
                            setBuilderMetricAggs(aggs)
                            setBuilderDimensions([DATA_SOURCES_CONFIG[src].dimensions[0] || 'Category'])
                          }}
                          className={cn(
                            'flex flex-col items-center justify-center rounded-[8px] border p-2.5 text-center transition-all',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb] font-bold shadow-2xs'
                              : 'border-[#d3d5d7] bg-[#fafbfc] text-[#4b5563] hover:border-[#00c2cb]/50 hover:bg-white'
                          )}
                        >
                          <Icon className="size-4 mb-1" />
                          <span className="text-[11px]">{src}</span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[11px] text-[#6f777f]">{activeSourceConfig.description}</p>
                </div>

                {/* 3. Metrics & Aggregations */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                      <BarChart3 className="size-4 text-[#00c2cb]" /> 3. Metrics (What to measure)
                    </h3>
                    <span className="text-[11px] text-[#6f777f]">{builderMetrics.length} selected</span>
                  </div>

                  <div className="space-y-2">
                    {activeSourceConfig.metrics.map((m) => {
                      const isChecked = builderMetrics.includes(m.name)
                      const currentAgg = builderMetricAggs[m.name] || m.defaultAgg
                      return (
                        <div
                          key={m.name}
                          className={cn(
                            'flex items-center justify-between rounded-[8px] border p-2 text-[12px] transition-all',
                            isChecked ? 'border-[#00c2cb]/40 bg-[#00c2cb]/5' : 'border-[#eef0f2] bg-[#fafbfc]'
                          )}
                        >
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBuilderMetrics([...builderMetrics, m.name])
                                  setBuilderMetricAggs({ ...builderMetricAggs, [m.name]: m.defaultAgg })
                                } else {
                                  setBuilderMetrics(builderMetrics.filter((name) => name !== m.name))
                                }
                              }}
                              className="size-3.5 rounded text-[#00c2cb] focus:ring-[#00c2cb]"
                            />
                            <span className={cn('font-medium', isChecked ? 'text-[#1f2327] font-bold' : 'text-[#6f777f]')}>
                              {m.name}
                            </span>
                          </label>

                          {isChecked && (
                            <select
                              value={currentAgg}
                              onChange={(e) => {
                                setBuilderMetricAggs({
                                  ...builderMetricAggs,
                                  [m.name]: e.target.value as AggregationType,
                                })
                              }}
                              className="rounded-[6px] border border-[#d3d5d7] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#1f2327] outline-none"
                            >
                              {m.allowedAggs.map((agg) => (
                                <option key={agg} value={agg}>
                                  {agg}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 4. Dimensions & Grouping */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                      <SlidersHorizontal className="size-4 text-[#00c2cb]" /> 4. Dimensions (Group by)
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeSourceConfig.dimensions.map((dim) => {
                      const isSelected = builderDimensions.includes(dim)
                      return (
                        <button
                          key={dim}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (builderDimensions.length > 1) {
                                setBuilderDimensions(builderDimensions.filter((d) => d !== dim))
                              }
                            } else {
                              setBuilderDimensions([...builderDimensions, dim])
                            }
                          }}
                          className={cn(
                            'rounded-[6px] border px-2.5 py-1 text-[11px] font-semibold transition-all',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#00c2cb] text-white'
                              : 'border-[#d3d5d7] bg-white text-[#4b5563] hover:border-[#00c2cb]'
                          )}
                        >
                          {dim}
                        </button>
                      )
                    })}
                  </div>

                  {builderDimensions.includes('Date') && (
                    <div className="pt-2 border-t border-[#eef0f2] flex items-center justify-between">
                      <span className="text-[11px] text-[#6f777f]">Date Grouping:</span>
                      <div className="flex items-center gap-1">
                        {(['Day', 'Week', 'Month', 'Quarter', 'Year'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setBuilderDateGrouping(g)}
                            className={cn(
                              'rounded-[4px] px-2 py-0.5 text-[10px] font-bold transition-all',
                              builderDateGrouping === g
                                ? 'bg-[#1f2327] text-white'
                                : 'bg-[#eef0f2] text-[#6f777f] hover:bg-[#d3d5d7]'
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Date Range & Filters */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                      <Calendar className="size-4 text-[#00c2cb]" /> 5. Date Range & Filters
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(['Today', 'Yesterday', '7D', '30D', '90D', '12M', 'YTD', 'Custom'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setBuilderDatePreset(p)}
                        className={cn(
                          'rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-all',
                          builderDatePreset === p
                            ? 'bg-[#00c2cb] text-white'
                            : 'bg-[#f4f5f6] text-[#6f777f] hover:bg-[#eef0f2]'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-[#6f777f] flex items-center justify-between pt-1">
                    <span>Timezone: <strong>GST (UTC+4)</strong></span>
                    <span>Filter Mode: <strong>AND</strong></span>
                  </div>
                </div>

                {/* 6. Visualization Selector */}
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                      <PieChart className="size-4 text-[#00c2cb]" /> 6. Visualization
                    </h3>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { type: 'Bar Chart', icon: BarChart3 },
                      { type: 'Line Chart', icon: LineChartIcon },
                      { type: 'Area Chart', icon: Sparkles },
                      { type: 'Donut Chart', icon: PieChart },
                      { type: 'Table', icon: TableIcon },
                      { type: 'KPI', icon: Zap },
                      { type: 'Funnel', icon: Flame },
                    ].map((v) => {
                      const Icon = v.icon
                      const isSelected = builderVisualization === v.type
                      return (
                        <button
                          key={v.type}
                          type="button"
                          onClick={() => setBuilderVisualization(v.type as VisualizationType)}
                          className={cn(
                            'flex flex-col items-center justify-center rounded-[8px] border p-2 text-center transition-all',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb] font-bold'
                              : 'border-[#d3d5d7] bg-white text-[#6f777f] hover:border-[#00c2cb]'
                          )}
                        >
                          <Icon className="size-4 mb-0.5" />
                          <span className="text-[10px] leading-tight">{v.type}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: LIVE PREVIEW (5 COLS) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 sticky top-4">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1f2327] flex items-center gap-2">
                        <Eye className="size-4 text-[#00c2cb]" /> Live Interactive Preview
                      </h3>
                      <p className="text-[11px] text-[#6f777f]">
                        Rendering {previewData.length * 120} sample records for <strong>{builderSource}</strong>
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e6f9fa] px-2.5 py-0.5 text-[11px] font-bold text-[#008f95]">
                      {builderVisualization}
                    </span>
                  </div>

                  {/* Visualization Rendering Area */}
                  <div className="rounded-[10px] border border-[#eef0f2] bg-[#fafbfc] p-4 min-h-[340px] flex flex-col justify-center">
                    <ReportVisualizer
                      visualization={builderVisualization}
                      data={previewData}
                      dimensionKey={builderDimensions[0] || 'Category'}
                      metricKeys={builderMetrics}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6f777f] pt-1 border-t border-[#eef0f2]">
                    <span>Preset: <strong>{builderDatePreset}</strong></span>
                    <span>Aggregations: <strong>Active</strong></span>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: SUMMARY & QUICK ACTIONS (3 COLS) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-4">
                  <h3 className="text-[14px] font-bold text-[#1f2327] border-b border-[#eef0f2] pb-2">
                    Report Configuration Summary
                  </h3>

                  <div className="space-y-2.5 text-[12px]">
                    <div>
                      <span className="block text-[11px] text-[#6f777f]">Primary Data Source</span>
                      <strong className="text-[#1f2327] flex items-center gap-1">
                        <activeSourceConfig.icon className="size-3.5 text-[#00c2cb]" />
                        {builderSource}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[11px] text-[#6f777f]">Metrics ({builderMetrics.length})</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {builderMetrics.map((m) => (
                          <span
                            key={m}
                            className="rounded-[4px] bg-[#eef0f2] px-1.5 py-0.5 text-[10px] font-medium text-[#4b5563]"
                          >
                            {builderMetricAggs[m] || 'Val'}({m})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-[#6f777f]">Dimensions</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {builderDimensions.map((d) => (
                          <span
                            key={d}
                            className="rounded-[4px] bg-[#00c2cb]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#00c2cb]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-[#6f777f]">Date Range Preset</span>
                      <strong className="text-[#1f2327]">{builderDatePreset}</strong>
                    </div>

                    <div>
                      <span className="block text-[11px] text-[#6f777f]">Visualization</span>
                      <strong className="text-[#1f2327]">{builderVisualization}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#eef0f2] space-y-2">
                    <MainButton
                      variant="Primary"
                      size="sm"
                      className="w-full"
                      iconLeft={<Check className="size-3.5" />}
                      label="Save & Ready"
                      onClick={() => handleSaveReport('Ready')}
                    />
                    <MainButton
                      variant="Secondary"
                      size="sm"
                      className="w-full"
                      label="Cancel"
                      onClick={() => setActiveTab('all')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 4: REPORT DETAILS & INSPECTION
        ========================================== */}
        {activeTab === 'details' && selectedReport && (
          <div className="space-y-4 ant-fade-in">
            {/* Details Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-[6px] bg-[#00c2cb]/10 px-2 py-0.5 text-[11px] font-bold text-[#00c2cb]">
                    {selectedReport.id}
                  </span>
                  <h2 className="text-[20px] font-bold text-[#1f2327]">{selectedReport.name}</h2>
                  <FigmaStatusBadge
                    status={
                      selectedReport.status === 'Ready' || selectedReport.status === 'Completed'
                        ? 'Completed'
                        : selectedReport.status === 'Scheduled'
                        ? 'In progress'
                        : selectedReport.status === 'Draft'
                        ? 'Pending'
                        : 'Cancelled'
                    }
                  />
                </div>
                <p className="text-[12px] text-[#6f777f]">{selectedReport.description}</p>
                <div className="flex items-center gap-4 text-[11px] text-[#6f777f] pt-1">
                  <span>Author: <strong className="text-[#1f2327]">{selectedReport.createdBy}</strong></span>
                  <span>Created: <strong className="text-[#1f2327]">{selectedReport.createdDate}</strong></span>
                  <span>Last Generated: <strong className="text-[#1f2327]">{selectedReport.lastGenerated}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MainButton
                  variant="Secondary"
                  size="sm"
                  iconLeft={<Edit className="size-3.5" />}
                  label="Edit in Builder"
                  onClick={() => openEditReport(selectedReport)}
                />
                <MainButton
                  variant="Secondary"
                  size="sm"
                  iconLeft={<Download className="size-3.5" />}
                  label="Export Data"
                  onClick={() => setExportModalReport(selectedReport)}
                />
                <MainButton
                  variant="Secondary"
                  size="sm"
                  iconLeft={<Clock className="size-3.5" />}
                  label="Schedule"
                  onClick={() => setScheduleModalReport(selectedReport)}
                />
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={<Play className="size-3.5" />}
                  label="Generate Now"
                  onClick={() => {
                    toast({
                      variant: 'success',
                      title: 'Report Regeneration Started',
                      description: 'Fresh dataset compiled from production servers.',
                    })
                  }}
                />
              </div>
            </div>

            {/* Details Tabs */}
            <div className="flex items-center gap-2 border-b border-[#d3d5d7] pb-2">
              {(['overview', 'data', 'visualization', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailsTab(tab)}
                  className={cn(
                    'rounded-[8px] px-4 py-1.5 text-[13px] font-bold capitalize transition-colors',
                    detailsTab === tab
                      ? 'bg-[#00c2cb] text-white shadow-2xs'
                      : 'bg-white text-[#6f777f] hover:bg-[#f4f5f6] hover:text-[#1f2327]'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            {detailsTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
                  <h3 className="text-[14px] font-bold text-[#1f2327] border-b border-[#eef0f2] pb-2">
                    Report Parameters
                  </h3>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                      <span className="text-[#6f777f]">Data Source:</span>
                      <strong className="text-[#1f2327]">{selectedReport.dataSource}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                      <span className="text-[#6f777f]">Metrics:</span>
                      <strong className="text-[#1f2327]">{selectedReport.metrics.join(', ')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                      <span className="text-[#6f777f]">Dimensions:</span>
                      <strong className="text-[#1f2327]">{selectedReport.dimensions.join(', ')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                      <span className="text-[#6f777f]">Date Preset:</span>
                      <strong className="text-[#1f2327]">{selectedReport.datePreset}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#6f777f]">Default Visualization:</span>
                      <strong className="text-[#00c2cb]">{selectedReport.visualization}</strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
                  <h3 className="text-[14px] font-bold text-[#1f2327] border-b border-[#eef0f2] pb-2">
                    Automated Scheduling Status
                  </h3>
                  {selectedReport.schedule ? (
                    <div className="space-y-2 text-[13px]">
                      <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                        <span className="text-[#6f777f]">Frequency:</span>
                        <strong className="text-[#1f2327]">{selectedReport.schedule.frequency}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                        <span className="text-[#6f777f]">Time & Timezone:</span>
                        <strong className="text-[#1f2327]">{selectedReport.schedule.time} {selectedReport.schedule.timezone}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                        <span className="text-[#6f777f]">Dispatch Format:</span>
                        <strong className="text-[#00c2cb]">{selectedReport.schedule.format}</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#6f777f]">Next Run:</span>
                        <strong className="text-[#1f2327]">{selectedReport.schedule.nextRun}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[#6f777f] space-y-2">
                      <Clock className="size-6 text-[#d3d5d7] mx-auto" />
                      <p className="text-[13px]">No recurring schedule configured.</p>
                      <MainButton
                        variant="Secondary"
                        size="sm"
                        label="Set Schedule"
                        onClick={() => setScheduleModalReport(selectedReport)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {detailsTab === 'data' && (
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-[#1f2327]">
                    Compiled Dataset ({selectedReport.recordsCount.toLocaleString()} Records)
                  </h3>
                  <MainButton
                    variant="Secondary"
                    size="sm"
                    iconLeft={<Download className="size-3" />}
                    label="Download CSV"
                    onClick={() => setExportModalReport(selectedReport)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#d3d5d7] bg-[#f8f9fa] text-[11px] font-bold uppercase text-[#6f777f]">
                        <th className="py-2.5 px-3">{selectedReport.dimensions[0] || 'Dimension'}</th>
                        {selectedReport.metrics.map((m) => (
                          <th key={m} className="py-2.5 px-3 text-right">
                            {m}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef0f2]">
                      {generatePreviewData(selectedReport.dataSource, selectedReport.metrics, selectedReport.dimensions).map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#fafbfc]">
                          <td className="py-2.5 px-3 font-semibold text-[#1f2327]">
                            {String(row[selectedReport.dimensions[0] || 'Category'])}
                          </td>
                          {selectedReport.metrics.map((m) => (
                            <td key={m} className="py-2.5 px-3 text-right font-medium text-[#4b5563]">
                              {typeof (row as Record<string, unknown>)[m] === 'number'
                                ? ((row as Record<string, unknown>)[m] as number).toLocaleString()
                                : String((row as Record<string, unknown>)[m] ?? 0)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {detailsTab === 'visualization' && (
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-[#1f2327]">
                    Visualization Chart
                  </h3>
                  <div className="flex items-center gap-1">
                    {(['Bar Chart', 'Line Chart', 'Donut Chart', 'Table'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setDetailsVisualization(v)}
                        className={cn(
                          'rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-all',
                          detailsVisualization === v
                            ? 'bg-[#00c2cb] text-white'
                            : 'bg-[#f4f5f6] text-[#6f777f] hover:bg-[#eef0f2]'
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#eef0f2] bg-[#fafbfc] p-4 min-h-[320px] flex flex-col justify-center">
                  <ReportVisualizer
                    visualization={detailsVisualization}
                    data={generatePreviewData(selectedReport.dataSource, selectedReport.metrics, selectedReport.dimensions)}
                    dimensionKey={selectedReport.dimensions[0] || 'Category'}
                    metricKeys={selectedReport.metrics}
                  />
                </div>
              </div>
            )}

            {detailsTab === 'history' && (
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <h3 className="text-[14px] font-bold text-[#1f2327]">
                  Report Audit Trail & Modification History
                </h3>

                <div className="space-y-3">
                  {auditLogs
                    .filter((a) => a.reportId === selectedReport.id)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between rounded-[8px] border border-[#eef0f2] p-3 text-[12px]"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded-[4px] bg-[#00c2cb]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#00c2cb]">
                              {log.action}
                            </span>
                            <strong className="text-[#1f2327]">{log.actor}</strong>
                          </div>
                          <p className="text-[#6f777f]">{log.details}</p>
                        </div>
                        <span className="text-[11px] text-[#9ca3af]">{log.date} at {log.time}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODALS: EXPORT, SCHEDULE, DELETE
        ========================================== */}
        {/* Export Dialog */}
        {exportModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                  <Download className="size-4 text-[#00c2cb]" /> Export Report Data
                </h3>
                <button onClick={() => setExportModalReport(null)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="block text-[11px] text-[#6f777f]">Target Report</span>
                  <strong className="text-[14px] text-[#1f2327]">{exportModalReport.name}</strong>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1.5">Export Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['CSV', 'Excel', 'PDF'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportFormat(fmt)}
                        className={cn(
                          'flex items-center justify-center gap-1.5 rounded-[8px] border p-2 text-[12px] font-bold transition-all',
                          exportFormat === fmt
                            ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb]'
                            : 'border-[#d3d5d7] bg-white text-[#6f777f] hover:border-[#00c2cb]'
                        )}
                      >
                        <FileSpreadsheet className="size-3.5" /> {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1.5">Export Scope</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExportScope('full')}
                      className={cn(
                        'rounded-[8px] border p-2 text-left text-[12px] transition-all',
                        exportScope === 'full'
                          ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb] font-bold'
                          : 'border-[#d3d5d7] text-[#6f777f]'
                      )}
                    >
                      <span className="block">Full Dataset</span>
                      <span className="text-[10px] font-normal">~{exportModalReport.recordsCount.toLocaleString()} rows</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportScope('current')}
                      className={cn(
                        'rounded-[8px] border p-2 text-left text-[12px] transition-all',
                        exportScope === 'current'
                          ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb] font-bold'
                          : 'border-[#d3d5d7] text-[#6f777f]'
                      )}
                    >
                      <span className="block">Current Summary</span>
                      <span className="text-[10px] font-normal">Aggregated metrics</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton
                  variant="Secondary"
                  size="sm"
                  label="Cancel"
                  onClick={() => setExportModalReport(null)}
                />
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={isExporting ? <RefreshCw className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                  label={isExporting ? 'Generating Export...' : `Download ${exportFormat}`}
                  disabled={isExporting}
                  onClick={handleExecuteExport}
                />
              </div>
            </div>
          </div>
        )}

        {/* Schedule Dialog */}
        {scheduleModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                  <Clock className="size-4 text-[#00c2cb]" /> Configure Automated Schedule
                </h3>
                <button onClick={() => setScheduleModalReport(null)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Daily', 'Weekly', 'Monthly'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setSchedFrequency(freq)}
                        className={cn(
                          'rounded-[8px] border p-2 text-[12px] font-bold text-center transition-all',
                          schedFrequency === freq
                            ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb]'
                            : 'border-[#d3d5d7] bg-white text-[#6f777f]'
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Dispatch Time</label>
                    <input
                      type="text"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Format</label>
                    <select
                      value={schedFormat}
                      onChange={(e) => setSchedFormat(e.target.value as 'PDF' | 'Excel' | 'CSV')}
                      className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                    >
                      <option value="PDF">PDF Report</option>
                      <option value="Excel">Excel (XLSX)</option>
                      <option value="CSV">CSV Data</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">
                    Recipients (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={schedRecipients}
                    onChange={(e) => setSchedRecipients(e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton
                  variant="Secondary"
                  size="sm"
                  label="Cancel"
                  onClick={() => setScheduleModalReport(null)}
                />
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={<Check className="size-3.5" />}
                  label="Save Schedule"
                  onClick={handleSaveSchedule}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626]">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1f2327]">Delete this report?</h3>
                  <p className="text-[12px] text-[#6f777f]">This action will permanently remove the configuration.</p>
                </div>
              </div>

              {deleteConfirmReport.schedule && (
                <div className="rounded-[8px] bg-[#fef2f2] p-2.5 text-[11px] font-medium text-[#dc2626]">
                  ⚠️ Warning: This report has an active recurring schedule that will also be terminated.
                </div>
              )}

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton
                  variant="Secondary"
                  size="sm"
                  label="Cancel"
                  onClick={() => setDeleteConfirmReport(null)}
                />
                <MainButton
                  variant="Primary"
                  size="sm"
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                  label="Delete Report"
                  onClick={() => handleDelete(deleteConfirmReport)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}

export function CustomReportsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={<div className="p-8 text-center text-[#6f777f]">Loading Reports Module...</div>}>
        <ReportsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
