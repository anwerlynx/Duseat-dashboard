'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Sliders,
  Globe,
  Store,
  Bell,
  Cpu,
  ShieldCheck,
  Flag,
  Wrench,
  Users,
  Database,
  History,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Key,
  Webhook,
  Lock,
  Smartphone,
  Mail,
  Send,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldAlert,
  Server,
  Zap,
  Info,
  CheckCheck,
} from 'lucide-react'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { PlatformShell } from './platform-shell'


type SettingsSectionId =
  | 'general'
  | 'localization'
  | 'marketplace'
  | 'notifications'
  | 'integrations'
  | 'security'
  | 'feature_flags'
  | 'maintenance'
  | 'administration'
  | 'backup'
  | 'audit_log'

interface NavItem {
  id: SettingsSectionId
  label: string
  labelAr: string
  icon: React.ElementType
  description: string
  badge?: string
  danger?: boolean
}

const SETTINGS_NAV: NavItem[] = [
  { id: 'general', label: 'General', labelAr: 'الإعدادات العامة', icon: Sliders, description: 'Platform identity, logo, emails & formats' },
  { id: 'localization', label: 'Localization', labelAr: 'اللغات والدول والعملات', icon: Globe, description: 'Languages, countries, cities & exchange rates' },
  { id: 'marketplace', label: 'Marketplace', labelAr: 'تصنيفات السوق والعقارات', icon: Store, description: 'Property types, units, amenities & taxonomy' },
  { id: 'notifications', label: 'Notifications', labelAr: 'خوادم الإشعارات والبريد', icon: Bell, description: 'Push FCM, SMTP credentials & test triggers' },
  { id: 'integrations', label: 'Integrations', labelAr: 'الربط البرمجي والمفاتيح', icon: Cpu, description: 'Google Maps, Gateways, API keys & webhooks' },
  { id: 'security', label: 'Security & Access', labelAr: 'الأمان والتحقق والسياسات', icon: ShieldCheck, description: 'Password policy, 2FA, session timeout & sessions' },
  { id: 'feature_flags', label: 'Feature Flags', labelAr: 'أعلام الميزات والإطلاق التدريجي', icon: Flag, description: 'Controlled gradual rollout & beta testing' },
  { id: 'maintenance', label: 'Maintenance', labelAr: 'وضع الصيانة والجدولة', icon: Wrench, description: 'Live maintenance mode & downtime schedules' },
  { id: 'administration', label: 'Administration', labelAr: 'الأدوار والصلاحيات والمشرفين', icon: Users, description: 'Admin roles, permission matrix & staff accounts' },
  { id: 'backup', label: 'Backup & Recovery', labelAr: 'النسخ الاحتياطي والاستعادة', icon: Database, description: 'Automated snapshots, manual backup & restore' },
  { id: 'audit_log', label: 'Audit Trail', labelAr: 'سجل تدقيق الإعدادات', icon: History, description: 'Chronological log of all configuration changes' },
]

export function SettingsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Settings Engine...</div>}>
        <SettingsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}

function SettingsManagementInner() {
  const { toast } = useToast()
  const showToast = React.useCallback((title: string, variant: 'success' | 'error' | 'info' | 'default' = 'info') => {
    toast({
      title,
      variant: variant === 'default' ? 'info' : variant,
    })
  }, [toast])

  const [activeSection, setActiveSection] = React.useState<SettingsSectionId>('general')
  const [isDirty, setIsDirty] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Modals & Dialogs State
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false)
  const [generatedApiKey, setGeneratedApiKey] = React.useState<string | null>(null)
  const [showRestoreModal, setShowRestoreModal] = React.useState(false)
  const [restoreConfirmationText, setRestoreConfirmationText] = React.useState('')
  const [selectedBackupForRestore, setSelectedBackupForRestore] = React.useState<any | null>(null)
  const [showInviteAdminModal, setShowInviteAdminModal] = React.useState(false)
  const [showAddCityModal, setShowAddCityModal] = React.useState(false)
  const [showCreateWebhookModal, setShowCreateWebhookModal] = React.useState(false)
  const [showFlagRolloutModal, setShowFlagRolloutModal] = React.useState<any | null>(null)
  const [testingSmtp, setTestingSmtp] = React.useState(false)
  const [testingPush, setTestingPush] = React.useState(false)
  const [testingMaps, setTestingMaps] = React.useState(false)
  const [backupProgress, setBackupProgress] = React.useState<number | null>(null)

  // 1. General Settings State
  const [generalSettings, setGeneralSettings] = React.useState({
    platformName: 'Duseat Real Estate Marketplace',
    logoUrl: '/logo.svg',
    supportEmail: 'support@duseat.com',
    contactNumber: '+971 4 800 387328',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    defaultLanguage: 'en',
    defaultCurrency: 'AED',
    platformUrl: 'https://duseat.com',
    supportUrl: 'https://help.duseat.com',
  })

  // 2. Localization State
  const [languages, setLanguages] = React.useState([
    { id: 'en', name: 'English', code: 'en', status: 'Active', isDefault: true, coverage: '100%' },
    { id: 'ar', name: 'Arabic (العربية)', code: 'ar', status: 'Active', isDefault: false, coverage: '98%' },
    { id: 'ru', name: 'Russian (Русский)', code: 'ru', status: 'Active', isDefault: false, coverage: '85%' },
    { id: 'fr', name: 'French (Français)', code: 'fr', status: 'Disabled', isDefault: false, coverage: '72%' },
  ])

  const [countries, setCountries] = React.useState([
    { id: 'uae', name: 'United Arab Emirates', iso: 'AE', currency: 'AED', status: 'Active', listings: 14280 },
    { id: 'sau', name: 'Saudi Arabia', iso: 'SA', currency: 'SAR', status: 'Active', listings: 3410 },
    { id: 'qat', name: 'Qatar', iso: 'QA', currency: 'QAR', status: 'Active', listings: 920 },
    { id: 'gbr', name: 'United Kingdom', iso: 'GB', currency: 'GBP', status: 'Disabled', listings: 0 },
  ])

  const [cities, setCities] = React.useState([
    { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates', status: 'Active', districts: 48 },
    { id: 'auh', name: 'Abu Dhabi', country: 'United Arab Emirates', status: 'Active', districts: 22 },
    { id: 'shj', name: 'Sharjah', country: 'United Arab Emirates', status: 'Active', districts: 14 },
    { id: 'ryd', name: 'Riyadh', country: 'Saudi Arabia', status: 'Active', districts: 36 },
    { id: 'jed', name: 'Jeddah', country: 'Saudi Arabia', status: 'Active', districts: 19 },
    { id: 'doh', name: 'Doha', country: 'Qatar', status: 'Active', districts: 12 },
  ])

  const [currencies, setCurrencies] = React.useState([
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rate: 1.0, isBase: true, status: 'Active', lastUpdate: 'Live Pegged' },
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.2723, isBase: false, status: 'Active', lastUpdate: 'Central Bank (5m ago)' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.2514, isBase: false, status: 'Active', lastUpdate: 'Central Bank (5m ago)' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.2148, isBase: false, status: 'Active', lastUpdate: 'Central Bank (5m ago)' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', rate: 1.021, isBase: false, status: 'Active', lastUpdate: 'Central Bank (5m ago)' },
  ])

  // 3. Marketplace Taxonomy State
  const [propertyTypes, setPropertyTypes] = React.useState([
    { id: 'apt', name: 'Apartment', icon: 'Building2', usageCount: 12842, status: 'Active', order: 1 },
    { id: 'vil', name: 'Villa', icon: 'Home', usageCount: 6410, status: 'Active', order: 2 },
    { id: 'twn', name: 'Townhouse', icon: 'Building', usageCount: 3120, status: 'Active', order: 3 },
    { id: 'pen', name: 'Penthouse', icon: 'Sparkles', usageCount: 940, status: 'Active', order: 4 },
    { id: 'off', name: 'Office', icon: 'Briefcase', usageCount: 1820, status: 'Active', order: 5 },
    { id: 'ret', name: 'Retail Space', icon: 'Store', usageCount: 760, status: 'Active', order: 6 },
    { id: 'lnd', name: 'Land / Plot', icon: 'Trees', usageCount: 430, status: 'Active', order: 7 },
  ])

  const [unitTypes, setUnitTypes] = React.useState([
    { id: 'stu', name: 'Studio', order: 1, status: 'Active' },
    { id: '1br', name: '1 Bedroom', order: 2, status: 'Active' },
    { id: '2br', name: '2 Bedrooms', order: 3, status: 'Active' },
    { id: '3br', name: '3 Bedrooms', order: 4, status: 'Active' },
    { id: '4br', name: '4+ Bedrooms', order: 5, status: 'Active' },
  ])

  const [amenities, setAmenities] = React.useState([
    { id: 'pool', name: 'Swimming Pool', category: 'Leisure', status: 'Active' },
    { id: 'gym', name: 'Fitness Gym', category: 'Fitness', status: 'Active' },
    { id: 'seaview', name: 'Sea & Marina View', category: 'View', status: 'Active' },
    { id: 'balcony', name: 'Private Balcony', category: 'Exterior', status: 'Active' },
    { id: 'valet', name: 'Valet Parking', category: 'Services', status: 'Active' },
    { id: 'concierge', name: '24/7 Concierge & Security', category: 'Services', status: 'Active' },
  ])

  // 4. Notifications State
  const [notificationConfig, setNotificationConfig] = React.useState({
    pushProvider: 'Firebase Cloud Messaging (FCM)',
    fcmProjectId: 'duseat-prod-fcm-9921',
    fcmStatus: 'Connected',
    fcmLatency: '38ms',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUser: 'apikey_duseat_prod',
    smtpEncryption: 'TLS',
    fromName: 'Duseat Real Estate Marketplace',
    fromEmail: 'noreply@duseat.com',
    replyTo: 'support@duseat.com',
  })

  // 5. Integrations State
  const [integrationsConfig, setIntegrationsConfig] = React.useState({
    googleMapsKeyMasked: 'AIzaSyD9••••••••••••••••3910',
    mapsDefaultLat: 25.2048,
    mapsDefaultLng: 55.2708,
    mapsDefaultZoom: 12,
    mapsStatus: 'Connected',
    ga4TrackingId: 'G-DUS829104',
    mixpanelTokenMasked: 'mp_live_••••••••••••91',
  })

  const [paymentGateways, setPaymentGateways] = React.useState([
    { id: 'stripe', name: 'Stripe Payments', env: 'Live', status: 'Active', webhookUrl: 'https://api.duseat.com/webhooks/stripe' },
    { id: 'checkout', name: 'Checkout.com (UAE / GCC)', env: 'Live', status: 'Active', webhookUrl: 'https://api.duseat.com/webhooks/checkout' },
    { id: 'tabby', name: 'Tabby BNPL', env: 'Live', status: 'Active', webhookUrl: 'https://api.duseat.com/webhooks/tabby' },
    { id: 'tamara', name: 'Tamara BNPL', env: 'Live', status: 'Active', webhookUrl: 'https://api.duseat.com/webhooks/tamara' },
    { id: 'applepay', name: 'Apple Pay Direct', env: 'Live', status: 'Active', webhookUrl: 'https://api.duseat.com/webhooks/applepay' },
  ])

  const [apiKeys, setApiKeys] = React.useState([
    { id: 'k1', name: 'Mobile App Gateway Service', prefix: 'duseat_live_••••••••4821', createdBy: 'Ahmed Al-Maktoum (Super Admin)', createdAt: '12 Jan 2026', lastUsed: '3 mins ago', status: 'Active', expires: 'Never' },
    { id: 'k2', name: 'CRM Zapier Sync Pipeline', prefix: 'duseat_live_••••••••9012', createdBy: 'Sarah Jenkins (Ops)', createdAt: '02 Feb 2026', lastUsed: '1 hour ago', status: 'Active', expires: '31 Dec 2026' },
    { id: 'k3', name: 'Legacy Property Feed Sync', prefix: 'duseat_live_••••••••1104', createdBy: 'Karim Mansour (Dev)', createdAt: '15 Nov 2025', lastUsed: '4 days ago', status: 'Revoked', expires: 'Expired' },
  ])

  const [webhooks, setWebhooks] = React.useState([
    { id: 'wh1', name: 'Core Billing Webhook (Subscriptions)', url: 'https://billing.duseat.com/api/v1/events', events: ['subscription.created', 'payment.succeeded', 'invoice.paid'], status: 'Active', lastDelivery: '2 mins ago', successRate: '99.9%' },
    { id: 'wh2', name: 'Investor Matchmaking Engine', url: 'https://ai-engine.duseat.com/webhooks/requests', events: ['request.created', 'offer.submitted', 'deal.closed'], status: 'Active', lastDelivery: '14 mins ago', successRate: '99.4%' },
    { id: 'wh3', name: 'Slack Compliance & Fraud Alerts', url: 'https://hooks.slack.com/services/T00/B00/XXXX', events: ['user.suspended', 'kyc.rejected', 'dispute.opened'], status: 'Active', lastDelivery: '1 hour ago', successRate: '100%' },
  ])

  // 6. Security State
  const [securityConfig, setSecurityConfig] = React.useState({
    minPasswordLength: 10,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    passwordExpirationDays: 90,
    passwordHistoryCount: 5,
    twoFactorMandatoryAdmins: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    progressiveLockout: true,
  })

  const [activeSessions, setActiveSessions] = React.useState([
    { id: 's1', device: 'Apple MacBook Pro 16" (M3 Max)', browser: 'Chrome 128.0 (macOS)', location: 'Dubai, UAE', ip: '194.12.84.112', lastActive: 'Just now (Current Session)', isCurrent: true },
    { id: 's2', device: 'Apple iPhone 15 Pro Max', browser: 'Duseat Admin iOS 2.4', location: 'Dubai, UAE', ip: '194.12.84.112', lastActive: '24 mins ago', isCurrent: false },
    { id: 's3', device: 'Dell XPS 15 (Windows 11)', browser: 'Edge 127.0', location: 'Abu Dhabi, UAE', ip: '82.145.22.90', lastActive: '3 hours ago', isCurrent: false },
  ])

  // 7. Feature Flags State
  const [featureFlags, setFeatureFlags] = React.useState([
    { id: 'ff_ai_match', name: 'AI Real-Time Property Matching', key: 'ai_property_matching', status: 'Beta', rolloutPct: 25, env: 'Production', audience: 'UAE Investors & Premium Agents', updatedBy: 'Ahmed Al-Maktoum', updatedAt: '04 Sep 2026' },
    { id: 'ff_instant_deal', name: 'Instant Digital Deal Closing (Smart Contracts)', key: 'instant_deal_closing', status: 'Beta', rolloutPct: 10, env: 'Production', audience: 'Verified VIP Investors', updatedBy: 'Sarah Jenkins', updatedAt: '01 Sep 2026' },
    { id: 'ff_crypto_pay', name: 'USDT / USDC Crypto Escrow Payments', key: 'crypto_escrow_pay', status: 'Disabled', rolloutPct: 0, env: 'Staging', audience: 'Internal Only', updatedBy: 'Ahmed Al-Maktoum', updatedAt: '28 Aug 2026' },
    { id: 'ff_whatsapp_leads', name: 'Direct Verified WhatsApp Lead Forwarding', key: 'whatsapp_lead_forward', status: 'Enabled', rolloutPct: 100, env: 'Production', audience: 'All Users', updatedBy: 'Sarah Jenkins', updatedAt: '20 Aug 2026' },
    { id: 'ff_auto_valuation', name: 'Automated Real Estate Valuation Algorithm (AVM)', key: 'avm_valuation_engine', status: 'Enabled', rolloutPct: 100, env: 'Production', audience: 'All Properties', updatedBy: 'Ahmed Al-Maktoum', updatedAt: '15 Aug 2026' },
  ])

  // 8. Maintenance State
  const [maintenanceConfig, setMaintenanceConfig] = React.useState({
    isEnabled: false,
    affectedPlatforms: 'All' as 'Website' | 'Mobile App' | 'All',
    title: 'Duseat is Upgrading Platform Systems',
    message: 'We are performing scheduled infrastructure upgrades to provide faster deal closing and enhanced analytics. We will be back online shortly.',
    estimatedDuration: '45 minutes',
    supportContact: 'emergency-support@duseat.com',
    scheduledStart: '12 Sep 2026 — 02:00 AM UTC',
    scheduledEnd: '12 Sep 2026 — 03:30 AM UTC',
    isScheduled: true,
  })

  // 9. Administration State
  const [roles, setRoles] = React.useState([
    { id: 'super_admin', name: 'Super Admin', adminsCount: 2, permissionsCount: 'All (Full Access)', status: 'System Protected', updatedAt: 'Permanent' },
    { id: 'finance_admin', name: 'Finance Admin', adminsCount: 3, permissionsCount: '18 Permissions (Finance, Subscriptions, Invoices)', status: 'Active', updatedAt: '12 Aug 2026' },
    { id: 'ops_admin', name: 'Operations Admin', adminsCount: 6, permissionsCount: '26 Permissions (Requests, Offers, Deals, Users, KYC)', status: 'Active', updatedAt: '20 Aug 2026' },
    { id: 'marketing_admin', name: 'Marketing Admin', adminsCount: 4, permissionsCount: '14 Permissions (Campaigns, Referrals, CMS, Banners)', status: 'Active', updatedAt: '28 Aug 2026' },
    { id: 'moderation_admin', name: 'Moderation Admin', adminsCount: 5, permissionsCount: '8 Permissions (Chats, Reports, User Verification)', status: 'Active', updatedAt: '02 Sep 2026' },
    { id: 'analytics_viewer', name: 'Analytics Viewer', adminsCount: 8, permissionsCount: '6 Permissions (Read-Only Dashboards & Exports)', status: 'Active', updatedAt: '05 Sep 2026' },
  ])

  const [adminAccounts, setAdminAccounts] = React.useState([
    { id: 'adm1', name: 'Ahmed Al-Maktoum', email: 'ahmed@duseat.com', role: 'Super Admin', status: 'Active', lastLogin: 'Today, 10:40 AM', twoFactor: 'Enforced (TOTP)', created: '10 Jan 2025' },
    { id: 'adm2', name: 'Sarah Jenkins', email: 'sarah.j@duseat.com', role: 'Operations Admin', status: 'Active', lastLogin: 'Today, 09:15 AM', twoFactor: 'Enforced (TOTP)', created: '14 Feb 2025' },
    { id: 'adm3', name: 'Fahad Bin Mansoor', email: 'fahad.m@duseat.com', role: 'Finance Admin', status: 'Active', lastLogin: 'Yesterday, 04:30 PM', twoFactor: 'Enforced (TOTP)', created: '01 Mar 2025' },
    { id: 'adm4', name: 'Elena Rostova', email: 'elena.r@duseat.com', role: 'Marketing Admin', status: 'Active', lastLogin: '06 Sep 2026', twoFactor: 'Enforced (TOTP)', created: '20 May 2025' },
    { id: 'adm5', name: 'Marcus Vance', email: 'marcus.v@duseat.com', role: 'Moderation Admin', status: 'Suspended', lastLogin: '18 Aug 2026', twoFactor: 'Disabled', created: '11 Jun 2025' },
  ])

  // 10. Backup State
  const [backupOverview, setBackupOverview] = React.useState({
    lastBackup: '08 Sep 2026 — 03:00 AM UTC',
    nextBackup: '09 Sep 2026 — 03:00 AM UTC',
    storageProvider: 'AWS S3 Frankfurt (Encrypted AES-256)',
    totalSnapshots: 24,
    totalStorageUsed: '1.84 GB',
    retentionDays: 30,
    autoBackupEnabled: true,
    frequency: 'Daily at 03:00 AM UTC',
  })

  const [backupSnapshots, setBackupSnapshots] = React.useState([
    { id: 'BKP-20260908-0300', date: '08 Sep 2026 — 03:00 AM', type: 'Automated Snapshot', size: '184.2 MB', checksum: 'sha256:7f9a2b...', status: 'Healthy', duration: '42s' },
    { id: 'BKP-20260907-0300', date: '07 Sep 2026 — 03:00 AM', type: 'Automated Snapshot', size: '183.9 MB', checksum: 'sha256:3a8c1e...', status: 'Healthy', duration: '39s' },
    { id: 'BKP-20260906-1845', date: '06 Sep 2026 — 06:45 PM', type: 'Pre-Deployment Manual', size: '183.5 MB', checksum: 'sha256:e1b48f...', status: 'Healthy', duration: '41s' },
    { id: 'BKP-20260906-0300', date: '06 Sep 2026 — 03:00 AM', type: 'Automated Snapshot', size: '182.8 MB', checksum: 'sha256:9c02d1...', status: 'Healthy', duration: '45s' },
  ])

  // 11. Audit Log State
  const [auditLogs, setAuditLogs] = React.useState([
    { id: 'aud1', action: 'Feature Flag Updated', actor: 'Ahmed Al-Maktoum', role: 'Super Admin', setting: 'ai_property_matching rollout', prevVal: '10%', newVal: '25%', timestamp: '08 Sep 2026, 09:30 AM' },
    { id: 'aud2', action: 'Payment Gateway Configured', actor: 'Fahad Bin Mansoor', role: 'Finance Admin', setting: 'Checkout.com Webhook Endpoint', prevVal: 'https://api-staging.duseat.com/...', newVal: 'https://api.duseat.com/...', timestamp: '07 Sep 2026, 04:15 PM' },
    { id: 'aud3', action: 'Security Policy Enforced', actor: 'Ahmed Al-Maktoum', role: 'Super Admin', setting: 'Mandatory Admin 2FA', prevVal: 'Optional', newVal: 'Enforced', timestamp: '06 Sep 2026, 11:20 AM' },
    { id: 'aud4', action: 'API Key Revoked', actor: 'Ahmed Al-Maktoum', role: 'Super Admin', setting: 'Legacy Property Feed Sync key', prevVal: 'Active', newVal: 'Revoked', timestamp: '05 Sep 2026, 02:40 PM' },
    { id: 'aud5', action: 'Currency Exchange Rate Updated', actor: 'System Worker', role: 'Automated Sync', setting: 'USD/AED Rate', prevVal: '0.2722', newVal: '0.2723', timestamp: '05 Sep 2026, 08:00 AM' },
  ])

  // Helper Actions
  const handleSaveChanges = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setIsDirty(false)
      showToast('All platform settings have been safely updated and synchronized across instances.', 'success')
      // Record audit
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          action: `Settings Section Updated (${SETTINGS_NAV.find((n) => n.id === activeSection)?.label})`,
          actor: 'Current Admin',
          role: 'Super Admin',
          setting: 'Multiple fields updated',
          prevVal: 'Previous state',
          newVal: 'Synchronized live state',
          timestamp: 'Just now',
        },
        ...prev,
      ])
    }, 600)
  }

  const handleDiscardChanges = () => {
    setIsDirty(false)
    showToast('Unsaved changes have been discarded.', 'default')
  }

  const handleRunManualBackup = () => {
    setBackupProgress(15)
    showToast('Preparing manual database snapshot...', 'default')
    setTimeout(() => setBackupProgress(45), 600)
    setTimeout(() => setBackupProgress(85), 1200)
    setTimeout(() => {
      setBackupProgress(null)
      const newBackupId = `BKP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`
      setBackupSnapshots((prev) => [
        {
          id: newBackupId,
          date: 'Just now',
          type: 'Manual Admin Snapshot',
          size: '184.8 MB',
          checksum: 'sha256:4d82f0a...',
          status: 'Healthy',
          duration: '38s',
        },
        ...prev,
      ])
      showToast(`Backup ${newBackupId} created successfully! Verified & stored on S3.`, 'success')
    }, 1800)
  }

  const handleConfirmRestore = () => {
    if (restoreConfirmationText !== 'RESTORE') {
      showToast('You must type RESTORE exactly to proceed with platform data rollback.', 'error')
      return
    }
    setShowRestoreModal(false)
    setRestoreConfirmationText('')
    showToast(`Initiating safe recovery to snapshot ${selectedBackupForRestore?.id}. Background worker running...`, 'default')
    setTimeout(() => {
      showToast(`Platform data successfully restored from snapshot ${selectedBackupForRestore?.id}. Services healthy.`, 'success')
    }, 1500)
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col bg-[#fafbfc] text-[#0f172a]">
      {/* Settings Top Header Bar */}
      <div className="border-b border-[#d3d5d7] bg-white px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                System Settings & Control Center
              </h1>
              <span className="rounded-[8px] bg-[#eff1f3] px-2.5 py-0.5 text-[12px] font-semibold text-[#6f777f] border border-[#d3d5d7]">
                v2.6 Enterprise
              </span>
            </div>
            <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
              Configure platform architecture, taxonomy, integrations, security policies, maintenance mode, and backups safely.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <div className="flex items-center gap-2 rounded-[8px] border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                <span>You have unsaved changes</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={!isDirty || saving}
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[14px] font-medium text-[#1f2327] transition hover:bg-[#eff1f3] disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Discard
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={!isDirty || saving}
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-4 text-[14px] font-semibold text-white shadow-2xs transition hover:bg-[#00a8b0] disabled:opacity-40 cursor-pointer"
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save All Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings 2-Column Desktop Grid / Responsive Mobile */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
        {/* Left Settings Sidebar Navigation */}
        <aside className="w-full border-b border-[#d3d5d7] bg-white p-3 lg:w-72 lg:border-b-0 lg:border-r lg:p-4 shrink-0">
          <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-[#6f777f]">
            Configuration Modules
          </div>
          <nav className="space-y-1">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isDirty) {
                      if (confirm('You have unsaved changes in the current section. Continue to next section?')) {
                        setActiveSection(item.id)
                      }
                    } else {
                      setActiveSection(item.id)
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                      : 'text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#00c2cb]' : 'text-[#6f777f]'}`} />
                    <div className="truncate">
                      <div className="truncate font-semibold">{item.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-white/70' : 'text-[#8f969e]'}`}>{item.labelAr}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70 shrink-0" />}
                </button>
              )
            })}
          </nav>

          {/* Environmental Health Status Indicator */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-teal-600" />
                Cluster Node 01
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Healthy
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[10px] text-slate-500">
              <div className="flex justify-between">
                <span>Database Read Replica:</span>
                <span className="font-mono font-medium text-slate-700">0.8ms</span>
              </div>
              <div className="flex justify-between">
                <span>FCM Push Latency:</span>
                <span className="font-mono font-medium text-slate-700">38ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active Staff Sessions:</span>
                <span className="font-mono font-medium text-slate-700">{activeSessions.length} active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Settings Content Workspace */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* SECTION 1: GENERAL */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Platform Identity & General Configuration</h2>
                <p className="text-xs text-slate-500">Manage brand identity, contact points, timezone, and global date formatting.</p>
              </div>

              {/* Logo & Branding */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Platform Logo & Visual Asset</h3>
                <p className="text-xs text-slate-500">Displayed across admin headers, investor portals, and email templates.</p>

                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex h-20 w-44 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#00c2cb] font-extrabold text-white">
                        D
                      </div>
                      <span className="text-lg font-bold tracking-tight text-slate-800">DUSEAT</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Logo upload dialog opened. Select PNG/SVG up to 2MB.', 'default')
                          setIsDirty(true)
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Upload className="mr-1.5 inline-block h-3.5 w-3.5" />
                        Upload New Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Reset to default platform logo.', 'default')
                          setIsDirty(true)
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Recommended: Transparent SVG or PNG (minimum 512×128px, max file size 2MB).
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Information Form */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Platform Information</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Platform Public Name</label>
                    <input
                      type="text"
                      value={generalSettings.platformName}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, platformName: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Public Platform URL</label>
                    <input
                      type="text"
                      value={generalSettings.platformUrl}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, platformUrl: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Primary Support Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Support Hotline Number</label>
                    <input
                      type="text"
                      value={generalSettings.contactNumber}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, contactNumber: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Timezone & Date Formatting */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Regional & Formatting Standards</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">System Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="Asia/Dubai">Asia/Dubai (GMT+4 - Gulf Standard Time)</option>
                      <option value="Asia/Riyadh">Asia/Riyadh (GMT+3 - Arabia Standard Time)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="Europe/London">Europe/London (GMT+0 / BST)</option>
                      <option value="Europe/Berlin">Europe/Berlin (GMT+1 / CEST)</option>
                      <option value="America/New_York">America/New_York (GMT-5 / EDT)</option>
                    </select>
                    <p className="mt-1 text-[11px] text-slate-400">All audit events and deal timestamps render relative to this timezone.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Display Date Format</label>
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 08/09/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/08/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard - 2026-09-08)</option>
                    </select>
                    <div className="mt-2 flex items-center gap-2 rounded bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 border border-slate-200">
                      <span className="font-semibold text-slate-500">Live Date Preview:</span>
                      <span className="font-mono font-bold text-teal-700">
                        {generalSettings.dateFormat === 'DD/MM/YYYY' && '08/09/2026'}
                        {generalSettings.dateFormat === 'MM/DD/YYYY' && '09/08/2026'}
                        {generalSettings.dateFormat === 'YYYY-MM-DD' && '2026-09-08'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LOCALIZATION */}
          {activeSection === 'localization' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Localization & Global Markets</h2>
                <p className="text-xs text-slate-500">Manage supported languages, active operating countries, cities, and real-time exchange rates.</p>
              </div>

              {/* Languages Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Supported Languages</h3>
                    <p className="text-xs text-slate-500">Languages available in the investor app, agent portal, and public website.</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Language</th>
                        <th className="p-3">Code</th>
                        <th className="p-3">Content Coverage</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {languages.map((lang) => (
                        <tr key={lang.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-900">
                            {lang.name} {lang.isDefault && <span className="ml-1.5 rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">Default</span>}
                          </td>
                          <td className="p-3 font-mono font-medium text-slate-500">{lang.code.toUpperCase()}</td>
                          <td className="p-3 font-medium text-slate-700">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: lang.coverage }} />
                              </div>
                              <span className="text-[11px]">{lang.coverage}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <FigmaStatusBadge status={lang.status} />
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {!lang.isDefault && (
                              <button
                                type="button"
                                onClick={() => {
                                  setLanguages(languages.map((l) => ({ ...l, isDefault: l.id === lang.id })))
                                  setIsDirty(true)
                                  showToast(`${lang.name} set as primary default language.`, 'success')
                                }}
                                className="text-xs font-semibold text-teal-600 hover:underline"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (lang.isDefault) {
                                  showToast('Cannot disable the platform default language. Select another default first.', 'error')
                                  return
                                }
                                setLanguages(languages.map((l) => (l.id === lang.id ? { ...l, status: l.status === 'Active' ? 'Disabled' : 'Active' } : l)))
                                setIsDirty(true)
                              }}
                              className={`text-xs font-semibold ${lang.status === 'Active' ? 'text-amber-600 hover:underline' : 'text-emerald-600 hover:underline'}`}
                            >
                              {lang.status === 'Active' ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operating Countries & Cities */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Countries */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900">Operating Countries</h3>
                  <p className="text-xs text-slate-500 mb-3">Territories where property listings and investments are enabled.</p>
                  <div className="space-y-2">
                    {countries.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{c.name} ({c.iso})</div>
                          <div className="text-[11px] text-slate-500">Currency: {c.currency} • {c.listings.toLocaleString()} properties</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FigmaStatusBadge status={c.status} />
                          <button
                            type="button"
                            onClick={() => {
                              setCountries(countries.map((cnt) => (cnt.id === c.id ? { ...cnt, status: cnt.status === 'Active' ? 'Disabled' : 'Active' } : cnt)))
                              setIsDirty(true)
                            }}
                            className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Toggle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cities */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Supported Cities</h3>
                      <p className="text-xs text-slate-500">Cities with verified zone boundaries.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const cityName = prompt('Enter new city name:')
                        if (cityName) {
                          setCities([...cities, { id: `ct_${Date.now()}`, name: cityName, country: 'United Arab Emirates', status: 'Active', districts: 1 }])
                          setIsDirty(true)
                          showToast(`City "${cityName}" added to UAE territory.`, 'success')
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200 hover:bg-teal-100"
                    >
                      <Plus className="h-3 w-3" /> Add City
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cities.map((city) => (
                      <div key={city.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs">
                        <div className="font-bold text-slate-800">{city.name}</div>
                        <div className="text-[10px] text-slate-500">{city.country} • {city.districts} zones</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-Currency & Exchange Rates */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Currencies & Real-Time Exchange Rates</h3>
                    <p className="text-xs text-slate-500">Base Currency is AED. Rates auto-synchronize with official central bank feeds.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Live exchange rates refreshed from Central Bank API.', 'success')
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" /> Refresh Feed
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {currencies.map((curr) => (
                    <div key={curr.code} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{curr.code} ({curr.symbol})</span>
                        {curr.isBase && <span className="rounded bg-teal-100 px-1 py-0.5 text-[9px] font-bold text-teal-800">Base</span>}
                      </div>
                      <div className="mt-2 text-lg font-extrabold text-slate-900">
                        {curr.isBase ? '1.0000' : curr.rate.toFixed(4)}
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">{curr.lastUpdate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: MARKETPLACE TAXONOMY */}
          {activeSection === 'marketplace' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Marketplace Taxonomy & Structure</h2>
                <p className="text-xs text-slate-500">Configure property categories, unit configurations, amenities, and request types.</p>
              </div>

              {/* Property Types */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Property Categories</h3>
                    <p className="text-xs text-slate-500">Categories used in search filters, requests, and listings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Enter new Property Type name:')
                      if (name) {
                        setPropertyTypes([...propertyTypes, { id: `pt_${Date.now()}`, name, icon: 'Building', usageCount: 0, status: 'Active', order: propertyTypes.length + 1 }])
                        setIsDirty(true)
                        showToast(`Property type "${name}" created.`, 'success')
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-[#00c2cb] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#00a8b0]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Property Type
                  </button>
                </div>

                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {propertyTypes.map((pt) => (
                    <div key={pt.id} className="flex items-center justify-between p-3 text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-500">
                          {pt.order}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{pt.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Referenced by <span className="font-semibold text-teal-700">{pt.usageCount.toLocaleString()}</span> active listings
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FigmaStatusBadge status={pt.status} />
                        <button
                          type="button"
                          onClick={() => {
                            if (pt.usageCount > 0) {
                              alert(`Dependency Safeguard: "${pt.name}" is currently used by ${pt.usageCount.toLocaleString()} properties. Deletion is prevented to avoid orphan records. You may disable or archive it instead.`)
                              return
                            }
                            setPropertyTypes(propertyTypes.filter((p) => p.id !== pt.id))
                            setIsDirty(true)
                            showToast(`Deleted ${pt.name}`, 'default')
                          }}
                          className="text-slate-400 hover:text-rose-600"
                          title="Delete / Archive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unit Types & Amenities Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Unit Types */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900">Bedroom / Unit Configurations</h3>
                  <p className="text-xs text-slate-500 mb-3">Unit layouts for residential properties.</p>
                  <div className="space-y-2">
                    {unitTypes.map((u) => (
                      <div key={u.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                        <span className="font-bold text-slate-800">{u.name}</span>
                        <FigmaStatusBadge status={u.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900">Standard Amenities Library</h3>
                  <p className="text-xs text-slate-500 mb-3">Selectable features on property cards.</p>
                  <div className="space-y-2">
                    {amenities.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{a.name}</div>
                          <div className="text-[10px] text-slate-400">Category: {a.category}</div>
                        </div>
                        <FigmaStatusBadge status={a.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Notification Infrastructure & Delivery Services</h2>
                <p className="text-xs text-slate-500">Configure push notification providers (FCM / APNs) and transactional email SMTP servers.</p>
              </div>

              {/* Push Notification (Firebase FCM) */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Push Notification Gateway (Firebase FCM / APNs)</h3>
                      <p className="text-xs text-slate-500">Delivers real-time push alerts to iOS and Android applications.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Connected ({notificationConfig.fcmLatency})
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Firebase Project ID</label>
                    <input
                      type="text"
                      value={notificationConfig.fcmProjectId}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, fcmProjectId: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Service Account Key Status</label>
                    <div className="mt-1.5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                      <span className="font-mono text-slate-600">••••••••••••••••••••••••••••••••</span>
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Rotating FCM private keys. Upload new JSON credentials.', 'default')
                        }}
                        className="font-semibold text-teal-600 hover:underline"
                      >
                        Rotate Key
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTestingPush(true)
                      setTimeout(() => {
                        setTestingPush(false)
                        showToast('Test push notification delivered successfully to 2 admin test devices.', 'success')
                      }, 1000)
                    }}
                    disabled={testingPush}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {testingPush ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Send Test Push Alert
                  </button>
                </div>
              </div>

              {/* SMTP / Transactional Email */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Transactional Email SMTP Server</h3>
                    <p className="text-xs text-slate-500">Handles verification codes, offer approvals, deal contracts, and invoices.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">SMTP Host</label>
                    <input
                      type="text"
                      value={notificationConfig.smtpHost}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, smtpHost: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Port</label>
                    <input
                      type="number"
                      value={notificationConfig.smtpPort}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, smtpPort: parseInt(e.target.value) || 587 })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Encryption</label>
                    <select
                      value={notificationConfig.smtpEncryption}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, smtpEncryption: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value="TLS">TLS (Recommended)</option>
                      <option value="SSL">SSL</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Sender Display Name</label>
                    <input
                      type="text"
                      value={notificationConfig.fromName}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, fromName: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Sender Email (From)</label>
                    <input
                      type="email"
                      value={notificationConfig.fromEmail}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, fromEmail: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Reply-To Address</label>
                    <input
                      type="email"
                      value={notificationConfig.replyTo}
                      onChange={(e) => {
                        setNotificationConfig({ ...notificationConfig, replyTo: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-400">Password is encrypted with AES-256 and securely masked.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestingSmtp(true)
                      setTimeout(() => {
                        setTestingSmtp(false)
                        showToast(`SMTP test email delivered successfully to ${generalSettings.supportEmail}.`, 'success')
                      }, 1200)
                    }}
                    disabled={testingSmtp}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {testingSmtp ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Send Test Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">External Integrations, API Keys & Webhooks</h2>
                <p className="text-xs text-slate-500">Manage Google Maps, third-party payment gateways, developer API credentials, and webhooks.</p>
              </div>

              {/* Google Maps & Geo-Services */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Google Maps Platform & Geocoding</h3>
                      <p className="text-xs text-slate-500">Powers interactive property map views, radius calculations, and district coordinates.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">Google Maps Javascript API Key</label>
                    <input
                      type="text"
                      value={integrationsConfig.googleMapsKeyMasked}
                      disabled
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Default Map Zoom</label>
                    <input
                      type="number"
                      value={integrationsConfig.mapsDefaultZoom}
                      onChange={(e) => {
                        setIntegrationsConfig({ ...integrationsConfig, mapsDefaultZoom: parseInt(e.target.value) || 12 })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTestingMaps(true)
                      setTimeout(() => {
                        setTestingMaps(false)
                        showToast('Google Maps Geocoding & Places API verified. Latency: 22ms.', 'success')
                      }, 800)
                    }}
                    disabled={testingMaps}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {testingMaps ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                    Test Geocoding Service
                  </button>
                </div>
              </div>

              {/* Payment Gateways Config */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Payment Gateway Connections</h3>
                <p className="text-xs text-slate-500 mb-3">Gateway credentials configure checkout endpoints. Operational logs belong in Finance.</p>

                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {paymentGateways.map((gw) => (
                    <div key={gw.id} className="flex items-center justify-between p-3 text-xs hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{gw.name}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                            {gw.env}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">Webhook: {gw.webhookUrl}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FigmaStatusBadge status={gw.status} />
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Configuration modal opened for ${gw.name}.`, 'default')
                          }}
                          className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Keys Management */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Developer API Keys</h3>
                    <p className="text-xs text-slate-500">API keys grant programmatic access to platform listings and matchmaking pipelines.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newKey = `duseat_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
                      setGeneratedApiKey(newKey)
                      setShowApiKeyModal(true)
                      setApiKeys([
                        {
                          id: `k_${Date.now()}`,
                          name: 'New External Service Key',
                          prefix: `duseat_live_••••••••${newKey.slice(-4)}`,
                          createdBy: 'Current Admin',
                          createdAt: 'Today',
                          lastUsed: 'Never',
                          status: 'Active',
                          expires: '1 Year',
                        },
                        ...apiKeys,
                      ])
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00c2cb] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#00a8b0]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Generate New API Key
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Key Name</th>
                        <th className="p-3">Prefix / Mask</th>
                        <th className="p-3">Created By</th>
                        <th className="p-3">Last Used</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {apiKeys.map((key) => (
                        <tr key={key.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">{key.name}</td>
                          <td className="p-3 font-mono font-medium text-slate-600">{key.prefix}</td>
                          <td className="p-3 text-slate-500">{key.createdBy}</td>
                          <td className="p-3 text-slate-500">{key.lastUsed}</td>
                          <td className="p-3">
                            <FigmaStatusBadge status={key.status} />
                          </td>
                          <td className="p-3 text-right">
                            {key.status === 'Active' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Revoke API key "${key.name}" immediately? Any connected services will lose access.`)) {
                                    setApiKeys(apiKeys.map((k) => (k.id === key.id ? { ...k, status: 'Revoked' } : k)))
                                    showToast(`API Key "${key.name}" revoked.`, 'error')
                                  }
                                }}
                                className="text-xs font-semibold text-rose-600 hover:underline"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Webhooks Manager */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Outgoing Webhooks</h3>
                    <p className="text-xs text-slate-500">Real-time event dispatchers for external CRM and billing systems.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter Webhook Endpoint URL (HTTPS):')
                      if (url) {
                        setWebhooks([
                          {
                            id: `wh_${Date.now()}`,
                            name: 'Custom Integration Endpoint',
                            url,
                            events: ['offer.created', 'deal.closed'],
                            status: 'Active',
                            lastDelivery: 'Never',
                            successRate: '100%',
                          },
                          ...webhooks,
                        ])
                        showToast('Webhook endpoint added successfully.', 'success')
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200 hover:bg-teal-100"
                  >
                    <Plus className="h-3 w-3" /> Add Webhook
                  </button>
                </div>

                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="p-3 text-xs hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{wh.name}</div>
                          <div className="mt-0.5 font-mono text-[11px] text-teal-700">{wh.url}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Success Rate: <strong className="text-emerald-700">{wh.successRate}</strong></span>
                          <FigmaStatusBadge status={wh.status} />
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Events:</span>
                        {wh.events.map((ev) => (
                          <span key={ev} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Security Policies & Admin Access Control</h2>
                <p className="text-xs text-slate-500">Enforce enterprise password complexity, two-factor authentication, session timeouts, and active logins.</p>
              </div>

              {/* Password Complexity Policy */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Staff Password Policy</h3>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    High Security Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Minimum Character Length</label>
                    <select
                      value={securityConfig.minPasswordLength}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, minPasswordLength: parseInt(e.target.value) })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value={8}>8 Characters</option>
                      <option value={10}>10 Characters (Recommended)</option>
                      <option value={12}>12 Characters (Strict)</option>
                      <option value={16}>16 Characters (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Password Expiration</label>
                    <select
                      value={securityConfig.passwordExpirationDays}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, passwordExpirationDays: parseInt(e.target.value) })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value={30}>Every 30 Days</option>
                      <option value={60}>Every 60 Days</option>
                      <option value={90}>Every 90 Days</option>
                      <option value={180}>Every 180 Days</option>
                      <option value={0}>Never Expire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Prevent Password Reuse</label>
                    <select
                      value={securityConfig.passwordHistoryCount}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, passwordHistoryCount: parseInt(e.target.value) })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value={3}>Last 3 Passwords</option>
                      <option value={5}>Last 5 Passwords</option>
                      <option value={10}>Last 10 Passwords</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireUppercase}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, requireUppercase: e.target.checked })
                        setIsDirty(true)
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    Require Uppercase (A-Z)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireLowercase}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, requireLowercase: e.target.checked })
                        setIsDirty(true)
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    Require Lowercase (a-z)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireNumber}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, requireNumber: e.target.checked })
                        setIsDirty(true)
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    Require Numbers (0-9)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireSpecialChar}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, requireSpecialChar: e.target.checked })
                        setIsDirty(true)
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    Require Symbols (!@#$)
                  </label>
                </div>
              </div>

              {/* 2FA & Session Policies */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 2FA Requirement */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                    <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">MANDATORY</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Require all administrators, finance managers, and support agents to authenticate via TOTP (Google Authenticator / 1Password).
                  </p>
                  <div className="flex items-center justify-between rounded-lg border border-teal-100 bg-teal-50/60 p-3">
                    <div>
                      <div className="text-xs font-bold text-teal-900">Enforce 2FA for all Staff</div>
                      <div className="text-[11px] text-teal-700">Admins without 2FA will be forced to setup upon next sign-in.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityConfig.twoFactorMandatoryAdmins}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, twoFactorMandatoryAdmins: e.target.checked })
                        setIsDirty(true)
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Session Inactivity Timeout */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Session Inactivity Timeout</h3>
                  <p className="text-xs text-slate-500">
                    Automatically logs out idle admin sessions to protect confidential deal and investor records.
                  </p>
                  <div>
                    <select
                      value={securityConfig.sessionTimeoutMinutes}
                      onChange={(e) => {
                        setSecurityConfig({ ...securityConfig, sessionTimeoutMinutes: parseInt(e.target.value) })
                        setIsDirty(true)
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value={15}>15 Minutes (High Security Banking Standard)</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>1 Hour (Recommended)</option>
                      <option value={240}>4 Hours</option>
                      <option value={480}>8 Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Admin Sessions */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Active Admin Sessions & Devices</h3>
                    <p className="text-xs text-slate-500">Currently authenticated staff sessions across web browsers and mobile apps.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Revoke all other active sessions? You will stay logged in on this current browser.')) {
                        setActiveSessions(activeSessions.filter((s) => s.isCurrent))
                        showToast('All other admin sessions have been terminated.', 'success')
                      }
                    }}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Revoke All Other Sessions
                  </button>
                </div>

                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 text-xs hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{session.device}</span>
                          {session.isCurrent && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {session.browser} • {session.location} (IP: {session.ip})
                        </div>
                        <div className="text-[10px] text-slate-400">Last active: {session.lastActive}</div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSessions(activeSessions.filter((s) => s.id !== session.id))
                            showToast('Session terminated.', 'default')
                          }}
                          className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: FEATURE FLAGS */}
          {activeSection === 'feature_flags' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Feature Flags & Gradual Traffic Rollout</h2>
                <p className="text-xs text-slate-500">Control progressive rollout of new platform capabilities safely without redeploying code.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Feature Name</th>
                        <th className="p-3">Key</th>
                        <th className="p-3">Rollout %</th>
                        <th className="p-3">Audience Target</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {featureFlags.map((flag) => (
                        <tr key={flag.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{flag.name}</div>
                            <div className="text-[10px] text-slate-400">Updated by {flag.updatedBy} ({flag.updatedAt})</div>
                          </td>
                          <td className="p-3 font-mono font-medium text-slate-600">{flag.key}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${flag.status === 'Disabled' ? 'bg-slate-300' : 'bg-[#00c2cb]'}`}
                                  style={{ width: `${flag.rolloutPct}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-900">{flag.rolloutPct}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">{flag.audience}</td>
                          <td className="p-3">
                            <FigmaStatusBadge status={flag.status} />
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newPct = prompt(`Set traffic rollout percentage for "${flag.name}" (0 - 100):`, flag.rolloutPct.toString())
                                if (newPct !== null) {
                                  const parsed = Math.min(100, Math.max(0, parseInt(newPct) || 0))
                                  setFeatureFlags(
                                    featureFlags.map((f) =>
                                      f.id === flag.id
                                        ? {
                                            ...f,
                                            rolloutPct: parsed,
                                            status: parsed === 0 ? 'Disabled' : parsed === 100 ? 'Enabled' : 'Beta',
                                            updatedAt: 'Just now',
                                          }
                                        : f
                                    )
                                  )
                                  setIsDirty(true)
                                  showToast(`Rollout for "${flag.name}" updated to ${parsed}%.`, 'success')
                                }
                              }}
                              className="text-xs font-semibold text-teal-600 hover:underline"
                            >
                              Edit Rollout
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: MAINTENANCE */}
          {activeSection === 'maintenance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Maintenance Mode & Scheduled Downtime</h2>
                <p className="text-xs text-slate-500">Temporarily suspend public traffic or schedule planned database maintenance windows.</p>
              </div>

              {/* Live Maintenance Master Toggle */}
              <div className={`rounded-xl border p-5 shadow-2xs transition ${maintenanceConfig.isEnabled ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-white'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Platform Maintenance Mode</h3>
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${maintenanceConfig.isEnabled ? 'bg-amber-200 text-amber-900 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                        {maintenanceConfig.isEnabled ? 'ACTIVE (PLATFORM LOCKED)' : 'OFFLINE (NORMAL OPERATIONS)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      When enabled, non-admin visitors will be shown the custom maintenance splash screen.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!maintenanceConfig.isEnabled) {
                        if (confirm('ENABLE MAINTENANCE MODE? All public users on Website & Mobile Apps will be blocked from accessing deals.')) {
                          setMaintenanceConfig({ ...maintenanceConfig, isEnabled: true })
                          setIsDirty(true)
                          showToast('Maintenance Mode is now ENABLED.', 'error')
                        }
                      } else {
                        setMaintenanceConfig({ ...maintenanceConfig, isEnabled: false })
                        setIsDirty(true)
                        showToast('Maintenance Mode disabled. Platform returned to normal operations.', 'success')
                      }
                    }}
                    className={`rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs transition ${
                      maintenanceConfig.isEnabled ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {maintenanceConfig.isEnabled ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                  </button>
                </div>
              </div>

              {/* Maintenance Splash Screen Editor */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Maintenance Splash Page Configuration</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Affected Platforms</label>
                    <select
                      value={maintenanceConfig.affectedPlatforms}
                      onChange={(e) => {
                        setMaintenanceConfig({ ...maintenanceConfig, affectedPlatforms: e.target.value as any })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value="All">All Platforms (Web + iOS + Android)</option>
                      <option value="Website">Website Only</option>
                      <option value="Mobile App">Mobile Apps Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Estimated Duration Label</label>
                    <input
                      type="text"
                      value={maintenanceConfig.estimatedDuration}
                      onChange={(e) => {
                        setMaintenanceConfig({ ...maintenanceConfig, estimatedDuration: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">Maintenance Title</label>
                    <input
                      type="text"
                      value={maintenanceConfig.title}
                      onChange={(e) => {
                        setMaintenanceConfig({ ...maintenanceConfig, title: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">Public Explanation Message</label>
                    <textarea
                      rows={3}
                      value={maintenanceConfig.message}
                      onChange={(e) => {
                        setMaintenanceConfig({ ...maintenanceConfig, message: e.target.value })
                        setIsDirty(true)
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Live Preview Simulator */}
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Live Maintenance Screen Preview
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 text-center max-w-md mx-auto shadow-xs">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 border border-teal-200">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{maintenanceConfig.title}</h4>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{maintenanceConfig.message}</p>
                    <div className="mt-4 inline-block rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Estimated Duration: {maintenanceConfig.estimatedDuration}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: ADMINISTRATION */}
          {activeSection === 'administration' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Administration Roles, Permissions & Accounts</h2>
                <p className="text-xs text-slate-500">Manage internal staff roles, granular permission matrices, and authorized administrator credentials.</p>
              </div>

              {/* Roles Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Administrative Roles</h3>
                    <p className="text-xs text-slate-500">Predefined role levels governing access across all 14 Duseat modules.</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Role Name</th>
                        <th className="p-3">Assigned Staff</th>
                        <th className="p-3">Granted Permissions</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {roles.map((role) => (
                        <tr key={role.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{role.name}</td>
                          <td className="p-3 text-slate-600 font-semibold">{role.adminsCount} Administrators</td>
                          <td className="p-3 text-slate-600">{role.permissionsCount}</td>
                          <td className="p-3">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              {role.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`Permission matrix viewer opened for ${role.name}.`, 'default')
                              }}
                              className="text-xs font-semibold text-teal-600 hover:underline"
                            >
                              View Matrix
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Accounts */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Administrator Accounts</h3>
                    <p className="text-xs text-slate-500">Staff accounts authorized to access this administration console.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const email = prompt('Enter new administrator email address:')
                      if (email) {
                        setAdminAccounts([
                          {
                            id: `adm_${Date.now()}`,
                            name: email.split('@')[0],
                            email,
                            role: 'Operations Admin',
                            status: 'Invited',
                            lastLogin: 'Never',
                            twoFactor: 'Pending Setup',
                            created: 'Today',
                          },
                          ...adminAccounts,
                        ])
                        showToast(`Invitation sent to ${email}.`, 'success')
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00c2cb] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#00a8b0]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Invite Administrator
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Admin</th>
                        <th className="p-3">Assigned Role</th>
                        <th className="p-3">2FA Security</th>
                        <th className="p-3">Last Active</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminAccounts.map((admin) => (
                        <tr key={admin.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{admin.name}</div>
                            <div className="text-[11px] text-slate-400">{admin.email}</div>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">{admin.role}</td>
                          <td className="p-3 text-slate-600">
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <ShieldCheck className="h-3 w-3 text-teal-600" />
                              {admin.twoFactor}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{admin.lastLogin}</td>
                          <td className="p-3">
                            <FigmaStatusBadge status={admin.status} />
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newRole = prompt(`Change role for ${admin.name} (Super Admin, Finance Admin, Operations Admin, Marketing Admin):`, admin.role)
                                if (newRole) {
                                  setAdminAccounts(adminAccounts.map((a) => (a.id === admin.id ? { ...a, role: newRole } : a)))
                                  showToast(`Role updated for ${admin.name}.`, 'success')
                                }
                              }}
                              className="text-xs font-semibold text-teal-600 hover:underline"
                            >
                              Edit
                            </button>
                            {admin.status !== 'Suspended' && admin.role !== 'Super Admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Suspend admin access for ${admin.name}?`)) {
                                    setAdminAccounts(adminAccounts.map((a) => (a.id === admin.id ? { ...a, status: 'Suspended' } : a)))
                                    showToast(`${admin.name} suspended.`, 'error')
                                  }
                                }}
                                className="text-xs font-semibold text-rose-600 hover:underline"
                              >
                                Suspend
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: BACKUP & RECOVERY */}
          {activeSection === 'backup' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Platform Backup, Snapshots & Disaster Recovery</h2>
                <p className="text-xs text-slate-500">Automated daily database snapshots, retention rules, and verified point-in-time recovery.</p>
              </div>

              {/* Backup Overview KPIs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500">Last Successful Snapshot</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{backupOverview.lastBackup}</div>
                  <div className="mt-1 text-[10px] text-emerald-600 font-semibold">Status: Verified Healthy</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500">Next Automated Backup</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{backupOverview.nextBackup}</div>
                  <div className="mt-1 text-[10px] text-slate-400">Cron: Every day at 03:00 UTC</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500">Storage Destination</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">AWS S3 (Frankfurt)</div>
                  <div className="mt-1 text-[10px] text-slate-400">Encrypted AES-256 GCM</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500">Total Backup Storage</div>
                  <div className="mt-1 text-sm font-extrabold text-teal-700">{backupOverview.totalStorageUsed}</div>
                  <div className="mt-1 text-[10px] text-slate-400">{backupOverview.totalSnapshots} snapshots (30d retention)</div>
                </div>
              </div>

              {/* Manual Backup Generator */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Create Immediate Manual Snapshot</h3>
                    <p className="text-xs text-slate-500">Generates an instant complete backup of the database, media references, and user records.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunManualBackup}
                    disabled={backupProgress !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00c2cb] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#00a8b0] disabled:opacity-50"
                  >
                    {backupProgress !== null ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                    Create Manual Backup Now
                  </button>
                </div>

                {backupProgress !== null && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Generating Encrypted Snapshot...</span>
                      <span>{backupProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-teal-500 transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Backup Snapshots History Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Available Snapshots & Recovery Points</h3>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Snapshot ID</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Recovery Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {backupSnapshots.map((bkp) => (
                        <tr key={bkp.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900">{bkp.id}</td>
                          <td className="p-3 text-slate-600">{bkp.date}</td>
                          <td className="p-3 text-slate-600">{bkp.type}</td>
                          <td className="p-3 font-mono text-slate-600">{bkp.size}</td>
                          <td className="p-3">
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              {bkp.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`Downloading encrypted archive ${bkp.id}.tar.gz.enc`, 'default')
                              }}
                              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                            >
                              Download
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBackupForRestore(bkp)
                                setRestoreConfirmationText('')
                                setShowRestoreModal(true)
                              }}
                              className="text-xs font-bold text-rose-600 hover:underline"
                            >
                              Restore Point
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 11: AUDIT TRAIL */}
          {activeSection === 'audit_log' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Settings & Configuration Audit Trail</h2>
                <p className="text-xs text-slate-500">Immutable, chronological log recording all modifications made to platform configurations.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Action</th>
                        <th className="p-3">Actor / Role</th>
                        <th className="p-3">Setting Field</th>
                        <th className="p-3">Previous Value</th>
                        <th className="p-3">New Value</th>
                        <th className="p-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{log.action}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{log.actor}</div>
                            <div className="text-[10px] text-slate-400">{log.role}</div>
                          </td>
                          <td className="p-3 font-mono text-slate-600">{log.setting}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500 line-through">{log.prevVal}</td>
                          <td className="p-3 font-mono text-[11px] font-bold text-teal-700">{log.newVal}</td>
                          <td className="p-3 text-right text-slate-400 text-[11px]">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: Show Newly Generated API Key Once */}
      {showApiKeyModal && generatedApiKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-emerald-600">
              <Key className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">API Key Generated Successfully</h3>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Please copy and save this secret key now. For security reasons, you will <strong>never be able to view it again</strong>.
            </p>

            <div className="mt-4 rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400 break-all select-all flex items-center justify-between">
              <span>{generatedApiKey}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedApiKey)
                  showToast('API Key copied to clipboard!', 'success')
                }}
                className="ml-2 rounded bg-slate-800 p-1.5 text-white hover:bg-slate-700"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="rounded-lg bg-[#00c2cb] px-4 py-2 text-xs font-bold text-white hover:bg-[#00a8b0]"
              >
                I Have Saved My API Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: High-Risk Restore Backup Confirmation Dialog */}
      {showRestoreModal && selectedBackupForRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-2.5 text-rose-600">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900">HIGH-RISK: Restore Platform Snapshot</h3>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              You are about to restore the platform state to snapshot <strong>{selectedBackupForRestore.id}</strong> recorded on <strong>{selectedBackupForRestore.date}</strong>.
            </p>

            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 space-y-1">
              <div className="font-bold">⚠️ Irreversible Rollback Notice:</div>
              <div>• Any deals, offers, or payments processed after this snapshot may be rolled back.</div>
              <div>• Platform services will temporarily enter Maintenance Mode for ~3 minutes.</div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Type <strong>RESTORE</strong> in capital letters to confirm:
              </label>
              <input
                type="text"
                placeholder="RESTORE"
                value={restoreConfirmationText}
                onChange={(e) => setRestoreConfirmationText(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono font-bold uppercase text-slate-900 focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRestoreModal(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                disabled={restoreConfirmationText !== 'RESTORE'}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-40"
              >
                Execute Safe Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
