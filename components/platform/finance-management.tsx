'use client'

import * as React from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Download,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  Building,
  Shield,
  ShieldCheck,
  Zap,
  Tag,
  Receipt,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Plus,
  AlertCircle,
  Server,
  Activity,
  History,
  Check,
  Copy,
  ExternalLink,
  Percent,
  Sliders,
  Wallet,
  Lock,
  Calendar,
  Send,
  HelpCircle,
  Globe,
  Archive,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { MainButton } from '@/components/ui/main-button'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { TableAvatar } from '@/components/ui/table-avatar'
import { Dropdown } from '@/components/dashboard/menu'
import { MetricCard } from '@/components/ui/metric-card'
import { cn, exportToCsv } from '@/lib/utils'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'


// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type TransactionStatus =
  | 'Successful'
  | 'Pending'
  | 'Failed'
  | 'Refunded'
  | 'Chargeback'

export type RefundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed'

export type GatewayHealthStatus = 'Healthy' | 'Degraded' | 'Offline' | 'Configuration Required'

export type ReconciliationStatus = 'Matched' | 'Warning' | 'Mismatch'

export interface FinancialTransaction {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  planName: string
  amount: number
  grossAmount: number
  discount: number
  tax: number
  netAmount: number
  currency: string
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Google Pay' | 'Bank Transfer'
  cardLast4?: string
  gateway: 'Stripe UAE' | 'Checkout.com' | 'Network International'
  status: TransactionStatus
  date: string
  time: string
  timezone: string
  invoiceNumber: string
  gatewayTxnId: string
  paymentIntentId: string
  country: string
  timeline: {
    stage: string
    time: string
    status: 'success' | 'failed' | 'pending'
    detail: string
  }[]
}

export interface RefundRecord {
  id: string
  transactionId: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currency: string
  reason: string
  status: RefundStatus
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  gateway: string
  country: string
  invoiceNumber: string
}

export interface PaymentMethodStats {
  id: string
  method: string
  provider: string
  transactionsCount: number
  successRate: number
  volumeAed: number
  usagePercent: number
  enabled: boolean
}

export interface PaymentGatewayStats {
  id: string
  name: string
  provider: string
  status: GatewayHealthStatus
  environment: 'Production (Live)' | 'Sandbox / Test'
  successRate: number
  failureRate: number
  lastWebhook: string
  lastTransaction: string
  volumeAed: number
  latencyMs: number
}

export interface TaxCountryReport {
  country: string
  taxRate: string
  taxableRevenue: number
  vatCollected: number
  transactionsCount: number
  refundsTax: number
  netTax: number
}

export interface GatewayLogItem {
  id: string
  timestamp: string
  gateway: string
  event: string
  transactionId: string
  status: '200 OK' | '400 Bad Request' | '402 Payment Required' | '500 Error'
  durationMs: number
  payloadSnippet: string
}

export interface ReconciliationItem {
  id: string
  period: string
  duseatCount: number
  duseatTotalAed: number
  gatewayCount: number
  gatewayTotalAed: number
  differenceAed: number
  status: ReconciliationStatus
  notes: string
}

export interface FinancialAuditLog {
  id: string
  event: string
  actor: string
  role: string
  entity: string
  prevValue?: string
  newValue?: string
  date: string
  ip: string
}

// ============================================================================
// INITIAL SAMPLE DATA
// ============================================================================

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TXN-98410',
    userId: 'USR-1048',
    userName: 'Amal Haddad',
    userEmail: 'amal.haddad@palmproperties.ae',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    planName: 'Power Agent (Monthly)',
    amount: 2499,
    grossAmount: 2499,
    discount: 374.85,
    tax: 106.21,
    netAmount: 2230.36,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '4821',
    gateway: 'Stripe UAE',
    status: 'Successful',
    date: '08 Sep 2026',
    time: '10:14 AM',
    timezone: 'GST (+04:00)',
    invoiceNumber: 'INV-2026-1048',
    gatewayTxnId: 'ch_3N981A4bXvKYlo2C11p9',
    paymentIntentId: 'pi_3N981A4bXvKYlo2C11p9_secret',
    country: 'United Arab Emirates',
    timeline: [
      { stage: 'Payment Initiated', time: '10:14:02 AM', status: 'success', detail: 'Checkout session opened via web client' },
      { stage: '3D Secure Authorized', time: '10:14:18 AM', status: 'success', detail: 'Emirates NBD OTP verified' },
      { stage: 'Payment Captured', time: '10:14:20 AM', status: 'success', detail: 'Stripe balance credit confirmed' },
      { stage: 'Invoice Generated', time: '10:14:22 AM', status: 'success', detail: 'Tax invoice INV-2026-1048 sent to user' },
    ],
  },
  {
    id: 'TXN-98409',
    userId: 'USR-1047',
    userName: 'Omar Nasser',
    userEmail: 'omar.nasser@avenue.ae',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    planName: 'Elite Broker (Monthly)',
    amount: 1599,
    grossAmount: 1599,
    discount: 0,
    tax: 79.95,
    netAmount: 1519.05,
    currency: 'AED',
    paymentMethod: 'Apple Pay',
    cardLast4: '9102',
    gateway: 'Stripe UAE',
    status: 'Successful',
    date: '08 Sep 2026',
    time: '09:42 AM',
    timezone: 'GST (+04:00)',
    invoiceNumber: 'INV-2026-1047',
    gatewayTxnId: 'ch_3N980Z9kXvKYlo2C22q8',
    paymentIntentId: 'pi_3N980Z9kXvKYlo2C22q8_secret',
    country: 'United Arab Emirates',
    timeline: [
      { stage: 'Payment Initiated', time: '09:42:01 AM', status: 'success', detail: 'Biometric Apple Pay token authorized' },
      { stage: 'Payment Captured', time: '09:42:04 AM', status: 'success', detail: 'AED 1,599.00 processed' },
    ],
  },
  {
    id: 'TXN-98408',
    userId: 'USR-1046',
    userName: 'Youssef Ali',
    userEmail: 'youssef.ali@dubaimarina.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    planName: 'Pro Agent (Monthly)',
    amount: 799,
    grossAmount: 799,
    discount: 0,
    tax: 39.95,
    netAmount: 759.05,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '4242',
    gateway: 'Stripe UAE',
    status: 'Failed',
    date: '08 Sep 2026',
    time: '08:15 AM',
    timezone: 'GST (+04:00)',
    invoiceNumber: 'INV-2026-1046',
    gatewayTxnId: 'ch_3N978X1bXvKYlo2C44w1',
    paymentIntentId: 'pi_3N978X1bXvKYlo2C44w1_secret',
    country: 'United Arab Emirates',
    timeline: [
      { stage: 'Payment Initiated', time: '08:15:00 AM', status: 'success', detail: 'Recurring renewal attempted' },
      { stage: 'Payment Declined', time: '08:15:03 AM', status: 'failed', detail: 'Card declined: Insufficient funds (code: card_declined)' },
      { stage: 'Grace Period Triggered', time: '08:15:05 AM', status: 'pending', detail: '7-day retry schedule started' },
    ],
  },
  {
    id: 'TXN-98407',
    userId: 'USR-1045',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@downtownre.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    planName: 'Enterprise Brokerage (Annual)',
    amount: 49990,
    grossAmount: 49990,
    discount: 5000,
    tax: 2249.5,
    netAmount: 47240.5,
    currency: 'AED',
    paymentMethod: 'Bank Transfer',
    gateway: 'Network International',
    status: 'Successful',
    date: '07 Sep 2026',
    time: '04:30 PM',
    timezone: 'GST (+04:00)',
    invoiceNumber: 'INV-2026-081',
    gatewayTxnId: 'NI_REF_99418291048',
    paymentIntentId: 'pi_NI_99418291048',
    country: 'United Kingdom',
    timeline: [
      { stage: 'Wire Transfer Initiated', time: '02:00 PM', status: 'success', detail: 'Corporate IBAN transfer matched' },
      { stage: 'Reconciliation Verified', time: '04:30 PM', status: 'success', detail: 'Finance team approved deposit AED 49,990.00' },
    ],
  },
  {
    id: 'TXN-98406',
    userId: 'USR-1043',
    userName: 'Tariq Mahmoud',
    userEmail: 'tariq@gulfre.com',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    planName: 'Pro Agent (Monthly)',
    amount: 799,
    grossAmount: 799,
    discount: 0,
    tax: 39.95,
    netAmount: 0,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '1099',
    gateway: 'Checkout.com',
    status: 'Refunded',
    date: '06 Sep 2026',
    time: '02:18 PM',
    timezone: 'GST (+04:00)',
    invoiceNumber: 'INV-2026-1042',
    gatewayTxnId: 'ch_checkout_88291048',
    paymentIntentId: 'pi_checkout_88291048',
    country: 'Saudi Arabia',
    timeline: [
      { stage: 'Payment Captured', time: '01 Sep 2026', status: 'success', detail: 'AED 799.00 paid' },
      { stage: 'Refund Requested', time: '05 Sep 2026', status: 'pending', detail: 'Customer requested 7-day money back' },
      { stage: 'Refund Completed', time: '06 Sep 2026, 02:18 PM', status: 'success', detail: 'AED 799.00 reversed to card' },
    ],
  },
]

const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: 'REF-2048',
    transactionId: 'TXN-98406',
    userId: 'USR-1043',
    userName: 'Tariq Mahmoud',
    userEmail: 'tariq@gulfre.com',
    amount: 799,
    currency: 'AED',
    reason: 'Accidental duplicate plan purchase within trial period',
    status: 'Completed',
    requestedBy: 'Tariq Mahmoud',
    requestedAt: '05 Sep 2026, 11:20 AM',
    approvedBy: 'Amal Haddad (Finance Lead)',
    approvedAt: '06 Sep 2026, 02:18 PM',
    gateway: 'Checkout.com',
    country: 'Saudi Arabia',
    invoiceNumber: 'INV-2026-1042',
  },
  {
    id: 'REF-2047',
    transactionId: 'TXN-98399',
    userId: 'USR-1039',
    userName: 'Noura Salem',
    userEmail: 'noura@downtowndxb.ae',
    amount: 1599,
    currency: 'AED',
    reason: 'Billing dispute over upgrade proration calculation',
    status: 'Pending',
    requestedBy: 'Noura Salem',
    requestedAt: '08 Sep 2026, 09:10 AM',
    gateway: 'Stripe UAE',
    country: 'United Arab Emirates',
    invoiceNumber: 'INV-2026-1039',
  },
]

const PAYMENT_METHODS_DATA: PaymentMethodStats[] = [
  {
    id: 'pm-1',
    method: 'Credit & Debit Cards (Visa / Mastercard)',
    provider: 'Stripe UAE & Checkout.com',
    transactionsCount: 14820,
    successRate: 98.4,
    volumeAed: 1845200,
    usagePercent: 68.5,
    enabled: true,
  },
  {
    id: 'pm-2',
    method: 'Apple Pay',
    provider: 'Stripe UAE',
    transactionsCount: 4120,
    successRate: 99.2,
    volumeAed: 524000,
    usagePercent: 19.5,
    enabled: true,
  },
  {
    id: 'pm-3',
    method: 'Google Pay',
    provider: 'Stripe UAE',
    transactionsCount: 1240,
    successRate: 98.8,
    volumeAed: 168000,
    usagePercent: 6.2,
    enabled: true,
  },
  {
    id: 'pm-4',
    method: 'Corporate Bank Transfer / Wire',
    provider: 'Network International (Direct Settlement)',
    transactionsCount: 210,
    successRate: 100.0,
    volumeAed: 642000,
    usagePercent: 5.8,
    enabled: true,
  },
]

const PAYMENT_GATEWAYS_DATA: PaymentGatewayStats[] = [
  {
    id: 'gw-1',
    name: 'Stripe UAE (Primary Gateway)',
    provider: 'Stripe Inc.',
    status: 'Healthy',
    environment: 'Production (Live)',
    successRate: 98.7,
    failureRate: 1.3,
    lastWebhook: '08 Sep 2026, 10:14:22 AM GST',
    lastTransaction: '08 Sep 2026, 10:14:20 AM GST',
    volumeAed: 2482000,
    latencyMs: 142,
  },
  {
    id: 'gw-2',
    name: 'Checkout.com (GCC Regional)',
    provider: 'Checkout Ltd.',
    status: 'Healthy',
    environment: 'Production (Live)',
    successRate: 98.2,
    failureRate: 1.8,
    lastWebhook: '08 Sep 2026, 09:45:10 AM GST',
    lastTransaction: '08 Sep 2026, 09:45:08 AM GST',
    volumeAed: 540000,
    latencyMs: 168,
  },
  {
    id: 'gw-3',
    name: 'Network International (B2B Wire / Escrow)',
    provider: 'Network International UAE',
    status: 'Healthy',
    environment: 'Production (Live)',
    successRate: 99.8,
    failureRate: 0.2,
    lastWebhook: '07 Sep 2026, 04:30:15 PM GST',
    lastTransaction: '07 Sep 2026, 04:30:00 PM GST',
    volumeAed: 642000,
    latencyMs: 95,
  },
]

const TAX_COUNTRY_REPORTS: TaxCountryReport[] = [
  {
    country: 'United Arab Emirates',
    taxRate: '5% (UAE VAT)',
    taxableRevenue: 2482000,
    vatCollected: 124100,
    transactionsCount: 1820,
    refundsTax: 39.95,
    netTax: 124060.05,
  },
  {
    country: 'Saudi Arabia',
    taxRate: '15% (KSA VAT)',
    taxableRevenue: 480000,
    vatCollected: 72000,
    transactionsCount: 340,
    refundsTax: 119.85,
    netTax: 71880.15,
  },
  {
    country: 'United Kingdom / EU (Reverse Charge)',
    taxRate: '0% (Exempt B2B)',
    taxableRevenue: 210000,
    vatCollected: 0,
    transactionsCount: 84,
    refundsTax: 0,
    netTax: 0,
  },
]

const GATEWAY_LOGS_DATA: GatewayLogItem[] = [
  {
    id: 'LOG-8819',
    timestamp: '08 Sep 2026, 10:14:22 AM GST',
    gateway: 'Stripe UAE',
    event: 'charge.succeeded',
    transactionId: 'TXN-98410',
    status: '200 OK',
    durationMs: 142,
    payloadSnippet: '{"id":"ch_3N981A4bXvKYlo2C11p9","amount":249900,"currency":"aed","status":"succeeded","card_last4":"4821"}',
  },
  {
    id: 'LOG-8818',
    timestamp: '08 Sep 2026, 09:42:04 AM GST',
    gateway: 'Stripe UAE',
    event: 'payment_intent.succeeded',
    transactionId: 'TXN-98409',
    status: '200 OK',
    durationMs: 118,
    payloadSnippet: '{"id":"pi_3N980Z9kXvKYlo2C22q8","amount":159900,"currency":"aed","method":"apple_pay"}',
  },
  {
    id: 'LOG-8817',
    timestamp: '08 Sep 2026, 08:15:03 AM GST',
    gateway: 'Stripe UAE',
    event: 'charge.failed',
    transactionId: 'TXN-98408',
    status: '402 Payment Required',
    durationMs: 245,
    payloadSnippet: '{"id":"ch_3N978X1bXvKYlo2C44w1","decline_code":"insufficient_funds","failure_message":"Your card has insufficient funds."}',
  },
]

const RECONCILIATION_DATA: ReconciliationItem[] = [
  {
    id: 'REC-2026-08',
    period: 'August 2026 (Monthly Closing)',
    duseatCount: 1942,
    duseatTotalAed: 2840500,
    gatewayCount: 1942,
    gatewayTotalAed: 2840500,
    differenceAed: 0,
    status: 'Matched',
    notes: '100% matched across Stripe UAE, Checkout.com, and Network Int.',
  },
  {
    id: 'REC-2026-07',
    period: 'July 2026 (Monthly Closing)',
    duseatCount: 1810,
    duseatTotalAed: 2620100,
    gatewayCount: 1810,
    gatewayTotalAed: 2620100,
    differenceAed: 0,
    status: 'Matched',
    notes: 'Audited and approved by Chief Financial Officer.',
  },
  {
    id: 'REC-2026-09-CURR',
    period: 'September 2026 (Current MTD)',
    duseatCount: 482,
    duseatTotalAed: 684200,
    gatewayCount: 482,
    gatewayTotalAed: 684200,
    differenceAed: 0,
    status: 'Matched',
    notes: 'Live automated daily settlement reconciliation active.',
  },
]

const AUDIT_LOGS_DATA: FinancialAuditLog[] = [
  {
    id: 'AUD-991',
    event: 'Refund Approved & Processed',
    actor: 'Amal Haddad',
    role: 'Finance Manager',
    entity: 'Refund #REF-2048 (AED 799.00)',
    prevValue: 'Pending',
    newValue: 'Completed',
    date: '06 Sep 2026, 02:18 PM GST',
    ip: '192.168.1.104 (Office VPN)',
  },
  {
    id: 'AUD-990',
    event: 'Wire Transfer Deposit Verified',
    actor: 'Zayd Ibrahim',
    role: 'Senior Accountant',
    entity: 'Transaction #TXN-98407 (AED 49,990.00)',
    prevValue: 'Pending Verification',
    newValue: 'Successful',
    date: '07 Sep 2026, 04:30 PM GST',
    ip: '192.168.1.108 (Office VPN)',
  },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function FinanceManagementInner() {
  const { toast } = useToast()

  // Navigation Tab State
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'transactions' | 'refunds' | 'methods' | 'gateways' | 'taxes' | 'reconciliation' | 'logs' | 'audit'
  >('overview')

  // Analytics Metric Selector (Spec 11.2)
  const [activeMetric, setActiveMetric] = React.useState<'Revenue' | 'Transactions' | 'Refunds' | 'Net Revenue'>('Revenue')
  const [timeRange, setTimeRange] = React.useState<'7D' | '30D' | '90D' | '12M'>('30D')

  // Data States
  const [transactions, setTransactions] = React.useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS)
  const [refunds, setRefunds] = React.useState<RefundRecord[]>(INITIAL_REFUNDS)
  const [gateways, setGateways] = React.useState<PaymentGatewayStats[]>(PAYMENT_GATEWAYS_DATA)
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethodStats[]>(PAYMENT_METHODS_DATA)

  // Drawer / Details Modal States
  const [selectedTxn, setSelectedTxn] = React.useState<FinancialTransaction | null>(null)
  const [txnDrawerOpen, setTxnDrawerOpen] = React.useState(false)

  const [selectedRefund, setSelectedRefund] = React.useState<RefundRecord | null>(null)
  const [refundModalOpen, setRefundModalOpen] = React.useState(false)

  // Safety Confirmation Dialog States
  const [refundConfirmOpen, setRefundConfirmOpen] = React.useState(false)
  const [refundReason, setRefundReason] = React.useState('')

  const [gatewayConfigOpen, setGatewayConfigOpen] = React.useState(false)
  const [selectedGateway, setSelectedGateway] = React.useState<PaymentGatewayStats | null>(null)

  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<'CSV' | 'Excel' | 'PDF'>('CSV')
  const [exportType, setExportType] = React.useState('Transactions & Revenue')

  // Universal Filter Architecture State
  const [showFilters, setShowFilters] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')
  const [gatewayFilter, setGatewayFilter] = React.useState<string>('All')
  const [methodFilter, setMethodFilter] = React.useState<string>('All')
  const [countryFilter, setCountryFilter] = React.useState<string>('All')

  // Filtered Transactions
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.invoiceNumber.toLowerCase().includes(q) ||
        t.gatewayTxnId.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter
      const matchesGateway = gatewayFilter === 'All' || t.gateway === gatewayFilter
      const matchesMethod = methodFilter === 'All' || t.paymentMethod === methodFilter
      const matchesCountry = countryFilter === 'All' || t.country === countryFilter

      return matchesSearch && matchesStatus && matchesGateway && matchesMethod && matchesCountry
    })
  }, [transactions, searchQuery, statusFilter, gatewayFilter, methodFilter, countryFilter])

  // Count Active Filters
  const activeFilterCount =
    (statusFilter !== 'All' ? 1 : 0) +
    (gatewayFilter !== 'All' ? 1 : 0) +
    (methodFilter !== 'All' ? 1 : 0) +
    (countryFilter !== 'All' ? 1 : 0)

  const clearAllFilters = () => {
    setStatusFilter('All')
    setGatewayFilter('All')
    setMethodFilter('All')
    setCountryFilter('All')
    setSearchQuery('')
  }

  // Calculated Financial Metrics (Spec 11.1 & 11.2)
  const totalGrossRevenue = 3184200
  const totalDiscounts = 42800
  const totalRefundsAed = 1598
  const totalVatCollected = 156100
  const totalNetRevenue = totalGrossRevenue - totalDiscounts - totalRefundsAed - totalVatCollected

  // Export CSV Handler
  const handleExportTransactions = () => {
    const headers = [
      'Transaction ID',
      'User Name',
      'Email',
      'Plan',
      'Gross Amount (AED)',
      'Tax (AED)',
      'Net Amount (AED)',
      'Method',
      'Gateway',
      'Status',
      'Date & Time',
      'Invoice #',
      'Gateway Ref',
    ]
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.userName,
      t.userEmail,
      t.planName,
      t.grossAmount,
      t.tax,
      t.netAmount,
      t.paymentMethod,
      t.gateway,
      t.status,
      `${t.date} ${t.time} ${t.timezone}`,
      t.invoiceNumber,
      t.gatewayTxnId,
    ])
    exportToCsv('finance_transactions_export.csv', headers, rows)
    toast({
      variant: 'success',
      title: 'Financial export generated',
      description: `Downloaded ${filteredTransactions.length} transaction records with tax breakdowns.`,
    })
  }

  // Action Handlers
  const handleOpenTxnDetails = (txn: FinancialTransaction) => {
    setSelectedTxn(txn)
    setTxnDrawerOpen(true)
  }

  const handleRefundConfirm = () => {
    if (!selectedTxn) return
    const updated = transactions.map((t) => {
      if (t.id === selectedTxn.id) {
        return {
          ...t,
          status: 'Refunded' as TransactionStatus,
          timeline: [
            ...t.timeline,
            {
              stage: 'Refund Approved & Processed',
              time: 'Just now',
              status: 'success' as const,
              detail: `AED ${t.amount.toLocaleString()} refunded via ${t.gateway}. Reason: ${refundReason || 'Admin approved'}`,
            },
          ],
        }
      }
      return t
    })

    const newRefund: RefundRecord = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: selectedTxn.id,
      userId: selectedTxn.userId,
      userName: selectedTxn.userName,
      userEmail: selectedTxn.userEmail,
      amount: selectedTxn.amount,
      currency: selectedTxn.currency,
      reason: refundReason || 'Authorized customer refund',
      status: 'Completed',
      requestedBy: 'Super Admin',
      requestedAt: '08 Sep 2026, 10:45 AM GST',
      approvedBy: 'Super Admin',
      approvedAt: '08 Sep 2026, 10:45 AM GST',
      gateway: selectedTxn.gateway,
      country: selectedTxn.country,
      invoiceNumber: selectedTxn.invoiceNumber,
    }

    setTransactions(updated)
    setRefunds([newRefund, ...refunds])
    setSelectedTxn(updated.find((t) => t.id === selectedTxn.id) || null)
    setRefundConfirmOpen(false)
    setRefundReason('')
    toast({
      variant: 'success',
      title: 'Refund processed',
      description: `AED ${selectedTxn.amount.toLocaleString()} refunded to ${selectedTxn.userName}.`,
    })
  }

  const handleTogglePaymentMethod = (pmId: string) => {
    const target = paymentMethods.find((p) => p.id === pmId)
    if (!target) return
    if (target.enabled && target.usagePercent > 50) {
      toast({
        variant: 'info',
        title: 'High Usage Warning',
        description: `${target.method} is currently used by ${target.usagePercent}% of payments. Disabling requires extra caution.`,
      })
    }
    setPaymentMethods(
      paymentMethods.map((p) => (p.id === pmId ? { ...p, enabled: !p.enabled } : p))
    )
    toast({
      variant: 'info',
      title: 'Payment method status updated',
      description: `${target.method} has been ${target.enabled ? 'disabled' : 'enabled'}.`,
    })
  }

  return (
    <PlatformShell
      title="Finance & Revenue Management"
      eyebrow="Financial Operations"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            TOP HEADER CARD (Canonical Users Design Standard)
           ========================================================================= */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Finance & Revenue Operations
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage transactions, reconcile gateway settlements, process refunds, and audit revenue streams.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span>Export Reports</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  toast({
                    variant: 'success',
                    title: 'Reconciliation check complete',
                    description: 'Duseat ledger perfectly matches gateway balances. Zero discrepancies found.',
                  })
                }}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <RefreshCw className="size-4 text-white" />
                <span>Run Reconciliation</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Revenue Today"
              value="AED 32,840"
              trend="+8.4%"
              trendDirection="up"
              icon={DollarSign}
              tone="neutral"
              subtitle="vs AED 30,290 yesterday"
            />
            <MetricCard
              label="Revenue This Week"
              value="AED 194,520"
              trend="+14.2%"
              trendDirection="up"
              icon={TrendingUp}
              tone="info"
              subtitle="vs AED 170,300 last week"
            />
            <MetricCard
              label="Revenue This Month (MTD)"
              value="AED 824,600"
              trend="+18.7%"
              trendDirection="up"
              icon={Wallet}
              tone="brand"
              subtitle="vs AED 694,700 prev month"
            />
            <MetricCard
              label="Revenue This Year (YTD)"
              value="AED 9.84M"
              trend="+28.5%"
              trendDirection="up"
              icon={TrendingUp}
              tone="success"
              subtitle="Ahead of annual pacing"
            />
          </div>
        </header>

        {/* =========================================================================
            1. NAVIGATION SUB-TABS (Overview, Transactions, Refunds, Methods, Gateways, Taxes, Reconciliation, Logs, Audit)
           ========================================================================= */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'overview', label: 'Financial Overview', icon: <TrendingUp className="size-4" /> },
              { id: 'transactions', label: `Transactions (${transactions.length})`, icon: <CreditCard className="size-4" /> },
              { id: 'refunds', label: `Refunds (${refunds.length})`, icon: <RotateCcw className="size-4" /> },
              { id: 'methods', label: 'Payment Methods', icon: <Wallet className="size-4" /> },
              { id: 'gateways', label: 'Gateways & Health', icon: <Server className="size-4" /> },
              { id: 'taxes', label: 'Taxes & VAT', icon: <Percent className="size-4" /> },
              { id: 'reconciliation', label: 'Reconciliation', icon: <ShieldCheck className="size-4" /> },
              { id: 'logs', label: 'Gateway Logs', icon: <Activity className="size-4" /> },
              { id: 'audit', label: 'Audit Trail', icon: <History className="size-4" /> },
            ].map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'inline-flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn select-none',
                    active
                      ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Time Range Selector */}
          {activeTab === 'overview' && (
            <div className="hidden sm:flex items-center rounded-[6px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
              {(['7D', '30D', '90D', '12M'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={cn(
                    'h-[26px] rounded-[4px] px-2.5 text-[11.5px] font-bold transition-all cursor-pointer',
                    timeRange === r
                      ? 'bg-white text-[#1f2327] shadow-2xs'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            2. TAB CONTENT: OVERVIEW (Financial Command Center - Spec 11.1 - 11.3)
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 ant-fade-in">
            {/* Top KPI Row: Standardized Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                label="Revenue Today"
                value="AED 32,840"
                trend="+8.4%"
                trendDirection="up"
                icon={DollarSign}
                tone="neutral"
                subtitle="vs AED 30,290 yesterday"
              />
              <MetricCard
                label="Revenue This Week"
                value="AED 194,520"
                trend="+14.2%"
                trendDirection="up"
                icon={TrendingUp}
                tone="brand"
                subtitle="vs AED 170,300 last week"
              />
              <MetricCard
                label="Revenue This Month (MTD)"
                value="AED 824,600"
                trend="+18.7%"
                trendDirection="up"
                icon={Wallet}
                tone="brand"
                subtitle="vs AED 694,700 prev month"
              />
              <MetricCard
                label="Revenue This Year (YTD)"
                value="AED 9.84M"
                trend="+28.5%"
                trendDirection="up"
                icon={TrendingUp}
                tone="success"
                subtitle="Ahead of annual pacing"
              />
            </div>

            {/* Second KPI Row: Financial Health, MRR, ARR, ARPU, LTV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <span className="text-[12px] font-semibold text-[#6f777f]">MRR / ARR</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-[#1f2327]">AED 824k</span>
                  <span className="text-[12px] text-[#6f777f]">/ AED 9.88M</span>
                </div>
                <p className="mt-1 text-[11px] text-[#12b76a] font-bold">+16.4% normalized MRR growth</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <span className="text-[12px] font-semibold text-[#6f777f]">Refund Rate</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-[#12b76a]">0.05%</span>
                  <span className="text-[11.5px] text-[#8f969e]">(Industry benchmark: 1.5%)</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">AED 1,598 total refunds processed</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <span className="text-[12px] font-semibold text-[#6f777f]">Failed Payment Rate</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-[#f79009]">1.3%</span>
                  <span className="text-[11.5px] text-[#8f969e]">(dunning active)</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">84% auto-recovered via smart retries</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <span className="text-[12px] font-semibold text-[#6f777f]">ARPU & Est. LTV</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-[#00838f]">AED 1,280</span>
                  <span className="text-[12px] text-[#6f777f]">/ AED 24.5k LTV</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">19.1x LTV / CAC efficiency ratio</p>
              </div>
            </div>

            {/* Financial Reconciliation Summary Bar (Spec 11.2 & 11.18) */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-[#f8f9fa] p-4.5 shadow-2xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-bold text-[#1f2327]">
                    Financial Revenue Breakdown & Net Realization
                  </h4>
                  <p className="text-[12px] text-[#6f777f]">
                    Strict accounting separation of Gross volume, Coupons/Discounts, VAT Taxes, and Net Settlement.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-[8px] bg-white border border-[#d3d5d7] px-3 py-2 text-center">
                    <span className="text-[10.5px] font-semibold text-[#6f777f] block">Gross Revenue</span>
                    <span className="text-[14px] font-bold text-[#1f2327]">
                      AED {totalGrossRevenue.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[#8f969e] font-bold">−</span>
                  <div className="rounded-[8px] bg-white border border-[#d3d5d7] px-3 py-2 text-center">
                    <span className="text-[10.5px] font-semibold text-[#6f777f] block">Discounts</span>
                    <span className="text-[14px] font-bold text-[#b54708]">
                      AED {totalDiscounts.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[#8f969e] font-bold">−</span>
                  <div className="rounded-[8px] bg-white border border-[#d3d5d7] px-3 py-2 text-center">
                    <span className="text-[10.5px] font-semibold text-[#6f777f] block">Taxes (VAT)</span>
                    <span className="text-[14px] font-bold text-[#6f777f]">
                      AED {totalVatCollected.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[#8f969e] font-bold">=</span>
                  <div className="rounded-[8px] bg-[#e5f6f7] border border-[#00c2cb] px-4 py-2 text-center">
                    <span className="text-[10.5px] font-bold text-[#00838f] block">Net Realized Revenue</span>
                    <span className="text-[15px] font-bold text-[#00838f]">
                      AED {totalNetRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Revenue Chart over time */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Revenue Timeline & Pacing</h3>
                  <p className="text-[12px] text-[#6f777f]">
                    Select primary financial dimension to visualize trends and seasonality.
                  </p>
                </div>
                {/* Metric Switcher (Spec 11.2) */}
                <div className="flex items-center rounded-[6px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
                  {(['Revenue', 'Transactions', 'Refunds', 'Net Revenue'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setActiveMetric(m)}
                      className={cn(
                        'h-[26px] rounded-[4px] px-2.5 text-[11.5px] font-bold transition-all cursor-pointer',
                        activeMetric === m
                          ? 'bg-white text-[#1f2327] shadow-2xs'
                          : 'text-[#6f777f] hover:text-[#1f2327]'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visual with Recharts */}
              <div className="h-[250px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {activeMetric === 'Transactions' ? (
                    <BarChart
                      data={[
                        { m: 'Jan', val: 1240 },
                        { m: 'Feb', val: 1510 },
                        { m: 'Mar', val: 1780 },
                        { m: 'Apr', val: 2100 },
                        { m: 'May', val: 2580 },
                        { m: 'Jun', val: 3040 },
                        { m: 'Jul', val: 3490 },
                        { m: 'Aug', val: 4020 },
                        { m: 'Sep', val: 4580 },
                        { m: 'Oct', val: 5120 },
                        { m: 'Nov', val: 5740 },
                        { m: 'Dec', val: 6510 },
                      ]}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
                      <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 11 }} />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                              <p className="font-bold text-[#1f2327] mb-1">{label} 2026</p>
                              <p className="text-[#6f777f]">
                                Transactions: <strong className="text-[#1f2327]">{Number(payload[0].value).toLocaleString()}</strong>
                              </p>
                            </div>
                          )
                        }}
                      />
                      <Bar dataKey="val" fill="#1f2327" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : activeMetric === 'Refunds' ? (
                    <BarChart
                      data={[
                        { m: 'Jan', val: 1200 },
                        { m: 'Feb', val: 800 },
                        { m: 'Mar', val: 1500 },
                        { m: 'Apr', val: 400 },
                        { m: 'May', val: 950 },
                        { m: 'Jun', val: 1100 },
                        { m: 'Jul', val: 600 },
                        { m: 'Aug', val: 750 },
                        { m: 'Sep', val: 1300 },
                        { m: 'Oct', val: 900 },
                        { m: 'Nov', val: 1150 },
                        { m: 'Dec', val: 1598 },
                      ]}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
                      <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 11 }} tickFormatter={(v) => `AED ${v}`} />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                              <p className="font-bold text-[#1f2327] mb-1">{label} 2026</p>
                              <p className="text-[#d92d20]">
                                Refunds: <strong>AED {Number(payload[0].value).toLocaleString()}</strong>
                              </p>
                            </div>
                          )
                        }}
                      />
                      <Bar dataKey="val" fill="#d92d20" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart
                      data={[
                        { m: 'Jan', val: 195000, net: 185250, tax: 9750 },
                        { m: 'Feb', val: 240000, net: 228000, tax: 12000 },
                        { m: 'Mar', val: 285000, net: 270750, tax: 14250 },
                        { m: 'Apr', val: 340000, net: 323000, tax: 17000 },
                        { m: 'May', val: 410000, net: 389500, tax: 20500 },
                        { m: 'Jun', val: 490000, net: 465500, tax: 24500 },
                        { m: 'Jul', val: 560000, net: 532000, tax: 28000 },
                        { m: 'Aug', val: 640000, net: 608000, tax: 32000 },
                        { m: 'Sep', val: 730000, net: 693500, tax: 36500 },
                        { m: 'Oct', val: 820000, net: 779000, tax: 41000 },
                        { m: 'Nov', val: 910000, net: 864500, tax: 45500 },
                        { m: 'Dec', val: 1040000, net: 988000, tax: 52000 },
                      ]}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
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
                        tickFormatter={(v) => `AED ${(v / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          const item = payload[0].payload
                          return (
                            <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 shadow-lg text-xs font-sans">
                              <p className="font-bold text-[#1f2327] mb-1">{label} 2026</p>
                              <div className="space-y-0.5">
                                <p className="text-[#6f777f] flex justify-between gap-3">
                                  <span>Gross:</span>
                                  <strong className="text-[#1f2327]">AED {item.val.toLocaleString()}</strong>
                                </p>
                                <p className="text-[#6f777f] flex justify-between gap-3">
                                  <span>Net Realized:</span>
                                  <strong className="text-[#00a4ac]">AED {item.net.toLocaleString()}</strong>
                                </p>
                                <p className="text-[#6f777f] flex justify-between gap-3">
                                  <span>VAT 5%:</span>
                                  <span className="text-[#8f969e]">AED {item.tax.toLocaleString()}</span>
                                </p>
                              </div>
                            </div>
                          )
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={activeMetric === 'Net Revenue' ? 'net' : 'val'}
                        stroke="#00c2cb"
                        strokeWidth={2.5}
                        fill="url(#finGrad)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Categorical Breakdown Grid (Spec 11.3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <h4 className="text-[13px] font-bold text-[#1f2327] mb-3">Revenue by Geography</h4>
                <div className="space-y-2.5 text-[12px]">
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>United Arab Emirates (78%)</span>
                      <span>AED 2,482,000</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#00c2cb] h-1.5 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Saudi Arabia (15%)</span>
                      <span>AED 480,000</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#12b76a] h-1.5 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>United Kingdom & EU (7%)</span>
                      <span>AED 222,200</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#7a5af8] h-1.5 rounded-full" style={{ width: '7%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <h4 className="text-[13px] font-bold text-[#1f2327] mb-3">Revenue by Commercial Plan</h4>
                <div className="space-y-2.5 text-[12px]">
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Power Agent (38%)</span>
                      <span>AED 1,210,000</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#00c2cb] h-1.5 rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Elite Broker (34%)</span>
                      <span>AED 1,080,000</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#7a5af8] h-1.5 rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Enterprise & Pro (28%)</span>
                      <span>AED 894,200</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#f79009] h-1.5 rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <h4 className="text-[13px] font-bold text-[#1f2327] mb-3">Payment Method Share</h4>
                <div className="space-y-2.5 text-[12px]">
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Cards (Visa / MC) (68.5%)</span>
                      <span>AED 2,180,000</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#00c2cb] h-1.5 rounded-full" style={{ width: '68.5%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Apple & Google Pay (25.7%)</span>
                      <span>AED 818,000</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#12b76a] h-1.5 rounded-full" style={{ width: '25.7%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[#1f2327] mb-1">
                      <span>Direct Wire (5.8%)</span>
                      <span>AED 186,200</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                      <div className="bg-[#475467] h-1.5 rounded-full" style={{ width: '5.8%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. TAB CONTENT: TRANSACTIONS (Spec 11.4 - 11.5)
           ========================================================================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 ant-fade-in">
            <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              {/* Top Status Tabs Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'All', label: 'All transactions' },
                      { id: 'Successful', label: 'Successful' },
                      { id: 'Pending', label: 'Pending' },
                      { id: 'Failed', label: 'Failed' },
                      { id: 'Refunded', label: 'Refunded' },
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
                            ? item.id === 'Successful'
                              ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                              : item.id === 'Pending'
                              ? 'bg-[#f79009] text-white shadow-2xs font-semibold'
                              : item.id === 'Failed' || item.id === 'Refunded'
                              ? 'bg-[#d92d20] text-white shadow-2xs font-semibold'
                              : 'bg-[#1f2327] text-white shadow-2xs font-semibold'
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
                    onClick={handleExportTransactions}
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
                    placeholder="Search Txn ID, User, Email, Invoice..."
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

                {/* Gateway Filter */}
                <Dropdown
                  align="start"
                  value={gatewayFilter}
                  onSelect={setGatewayFilter}
                  ariaLabel="Filter by Gateway"
                  options={[
                    { label: 'All Gateways', value: 'All' },
                    { label: 'Stripe UAE', value: 'Stripe UAE' },
                    { label: 'Checkout.com', value: 'Checkout.com' },
                    { label: 'Network International', value: 'Network International' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Server className="size-4 text-[#6f777f]" />
                      <span>{gatewayFilter === 'All' ? 'All Gateways' : gatewayFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Method Filter */}
                <Dropdown
                  align="start"
                  value={methodFilter}
                  onSelect={setMethodFilter}
                  ariaLabel="Filter by Method"
                  options={[
                    { label: 'All Payment Methods', value: 'All' },
                    { label: 'Credit Card', value: 'Credit Card' },
                    { label: 'Apple Pay', value: 'Apple Pay' },
                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Wallet className="size-4 text-[#6f777f]" />
                      <span>{methodFilter === 'All' ? 'All Payment Methods' : methodFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Country Filter */}
                <Dropdown
                  align="start"
                  value={countryFilter}
                  onSelect={setCountryFilter}
                  ariaLabel="Filter by Country"
                  options={[
                    { label: 'All Countries', value: 'All' },
                    { label: 'United Arab Emirates', value: 'United Arab Emirates' },
                    { label: 'Saudi Arabia', value: 'Saudi Arabia' },
                    { label: 'United Kingdom', value: 'United Kingdom' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <span>🌍</span>
                      <span>{countryFilter === 'All' ? 'All Countries' : countryFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Reset Filters Link */}
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto table-scrollbar">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="px-4">Transaction ID</th>
                      <th className="px-4">Customer</th>
                      <th className="px-4">Plan</th>
                      <th className="px-4">Gross (AED)</th>
                      <th className="px-4">Tax (5%)</th>
                      <th className="px-4">Method</th>
                      <th className="px-4">Gateway</th>
                      <th className="px-4">Status</th>
                      <th className="px-4">Timestamp</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {filteredTransactions.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => handleOpenTxnDetails(t)}
                        className="h-[64px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa] cursor-pointer"
                      >
                        <td className="px-4 font-semibold font-mono text-[13px] text-[#00c2cb] hover:underline">{t.id}</td>
                        <td className="px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar
                              src={t.userAvatar}
                              name={t.userName}
                              size="md"
                              variant="brand"
                            />
                            <div>
                              <div className="font-semibold text-[14px] text-[#1f2327]">{t.userName}</div>
                              <div className="text-[12px] text-[#6f777f]">{t.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 font-medium text-[13px] text-[#1f2327]">{t.planName}</td>
                        <td className="px-4 font-semibold tabular-nums text-[#1f2327]">
                          AED {t.amount.toLocaleString()}
                        </td>
                        <td className="px-4 text-[#6f777f]">AED {t.tax.toFixed(2)}</td>
                        <td className="px-4 text-[#1f2327]">
                          {t.paymentMethod} {t.cardLast4 ? `•••• ${t.cardLast4}` : ''}
                        </td>
                        <td className="px-4">
                          <span className="rounded-[6px] border border-[#d3d5d7] bg-[#f8f9fa] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">
                            {t.gateway}
                          </span>
                        </td>
                        <td className="px-4">
                          <FigmaStatusBadge
                            status={
                              t.status === 'Successful'
                                ? 'Completed'
                                : t.status === 'Failed'
                                ? 'Failed'
                                : t.status === 'Refunded'
                                ? 'Cancelled'
                                : 'Pending'
                            }
                          />
                        </td>
                        <td className="px-4 text-[13px] text-[#6f777f]">
                          {t.date} <span className="text-[11px] text-[#8f969e]">{t.time}</span>
                        </td>
                        <td className="px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenTxnDetails(t)
                            }}
                            className="h-[32px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            4. TAB CONTENT: REFUNDS (Spec 11.8 - 11.9)
           ========================================================================= */}
        {activeTab === 'refunds' && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Refund Requests & Dispute Queue</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Review, approve, or reject customer refund requests with complete audit timestamps.
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">Refund ID</th>
                    <th className="px-3">Transaction</th>
                    <th className="px-3">Customer</th>
                    <th className="px-3">Amount</th>
                    <th className="px-3">Reason</th>
                    <th className="px-3">Gateway</th>
                    <th className="px-3">Status</th>
                    <th className="px-3">Requested Date</th>
                    <th className="px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {refunds.map((r) => (
                    <tr key={r.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
                      <td className="px-4 py-3.5 font-bold font-mono text-[#00838f]">{r.id}</td>
                      <td className="px-3 py-3.5 font-mono text-[#1f2327]">{r.transactionId}</td>
                      <td className="px-3 py-3.5">
                        <div className="font-bold text-[#1f2327]">{r.userName}</div>
                        <div className="text-[11px] text-[#8f969e]">{r.userEmail}</div>
                      </td>
                      <td className="px-3 py-3.5 font-bold text-[#d92d20]">
                        AED {r.amount.toLocaleString()}
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f] max-w-xs truncate">{r.reason}</td>
                      <td className="px-3 py-3.5 font-medium text-[#1f2327]">{r.gateway}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                            r.status === 'Completed' && 'bg-[#ecfdf3] text-[#027a48]',
                            r.status === 'Pending' && 'bg-[#fffaeb] text-[#b54708]',
                            r.status === 'Rejected' && 'bg-[#fef3f2] text-[#d92d20]'
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{r.requestedAt}</td>
                      <td className="px-4 py-3.5 text-right">
                        {r.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setRefunds(
                                  refunds.map((x) =>
                                    x.id === r.id ? { ...x, status: 'Completed', approvedBy: 'Super Admin', approvedAt: 'Just now' } : x
                                  )
                                )
                                toast({
                                  variant: 'success',
                                  title: 'Refund approved',
                                  description: `Refund ${r.id} approved and executed.`,
                                })
                              }}
                              className="rounded-[6px] bg-[#027a48] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#05603a]"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRefunds(
                                  refunds.map((x) => (x.id === r.id ? { ...x, status: 'Rejected' } : x))
                                )
                                toast({
                                  variant: 'error',
                                  title: 'Refund rejected',
                                  description: `Refund ${r.id} was rejected.`,
                                })
                              }}
                              className="rounded-[6px] border border-[#fda29b] px-2.5 py-1 text-[11px] font-bold text-[#d92d20] hover:bg-[#fef3f2]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8f969e]">Audit Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. TAB CONTENT: PAYMENT METHODS (Spec 11.6)
           ========================================================================= */}
        {activeTab === 'methods' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <h3 className="text-[16px] font-bold text-[#1f2327]">Configured Payment Methods</h3>
              <p className="text-[12px] text-[#6f777f]">
                Manage active customer payment rails, success conversion rates, and processed volume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[14px] font-bold text-[#1f2327] block">{pm.method}</span>
                      <span className="text-[11.5px] text-[#8f969e] block mt-0.5">Provider: {pm.provider}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePaymentMethod(pm.id)}
                      className={cn(
                        'rounded-full px-3 py-1 text-[11px] font-bold transition-colors cursor-pointer',
                        pm.enabled
                          ? 'bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5]'
                          : 'bg-[#f2f4f7] text-[#475467] border border-[#d0d5dd]'
                      )}
                    >
                      {pm.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#f0f2f5] pt-3 text-[12px]">
                    <div>
                      <span className="text-[#8f969e] block">Transactions</span>
                      <span className="font-bold text-[#1f2327]">{pm.transactionsCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#8f969e] block">Success Rate</span>
                      <span className="font-bold text-[#12b76a]">{pm.successRate}%</span>
                    </div>
                    <div>
                      <span className="text-[#8f969e] block">Volume Share</span>
                      <span className="font-bold text-[#00838f]">{pm.usagePercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. TAB CONTENT: GATEWAYS & HEALTH (Spec 11.7)
           ========================================================================= */}
        {activeTab === 'gateways' && (
          <div className="space-y-4 ant-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gateways.map((gw) => (
                <div key={gw.id} className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1f2327]">{gw.name}</span>
                    <span className="flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2.5 py-0.5 text-[11px] font-bold text-[#027a48]">
                      <span className="size-1.5 rounded-full bg-[#12b76a] animate-pulse" />
                      {gw.status}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#6f777f] space-y-1">
                    <div>Environment: <strong className="text-[#1f2327]">{gw.environment}</strong></div>
                    <div>Success Rate: <strong className="text-[#12b76a]">{gw.successRate}%</strong></div>
                    <div>Avg Latency: <strong className="text-[#1f2327]">{gw.latencyMs}ms</strong></div>
                    <div>Last Webhook: <span className="text-[#8f969e]">{gw.lastWebhook}</span></div>
                  </div>
                  <div className="pt-2 border-t border-[#f0f2f5] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        toast({
                          variant: 'success',
                          title: 'Gateway connection test passed',
                          description: `${gw.name} responded with 200 OK in ${gw.latencyMs}ms.`,
                        })
                      }}
                      className="rounded-[6px] border border-[#d3d5d7] px-2.5 py-1 text-[11px] font-bold text-[#1f2327] hover:bg-[#f4f5f6]"
                    >
                      Test Ping
                    </button>
                    <span className="text-[11px] font-mono text-[#8f969e]">API v2026-08</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            7. TAB CONTENT: TAXES & VAT (Spec 11.10 - 11.11)
           ========================================================================= */}
        {activeTab === 'taxes' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <h3 className="text-[16px] font-bold text-[#1f2327]">Tax Collection & VAT Dashboard</h3>
              <p className="text-[12px] text-[#6f777f]">
                Regional value-added tax reconciliation for Federal Tax Authority (FTA UAE) and ZATCA Saudi Arabia.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">Jurisdiction</th>
                    <th className="px-3">Applicable Tax Rate</th>
                    <th className="px-3">Taxable Revenue</th>
                    <th className="px-3">Gross VAT Collected</th>
                    <th className="px-3">Transactions</th>
                    <th className="px-3">Refunded VAT</th>
                    <th className="px-4 text-right">Net Tax Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {TAX_COUNTRY_REPORTS.map((t, idx) => (
                    <tr key={idx} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
                      <td className="px-4 py-3.5 font-bold text-[#1f2327]">{t.country}</td>
                      <td className="px-3 py-3.5 font-medium text-[#1f2327]">{t.taxRate}</td>
                      <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                        AED {t.taxableRevenue.toLocaleString()}
                      </td>
                      <td className="px-3 py-3.5 text-[#00838f] font-bold">
                        AED {t.vatCollected.toLocaleString()}
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{t.transactionsCount.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-[#d92d20]">AED {t.refundsTax.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-[#027a48]">
                        AED {t.netTax.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            8. TAB CONTENT: RECONCILIATION (Spec 11.18)
           ========================================================================= */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <h3 className="text-[16px] font-bold text-[#1f2327]">Monthly Financial Ledger Reconciliation</h3>
              <p className="text-[12px] text-[#6f777f]">
                Automated multi-currency comparison between internal platform ledger and external payment gateways.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">Closing Period</th>
                    <th className="px-3">Duseat Total</th>
                    <th className="px-3">Gateway Total</th>
                    <th className="px-3">Variance</th>
                    <th className="px-3">Status</th>
                    <th className="px-4">Reconciliation Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {RECONCILIATION_DATA.map((r) => (
                    <tr key={r.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
                      <td className="px-4 py-3.5 font-bold text-[#1f2327]">{r.period}</td>
                      <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                        AED {r.duseatTotalAed.toLocaleString()} ({r.duseatCount} txns)
                      </td>
                      <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                        AED {r.gatewayTotalAed.toLocaleString()} ({r.gatewayCount} txns)
                      </td>
                      <td className="px-3 py-3.5 font-bold text-[#027a48]">
                        AED {r.differenceAed.toFixed(2)}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="rounded-full bg-[#ecfdf3] px-2.5 py-0.5 text-[11px] font-bold text-[#027a48]">
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#6f777f] text-[12px]">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            9. TAB CONTENT: GATEWAY LOGS (Spec 11.12 - 11.13)
           ========================================================================= */}
        {activeTab === 'logs' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs font-mono text-[12px]">
              <div className="border-b border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 text-[11.5px] font-bold text-[#6f777f] uppercase">
                Technical Financial Webhook & API Logs (Masked for Security)
              </div>
              <div className="divide-y divide-[#e5e7eb]">
                {GATEWAY_LOGS_DATA.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-[#fcfcfd] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1f2327]">{log.event}</span>
                        <span className="rounded bg-[#e5f6f7] px-2 py-0.2 text-[11px] font-bold text-[#00838f]">
                          {log.gateway}
                        </span>
                        <span className="text-[#8f969e] text-[11px]">Txn: {log.transactionId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#ecfdf3] px-2 py-0.2 text-[11px] font-bold text-[#027a48]">
                          {log.status}
                        </span>
                        <span className="text-[11px] text-[#8f969e]">{log.durationMs}ms</span>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-[#565e67] bg-[#f4f5f6] p-2 rounded-[6px] break-all">
                      {log.payloadSnippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            10. TAB CONTENT: AUDIT LOG (Spec 11.19)
           ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">Event</th>
                    <th className="px-3">Actor & Role</th>
                    <th className="px-3">Affected Entity</th>
                    <th className="px-3">State Change</th>
                    <th className="px-3">Timestamp</th>
                    <th className="px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {AUDIT_LOGS_DATA.map((aud) => (
                    <tr key={aud.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
                      <td className="px-4 py-3.5 font-bold text-[#1f2327]">{aud.event}</td>
                      <td className="px-3 py-3.5">
                        <div className="font-bold text-[#1f2327]">{aud.actor}</div>
                        <div className="text-[11px] text-[#8f969e]">{aud.role}</div>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-[#1f2327]">{aud.entity}</td>
                      <td className="px-3 py-3.5">
                        <span className="text-[11.5px] text-[#8f969e]">{aud.prevValue}</span>
                        <span className="mx-1 text-[#8f969e]">→</span>
                        <span className="text-[11.5px] font-bold text-[#027a48]">{aud.newValue}</span>
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{aud.date}</td>
                      <td className="px-4 py-3.5 text-[#8f969e] font-mono text-[11px]">{aud.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          TRANSACTION DETAILS DRAWER / SHEET (Spec 11.5)
         ========================================================================= */}
      {txnDrawerOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs ant-fade-in">
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 bg-[#fafbfc]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00838f]">
                  Financial Transaction
                </span>
                <h2 className="text-[18px] font-bold font-mono text-[#1f2327]">{selectedTxn.id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setTxnDrawerOpen(false)}
                className="rounded-full p-2 text-[#8f969e] hover:bg-[#f4f5f6]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Financial Breakdown Card */}
              <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fafbfc] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1f2327]">Line Item Breakdown</span>
                  <span className="rounded-full bg-[#ecfdf3] px-2.5 py-0.5 text-[11px] font-bold text-[#027a48]">
                    {selectedTxn.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-[12.5px] border-t border-[#e5e7eb] pt-2">
                  <div className="flex justify-between">
                    <span className="text-[#6f777f]">Gross Subtotal</span>
                    <span className="font-medium text-[#1f2327]">AED {selectedTxn.grossAmount.toLocaleString()}</span>
                  </div>
                  {selectedTxn.discount > 0 && (
                    <div className="flex justify-between text-[#b54708]">
                      <span>Promo Discount Applied</span>
                      <span>− AED {selectedTxn.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6f777f]">
                    <span>UAE VAT Tax (5%)</span>
                    <span>AED {selectedTxn.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1f2327] text-[14px] border-t border-[#e5e7eb] pt-1.5">
                    <span>Total Paid</span>
                    <span className="text-[#00838f]">AED {selectedTxn.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Gateway References */}
              <div className="grid grid-cols-2 gap-4 text-[12px]">
                <div className="space-y-1">
                  <span className="text-[#8f969e] font-semibold block">Customer</span>
                  <span className="font-bold text-[#1f2327] block">{selectedTxn.userName}</span>
                  <span className="text-[#6f777f] block">{selectedTxn.userEmail}</span>
                  <span className="text-[#6f777f] block">{selectedTxn.country}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#8f969e] font-semibold block">Gateway Integration</span>
                  <span className="font-bold text-[#1f2327] block">{selectedTxn.gateway}</span>
                  <span className="font-mono text-[#6f777f] text-[11px] block">{selectedTxn.gatewayTxnId}</span>
                  <span className="text-[#6f777f] block">{selectedTxn.paymentMethod}</span>
                </div>
              </div>

              {/* Processing Timeline */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-[#1f2327]">Payment Processing Lifecycle</h4>
                <div className="space-y-2 border-l-2 border-[#00c2cb] pl-4 ml-1 text-[12px]">
                  {selectedTxn.timeline.map((st, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-[#1f2327]">
                        <span>{st.stage}</span>
                        <span className="text-[11px] font-normal text-[#8f969e]">{st.time}</span>
                      </div>
                      <p className="text-[11.5px] text-[#6f777f]">{st.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedTxn.status === 'Successful' && (
                <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundConfirmOpen(true)}
                    className="rounded-[6px] bg-[#d92d20] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#b42318]"
                  >
                    Refund Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REFUND CONFIRMATION DIALOG (Spec 11.9)
         ========================================================================= */}
      {refundConfirmOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#fda29b] space-y-4">
            <h3 className="text-[16px] font-bold text-[#d92d20]">Confirm Refund</h3>
            <p className="text-[12px] text-[#6f777f]">
              Refund <strong>AED {selectedTxn.amount.toLocaleString()}</strong> to customer payment method ({selectedTxn.paymentMethod}) via {selectedTxn.gateway}.
            </p>

            <div>
              <label className="text-[11.5px] font-semibold text-[#6f777f]">Reason for Refund (Audit Trail)</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="State the financial rationale..."
                className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] p-2 text-[12px] outline-none"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundConfirmOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRefundConfirm}
                className="rounded-[6px] bg-[#d92d20] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#b42318]"
              >
                Execute Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          EXPORT FINANCIAL REPORT MODAL (Spec 11.20)
         ========================================================================= */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7] space-y-4">
            <h3 className="text-[16px] font-bold text-[#1f2327]">Export Financial Records</h3>
            <p className="text-[12px] text-[#6f777f]">
              Generate auditable financial exports formatted for bookkeeping and statutory VAT returns.
            </p>

            <div className="space-y-3 text-[12.5px]">
              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Dataset</label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                >
                  <option value="Transactions & Revenue">Transactions & Revenue Summary</option>
                  <option value="VAT & Tax Reports">Regional VAT & Tax Returns (FTA UAE & ZATCA)</option>
                  <option value="Refunds & Disputes">Refunds, Chargebacks & Disputes</option>
                  <option value="Reconciliation Ledger">Bank Settlement & Reconciliation Ledger</option>
                </select>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Export Format</label>
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

              <div className="rounded-[8px] bg-[#f8f9fa] p-3 text-[11.5px] text-[#6f777f]">
                Estimated Records: <strong>{filteredTransactions.length} items</strong> (~48 KB)
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
                onClick={() => {
                  handleExportTransactions()
                  setExportModalOpen(false)
                }}
                className="rounded-[6px] bg-[#00c2cb] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#00838f]"
              >
                Generate Export
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}

export function FinanceManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <FinanceManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
