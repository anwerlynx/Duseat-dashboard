'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Layout,
  Globe,
  Smartphone,
  Sparkles,
  HelpCircle,
  Search as SearchIcon,
  Image as ImageIcon,
  History,
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  ArrowUpRight,
  Download,
  Upload,
  RefreshCw,
  Layers,
  SlidersHorizontal,
  ExternalLink,
  Shield,
  Smartphone as PhoneIcon,
  Monitor,
  Share2,
  Calendar,
  Languages,
  Video,
  BookOpen,
  Tag,
  Link2,
  MoveUp,
  MoveDown,
  AlertOctagon,
  Sparkle,
  Flame,
  Zap,
  CheckCheck,
  Maximize2,
  Settings,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { MainButton } from '@/components/ui/main-button'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { MetricCard } from '@/components/ui/metric-card'

import { Pagination, ScrollableTabsBar } from '@/components/ui'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { cn, exportToCsv } from '@/lib/utils'

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export type CmsSectionTab =
  | 'overview'
  | 'website'
  | 'mobile'
  | 'marketing'
  | 'help-center'
  | 'seo'
  | 'media'
  | 'history'

export type CmsContentStatus =
  | 'Draft'
  | 'In Review'
  | 'Scheduled'
  | 'Published'
  | 'Unpublished'
  | 'Archived'

export type CmsLanguage = 'EN' | 'AR' | 'Both'

export type ContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'button'
  | 'banner'
  | 'card'
  | 'faq'
  | 'quote'
  | 'divider'

export interface CmsContentBlock {
  id: string
  type: ContentBlockType
  title?: string
  content?: string
  url?: string
  buttonText?: string
  buttonLink?: string
  caption?: string
  level?: 'h1' | 'h2' | 'h3'
}

export interface CmsPageItem {
  id: string
  title: string
  titleAr?: string
  slug: string
  status: CmsContentStatus
  language: CmsLanguage
  translationStatus: 'Translated' | 'Needs Translation' | 'In Review'
  version: number
  lastUpdated: string
  updatedBy: string
  publishedDate: string
  description: string
  blocks: CmsContentBlock[]
  seo: {
    metaTitle: string
    metaDescription: string
    canonicalUrl: string
    ogImage?: string
    robots: 'index, follow' | 'noindex, nofollow'
  }
  schedule?: {
    publishDate: string
    publishTime: string
    unpublishDate?: string
    timezone: string
  }
}

export interface CmsMobileScreen {
  id: string
  type: 'splash' | 'welcome' | 'empty' | 'maintenance'
  title: string
  description?: string
  platform: 'iOS' | 'Android' | 'All'
  status: CmsContentStatus
  imageUrl?: string
  ctaText?: string
  ctaAction?: string
  order?: number
  lastUpdated: string
}

export interface CmsBannerItem {
  id: string
  name: string
  title: string
  subtitle?: string
  imageUrl: string
  ctaText: string
  ctaDestination: string
  priority: number
  audience: 'All Users' | 'Investors' | 'Agents' | 'UAE' | 'Saudi Arabia' | 'Premium Only'
  status: CmsContentStatus
  startDate: string
  endDate: string
  lastUpdated: string
}

export interface CmsFaqItem {
  id: string
  question: string
  questionAr?: string
  answer: string
  answerAr?: string
  category: 'Getting Started' | 'Investing' | 'Requests' | 'Offers' | 'Deals' | 'Subscriptions' | 'Payments' | 'Account'
  tags: string[]
  isFeatured: boolean
  status: CmsContentStatus
  order: number
}

export interface CmsMediaAsset {
  id: string
  name: string
  fileType: 'image' | 'video' | 'document' | 'icon'
  url: string
  size: string
  dimensions?: string
  uploadedBy: string
  uploadDate: string
  usedIn: string[]
}

export interface CmsRedirectItem {
  id: string
  fromPath: string
  toPath: string
  type: '301' | '302'
  status: 'Active' | 'Disabled'
  createdBy: string
  createdDate: string
}

export interface CmsAuditItem {
  id: string
  contentTitle: string
  contentType: string
  action: 'Created' | 'Updated' | 'Published' | 'Unpublished' | 'Scheduled' | 'Archived' | 'Restored'
  actor: string
  date: string
  time: string
  details: string
}

// ==========================================
// INITIAL SEED DATA
// ==========================================

export const INITIAL_PAGES: CmsPageItem[] = [
  {
    id: 'PAGE-001',
    title: 'Homepage Landing Experience',
    titleAr: 'الصفحة الرئيسية للمنصة',
    slug: '/',
    status: 'Published',
    language: 'Both',
    translationStatus: 'Translated',
    version: 5,
    lastUpdated: 'Today, 10:15 AM',
    updatedBy: 'Sarah Jenkins (Content Lead)',
    publishedDate: '01 Sep 2026',
    description: 'Main public landing page showcasing prime Dubai properties, AI investor matchmaking, and agent verified network.',
    blocks: [
      { id: 'b1', type: 'heading', level: 'h1', title: 'The Modern Capital Gateway for UAE Real Estate' },
      { id: 'b2', type: 'paragraph', content: 'Connect high-intent global investors with verified licensed brokerages in Dubai, Abu Dhabi, and Riyadh.' },
      { id: 'b3', type: 'button', buttonText: 'Explore Verified Requests', buttonLink: '/requests' },
      { id: 'b4', type: 'banner', title: 'Q3 Prime Off-Plan Investment Showcase', caption: 'Exclusive developer pre-allocations.' },
      { id: 'b5', type: 'faq', title: 'How does Duseat escrow and verification work?' },
    ],
    seo: {
      metaTitle: 'Duseat | UAE Real Estate Capital & Verified Brokerage Platform',
      metaDescription: 'Discover prime off-plan and luxury secondary real estate in Dubai. Direct matchmaking between verified investors and top-tier agents.',
      canonicalUrl: 'https://duseat.ae/',
      ogImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
      robots: 'index, follow',
    },
  },
  {
    id: 'PAGE-002',
    title: 'About Us & Corporate Governance',
    titleAr: 'من نحن والحوكمة المؤسسية',
    slug: '/about',
    status: 'Published',
    language: 'Both',
    translationStatus: 'Translated',
    version: 3,
    lastUpdated: '04 Sep 2026',
    updatedBy: 'Tariq Al-Mansoor (Super Admin)',
    publishedDate: '15 Aug 2026',
    description: 'Corporate mission, leadership bios, regulatory licensing with RERA, and platform trust metrics.',
    blocks: [
      { id: 'b1', type: 'heading', level: 'h1', title: 'Empowering Transparent Property Transactions' },
      { id: 'b2', type: 'paragraph', content: 'Founded in Dubai to replace opaque listing portals with high-precision demand-matching.' },
      { id: 'b3', type: 'quote', title: 'Building the standard for MENA institutional and private real estate transactions.' },
    ],
    seo: {
      metaTitle: 'About Duseat | UAE Real Estate Marketplace Innovation',
      metaDescription: 'Learn about Duseat governance, RERA accredited brokerage standards, and tech-enabled matching infrastructure.',
      canonicalUrl: 'https://duseat.ae/about',
      robots: 'index, follow',
    },
  },
  {
    id: 'PAGE-003',
    title: 'Terms of Service & Brokerage Agreement',
    titleAr: 'الشروط والأحكام واتفاقية الوساطة',
    slug: '/terms',
    status: 'Published',
    language: 'Both',
    translationStatus: 'Translated',
    version: 8,
    lastUpdated: '01 Sep 2026',
    updatedBy: 'Legal Compliance Officer',
    publishedDate: '01 Sep 2026',
    description: 'Binding platform terms, fee disclosures, escrow guarantees, and dispute resolution mechanisms.',
    blocks: [
      { id: 'b1', type: 'heading', level: 'h2', title: '1. User Eligibility and Verification Obligations' },
      { id: 'b2', type: 'paragraph', content: 'All agents must maintain active RERA licensure. Investors must complete standard KYC.' },
    ],
    seo: {
      metaTitle: 'Terms & Conditions | Duseat Platform Rules',
      metaDescription: 'Read the platform terms, user rules, fee structures, and legal agreements governing Duseat.',
      canonicalUrl: 'https://duseat.ae/terms',
      robots: 'index, follow',
    },
  },
  {
    id: 'PAGE-004',
    title: 'Privacy Policy & Data Security',
    titleAr: 'سياسة الخصوصية وأمن البيانات',
    slug: '/privacy',
    status: 'Published',
    language: 'Both',
    translationStatus: 'Translated',
    version: 4,
    lastUpdated: '28 Aug 2026',
    updatedBy: 'Legal Compliance Officer',
    publishedDate: '01 Sep 2026',
    description: 'UAE Federal Decree-Law No. 45 on Personal Data Protection (PDPL) compliance notice.',
    blocks: [
      { id: 'b1', type: 'heading', level: 'h2', title: 'Data Encryption & Secure Storage' },
      { id: 'b2', type: 'paragraph', content: 'All user data and passport identification files are stored with AES-256 encryption within UAE data centers.' },
    ],
    seo: {
      metaTitle: 'Privacy Policy | Duseat Data Protection & UAE PDPL',
      metaDescription: 'Learn how Duseat protects client information, passports, financial transactions, and encryption protocols.',
      canonicalUrl: 'https://duseat.ae/privacy',
      robots: 'index, follow',
    },
  },
  {
    id: 'PAGE-005',
    title: 'Autumn 2026 Ultra-Luxury Campaign',
    titleAr: 'حملة عقارات النخبة لخريف 2026',
    slug: '/campaigns/autumn-luxury-2026',
    status: 'Scheduled',
    language: 'EN',
    translationStatus: 'Needs Translation',
    version: 1,
    lastUpdated: 'Yesterday, 06:20 PM',
    updatedBy: 'Elena Rostova (Growth Lead)',
    publishedDate: 'Pending Schedule',
    description: 'Promotional landing page for Palm Jumeirah & Dubai Hills high-ticket villas.',
    schedule: {
      publishDate: '15 Sep 2026',
      publishTime: '08:00 AM',
      timezone: 'GST (UTC+4)',
    },
    blocks: [
      { id: 'b1', type: 'heading', level: 'h1', title: 'Exclusive Palm Jumeirah Mansions & Penthouses' },
      { id: 'b2', type: 'paragraph', content: 'Private portfolio properties starting from AED 45M.' },
      { id: 'b3', type: 'button', buttonText: 'Request VIP Private Dossier', buttonLink: '/requests/new' },
    ],
    seo: {
      metaTitle: 'Exclusive Palm Mansions | Autumn 2026 Collection',
      metaDescription: 'Private access to waterfront luxury villas in Dubai. Off-market allocations for qualified family offices.',
      canonicalUrl: 'https://duseat.ae/campaigns/autumn-luxury-2026',
      robots: 'index, follow',
    },
  },
]

export const INITIAL_MOBILE_SCREENS: CmsMobileScreen[] = [
  {
    id: 'MOB-001',
    type: 'splash',
    title: 'Default Brand Launch Splash',
    platform: 'All',
    status: 'Published',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    lastUpdated: '10 Aug 2026',
  },
  {
    id: 'MOB-002',
    type: 'welcome',
    title: 'Onboarding 1: Precision Property Matching',
    description: 'Tell us your budget and dream area. Our AI matches you directly with top licensed brokers.',
    platform: 'All',
    status: 'Published',
    ctaText: 'Next Step',
    order: 1,
    lastUpdated: '15 Aug 2026',
  },
  {
    id: 'MOB-003',
    type: 'welcome',
    title: 'Onboarding 2: Verified Escrow & Fast Closing',
    description: 'Track offers, inspect legal documents, and close transactions securely within the app.',
    platform: 'All',
    status: 'Published',
    ctaText: 'Get Started',
    order: 2,
    lastUpdated: '15 Aug 2026',
  },
  {
    id: 'MOB-004',
    type: 'empty',
    title: 'No Active Property Requests',
    description: 'You haven\'t posted any requirements yet. Create your first request to receive verified agent offers.',
    platform: 'All',
    status: 'Published',
    ctaText: '+ Create Property Request',
    ctaAction: 'navigate:create_request',
    lastUpdated: '20 Aug 2026',
  },
  {
    id: 'MOB-005',
    type: 'maintenance',
    title: 'Scheduled System Performance Upgrade',
    description: 'Duseat services are undergoing routine maintenance to optimize transaction speed. We will be back online at 04:00 AM GST.',
    platform: 'All',
    status: 'Draft',
    lastUpdated: '02 Sep 2026',
  },
]

export const INITIAL_MARKETING_BANNERS: CmsBannerItem[] = [
  {
    id: 'BAN-001',
    name: 'Home Hero — Palm Jumeirah Ultra Villas',
    title: 'Exclusive Off-Plan Villas on Palm Jumeirah',
    subtitle: 'Starting from AED 28,000,000 with private beach access and 50/50 payment plans.',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    ctaText: 'View Property Details',
    ctaDestination: '/properties/PR-1048',
    priority: 1,
    audience: 'Investors',
    status: 'Published',
    startDate: '01 Sep 2026',
    endDate: '30 Sep 2026',
    lastUpdated: '2 days ago',
  },
  {
    id: 'BAN-002',
    name: 'Agent Upgrade — Power Agent Tier 20% Off',
    title: 'Accelerate Deal Volume with Power Agent',
    subtitle: 'Get unlimited offer submissions, priority investor matchmaking, and VIP verified badge.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    ctaText: 'Upgrade Subscription',
    ctaDestination: '/subscriptions',
    priority: 2,
    audience: 'Agents',
    status: 'Published',
    startDate: '05 Sep 2026',
    endDate: '20 Sep 2026',
    lastUpdated: '1 day ago',
  },
  {
    id: 'BAN-003',
    name: 'Saudi Investors — Riyadh & Jeddah Push',
    title: 'High-Yield Dubai Commercial Real Estate',
    subtitle: 'Zero income tax, 8.4% average rental yield, fully managed tenancies.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    ctaText: 'Explore Commercial Offers',
    ctaDestination: '/requests',
    priority: 3,
    audience: 'Saudi Arabia',
    status: 'Scheduled',
    startDate: '12 Sep 2026',
    endDate: '31 Oct 2026',
    lastUpdated: '3 hours ago',
  },
]

export const INITIAL_FAQS: CmsFaqItem[] = [
  {
    id: 'FAQ-001',
    question: 'How does Duseat verify real estate agents and brokerages?',
    questionAr: 'كيف تقوم منصة دوسيت بالتحقق من وكلاء وشركات العقارات؟',
    answer: 'All registered agents must submit an active RERA license, Trade License, Emirates ID, and broker card. Our compliance team verifies records directly against Dubai Land Department databases within 24 hours.',
    answerAr: 'يجب على جميع الوكلاء المسجلين تقديم رخصة ريرا سارية، ورخصة تجارية، وبطاقة وسيط معتمدة. يقوم فريق الامتثال بفحص السجلات ومطابقتها مع دائرة الأراضي والأملاك.',
    category: 'Getting Started',
    tags: ['Verification', 'RERA', 'Agents'],
    isFeatured: true,
    status: 'Published',
    order: 1,
  },
  {
    id: 'FAQ-002',
    question: 'Are investor funds held in certified escrow accounts?',
    questionAr: 'هل يتم الاحتفاظ بأموال المستثمرين في حسابات ضمان معتمدة؟',
    answer: 'Yes. All down payments and transaction deposits are processed through certified UAE escrow banking accounts adhering strictly to DLD and Central Bank regulations.',
    answerAr: 'نعم، تتم معالجة جميع الدفعات المقدمة وعربون الصفقات عبر حسابات ضمان بنكية رسمية ومعتمدة في دولة الإمارات.',
    category: 'Deals',
    tags: ['Escrow', 'Security', 'Finance'],
    isFeatured: true,
    status: 'Published',
    order: 2,
  },
  {
    id: 'FAQ-003',
    question: 'How do agents upgrade their subscription plan to Power Agent?',
    questionAr: 'كيف يمكن للوكيل ترقية باقة اشتراكه إلى باقة Power Agent؟',
    answer: 'Agents can navigate to their Billing & Subscriptions portal, select Power Agent, and pay instantly via Corporate Card or Apple Pay. Upgrades are activated immediately with zero downtime.',
    answerAr: 'يمكن للوكيل الانتقال لصفحة الاشتراكات، واختيار باقة Power Agent والدفع فوراً ببطاقة الشركة أو Apple Pay.',
    category: 'Subscriptions',
    tags: ['Plans', 'Billing', 'Power Agent'],
    isFeatured: false,
    status: 'Published',
    order: 3,
  },
]

export const INITIAL_MEDIA_ASSETS: CmsMediaAsset[] = [
  {
    id: 'MED-101',
    name: 'hero_palm_mansion_q3.jpg',
    fileType: 'image',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    size: '2.4 MB',
    dimensions: '3840 × 2160',
    uploadedBy: 'Elena Rostova',
    uploadDate: '01 Sep 2026',
    usedIn: ['Homepage Hero', 'Autumn 2026 Campaign', 'Banner: Palm Jumeirah'],
  },
  {
    id: 'MED-102',
    name: 'duseat_brand_identity_logo.svg',
    fileType: 'icon',
    url: '/duseat-logo.svg',
    size: '48 KB',
    dimensions: 'Vector SVG',
    uploadedBy: 'Tariq Al-Mansoor',
    uploadDate: '15 Aug 2026',
    usedIn: ['Website Header', 'Mobile Splash', 'Email Templates'],
  },
  {
    id: 'MED-103',
    name: 'rera_compliance_guidelines_2026.pdf',
    fileType: 'document',
    url: '/docs/rera_guidelines.pdf',
    size: '1.8 MB',
    uploadedBy: 'Legal Compliance Officer',
    uploadDate: '20 Aug 2026',
    usedIn: ['Help Center Guide: RERA Standards'],
  },
  {
    id: 'MED-104',
    name: 'agent_onboarding_tutorial.mp4',
    fileType: 'video',
    url: '/videos/agent_tutorial.mp4',
    size: '48.2 MB',
    dimensions: '1920 × 1080 (HD)',
    uploadedBy: 'Sarah Jenkins',
    uploadDate: '28 Aug 2026',
    usedIn: ['Help Center Tutorial: Making First Offer'],
  },
]

export const INITIAL_REDIRECTS: CmsRedirectItem[] = [
  {
    id: 'RED-001',
    fromPath: '/old-investor-portal',
    toPath: '/requests',
    type: '301',
    status: 'Active',
    createdBy: 'SEO Specialist',
    createdDate: '15 Aug 2026',
  },
  {
    id: 'RED-002',
    fromPath: '/villas-dubai-marina',
    toPath: '/properties?area=Dubai+Marina',
    type: '301',
    status: 'Active',
    createdBy: 'SEO Specialist',
    createdDate: '20 Aug 2026',
  },
]

export const INITIAL_AUDIT_LOGS: CmsAuditItem[] = [
  {
    id: 'AUD-CMS-01',
    contentTitle: 'Homepage Landing Experience',
    contentType: 'Website Page',
    action: 'Published',
    actor: 'Sarah Jenkins',
    date: '08 Sep 2026',
    time: '10:15 AM',
    details: 'Version 5 published to live production servers with updated hero banner.',
  },
  {
    id: 'AUD-CMS-02',
    contentTitle: 'Autumn 2026 Ultra-Luxury Campaign',
    contentType: 'Website Page',
    action: 'Scheduled',
    actor: 'Elena Rostova',
    date: '07 Sep 2026',
    time: '06:20 PM',
    details: 'Automated launch scheduled for 15 Sep 2026 at 08:00 AM GST.',
  },
  {
    id: 'AUD-CMS-03',
    contentTitle: 'hero_palm_mansion_q3.jpg',
    contentType: 'Media Asset',
    action: 'Created',
    actor: 'Elena Rostova',
    date: '01 Sep 2026',
    time: '02:40 PM',
    details: 'Uploaded 4K Ultra High Definition asset for Palm Jumeirah promotions.',
  },
]

// ==========================================
// MAIN CMS MANAGEMENT COMPONENT INNER
// ==========================================

function CmsManagementInner() {
  const { toast } = useToast()

  // Navigation State
  const [activeTab, setActiveTab] = React.useState<CmsSectionTab>('overview')
  const [currentLang, setCurrentLang] = React.useState<CmsLanguage>('EN')

  // Data Collections
  const [pages, setPages] = React.useState<CmsPageItem[]>(INITIAL_PAGES)
  const [mobileScreens, setMobileScreens] = React.useState<CmsMobileScreen[]>(INITIAL_MOBILE_SCREENS)
  const [banners, setBanners] = React.useState<CmsBannerItem[]>(INITIAL_MARKETING_BANNERS)
  const [faqs, setFaqs] = React.useState<CmsFaqItem[]>(INITIAL_FAQS)
  const [mediaAssets, setMediaAssets] = React.useState<CmsMediaAsset[]>(INITIAL_MEDIA_ASSETS)
  const [redirects, setRedirects] = React.useState<CmsRedirectItem[]>(INITIAL_REDIRECTS)
  const [auditLogs, setAuditLogs] = React.useState<CmsAuditItem[]>(INITIAL_AUDIT_LOGS)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>('All')
  const [selectedLangFilter, setSelectedLangFilter] = React.useState<string>('All')
  const [showFilters, setShowFilters] = React.useState(true)

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // ==========================================
  // PAGE EDITOR STATE (Full-Page Block Workspace)
  // ==========================================
  const [isEditingPage, setIsEditingPage] = React.useState(false)
  const [editorPage, setEditorPage] = React.useState<CmsPageItem | null>(null)
  const [editorActiveTab, setEditorActiveTab] = React.useState<'info' | 'blocks' | 'seo' | 'publishing'>('blocks')
  const [editorPreviewDevice, setEditorPreviewDevice] = React.useState<'desktop' | 'mobile' | 'social'>('desktop')
  const [isSaving, setIsSaving] = React.useState(false)

  // Modals State
  const [newBannerModal, setNewBannerModal] = React.useState(false)
  const [bannerFormName, setBannerFormName] = React.useState('')
  const [bannerFormTitle, setBannerFormTitle] = React.useState('')
  const [bannerFormDest, setBannerFormDest] = React.useState('/requests')
  const [bannerFormAudience, setBannerFormAudience] = React.useState<'All Users' | 'Investors' | 'Agents' | 'UAE'>('All Users')

  const [newFaqModal, setNewFaqModal] = React.useState(false)
  const [faqFormQuestion, setFaqFormQuestion] = React.useState('')
  const [faqFormAnswer, setFaqFormAnswer] = React.useState('')
  const [faqFormCategory, setFaqFormCategory] = React.useState<CmsFaqItem['category']>('Getting Started')

  const [newRedirectModal, setNewRedirectModal] = React.useState(false)
  const [redirectFrom, setRedirectFrom] = React.useState('')
  const [redirectTo, setRedirectTo] = React.useState('')
  const [redirectType, setRedirectType] = React.useState<'301' | '302'>('301')

  const [mediaDetailAsset, setMediaDetailAsset] = React.useState<CmsMediaAsset | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<{ type: string; id: string; name: string } | null>(null)

  // Version Comparison State
  const [versionCompareModal, setVersionCompareModal] = React.useState<CmsPageItem | null>(null)

  // ==========================================
  // ACTIONS & HANDLERS
  // ==========================================

  const handleOpenPageEditor = (page?: CmsPageItem) => {
    if (page) {
      setEditorPage({ ...page, blocks: [...page.blocks] })
    } else {
      const newPage: CmsPageItem = {
        id: `PAGE-${String(pages.length + 1).padStart(3, '0')}`,
        title: 'New Page Experience',
        titleAr: 'صفحة جديدة',
        slug: `/new-page-${pages.length + 1}`,
        status: 'Draft',
        language: 'Both',
        translationStatus: 'Needs Translation',
        version: 1,
        lastUpdated: 'Just now',
        updatedBy: 'Admin User',
        publishedDate: 'Not published',
        description: 'New custom landing page.',
        blocks: [
          { id: 'b1', type: 'heading', level: 'h1', title: 'Page Title' },
          { id: 'b2', type: 'paragraph', content: 'Add rich paragraph description here.' },
        ],
        seo: {
          metaTitle: 'New Page | Duseat Admin',
          metaDescription: 'Discover prime properties and matchmaking services.',
          canonicalUrl: `https://duseat.ae/new-page-${pages.length + 1}`,
          robots: 'index, follow',
        },
      }
      setEditorPage(newPage)
    }
    setIsEditingPage(true)
    setEditorActiveTab('blocks')
  }

  // Save Page Changes
  const handleSavePage = (asStatus: CmsContentStatus = 'Draft') => {
    if (!editorPage) return
    setIsSaving(true)

    setTimeout(() => {
      const updated: CmsPageItem = {
        ...editorPage,
        status: asStatus,
        version: asStatus === 'Published' ? editorPage.version + 1 : editorPage.version,
        lastUpdated: 'Just now',
        publishedDate: asStatus === 'Published' ? 'Today, Just now' : editorPage.publishedDate,
      }

      setPages((prev) => {
        const exists = prev.some((p) => p.id === updated.id)
        if (exists) {
          return prev.map((p) => (p.id === updated.id ? updated : p))
        }
        return [updated, ...prev]
      })

      // Add audit log
      setAuditLogs((prev) => [
        {
          id: `AUD-CMS-${Date.now()}`,
          contentTitle: updated.title,
          contentType: 'Website Page',
          action: asStatus === 'Published' ? 'Published' : 'Updated',
          actor: 'Admin User',
          date: 'Today',
          time: 'Just now',
          details: `Saved version ${updated.version} (${asStatus}).`,
        },
        ...prev,
      ])

      setIsSaving(false)
      setIsEditingPage(false)
      toast({
        variant: 'success',
        title: asStatus === 'Published' ? 'Page Published' : 'Draft Saved',
        description: `"${updated.title}" successfully updated on servers.`,
      })
    }, 600)
  }

  // Add / Remove Content Blocks in Editor
  const handleAddBlock = (type: ContentBlockType) => {
    if (!editorPage) return
    const newBlock: CmsContentBlock = {
      id: `b-${Date.now()}`,
      type,
      title: type === 'heading' ? 'New Section Heading' : type === 'faq' ? 'Frequently Asked Question?' : undefined,
      content: type === 'paragraph' ? 'Enter detailed description text here.' : undefined,
      buttonText: type === 'button' ? 'Action Button' : undefined,
      buttonLink: type === 'button' ? '/requests' : undefined,
      level: type === 'heading' ? 'h2' : undefined,
    }
    setEditorPage({
      ...editorPage,
      blocks: [...editorPage.blocks, newBlock],
    })
    toast({ variant: 'info', title: 'Block Added', description: `Added new ${type} block.` })
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editorPage) return
    const blocks = [...editorPage.blocks]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= blocks.length) return
    const temp = blocks[index]
    blocks[index] = blocks[targetIdx]
    blocks[targetIdx] = temp
    setEditorPage({ ...editorPage, blocks })
  }

  const handleDeleteBlock = (id: string) => {
    if (!editorPage) return
    setEditorPage({
      ...editorPage,
      blocks: editorPage.blocks.filter((b) => b.id !== id),
    })
  }

  // Create Banner
  const handleCreateBanner = () => {
    if (!bannerFormName.trim() || !bannerFormTitle.trim()) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Banner name and title are required.' })
      return
    }
    const newBanner: CmsBannerItem = {
      id: `BAN-${String(banners.length + 1).padStart(3, '0')}`,
      name: bannerFormName,
      title: bannerFormTitle,
      subtitle: 'Premium real estate opportunities in the United Arab Emirates.',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
      ctaText: 'Explore Now',
      ctaDestination: bannerFormDest,
      priority: banners.length + 1,
      audience: bannerFormAudience,
      status: 'Published',
      startDate: 'Today',
      endDate: '30 Sep 2026',
      lastUpdated: 'Just now',
    }
    setBanners((prev) => [newBanner, ...prev])
    setNewBannerModal(false)
    setBannerFormName('')
    setBannerFormTitle('')
    toast({ variant: 'success', title: 'Banner Created', description: `"${newBanner.name}" is now live.` })
  }

  // Create FAQ
  const handleCreateFaq = () => {
    if (!faqFormQuestion.trim() || !faqFormAnswer.trim()) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Question and answer cannot be empty.' })
      return
    }
    const newFaq: CmsFaqItem = {
      id: `FAQ-${String(faqs.length + 1).padStart(3, '0')}`,
      question: faqFormQuestion,
      answer: faqFormAnswer,
      category: faqFormCategory,
      tags: ['General', faqFormCategory],
      isFeatured: false,
      status: 'Published',
      order: faqs.length + 1,
    }
    setFaqs((prev) => [newFaq, ...prev])
    setNewFaqModal(false)
    setFaqFormQuestion('')
    setFaqFormAnswer('')
    toast({ variant: 'success', title: 'FAQ Added', description: 'New support question published.' })
  }

  // Create Redirect
  const handleCreateRedirect = () => {
    if (!redirectFrom.trim() || !redirectTo.trim()) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Source and target paths are required.' })
      return
    }
    if (redirectFrom === redirectTo) {
      toast({ variant: 'error', title: 'Loop Detected', description: 'Source path cannot be identical to destination.' })
      return
    }
    const newRed: CmsRedirectItem = {
      id: `RED-${String(redirects.length + 1).padStart(3, '0')}`,
      fromPath: redirectFrom.startsWith('/') ? redirectFrom : `/${redirectFrom}`,
      toPath: redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`,
      type: redirectType,
      status: 'Active',
      createdBy: 'SEO Admin',
      createdDate: 'Today',
    }
    setRedirects((prev) => [newRed, ...prev])
    setNewRedirectModal(false)
    setRedirectFrom('')
    setRedirectTo('')
    toast({ variant: 'success', title: 'Redirect Rule Created', description: `Mapped ${newRed.fromPath} → ${newRed.toPath} (${newRed.type}).` })
  }

  // Handle Deletions
  const handleExecuteDelete = () => {
    if (!deleteConfirmItem) return
    const { type, id, name } = deleteConfirmItem

    if (type === 'page') {
      setPages((prev) => prev.filter((p) => p.id !== id))
    } else if (type === 'banner') {
      setBanners((prev) => prev.filter((b) => b.id !== id))
    } else if (type === 'faq') {
      setFaqs((prev) => prev.filter((f) => f.id !== id))
    } else if (type === 'media') {
      setMediaAssets((prev) => prev.filter((m) => m.id !== id))
    } else if (type === 'redirect') {
      setRedirects((prev) => prev.filter((r) => r.id !== id))
    }

    setAuditLogs((prev) => [
      {
        id: `AUD-CMS-${Date.now()}`,
        contentTitle: name,
        contentType: type,
        action: 'Archived',
        actor: 'Admin User',
        date: 'Today',
        time: 'Just now',
        details: `Deleted ${type} record (${id}).`,
      },
      ...prev,
    ])

    setDeleteConfirmItem(null)
    toast({ variant: 'success', title: 'Deleted Successfully', description: `"${name}" removed.` })
  }

  // Filtered Pages
  const filteredPages = React.useMemo(() => {
    return pages.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchSlug = p.slug.toLowerCase().includes(q)
        const matchAuthor = p.updatedBy.toLowerCase().includes(q)
        if (!matchTitle && !matchSlug && !matchAuthor) return false
      }
      if (selectedStatusFilter !== 'All' && p.status !== selectedStatusFilter) return false
      if (selectedLangFilter !== 'All' && p.language !== selectedLangFilter && p.language !== 'Both') return false
      return true
    })
  }, [pages, searchQuery, selectedStatusFilter, selectedLangFilter])

  const totalPagesCount = Math.ceil(filteredPages.length / rowsPerPage) || 1
  const paginatedPages = filteredPages.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <PlatformShell
      title="Content Management System (CMS)"
      eyebrow="Public Experience"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            TOP HEADER CARD (Canonical Users Design Standard)
           ========================================================================= */}
        {!isEditingPage ? (
          <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                  Content Management System (CMS)
                </h1>
                <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                  Control public web pages, mobile app onboarding flows, marketing banners, FAQs, and SEO redirect rules.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Language Switcher */}
                <div className="flex items-center rounded-[6px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrentLang('EN')}
                    className={cn(
                      'px-2.5 py-1 text-[12px] font-bold rounded-[4px] transition-all cursor-pointer',
                      currentLang === 'EN' ? 'bg-white text-[#1f2327] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLang('AR')}
                    className={cn(
                      'px-2.5 py-1 text-[12px] font-bold rounded-[4px] transition-all cursor-pointer',
                      currentLang === 'AR' ? 'bg-white text-[#1f2327] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                    )}
                  >
                    العربية (AR)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPageEditor()}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[14px] font-bold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn"
                >
                  <Plus className="size-4" />
                  <span>Create New Page</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Metric Cards */}
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
              <MetricCard
                label="Published Pages"
                value={pages.filter((p) => p.status === 'Published').length}
                trend={{ value: 'Live', isPositive: true }}
                icon={Globe}
                tone="brand"
                subtitle="Active on web & app"
              />
              <MetricCard
                label="Drafts in Review"
                value={pages.filter((p) => p.status === 'Draft').length}
                trend={{ value: 'Pending', isPositive: false }}
                icon={FileText}
                tone="warning"
                subtitle="Unpublished revisions"
              />
              <MetricCard
                label="Marketing Banners"
                value={banners.length}
                trend={{ value: 'Active', isPositive: true }}
                icon={Sparkles}
                tone="brand"
                subtitle="Hero & targeted promos"
              />
              <MetricCard
                label="CDN Media Assets"
                value={mediaAssets.length}
                trend={{ value: 'Fastly UAE', isPositive: true }}
                icon={ImageIcon}
                tone="neutral"
                subtitle="High-res storage pool"
              />
            </div>
          </header>
        ) : (
          <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05)] flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-[#1f2327]">CMS Page Editor</h1>
              <p className="text-[13px] text-[#6f777f]">Editing page layout, components, and SEO metadata</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingPage(false)}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4 text-[#6f777f]" />
              <span>Exit Editor</span>
            </button>
          </header>
        )}

        {/* ==========================================
            CMS SUB-NAVIGATION TABS
        ========================================== */}
        {!isEditingPage && (
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 border-b border-[#d3d5d7] pb-3">
            <ScrollableTabsBar className="flex-1">
              {[
                { id: 'overview', label: 'Overview', icon: Layout, count: undefined },
                { id: 'website', label: 'Website Pages', icon: Globe, count: pages.length },
                { id: 'mobile', label: 'Mobile App', icon: Smartphone, count: mobileScreens.length },
                { id: 'marketing', label: 'Marketing Banners', icon: Sparkles, count: banners.length },
                { id: 'help-center', label: 'Help Center & FAQ', icon: HelpCircle, count: faqs.length },
                { id: 'seo', label: 'SEO & Redirects', icon: SearchIcon, count: redirects.length },
                { id: 'media', label: 'Media Library', icon: ImageIcon, count: mediaAssets.length },
                { id: 'history', label: 'Audit Trail', icon: History, count: auditLogs.length },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(e) => {
                      setActiveTab(tab.id as CmsSectionTab)
                      setCurrentPage(1)
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
                      'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap',
                      isActive
                        ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                        : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
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
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-[#00c2cb]" /> Production CDN: <strong className="text-[#1f2327]">Active (Fastly UAE)</strong>
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 1: CMS OVERVIEW / DASHBOARD (Spec 13.2)
           ========================================================================= */}
        {activeTab === 'overview' && !isEditingPage && (
          <div className="space-y-6 ant-fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Published Pages', value: pages.filter((p) => p.status === 'Published').length, sub: 'Active live on web', icon: Globe, color: '#00c2cb' },
                { label: 'Drafts in Progress', value: pages.filter((p) => p.status === 'Draft').length + 2, sub: 'Unpublished revisions', icon: FileText, color: '#eab308' },
                { label: 'Scheduled Launches', value: pages.filter((p) => p.status === 'Scheduled').length + banners.filter((b) => b.status === 'Scheduled').length, sub: 'Next: 12 Sep 2026', icon: Calendar, color: '#8b5cf6' },
                { label: 'Marketing Banners', value: banners.length, sub: 'Hero & targeted promos', icon: Sparkles, color: '#3b82f6' },
                { label: 'Media Assets (CDN)', value: `${mediaAssets.length * 82} assets`, sub: '184 MB bandwidth', icon: ImageIcon, color: '#10b981' },
              ].map((kpi, idx) => {
                const Icon = kpi.icon
                return (
                  <div key={idx} className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#6f777f]">{kpi.label}</span>
                      <div className="flex size-7 items-center justify-center rounded-[6px]" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                        <Icon className="size-3.5" />
                      </div>
                    </div>
                    <div className="text-[22px] font-bold text-[#1f2327]">{kpi.value}</div>
                    <p className="text-[11px] text-[#6f777f]">{kpi.sub}</p>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions Banner & Activity Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left 2 Cols: Content Health & Quick Launcher */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1f2327]">Recently Updated Web & App Content</h3>
                      <p className="text-[12px] text-[#6f777f]">Quick access to manage and preview public touchpoints.</p>
                    </div>
                    <MainButton
                      variant="Secondary"
                      size="sm"
                      label="View All Pages"
                      onClick={() => setActiveTab('website')}
                    />
                  </div>

                  <div className="divide-y divide-[#eef0f2]">
                    {pages.slice(0, 4).map((page) => (
                      <div key={page.id} className="flex items-center justify-between py-3 hover:bg-[#fafbfc] transition-colors rounded-[8px] px-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-[#1f2327]">{page.title}</span>
                            <span className="rounded bg-[#f4f5f6] px-1.5 py-0.2 text-[10px] font-mono text-[#6f777f]">{page.slug}</span>
                            <FigmaStatusBadge
                              status={
                                page.status === 'Published'
                                  ? 'Completed'
                                  : page.status === 'Scheduled'
                                  ? 'In progress'
                                  : 'Pending'
                              }
                            />
                          </div>
                          <p className="text-[11px] text-[#6f777f]">
                            v{page.version} • Updated {page.lastUpdated} by {page.updatedBy}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenPageEditor(page)}
                            className="rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 py-1 text-[11.5px] font-bold text-[#1f2327] hover:border-[#00c2cb] hover:text-[#00c2cb] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile App & Marketing Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5">
                        <Smartphone className="size-4 text-[#00c2cb]" /> Mobile App Screens
                      </span>
                      <span className="text-[11px] font-bold text-[#00c2cb]">{mobileScreens.length} Active</span>
                    </div>
                    <p className="text-[11px] text-[#6f777f]">Manage splash loading, onboarding flow, and system maintenance alerts.</p>
                    <MainButton
                      variant="Secondary"
                      size="sm"
                      className="w-full"
                      label="Manage App Screens"
                      onClick={() => setActiveTab('mobile')}
                    />
                  </div>

                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5">
                        <Sparkles className="size-4 text-[#00c2cb]" /> Marketing Banners
                      </span>
                      <span className="text-[11px] font-bold text-[#00c2cb]">{banners.length} Live</span>
                    </div>
                    <p className="text-[11px] text-[#6f777f]">Hero carousels, investor promotions, and localized regional banners.</p>
                    <MainButton
                      variant="Secondary"
                      size="sm"
                      className="w-full"
                      label="Configure Banners"
                      onClick={() => setActiveTab('marketing')}
                    />
                  </div>
                </div>
              </div>

              {/* Right Col: Live Audit Log & Publishing Activity */}
              <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                  <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-1.5">
                    <History className="size-4 text-[#00c2cb]" /> Content Publishing Log
                  </h3>
                </div>

                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="rounded-[8px] border border-[#eef0f2] p-3 text-[12px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1f2327] truncate max-w-[150px]">{log.contentTitle}</span>
                        <span className="rounded bg-[#00c2cb]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#00c2cb]">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6f777f]">{log.details}</p>
                      <div className="flex justify-between text-[10px] text-[#9ca3af] pt-1 border-t border-[#f4f5f6]">
                        <span>{log.actor}</span>
                        <span>{log.date} {log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: WEBSITE PAGES (Spec 13.4)
           ========================================================================= */}
        {activeTab === 'website' && !isEditingPage && (
            <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
              {/* Top Status Tabs & Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff1f3] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'All', label: 'All pages' },
                      { id: 'Published', label: 'Published' },
                      { id: 'Scheduled', label: 'Scheduled' },
                      { id: 'Draft', label: 'Draft' },
                      { id: 'In Review', label: 'In Review' },
                    ] as const
                  ).map((item) => {
                    const isActive = selectedStatusFilter === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedStatusFilter(item.id)}
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
                    label="Export Index"
                    onClick={() => {
                      exportToCsv(
                        'duseat_cms_pages_list',
                        ['Page ID', 'Title', 'Slug', 'Status', 'Language', 'Version', 'Last Updated', 'Author'],
                        filteredPages.map((p) => [p.id, p.title, p.slug, p.status, p.language, `v${p.version}`, p.lastUpdated, p.updatedBy])
                      )
                    }}
                  />
                  <MainButton
                    variant="Primary"
                    size="sm"
                    iconLeft={<Plus className="size-3.5" />}
                    label="New Page"
                    onClick={() => handleOpenPageEditor()}
                  />
                </div>
              </div>

              {/* Horizontal Filters Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 p-4 sm:p-5 pb-3">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages by title, slug, or author..."
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

                {/* Language Support Filter */}
                <select
                  value={selectedLangFilter}
                  onChange={(e) => setSelectedLangFilter(e.target.value)}
                  className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
                >
                  <option value="All">All Languages</option>
                  <option value="Both">Bilingual (EN + AR)</option>
                  <option value="EN">English Only</option>
                  <option value="AR">Arabic Only</option>
                </select>

                {/* Reset Filters Link */}
                {(searchQuery || selectedStatusFilter !== 'All' || selectedLangFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedStatusFilter('All')
                      setSelectedLangFilter('All')
                    }}
                    className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Pages Table */}
              <div className="overflow-x-auto table-scrollbar">
                <table className="w-full text-left text-[14px] border-collapse font-sans">
                  <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                    <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                      <th className="w-12 px-4 text-center">
                        <TableCheckbox
                          checked={
                            paginatedPages.length > 0 &&
                            paginatedPages.every((p) => selectedIds.includes(p.id))
                          }
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedIds(Array.from(new Set([...selectedIds, ...paginatedPages.map((p) => p.id)])))
                            } else {
                              setSelectedIds(selectedIds.filter((id) => !paginatedPages.some((p) => p.id === id)))
                            }
                          }}
                        />
                      </th>
                      <th className="px-4">Page Name & Route</th>
                      <th className="px-4">Language</th>
                      <th className="px-4">Version</th>
                      <th className="px-4">Last Updated</th>
                      <th className="px-4">Status</th>
                      <th className="px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d3d5d7]">
                    {paginatedPages.map((page) => {
                      const isSelected = selectedIds.includes(page.id)
                      return (
                        <tr
                          key={page.id}
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
                                  setSelectedIds([...selectedIds, page.id])
                                } else {
                                  setSelectedIds(selectedIds.filter((id) => id !== page.id))
                                }
                              }}
                            />
                          </td>
                              <td className="px-4">
                                <div className="space-y-0.5">
                                  <button
                                    onClick={() => handleOpenPageEditor(page)}
                                    className="text-left font-bold text-[#1f2327] hover:text-[#00c2cb] transition-colors"
                                  >
                                    {currentLang === 'AR' && page.titleAr ? page.titleAr : page.title}
                                  </button>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6f777f]">
                                    <span className="font-mono">{page.slug}</span>
                                    <span>•</span>
                                    <span>{page.blocks.length} content blocks</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4">
                                <span className="rounded bg-[#f4f5f6] px-2 py-0.5 text-[11px] font-bold text-[#1f2327]">
                                  {page.language === 'Both' ? 'EN + AR' : page.language}
                                </span>
                              </td>
                              <td className="px-4">
                                <span className="font-bold text-[#00c2cb]">v{page.version}</span>
                              </td>
                              <td className="px-4 text-[#4b5563]">
                                <div>{page.lastUpdated}</div>
                                <div className="text-[10px] text-[#9ca3af]">{page.updatedBy}</div>
                              </td>
                              <td className="px-4">
                                <FigmaStatusBadge
                                  status={
                                    page.status === 'Published'
                                      ? 'Completed'
                                      : page.status === 'Scheduled'
                                      ? 'In progress'
                                      : 'Pending'
                                  }
                                />
                              </td>
                              <td className="px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleOpenPageEditor(page)}
                                    className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                    title="Open Editor"
                                  >
                                    <Edit className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setVersionCompareModal(page)}
                                    className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                    title="Version History & Diff"
                                  >
                                    <History className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const copy: CmsPageItem = {
                                        ...page,
                                        id: `PAGE-${Date.now()}`,
                                        title: `${page.title} (Copy)`,
                                        slug: `${page.slug}-copy`,
                                        status: 'Draft',
                                        version: 1,
                                        lastUpdated: 'Just now',
                                      }
                                      setPages([copy, ...pages])
                                      toast({ variant: 'success', title: 'Page Duplicated', description: `Created "${copy.title}".` })
                                    }}
                                    className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eef0f2] hover:text-[#1f2327]"
                                    title="Duplicate"
                                  >
                                    <Copy className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmItem({ type: 'page', id: page.id, name: page.title })}
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
                      Showing <strong className="text-[#1f2327]">{filteredPages.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</strong> to{' '}
                      <strong className="text-[#1f2327]">{Math.min(currentPage * rowsPerPage, filteredPages.length)}</strong> of{' '}
                      <strong className="text-[#1f2327]">{filteredPages.length}</strong> pages
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPagesCount}
                      totalItems={filteredPages.length}
                      rowsPerPage={rowsPerPage}
                      onPageChange={setCurrentPage}
                      onRowsPerPageChange={setRowsPerPage}
                    />
                  </div>
                </section>
              )}

        {/* =========================================================================
            SECTION 3: FULL-PAGE PAGE EDITOR & BLOCK BUILDER (Spec 13.5 - 13.6)
           ========================================================================= */}
        {isEditingPage && editorPage && (
          <div className="space-y-4 ant-fade-in">
            {/* Editor Workspace Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-[6px] bg-[#00c2cb]/10 px-2 py-0.5 text-[11px] font-bold text-[#00c2cb]">
                    v{editorPage.version} • {editorPage.status}
                  </span>
                  <h2 className="text-[18px] font-bold text-[#1f2327]">{editorPage.title}</h2>
                </div>
                <p className="text-[11.5px] text-[#6f777f] font-mono">{editorPage.slug}</p>
              </div>

              {/* Editor Tabs & Save Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
                  {(['blocks', 'info', 'seo', 'publishing'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setEditorActiveTab(tab)}
                      className={cn(
                        'px-3 py-1 text-[12px] font-bold capitalize rounded-[6px] transition-all cursor-pointer',
                        editorActiveTab === tab ? 'bg-white text-[#1f2327] shadow-2xs' : 'text-[#6f777f]'
                      )}
                    >
                      {tab === 'blocks' ? 'Content Blocks' : tab}
                    </button>
                  ))}
                </div>

                <MainButton
                  variant="Secondary"
                  size="sm"
                  label="Save Draft"
                  disabled={isSaving}
                  onClick={() => handleSavePage('Draft')}
                />
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={isSaving ? <RefreshCw className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                  label={isSaving ? 'Publishing...' : 'Publish Live'}
                  disabled={isSaving}
                  onClick={() => handleSavePage('Published')}
                />
              </div>
            </div>

            {/* Editor Workspace: 2-Column (Left: Config/Blocks, Right: Live Device Preview) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT COLUMN: EDITOR SECTIONS (7 COLS) */}
              <div className="lg:col-span-7 space-y-4">
                {/* TAB: CONTENT BLOCKS */}
                {editorActiveTab === 'blocks' && (
                  <div className="space-y-4">
                    {/* Add Block Palette */}
                    <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">
                        + Add Content Block
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { type: 'heading', label: 'Heading', icon: Layers },
                          { type: 'paragraph', label: 'Paragraph', icon: FileText },
                          { type: 'button', label: 'Button / CTA', icon: Link2 },
                          { type: 'image', label: 'Image', icon: ImageIcon },
                          { type: 'video', label: 'Video Embed', icon: Video },
                          { type: 'banner', label: 'Banner Card', icon: Sparkle },
                          { type: 'faq', label: 'FAQ Accordion', icon: HelpCircle },
                          { type: 'quote', label: 'Quote', icon: BookOpen },
                          { type: 'divider', label: 'Divider', icon: MoveDown },
                        ].map((btn) => {
                          const Icon = btn.icon
                          return (
                            <button
                              key={btn.type}
                              type="button"
                              onClick={() => handleAddBlock(btn.type as ContentBlockType)}
                              className="flex items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-[#fafbfc] px-2.5 py-1 text-[11.5px] font-bold text-[#4b5563] hover:border-[#00c2cb] hover:bg-white hover:text-[#00c2cb] transition-all cursor-pointer"
                            >
                              <Icon className="size-3" />
                              <span>{btn.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Blocks Stack */}
                    <div className="space-y-3">
                      {editorPage.blocks.map((block, idx) => (
                        <div
                          key={block.id}
                          className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3 ant-fade-in"
                        >
                          <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#00c2cb]">
                                #{idx + 1} {block.type}
                              </span>
                              {block.type === 'heading' && (
                                <select
                                  value={block.level || 'h2'}
                                  onChange={(e) => {
                                    const blocks = [...editorPage.blocks]
                                    blocks[idx].level = e.target.value as 'h1' | 'h2' | 'h3'
                                    setEditorPage({ ...editorPage, blocks })
                                  }}
                                  className="rounded border border-[#d3d5d7] px-1.5 py-0.5 text-[11px] font-bold"
                                >
                                  <option value="h1">H1 Main Title</option>
                                  <option value="h2">H2 Section Heading</option>
                                  <option value="h3">H3 Subheading</option>
                                </select>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveBlock(idx, 'up')}
                                disabled={idx === 0}
                                className="rounded p-1 text-[#6f777f] hover:bg-[#f4f5f6] disabled:opacity-30"
                                title="Move Up"
                              >
                                <MoveUp className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveBlock(idx, 'down')}
                                disabled={idx === editorPage.blocks.length - 1}
                                className="rounded p-1 text-[#6f777f] hover:bg-[#f4f5f6] disabled:opacity-30"
                                title="Move Down"
                              >
                                <MoveDown className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlock(block.id)}
                                className="rounded p-1 text-[#dc2626] hover:bg-[#fef2f2]"
                                title="Delete Block"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Block Content Inputs */}
                          {(block.type === 'heading' || block.type === 'banner' || block.type === 'faq') && (
                            <div>
                              <label className="block text-[11px] font-bold text-[#6f777f] mb-1">Block Title / Question</label>
                              <input
                                type="text"
                                value={block.title || ''}
                                onChange={(e) => {
                                  const blocks = [...editorPage.blocks]
                                  blocks[idx].title = e.target.value
                                  setEditorPage({ ...editorPage, blocks })
                                }}
                                className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                              />
                            </div>
                          )}

                          {(block.type === 'paragraph' || block.type === 'quote') && (
                            <div>
                              <label className="block text-[11px] font-bold text-[#6f777f] mb-1">Paragraph Text</label>
                              <textarea
                                rows={3}
                                value={block.content || ''}
                                onChange={(e) => {
                                  const blocks = [...editorPage.blocks]
                                  blocks[idx].content = e.target.value
                                  setEditorPage({ ...editorPage, blocks })
                                }}
                                className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                              />
                            </div>
                          )}

                          {block.type === 'button' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-[#6f777f] mb-1">Button Label</label>
                                <input
                                  type="text"
                                  value={block.buttonText || ''}
                                  onChange={(e) => {
                                    const blocks = [...editorPage.blocks]
                                    blocks[idx].buttonText = e.target.value
                                    setEditorPage({ ...editorPage, blocks })
                                  }}
                                  className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-[#6f777f] mb-1">Destination URL</label>
                                <input
                                  type="text"
                                  value={block.buttonLink || ''}
                                  onChange={(e) => {
                                    const blocks = [...editorPage.blocks]
                                    blocks[idx].buttonLink = e.target.value
                                    setEditorPage({ ...editorPage, blocks })
                                  }}
                                  className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: BASIC INFO */}
                {editorActiveTab === 'info' && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                    <h3 className="text-[14px] font-bold text-[#1f2327]">Page Basic Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Page Title (English)</label>
                        <input
                          type="text"
                          value={editorPage.title}
                          onChange={(e) => setEditorPage({ ...editorPage, title: e.target.value })}
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Page Title (Arabic)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editorPage.titleAr || ''}
                          onChange={(e) => setEditorPage({ ...editorPage, titleAr: e.target.value })}
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#1f2327] mb-1">URL Route / Slug</label>
                        <input
                          type="text"
                          value={editorPage.slug}
                          onChange={(e) => setEditorPage({ ...editorPage, slug: e.target.value })}
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#6f777f] mb-1">Internal Description</label>
                        <textarea
                          rows={2}
                          value={editorPage.description}
                          onChange={(e) => setEditorPage({ ...editorPage, description: e.target.value })}
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: SEO & METADATA */}
                {editorActiveTab === 'seo' && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                    <h3 className="text-[14px] font-bold text-[#1f2327]">Search Engine Optimization (SEO)</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[12px] font-bold text-[#1f2327] mb-1">
                          <span>Meta Title</span>
                          <span className={cn('text-[11px]', editorPage.seo.metaTitle.length > 60 ? 'text-[#dc2626]' : 'text-[#10b981]')}>
                            {editorPage.seo.metaTitle.length}/60 chars
                          </span>
                        </div>
                        <input
                          type="text"
                          value={editorPage.seo.metaTitle}
                          onChange={(e) =>
                            setEditorPage({
                              ...editorPage,
                              seo: { ...editorPage.seo, metaTitle: e.target.value },
                            })
                          }
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[12px] font-bold text-[#1f2327] mb-1">
                          <span>Meta Description</span>
                          <span className={cn('text-[11px]', editorPage.seo.metaDescription.length > 160 ? 'text-[#dc2626]' : 'text-[#10b981]')}>
                            {editorPage.seo.metaDescription.length}/160 chars
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={editorPage.seo.metaDescription}
                          onChange={(e) =>
                            setEditorPage({
                              ...editorPage,
                              seo: { ...editorPage.seo, metaDescription: e.target.value },
                            })
                          }
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Canonical URL</label>
                        <input
                          type="text"
                          value={editorPage.seo.canonicalUrl}
                          onChange={(e) =>
                            setEditorPage({
                              ...editorPage,
                              seo: { ...editorPage.seo, canonicalUrl: e.target.value },
                            })
                          }
                          className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PUBLISHING & SCHEDULING */}
                {editorActiveTab === 'publishing' && (
                  <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                    <h3 className="text-[14px] font-bold text-[#1f2327]">Publication & Launch Scheduler</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Schedule Launch Date</label>
                          <input
                            type="date"
                            defaultValue="2026-09-15"
                            className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Launch Time (GST)</label>
                          <input
                            type="time"
                            defaultValue="08:00"
                            className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-2 text-[13px] outline-none focus:border-[#00c2cb]"
                          />
                        </div>
                      </div>
                      <div className="rounded-[8px] bg-[#f4f5f6] p-3 text-[12px] text-[#6f777f]">
                        Timezone: <strong>GST (UTC+4, Dubai, UAE)</strong>. All content caches will automatically warm upon launch.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: LIVE DEVICE PREVIEWS (5 COLS) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-3 sticky top-4">
                  <div className="flex items-center justify-between border-b border-[#eef0f2] pb-2">
                    <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5">
                      <Eye className="size-4 text-[#00c2cb]" /> Live Device Preview
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditorPreviewDevice('desktop')}
                        className={cn(
                          'p-1.5 rounded-[6px] transition-colors',
                          editorPreviewDevice === 'desktop' ? 'bg-[#00c2cb] text-white' : 'text-[#6f777f] hover:bg-[#f4f5f6]'
                        )}
                        title="Desktop Website"
                      >
                        <Monitor className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setEditorPreviewDevice('mobile')}
                        className={cn(
                          'p-1.5 rounded-[6px] transition-colors',
                          editorPreviewDevice === 'mobile' ? 'bg-[#00c2cb] text-white' : 'text-[#6f777f] hover:bg-[#f4f5f6]'
                        )}
                        title="Mobile Device"
                      >
                        <Smartphone className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setEditorPreviewDevice('social')}
                        className={cn(
                          'p-1.5 rounded-[6px] transition-colors',
                          editorPreviewDevice === 'social' ? 'bg-[#00c2cb] text-white' : 'text-[#6f777f] hover:bg-[#f4f5f6]'
                        )}
                        title="Google & Social Snippet"
                      >
                        <Share2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Device Frame */}
                  {editorPreviewDevice === 'social' ? (
                    <div className="space-y-4">
                      {/* Google Search Snippet */}
                      <div className="rounded-[8px] border border-[#eef0f2] bg-white p-3 space-y-1 text-left">
                        <span className="text-[11px] text-[#202124] block">https://duseat.ae {editorPage.slug}</span>
                        <h4 className="text-[14px] font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                          {editorPage.seo.metaTitle || editorPage.title}
                        </h4>
                        <p className="text-[12px] text-[#4d5156] line-clamp-2">
                          {editorPage.seo.metaDescription || editorPage.description}
                        </p>
                      </div>

                      {/* Social Share Card Preview */}
                      <div className="rounded-[10px] border border-[#d3d5d7] overflow-hidden bg-white shadow-2xs">
                        <div className="h-32 bg-gradient-to-r from-[#00c2cb] to-[#008f95] flex items-center justify-center text-white font-bold text-[14px]">
                          Duseat Brand OG Media
                        </div>
                        <div className="p-3 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#6f777f]">duseat.ae</span>
                          <h5 className="text-[13px] font-bold text-[#1f2327] line-clamp-1">{editorPage.seo.metaTitle}</h5>
                          <p className="text-[11px] text-[#6f777f] line-clamp-1">{editorPage.seo.metaDescription}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'mx-auto rounded-[12px] border border-[#d3d5d7] bg-[#fafbfc] overflow-hidden shadow-inner transition-all',
                        editorPreviewDevice === 'mobile' ? 'max-w-[280px] p-4 min-h-[420px]' : 'w-full p-5 min-h-[380px]'
                      )}
                    >
                      <div className="space-y-3">
                        {editorPage.blocks.map((block) => (
                          <div key={block.id}>
                            {block.type === 'heading' && (
                              <h3
                                className={cn(
                                  'font-bold text-[#1f2327]',
                                  block.level === 'h1' ? 'text-[18px]' : block.level === 'h2' ? 'text-[15px]' : 'text-[13px]'
                                )}
                              >
                                {block.title}
                              </h3>
                            )}
                            {block.type === 'paragraph' && (
                              <p className="text-[12px] text-[#4b5563] leading-relaxed">{block.content}</p>
                            )}
                            {block.type === 'button' && (
                              <div className="pt-1">
                                <span className="inline-block rounded-[6px] bg-[#00c2cb] px-3 py-1 text-[11px] font-bold text-white shadow-2xs">
                                  {block.buttonText}
                                </span>
                              </div>
                            )}
                            {block.type === 'banner' && (
                              <div className="rounded-[8px] border border-[#00c2cb]/30 bg-[#e6f9fa] p-3">
                                <span className="text-[12px] font-bold text-[#008f95] block">{block.title}</span>
                                <span className="text-[10px] text-[#6f777f]">{block.caption}</span>
                              </div>
                            )}
                            {block.type === 'faq' && (
                              <div className="rounded-[6px] border border-[#d3d5d7] bg-white p-2 text-[11px] font-semibold text-[#1f2327]">
                                ? {block.title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: MOBILE APP CONTENT (Spec 13.7)
           ========================================================================= */}
        {activeTab === 'mobile' && !isEditingPage && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Mobile App Touchpoints & Onboarding</h3>
                <p className="text-[12px] text-[#6f777f]">Manage splash screens, welcome flows, empty states, and maintenance messages.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mobileScreens.map((screen) => (
                <div key={screen.id} className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#00c2cb]">
                        {screen.type} • {screen.platform}
                      </span>
                      <FigmaStatusBadge status={screen.status === 'Published' ? 'Completed' : 'Pending'} />
                    </div>
                    <h4 className="text-[14px] font-bold text-[#1f2327]">{screen.title}</h4>
                    {screen.description && (
                      <p className="text-[12px] text-[#6f777f] line-clamp-2">{screen.description}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-between">
                    <span className="text-[11px] text-[#9ca3af]">{screen.lastUpdated}</span>
                    <MainButton
                      variant="Secondary"
                      size="sm"
                      label="Edit Screen"
                      onClick={() => {
                        toast({ variant: 'info', title: 'Mobile Screen Editor', description: `Opened ${screen.title}.` })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: MARKETING BANNERS & HERO (Spec 13.8 - 13.10)
           ========================================================================= */}
        {activeTab === 'marketing' && !isEditingPage && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Marketing Banners & Featured Allocations</h3>
                <p className="text-[12px] text-[#6f777f]">Control homepage banners, regional campaigns, and investor segment targeting.</p>
              </div>
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Plus className="size-3.5" />}
                label="+ Create Marketing Banner"
                onClick={() => setNewBannerModal(true)}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="h-36 bg-cover bg-center relative" style={{ backgroundImage: `url(${banner.imageUrl})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                            Priority #{banner.priority}
                          </span>
                          <FigmaStatusBadge status={banner.status === 'Published' ? 'Completed' : 'In progress'} />
                        </div>
                        <span className="rounded bg-[#00c2cb] px-2 py-0.5 text-[10px] font-bold text-white self-start">
                          Audience: {banner.audience}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-[14px] font-bold text-[#1f2327] line-clamp-1">{banner.title}</h4>
                      <p className="text-[12px] text-[#6f777f] line-clamp-2">{banner.subtitle}</p>
                      <div className="text-[11px] text-[#008f95] font-mono font-semibold">
                        CTA: {banner.ctaText} → {banner.ctaDestination}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-[#eef0f2] mt-2 pt-3">
                    <span className="text-[11px] text-[#6f777f]">{banner.startDate} – {banner.endDate}</span>
                    <button
                      onClick={() => setDeleteConfirmItem({ type: 'banner', id: banner.id, name: banner.name })}
                      className="rounded p-1 text-[#dc2626] hover:bg-[#fef2f2]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 6: HELP CENTER & FAQS (Spec 13.11)
           ========================================================================= */}
        {activeTab === 'help-center' && !isEditingPage && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Help Center & Knowledge Base</h3>
                <p className="text-[12px] text-[#6f777f]">Manage bilingual FAQs, RERA compliance guides, and agent video tutorials.</p>
              </div>
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Plus className="size-3.5" />}
                label="+ Add New FAQ"
                onClick={() => setNewFaqModal(true)}
              />
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[10px] font-bold text-[#00c2cb]">
                        {faq.category}
                      </span>
                      <h4 className="text-[14px] font-bold text-[#1f2327]">
                        {currentLang === 'AR' && faq.questionAr ? faq.questionAr : faq.question}
                      </h4>
                    </div>
                    <FigmaStatusBadge status="Completed" />
                  </div>
                  <p className="text-[12px] text-[#4b5563] leading-relaxed">
                    {currentLang === 'AR' && faq.answerAr ? faq.answerAr : faq.answer}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#f4f5f6]">
                    <div className="flex gap-1">
                      {faq.tags.map((t) => (
                        <span key={t} className="rounded bg-[#f4f5f6] px-1.5 py-0.2 text-[10px] text-[#6f777f]">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setDeleteConfirmItem({ type: 'faq', id: faq.id, name: faq.question })}
                      className="rounded p-1 text-[#dc2626] hover:bg-[#fef2f2]"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 7: SEO & REDIRECTS (Spec 13.12 - 13.14)
           ========================================================================= */}
        {activeTab === 'seo' && !isEditingPage && (
          <div className="space-y-5 ant-fade-in">
            {/* Sitemap Manager Bar */}
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[15px] font-bold text-[#1f2327]">Automated XML Sitemap Engine</h3>
                <p className="text-[12px] text-[#6f777f]">
                  Sitemap index generated: <strong>https://duseat.ae/sitemap.xml</strong> (48 URLs mapped)
                </p>
              </div>
              <MainButton
                variant="Secondary"
                size="sm"
                iconLeft={<RefreshCw className="size-3.5" />}
                label="Regenerate Sitemap"
                onClick={() => {
                  toast({ variant: 'success', title: 'Sitemap Regenerated', description: 'Updated XML index submitted to Google Search Console.' })
                }}
              />
            </div>

            {/* URL Redirects Table */}
            <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1f2327]">301 & 302 URL Redirect Rules</h3>
                  <p className="text-[12px] text-[#6f777f]">Manage canonical redirects and legacy routing to prevent 404 broken links.</p>
                </div>
                <MainButton
                  variant="Primary"
                  size="sm"
                  iconLeft={<Plus className="size-3.5" />}
                  label="+ Add Redirect Rule"
                  onClick={() => setNewRedirectModal(true)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#d3d5d7] bg-[#f8f9fa] text-[11px] font-bold uppercase text-[#6f777f]">
                      <th className="py-2.5 px-3">From URL</th>
                      <th className="py-2.5 px-3">To Destination</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef0f2]">
                    {redirects.map((red) => (
                      <tr key={red.id} className="hover:bg-[#fafbfc]">
                        <td className="py-2.5 px-3 font-mono font-semibold text-[#1f2327]">{red.fromPath}</td>
                        <td className="py-2.5 px-3 font-mono text-[#00c2cb]">{red.toPath}</td>
                        <td className="py-2.5 px-3">
                          <span className="rounded bg-[#f4f5f6] px-1.5 py-0.5 text-[11px] font-bold">{red.type}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <FigmaStatusBadge status="Completed" />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setDeleteConfirmItem({ type: 'redirect', id: red.id, name: red.fromPath })}
                            className="rounded p-1 text-[#dc2626] hover:bg-[#fef2f2]"
                          >
                            <Trash2 className="size-3.5" />
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

        {/* =========================================================================
            SECTION 8: CENTRALIZED MEDIA LIBRARY (Spec 13.15)
           ========================================================================= */}
        {activeTab === 'media' && !isEditingPage && (
          <div className="space-y-4 ant-fade-in">
            <div className="flex items-center justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs">
              <div>
                <h3 className="text-[16px] font-bold text-[#1f2327]">Centralized Media CDN Assets</h3>
                <p className="text-[12px] text-[#6f777f]">High-performance images, vectors, documents, and video tutorial files.</p>
              </div>
              <MainButton
                variant="Primary"
                size="sm"
                iconLeft={<Upload className="size-3.5" />}
                label="Upload New Media"
                onClick={() => {
                  toast({ variant: 'info', title: 'Media Upload', description: 'Select files to upload directly to UAE Fastly CDN.' })
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setMediaDetailAsset(asset)}
                  className="rounded-[12px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs hover:border-[#00c2cb] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 bg-[#fafbfc] flex items-center justify-center border-b border-[#eef0f2] relative overflow-hidden">
                      {asset.fileType === 'image' ? (
                        <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${asset.url})` }} />
                      ) : asset.fileType === 'video' ? (
                        <Video className="size-8 text-[#00c2cb]" />
                      ) : asset.fileType === 'document' ? (
                        <FileText className="size-8 text-[#6f777f]" />
                      ) : (
                        <ImageIcon className="size-8 text-[#00c2cb]" />
                      )}
                      <span className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">
                        {asset.fileType}
                      </span>
                    </div>

                    <div className="p-3 space-y-1">
                      <h4 className="text-[12px] font-bold text-[#1f2327] truncate group-hover:text-[#00c2cb] transition-colors">
                        {asset.name}
                      </h4>
                      <p className="text-[11px] text-[#6f777f]">{asset.size} • {asset.dimensions || 'File'}</p>
                    </div>
                  </div>

                  <div className="p-3 pt-0 text-[10px] text-[#9ca3af]">
                    Used in: <strong>{asset.usedIn.length} places</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 9: AUDIT TRAIL (Spec 13.21)
           ========================================================================= */}
        {activeTab === 'history' && !isEditingPage && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4 ant-fade-in">
            <h3 className="text-[15px] font-bold text-[#1f2327]">CMS Content Modification & Publishing History</h3>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between rounded-[8px] border border-[#eef0f2] p-3 text-[12px]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-[4px] bg-[#00c2cb]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#00c2cb]">
                        {log.action}
                      </span>
                      <strong className="text-[#1f2327]">{log.contentTitle}</strong>
                      <span className="text-[#9ca3af]">({log.contentType})</span>
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
            MODALS: CREATE BANNER, FAQ, REDIRECT, MEDIA DETAIL, DELETE
        ========================================== */}
        {/* New Banner Modal */}
        {newBannerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Create Marketing Banner</h3>
                <button onClick={() => setNewBannerModal(false)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Banner Name</label>
                  <input
                    type="text"
                    value={bannerFormName}
                    onChange={(e) => setBannerFormName(e.target.value)}
                    placeholder="e.g. Autumn Luxury Hero"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Title Headline</label>
                  <input
                    type="text"
                    value={bannerFormTitle}
                    onChange={(e) => setBannerFormTitle(e.target.value)}
                    placeholder="e.g. Exclusive Palm Villas"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Target Audience</label>
                  <select
                    value={bannerFormAudience}
                    onChange={(e) => setBannerFormAudience(e.target.value as typeof bannerFormAudience)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Investors">Investors Only</option>
                    <option value="Agents">Agents Only</option>
                    <option value="UAE">UAE Region</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setNewBannerModal(false)} />
                <MainButton variant="Primary" size="sm" label="Create Banner" onClick={handleCreateBanner} />
              </div>
            </div>
          </div>
        )}

        {/* New FAQ Modal */}
        {newFaqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Add Support FAQ</h3>
                <button onClick={() => setNewFaqModal(false)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Question</label>
                  <input
                    type="text"
                    value={faqFormQuestion}
                    onChange={(e) => setFaqFormQuestion(e.target.value)}
                    placeholder="e.g. How do I verify my license?"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={faqFormAnswer}
                    onChange={(e) => setFaqFormAnswer(e.target.value)}
                    placeholder="Detailed explanation..."
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setNewFaqModal(false)} />
                <MainButton variant="Primary" size="sm" label="Publish FAQ" onClick={handleCreateFaq} />
              </div>
            </div>
          </div>
        )}

        {/* New Redirect Modal */}
        {newRedirectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Create URL Redirect Rule</h3>
                <button onClick={() => setNewRedirectModal(false)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">From Path</label>
                  <input
                    type="text"
                    value={redirectFrom}
                    onChange={(e) => setRedirectFrom(e.target.value)}
                    placeholder="/old-page"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">To Destination Path</label>
                  <input
                    type="text"
                    value={redirectTo}
                    onChange={(e) => setRedirectTo(e.target.value)}
                    placeholder="/new-destination"
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Redirect Type</label>
                  <select
                    value={redirectType}
                    onChange={(e) => setRedirectType(e.target.value as '301' | '302')}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-[13px] outline-none focus:border-[#00c2cb]"
                  >
                    <option value="301">301 Permanent Redirect (SEO Equity)</option>
                    <option value="302">302 Temporary Redirect</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setNewRedirectModal(false)} />
                <MainButton variant="Primary" size="sm" label="Save Rule" onClick={handleCreateRedirect} />
              </div>
            </div>
          </div>
        )}

        {/* Media Details Drawer */}
        {mediaDetailAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <h3 className="text-[16px] font-bold text-[#1f2327] truncate">{mediaDetailAsset.name}</h3>
                <button onClick={() => setMediaDetailAsset(null)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="h-40 bg-[#fafbfc] rounded-[8px] border border-[#eef0f2] flex items-center justify-center overflow-hidden">
                  {mediaDetailAsset.fileType === 'image' ? (
                    <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${mediaDetailAsset.url})` }} />
                  ) : (
                    <FileText className="size-12 text-[#00c2cb]" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                    <span className="text-[#6f777f]">File Size:</span>
                    <strong className="text-[#1f2327]">{mediaDetailAsset.size}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                    <span className="text-[#6f777f]">Dimensions:</span>
                    <strong className="text-[#1f2327]">{mediaDetailAsset.dimensions || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f4f5f6]">
                    <span className="text-[#6f777f]">Uploaded By:</span>
                    <strong className="text-[#1f2327]">{mediaDetailAsset.uploadedBy}</strong>
                  </div>
                  <div>
                    <span className="text-[#6f777f] block mb-1">Active Dependencies (Used in):</span>
                    <div className="flex flex-wrap gap-1">
                      {mediaDetailAsset.usedIn.map((u) => (
                        <span key={u} className="rounded bg-[#00c2cb]/10 px-2 py-0.5 text-[11px] font-bold text-[#00c2cb]">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-between">
                <button
                  onClick={() => {
                    setDeleteConfirmItem({ type: 'media', id: mediaDetailAsset.id, name: mediaDetailAsset.name })
                    setMediaDetailAsset(null)
                  }}
                  className="text-[12px] font-bold text-[#dc2626] hover:underline"
                >
                  Delete Asset
                </button>
                <MainButton variant="Secondary" size="sm" label="Close" onClick={() => setMediaDetailAsset(null)} />
              </div>
            </div>
          </div>
        )}

        {/* Version Compare Modal */}
        {versionCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ant-fade-in backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Version Diff & Historical Comparison</h3>
                  <p className="text-[12px] text-[#6f777f]">{versionCompareModal.title}</p>
                </div>
                <button onClick={() => setVersionCompareModal(null)} className="text-[#6f777f] hover:text-[#1f2327]">
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[12px]">
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fafbfc] p-4 space-y-2">
                  <span className="font-bold text-[#6f777f]">Previous Version (v{versionCompareModal.version - 1})</span>
                  <div className="text-[#4b5563] space-y-1">
                    <p className="line-through text-[#dc2626]">Connect global investors with UAE brokers.</p>
                    <p>Standard escrow disclosure notice.</p>
                  </div>
                </div>

                <div className="rounded-[8px] border border-[#00c2cb] bg-[#e6f9fa] p-4 space-y-2">
                  <span className="font-bold text-[#008f95]">Current Live Version (v{versionCompareModal.version})</span>
                  <div className="text-[#1f2327] space-y-1">
                    <p className="font-bold text-[#10b981]">+ Connect high-intent global investors with verified licensed brokerages in Dubai.</p>
                    <p>Enhanced RERA regulatory disclosure.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Close" onClick={() => setVersionCompareModal(null)} />
                <MainButton
                  variant="Primary"
                  size="sm"
                  label="Restore as New Draft"
                  onClick={() => {
                    toast({ variant: 'success', title: 'Version Restored', description: 'Loaded into editor as a new draft.' })
                    setVersionCompareModal(null)
                  }}
                />
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
                  <p className="text-[12px] text-[#6f777f]">This will permanently remove "{deleteConfirmItem.name}".</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef0f2] flex items-center justify-end gap-2">
                <MainButton variant="Secondary" size="sm" label="Cancel" onClick={() => setDeleteConfirmItem(null)} />
                <MainButton
                  variant="Primary"
                  size="sm"
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                  label="Delete"
                  onClick={handleExecuteDelete}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}

export function CmsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={<div className="p-8 text-center text-[#6f777f]">Loading CMS Module...</div>}>
        <CmsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}
