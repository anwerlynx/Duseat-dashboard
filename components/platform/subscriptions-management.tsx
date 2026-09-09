'use client'

import * as React from 'react'
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Shield,
  Tag,
  FileText,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  X,
  Sparkles,
  Zap,
  Layers,
  Copy,
  Archive,
  Edit,
  Eye,
  MoreVertical,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Send,
  ExternalLink,
  ShieldCheck,
  Percent,
  Receipt,
  History,
  Building,
  Mail,
  UserCheck,
  Ban,
  Lock,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { MainButton } from '@/components/ui/main-button'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { TableAvatar } from '@/components/ui/table-avatar'
import { cn, exportToCsv } from '@/lib/utils'


// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type SubscriptionStatus =
  | 'Active'
  | 'Trial'
  | 'Grace Period'
  | 'Renewed'
  | 'Expired'
  | 'Cancelled'

export type PaymentStatus =
  | 'Successful'
  | 'Pending'
  | 'Failed'
  | 'Refunded'
  | 'Chargeback'

export type InvoiceStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Void'

export type PromoDiscountType = 'Percentage' | 'Fixed Amount'

export interface PlanFeature {
  id: string
  name: string
  included: boolean
  highlight?: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  code: string
  description: string
  status: 'Active' | 'Draft' | 'Archived'
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  trialDays: number
  gracePeriodDays: number
  subscribersCount: number
  monthlyRevenue: number
  annualRevenue: number
  limits: {
    offers: number | 'Unlimited'
    requests: number | 'Unlimited'
    properties: number | 'Unlimited'
    messages: number | 'Unlimited'
    aiCredits: number | 'Unlimited'
  }
  features: PlanFeature[]
  visibilityBoost: 'Standard' | '2x Boost' | '5x Priority' | '10x Maximum'
  aiFeatures: 'Basic' | 'Advanced' | 'Full Suite' | 'Custom Enterprise'
  availability: {
    countries: string[]
    userTypes: ('Agent' | 'Investor' | 'Brokerage')[]
  }
  conversionRate: string
  churnRate: string
}

export interface Subscriber {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  userType: 'Agent' | 'Investor' | 'Brokerage'
  country: string
  planId: string
  planName: string
  status: SubscriptionStatus
  purchaseDate: string
  renewalDate: string
  expiryDate: string
  paymentStatus: PaymentStatus
  amount: number
  currency: string
  billingCycle: 'Monthly' | 'Yearly'
  autoRenewal: boolean
  usage: {
    offersUsed: number
    offersLimit: number
    requestsUsed: number
    requestsLimit: number
    aiCreditsUsed: number
    aiCreditsLimit: number
  }
  appliedPromo?: {
    code: string
    discount: string
    savings: number
  }
  timeline: {
    id: string
    event: string
    date: string
    actor: string
    prevValue?: string
    newValue?: string
    reason?: string
  }[]
}

export interface PaymentRecord {
  id: string
  subscriberId: string
  userName: string
  userEmail: string
  userAvatar?: string
  planName: string
  amount: number
  tax: number
  discount: number
  currency: string
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Bank Transfer' | 'Wire'
  cardLast4?: string
  status: PaymentStatus
  date: string
  invoiceNumber: string
  transactionId: string
  gateway: 'Stripe UAE' | 'Checkout.com' | 'Network International'
}

export interface PromoCode {
  id: string
  code: string
  discountType: PromoDiscountType
  discountValue: number
  assignedPlan: string
  country: string
  usageCount: number
  usageLimit: number
  expirationDate: string
  status: 'Active' | 'Scheduled' | 'Expired' | 'Disabled'
  minPurchase?: number
  createdDate: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  subscriberId: string
  userName: string
  userEmail: string
  country: string
  planName: string
  amount: number
  tax: number
  total: number
  currency: string
  status: InvoiceStatus
  issuedDate: string
  dueDate: string
  billingPeriod: string
  paymentMethod: string
}

// ============================================================================
// INITIAL SAMPLE DATA
// ============================================================================

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'PLAN-FREE',
    name: 'Free Starter',
    code: 'free',
    description: 'Basic marketplace access for new investors and casual property explorers.',
    status: 'Active',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'AED',
    trialDays: 0,
    gracePeriodDays: 0,
    subscribersCount: 1420,
    monthlyRevenue: 0,
    annualRevenue: 0,
    limits: {
      offers: 5,
      requests: 3,
      properties: 2,
      messages: 50,
      aiCredits: 10,
    },
    features: [
      { id: 'f1', name: 'Marketplace browsing', included: true },
      { id: 'f2', name: 'Standard support', included: true },
      { id: 'f3', name: 'Verified Agent Directory', included: true },
      { id: 'f4', name: 'Priority Deal Matching', included: false },
      { id: 'f5', name: 'AI Valuation Tools', included: false },
      { id: 'f6', name: 'Escrow Integration', included: false },
    ],
    visibilityBoost: 'Standard',
    aiFeatures: 'Basic',
    availability: {
      countries: ['All'],
      userTypes: ['Agent', 'Investor'],
    },
    conversionRate: '4.2%',
    churnRate: '1.8%',
  },
  {
    id: 'PLAN-PRO',
    name: 'Pro Agent',
    code: 'pro',
    description: 'Professional suite for active real estate brokers submitting client offers.',
    status: 'Active',
    monthlyPrice: 799,
    yearlyPrice: 7990,
    currency: 'AED',
    trialDays: 14,
    gracePeriodDays: 7,
    subscribersCount: 684,
    monthlyRevenue: 546516,
    annualRevenue: 6558192,
    limits: {
      offers: 30,
      requests: 20,
      properties: 15,
      messages: 1000,
      aiCredits: 200,
    },
    features: [
      { id: 'f1', name: 'Marketplace browsing', included: true },
      { id: 'f2', name: 'Priority 24/7 support', included: true, highlight: true },
      { id: 'f3', name: 'Verified Agent Directory', included: true },
      { id: 'f4', name: 'Priority Deal Matching', included: true, highlight: true },
      { id: 'f5', name: 'AI Valuation Tools', included: true },
      { id: 'f6', name: 'Escrow Integration', included: true },
    ],
    visibilityBoost: '2x Boost',
    aiFeatures: 'Advanced',
    availability: {
      countries: ['UAE', 'Saudi Arabia', 'Qatar'],
      userTypes: ['Agent'],
    },
    conversionRate: '18.5%',
    churnRate: '2.4%',
  },
  {
    id: 'PLAN-ELITE',
    name: 'Elite Broker',
    code: 'elite',
    description: 'High-volume dealmaker package with maximum visibility and AI matching.',
    status: 'Active',
    monthlyPrice: 1599,
    yearlyPrice: 15990,
    currency: 'AED',
    trialDays: 14,
    gracePeriodDays: 7,
    subscribersCount: 342,
    monthlyRevenue: 546858,
    annualRevenue: 6562296,
    limits: {
      offers: 100,
      requests: 60,
      properties: 50,
      messages: 'Unlimited',
      aiCredits: 1000,
    },
    features: [
      { id: 'f1', name: 'Marketplace browsing', included: true },
      { id: 'f2', name: 'Dedicated Account Manager', included: true, highlight: true },
      { id: 'f3', name: 'Verified Agent Directory (Gold Badge)', included: true },
      { id: 'f4', name: 'Top-tier Deal Matching & Push alerts', included: true, highlight: true },
      { id: 'f5', name: 'AI Valuation & ROI Predictor', included: true, highlight: true },
      { id: 'f6', name: 'Zero Escrow Processing Fees', included: true },
    ],
    visibilityBoost: '5x Priority',
    aiFeatures: 'Full Suite',
    availability: {
      countries: ['All'],
      userTypes: ['Agent', 'Brokerage'],
    },
    conversionRate: '24.1%',
    churnRate: '1.2%',
  },
  {
    id: 'PLAN-POWER',
    name: 'Power Agent',
    code: 'power',
    description: 'Specialized power tools with automated deal pitch generation & WhatsApp CRM sync.',
    status: 'Active',
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    currency: 'AED',
    trialDays: 7,
    gracePeriodDays: 5,
    subscribersCount: 198,
    monthlyRevenue: 494802,
    annualRevenue: 5937624,
    limits: {
      offers: 'Unlimited',
      requests: 150,
      properties: 100,
      messages: 'Unlimited',
      aiCredits: 3000,
    },
    features: [
      { id: 'f1', name: 'All Elite features included', included: true },
      { id: 'f2', name: 'WhatsApp & CRM webhook sync', included: true, highlight: true },
      { id: 'f3', name: 'Off-Market VIP Deals Access', included: true, highlight: true },
      { id: 'f4', name: 'Featured Homepage Agency Placement', included: true },
      { id: 'f5', name: 'Auto-pilot Deal Match Alerts', included: true },
      { id: 'f6', name: 'Legal contract review assist', included: true },
    ],
    visibilityBoost: '10x Maximum',
    aiFeatures: 'Full Suite',
    availability: {
      countries: ['UAE', 'Saudi Arabia'],
      userTypes: ['Agent', 'Brokerage'],
    },
    conversionRate: '31.2%',
    churnRate: '0.9%',
  },
  {
    id: 'PLAN-ENTERPRISE',
    name: 'Enterprise Brokerage',
    code: 'enterprise',
    description: 'Custom corporate license for multi-agent brokerages and institutional funds.',
    status: 'Active',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    currency: 'AED',
    trialDays: 30,
    gracePeriodDays: 14,
    subscribersCount: 52,
    monthlyRevenue: 259948,
    annualRevenue: 3119376,
    limits: {
      offers: 'Unlimited',
      requests: 'Unlimited',
      properties: 'Unlimited',
      messages: 'Unlimited',
      aiCredits: 'Unlimited',
    },
    features: [
      { id: 'f1', name: 'Multi-seat team management (up to 50)', included: true, highlight: true },
      { id: 'f2', name: 'Custom SLA & 15m Response Guarantee', included: true },
      { id: 'f3', name: 'Custom API & Webhooks Access', included: true, highlight: true },
      { id: 'f4', name: 'Branded portal & white-label PDFs', included: true },
      { id: 'f5', name: 'Dedicated Senior Key Account Executive', included: true },
      { id: 'f6', name: 'Custom Compliance & Auditing exports', included: true },
    ],
    visibilityBoost: '10x Maximum',
    aiFeatures: 'Custom Enterprise',
    availability: {
      countries: ['All'],
      userTypes: ['Brokerage', 'Investor'],
    },
    conversionRate: '45.0%',
    churnRate: '0.4%',
  },
]

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'SUB-9841',
    userId: 'USR-1048',
    userName: 'Amal Haddad',
    userEmail: 'amal.haddad@palmproperties.ae',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    userType: 'Agent',
    country: 'United Arab Emirates',
    planId: 'PLAN-POWER',
    planName: 'Power Agent',
    status: 'Active',
    purchaseDate: '12 Jan 2026',
    renewalDate: '12 Jun 2026',
    expiryDate: '12 Jun 2026',
    paymentStatus: 'Successful',
    amount: 2499,
    currency: 'AED',
    billingCycle: 'Monthly',
    autoRenewal: true,
    usage: {
      offersUsed: 64,
      offersLimit: 9999,
      requestsUsed: 42,
      requestsLimit: 150,
      aiCreditsUsed: 1420,
      aiCreditsLimit: 3000,
    },
    appliedPromo: {
      code: 'DUBAI2026',
      discount: '15% Off',
      savings: 374,
    },
    timeline: [
      {
        id: 't1',
        event: 'Subscription Created',
        date: '12 Jan 2026, 14:22',
        actor: 'Amal Haddad',
        reason: 'Upgraded from Pro to Power Agent',
      },
      {
        id: 't2',
        event: 'Payment Succeeded',
        date: '12 May 2026, 09:00',
        actor: 'Stripe Gateway',
        reason: 'Monthly auto-renewal processed AED 2,499.00',
      },
    ],
  },
  {
    id: 'SUB-9840',
    userId: 'USR-1047',
    userName: 'Omar Nasser',
    userEmail: 'omar.nasser@avenue.ae',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    userType: 'Agent',
    country: 'United Arab Emirates',
    planId: 'PLAN-ELITE',
    planName: 'Elite Broker',
    status: 'Active',
    purchaseDate: '04 Feb 2026',
    renewalDate: '04 Jun 2026',
    expiryDate: '04 Jun 2026',
    paymentStatus: 'Successful',
    amount: 1599,
    currency: 'AED',
    billingCycle: 'Monthly',
    autoRenewal: true,
    usage: {
      offersUsed: 88,
      offersLimit: 100,
      requestsUsed: 45,
      requestsLimit: 60,
      aiCreditsUsed: 920,
      aiCreditsLimit: 1000,
    },
    timeline: [
      {
        id: 't1',
        event: 'Subscription Created',
        date: '04 Feb 2026, 10:15',
        actor: 'Omar Nasser',
        reason: 'New subscription',
      },
    ],
  },
  {
    id: 'SUB-9839',
    userId: 'USR-1046',
    userName: 'Youssef Ali',
    userEmail: 'youssef.ali@dubaimarina.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    userType: 'Agent',
    country: 'United Arab Emirates',
    planId: 'PLAN-PRO',
    planName: 'Pro Agent',
    status: 'Grace Period',
    purchaseDate: '28 Nov 2025',
    renewalDate: '28 May 2026',
    expiryDate: '04 Jun 2026',
    paymentStatus: 'Failed',
    amount: 799,
    currency: 'AED',
    billingCycle: 'Monthly',
    autoRenewal: true,
    usage: {
      offersUsed: 22,
      offersLimit: 30,
      requestsUsed: 14,
      requestsLimit: 20,
      aiCreditsUsed: 180,
      aiCreditsLimit: 200,
    },
    timeline: [
      {
        id: 't1',
        event: 'Payment Failed',
        date: '28 May 2026, 04:00',
        actor: 'System / Stripe',
        reason: 'Insufficient funds on Visa ending in 4242. Entering 7-day grace period.',
      },
    ],
  },
  {
    id: 'SUB-9838',
    userId: 'USR-1045',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@downtownre.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    userType: 'Agent',
    country: 'United Kingdom',
    planId: 'PLAN-ENTERPRISE',
    planName: 'Enterprise Brokerage',
    status: 'Active',
    purchaseDate: '15 Jan 2026',
    renewalDate: '15 Jan 2027',
    expiryDate: '15 Jan 2027',
    paymentStatus: 'Successful',
    amount: 49990,
    currency: 'AED',
    billingCycle: 'Yearly',
    autoRenewal: true,
    usage: {
      offersUsed: 310,
      offersLimit: 9999,
      requestsUsed: 190,
      requestsLimit: 9999,
      aiCreditsUsed: 4200,
      aiCreditsLimit: 9999,
    },
    timeline: [
      {
        id: 't1',
        event: 'Annual Subscription Purchased',
        date: '15 Jan 2026, 11:30',
        actor: 'Sarah Johnson',
        reason: 'Enterprise yearly package invoice #INV-2026-081',
      },
    ],
  },
  {
    id: 'SUB-9837',
    userId: 'USR-1044',
    userName: 'Khalid Al Mansoori',
    userEmail: 'khalid@mansooricapital.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    userType: 'Investor',
    country: 'Saudi Arabia',
    planId: 'PLAN-PRO',
    planName: 'Pro Agent',
    status: 'Trial',
    purchaseDate: '24 May 2026',
    renewalDate: '07 Jun 2026',
    expiryDate: '07 Jun 2026',
    paymentStatus: 'Pending',
    amount: 799,
    currency: 'AED',
    billingCycle: 'Monthly',
    autoRenewal: true,
    usage: {
      offersUsed: 8,
      offersLimit: 30,
      requestsUsed: 5,
      requestsLimit: 20,
      aiCreditsUsed: 65,
      aiCreditsLimit: 200,
    },
    timeline: [
      {
        id: 't1',
        event: '14-Day Free Trial Started',
        date: '24 May 2026, 16:40',
        actor: 'Khalid Al Mansoori',
        reason: 'Self-serve onboarding',
      },
    ],
  },
  {
    id: 'SUB-9836',
    userId: 'USR-1043',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@luxuryuae.com',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    userType: 'Agent',
    country: 'United Arab Emirates',
    planId: 'PLAN-ELITE',
    planName: 'Elite Broker',
    status: 'Cancelled',
    purchaseDate: '10 Nov 2025',
    renewalDate: '10 May 2026',
    expiryDate: '10 Jun 2026',
    paymentStatus: 'Successful',
    amount: 1599,
    currency: 'AED',
    billingCycle: 'Monthly',
    autoRenewal: false,
    usage: {
      offersUsed: 42,
      offersLimit: 100,
      requestsUsed: 19,
      requestsLimit: 60,
      aiCreditsUsed: 410,
      aiCreditsLimit: 1000,
    },
    timeline: [
      {
        id: 't1',
        event: 'Subscription Cancelled',
        date: '18 May 2026, 12:10',
        actor: 'Elena Rostova',
        reason: 'Agency restructuring. Access remains active until billing cycle ends (10 Jun 2026).',
      },
    ],
  },
]

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-8841',
    subscriberId: 'SUB-9841',
    userName: 'Amal Haddad',
    userEmail: 'amal.haddad@palmproperties.ae',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    planName: 'Power Agent',
    amount: 2499,
    tax: 124.95,
    discount: 374.85,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '4821',
    status: 'Successful',
    date: '12 May 2026, 09:00',
    invoiceNumber: 'INV-2026-1048',
    transactionId: 'txn_3M981Z2eZvKYlo2C09z1',
    gateway: 'Stripe UAE',
  },
  {
    id: 'PAY-8840',
    subscriberId: 'SUB-9840',
    userName: 'Omar Nasser',
    userEmail: 'omar.nasser@avenue.ae',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    planName: 'Elite Broker',
    amount: 1599,
    tax: 79.95,
    discount: 0,
    currency: 'AED',
    paymentMethod: 'Apple Pay',
    cardLast4: '9102',
    status: 'Successful',
    date: '04 May 2026, 10:15',
    invoiceNumber: 'INV-2026-1047',
    transactionId: 'txn_3M981A4bXvKYlo2C11p9',
    gateway: 'Stripe UAE',
  },
  {
    id: 'PAY-8839',
    subscriberId: 'SUB-9839',
    userName: 'Youssef Ali',
    userEmail: 'youssef.ali@dubaimarina.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    planName: 'Pro Agent',
    amount: 799,
    tax: 39.95,
    discount: 0,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '4242',
    status: 'Failed',
    date: '28 May 2026, 04:00',
    invoiceNumber: 'INV-2026-1046',
    transactionId: 'txn_3M981F9kZvKYlo2C88q2',
    gateway: 'Stripe UAE',
  },
  {
    id: 'PAY-8838',
    subscriberId: 'SUB-9838',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@downtownre.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    planName: 'Enterprise Brokerage',
    amount: 49990,
    tax: 2499.5,
    discount: 5000,
    currency: 'AED',
    paymentMethod: 'Bank Transfer',
    status: 'Successful',
    date: '15 Jan 2026, 11:30',
    invoiceNumber: 'INV-2026-081',
    transactionId: 'txn_BT_99418291048',
    gateway: 'Network International',
  },
  {
    id: 'PAY-8837',
    subscriberId: 'SUB-9835',
    userName: 'Tariq Mahmoud',
    userEmail: 'tariq@gulfre.com',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    planName: 'Pro Agent',
    amount: 799,
    tax: 39.95,
    discount: 0,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '1099',
    status: 'Refunded',
    date: '20 May 2026, 16:45',
    invoiceNumber: 'INV-2026-1042',
    transactionId: 'txn_3M981R8mZvKYlo2C44w1',
    gateway: 'Checkout.com',
  },
]

const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'PROMO-1',
    code: 'DUBAI2026',
    discountType: 'Percentage',
    discountValue: 15,
    assignedPlan: 'All Paid Plans',
    country: 'United Arab Emirates',
    usageCount: 142,
    usageLimit: 500,
    expirationDate: '31 Dec 2026',
    status: 'Active',
    minPurchase: 799,
    createdDate: '01 Jan 2026',
  },
  {
    id: 'PROMO-2',
    code: 'POWERAGENT500',
    discountType: 'Fixed Amount',
    discountValue: 500,
    assignedPlan: 'Power Agent',
    country: 'All',
    usageCount: 88,
    usageLimit: 100,
    expirationDate: '30 Jun 2026',
    status: 'Active',
    minPurchase: 2499,
    createdDate: '15 Feb 2026',
  },
  {
    id: 'PROMO-3',
    code: 'ELITEVIP',
    discountType: 'Percentage',
    discountValue: 20,
    assignedPlan: 'Elite Broker',
    country: 'Saudi Arabia',
    usageCount: 45,
    usageLimit: 50,
    expirationDate: '15 May 2026',
    status: 'Expired',
    minPurchase: 1599,
    createdDate: '01 Mar 2026',
  },
]

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-1048',
    invoiceNumber: 'INV-2026-1048',
    subscriberId: 'SUB-9841',
    userName: 'Amal Haddad',
    userEmail: 'amal.haddad@palmproperties.ae',
    country: 'United Arab Emirates',
    planName: 'Power Agent (Monthly)',
    amount: 2499,
    tax: 124.95,
    total: 2623.95,
    currency: 'AED',
    status: 'Paid',
    issuedDate: '12 May 2026',
    dueDate: '12 May 2026',
    billingPeriod: '12 May 2026 - 12 Jun 2026',
    paymentMethod: 'Credit Card •••• 4821',
  },
  {
    id: 'INV-1047',
    invoiceNumber: 'INV-2026-1047',
    subscriberId: 'SUB-9840',
    userName: 'Omar Nasser',
    userEmail: 'omar.nasser@avenue.ae',
    country: 'United Arab Emirates',
    planName: 'Elite Broker (Monthly)',
    amount: 1599,
    tax: 79.95,
    total: 1678.95,
    currency: 'AED',
    status: 'Paid',
    issuedDate: '04 May 2026',
    dueDate: '04 May 2026',
    billingPeriod: '04 May 2026 - 04 Jun 2026',
    paymentMethod: 'Apple Pay',
  },
  {
    id: 'INV-1046',
    invoiceNumber: 'INV-2026-1046',
    subscriberId: 'SUB-9839',
    userName: 'Youssef Ali',
    userEmail: 'youssef.ali@dubaimarina.com',
    country: 'United Arab Emirates',
    planName: 'Pro Agent (Monthly)',
    amount: 799,
    tax: 39.95,
    total: 838.95,
    currency: 'AED',
    status: 'Failed',
    issuedDate: '28 May 2026',
    dueDate: '28 May 2026',
    billingPeriod: '28 May 2026 - 28 Jun 2026',
    paymentMethod: 'Visa •••• 4242 (Declined)',
  },
  {
    id: 'INV-081',
    invoiceNumber: 'INV-2026-081',
    subscriberId: 'SUB-9838',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@downtownre.com',
    country: 'United Kingdom',
    planName: 'Enterprise Brokerage (Annual)',
    amount: 49990,
    tax: 2499.5,
    total: 52489.5,
    currency: 'AED',
    status: 'Paid',
    issuedDate: '15 Jan 2026',
    dueDate: '15 Jan 2026',
    billingPeriod: '15 Jan 2026 - 15 Jan 2027',
    paymentMethod: 'Bank Transfer (Network Int)',
  },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function SubscriptionsManagementInner() {
  const { toast } = useToast()

  // Primary Workspace Tab Navigation
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'plans' | 'subscribers' | 'payments' | 'promo-codes' | 'invoices'
  >('overview')

  // Time range for charts
  const [timeRange, setTimeRange] = React.useState<'7D' | '30D' | '90D' | '12M'>('30D')

  // Data states
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>(INITIAL_PLANS)
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>(INITIAL_SUBSCRIBERS)
  const [payments, setPayments] = React.useState<PaymentRecord[]>(INITIAL_PAYMENTS)
  const [promoCodes, setPromoCodes] = React.useState<PromoCode[]>(INITIAL_PROMO_CODES)
  const [invoices, setInvoices] = React.useState<Invoice[]>(INITIAL_INVOICES)

  // Modals & Workspaces State
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null)
  const [planEditorOpen, setPlanEditorOpen] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlan | null>(null)

  const [selectedSubscriber, setSelectedSubscriber] = React.useState<Subscriber | null>(null)
  const [subscriberDrawerOpen, setSubscriberDrawerOpen] = React.useState(false)

  const [selectedPayment, setSelectedPayment] = React.useState<PaymentRecord | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false)

  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [invoiceModalOpen, setInvoiceModalOpen] = React.useState(false)

  const [promoModalOpen, setPromoModalOpen] = React.useState(false)
  const [editingPromo, setEditingPromo] = React.useState<PromoCode | null>(null)

  // Action Dialogs
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false)
  const [downgradeDialogOpen, setDowngradeDialogOpen] = React.useState(false)
  const [extendDialogOpen, setExtendDialogOpen] = React.useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = React.useState(false)

  // Form State for Dialogs
  const [selectedNewPlanId, setSelectedNewPlanId] = React.useState<string>('PLAN-POWER')
  const [extensionDays, setExtensionDays] = React.useState<number>(14)
  const [extensionReason, setExtensionReason] = React.useState<string>('')
  const [cancelImmediate, setCancelImmediate] = React.useState<boolean>(false)
  const [cancelReason, setCancelReason] = React.useState<string>('')
  const [refundReason, setRefundReason] = React.useState<string>('')

  // Filter States (Universal Filter Architecture)
  const [showFilters, setShowFilters] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')
  const [planFilter, setPlanFilter] = React.useState<string>('All')
  const [countryFilter, setCountryFilter] = React.useState<string>('All')
  const [userTypeFilter, setUserTypeFilter] = React.useState<string>('All')
  const [autoRenewalFilter, setAutoRenewalFilter] = React.useState<string>('All')

  // Bulk Selection
  const [selectedSubscriberIds, setSelectedSubscriberIds] = React.useState<string[]>([])

  // Calculated Metrics
  const totalSubscribers = subscribers.length
  const activeSubscribers = subscribers.filter((s) => s.status === 'Active' || s.status === 'Renewed').length
  const totalMRR = plans.reduce((acc, p) => acc + p.monthlyRevenue, 0)
  const totalARR = totalMRR * 12
  const trialUsers = subscribers.filter((s) => s.status === 'Trial').length
  const gracePeriodUsers = subscribers.filter((s) => s.status === 'Grace Period').length
  const failedPaymentsCount = payments.filter((p) => p.status === 'Failed').length
  const refundedCount = payments.filter((p) => p.status === 'Refunded').length
  const chargebackCount = payments.filter((p) => p.status === 'Chargeback').length

  // Filtered Subscribers
  const filteredSubscribers = React.useMemo(() => {
    return subscribers.filter((sub) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        sub.userName.toLowerCase().includes(q) ||
        sub.userEmail.toLowerCase().includes(q) ||
        sub.id.toLowerCase().includes(q) ||
        sub.userId.toLowerCase().includes(q) ||
        sub.planName.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'All' || sub.status === statusFilter
      const matchesPlan = planFilter === 'All' || sub.planName === planFilter
      const matchesCountry = countryFilter === 'All' || sub.country === countryFilter
      const matchesUserType = userTypeFilter === 'All' || sub.userType === userTypeFilter
      const matchesAutoRenewal =
        autoRenewalFilter === 'All' ||
        (autoRenewalFilter === 'Enabled' ? sub.autoRenewal : !sub.autoRenewal)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan &&
        matchesCountry &&
        matchesUserType &&
        matchesAutoRenewal
      )
    })
  }, [subscribers, searchQuery, statusFilter, planFilter, countryFilter, userTypeFilter, autoRenewalFilter])

  // Count Active Filters
  const activeFilterCount =
    (statusFilter !== 'All' ? 1 : 0) +
    (planFilter !== 'All' ? 1 : 0) +
    (countryFilter !== 'All' ? 1 : 0) +
    (userTypeFilter !== 'All' ? 1 : 0) +
    (autoRenewalFilter !== 'All' ? 1 : 0)

  const clearAllFilters = () => {
    setStatusFilter('All')
    setPlanFilter('All')
    setCountryFilter('All')
    setUserTypeFilter('All')
    setAutoRenewalFilter('All')
    setSearchQuery('')
  }

  // Handle Export CSV
  const handleExportSubscribers = () => {
    const headers = ['Subscription ID', 'User Name', 'Email', 'Plan', 'Status', 'Cycle', 'Amount (AED)', 'Purchase Date', 'Renewal Date', 'Auto Renewal']
    const rows = filteredSubscribers.map((s) => [
      s.id,
      s.userName,
      s.userEmail,
      s.planName,
      s.status,
      s.billingCycle,
      s.amount,
      s.purchaseDate,
      s.renewalDate,
      s.autoRenewal ? 'ON' : 'OFF',
    ])
    exportToCsv('subscriptions_subscribers.csv', headers, rows)
    toast({
      variant: 'success',
      title: 'Export generated',
      description: `Downloaded ${filteredSubscribers.length} subscriber records.`,
    })
  }

  // Action Handlers
  const handleOpenSubscriberDetails = (sub: Subscriber) => {
    setSelectedSubscriber(sub)
    setSubscriberDrawerOpen(true)
  }

  const handleUpgradeConfirm = () => {
    if (!selectedSubscriber) return
    const targetPlan = plans.find((p) => p.id === selectedNewPlanId)
    if (!targetPlan) return

    const updated = subscribers.map((s) => {
      if (s.id === selectedSubscriber.id) {
        return {
          ...s,
          planId: targetPlan.id,
          planName: targetPlan.name,
          amount: targetPlan.monthlyPrice,
          timeline: [
            {
              id: `t_${Date.now()}`,
              event: `Plan Upgraded to ${targetPlan.name}`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              prevValue: s.planName,
              newValue: targetPlan.name,
              reason: 'Admin assisted plan upgrade with proration applied.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })

    setSubscribers(updated)
    setSelectedSubscriber(updated.find((s) => s.id === selectedSubscriber.id) || null)
    setUpgradeDialogOpen(false)
    toast({
      variant: 'success',
      title: 'Subscription upgraded',
      description: `${selectedSubscriber.userName} was upgraded to ${targetPlan.name}.`,
    })
  }

  const handleDowngradeConfirm = () => {
    if (!selectedSubscriber) return
    const targetPlan = plans.find((p) => p.id === selectedNewPlanId)
    if (!targetPlan) return

    const updated = subscribers.map((s) => {
      if (s.id === selectedSubscriber.id) {
        return {
          ...s,
          planId: targetPlan.id,
          planName: targetPlan.name,
          amount: targetPlan.monthlyPrice,
          timeline: [
            {
              id: `t_${Date.now()}`,
              event: `Plan Downgraded to ${targetPlan.name}`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              prevValue: s.planName,
              newValue: targetPlan.name,
              reason: 'Takes effect on next billing renewal.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })

    setSubscribers(updated)
    setSelectedSubscriber(updated.find((s) => s.id === selectedSubscriber.id) || null)
    setDowngradeDialogOpen(false)
    toast({
      variant: 'info',
      title: 'Downgrade scheduled',
      description: `${selectedSubscriber.userName} will switch to ${targetPlan.name} on next renewal.`,
    })
  }

  const handleExtendConfirm = () => {
    if (!selectedSubscriber) return
    const updated = subscribers.map((s) => {
      if (s.id === selectedSubscriber.id) {
        return {
          ...s,
          expiryDate: `Extended +${extensionDays}d`,
          renewalDate: `Extended +${extensionDays}d`,
          status: 'Active' as SubscriptionStatus,
          timeline: [
            {
              id: `t_${Date.now()}`,
              event: `Subscription Extended (+${extensionDays} Days)`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              reason: extensionReason || 'Complimentary grace extension provided by support.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })

    setSubscribers(updated)
    setSelectedSubscriber(updated.find((s) => s.id === selectedSubscriber.id) || null)
    setExtendDialogOpen(false)
    setExtensionReason('')
    toast({
      variant: 'success',
      title: 'Subscription extended',
      description: `Added ${extensionDays} days extension for ${selectedSubscriber.userName}.`,
    })
  }

  const handleCancelConfirm = () => {
    if (!selectedSubscriber) return
    const updated = subscribers.map((s) => {
      if (s.id === selectedSubscriber.id) {
        return {
          ...s,
          status: cancelImmediate ? ('Cancelled' as SubscriptionStatus) : s.status,
          autoRenewal: false,
          timeline: [
            {
              id: `t_${Date.now()}`,
              event: cancelImmediate ? 'Subscription Cancelled Immediately' : 'Subscription Cancelled at Period End',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              reason: cancelReason || 'Customer requested cancellation.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })

    setSubscribers(updated)
    setSelectedSubscriber(updated.find((s) => s.id === selectedSubscriber.id) || null)
    setCancelDialogOpen(false)
    setCancelReason('')
    toast({
      variant: 'error',
      title: 'Subscription cancelled',
      description: `Auto-renewal disabled for ${selectedSubscriber.userName}.`,
    })
  }

  const handleRefundConfirm = () => {
    if (!selectedPayment) return
    const updated = payments.map((p) => {
      if (p.id === selectedPayment.id) {
        return { ...p, status: 'Refunded' as PaymentStatus }
      }
      return p
    })
    setPayments(updated)
    setSelectedPayment(updated.find((p) => p.id === selectedPayment.id) || null)
    setRefundDialogOpen(false)
    toast({
      variant: 'success',
      title: 'Payment refunded',
      description: `Refund of AED ${selectedPayment.amount.toLocaleString()} processed back to customer payment method.`,
    })
  }

  return (
    <PlatformShell
      title="Subscriptions & Billing"
      eyebrow="Monetization Engine"
      actions={
        <div className="flex items-center gap-2">
          <MainButton
            variant="Secondary"
            size="sm"
            iconLeft={<Download className="size-3.5" />}
            label="Export Data"
            onClick={handleExportSubscribers}
          />
          <MainButton
            variant="Primary"
            size="sm"
            iconLeft={<Plus className="size-3.5" />}
            label="+ Create Plan"
            onClick={() => {
              setEditingPlan(null)
              setPlanEditorOpen(true)
            }}
          />
        </div>
      }
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            TOP HEADER CARD (Canonical Users Design Standard)
           ========================================================================= */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6f777f] uppercase tracking-wider mb-1">
                <span>Platform</span>
                <span>/</span>
                <span>Subscriptions</span>
                <span>/</span>
                <span className="text-[#00c2cb]">Subscribers & Plans</span>
              </div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Subscription Plans & MRR
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage agent membership tiers, track recurring MRR, control billing cycles, and oversee active subscribers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportSubscribers}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span>Export Subscriptions</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingPlan(null)
                  setPlanEditorOpen(true)
                }}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <Plus className="size-4" />
                <span>Create Plan</span>
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================================
            1. NAVIGATION SUB-TABS (Overview, Plans, Subscribers, Payments, Promo Codes, Invoices)
           ========================================================================= */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'overview', label: 'Overview & MRR', icon: <TrendingUp className="size-4" /> },
              { id: 'plans', label: `Plans (${plans.length})`, icon: <Layers className="size-4" /> },
              { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: <Users className="size-4" /> },
              { id: 'payments', label: `Payments (${payments.length})`, icon: <CreditCard className="size-4" /> },
              { id: 'promo-codes', label: `Promo Codes (${promoCodes.length})`, icon: <Tag className="size-4" /> },
              { id: 'invoices', label: `Invoices (${invoices.length})`, icon: <Receipt className="size-4" /> },
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

          {/* Time Range Selector for Analytics */}
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
            2. TAB CONTENT: OVERVIEW
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 ant-fade-in">
            {/* 8 Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Active Subscribers</span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#12b76a]">
                    <TrendingUp className="size-3" /> +12.4%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#1f2327]">
                    {activeSubscribers.toLocaleString()}
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">accounts</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">Total paid subscriptions active today</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Monthly Recurring Rev (MRR)</span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#12b76a]">
                    <TrendingUp className="size-3" /> +18.2%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#00838f]">
                    AED {(totalMRR / 1000).toFixed(1)}k
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">/ mo</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">Normalized monthly recurring volume</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Annual Run Rate (ARR)</span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#12b76a]">
                    <TrendingUp className="size-3" /> +24.8%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#1f2327]">
                    AED {(totalARR / 1000000).toFixed(2)}M
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">/ yr</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">Annualized forward subscription projection</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Active Trial Users</span>
                  <span className="rounded-full bg-[#e5f6f7] px-2 py-0.5 text-[10px] font-bold text-[#00838f]">
                    14-Day Free
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#1f2327]">
                    {trialUsers}
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">in evaluation</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">32% estimated conversion to Pro / Elite</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Expiring in 7 Days</span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#f79009]">
                    <Clock className="size-3" /> Action req
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#1f2327]">18</span>
                  <span className="text-[11.5px] text-[#8f969e]">subscriptions</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">Upcoming auto-renewals queued</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Failed Payments (Grace)</span>
                  <span className="rounded-full bg-[#fef3f2] px-2 py-0.5 text-[10px] font-bold text-[#d92d20]">
                    Needs Attention
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#d92d20]">
                    {failedPaymentsCount}
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">cards retrying</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">AED 3,196.00 currently in dunning cycle</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Refunds This Month</span>
                  <span className="text-[11px] font-bold text-[#6f777f]">0.4% rate</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#1f2327]">
                    {refundedCount}
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">AED 799.00</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">100% compliant with refund policy</p>
              </div>

              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#6f777f]">Active Chargebacks</span>
                  <span className="rounded-full bg-[#ecfdf3] px-2 py-0.5 text-[10px] font-bold text-[#027a48]">
                    0.0% Risk
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[26px] font-bold tracking-tight text-[#1f2327]">
                    {chargebackCount}
                  </span>
                  <span className="text-[11.5px] text-[#8f969e]">disputes</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6f777f]">Zero open cardholder disputes</p>
              </div>
            </div>

            {/* Visual Revenue & Subscription Trend Chart */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Revenue & Movement Dynamics ({timeRange})</h3>
                  <p className="text-[12px] text-[#6f777f]">
                    Live visualization of MRR growth, new subscriptions, upgrades, downgrades, and churn prevention.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11.5px]">
                  <span className="flex items-center gap-1.5 font-medium text-[#1f2327]">
                    <span className="size-2.5 rounded-full bg-[#00c2cb]" /> MRR Base
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#1f2327]">
                    <span className="size-2.5 rounded-full bg-[#12b76a]" /> New Signups
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#1f2327]">
                    <span className="size-2.5 rounded-full bg-[#7a5af8]" /> Upgrades
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#1f2327]">
                    <span className="size-2.5 rounded-full bg-[#f04438]" /> Cancellations
                  </span>
                </div>
              </div>

              {/* Responsive SVG Animated Bar Chart */}
              <div className="mt-5 grid grid-cols-6 sm:grid-cols-12 gap-2 items-end h-[180px] pt-4">
                {[
                  { m: 'Jan', mrr: 120, neu: 40, up: 18, ch: 4 },
                  { m: 'Feb', mrr: 145, neu: 48, up: 22, ch: 6 },
                  { m: 'Mar', mrr: 168, neu: 54, up: 30, ch: 5 },
                  { m: 'Apr', mrr: 195, neu: 62, up: 35, ch: 8 },
                  { m: 'May', mrr: 230, neu: 75, up: 42, ch: 6 },
                  { m: 'Jun', mrr: 265, neu: 84, up: 50, ch: 9 },
                  { m: 'Jul', mrr: 290, neu: 92, up: 55, ch: 7 },
                  { m: 'Aug', mrr: 320, neu: 104, up: 60, ch: 10 },
                  { m: 'Sep', mrr: 355, neu: 115, up: 68, ch: 8 },
                  { m: 'Oct', mrr: 390, neu: 124, up: 75, ch: 9 },
                  { m: 'Nov', mrr: 430, neu: 138, up: 82, ch: 11 },
                  { m: 'Dec', mrr: 485, neu: 155, up: 95, ch: 12 },
                ].map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div
                        className="w-full max-w-[28px] rounded-t-[3px] bg-[#7a5af8] opacity-80 transition-all group-hover:opacity-100"
                        style={{ height: `${col.up * 0.45}px` }}
                        title={`Upgrades: +${col.up}`}
                      />
                      <div
                        className="w-full max-w-[28px] bg-[#12b76a] opacity-85 transition-all group-hover:opacity-100"
                        style={{ height: `${col.neu * 0.45}px` }}
                        title={`New Subscriptions: +${col.neu}`}
                      />
                      <div
                        className="w-full max-w-[28px] rounded-b-[2px] bg-[#00c2cb] transition-all group-hover:bg-[#00838f]"
                        style={{ height: `${col.mrr * 0.22}px` }}
                        title={`MRR Base: AED ${col.mrr}k`}
                      />
                    </div>
                    <span className="text-[10.5px] font-bold text-[#6f777f] group-hover:text-[#1f2327]">
                      {col.m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. TAB CONTENT: PLANS (Table, Features, Live Comparison)
           ========================================================================= */}
        {activeTab === 'plans' && (
          <div className="space-y-6 ant-fade-in">
            {/* Top Toolbar for Plans */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Platform Subscription Plans</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Configure commercial tier limits, pricing, feature flags, trial durations, and availability.
                </p>
              </div>
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Plus className="size-3.5" />}
                label="+ Create New Plan"
                onClick={() => {
                  setEditingPlan(null)
                  setPlanEditorOpen(true)
                }}
              />
            </div>

            {/* Plans Table */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f8f9fa] text-[11.5px] font-bold uppercase tracking-wider text-[#6f777f]">
                      <th className="px-4 py-3">Plan Name</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Monthly Price</th>
                      <th className="px-3 py-3">Yearly Price</th>
                      <th className="px-3 py-3">Subscribers</th>
                      <th className="px-3 py-3">Offers Limit</th>
                      <th className="px-3 py-3">Requests Limit</th>
                      <th className="px-3 py-3">Visibility</th>
                      <th className="px-3 py-3">AI Suite</th>
                      <th className="px-3 py-3">Est. Monthly Rev</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {plans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-[#1f2327]">{plan.name}</div>
                          <div className="text-[11px] text-[#8f969e]">{plan.code} • {plan.trialDays}d trial</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                              plan.status === 'Active'
                                ? 'bg-[#ecfdf3] text-[#027a48]'
                                : plan.status === 'Draft'
                                ? 'bg-[#fffaeb] text-[#b54708]'
                                : 'bg-[#f2f4f7] text-[#475467]'
                            )}
                          >
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                          {plan.monthlyPrice === 0 ? 'Free' : `AED ${plan.monthlyPrice.toLocaleString()}`}
                          <span className="text-[10.5px] font-normal text-[#8f969e]"> /mo</span>
                        </td>
                        <td className="px-3 py-3.5 font-medium text-[#1f2327]">
                          {plan.yearlyPrice === 0 ? 'Free' : `AED ${plan.yearlyPrice.toLocaleString()}`}
                          <span className="text-[10.5px] font-normal text-[#8f969e]"> /yr</span>
                        </td>
                        <td className="px-3 py-3.5 font-bold text-[#00838f]">
                          {plan.subscribersCount.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 text-[#1f2327] font-medium">
                          {plan.limits.offers}
                        </td>
                        <td className="px-3 py-3.5 text-[#1f2327] font-medium">
                          {plan.limits.requests}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="rounded-[4px] bg-[#f4f5f6] px-2 py-0.5 text-[11px] font-bold text-[#1f2327]">
                            {plan.visibilityBoost}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="rounded-[4px] bg-[#e5f6f7] px-2 py-0.5 text-[11px] font-bold text-[#00838f]">
                            {plan.aiFeatures}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                          AED {plan.monthlyRevenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlan(plan)
                              }}
                              className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors cursor-pointer"
                              title="View Plan Details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPlan(plan)
                                setPlanEditorOpen(true)
                              }}
                              className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors cursor-pointer"
                              title="Edit Plan"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const dup: SubscriptionPlan = {
                                  ...plan,
                                  id: `PLAN-COPY-${Date.now()}`,
                                  name: `${plan.name} (Copy)`,
                                  code: `${plan.code}_copy`,
                                  status: 'Draft',
                                  subscribersCount: 0,
                                  monthlyRevenue: 0,
                                }
                                setPlans([...plans, dup])
                                toast({
                                  variant: 'success',
                                  title: 'Plan duplicated',
                                  description: `Created draft copy: ${dup.name}`,
                                })
                              }}
                              className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors cursor-pointer"
                              title="Duplicate Plan"
                            >
                              <Copy className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            4. TAB CONTENT: SUBSCRIBERS (Universal Filter Bar + Table + Details)
           ========================================================================= */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4 ant-fade-in">
            {/* Table Top Controls Bar with Filters */}
            <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              {/* Top Status Tabs & Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'All', label: 'All subscribers' },
                      { id: 'Active', label: 'Active' },
                      { id: 'Trial', label: 'Trial' },
                      { id: 'Grace Period', label: 'Grace Period' },
                      { id: 'Cancelled', label: 'Cancelled' },
                      { id: 'Expired', label: 'Expired' },
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
                    onClick={handleExportSubscribers}
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
                    placeholder="Search Name, Email, User ID, Sub ID..."
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

                {/* Plan Filter */}
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Plans</option>
                  {plans.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* Country Filter */}
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Countries</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>

                {/* User Type */}
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Agent">Agent</option>
                  <option value="Investor">Investor</option>
                  <option value="Brokerage">Brokerage</option>
                </select>

                {/* Auto-Renewal */}
                <select
                  value={autoRenewalFilter}
                  onChange={(e) => setAutoRenewalFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Auto-Renewal</option>
                  <option value="Enabled">Auto-Renewal ON</option>
                  <option value="Disabled">Auto-Renewal OFF</option>
                </select>

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

              {/* Subscribers Table */}
              <div className="overflow-x-auto table-scrollbar">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="px-4">Subscriber</th>
                      <th className="px-4">Assigned Plan</th>
                      <th className="px-4">Status</th>
                      <th className="px-4">Cycle</th>
                      <th className="px-4">Amount</th>
                      <th className="px-4">Purchase Date</th>
                      <th className="px-4">Next Renewal</th>
                      <th className="px-4">Auto Renew</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {filteredSubscribers.map((sub) => (
                      <tr
                        key={sub.id}
                        onClick={() => handleOpenSubscriberDetails(sub)}
                        className="h-[60px] whitespace-nowrap font-sans transition-colors hover:bg-[#f8f9fa] cursor-pointer"
                      >
                        <td className="px-4">
                          <div className="flex items-center gap-3">
                            <TableAvatar
                              src={sub.userAvatar}
                              name={sub.userName}
                              size="sm"
                              variant="brand"
                            />
                            <div>
                              <div className="font-semibold text-[13px] text-[#1f2327] hover:text-[#00838f]">
                                {sub.userName}
                              </div>
                              <div className="text-[11px] text-[#6f777f]">{sub.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4">
                          <span className="rounded-[6px] border border-[#d3d5d7] bg-[#f8f9fa] px-2 py-0.5 text-[12px] font-medium text-[#1f2327]">
                            {sub.planName}
                          </span>
                        </td>
                        <td className="px-4">
                          <FigmaStatusBadge
                            status={
                              sub.status === 'Active'
                                ? 'Active'
                                : sub.status === 'Trial'
                                ? 'Pending'
                                : sub.status === 'Grace Period'
                                ? 'Under review'
                                : sub.status === 'Cancelled'
                                ? 'Cancelled'
                                : 'Expired'
                            }
                          />
                        </td>
                        <td className="px-4 font-medium text-[13px] text-[#6f777f]">
                          {sub.billingCycle}
                        </td>
                        <td className="px-4 font-semibold tabular-nums text-[#1f2327]">
                          AED {sub.amount.toLocaleString()}
                        </td>
                        <td className="px-4 text-[13px] text-[#6f777f]">
                          {sub.purchaseDate}
                        </td>
                        <td className="px-4 font-medium text-[13px] text-[#1f2327]">
                          {sub.renewalDate}
                        </td>
                        <td className="px-4">
                          <span
                            className={cn(
                              'text-[12px] font-semibold',
                              sub.autoRenewal ? 'text-[#027a48]' : 'text-[#d92d20]'
                            )}
                          >
                            {sub.autoRenewal ? 'ON' : 'OFF'}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenSubscriberDetails(sub)
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
            5. TAB CONTENT: PAYMENTS
           ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-4 ant-fade-in">
            {/* Payments KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Successful</span>
                <div className="mt-1 text-[20px] font-bold text-[#027a48]">4</div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Pending</span>
                <div className="mt-1 text-[20px] font-bold text-[#b54708]">0</div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Failed</span>
                <div className="mt-1 text-[20px] font-bold text-[#d92d20]">1</div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Refunded</span>
                <div className="mt-1 text-[20px] font-bold text-[#6f777f]">1</div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Chargebacks</span>
                <div className="mt-1 text-[20px] font-bold text-[#1f2327]">0</div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f8f9fa] text-[11.5px] font-bold uppercase tracking-wider text-[#6f777f]">
                      <th className="px-4 py-3">Payment ID</th>
                      <th className="px-3 py-3">Subscriber</th>
                      <th className="px-3 py-3">Plan</th>
                      <th className="px-3 py-3">Amount</th>
                      <th className="px-3 py-3">Tax (5%)</th>
                      <th className="px-3 py-3">Method</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Date</th>
                      <th className="px-3 py-3">Invoice</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-4 py-3.5 font-bold text-[#1f2327] font-mono">{p.id}</td>
                        <td className="px-3 py-3.5">
                          <div className="font-bold text-[#1f2327]">{p.userName}</div>
                          <div className="text-[11px] text-[#8f969e]">{p.userEmail}</div>
                        </td>
                        <td className="px-3 py-3.5 font-medium text-[#1f2327]">{p.planName}</td>
                        <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                          AED {p.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 text-[#6f777f]">
                          AED {p.tax.toFixed(2)}
                        </td>
                        <td className="px-3 py-3.5 text-[#1f2327]">
                          {p.paymentMethod} {p.cardLast4 ? `•••• ${p.cardLast4}` : ''}
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                              p.status === 'Successful' && 'bg-[#ecfdf3] text-[#027a48]',
                              p.status === 'Failed' && 'bg-[#fef3f2] text-[#d92d20]',
                              p.status === 'Refunded' && 'bg-[#f4f5f6] text-[#475467]',
                              p.status === 'Pending' && 'bg-[#fffaeb] text-[#b54708]'
                            )}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-[#6f777f]">{p.date}</td>
                        <td className="px-3 py-3.5 font-medium text-[#00838f]">
                          {p.invoiceNumber}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPayment(p)
                                setPaymentModalOpen(true)
                              }}
                              className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors"
                              title="View Payment Details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            {p.status === 'Successful' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPayment(p)
                                  setRefundDialogOpen(true)
                                }}
                                className="rounded-[6px] border border-[#d3d5d7] px-2 py-1 text-[11px] font-bold text-[#d92d20] hover:bg-[#fef3f2] transition-colors"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            6. TAB CONTENT: PROMO CODES
           ========================================================================= */}
        {activeTab === 'promo-codes' && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Promotional Coupons & Codes</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Generate percentage or fixed AED discount codes with usage limits, plan targets, and expiry dates.
                </p>
              </div>
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Plus className="size-3.5" />}
                label="+ Create Promo Code"
                onClick={() => {
                  setEditingPromo(null)
                  setPromoModalOpen(true)
                }}
              />
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f8f9fa] text-[11.5px] font-bold uppercase tracking-wider text-[#6f777f]">
                    <th className="px-4 py-3">Promo Code</th>
                    <th className="px-3 py-3">Discount</th>
                    <th className="px-3 py-3">Discount Type</th>
                    <th className="px-3 py-3">Target Plan</th>
                    <th className="px-3 py-3">Country</th>
                    <th className="px-3 py-3">Usage vs Limit</th>
                    <th className="px-3 py-3">Expiration Date</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {promoCodes.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-4 py-3.5 font-bold font-mono text-[#00838f]">{c.code}</td>
                      <td className="px-3 py-3.5 font-bold text-[#1f2327]">
                        {c.discountType === 'Percentage' ? `${c.discountValue}% Off` : `AED ${c.discountValue} Off`}
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{c.discountType}</td>
                      <td className="px-3 py-3.5 font-medium text-[#1f2327]">{c.assignedPlan}</td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{c.country}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#e5e7eb] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#00c2cb] h-full rounded-full"
                              style={{ width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11.5px] font-bold text-[#1f2327]">
                            {c.usageCount} / {c.usageLimit}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{c.expirationDate}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                            c.status === 'Active' ? 'bg-[#ecfdf3] text-[#027a48]' : 'bg-[#fef3f2] text-[#d92d20]'
                          )}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setPromoCodes(promoCodes.filter((x) => x.id !== c.id))
                            toast({
                              variant: 'info',
                              title: 'Promo code removed',
                              description: `Code ${c.code} has been deactivated.`,
                            })
                          }}
                          className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#fef3f2] hover:text-[#d92d20] transition-colors"
                          title="Delete"
                        >
                          <Archive className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            7. TAB CONTENT: INVOICES
           ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-4 ant-fade-in">
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f8f9fa] text-[11.5px] font-bold uppercase tracking-wider text-[#6f777f]">
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-3 py-3">Subscriber</th>
                    <th className="px-3 py-3">Plan / Description</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Tax</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Issued Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-4 py-3.5 font-bold font-mono text-[#00838f]">{inv.invoiceNumber}</td>
                      <td className="px-3 py-3.5">
                        <div className="font-bold text-[#1f2327]">{inv.userName}</div>
                        <div className="text-[11px] text-[#8f969e]">{inv.userEmail}</div>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-[#1f2327]">{inv.planName}</td>
                      <td className="px-3 py-3.5 font-medium text-[#1f2327]">AED {inv.amount.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-[#6f777f]">AED {inv.tax.toFixed(2)}</td>
                      <td className="px-3 py-3.5 font-bold text-[#1f2327]">AED {inv.total.toLocaleString()}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                            inv.status === 'Paid' && 'bg-[#ecfdf3] text-[#027a48]',
                            inv.status === 'Pending' && 'bg-[#fffaeb] text-[#b54708]',
                            inv.status === 'Failed' && 'bg-[#fef3f2] text-[#d92d20]'
                          )}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-[#6f777f]">{inv.issuedDate}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoice(inv)
                              setInvoiceModalOpen(true)
                            }}
                            className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors"
                            title="View PDF Invoice"
                          >
                            <FileText className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUBSCRIBER DETAILS FULL WORKSPACE / SHEET
         ========================================================================= */}
      {subscriberDrawerOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs ant-fade-in">
          <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 bg-[#fafbfc]">
              <div className="flex items-center gap-3">
                {selectedSubscriber.userAvatar ? (
                  <img
                    src={selectedSubscriber.userAvatar}
                    alt={selectedSubscriber.userName}
                    className="size-11 rounded-full object-cover border border-[#d3d5d7]"
                  />
                ) : (
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#00c2cb] text-white font-bold text-[14px]">
                    {selectedSubscriber.userName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-[17px] font-bold text-[#1f2327]">{selectedSubscriber.userName}</h2>
                  <p className="text-[12px] text-[#6f777f]">
                    {selectedSubscriber.userEmail} • {selectedSubscriber.country}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubscriberDrawerOpen(false)}
                className="rounded-full p-2 text-[#8f969e] hover:bg-[#f4f5f6] hover:text-[#1f2327]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] px-6 py-3 bg-white">
              <button
                type="button"
                onClick={() => setUpgradeDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#00c2cb] px-3 py-1.5 text-[12px] font-bold text-white shadow-2xs hover:bg-[#00838f] cursor-pointer"
              >
                <TrendingUp className="size-3.5" /> Upgrade Plan
              </button>
              <button
                type="button"
                onClick={() => setDowngradeDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] px-3 py-1.5 text-[12px] font-bold text-[#1f2327] hover:bg-[#f4f5f6] cursor-pointer"
              >
                <TrendingDown className="size-3.5" /> Downgrade
              </button>
              <button
                type="button"
                onClick={() => setExtendDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] px-3 py-1.5 text-[12px] font-bold text-[#1f2327] hover:bg-[#f4f5f6] cursor-pointer"
              >
                <Clock className="size-3.5" /> Extend Days
              </button>
              <button
                type="button"
                onClick={() => setCancelDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#fda29b] px-3 py-1.5 text-[12px] font-bold text-[#d92d20] hover:bg-[#fef3f2] cursor-pointer"
              >
                <Ban className="size-3.5" /> Cancel Sub
              </button>
            </div>

            {/* Visual Billing Lifecycle Stepper (Spec 10.13) */}
            <div className="border-b border-[#e5e7eb] px-6 py-4 bg-[#fafbfc]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6f777f]">
                Billing Lifecycle Status
              </span>
              <div className="mt-3 flex items-center justify-between">
                {[
                  { label: 'Trial', active: true, done: selectedSubscriber.status !== 'Trial' },
                  { label: 'Active', active: selectedSubscriber.status === 'Active' || selectedSubscriber.status === 'Renewed', done: selectedSubscriber.status === 'Renewed' },
                  { label: 'Renewal', active: selectedSubscriber.status === 'Grace Period' || selectedSubscriber.status === 'Active', done: false },
                  { label: 'Renewed', active: selectedSubscriber.status === 'Renewed', done: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full text-[11px] font-bold',
                        step.done
                          ? 'bg-[#12b76a] text-white'
                          : step.active
                          ? 'bg-[#00c2cb] text-white'
                          : 'bg-[#e5e7eb] text-[#8f969e]'
                      )}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <span
                      className={cn(
                        'text-[12px] font-bold',
                        step.active || step.done ? 'text-[#1f2327]' : 'text-[#8f969e]'
                      )}
                    >
                      {step.label}
                    </span>
                    {idx < 3 && <div className="h-0.5 w-8 sm:w-12 bg-[#e5e7eb]" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6">
              {/* Summary Card */}
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1f2327]">Current Plan Details</span>
                  <span className="rounded-[4px] bg-[#e5f6f7] px-2.5 py-0.5 text-[12px] font-bold text-[#00838f]">
                    {selectedSubscriber.planName}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] pt-2 border-t border-[#f0f2f5]">
                  <div>
                    <span className="text-[#8f969e] block">Billing Amount</span>
                    <span className="font-bold text-[#1f2327]">
                      AED {selectedSubscriber.amount.toLocaleString()} / {selectedSubscriber.billingCycle}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8f969e] block">Next Renewal</span>
                    <span className="font-bold text-[#1f2327]">{selectedSubscriber.renewalDate}</span>
                  </div>
                  <div>
                    <span className="text-[#8f969e] block">Auto Renewal</span>
                    <span className="font-bold text-[#027a48]">{selectedSubscriber.autoRenewal ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div>
                    <span className="text-[#8f969e] block">Sub ID</span>
                    <span className="font-mono text-[#6f777f]">{selectedSubscriber.id}</span>
                  </div>
                </div>
              </div>

              {/* Usage Progress Gauges */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-[#1f2327]">Current Month Quotas & Consumption</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold text-[#1f2327] mb-1">
                      <span>Offers Submitted</span>
                      <span>{selectedSubscriber.usage.offersUsed} / {selectedSubscriber.usage.offersLimit}</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                      <div
                        className="bg-[#00c2cb] h-2 rounded-full"
                        style={{ width: `${Math.min(100, (selectedSubscriber.usage.offersUsed / (selectedSubscriber.usage.offersLimit || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold text-[#1f2327] mb-1">
                      <span>AI Valuation & Pitch Credits</span>
                      <span>{selectedSubscriber.usage.aiCreditsUsed} / {selectedSubscriber.usage.aiCreditsLimit}</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                      <div
                        className="bg-[#7a5af8] h-2 rounded-full"
                        style={{ width: `${Math.min(100, (selectedSubscriber.usage.aiCreditsUsed / (selectedSubscriber.usage.aiCreditsLimit || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Immutable Timeline History */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-[#1f2327]">Immutable Subscription Timeline</h4>
                <div className="rounded-[10px] border border-[#e5e7eb] divide-y divide-[#f0f2f5] bg-[#fafbfc] p-3">
                  {selectedSubscriber.timeline.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-[#1f2327]">{item.event}</span>
                        <span className="text-[11px] text-[#8f969e]">{item.date}</span>
                      </div>
                      <p className="text-[11.5px] text-[#6f777f] mt-0.5">{item.reason}</p>
                      <span className="text-[10.5px] text-[#8f969e]">Actor: {item.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          UPGRADE PLAN DIALOG (Safety confirmation with proration)
         ========================================================================= */}
      {upgradeDialogOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7]">
            <h3 className="text-[16px] font-bold text-[#1f2327]">Upgrade Subscription</h3>
            <p className="mt-1 text-[12px] text-[#6f777f]">
              Select new commercial tier. Prorated difference will be automatically calculated and charged.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Current Plan</label>
                <div className="text-[13px] font-bold text-[#1f2327]">
                  {selectedSubscriber.planName} (AED {selectedSubscriber.amount.toLocaleString()} /mo)
                </div>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Select New Tier</label>
                <select
                  value={selectedNewPlanId}
                  onChange={(e) => setSelectedNewPlanId(e.target.value)}
                  className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] bg-white px-3 py-2 text-[12.5px] font-bold outline-none"
                >
                  {plans
                    .filter((p) => p.monthlyPrice > selectedSubscriber.amount)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — AED {p.monthlyPrice.toLocaleString()} /mo
                      </option>
                    ))}
                </select>
              </div>

              <div className="rounded-[8px] bg-[#e5f6f7] p-3 text-[12px] text-[#00838f]">
                <strong>Proration Notice:</strong> Upgrades take effect immediately. Remaining unused days from current plan will be credited against the first invoice.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setUpgradeDialogOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpgradeConfirm}
                className="rounded-[6px] bg-[#00c2cb] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#00838f]"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOWNGRADE PLAN DIALOG
         ========================================================================= */}
      {downgradeDialogOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7]">
            <h3 className="text-[16px] font-bold text-[#1f2327]">Downgrade Subscription</h3>
            <p className="mt-1 text-[12px] text-[#6f777f]">
              Downgrade will take effect on the next billing renewal date ({selectedSubscriber.renewalDate}).
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Current Plan</label>
                <div className="text-[13px] font-bold text-[#1f2327]">{selectedSubscriber.planName}</div>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Select New Plan</label>
                <select
                  value={selectedNewPlanId}
                  onChange={(e) => setSelectedNewPlanId(e.target.value)}
                  className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] bg-white px-3 py-2 text-[12.5px] font-bold outline-none"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — AED {p.monthlyPrice.toLocaleString()} /mo
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDowngradeDialogOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDowngradeConfirm}
                className="rounded-[6px] bg-[#1f2327] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-black"
              >
                Schedule Downgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          EXTEND SUBSCRIPTION DIALOG
         ========================================================================= */}
      {extendDialogOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7]">
            <h3 className="text-[16px] font-bold text-[#1f2327]">Extend Subscription Period</h3>
            <p className="mt-1 text-[12px] text-[#6f777f]">
              Provide complimentary extension without billing customer.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Extension Duration</label>
                <div className="mt-1 flex gap-2">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtensionDays(d)}
                      className={cn(
                        'flex-1 rounded-[6px] border py-2 text-[12px] font-bold transition-all',
                        extensionDays === d
                          ? 'border-[#00c2cb] bg-[#e5f6f7] text-[#00838f]'
                          : 'border-[#d3d5d7] text-[#1f2327] hover:bg-[#f4f5f6]'
                      )}
                    >
                      +{d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Reason for Extension</label>
                <textarea
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  placeholder="e.g. VIP agent support resolution compensation..."
                  className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] p-2 text-[12px] outline-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExtendDialogOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtendConfirm}
                className="rounded-[6px] bg-[#00c2cb] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#00838f]"
              >
                Apply Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CANCEL SUBSCRIPTION DIALOG
         ========================================================================= */}
      {cancelDialogOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#fda29b]">
            <h3 className="text-[16px] font-bold text-[#d92d20]">Cancel Subscription</h3>
            <p className="mt-1 text-[12px] text-[#6f777f]">
              Disables auto-renewal. Customer will retain features until the end of their current paid term.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cancel_imm"
                  checked={cancelImmediate}
                  onChange={(e) => setCancelImmediate(e.target.checked)}
                  className="size-4 text-[#d92d20] rounded"
                />
                <label htmlFor="cancel_imm" className="text-[12px] font-bold text-[#1f2327]">
                  Cancel immediately (Revoke access now)
                </label>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Cancellation Reason</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Required: State why customer cancelled..."
                  className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] p-2 text-[12px] outline-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelDialogOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="rounded-[6px] bg-[#d92d20] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#b42318]"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REFUND PAYMENT CONFIRMATION DIALOG (Spec 10.8)
         ========================================================================= */}
      {refundDialogOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#fda29b]">
            <h3 className="text-[16px] font-bold text-[#d92d20]">Refund Payment #{selectedPayment.id}</h3>
            <p className="mt-1 text-[12px] text-[#6f777f]">
              This will refund <strong>AED {selectedPayment.amount.toLocaleString()}</strong> to original payment method ({selectedPayment.paymentMethod}).
            </p>

            <div className="mt-4">
              <label className="text-[11.5px] font-semibold text-[#6f777f]">Reason for Refund</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="State the reason for compliance audit..."
                className="mt-1 w-full rounded-[6px] border border-[#d3d5d7] p-2 text-[12px] outline-none"
                rows={2}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRefundDialogOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRefundConfirm}
                className="rounded-[6px] bg-[#d92d20] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#b42318]"
              >
                Refund Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INVOICE DETAILS MODAL (Spec 10.12 Printable PDF View)
         ========================================================================= */}
      {invoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-xl rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <span className="text-[18px] font-bold text-[#00838f]">DUSEAT REAL ESTATE MARKETPLACE</span>
                <p className="text-[11.5px] text-[#8f969e]">Tax Invoice #{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="rounded-full p-1.5 text-[#8f969e] hover:bg-[#f4f5f6]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <span className="text-[#8f969e] font-semibold block">Bill To:</span>
                <span className="font-bold text-[#1f2327] block">{selectedInvoice.userName}</span>
                <span className="text-[#6f777f] block">{selectedInvoice.userEmail}</span>
                <span className="text-[#6f777f] block">{selectedInvoice.country}</span>
              </div>
              <div className="text-right">
                <span className="text-[#8f969e] font-semibold block">Issued Date:</span>
                <span className="font-bold text-[#1f2327] block">{selectedInvoice.issuedDate}</span>
                <span className="text-[#8f969e] font-semibold block mt-1">Status:</span>
                <span className="font-bold text-[#027a48] block">{selectedInvoice.status}</span>
              </div>
            </div>

            <div className="rounded-[8px] border border-[#e5e7eb] overflow-hidden">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f8f9fa] border-b border-[#e5e7eb] text-[11px] font-bold text-[#6f777f]">
                  <tr>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-right">Amount (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f0f2f5]">
                    <td className="p-2.5 font-bold text-[#1f2327]">{selectedInvoice.planName}</td>
                    <td className="p-2.5 text-right font-bold text-[#1f2327]">
                      AED {selectedInvoice.amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f2f5] text-[#6f777f]">
                    <td className="p-2.5">UAE VAT (5%)</td>
                    <td className="p-2.5 text-right">AED {selectedInvoice.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-[#fafbfc] font-bold text-[#1f2327] text-[13px]">
                    <td className="p-2.5">Total Paid</td>
                    <td className="p-2.5 text-right text-[#00838f]">
                      AED {selectedInvoice.total.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  toast({
                    variant: 'success',
                    title: 'Invoice downloaded',
                    description: `Downloaded PDF for ${selectedInvoice.invoiceNumber}.`,
                  })
                }}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-bold text-[#1f2327] hover:bg-[#f4f5f6]"
              >
                <Download className="size-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}

export function SubscriptionsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <SubscriptionsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}

