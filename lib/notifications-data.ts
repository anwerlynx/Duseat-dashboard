'use client'

export type NotificationChannel = 'push' | 'in-app' | 'email'
export type NotificationStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled'
export type NotificationCategory =
  | 'Welcome'
  | 'Subscription'
  | 'Payment'
  | 'Verification'
  | 'Reminder'
  | 'Marketing'
  | 'Request Updates'
  | 'Offer Updates'
  | 'Deal Updates'
  | 'System Maintenance'
  | 'General'

export type AudienceType =
  | 'All Users'
  | 'Investors'
  | 'Agents'
  | 'Premium Users'
  | 'Free Users'
  | 'Verified Users'
  | 'Specific Countries'
  | 'Specific Cities'
  | 'Custom Audience'
  | 'Individual User'

export interface CustomAudienceRule {
  id: string
  field:
    | 'userType'
    | 'subscription'
    | 'verification'
    | 'country'
    | 'city'
    | 'accountStatus'
    | 'lastActive'
    | 'registrationDate'
    | 'requestActivity'
    | 'offerActivity'
    | 'dealActivity'
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: string
}

export interface AudienceConfig {
  type: AudienceType
  estimatedReach: number
  countries?: string[]
  cities?: string[]
  customRules?: CustomAudienceRule[]
  customRuleLogic?: 'AND' | 'OR'
  individualUser?: {
    id: string
    name: string
    email: string
    role: 'Investor' | 'Agent' | 'Admin'
    avatar?: string
    country?: string
    verification?: string
  }
}

export interface DeviceStats {
  device: 'iOS' | 'Android' | 'Web'
  recipients: number
  delivered: number
  opened: number
  clicked: number
  failureRate: number
}

export interface CountryStats {
  country: string
  code: string
  recipients: number
  deliveryRate: number
  openRate: number
  clickRate: number
}

export interface DeliveryStats {
  recipients: number
  delivered: number
  opened: number
  clicked: number
  failed: number
  deliveryRate: number
  openRate: number
  clickRate: number
  failureRate: number
  deviceBreakdown: DeviceStats[]
  countryBreakdown: CountryStats[]
}

export interface PushChannelSettings {
  title: string
  body: string
  deepLink?: string
  sound?: string
  priority?: 'high' | 'normal' | 'low'
  imageUrl?: string
  actionButtonText?: string
}

export interface InAppChannelSettings {
  title: string
  message: string
  icon?: string
  ctaText?: string
  destination?: 'Request' | 'Offer' | 'Deal' | 'Profile' | 'Marketplace' | 'Custom URL'
  destinationUrl?: string
}

export interface EmailChannelSettings {
  subject: string
  previewText?: string
  bodyHtml?: string
  ctaText?: string
  ctaUrl?: string
  sender?: string
  replyTo?: string
}

export interface RecurrenceSettings {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  startDate: string
  endDate?: string
  time: string
  timezone: string
  summaryText: string
  isPaused?: boolean
}

export interface NotificationTimelineEvent {
  id: string
  event: string
  actor: string
  actorRole: string
  timestamp: string
  type: 'created' | 'edited' | 'scheduled' | 'sending' | 'completed' | 'failed' | 'cancelled'
  note?: string
}

export interface NotificationItem {
  id: string
  name: string
  category: NotificationCategory
  templateId?: string
  templateName?: string
  channels: NotificationChannel[]
  status: NotificationStatus
  audience: AudienceConfig
  createdAt: string
  createdBy: {
    name: string
    avatar?: string
    role: string
  }
  scheduledAt?: string
  sentAt?: string
  pushSettings?: PushChannelSettings
  inAppSettings?: InAppChannelSettings
  emailSettings?: EmailChannelSettings
  recurrence?: RecurrenceSettings
  deliveryStats?: DeliveryStats
  metrics?: {
    sentCount: number
    deliveredCount: number
    openedCount: number
    clickedCount: number
    failedCount?: number
  }
  deviceStats?: DeviceStats[]
  countryStats?: CountryStats[]
  timeline: NotificationTimelineEvent[]
  failureReason?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  category: NotificationCategory
  channels: NotificationChannel[]
  lastUpdated: string
  createdBy: string
  usageCount: number
  title: string
  body: string
  variables: string[]
  pushSettings?: PushChannelSettings
  inAppSettings?: InAppChannelSettings
  emailSettings?: EmailChannelSettings
}

export const NOTIFICATION_VARIABLES = [
  { key: '{{first_name}}', label: 'First Name', desc: 'Recipient first name', example: 'Ahmed' },
  { key: '{{last_name}}', label: 'Last Name', desc: 'Recipient last name', example: 'Al Mansoori' },
  { key: '{{user_id}}', label: 'User ID', desc: 'Unique account identifier', example: 'IN-2048' },
  { key: '{{request_id}}', label: 'Request ID', desc: 'Associated buyer request code', example: 'REQ-IN-2048-01' },
  { key: '{{offer_id}}', label: 'Offer ID', desc: 'Direct agent offer code', example: 'OFF-8821' },
  { key: '{{deal_id}}', label: 'Deal ID', desc: 'Transaction pipeline reference', example: 'DEAL-9182' },
  { key: '{{property_name}}', label: 'Property Title', desc: 'Title of the listing', example: 'Downtown Luxury Penthouse' },
  { key: '{{agent_name}}', label: 'Agent Name', desc: 'Listing or verified agent name', example: 'Elena Rostova' },
  { key: '{{amount}}', label: 'Price / Amount', desc: 'Currency formatted total', example: 'AED 12,500,000' },
  { key: '{{action_url}}', label: 'Direct Action URL', desc: 'Deep link CTA destination', example: 'https://duseat.com/requests/REQ-IN-2048-01' },
]

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'Welcome',
  'Subscription',
  'Payment',
  'Verification',
  'Reminder',
  'Marketing',
  'Request Updates',
  'Offer Updates',
  'Deal Updates',
  'System Maintenance',
  'General',
]

export const initialTemplates: NotificationTemplate[] = [
  {
    id: 'TMPL-101',
    name: 'New Offer Received on Request',
    category: 'Offer Updates',
    channels: ['push', 'in-app', 'email'],
    lastUpdated: '04 Sep 2026',
    createdBy: 'System Architect',
    usageCount: 842,
    title: 'New Offer on {{request_id}}',
    body: 'Hi {{first_name}}, {{agent_name}} just submitted a competitive offer of {{amount}} for {{property_name}}.',
    variables: ['{{first_name}}', '{{request_id}}', '{{agent_name}}', '{{amount}}', '{{property_name}}'],
    pushSettings: {
      title: 'New Offer on {{request_id}}',
      body: '{{agent_name}} submitted an offer for {{property_name}}.',
      deepLink: 'duseat://offers/{{offer_id}}',
      priority: 'high',
      sound: 'chime.mp3',
      actionButtonText: 'Review Offer',
    },
    inAppSettings: {
      title: 'New Offer Submitted',
      message: '{{agent_name}} submitted a new offer for {{property_name}} at {{amount}}.',
      ctaText: 'Review Offer',
      destination: 'Offer',
    },
    emailSettings: {
      subject: 'New Offer on {{request_id}} - {{property_name}}',
      previewText: '{{agent_name}} submitted an offer of {{amount}}.',
      bodyHtml: '<p>Dear {{first_name}},</p><p>You have received a new verified offer on your property request <strong>{{request_id}}</strong> from licensed broker <strong>{{agent_name}}</strong>.</p><p>Offer Amount: <strong>{{amount}}</strong></p>',
      ctaText: 'View & Compare Offers',
      sender: 'Duseat Marketplace <offers@duseat.com>',
      replyTo: 'support@duseat.com',
    },
  },
  {
    id: 'TMPL-102',
    name: 'KYC Document Expiring Notice',
    category: 'Verification',
    channels: ['push', 'in-app', 'email'],
    lastUpdated: '01 Sep 2026',
    createdBy: 'Compliance Desk',
    usageCount: 318,
    title: 'Your Verification Document is Expiring',
    body: 'Hello {{first_name}}, your identity documents for {{user_id}} will expire in 7 days. Please upload updated documents to maintain verified status.',
    variables: ['{{first_name}}', '{{user_id}}'],
    pushSettings: {
      title: 'Action Required: Verification Expiring',
      body: 'Your KYC documents expire soon. Tap to renew.',
      priority: 'high',
      sound: 'alert.mp3',
    },
    inAppSettings: {
      title: 'Renew Verification Documents',
      message: 'Please update your verification credentials to avoid trading disruption.',
      ctaText: 'Upload Documents',
      destination: 'Profile',
    },
    emailSettings: {
      subject: 'Urgent: Verification Renewal Required for {{user_id}}',
      previewText: 'Your verification status requires an updated document within 7 days.',
      bodyHtml: '<p>Dear {{first_name}},</p><p>Our compliance record indicates that your identity document for account <strong>{{user_id}}</strong> is scheduled to expire within 7 days.</p>',
      ctaText: 'Renew Verification Now',
      sender: 'Duseat Trust & Safety <compliance@duseat.com>',
      replyTo: 'compliance@duseat.com',
    },
  },
  {
    id: 'TMPL-103',
    name: 'Deal Conveyance Milestone Complete',
    category: 'Deal Updates',
    channels: ['push', 'in-app', 'email'],
    lastUpdated: '28 Aug 2026',
    createdBy: 'Conveyance Manager',
    usageCount: 520,
    title: 'Deal Milestone Completed: {{deal_id}}',
    body: 'Congratulations {{first_name}}, the escrow payment verification for {{deal_id}} has been approved successfully.',
    variables: ['{{first_name}}', '{{deal_id}}', '{{amount}}', '{{property_name}}'],
  },
  {
    id: 'TMPL-104',
    name: 'Broker Subscription Renewal (Elite/Power)',
    category: 'Subscription',
    channels: ['in-app', 'email'],
    lastUpdated: '25 Aug 2026',
    createdBy: 'Billing Team',
    usageCount: 194,
    title: 'Your Duseat Broker Plan Renews Soon',
    body: 'Hi {{agent_name}}, your Elite Agent subscription will renew automatically on {{amount}}.',
    variables: ['{{agent_name}}', '{{amount}}'],
  },
  {
    id: 'TMPL-105',
    name: 'Scheduled Platform Maintenance Window',
    category: 'System Maintenance',
    channels: ['push', 'in-app', 'email'],
    lastUpdated: '20 Aug 2026',
    createdBy: 'DevOps Lead',
    usageCount: 45,
    title: 'Scheduled System Maintenance: {{amount}}',
    body: 'Duseat Marketplace will undergo scheduled performance maintenance on Saturday from 02:00 AM to 04:00 AM GST.',
    variables: ['{{amount}}'],
  },
  {
    id: 'TMPL-106',
    name: 'Investor Welcome Onboarding Series',
    category: 'Welcome',
    channels: ['push', 'in-app', 'email'],
    lastUpdated: '15 Aug 2026',
    createdBy: 'Growth Marketing',
    usageCount: 1205,
    title: 'Welcome to Duseat Prime Real Estate',
    body: 'Welcome {{first_name}}! Submit your first private investment request to receive competitive proposals from top-rated licensed brokers.',
    variables: ['{{first_name}}'],
  },
  {
    id: 'TMPL-107',
    name: 'Live Chat Negotiation Reminder',
    category: 'Reminder',
    channels: ['push', 'in-app'],
    lastUpdated: '10 Aug 2026',
    createdBy: 'Support Team',
    usageCount: 970,
    title: 'Unread Message from {{agent_name}}',
    body: '{{first_name}}, you have 2 unread messages regarding {{property_name}} in your live negotiation desk.',
    variables: ['{{first_name}}', '{{agent_name}}', '{{property_name}}'],
  },
]

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-1094',
    name: 'New Verified Offer Alert - Downtown Villa',
    category: 'Offer Updates',
    templateId: 'TMPL-101',
    templateName: 'New Offer Received on Request',
    channels: ['push', 'in-app', 'email'],
    status: 'sent',
    audience: {
      type: 'Investors',
      estimatedReach: 4280,
      countries: ['United Arab Emirates', 'Saudi Arabia'],
    },
    createdAt: '05 Sep 2026 · 09:30 AM',
    sentAt: '05 Sep 2026 · 10:00 AM',
    createdBy: {
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      role: 'Campaign Lead',
    },
    pushSettings: {
      title: 'New Offer on REQ-IN-2048-01',
      body: 'Elena Rostova submitted an offer of AED 12,500,000 for Downtown Luxury Penthouse.',
      deepLink: 'duseat://offers/OFF-8821',
      priority: 'high',
      sound: 'chime.mp3',
      actionButtonText: 'Review Offer',
    },
    inAppSettings: {
      title: 'New Offer Submitted',
      message: 'Elena Rostova submitted a new offer for Downtown Luxury Penthouse at AED 12,500,000.',
      ctaText: 'View Offer',
      destination: 'Offer',
    },
    emailSettings: {
      subject: 'New Verified Offer Received: REQ-IN-2048-01',
      previewText: 'Elena Rostova submitted an offer of AED 12.5M.',
      sender: 'Duseat Marketplace <offers@duseat.com>',
      replyTo: 'support@duseat.com',
    },
    deliveryStats: {
      recipients: 4280,
      delivered: 4218,
      opened: 2890,
      clicked: 812,
      failed: 62,
      deliveryRate: 98.6,
      openRate: 67.5,
      clickRate: 19.0,
      failureRate: 1.4,
      deviceBreakdown: [
        { device: 'iOS', recipients: 2540, delivered: 2510, opened: 1820, clicked: 540, failureRate: 1.2 },
        { device: 'Android', recipients: 1420, delivered: 1398, opened: 890, clicked: 220, failureRate: 1.5 },
        { device: 'Web', recipients: 320, delivered: 310, opened: 180, clicked: 52, failureRate: 3.1 },
      ],
      countryBreakdown: [
        { country: 'United Arab Emirates', code: 'AE', recipients: 2850, deliveryRate: 99.1, openRate: 72.4, clickRate: 22.1 },
        { country: 'Saudi Arabia', code: 'SA', recipients: 920, deliveryRate: 97.8, openRate: 61.2, clickRate: 16.4 },
        { country: 'Egypt', code: 'EG', recipients: 320, deliveryRate: 96.5, openRate: 54.0, clickRate: 11.2 },
        { country: 'United Kingdom', code: 'GB', recipients: 190, deliveryRate: 98.9, openRate: 68.0, clickRate: 18.5 },
      ],
    },
    timeline: [
      { id: 't-1', event: 'Notification Draft Created', actor: 'Sarah Connor', actorRole: 'Campaign Lead', timestamp: '05 Sep 2026 · 09:30 AM', type: 'created' },
      { id: 't-2', event: 'Audience Configured: 4,280 Verified Investors', actor: 'Sarah Connor', actorRole: 'Campaign Lead', timestamp: '05 Sep 2026 · 09:42 AM', type: 'edited' },
      { id: 't-3', event: 'Broadcast Dispatched via Push & In-App', actor: 'System Gateway', actorRole: 'Automation', timestamp: '05 Sep 2026 · 10:00 AM', type: 'sending' },
      { id: 't-4', event: 'Delivery Completed: 4,218 Delivered (98.6%)', actor: 'System Gateway', actorRole: 'Automation', timestamp: '05 Sep 2026 · 10:02 AM', type: 'completed' },
    ],
  },
  {
    id: 'NOTIF-1093',
    name: 'Weekly Market Intelligence Digest - Q3 Outlook',
    category: 'Marketing',
    channels: ['email', 'in-app'],
    status: 'scheduled',
    audience: {
      type: 'All Users',
      estimatedReach: 24820,
    },
    createdAt: '04 Sep 2026 · 02:15 PM',
    scheduledAt: '08 Sep 2026 · 10:30 AM',
    createdBy: {
      name: 'Tariq Mansour',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      role: 'Marketing Director',
    },
    pushSettings: {
      title: 'Q3 Dubai Real Estate Intelligence Report',
      body: 'Discover average transaction yields and prime luxury demand in Palm Jumeirah.',
    },
    inAppSettings: {
      title: 'New Market Intelligence Report Available',
      message: 'Review high-yield residential hotspots across Dubai & Riyadh.',
      ctaText: 'Read Report',
      destination: 'Marketplace',
    },
    emailSettings: {
      subject: 'Duseat Market Insights: Q3 Prime Luxury Demand Report',
      previewText: 'Exclusive transaction volume analysis and yields across UAE.',
      sender: 'Duseat Intelligence <insights@duseat.com>',
      replyTo: 'insights@duseat.com',
    },
    timeline: [
      { id: 't-10', event: 'Campaign Scheduled for 08 Sep 2026 · 10:30 AM GST', actor: 'Tariq Mansour', actorRole: 'Marketing Director', timestamp: '04 Sep 2026 · 02:15 PM', type: 'scheduled' },
    ],
  },
  {
    id: 'NOTIF-1092',
    name: 'KYC Document Expiring Reminder - Wave 4',
    category: 'Verification',
    templateId: 'TMPL-102',
    templateName: 'KYC Document Expiring Notice',
    channels: ['push', 'in-app', 'email'],
    status: 'sent',
    audience: {
      type: 'Custom Audience',
      estimatedReach: 318,
      customRules: [
        { id: 'r1', field: 'verification', operator: 'equals', value: 'Expiring in 7 Days' },
        { id: 'r2', field: 'accountStatus', operator: 'equals', value: 'Active' },
      ],
      customRuleLogic: 'AND',
    },
    createdAt: '03 Sep 2026 · 11:00 AM',
    sentAt: '03 Sep 2026 · 11:15 AM',
    createdBy: {
      name: 'Compliance Desk',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      role: 'Compliance Lead',
    },
    deliveryStats: {
      recipients: 318,
      delivered: 314,
      opened: 245,
      clicked: 198,
      failed: 4,
      deliveryRate: 98.7,
      openRate: 77.0,
      clickRate: 62.3,
      failureRate: 1.3,
      deviceBreakdown: [
        { device: 'iOS', recipients: 210, delivered: 208, opened: 170, clicked: 140, failureRate: 0.9 },
        { device: 'Android', recipients: 92, delivered: 90, opened: 65, clicked: 50, failureRate: 2.1 },
        { device: 'Web', recipients: 16, delivered: 16, opened: 10, clicked: 8, failureRate: 0.0 },
      ],
      countryBreakdown: [
        { country: 'United Arab Emirates', code: 'AE', recipients: 240, deliveryRate: 99.0, openRate: 80.0, clickRate: 68.0 },
        { country: 'Saudi Arabia', code: 'SA', recipients: 58, deliveryRate: 98.0, openRate: 72.0, clickRate: 51.0 },
        { country: 'United Kingdom', code: 'GB', recipients: 20, deliveryRate: 95.0, openRate: 65.0, clickRate: 40.0 },
      ],
    },
    timeline: [
      { id: 't-20', event: 'Compliance batch dispatched to 318 users', actor: 'Compliance Desk', actorRole: 'Compliance Lead', timestamp: '03 Sep 2026 · 11:15 AM', type: 'completed' },
    ],
  },
  {
    id: 'NOTIF-1091',
    name: 'Scheduled Cloud Infrastructure Maintenance Notice',
    category: 'System Maintenance',
    templateId: 'TMPL-105',
    templateName: 'Scheduled Platform Maintenance Window',
    channels: ['push', 'in-app', 'email'],
    status: 'scheduled',
    audience: {
      type: 'All Users',
      estimatedReach: 24820,
    },
    createdAt: '03 Sep 2026 · 04:00 PM',
    scheduledAt: '12 Sep 2026 · 02:00 AM',
    createdBy: {
      name: 'DevOps Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      role: 'System Administrator',
    },
    pushSettings: {
      title: 'Scheduled Maintenance: 12 Sep 02:00 AM GST',
      body: 'Duseat Marketplace will undergo brief database upgrades for 45 minutes.',
    },
    timeline: [
      { id: 't-30', event: 'Maintenance Broadcast Scheduled', actor: 'DevOps Lead', actorRole: 'System Administrator', timestamp: '03 Sep 2026 · 04:00 PM', type: 'scheduled' },
    ],
  },
  {
    id: 'NOTIF-1090',
    name: 'Elite Broker Exclusive Deal Flow Beta Invite',
    category: 'Marketing',
    channels: ['in-app', 'email'],
    status: 'draft',
    audience: {
      type: 'Custom Audience',
      estimatedReach: 1450,
      customRules: [
        { id: 'r1', field: 'userType', operator: 'equals', value: 'Agent' },
        { id: 'r2', field: 'subscription', operator: 'equals', value: 'Elite' },
      ],
      customRuleLogic: 'AND',
    },
    createdAt: '02 Sep 2026 · 03:20 PM',
    createdBy: {
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      role: 'Campaign Lead',
    },
    pushSettings: {
      title: 'Exclusive Beta Access: Private Off-Market Vault',
      body: 'As an Elite Broker, test our new instant co-brokerage matching module.',
    },
    timeline: [
      { id: 't-40', event: 'Draft Created with Elite Broker segmentation', actor: 'Sarah Connor', actorRole: 'Campaign Lead', timestamp: '02 Sep 2026 · 03:20 PM', type: 'created' },
    ],
  },
  {
    id: 'NOTIF-1089',
    name: 'Urgent SMS Gateway Fallback Test Notice',
    category: 'General',
    channels: ['push'],
    status: 'failed',
    failureReason: 'APNs Provider Authentication Token Expired (HTTP 403)',
    audience: {
      type: 'Individual User',
      estimatedReach: 1,
      individualUser: {
        id: 'AG-1048',
        name: 'Elena Rostova',
        email: 'elena.rostova@damacproperties.ae',
        role: 'Agent',
        country: 'United Arab Emirates',
        verification: 'Verified',
      },
    },
    createdAt: '01 Sep 2026 · 08:10 AM',
    sentAt: '01 Sep 2026 · 08:12 AM',
    createdBy: {
      name: 'System Gateway',
      role: 'Automation',
    },
    deliveryStats: {
      recipients: 1,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 1,
      deliveryRate: 0.0,
      openRate: 0.0,
      clickRate: 0.0,
      failureRate: 100.0,
      deviceBreakdown: [
        { device: 'iOS', recipients: 1, delivered: 0, opened: 0, clicked: 0, failureRate: 100.0 },
      ],
      countryBreakdown: [
        { country: 'United Arab Emirates', code: 'AE', recipients: 1, deliveryRate: 0.0, openRate: 0.0, clickRate: 0.0 },
      ],
    },
    timeline: [
      { id: 't-50', event: 'Delivery Attempt Failed: APNs Auth Token Expired', actor: 'System Gateway', actorRole: 'Automation', timestamp: '01 Sep 2026 · 08:12 AM', type: 'failed', note: 'Cert rotation required in Apple Developer Portal.' },
    ],
  },
  {
    id: 'NOTIF-1088',
    name: 'Investor Onboarding Welcome Drip - Day 3',
    category: 'Welcome',
    templateId: 'TMPL-106',
    templateName: 'Investor Welcome Onboarding Series',
    channels: ['push', 'in-app', 'email'],
    status: 'sent',
    recurrence: {
      frequency: 'daily',
      startDate: '01 Aug 2026',
      time: '10:00 AM',
      timezone: 'Dubai (GMT+4)',
      summaryText: 'Every day at 10:00 AM GST for newly joined investors',
    },
    audience: {
      type: 'Investors',
      estimatedReach: 1205,
    },
    createdAt: '01 Aug 2026 · 09:00 AM',
    sentAt: '31 Aug 2026 · 10:00 AM',
    createdBy: {
      name: 'Tariq Mansour',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      role: 'Marketing Director',
    },
    deliveryStats: {
      recipients: 1205,
      delivered: 1192,
      opened: 840,
      clicked: 310,
      failed: 13,
      deliveryRate: 98.9,
      openRate: 69.7,
      clickRate: 25.7,
      failureRate: 1.1,
      deviceBreakdown: [
        { device: 'iOS', recipients: 780, delivered: 775, opened: 560, clicked: 210, failureRate: 0.6 },
        { device: 'Android', recipients: 380, delivered: 372, opened: 250, clicked: 88, failureRate: 2.1 },
        { device: 'Web', recipients: 45, delivered: 45, opened: 30, clicked: 12, failureRate: 0.0 },
      ],
      countryBreakdown: [
        { country: 'United Arab Emirates', code: 'AE', recipients: 820, deliveryRate: 99.2, openRate: 74.0, clickRate: 29.0 },
        { country: 'Saudi Arabia', code: 'SA', recipients: 250, deliveryRate: 98.4, openRate: 64.0, clickRate: 21.0 },
        { country: 'Egypt', code: 'EG', recipients: 85, deliveryRate: 97.6, openRate: 58.0, clickRate: 16.0 },
        { country: 'United Kingdom', code: 'GB', recipients: 50, deliveryRate: 100.0, openRate: 72.0, clickRate: 24.0 },
      ],
    },
    timeline: [
      { id: 't-60', event: 'Recurring Drip Campaign Active (Daily 10:00 AM)', actor: 'Tariq Mansour', actorRole: 'Marketing Director', timestamp: '01 Aug 2026 · 09:00 AM', type: 'created' },
    ],
  },
  {
    id: 'NOTIF-1087',
    name: 'Escrow Payment Confirmation Notification',
    category: 'Payment',
    channels: ['push', 'in-app', 'email'],
    status: 'sent',
    audience: {
      type: 'Individual User',
      estimatedReach: 1,
      individualUser: {
        id: 'IN-2048',
        name: 'Ahmed Al Mansoori',
        email: 'ahmed.almansoori@emirates.ae',
        role: 'Investor',
        country: 'United Arab Emirates',
        verification: 'Verified',
      },
    },
    createdAt: '30 Aug 2026 · 04:30 PM',
    sentAt: '30 Aug 2026 · 04:32 PM',
    createdBy: {
      name: 'Conveyance Desk',
      role: 'Escrow Officer',
    },
    pushSettings: {
      title: 'Payment Confirmed: DEAL-9182',
      body: 'Your escrow deposit of AED 2,500,000 has been verified by Emirates NBD.',
    },
    deliveryStats: {
      recipients: 1,
      delivered: 1,
      opened: 1,
      clicked: 1,
      failed: 0,
      deliveryRate: 100.0,
      openRate: 100.0,
      clickRate: 100.0,
      failureRate: 0.0,
      deviceBreakdown: [
        { device: 'iOS', recipients: 1, delivered: 1, opened: 1, clicked: 1, failureRate: 0.0 },
      ],
      countryBreakdown: [
        { country: 'United Arab Emirates', code: 'AE', recipients: 1, deliveryRate: 100.0, openRate: 100.0, clickRate: 100.0 },
      ],
    },
    timeline: [
      { id: 't-70', event: 'Transaction Confirmation Dispatched', actor: 'Conveyance Desk', actorRole: 'Escrow Officer', timestamp: '30 Aug 2026 · 04:32 PM', type: 'completed' },
    ],
  },
  {
    id: 'NOTIF-1086',
    name: 'Flash Weekend Broker Incentive Promo',
    category: 'Marketing',
    channels: ['push', 'in-app'],
    status: 'cancelled',
    audience: {
      type: 'Agents',
      estimatedReach: 3200,
    },
    createdAt: '28 Aug 2026 · 11:00 AM',
    createdBy: {
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      role: 'Campaign Lead',
    },
    pushSettings: {
      title: 'Zero Commission Fees on Downtown Deals',
      body: 'Submit proposals this weekend to earn 100% platform commission matching.',
    },
    timeline: [
      { id: 't-80', event: 'Campaign Scheduled for 29 Aug', actor: 'Sarah Connor', actorRole: 'Campaign Lead', timestamp: '28 Aug 2026 · 11:00 AM', type: 'scheduled' },
      { id: 't-81', event: 'Campaign Cancelled by Compliance Review', actor: 'Compliance Lead', actorRole: 'Admin', timestamp: '28 Aug 2026 · 02:30 PM', type: 'cancelled', note: 'Terms require updated broker regulatory disclosure.' },
    ],
  },
  {
    id: 'NOTIF-1085',
    name: 'RERA Compliance License Upload Warning',
    category: 'Verification',
    channels: ['push', 'in-app', 'email'],
    status: 'sent',
    audience: {
      type: 'Agents',
      estimatedReach: 890,
      countries: ['United Arab Emirates'],
    },
    createdAt: '26 Aug 2026 · 09:00 AM',
    sentAt: '26 Aug 2026 · 09:10 AM',
    createdBy: {
      name: 'Compliance Desk',
      role: 'Compliance Lead',
    },
    deliveryStats: {
      recipients: 890,
      delivered: 878,
      opened: 712,
      clicked: 490,
      failed: 12,
      deliveryRate: 98.6,
      openRate: 80.0,
      clickRate: 55.1,
      failureRate: 1.4,
      deviceBreakdown: [
        { device: 'iOS', recipients: 540, delivered: 535, opened: 440, clicked: 310, failureRate: 0.9 },
        { device: 'Android', recipients: 310, delivered: 303, opened: 242, clicked: 160, failureRate: 2.2 },
        { device: 'Web', recipients: 40, delivered: 40, opened: 30, clicked: 20, failureRate: 0.0 },
      ],
      countryBreakdown: [
        { country: 'United Arab Emirates', code: 'AE', recipients: 890, deliveryRate: 98.6, openRate: 80.0, clickRate: 55.1 },
      ],
    },
    timeline: [
      { id: 't-90', event: 'Regulatory Notice Broadcast Completed', actor: 'Compliance Desk', actorRole: 'Compliance Lead', timestamp: '26 Aug 2026 · 09:10 AM', type: 'completed' },
    ],
  },
]

const STORAGE_KEY_NOTIFICATIONS = 'duseat_notifications_records_v1'
const STORAGE_KEY_TEMPLATES = 'duseat_notification_templates_v1'

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return initialNotifications
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return initialNotifications
}

export function saveStoredNotifications(items: NotificationItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(items))
  } catch {}
}

export function getStoredTemplates(): NotificationTemplate[] {
  if (typeof window === 'undefined') return initialTemplates
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES)
    if (raw) return JSON.parse(raw)
  } catch {}
  return initialTemplates
}

export function saveStoredTemplates(items: NotificationTemplate[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(items))
  } catch {}
}
