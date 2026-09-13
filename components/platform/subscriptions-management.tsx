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
  {
    id: 'PLAN-CUSTOM',
    name: 'Custom Tailored',
    code: 'custom',
    description: 'Bespoke corporate solution for national developer networks and sovereign wealth funds.',
    status: 'Active',
    monthlyPrice: 8999,
    yearlyPrice: 89990,
    currency: 'AED',
    trialDays: 30,
    gracePeriodDays: 21,
    subscribersCount: 18,
    monthlyRevenue: 161982,
    annualRevenue: 1943784,
    limits: {
      offers: 'Unlimited',
      requests: 'Unlimited',
      properties: 'Unlimited',
      messages: 'Unlimited',
      aiCredits: 'Unlimited',
    },
    features: [
      { id: 'f1', name: 'Dedicated Infrastructure & SLA Guarantee', included: true, highlight: true },
      { id: 'f2', name: 'Unlimited Seats & Subsidiaries Management', included: true, highlight: true },
      { id: 'f3', name: 'Custom AI Fine-Tuning & Deal Matching Engine', included: true, highlight: true },
      { id: 'f4', name: 'White-label Custom Branded Portals', included: true },
      { id: 'f5', name: '24/7 Dedicated Senior Engineering Concierge', included: true, highlight: true },
      { id: 'f6', name: 'Zero Transaction & Escrow Processing Fees', included: true },
    ],
    visibilityBoost: '10x Maximum',
    aiFeatures: 'Custom Enterprise',
    availability: {
      countries: ['All'],
      userTypes: ['Brokerage', 'Investor'],
    },
    conversionRate: '54.0%',
    churnRate: '0.1%',
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
  {
    id: 'SUB-9835',
    userId: 'USR-1042',
    userName: 'Rashid Al-Falasi',
    userEmail: 'rashid@falasiproperties.ae',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    userType: 'Brokerage',
    country: 'United Arab Emirates',
    planId: 'PLAN-CUSTOM',
    planName: 'Custom Tailored',
    status: 'Renewed',
    purchaseDate: '10 Jan 2025',
    renewalDate: '10 Jan 2027',
    expiryDate: '10 Jan 2027',
    paymentStatus: 'Successful',
    amount: 89990,
    currency: 'AED',
    billingCycle: 'Yearly',
    autoRenewal: true,
    usage: {
      offersUsed: 520,
      offersLimit: 9999,
      requestsUsed: 310,
      requestsLimit: 9999,
      aiCreditsUsed: 8400,
      aiCreditsLimit: 9999,
    },
    appliedPromo: {
      code: 'DUBAI2026',
      discount: '15% Off',
      savings: 13498,
    },
    timeline: [
      {
        id: 't1',
        event: 'Subscription Renewed Successfully',
        date: '10 Jan 2026, 09:15',
        actor: 'Auto-Billing Engine',
        reason: 'Annual contract renewed for 12 months with VIP terms.',
      },
    ],
  },
  {
    id: 'SUB-9834',
    userId: 'USR-1041',
    userName: 'Kareem Mansoor',
    userEmail: 'kareem.m@realtorshub.com',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    userType: 'Agent',
    country: 'Qatar',
    planId: 'PLAN-PRO',
    planName: 'Pro Agent',
    status: 'Expired',
    purchaseDate: '01 Jan 2025',
    renewalDate: '01 Feb 2026',
    expiryDate: '01 Feb 2026',
    paymentStatus: 'Failed',
    amount: 799,
    currency: 'AED',
    billingCycle: 'Monthly',
    autoRenewal: false,
    usage: {
      offersUsed: 30,
      offersLimit: 30,
      requestsUsed: 20,
      requestsLimit: 20,
      aiCreditsUsed: 200,
      aiCreditsLimit: 200,
    },
    timeline: [
      {
        id: 't1',
        event: 'Grace Period Ended - Term Expired',
        date: '08 Feb 2026, 00:01',
        actor: 'System',
        reason: 'Payment retry failed repeatedly. Access revoked.',
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
  {
    id: 'PAY-8836',
    subscriberId: 'SUB-9837',
    userName: 'Khalid Al Mansoori',
    userEmail: 'khalid@mansooricapital.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    planName: 'Pro Agent',
    amount: 799,
    tax: 39.95,
    discount: 0,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '5510',
    status: 'Pending',
    date: '24 May 2026, 16:40',
    invoiceNumber: 'INV-2026-1045',
    transactionId: 'txn_3M981X9zZvKYlo2C77k4',
    gateway: 'Stripe UAE',
  },
  {
    id: 'PAY-8835',
    subscriberId: 'SUB-9836',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@luxuryuae.com',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    planName: 'Elite Broker',
    amount: 1599,
    tax: 79.95,
    discount: 0,
    currency: 'AED',
    paymentMethod: 'Credit Card',
    cardLast4: '3049',
    status: 'Chargeback',
    date: '10 May 2026, 11:20',
    invoiceNumber: 'INV-2026-1039',
    transactionId: 'txn_3M981C2wZvKYlo2C99m8',
    gateway: 'Stripe UAE',
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
  const [generateInvoiceOpen, setGenerateInvoiceOpen] = React.useState(false)
  const [drawerActiveTab, setDrawerActiveTab] = React.useState<'overview' | 'payments' | 'invoices' | 'timeline'>('overview')

  // Action Dialogs
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false)
  const [downgradeDialogOpen, setDowngradeDialogOpen] = React.useState(false)
  const [extendDialogOpen, setExtendDialogOpen] = React.useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = React.useState(false)

  // Plan Editor State
  const [planForm, setPlanForm] = React.useState<{
    name: string
    code: string
    description: string
    status: 'Active' | 'Draft' | 'Archived'
    monthlyPrice: number
    yearlyPrice: number
    currency: string
    trialDays: number
    gracePeriodDays: number
    offersLimit: string
    requestsLimit: string
    propertiesLimit: string
    messagesLimit: string
    aiCreditsLimit: string
    visibilityBoost: 'Standard' | '2x Boost' | '5x Priority' | '10x Maximum'
    aiFeatures: 'Basic' | 'Advanced' | 'Full Suite' | 'Custom Enterprise'
    features: PlanFeature[]
    countries: string
    userTypes: ('Agent' | 'Investor' | 'Brokerage')[]
  }>({
    name: '',
    code: '',
    description: '',
    status: 'Active',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    currency: 'AED',
    trialDays: 14,
    gracePeriodDays: 7,
    offersLimit: '50',
    requestsLimit: '30',
    propertiesLimit: '25',
    messagesLimit: 'Unlimited',
    aiCreditsLimit: '500',
    visibilityBoost: '2x Boost',
    aiFeatures: 'Advanced',
    features: [
      { id: 'f1', name: 'Marketplace browsing & leads search', included: true },
      { id: 'f2', name: 'Priority 24/7 dedicated support', included: true, highlight: true },
      { id: 'f3', name: 'Verified Agent Directory badge', included: true },
      { id: 'f4', name: 'AI Valuation & ROI Predictor', included: true },
      { id: 'f5', name: 'Direct Escrow Payment processing', included: false },
      { id: 'f6', name: 'WhatsApp & CRM automated webhook sync', included: false },
    ],
    countries: 'United Arab Emirates, Saudi Arabia',
    userTypes: ['Agent'],
  })

  // Sync Plan Form on edit
  React.useEffect(() => {
    if (editingPlan) {
      setPlanForm({
        name: editingPlan.name,
        code: editingPlan.code,
        description: editingPlan.description,
        status: editingPlan.status,
        monthlyPrice: editingPlan.monthlyPrice,
        yearlyPrice: editingPlan.yearlyPrice,
        currency: editingPlan.currency,
        trialDays: editingPlan.trialDays,
        gracePeriodDays: editingPlan.gracePeriodDays,
        offersLimit: String(editingPlan.limits.offers),
        requestsLimit: String(editingPlan.limits.requests),
        propertiesLimit: String(editingPlan.limits.properties),
        messagesLimit: String(editingPlan.limits.messages),
        aiCreditsLimit: String(editingPlan.limits.aiCredits),
        visibilityBoost: editingPlan.visibilityBoost,
        aiFeatures: editingPlan.aiFeatures,
        features: editingPlan.features,
        countries: editingPlan.availability.countries.join(', '),
        userTypes: editingPlan.availability.userTypes,
      })
    } else {
      setPlanForm({
        name: '',
        code: '',
        description: '',
        status: 'Active',
        monthlyPrice: 999,
        yearlyPrice: 9990,
        currency: 'AED',
        trialDays: 14,
        gracePeriodDays: 7,
        offersLimit: '50',
        requestsLimit: '30',
        propertiesLimit: '25',
        messagesLimit: 'Unlimited',
        aiCreditsLimit: '500',
        visibilityBoost: '2x Boost',
        aiFeatures: 'Advanced',
        features: [
          { id: 'f1', name: 'Marketplace browsing & leads search', included: true },
          { id: 'f2', name: 'Priority 24/7 dedicated support', included: true, highlight: true },
          { id: 'f3', name: 'Verified Agent Directory badge', included: true },
          { id: 'f4', name: 'AI Valuation & ROI Predictor', included: true },
          { id: 'f5', name: 'Direct Escrow Payment processing', included: false },
          { id: 'f6', name: 'WhatsApp & CRM automated webhook sync', included: false },
        ],
        countries: 'All',
        userTypes: ['Agent'],
      })
    }
  }, [editingPlan, planEditorOpen])

  // Promo Code Form State
  const [promoForm, setPromoForm] = React.useState<{
    code: string
    discountType: PromoDiscountType
    discountValue: number
    assignedPlan: string
    country: string
    usageLimit: number
    expirationDate: string
    status: 'Active' | 'Scheduled' | 'Expired' | 'Disabled'
    minPurchase: number
  }>({
    code: '',
    discountType: 'Percentage',
    discountValue: 15,
    assignedPlan: 'All Paid Plans',
    country: 'United Arab Emirates',
    usageLimit: 100,
    expirationDate: '31 Dec 2026',
    status: 'Active',
    minPurchase: 799,
  })

  React.useEffect(() => {
    if (editingPromo) {
      setPromoForm({
        code: editingPromo.code,
        discountType: editingPromo.discountType,
        discountValue: editingPromo.discountValue,
        assignedPlan: editingPromo.assignedPlan,
        country: editingPromo.country,
        usageLimit: editingPromo.usageLimit,
        expirationDate: editingPromo.expirationDate,
        status: editingPromo.status,
        minPurchase: editingPromo.minPurchase || 0,
      })
    } else {
      setPromoForm({
        code: '',
        discountType: 'Percentage',
        discountValue: 15,
        assignedPlan: 'All Paid Plans',
        country: 'United Arab Emirates',
        usageLimit: 100,
        expirationDate: '31 Dec 2026',
        status: 'Active',
        minPurchase: 799,
      })
    }
  }, [editingPromo, promoModalOpen])

  // Generate Invoice Form State
  const [invoiceForm, setInvoiceForm] = React.useState<{
    subscriberId: string
    planName: string
    amount: number
    tax: number
    issuedDate: string
    dueDate: string
    paymentMethod: string
    status: InvoiceStatus
  }>({
    subscriberId: 'SUB-9841',
    planName: 'Power Agent (Monthly)',
    amount: 2499,
    tax: 124.95,
    issuedDate: '12 May 2026',
    dueDate: '12 May 2026',
    paymentMethod: 'Credit Card •••• 4821',
    status: 'Paid',
  })

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

  // Save Plan (Create or Edit)
  const handleSavePlan = () => {
    if (!planForm.name.trim()) {
      toast({ variant: 'error', title: 'Plan Name Required', description: 'Please provide a valid plan name.' })
      return
    }

    const offersVal: number | 'Unlimited' = planForm.offersLimit === 'Unlimited' ? 'Unlimited' : parseInt(planForm.offersLimit) || 0
    const requestsVal: number | 'Unlimited' = planForm.requestsLimit === 'Unlimited' ? 'Unlimited' : parseInt(planForm.requestsLimit) || 0
    const propertiesVal: number | 'Unlimited' = planForm.propertiesLimit === 'Unlimited' ? 'Unlimited' : parseInt(planForm.propertiesLimit) || 0
    const messagesVal: number | 'Unlimited' = planForm.messagesLimit === 'Unlimited' ? 'Unlimited' : parseInt(planForm.messagesLimit) || 0
    const aiVal: number | 'Unlimited' = planForm.aiCreditsLimit === 'Unlimited' ? 'Unlimited' : parseInt(planForm.aiCreditsLimit) || 0

    if (editingPlan) {
      const updated = plans.map((p) => {
        if (p.id === editingPlan.id) {
          return {
            ...p,
            name: planForm.name,
            code: planForm.code || planForm.name.toLowerCase().replace(/\s+/g, '_'),
            description: planForm.description,
            status: planForm.status,
            monthlyPrice: Number(planForm.monthlyPrice),
            yearlyPrice: Number(planForm.yearlyPrice),
            currency: planForm.currency,
            trialDays: Number(planForm.trialDays),
            gracePeriodDays: Number(planForm.gracePeriodDays),
            visibilityBoost: planForm.visibilityBoost,
            aiFeatures: planForm.aiFeatures,
            features: planForm.features,
            limits: {
              offers: offersVal,
              requests: requestsVal,
              properties: propertiesVal,
              messages: messagesVal,
              aiCredits: aiVal,
            },
            availability: {
              countries: planForm.countries.split(',').map((c) => c.trim()),
              userTypes: planForm.userTypes,
            },
          }
        }
        return p
      })
      setPlans(updated)
      toast({ variant: 'success', title: 'Plan updated', description: `Successfully updated ${planForm.name}.` })
    } else {
      const newPlan: SubscriptionPlan = {
        id: `PLAN-${Date.now()}`,
        name: planForm.name,
        code: planForm.code || planForm.name.toLowerCase().replace(/\s+/g, '_'),
        description: planForm.description || 'Custom plan designed for real estate professionals.',
        status: planForm.status,
        monthlyPrice: Number(planForm.monthlyPrice),
        yearlyPrice: Number(planForm.yearlyPrice),
        currency: planForm.currency,
        trialDays: Number(planForm.trialDays),
        gracePeriodDays: Number(planForm.gracePeriodDays),
        subscribersCount: 0,
        monthlyRevenue: 0,
        annualRevenue: 0,
        conversionRate: '0.0%',
        churnRate: '0.0%',
        visibilityBoost: planForm.visibilityBoost,
        aiFeatures: planForm.aiFeatures,
        features: planForm.features,
        limits: {
          offers: offersVal,
          requests: requestsVal,
          properties: propertiesVal,
          messages: messagesVal,
          aiCredits: aiVal,
        },
        availability: {
          countries: planForm.countries.split(',').map((c) => c.trim()),
          userTypes: planForm.userTypes,
        },
      }
      setPlans([...plans, newPlan])
      toast({ variant: 'success', title: 'Plan created', description: `Successfully launched new tier: ${newPlan.name}.` })
    }
    setPlanEditorOpen(false)
    setEditingPlan(null)
  }

  // Save Promo Code (Create or Edit)
  const handleSavePromo = () => {
    if (!promoForm.code.trim()) {
      toast({ variant: 'error', title: 'Promo Code Required', description: 'Please enter a valid coupon code.' })
      return
    }

    if (editingPromo) {
      const updated = promoCodes.map((c) =>
        c.id === editingPromo.id
          ? {
              ...c,
              ...promoForm,
              code: promoForm.code.toUpperCase(),
              discountValue: Number(promoForm.discountValue),
              usageLimit: Number(promoForm.usageLimit),
              minPurchase: Number(promoForm.minPurchase),
            }
          : c
      )
      setPromoCodes(updated)
      toast({ variant: 'success', title: 'Promo Code updated', description: `Saved changes to ${promoForm.code.toUpperCase()}.` })
    } else {
      const newPromo: PromoCode = {
        id: `PROMO-${Date.now()}`,
        code: promoForm.code.toUpperCase(),
        discountType: promoForm.discountType,
        discountValue: Number(promoForm.discountValue),
        assignedPlan: promoForm.assignedPlan,
        country: promoForm.country,
        usageCount: 0,
        usageLimit: Number(promoForm.usageLimit),
        expirationDate: promoForm.expirationDate,
        status: promoForm.status,
        minPurchase: Number(promoForm.minPurchase),
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      }
      setPromoCodes([newPromo, ...promoCodes])
      toast({ variant: 'success', title: 'Promo Code created', description: `Active promo coupon ${newPromo.code} created.` })
    }
    setPromoModalOpen(false)
    setEditingPromo(null)
  }

  // Generate Tax Invoice
  const handleGenerateInvoice = () => {
    const sub = subscribers.find((s) => s.id === invoiceForm.subscriberId) || subscribers[0]
    const amountNum = Number(invoiceForm.amount) || 0
    const taxNum = Number((amountNum * 0.05).toFixed(2))
    const totalNum = Number((amountNum + taxNum).toFixed(2))

    const newInv: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-2026-${1050 + invoices.length}`,
      subscriberId: sub.id,
      userName: sub.userName,
      userEmail: sub.userEmail,
      country: sub.country,
      planName: invoiceForm.planName || `${sub.planName} (${sub.billingCycle})`,
      amount: amountNum,
      tax: taxNum,
      total: totalNum,
      currency: 'AED',
      status: invoiceForm.status,
      issuedDate: invoiceForm.issuedDate,
      dueDate: invoiceForm.dueDate,
      billingPeriod: `${invoiceForm.issuedDate} - Term Cycle`,
      paymentMethod: invoiceForm.paymentMethod,
    }
    setInvoices([newInv, ...invoices])
    setGenerateInvoiceOpen(false)
    toast({
      variant: 'success',
      title: 'Invoice generated',
      description: `Tax Invoice #${newInv.invoiceNumber} created for ${sub.userName}.`,
    })
  }

  // Batch Subscriber Actions
  const handleBatchUpgrade = () => {
    if (selectedSubscriberIds.length === 0) return
    const targetPlan = plans.find((p) => p.id === selectedNewPlanId) || plans[1]
    const updated = subscribers.map((s) => {
      if (selectedSubscriberIds.includes(s.id)) {
        return {
          ...s,
          planId: targetPlan.id,
          planName: targetPlan.name,
          amount: targetPlan.monthlyPrice,
          timeline: [
            {
              id: `t_${Date.now()}_${s.id}`,
              event: `Batch Plan Upgrade to ${targetPlan.name}`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              reason: 'Bulk plan migration applied from topbar action hub.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })
    setSubscribers(updated)
    toast({
      variant: 'success',
      title: 'Batch Upgrade Successful',
      description: `Upgraded ${selectedSubscriberIds.length} subscribers to ${targetPlan.name}.`,
    })
    setSelectedSubscriberIds([])
  }

  const handleBatchExtend = () => {
    if (selectedSubscriberIds.length === 0) return
    const updated = subscribers.map((s) => {
      if (selectedSubscriberIds.includes(s.id)) {
        return {
          ...s,
          renewalDate: `Extended +14d`,
          expiryDate: `Extended +14d`,
          status: 'Active' as SubscriptionStatus,
          timeline: [
            {
              id: `t_${Date.now()}_${s.id}`,
              event: 'Batch Subscription Extension (+14 Days)',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              reason: 'Batch complimentary 14-day extension from topbar.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })
    setSubscribers(updated)
    toast({
      variant: 'success',
      title: 'Batch Extended',
      description: `Added 14 days extension to ${selectedSubscriberIds.length} subscribers.`,
    })
    setSelectedSubscriberIds([])
  }

  const handleBatchCancel = () => {
    if (selectedSubscriberIds.length === 0) return
    const updated = subscribers.map((s) => {
      if (selectedSubscriberIds.includes(s.id)) {
        return {
          ...s,
          autoRenewal: false,
          timeline: [
            {
              id: `t_${Date.now()}_${s.id}`,
              event: 'Auto-Renewal Disabled (Batch Action)',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              actor: 'Super Admin',
              reason: 'Batch cancellation from topbar action hub.',
            },
            ...s.timeline,
          ],
        }
      }
      return s
    })
    setSubscribers(updated)
    toast({
      variant: 'error',
      title: 'Batch Auto-Renewal Disabled',
      description: `Disabled renewal for ${selectedSubscriberIds.length} subscribers.`,
    })
    setSelectedSubscriberIds([])
  }

  const handleExportSelectedSubscribers = () => {
    const selected = subscribers.filter((s) => selectedSubscriberIds.includes(s.id))
    const headers = ['Subscription ID', 'User Name', 'Email', 'Plan', 'Status', 'Cycle', 'Amount (AED)', 'Purchase Date', 'Renewal Date']
    const rows = selected.map((s) => [s.id, s.userName, s.userEmail, s.planName, s.status, s.billingCycle, s.amount, s.purchaseDate, s.renewalDate])
    exportToCsv('selected_subscribers.csv', headers, rows)
    toast({
      variant: 'success',
      title: 'Export generated',
      description: `Downloaded ${selected.length} selected subscriber records.`,
    })
  }

  const handleExportPayments = () => {
    const headers = ['Payment ID', 'Subscriber ID', 'User Name', 'Email', 'Plan', 'Amount (AED)', 'Tax', 'Method', 'Status', 'Date', 'Transaction ID', 'Gateway']
    const rows = payments.map((p) => [p.id, p.subscriberId, p.userName, p.userEmail, p.planName, p.amount, p.tax, p.paymentMethod, p.status, p.date, p.transactionId, p.gateway])
    exportToCsv('payments_log.csv', headers, rows)
    toast({ variant: 'success', title: 'Export generated', description: `Downloaded ${payments.length} payment records.` })
  }

  const handleExportInvoices = () => {
    const headers = ['Invoice Number', 'User Name', 'Email', 'Plan', 'Amount (AED)', 'Tax', 'Total', 'Status', 'Issued Date', 'Due Date']
    const rows = invoices.map((i) => [i.invoiceNumber, i.userName, i.userEmail, i.planName, i.amount, i.tax, i.total, i.status, i.issuedDate, i.dueDate])
    exportToCsv('invoices_record.csv', headers, rows)
    toast({ variant: 'success', title: 'Export generated', description: `Downloaded ${invoices.length} invoices.` })
  }

  const handleExportPromoCodes = () => {
    const headers = ['Code', 'Discount Type', 'Value', 'Assigned Plan', 'Country', 'Usage', 'Limit', 'Expiration Date', 'Status']
    const rows = promoCodes.map((c) => [c.code, c.discountType, c.discountValue, c.assignedPlan, c.country, c.usageCount, c.usageLimit, c.expirationDate, c.status])
    exportToCsv('promo_coupons.csv', headers, rows)
    toast({ variant: 'success', title: 'Export generated', description: `Downloaded ${promoCodes.length} promo codes.` })
  }

  return (
    <PlatformShell
      title="Subscriptions & Billing"
      eyebrow="Monetization"
      selectedCount={selectedSubscriberIds.length}
      selectedLabel="subscribers"
      onClearSelection={() => setSelectedSubscriberIds([])}
      selectedActions={
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleBatchUpgrade}
            className="flex h-[32px] items-center gap-1.5 rounded-[6px] bg-[#00c2cb] px-3 text-[12px] font-bold text-white shadow-2xs hover:bg-[#00838f] cursor-pointer"
          >
            <TrendingUp className="size-3.5" />
            <span>Upgrade Tier</span>
          </button>
          <button
            type="button"
            onClick={handleBatchExtend}
            className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
          >
            <Clock className="size-3.5 text-[#00838f]" />
            <span>Extend +14d</span>
          </button>
          <button
            type="button"
            onClick={handleBatchCancel}
            className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#fda29b] bg-white px-3 text-[12px] font-semibold text-[#d92d20] hover:bg-[#fef3f2] cursor-pointer"
          >
            <Ban className="size-3.5" />
            <span>Cancel Auto-Renew</span>
          </button>
          <button
            type="button"
            onClick={handleExportSelectedSubscribers}
            className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
          >
            <Download className="size-3.5 text-[#6f777f]" />
            <span>Export CSV</span>
          </button>
        </div>
      }
      quickActions={[
        {
          label: '+ Create New Plan',
          icon: <Plus className="size-4 text-[#00838f]" />,
          onClick: () => {
            setEditingPlan(null)
            setPlanEditorOpen(true)
          },
        },
        {
          label: '+ Add Promo Code',
          icon: <Tag className="size-4 text-[#00838f]" />,
          onClick: () => {
            setEditingPromo(null)
            setPromoModalOpen(true)
          },
        },
        {
          label: '+ Generate Tax Invoice',
          icon: <FileText className="size-4 text-[#00838f]" />,
          onClick: () => {
            setGenerateInvoiceOpen(true)
          },
        },
        {
          label: 'Export Subscriptions CSV',
          icon: <Download className="size-4 text-[#6f777f]" />,
          onClick: handleExportSubscribers,
        },
      ]}
      actions={
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingPlan(null)
              setPlanEditorOpen(true)
            }}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[13px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
          >
            <Plus className="size-3.5" />
            <span>Create Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setGenerateInvoiceOpen(true)}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
          >
            <Receipt className="size-3.5 text-[#6f777f]" />
            <span>New Invoice</span>
          </button>
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

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Active Subscribers"
              value={activeSubscribers.toLocaleString()}
              trend={{ value: '+12.4%', isPositive: true }}
              icon={Users}
              tone="neutral"
              subtitle="Total paid accounts active"
            />
            <MetricCard
              label="Monthly Recurring (MRR)"
              value={`AED ${(totalMRR / 1000).toFixed(1)}k`}
              trend={{ value: '+18.2%', isPositive: true }}
              icon={CreditCard}
              tone="info"
              subtitle="Normalized MRR volume"
            />
            <MetricCard
              label="Annual Run Rate (ARR)"
              value={`AED ${(totalARR / 1000000).toFixed(2)}M`}
              trend={{ value: '+24.8%', isPositive: true }}
              icon={TrendingUp}
              tone="success"
              subtitle="Run-rate based on active terms"
            />
            <MetricCard
              label="Monthly Churn Rate"
              value="1.8%"
              trend={{ value: '-0.4%', isPositive: true }}
              icon={TrendingDown}
              tone="warning"
              subtitle="Industry benchmark: 3.5%"
            />
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                label="Active Subscribers"
                value={activeSubscribers.toLocaleString()}
                trend={{ value: '+12.4%', isPositive: true }}
                icon={Users}
                tone="neutral"
                subtitle="Total paid accounts active"
              />
              <MetricCard
                label="Monthly Recurring (MRR)"
                value={`AED ${(totalMRR / 1000).toFixed(1)}k`}
                trend={{ value: '+18.2%', isPositive: true }}
                icon={CreditCard}
                tone="brand"
                subtitle="Normalized MRR volume"
              />
              <MetricCard
                label="Annual Run Rate (ARR)"
                value={`AED ${(totalARR / 1000000).toFixed(2)}M`}
                trend={{ value: '+24.8%', isPositive: true }}
                icon={TrendingUp}
                tone="success"
                subtitle="Annual forward projection"
              />
              <MetricCard
                label="Active Trial Users"
                value={trialUsers}
                trend={{ value: '+8.1%', isPositive: true }}
                icon={Zap}
                tone="warning"
                subtitle="In 14-day evaluation"
              />
              <MetricCard
                label="Expiring in 7 Days"
                value={18}
                trend={{ value: 'Action req', isPositive: false }}
                icon={Clock}
                tone="warning"
                subtitle="Upcoming auto-renewals"
              />
              <MetricCard
                label="Failed Payments"
                value={failedPaymentsCount}
                trend={{ value: 'Needs attention', isPositive: false }}
                icon={AlertTriangle}
                tone="destructive"
                subtitle="AED 3,196 in dunning"
              />
              <MetricCard
                label="Refunds This Month"
                value={refundedCount}
                trend={{ value: '0.4% rate', isPositive: true }}
                icon={RotateCcw}
                tone="neutral"
                subtitle="AED 799 refunded"
              />
              <MetricCard
                label="Active Chargebacks"
                value={chargebackCount}
                trend={{ value: '0.0% Risk', isPositive: true }}
                icon={ShieldCheck}
                tone="success"
                subtitle="Zero cardholder disputes"
              />
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

              {/* Responsive Recharts Multi-Metric Visualization */}
              <div className="h-[250px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
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
                    ]}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="subMrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00c2cb" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#00c2cb" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="subNewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#12b76a" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#12b76a" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#eff1f3" strokeDasharray="3 3" />
                    <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#6f777f', fontSize: 11 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6f777f', fontSize: 11 }}
                      tickFormatter={(v) => `AED ${v}k`}
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
                                <span>MRR Base:</span>
                                <strong className="text-[#00a4ac]">AED {item.mrr}k</strong>
                              </p>
                              <p className="text-[#6f777f] flex justify-between gap-3">
                                <span>New Signups:</span>
                                <strong className="text-[#12b76a]">+{item.neu}</strong>
                              </p>
                              <p className="text-[#6f777f] flex justify-between gap-3">
                                <span>Upgrades:</span>
                                <strong className="text-[#7a5af8]">+{item.up}</strong>
                              </p>
                              <p className="text-[#6f777f] flex justify-between gap-3">
                                <span>Cancellations:</span>
                                <span className="text-[#d92d20]">-{item.ch}</span>
                              </p>
                            </div>
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mrr"
                      name="MRR Base"
                      stroke="#00c2cb"
                      strokeWidth={2.5}
                      fill="url(#subMrrGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="neu"
                      name="New Signups"
                      stroke="#12b76a"
                      strokeWidth={2}
                      fill="url(#subNewGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="px-4">Plan Name</th>
                      <th className="px-3">Status</th>
                      <th className="px-3">Monthly Price</th>
                      <th className="px-3">Yearly Price</th>
                      <th className="px-3">Subscribers</th>
                      <th className="px-3">Offers Limit</th>
                      <th className="px-3">Requests Limit</th>
                      <th className="px-3">Visibility</th>
                      <th className="px-3">AI Suite</th>
                      <th className="px-3">Est. Monthly Rev</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {plans.map((plan) => (
                      <tr key={plan.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
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
                            ? item.id === 'Active'
                              ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                              : item.id === 'Trial' || item.id === 'Grace Period'
                              ? 'bg-[#f79009] text-white shadow-2xs font-semibold'
                              : item.id === 'Cancelled' || item.id === 'Expired'
                              ? 'bg-[#6f777f] text-white shadow-2xs font-semibold'
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
                <Dropdown
                  align="start"
                  value={planFilter}
                  onSelect={setPlanFilter}
                  ariaLabel="Filter by Plan"
                  options={[{ label: 'All Plans', value: 'All' }, ...plans.map((p) => ({ label: p.name, value: p.name }))]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Layers className="size-4 text-[#6f777f]" />
                      <span>{planFilter === 'All' ? 'All Plans' : planFilter}</span>
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

                {/* User Type */}
                <Dropdown
                  align="start"
                  value={userTypeFilter}
                  onSelect={setUserTypeFilter}
                  ariaLabel="Filter by User Type"
                  options={[
                    { label: 'All Types', value: 'All' },
                    { label: 'Agent', value: 'Agent' },
                    { label: 'Investor', value: 'Investor' },
                    { label: 'Brokerage', value: 'Brokerage' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Users className="size-4 text-[#6f777f]" />
                      <span>{userTypeFilter === 'All' ? 'All Types' : userTypeFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Auto-Renewal */}
                <Dropdown
                  align="start"
                  value={autoRenewalFilter}
                  onSelect={setAutoRenewalFilter}
                  ariaLabel="Filter by Auto-Renewal"
                  options={[
                    { label: 'All Auto-Renewal', value: 'All' },
                    { label: 'Auto-Renewal ON', value: 'Enabled' },
                    { label: 'Auto-Renewal OFF', value: 'Disabled' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <RefreshCw className="size-4 text-[#6f777f]" />
                      <span>
                        {autoRenewalFilter === 'Enabled'
                          ? 'Auto-Renewal ON'
                          : autoRenewalFilter === 'Disabled'
                          ? 'Auto-Renewal OFF'
                          : 'All Auto-Renewal'}
                      </span>
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

              {/* Subscribers Table */}
              <div className="overflow-x-auto table-scrollbar">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="w-10 px-4">
                        <input
                          type="checkbox"
                          aria-label="Select all subscribers"
                          checked={
                            filteredSubscribers.length > 0 &&
                            selectedSubscriberIds.length === filteredSubscribers.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubscriberIds(filteredSubscribers.map((s) => s.id))
                            } else {
                              setSelectedSubscriberIds([])
                            }
                          }}
                          className="size-4 rounded border-[#d3d5d7] text-[#00c2cb] focus:ring-[#00c2cb] cursor-pointer"
                        />
                      </th>
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
                        className={cn(
                          "h-[64px] whitespace-nowrap font-sans transition-colors cursor-pointer",
                          selectedSubscriberIds.includes(sub.id) ? "bg-[#f0fafb]" : "hover:bg-[#f8f9fa]"
                        )}
                      >
                        <td className="w-10 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            aria-label={`Select ${sub.userName}`}
                            checked={selectedSubscriberIds.includes(sub.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubscriberIds([...selectedSubscriberIds, sub.id])
                              } else {
                                setSelectedSubscriberIds(selectedSubscriberIds.filter((id) => id !== sub.id))
                              }
                            }}
                            className="size-4 rounded border-[#d3d5d7] text-[#00c2cb] focus:ring-[#00c2cb] cursor-pointer"
                          />
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-3">
                            <TableAvatar
                              src={sub.userAvatar}
                              name={sub.userName}
                              size="md"
                              variant="brand"
                            />
                            <div>
                              <div className="font-semibold text-[14px] text-[#1f2327] hover:text-[#00838f]">
                                {sub.userName}
                              </div>
                              <div className="text-[12px] text-[#6f777f]">{sub.userEmail}</div>
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
            {/* Payments Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Billing Transactions & Payments Log</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Audit verified card transactions, handle instant refunds, and review payment gateway settlements.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPayments}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  <Download className="size-3.5 text-[#6f777f]" />
                  <span>Export Payments</span>
                </button>
              </div>
            </div>

            {/* Payments KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Successful</span>
                <div className="mt-1 text-[20px] font-bold text-[#027a48]">
                  {payments.filter((p) => p.status === 'Successful').length}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Pending</span>
                <div className="mt-1 text-[20px] font-bold text-[#b54708]">
                  {payments.filter((p) => p.status === 'Pending').length}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Failed</span>
                <div className="mt-1 text-[20px] font-bold text-[#d92d20]">
                  {payments.filter((p) => p.status === 'Failed').length}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Refunded</span>
                <div className="mt-1 text-[20px] font-bold text-[#6f777f]">
                  {payments.filter((p) => p.status === 'Refunded').length}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#6f777f]">Chargebacks</span>
                <div className="mt-1 text-[20px] font-bold text-[#1f2327]">
                  {payments.filter((p) => p.status === 'Chargeback').length}
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="px-4">Payment ID</th>
                      <th className="px-3">Subscriber</th>
                      <th className="px-3">Plan</th>
                      <th className="px-3">Amount</th>
                      <th className="px-3">Tax (5%)</th>
                      <th className="px-3">Method</th>
                      <th className="px-3">Status</th>
                      <th className="px-3">Date</th>
                      <th className="px-3">Invoice</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {payments.map((p) => (
                      <tr key={p.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Promotional Coupons & Codes</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Generate percentage or fixed AED discount codes with usage limits, plan targets, and expiry dates.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPromoCodes}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  <Download className="size-3.5 text-[#6f777f]" />
                  <span>Export Codes</span>
                </button>
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
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">Promo Code</th>
                    <th className="px-3">Discount</th>
                    <th className="px-3">Discount Type</th>
                    <th className="px-3">Target Plan</th>
                    <th className="px-3">Country</th>
                    <th className="px-3">Usage vs Limit</th>
                    <th className="px-3">Expiration Date</th>
                    <th className="px-3">Status</th>
                    <th className="px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {promoCodes.map((c) => (
                    <tr key={c.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(c.code)
                              toast({
                                variant: 'success',
                                title: 'Code Copied',
                                description: `Copied ${c.code} to clipboard.`,
                              })
                            }}
                            className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors cursor-pointer"
                            title="Copy Promo Code"
                          >
                            <Copy className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromo(c)
                              setPromoModalOpen(true)
                            }}
                            className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327] transition-colors cursor-pointer"
                            title="Edit Promo Code"
                          >
                            <Edit className="size-3.5" />
                          </button>
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
                            className="rounded-[6px] border border-[#d3d5d7] p-1.5 text-[#565e67] hover:bg-[#fef3f2] hover:text-[#d92d20] transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Archive className="size-3.5" />
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

        {/* =========================================================================
            7. TAB CONTENT: INVOICES
           ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-4 ant-fade-in">
            {/* Invoices Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Commercial Tax Invoices</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Generate compliant UAE VAT invoices, issue custom billings, and download printable PDFs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportInvoices}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  <Download className="size-3.5 text-[#6f777f]" />
                  <span>Export Invoices</span>
                </button>
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={<Plus className="size-3.5" />}
                  label="+ Generate Invoice"
                  onClick={() => setGenerateInvoiceOpen(true)}
                />
              </div>
            </div>

            <div className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="px-4">Invoice #</th>
                    <th className="px-3">Subscriber</th>
                    <th className="px-3">Plan / Description</th>
                    <th className="px-3">Amount</th>
                    <th className="px-3">Tax</th>
                    <th className="px-3">Total</th>
                    <th className="px-3">Status</th>
                    <th className="px-3">Issued Date</th>
                    <th className="px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
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

            {/* Sub-Tabs Navigation in Drawer */}
            <div className="flex border-b border-[#e5e7eb] px-6 bg-[#fcfcfc] gap-6">
              {[
                { id: 'overview', label: 'Overview & Quotas' },
                {
                  id: 'payments',
                  label: `Payment History (${
                    payments.filter(
                      (p) => p.subscriberId === selectedSubscriber.id || p.userName === selectedSubscriber.userName
                    ).length
                  })`,
                },
                {
                  id: 'invoices',
                  label: `Invoice History (${
                    invoices.filter(
                      (i) => i.subscriberId === selectedSubscriber.id || i.userName === selectedSubscriber.userName
                    ).length
                  })`,
                },
                { id: 'timeline', label: `Timeline (${selectedSubscriber.timeline.length})` },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDrawerActiveTab(t.id as any)}
                  className={cn(
                    'py-3 text-[13px] font-semibold border-b-2 transition-colors cursor-pointer',
                    drawerActiveTab === t.id
                      ? 'border-[#00c2cb] text-[#00838f]'
                      : 'border-transparent text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6">
              {/* TAB 1: OVERVIEW & QUOTAS */}
              {drawerActiveTab === 'overview' && (
                <div className="space-y-6">
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
                        <span className="text-[#8f969e] block">Purchase Date</span>
                        <span className="font-bold text-[#1f2327]">{selectedSubscriber.purchaseDate}</span>
                      </div>
                      <div>
                        <span className="text-[#8f969e] block">Next Renewal</span>
                        <span className="font-bold text-[#1f2327]">{selectedSubscriber.renewalDate}</span>
                      </div>
                      <div>
                        <span className="text-[#8f969e] block">Auto Renewal</span>
                        <span className="font-bold text-[#027a48]">
                          {selectedSubscriber.autoRenewal ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Codes Used Card */}
                  {selectedSubscriber.appliedPromo ? (
                    <div className="rounded-[10px] border border-[#00c2cb]/30 bg-[#e5f6f7]/50 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-[#00838f] flex items-center gap-1.5">
                          <Tag className="size-3.5" /> Promo Coupon Applied
                        </span>
                        <span className="rounded-[4px] bg-[#00c2cb] px-2 py-0.5 text-[11px] font-bold text-white font-mono">
                          {selectedSubscriber.appliedPromo.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] pt-1">
                        <span className="text-[#6f777f]">Discount Granted:</span>
                        <span className="font-bold text-[#1f2327]">{selectedSubscriber.appliedPromo.discount}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#6f777f]">Total Customer Savings:</span>
                        <span className="font-bold text-[#027a48]">AED {selectedSubscriber.appliedPromo.savings.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[10px] border border-dashed border-[#d3d5d7] bg-[#fafbfc] p-3 text-center text-[12px] text-[#6f777f]">
                      No promo code applied to this subscription.
                    </div>
                  )}

                  {/* Usage Progress Gauges */}
                  <div className="space-y-3">
                    <h4 className="text-[13px] font-bold text-[#1f2327]">Current Month Quotas & Consumption</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11.5px] font-bold text-[#1f2327] mb-1">
                          <span>Offers Submitted</span>
                          <span>
                            {selectedSubscriber.usage.offersUsed} / {selectedSubscriber.usage.offersLimit}
                          </span>
                        </div>
                        <div className="w-full bg-[#e5e7eb] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#00c2cb] h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (selectedSubscriber.usage.offersUsed / (selectedSubscriber.usage.offersLimit || 1)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11.5px] font-bold text-[#1f2327] mb-1">
                          <span>Requests Received</span>
                          <span>
                            {selectedSubscriber.usage.requestsUsed} / {selectedSubscriber.usage.requestsLimit}
                          </span>
                        </div>
                        <div className="w-full bg-[#e5e7eb] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#12b76a] h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (selectedSubscriber.usage.requestsUsed / (selectedSubscriber.usage.requestsLimit || 1)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11.5px] font-bold text-[#1f2327] mb-1">
                          <span>AI Valuation & Pitch Credits</span>
                          <span>
                            {selectedSubscriber.usage.aiCreditsUsed} / {selectedSubscriber.usage.aiCreditsLimit}
                          </span>
                        </div>
                        <div className="w-full bg-[#e5e7eb] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#7a5af8] h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (selectedSubscriber.usage.aiCreditsUsed / (selectedSubscriber.usage.aiCreditsLimit || 1)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAYMENT HISTORY */}
              {drawerActiveTab === 'payments' && (
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-[#1f2327]">Transactions for {selectedSubscriber.userName}</h4>
                  {payments.filter(
                    (p) => p.subscriberId === selectedSubscriber.id || p.userName === selectedSubscriber.userName
                  ).length > 0 ? (
                    <div className="rounded-[10px] border border-[#d3d5d7] overflow-hidden">
                      <table className="w-full text-left text-[12px]">
                        <thead className="bg-[#f8f9fa] border-b border-[#e5e7eb] text-[11px] font-bold text-[#6f777f]">
                          <tr>
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Method</th>
                            <th className="p-2.5">Amount</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f2f5]">
                          {payments
                            .filter(
                              (p) =>
                                p.subscriberId === selectedSubscriber.id || p.userName === selectedSubscriber.userName
                            )
                            .map((p) => (
                              <tr key={p.id} className="hover:bg-[#fafbfc]">
                                <td className="p-2.5 text-[#6f777f]">{p.date}</td>
                                <td className="p-2.5 text-[#1f2327]">
                                  {p.paymentMethod} {p.cardLast4 ? `•••• ${p.cardLast4}` : ''}
                                </td>
                                <td className="p-2.5 font-bold text-[#1f2327]">AED {p.amount.toLocaleString()}</td>
                                <td className="p-2.5">
                                  <span
                                    className={cn(
                                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold',
                                      p.status === 'Successful' && 'bg-[#ecfdf3] text-[#027a48]',
                                      p.status === 'Failed' && 'bg-[#fef3f2] text-[#d92d20]',
                                      p.status === 'Refunded' && 'bg-[#f4f5f6] text-[#475467]',
                                      p.status === 'Pending' && 'bg-[#fffaeb] text-[#b54708]'
                                    )}
                                  >
                                    {p.status}
                                  </span>
                                </td>
                                <td className="p-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedPayment(p)
                                      setPaymentModalOpen(true)
                                    }}
                                    className="rounded border border-[#d3d5d7] px-2 py-1 text-[11px] font-semibold text-[#1f2327] hover:bg-[#eff1f3]"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-[10px] border border-dashed border-[#d3d5d7] p-6 text-center text-[12px] text-[#6f777f]">
                      No payment records found for this subscriber.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INVOICE HISTORY */}
              {drawerActiveTab === 'invoices' && (
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-[#1f2327]">Invoices for {selectedSubscriber.userName}</h4>
                  {invoices.filter(
                    (i) => i.subscriberId === selectedSubscriber.id || i.userName === selectedSubscriber.userName
                  ).length > 0 ? (
                    <div className="rounded-[10px] border border-[#d3d5d7] overflow-hidden">
                      <table className="w-full text-left text-[12px]">
                        <thead className="bg-[#f8f9fa] border-b border-[#e5e7eb] text-[11px] font-bold text-[#6f777f]">
                          <tr>
                            <th className="p-2.5">Invoice #</th>
                            <th className="p-2.5">Issued Date</th>
                            <th className="p-2.5">Total (AED)</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f2f5]">
                          {invoices
                            .filter(
                              (i) =>
                                i.subscriberId === selectedSubscriber.id || i.userName === selectedSubscriber.userName
                            )
                            .map((inv) => (
                              <tr key={inv.id} className="hover:bg-[#fafbfc]">
                                <td className="p-2.5 font-bold font-mono text-[#00838f]">{inv.invoiceNumber}</td>
                                <td className="p-2.5 text-[#6f777f]">{inv.issuedDate}</td>
                                <td className="p-2.5 font-bold text-[#1f2327]">AED {inv.total.toLocaleString()}</td>
                                <td className="p-2.5">
                                  <span
                                    className={cn(
                                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold',
                                      inv.status === 'Paid' && 'bg-[#ecfdf3] text-[#027a48]',
                                      inv.status === 'Pending' && 'bg-[#fffaeb] text-[#b54708]',
                                      inv.status === 'Failed' && 'bg-[#fef3f2] text-[#d92d20]'
                                    )}
                                  >
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="p-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedInvoice(inv)
                                      setInvoiceModalOpen(true)
                                    }}
                                    className="rounded border border-[#d3d5d7] px-2 py-1 text-[11px] font-semibold text-[#00838f] hover:bg-[#e5f6f7]"
                                  >
                                    View Tax PDF
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-[10px] border border-dashed border-[#d3d5d7] p-6 text-center text-[12px] text-[#6f777f]">
                      No invoice records generated for this subscriber.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: IMMUTABLE TIMELINE */}
              {drawerActiveTab === 'timeline' && (
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
              )}
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
                  className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
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
                  className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
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

      {/* =========================================================================
          PLAN EDITOR MODAL (Create New Plan & Edit Plan)
         ========================================================================= */}
      {planEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto ant-fade-in">
          <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[12px] bg-white shadow-2xl border border-[#d3d5d7] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 bg-[#fafbfc]">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f2327]">
                  {editingPlan ? `Edit Tier: ${editingPlan.name}` : 'Create Commercial Subscription Tier'}
                </h3>
                <p className="text-[12px] text-[#6f777f]">
                  Configure commercial pricing, quotas, feature flags, priority tiers, and subscriber limits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPlanEditorOpen(false)
                  setEditingPlan(null)
                }}
                className="rounded-full p-1.5 text-[#8f969e] hover:bg-[#f4f5f6] hover:text-[#1f2327] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-130px)]">
              {/* Section 1: Basic Plan Information */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#00838f]">
                  1. Plan Identity & Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Plan Name *</label>
                    <input
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      placeholder="e.g. Platinum Partner"
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Plan Code (Slug)</label>
                    <input
                      value={planForm.code}
                      onChange={(e) => setPlanForm({ ...planForm, code: e.target.value })}
                      placeholder="e.g. platinum"
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] font-mono text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Status</label>
                    <select
                      value={planForm.status}
                      onChange={(e) => setPlanForm({ ...planForm, status: e.target.value as any })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    >
                      <option value="Active">Active (Publicly Purchasable)</option>
                      <option value="Draft">Draft (Hidden)</option>
                      <option value="Archived">Archived (Grandfathered)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Description</label>
                  <textarea
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    rows={2}
                    placeholder="Brief description of the audience and core value proposition..."
                    className="mt-1 w-full rounded-[8px] border border-[#d3d5d7] p-2.5 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  />
                </div>
              </div>

              {/* Section 2: Pricing & Billing */}
              <div className="space-y-3 pt-2 border-t border-[#f0f2f5]">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#00838f]">
                  2. Pricing & Evaluation Terms
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Monthly Price (AED)</label>
                    <input
                      type="number"
                      value={planForm.monthlyPrice}
                      onChange={(e) => setPlanForm({ ...planForm, monthlyPrice: Number(e.target.value) })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] font-bold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Annual Price (AED)</label>
                    <input
                      type="number"
                      value={planForm.yearlyPrice}
                      onChange={(e) => setPlanForm({ ...planForm, yearlyPrice: Number(e.target.value) })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] font-bold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Trial Period (Days)</label>
                    <input
                      type="number"
                      value={planForm.trialDays}
                      onChange={(e) => setPlanForm({ ...planForm, trialDays: Number(e.target.value) })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Grace Period (Days)</label>
                    <input
                      type="number"
                      value={planForm.gracePeriodDays}
                      onChange={(e) => setPlanForm({ ...planForm, gracePeriodDays: Number(e.target.value) })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Commercial Quotas & Limits */}
              <div className="space-y-3 pt-2 border-t border-[#f0f2f5]">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#00838f]">
                  3. Quota Limits (Number or 'Unlimited')
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Offers Limit</label>
                    <input
                      value={planForm.offersLimit}
                      onChange={(e) => setPlanForm({ ...planForm, offersLimit: e.target.value })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] font-semibold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Requests Limit</label>
                    <input
                      value={planForm.requestsLimit}
                      onChange={(e) => setPlanForm({ ...planForm, requestsLimit: e.target.value })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] font-semibold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Properties</label>
                    <input
                      value={planForm.propertiesLimit}
                      onChange={(e) => setPlanForm({ ...planForm, propertiesLimit: e.target.value })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] font-semibold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Direct Messages</label>
                    <input
                      value={planForm.messagesLimit}
                      onChange={(e) => setPlanForm({ ...planForm, messagesLimit: e.target.value })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] font-semibold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">AI Credits</label>
                    <input
                      value={planForm.aiCreditsLimit}
                      onChange={(e) => setPlanForm({ ...planForm, aiCreditsLimit: e.target.value })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] font-semibold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Visibility & AI Capabilities */}
              <div className="space-y-3 pt-2 border-t border-[#f0f2f5]">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#00838f]">
                  4. Visibility Boost, Support & AI Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">Visibility Boost</label>
                    <select
                      value={planForm.visibilityBoost}
                      onChange={(e) => setPlanForm({ ...planForm, visibilityBoost: e.target.value as any })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    >
                      <option value="Standard">Standard (Organic)</option>
                      <option value="2x Boost">2x Boost (Enhanced Directory)</option>
                      <option value="5x Priority">5x Priority (Top Deal Matching)</option>
                      <option value="10x Maximum">10x Maximum (VIP Homepage Placement)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#6f777f]">AI Features Suite</label>
                    <select
                      value={planForm.aiFeatures}
                      onChange={(e) => setPlanForm({ ...planForm, aiFeatures: e.target.value as any })}
                      className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    >
                      <option value="Basic">Basic (Smart Search & Summaries)</option>
                      <option value="Advanced">Advanced (Valuation & ROI Predictor)</option>
                      <option value="Full Suite">Full Suite (Auto Deal Matching & WhatsApp CRM)</option>
                      <option value="Custom Enterprise">Custom Enterprise (Bespoke LLM Models)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Feature Checklist */}
              <div className="space-y-3 pt-2 border-t border-[#f0f2f5]">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#00838f]">
                  5. Feature Flags Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planForm.features.map((feat, idx) => (
                    <label
                      key={feat.id}
                      className="flex items-center gap-2.5 rounded-[8px] border border-[#e5e7eb] p-2.5 hover:bg-[#fafbfc] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={feat.included}
                        onChange={(e) => {
                          const updated = [...planForm.features]
                          updated[idx] = { ...feat, included: e.target.checked }
                          setPlanForm({ ...planForm, features: updated })
                        }}
                        className="size-4 rounded text-[#00c2cb] focus:ring-[#00c2cb]"
                      />
                      <span className="text-[12.5px] font-medium text-[#1f2327]">{feat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] px-6 py-3.5 bg-[#fafbfc]">
              <button
                type="button"
                onClick={() => {
                  setPlanEditorOpen(false)
                  setEditingPlan(null)
                }}
                className="rounded-[6px] border border-[#d3d5d7] px-4 py-2 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                className="rounded-[6px] bg-[#1f2327] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#2e3338] shadow-2xs transition-colors cursor-pointer"
              >
                {editingPlan ? 'Save Plan Changes' : 'Create & Publish Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PLAN DETAILS VIEW MODAL (When clicking Eye on a plan row)
         ========================================================================= */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto ant-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[12px] bg-white shadow-2xl border border-[#d3d5d7] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 bg-[#fafbfc]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00838f]">
                  <Layers className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[17px] font-bold text-[#1f2327]">{selectedPlan.name}</h3>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
                        selectedPlan.status === 'Active'
                          ? 'bg-[#ecfdf3] text-[#027a48]'
                          : selectedPlan.status === 'Draft'
                          ? 'bg-[#fffaeb] text-[#b54708]'
                          : 'bg-[#f2f4f7] text-[#475467]'
                      )}
                    >
                      {selectedPlan.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6f777f]">
                    Code: <span className="font-mono font-semibold">{selectedPlan.code}</span> • {selectedPlan.trialDays}d trial • {selectedPlan.gracePeriodDays}d grace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="rounded-full p-1.5 text-[#8f969e] hover:bg-[#f4f5f6] hover:text-[#1f2327] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-130px)]">
              {/* Financial & Subscriber Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-[8px] border border-[#d3d5d7] p-3 bg-white">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Monthly Price</span>
                  <div className="mt-1 text-[16px] font-bold text-[#1f2327]">
                    {selectedPlan.monthlyPrice === 0 ? 'Free' : `AED ${selectedPlan.monthlyPrice.toLocaleString()}`}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-3 bg-white">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Yearly Price</span>
                  <div className="mt-1 text-[16px] font-bold text-[#1f2327]">
                    {selectedPlan.yearlyPrice === 0 ? 'Free' : `AED ${selectedPlan.yearlyPrice.toLocaleString()}`}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-3 bg-white">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Active Subscribers</span>
                  <div className="mt-1 text-[16px] font-bold text-[#00838f]">
                    {selectedPlan.subscribersCount.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-[8px] border border-[#d3d5d7] p-3 bg-white">
                  <span className="text-[11px] font-semibold text-[#6f777f]">Monthly Revenue</span>
                  <div className="mt-1 text-[16px] font-bold text-[#027a48]">
                    AED {selectedPlan.monthlyRevenue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#565e67] leading-relaxed bg-[#fafbfc] p-3 rounded-[8px] border border-[#e5e7eb]">
                {selectedPlan.description}
              </p>

              {/* Commercial Quotas Grid */}
              <div className="space-y-2">
                <h4 className="text-[13px] font-bold text-[#1f2327]">Commercial Limits & Allowances</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[12px]">
                  <div className="rounded-[6px] border border-[#e5e7eb] p-2 bg-white">
                    <span className="text-[#8f969e] block text-[11px]">Offers Limit</span>
                    <span className="font-bold text-[#1f2327]">{selectedPlan.limits.offers}</span>
                  </div>
                  <div className="rounded-[6px] border border-[#e5e7eb] p-2 bg-white">
                    <span className="text-[#8f969e] block text-[11px]">Requests Limit</span>
                    <span className="font-bold text-[#1f2327]">{selectedPlan.limits.requests}</span>
                  </div>
                  <div className="rounded-[6px] border border-[#e5e7eb] p-2 bg-white">
                    <span className="text-[#8f969e] block text-[11px]">Properties</span>
                    <span className="font-bold text-[#1f2327]">{selectedPlan.limits.properties}</span>
                  </div>
                  <div className="rounded-[6px] border border-[#e5e7eb] p-2 bg-white">
                    <span className="text-[#8f969e] block text-[11px]">Messages</span>
                    <span className="font-bold text-[#1f2327]">{selectedPlan.limits.messages}</span>
                  </div>
                  <div className="rounded-[6px] border border-[#e5e7eb] p-2 bg-white">
                    <span className="text-[#8f969e] block text-[11px]">AI Credits</span>
                    <span className="font-bold text-[#7a5af8]">{selectedPlan.limits.aiCredits}</span>
                  </div>
                </div>
              </div>

              {/* Tiers & Boost */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-[6px] bg-[#f4f5f6] px-3 py-1.5 text-[12px]">
                  <span className="text-[#6f777f]">Visibility:</span>
                  <strong className="text-[#1f2327]">{selectedPlan.visibilityBoost}</strong>
                </div>
                <div className="flex items-center gap-2 rounded-[6px] bg-[#e5f6f7] px-3 py-1.5 text-[12px]">
                  <span className="text-[#00838f]">AI Features:</span>
                  <strong className="text-[#00838f]">{selectedPlan.aiFeatures}</strong>
                </div>
                <div className="flex items-center gap-2 rounded-[6px] bg-[#f4f5f6] px-3 py-1.5 text-[12px]">
                  <span className="text-[#6f777f]">Conversion:</span>
                  <strong className="text-[#027a48]">{selectedPlan.conversionRate}</strong>
                </div>
                <div className="flex items-center gap-2 rounded-[6px] bg-[#f4f5f6] px-3 py-1.5 text-[12px]">
                  <span className="text-[#6f777f]">Churn Rate:</span>
                  <strong className="text-[#b54708]">{selectedPlan.churnRate}</strong>
                </div>
              </div>

              {/* Feature Matrix */}
              <div className="space-y-2">
                <h4 className="text-[13px] font-bold text-[#1f2327]">Plan Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px]">
                  {selectedPlan.features.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 text-[#1f2327]">
                      {f.included ? (
                        <CheckCircle2 className="size-4 text-[#12b76a] shrink-0" />
                      ) : (
                        <X className="size-4 text-[#9da4ae] shrink-0" />
                      )}
                      <span className={cn(!f.included && 'line-through text-[#9da4ae]')}>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-3.5 bg-[#fafbfc]">
              <button
                type="button"
                onClick={() => {
                  const dup: SubscriptionPlan = {
                    ...selectedPlan,
                    id: `PLAN-COPY-${Date.now()}`,
                    name: `${selectedPlan.name} (Copy)`,
                    code: `${selectedPlan.code}_copy`,
                    status: 'Draft',
                    subscribersCount: 0,
                    monthlyRevenue: 0,
                  }
                  setPlans([...plans, dup])
                  setSelectedPlan(null)
                  toast({
                    variant: 'success',
                    title: 'Plan duplicated',
                    description: `Created draft copy: ${dup.name}`,
                  })
                }}
                className="flex items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] px-3 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
              >
                <Copy className="size-3.5 text-[#6f777f]" />
                <span>Duplicate Plan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(selectedPlan)
                    setSelectedPlan(null)
                    setPlanEditorOpen(true)
                  }}
                  className="flex items-center gap-1.5 rounded-[6px] bg-[#1f2327] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#2e3338] cursor-pointer"
                >
                  <Edit className="size-3.5" />
                  <span>Edit Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROMO CODE MODAL (Create New Promo & Edit Promo)
         ========================================================================= */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-lg rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f2327]">
                  {editingPromo ? `Edit Promo Code: ${editingPromo.code}` : 'Create Promo Code'}
                </h3>
                <p className="text-[12px] text-[#6f777f]">
                  Configure discount amounts, assigned commercial tiers, and usage limits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPromoModalOpen(false)
                  setEditingPromo(null)
                }}
                className="rounded-full p-1.5 text-[#8f969e] hover:bg-[#f4f5f6] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Promo Code *</label>
                  <input
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIP2026"
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] font-mono font-bold text-[#00838f] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Discount Type</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value as any })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="Percentage">Percentage (% Off)</option>
                    <option value="Fixed Amount">Fixed Amount (AED Off)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">
                    {promoForm.discountType === 'Percentage' ? 'Percentage Value (%)' : 'Fixed Discount (AED)'}
                  </label>
                  <input
                    type="number"
                    value={promoForm.discountValue}
                    onChange={(e) => setPromoForm({ ...promoForm, discountValue: Number(e.target.value) })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] font-bold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Total Usage Limit</label>
                  <input
                    type="number"
                    value={promoForm.usageLimit}
                    onChange={(e) => setPromoForm({ ...promoForm, usageLimit: Number(e.target.value) })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Assigned Plan</label>
                  <select
                    value={promoForm.assignedPlan}
                    onChange={(e) => setPromoForm({ ...promoForm, assignedPlan: e.target.value })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="All Paid Plans">All Paid Plans</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Assigned Country</label>
                  <select
                    value={promoForm.country}
                    onChange={(e) => setPromoForm({ ...promoForm, country: e.target.value })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="All">All Countries</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Expiration Date</label>
                  <input
                    value={promoForm.expirationDate}
                    onChange={(e) => setPromoForm({ ...promoForm, expirationDate: e.target.value })}
                    placeholder="e.g. 31 Dec 2026"
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Active Status</label>
                  <select
                    value={promoForm.status}
                    onChange={(e) => setPromoForm({ ...promoForm, status: e.target.value as any })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Expired">Expired</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => {
                  setPromoModalOpen(false)
                  setEditingPromo(null)
                }}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePromo}
                className="rounded-[6px] bg-[#00c2cb] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#00838f] cursor-pointer"
              >
                {editingPromo ? 'Save Changes' : 'Create Promo Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAYMENT DETAILS MODAL
         ========================================================================= */}
      {paymentModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f2327]">Payment #{selectedPayment.id}</h3>
                <p className="text-[11.5px] text-[#8f969e]">Gateway: {selectedPayment.gateway}</p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="rounded-full p-1.5 text-[#8f969e] hover:bg-[#f4f5f6]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-[12.5px]">
              <div className="flex items-center justify-between bg-[#fafbfc] p-3 rounded-[8px] border border-[#e5e7eb]">
                <div>
                  <span className="text-[#8f969e] block text-[11px]">Total Paid Amount</span>
                  <span className="text-[18px] font-bold text-[#1f2327]">
                    AED {selectedPayment.amount.toLocaleString()}
                  </span>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                    selectedPayment.status === 'Successful' && 'bg-[#ecfdf3] text-[#027a48]',
                    selectedPayment.status === 'Failed' && 'bg-[#fef3f2] text-[#d92d20]',
                    selectedPayment.status === 'Refunded' && 'bg-[#f4f5f6] text-[#475467]',
                    selectedPayment.status === 'Pending' && 'bg-[#fffaeb] text-[#b54708]',
                    selectedPayment.status === 'Chargeback' && 'bg-[#fef3f2] text-[#d92d20]'
                  )}
                >
                  {selectedPayment.status}
                </span>
              </div>

              <div className="divide-y divide-[#f0f2f5] border border-[#e5e7eb] rounded-[8px] px-3 bg-white">
                <div className="flex justify-between py-2">
                  <span className="text-[#6f777f]">Subscriber:</span>
                  <span className="font-bold text-[#1f2327]">{selectedPayment.userName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6f777f]">Subscribed Tier:</span>
                  <span className="font-medium text-[#00838f]">{selectedPayment.planName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6f777f]">Payment Method:</span>
                  <span className="text-[#1f2327]">
                    {selectedPayment.paymentMethod} {selectedPayment.cardLast4 ? `•••• ${selectedPayment.cardLast4}` : ''}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6f777f]">Transaction ID:</span>
                  <span className="font-mono text-[11.5px] text-[#6f777f]">{selectedPayment.transactionId}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6f777f]">Date & Time:</span>
                  <span className="text-[#1f2327]">{selectedPayment.date}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6f777f]">Invoice Ref:</span>
                  <span className="font-medium text-[#00838f]">{selectedPayment.invoiceNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e5e7eb]">
              {selectedPayment.status === 'Successful' ? (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalOpen(false)
                    setRefundDialogOpen(true)
                  }}
                  className="rounded-[6px] border border-[#fda29b] px-3.5 py-1.5 text-[12px] font-bold text-[#d92d20] hover:bg-[#fef3f2] cursor-pointer"
                >
                  Refund Payment
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-4 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GENERATE INVOICE MODAL
         ========================================================================= */}
      {generateInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 ant-fade-in">
          <div className="w-full max-w-lg rounded-[12px] bg-white p-6 shadow-2xl border border-[#d3d5d7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f2327]">Generate Tax Invoice</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Issue and record a formal commercial invoice with 5% UAE VAT calculation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGenerateInvoiceOpen(false)}
                className="rounded-full p-1.5 text-[#8f969e] hover:bg-[#f4f5f6] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Select Customer / Subscriber</label>
                <select
                  value={invoiceForm.subscriberId}
                  onChange={(e) => {
                    const sub = subscribers.find((s) => s.id === e.target.value)
                    setInvoiceForm({
                      ...invoiceForm,
                      subscriberId: e.target.value,
                      planName: sub ? `${sub.planName} (${sub.billingCycle})` : invoiceForm.planName,
                      amount: sub ? sub.amount : invoiceForm.amount,
                    })
                  }}
                  className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13.5px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                >
                  {subscribers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.userName} ({s.userEmail}) — {s.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11.5px] font-semibold text-[#6f777f]">Plan or Line Item Description</label>
                <input
                  value={invoiceForm.planName}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, planName: e.target.value })}
                  placeholder="e.g. Power Agent (Monthly Term)"
                  className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13.5px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Base Amount (AED)</label>
                  <input
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] font-bold text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">UAE VAT (5%)</label>
                  <div className="mt-1 h-[38px] w-full flex items-center rounded-[8px] border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-[13.5px] font-semibold text-[#6f777f]">
                    AED {(Number(invoiceForm.amount || 0) * 0.05).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Due Date</label>
                  <input
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13.5px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold text-[#6f777f]">Payment Status</label>
                  <select
                    value={invoiceForm.status}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value as any })}
                    className="mt-1 h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13.5px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending Payment</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => setGenerateInvoiceOpen(false)}
                className="rounded-[6px] border border-[#d3d5d7] px-3.5 py-1.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateInvoice}
                className="rounded-[6px] bg-[#1f2327] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-black cursor-pointer shadow-2xs"
              >
                Generate & Record Invoice
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

