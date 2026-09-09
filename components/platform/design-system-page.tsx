'use client'

import * as React from 'react'
import {
  Palette,
  Type,
  MousePointerClick,
  Tag as TagIcon,
  Flag as FlagIcon,
  Layers,
  Sliders,
  LayoutTemplate,
  Copy,
  Check,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Trash2,
  Archive,
  Download,
  Share2,
  DollarSign,
  Building2,
  Home,
  KeyRound,
  MessageSquare,
  Sparkles,
  Flame,
  X,
  Plus,
  Send,
  Lock,
  Award,
  Globe,
  Bell,
  Star,
  FileText,
  CreditCard,
  BarChart3,
  Megaphone,
  Wrench,
  HelpCircle,
  Bot,
  Filter,
  Zap,
  ChevronDown,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Flag, CountryBadge, AvatarFlagOverlay, getCountryCode } from '@/components/ui/flag'
import { TableAvatar, DualTableAvatar } from '@/components/ui/table-avatar'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Dropdown } from '@/components/dashboard/menu'
import { DateRangePicker } from './date-range-picker'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { useToast, ToastProvider } from '@/components/dashboard/toast'
import { RequestCard } from './request-card'
import { allPlatformRequests } from '@/lib/platform-users'
import { MainButton } from '@/components/ui/main-button'
import { FigmaTag } from '@/components/ui/figma-tag'
import { PlanBadge } from '@/components/ui/plan-badge'
import {
  HomeIcon as TdHome,
  HomeFilledIcon as TdHomeFilled,
  BuildingIcon as TdBuilding,
  KeyIcon as TdKey,
  LocationIcon as TdLocation,
  MoneyIcon as TdMoney,
  CreditcardIcon as TdCreditcard,
  SecuredIcon as TdSecured,
  SecuredFilledIcon as TdSecuredFilled,
  LockOnIcon as TdLockOn,
  UsergroupIcon as TdUsergroup,
  UserIcon as TdUser,
  UserVipIcon as TdUserVip,
  DownloadIcon as TdDownload,
  FolderIcon as TdFolder,
  DeleteIcon as TdDelete,
  ChatBubbleIcon as TdChat,
  ChatBubbleFilledIcon as TdChatFilled,
  SendIcon as TdSend,
  NotificationIcon as TdNotification,
  TimeIcon as TdTime,
  ChartBarIcon as TdChartBar,
  StarIcon as TdStar,
  StarFilledIcon as TdStarFilled,
  CheckCircleIcon as TdCheckCircle,
  CheckCircleFilledIcon as TdCheckCircleFilled,
  SettingIcon as TdSetting,
  FilterIcon as TdFilter,
  SearchIcon as TdSearch,
} from 'tdesign-icons-react'
import { VariablesDocumentationTable } from './variables-documentation'
import { cn } from '@/lib/utils'

// 6 Official Foundation Color Scales (Figma Node 4720:879)
const COLOR_PALETTES = [
  {
    name: '1. Primary Brand (Cyan Scale)',
    description: 'Core platform identity, action buttons, active navigational indicators, and primary highlights.',
    colors: [
      { name: 'Primary / 50', hex: '#E5F6F7', rgb: '229, 246, 247', usage: 'Badge backgrounds, Row highlights' },
      { name: 'Primary / 100', hex: '#C7ECEE', rgb: '199, 236, 238', usage: 'Subtle tag chips, Count pills' },
      { name: 'Primary / 200', hex: '#8FE0E3', rgb: '143, 224, 227', usage: 'Soft borders, Active glow' },
      { name: 'Primary / 300', hex: '#54D2D7', rgb: '84, 210, 215', usage: 'Secondary accents' },
      { name: 'Primary / 400', hex: '#26C7CD', rgb: '38, 199, 205', usage: 'Focus rings, Active states' },
      { name: 'Primary / 500 (Base)', hex: '#00C2CB', rgb: '0, 194, 203', usage: 'Primary brand CTA, Icons, Links' },
      { name: 'Primary / 600', hex: '#00A4AC', rgb: '0, 164, 172', usage: 'Button hover, High-contrast text' },
      { name: 'Primary / 700', hex: '#007A80', rgb: '0, 122, 128', usage: 'Pressed button states' },
      { name: 'Primary / 800', hex: '#0A8288', rgb: '10, 130, 136', usage: 'Dark teal badge borders' },
    ],
  },
  {
    name: '2. Neutral & Dark Surfaces',
    description: 'Platform structural hierarchy, canvas backgrounds, card borders, and primary dark typography.',
    colors: [
      { name: 'Neutral / White', hex: '#FFFFFF', rgb: '255, 255, 255', usage: 'Card surfaces & dialogs' },
      { name: 'Neutral / 50', hex: '#F8F9FA', rgb: '248, 249, 250', usage: 'App background canvas' },
      { name: 'Neutral / 100', hex: '#EFF1F3', rgb: '239, 241, 243', usage: 'Avatar background, Hover fill' },
      { name: 'Neutral / 200', hex: '#D3D5D7', rgb: '211, 213, 215', usage: 'Card & modal border lines' },
      { name: 'Neutral / 300', hex: '#B6B9BD', rgb: '182, 185, 189', usage: 'Disabled borders, Dividers' },
      { name: 'Neutral / 400', hex: '#9DA4AE', rgb: '157, 164, 174', usage: 'Placeholder text, Subtle glyphs' },
      { name: 'Neutral / 500', hex: '#6F777F', rgb: '111, 119, 127', usage: 'Secondary body & table headers' },
      { name: 'Neutral / 600', hex: '#4B5158', rgb: '75, 81, 88', usage: 'Dark secondary labels' },
      { name: 'Neutral / 700', hex: '#2E3338', rgb: '46, 51, 56', usage: 'Dark surface hover states' },
      { name: 'Neutral / 800', hex: '#1F2327', rgb: '31, 35, 39', usage: 'Dark admin header & dark buttons' },
      { name: 'Neutral / Black', hex: '#010413', rgb: '1, 4, 19', usage: 'Primary bold typography' },
    ],
  },
  {
    name: '3. Success Green Scale',
    description: 'Verified badges, successful matching, escrow confirmations, and active contracts.',
    colors: [
      { name: 'Success / 50', hex: '#E8F8F0', rgb: '232, 248, 240', usage: 'Success card background' },
      { name: 'Success / 100', hex: '#DFEFE8', rgb: '223, 239, 232', usage: 'Verified tag backdrop' },
      { name: 'Success / 200', hex: '#A6E0C5', rgb: '166, 224, 197', usage: 'Success border subtle' },
      { name: 'Success / 500 (Base)', hex: '#17B26A', rgb: '23, 178, 106', usage: 'Verified buyer ✔, Matched deals' },
      { name: 'Success / 600', hex: '#109154', rgb: '16, 145, 84', usage: 'Dark green hover states' },
      { name: 'Success / 700', hex: '#0B6F3E', rgb: '11, 111, 62', usage: 'High-contrast success text' },
    ],
  },
  {
    name: '4. Warning Orange / Amber Scale',
    description: 'Pending KYC review, expiring requests, Hot Brief alerts, and system cautions.',
    colors: [
      { name: 'Warning / 50', hex: '#FFF8EB', rgb: '255, 248, 235', usage: 'Warning banner backdrop' },
      { name: 'Warning / 100', hex: '#FFF4E5', rgb: '255, 244, 229', usage: 'Pending badge background' },
      { name: 'Warning / 200', hex: '#FEDF89', rgb: '254, 223, 137', usage: 'Warning border tint' },
      { name: 'Warning / 500 (Base)', hex: '#F79009', rgb: '247, 144, 9', usage: '🔥 Hot Briefs, Pending reviews' },
      { name: 'Warning / 600', hex: '#DC6803', rgb: '220, 104, 3', usage: 'Warning hover triggers' },
      { name: 'Warning / 700', hex: '#B54708', rgb: '181, 71, 8', usage: 'Warning high-contrast text' },
    ],
  },
  {
    name: '5. Error Red / Crimson Scale',
    description: 'Closed requests, expired briefs, destructive actions, and suspended accounts.',
    colors: [
      { name: 'Error / 50', hex: '#F3E1E0', rgb: '243, 225, 224', usage: 'Power agent background, Error surface' },
      { name: 'Error / 100', hex: '#EFCDCA', rgb: '239, 205, 202', usage: 'Light error tag background' },
      { name: 'Error / 200', hex: '#EAA5A0', rgb: '234, 165, 160', usage: 'Error border line' },
      { name: 'Error / 500 (Base)', hex: '#D92D20', rgb: '217, 45, 32', usage: 'Closed, Expired, Power agent text' },
      { name: 'Error / 600', hex: '#AE241A', rgb: '174, 36, 26', usage: 'Destructive button hover' },
      { name: 'Error / 700', hex: '#821B13', rgb: '130, 27, 19', usage: 'High-contrast red text' },
    ],
  },
  {
    name: '6. Information Blue Scale',
    description: 'Elite agent tiers, system informational dispatches, mortgage notes, and audit logs.',
    colors: [
      { name: 'Information / 50', hex: '#EAF2FF', rgb: '234, 242, 255', usage: 'Elite agent background, Info surface' },
      { name: 'Information / 100', hex: '#D6E4FF', rgb: '214, 228, 255', usage: 'Info tag background' },
      { name: 'Information / 200', hex: '#ADC8FF', rgb: '173, 200, 255', usage: 'Info border line' },
      { name: 'Information / 500 (Base)', hex: '#2F54EB', rgb: '47, 84, 235', usage: 'Elite agent text, Info alerts' },
      { name: 'Information / 600', hex: '#1D39C4', rgb: '29, 57, 196', usage: 'Blue hover triggers' },
      { name: 'Information / 700', hex: '#10239E', rgb: '16, 35, 158', usage: 'High-contrast blue text' },
    ],
  },
]

const COUNTRIES = [
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', dial: '+971' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', dial: '+966' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', dial: '+20' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dial: '+44' },
  { name: 'United States', code: 'US', flag: '🇺🇸', dial: '+1' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', dial: '+974' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼', dial: '+965' },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭', dial: '+973' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲', dial: '+968' },
  { name: 'Jordan', code: 'JO', flag: '🇯🇴', dial: '+962' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', dial: '+49' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dial: '+33' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', dial: '+39' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dial: '+1' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', dial: '+61' },
  { name: 'India', code: 'IN', flag: '🇮🇳', dial: '+91' },
  { name: 'China', code: 'CN', flag: '🇨🇳', dial: '+86' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', dial: '+41' },
]

export function DesignSystemPageInner() {
  const { toast } = useToast()
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null)
  const [activeSection, setActiveSection] = React.useState('variables')
  const [isBoosted, setIsBoosted] = React.useState(true)
  const [autoMatch, setAutoMatch] = React.useState(true)
  const [sampleQuery, setSampleQuery] = React.useState('Luxury villa in Dubai Hills')
  const [dateRange, setDateRange] = React.useState('This Month')
  const [sampleDropdown, setSampleDropdown] = React.useState('Villa')
  const [checkboxState, setCheckboxState] = React.useState(true)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(text)
    toast({
      variant: 'success',
      title: 'Copied to Clipboard',
      description: `${label} (${text}) copied.`,
    })
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const sections = [
    { id: 'variables', label: '1. Variables & Aliases', icon: Sliders },
    { id: 'colors', label: '2. Colors & Tokens', icon: Palette },
    { id: 'typography', label: '3. Typography', icon: Type },
    { id: 'buttons', label: '4. MainButton System', icon: MousePointerClick },
    { id: 'tags', label: '5. Tags & Chips', icon: TagIcon },
    { id: 'badges', label: '6. Badges & Plan Tiers', icon: ShieldCheck },
    { id: 'flags', label: '7. Vector Flags Suite', icon: FlagIcon },
    { id: 'icons', label: '8. Iconography', icon: Layers },
    { id: 'inputs', label: '9. Form Controls', icon: Sliders },
    { id: 'components', label: '10. Composite UI', icon: LayoutTemplate },
  ]

  const scrollTo = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <PlatformShell
      title="Design System & Component Reference"
      eyebrow="system reference"
      description="The definitive single source of truth for Duseat foundation variables, Figma components, token scales, and composite UI patterns."
      accent="Authoritative Reference"
      hideSearch
    >
      <div className="flex w-full min-w-0 flex-col gap-8 px-4 sm:px-6 lg:px-8 py-5 pb-24 font-sans">
        {/* Sticky Quick-Nav Pill Bar */}
        <div className="sticky top-[60px] sm:top-[64px] z-30 -mx-4 sm:-mx-6 lg:-mx-8 -mt-5 bg-[#fcfcfc]/95 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-md border-b border-[#d3d5d7] shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {sections.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollTo(sec.id)}
                  className={cn(
                    'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ant-wave-btn',
                    isActive
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{sec.label}</span>
                </button>
              )
            })}

            <a
              href="/apple-design"
              className="flex h-[36px] items-center gap-2 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap transition-all bg-[#0066cc] text-white hover:bg-[#0077ed] active:scale-95 shadow-xs ml-auto"
            >
              <Sparkles className="size-3.5" />
              <span> Apple Design Showroom</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: VARIABLES & DESIGN TOKEN ALIASES (Figma Node 4720:879)
           ========================================================================= */}
        <section id="variables" className="space-y-4 pt-2">
          <VariablesDocumentationTable />
        </section>

        {/* =========================================================================
            SECTION 2: COLOR PALETTES & TOKENS
           ========================================================================= */}
        <section id="colors" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <Palette className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">2. Color Palettes & Design Tokens</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Click any card to copy HEX</span>
          </div>

          <div className="space-y-6">
            {COLOR_PALETTES.map((palette) => (
              <div key={palette.name} className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3.5">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">{palette.name}</h3>
                  <p className="text-[13px] text-[#6f777f]">{palette.description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {palette.colors.map((c) => {
                    const isCopied = copiedToken === c.hex
                    return (
                      <div
                        key={c.name}
                        onClick={() => copyToClipboard(c.hex, c.name)}
                        className="group relative rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 transition-all hover:border-[#00c2cb] hover:shadow-md cursor-pointer flex flex-col justify-between h-[150px]"
                      >
                        {/* Swatch */}
                        <div
                          className="h-14 w-full rounded-[6px] border border-black/10 shadow-inner flex items-center justify-center transition-transform group-hover:scale-102"
                          style={{ backgroundColor: c.hex }}
                        >
                          {isCopied ? (
                            <span className="rounded-full bg-black/75 px-2 py-0.5 text-[11px] font-bold text-white flex items-center gap-1">
                              <Check className="size-3" /> Copied
                            </span>
                          ) : (
                            <Copy className="size-4 text-white opacity-0 drop-shadow group-hover:opacity-80 transition-opacity" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-0.5 pt-2">
                          <p className="text-[13px] font-bold text-[#1f2327] truncate">{c.name}</p>
                          <p className="text-[11px] font-mono text-[#00a4ac] font-semibold">{c.hex}</p>
                          <p className="text-[10px] text-[#6f777f] truncate">{c.usage}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: TYPOGRAPHY SCALE & FONT SYSTEM
           ========================================================================= */}
        <section id="typography" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <Type className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">3. Typography Scale & Hierarchy</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">TT Commons / Inter font scales</span>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-6 shadow-2xs space-y-6">
            <div className="divide-y divide-[#d3d5d7]">
              <div className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Display Hero (32px Bold)</p>
                  <span className="text-[11px] text-[#6f777f]">Main Dashboard Headlines & Stats</span>
                </div>
                <h1 className="text-[32px] font-extrabold text-[#010413] tracking-tight font-sans">
                  AED 48,250,000 Volume
                </h1>
              </div>

              <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Heading 1 (24px Bold)</p>
                  <span className="text-[11px] text-[#6f777f]">Page titles & Modal headers</span>
                </div>
                <h2 className="text-[24px] font-bold text-[#010413] font-sans">
                  Request Details & Offers Management
                </h2>
              </div>

              <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Heading 2 (20px Bold)</p>
                  <span className="text-[11px] text-[#6f777f]">Section headers & Module cards</span>
                </div>
                <h3 className="text-[20px] font-bold text-[#1f2327] font-sans">
                  Investor Requirements & Preferences
                </h3>
              </div>

              <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Card Title (16px Bold / Medium)</p>
                  <span className="text-[11px] text-[#6f777f]">User names, Request descriptions</span>
                </div>
                <p className="text-[16px] font-bold text-[#010413] font-sans">
                  Ahmed Al Mansoori • Ready-to-move 4 Bedroom Villa
                </p>
              </div>

              <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Body Text (14px Regular / Medium)</p>
                  <span className="text-[11px] text-[#6f777f]">Standard paragraphs & table cells</span>
                </div>
                <p className="text-[14px] text-[#1f2327] font-sans max-w-xl">
                  Family-friendly community with schools and parks nearby. Pre-approval mortgage letter verified with Emirates NBD.
                </p>
              </div>

              <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Caption & Timestamp (12px / 13px)</p>
                  <span className="text-[11px] text-[#6f777f]">Dates, Online status, Sub-labels</span>
                </div>
                <p className="text-[12px] text-[#6f777f] font-sans">
                  Created Today, 09:12 • 4 min ago • UAE RERA Broker ID #9281
                </p>
              </div>

              <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-0.5 min-w-[200px]">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Monospace Code / ID (12px / 13px)</p>
                  <span className="text-[11px] text-[#6f777f]">Request IDs, Transaction Ref</span>
                </div>
                <span className="font-mono text-[13px] font-semibold text-[#1f2327] bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 rounded">
                  REQ-IN-2048-01
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: MAINBUTTON SYSTEM (Figma Node 1160:319)
           ========================================================================= */}
        <section id="buttons" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <MousePointerClick className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">4. MainButton Component System (Figma Node 1160:319)</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Full Figma action variants</span>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d3d5d7] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#1f2327]">MainButton System (Figma Node 1160:319)</h3>
                  <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[11px] font-bold font-mono">
                    @Components / 1160-319
                  </span>
                </div>
                <p className="text-[13px] text-[#6f777f]">
                  Primary action button system supporting 4 size scales (sm 36px, md 44px, lg 48px, xlg 56px), 3 variants (Primary solid, Secondary outline, Text ghost), loading state, and icon-only mode.
                </p>
              </div>
            </div>

            {/* 4 Sizes Showcase */}
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">4 Size Scales (sm 36px, md 44px, lg 48px, xlg 56px):</p>
              <div className="flex flex-wrap items-center gap-3">
                <MainButton size="xlg" iconLeft={<DollarSign />} iconRight={<Building2 />}>
                  Extra Large (56px)
                </MainButton>
                <MainButton size="lg" iconLeft={<DollarSign />} iconRight={<Building2 />}>
                  Large (48px)
                </MainButton>
                <MainButton size="md" iconLeft={<DollarSign />} iconRight={<Building2 />}>
                  Medium (44px)
                </MainButton>
                <MainButton size="sm" iconLeft={<DollarSign />} iconRight={<Building2 />}>
                  Small (36px)
                </MainButton>
              </div>
            </div>

            {/* 3 Variants & States */}
            <div className="space-y-2 pt-2 border-t border-[#d3d5d7]/60">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">3 Variants & Interaction States:</p>
              <div className="flex flex-wrap items-center gap-3">
                <MainButton variant="Primary" size="md" iconLeft={<DollarSign />}>
                  Primary Solid
                </MainButton>
                <MainButton variant="Secondary" size="md" iconLeft={<DollarSign />}>
                  Secondary Outline
                </MainButton>
                <MainButton variant="Text" size="md" iconLeft={<DollarSign />}>
                  Text Ghost
                </MainButton>
                <MainButton variant="Primary" size="md" loading>
                  Loading Action
                </MainButton>
                <MainButton variant="Primary" size="md" disabled iconLeft={<DollarSign />}>
                  Disabled Solid
                </MainButton>
                <MainButton variant="Secondary" size="md" disabled iconLeft={<DollarSign />}>
                  Disabled Outline
                </MainButton>
              </div>
            </div>

            {/* Icon Only Action Triggers */}
            <div className="space-y-2 pt-2 border-t border-[#d3d5d7]/60">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Icon-Only Square Action Triggers:</p>
              <div className="flex flex-wrap items-center gap-3">
                <MainButton size="xlg" iconOnly iconLeft={<DollarSign />} title="Cash xlg" />
                <MainButton size="lg" iconOnly iconLeft={<Building2 />} title="Property lg" />
                <MainButton size="md" iconOnly iconLeft={<KeyRound />} title="Key md" />
                <MainButton size="sm" iconOnly iconLeft={<Search />} title="Search sm" />
                <MainButton variant="Secondary" size="md" iconOnly iconLeft={<Share2 />} title="Share" />
                <MainButton variant="Secondary" size="sm" iconOnly iconLeft={<Download />} title="Download" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: TAGS & CHIPS SYSTEM (Figma Node 1275:1884)
           ========================================================================= */}
        <section id="tags" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <TagIcon className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">5. Unified Tags & Chips System (Figma Node 1275:1884)</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Standardized 24px Pill Chips</span>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#1f2327]">Unified Tags & Chips (Figma Node 1275:1884)</h3>
                <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[11px] font-bold font-mono">
                  @Components / 1275-1884
                </span>
              </div>
              <p className="text-[13px] text-[#6f777f]">
                Unified tag system applied across all request cards, filter chips, property specifications, and investor preferences.
              </p>
            </div>

            {/* Category A: Property Types & Specifications */}
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">A. Property Specifications & Amenities (Solid & Active):</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <FigmaTag status="Active" size="lg" label="Villa" leftIcon={<Home className="size-[18px]" />} />
                <FigmaTag status="Active" size="lg" label="4 Bedrooms" leftIcon={<Building2 className="size-[18px]" />} />
                <FigmaTag status="Active" size="lg" label="5,400 sq.ft" leftIcon={<Layers className="size-[18px]" />} />
                <FigmaTag status="Active" size="lg" label="Dubai Hills Estate" leftIcon={<Globe className="size-[18px]" />} />
                <FigmaTag status="Active" size="lg" label="Private Pool" leftIcon={<Sparkles className="size-[18px]" />} />
                <FigmaTag status="Active" size="lg" label="Park Facing" leftIcon={<CheckCircle2 className="size-[18px]" />} />
                <FigmaTag status="Default" size="lg" label="Single Row" />
                <FigmaTag status="Default" size="lg" label="Vacant on Transfer" />
              </div>
            </div>

            {/* Category B: Investor Intent, Budget & Deal Progress */}
            <div className="space-y-2 pt-2 border-t border-[#d3d5d7]/60">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">B. Investor Intent, Deal Progress & Statuses:</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <FigmaTag status="Primary" size="lg" label="Ready to Close" leftIcon={<Zap className="size-[18px]" />} />
                <FigmaTag status="Success" size="lg" label="Cash Buyer (Verified Funds)" leftIcon={<DollarSign className="size-[18px]" />} />
                <FigmaTag status="Success" size="lg" label="Escrow Deposit Confirmed" leftIcon={<ShieldCheck className="size-[18px]" />} />
                <FigmaTag status="Warning" size="lg" label="HOT BRIEF (8 hrs left)" leftIcon={<Flame className="size-[18px]" />} />
                <FigmaTag status="information" size="lg" label="Mortgage Pre-Approved" leftIcon={<CreditCard className="size-[18px]" />} />
                <FigmaTag status="Error" size="lg" label="Offer Expired" leftIcon={<Clock className="size-[18px]" />} />
                <FigmaTag status="Disabled" size="lg" label="Archived Deal" />
              </div>
            </div>

            {/* Category C: Active Filter Chips with Dismiss Triggers */}
            <div className="space-y-2 pt-2 border-t border-[#d3d5d7]/60">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">C. Interactive Filter Chips (Click ✕ to Clear):</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <FigmaTag
                  type="Outline"
                  status="Active"
                  size="lg"
                  label="Type: Villa"
                  leftIcon={<Home className="size-[18px]" />}
                  rightIcon={<X className="size-[16px]" />}
                  onDismiss={() => {}}
                />
                <FigmaTag
                  type="Outline"
                  status="Active"
                  size="lg"
                  label="Location: Dubai Hills"
                  leftIcon={<Globe className="size-[18px]" />}
                  rightIcon={<X className="size-[16px]" />}
                  onDismiss={() => {}}
                />
                <FigmaTag
                  type="Outline"
                  status="Active"
                  size="lg"
                  label="Budget: AED 8M - 12M"
                  leftIcon={<DollarSign className="size-[18px]" />}
                  rightIcon={<X className="size-[16px]" />}
                  onDismiss={() => {}}
                />
                <FigmaTag
                  type="Outline"
                  status="Active"
                  size="lg"
                  label="Bedrooms: 4+ Beds"
                  leftIcon={<Building2 className="size-[18px]" />}
                  rightIcon={<X className="size-[16px]" />}
                  onDismiss={() => {}}
                />
                <FigmaTag
                  type="Outline"
                  status="Warning"
                  size="lg"
                  label="Priority: Hot Briefs Only"
                  leftIcon={<Flame className="size-[18px]" />}
                  rightIcon={<X className="size-[16px]" />}
                  onDismiss={() => {}}
                />
                <FigmaTag
                  type="Outline"
                  status="Success"
                  size="lg"
                  label="Agent: Pro / Elite"
                  leftIcon={<Award className="size-[18px]" />}
                  rightIcon={<X className="size-[16px]" />}
                  onDismiss={() => {}}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: BADGES, PLAN TIERS & KYC STATUSES
           ========================================================================= */}
        <section id="badges" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">6. Badges, Plan Tiers & Verification</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Figma lifecycle and KYC badges</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Subscription Tiers (Figma Node 217:10008 PlanBadge) */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#1f2327]">Agent Subscription Tiers (Figma 217:10008)</h3>
                <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[10px] font-bold font-mono">
                  @Dashboard
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <PlanBadge property1="Pro" />
                <PlanBadge property1="Elite" />
                <PlanBadge property1="Power" />
              </div>
              <div className="pt-2 border-t border-[#d3d5d7]/50 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded bg-[#f4f3ff] px-2.5 py-1 text-[12px] font-bold text-[#7a5af8]">
                  <Award className="size-[18px]" />
                  Enterprise VIP
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4e5] px-2.5 py-1 text-[12px] font-bold text-[#b54708] border border-[#f79009]/30">
                  <Flame className="size-[18px] text-[#f79009]" />
                  HOT BRIEF
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c7ecee] px-3 py-1 text-[12px] font-bold text-[#00a4ac]">
                  <MessageSquare className="size-[18px]" />
                  12 offers
                </span>
              </div>
            </div>

            {/* Figma Request Status Badges */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
              <h3 className="text-[15px] font-bold text-[#1f2327]">Request Lifecycle Statuses</h3>
              <div className="flex flex-wrap items-center gap-2">
                <FigmaStatusBadge status="Draft" />
                <FigmaStatusBadge status="Open" />
                <FigmaStatusBadge status="Matched" />
                <FigmaStatusBadge status="Closed" />
                <FigmaStatusBadge status="Expired" />
                <FigmaStatusBadge status="Archived" />
              </div>
            </div>

            {/* Verification & KYC Badges */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-3">
              <h3 className="text-[15px] font-bold text-[#1f2327]">Verification & KYC Badges</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#dfefe8] px-2.5 py-0.5 text-[11px] font-semibold text-[#17b26a]">
                  <CheckCircle2 className="size-3" />
                  Verified Buyer
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#dfefe8] px-2.5 py-0.5 text-[11px] font-semibold text-[#17b26a]">
                  <ShieldCheck className="size-3" />
                  RERA Licensed ✔
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4e5] px-2.5 py-0.5 text-[11px] font-semibold text-[#b54708]">
                  <Clock className="size-3" />
                  Pending Review
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#d92d20]">
                  <XCircle className="size-3" />
                  Suspended (3)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: VECTOR FLAGS SUITE (Figma Node 2724:22777)
           ========================================================================= */}
        <section id="flags" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <FlagIcon className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">7. Vector Flags Suite (Figma Node 2724:22777)</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Aspect 3:2 Standard</span>
          </div>

          <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d3d5d7] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Vector Flags System (Figma Node 2724:22777)</h3>
                  <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[11px] font-bold font-mono">
                    @Components / 2724-22777
                  </span>
                </div>
                <p className="text-[13px] text-[#6f777f]">
                  Crisp vector country flags with standard 3:2 aspect ratios, 4 responsive size scales (sm 18x12px, md 24x16px, lg 36x24px, xl 48x32px), and avatar overlay badges.
                </p>
              </div>
            </div>

            {/* 4 Standard Size Scales */}
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">3:2 Aspect Ratio Scale (sm 18x12, md 24x16, lg 36x24, xl 48x32):</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-[8px] border border-[#d3d5d7] p-2 bg-[#fcfcfc]">
                  <Flag code="AE" size="xl" />
                  <span className="text-[12px] font-mono font-semibold text-[#1f2327]">XL (48x32px)</span>
                </div>
                <div className="flex items-center gap-2 rounded-[8px] border border-[#d3d5d7] p-2 bg-[#fcfcfc]">
                  <Flag code="SA" size="l" />
                  <span className="text-[12px] font-mono font-semibold text-[#1f2327]">LG (36x24px - Figma Base)</span>
                </div>
                <div className="flex items-center gap-2 rounded-[8px] border border-[#d3d5d7] p-2 bg-[#fcfcfc]">
                  <Flag code="EG" size="m" />
                  <span className="text-[12px] font-mono font-semibold text-[#1f2327]">MD (24x16px)</span>
                </div>
                <div className="flex items-center gap-2 rounded-[8px] border border-[#d3d5d7] p-2 bg-[#fcfcfc]">
                  <Flag code="GB" size="s" />
                  <span className="text-[12px] font-mono font-semibold text-[#1f2327]">SM (18x12px)</span>
                </div>
              </div>
            </div>

            {/* International Flag Grid */}
            <div className="space-y-2 pt-2 border-t border-[#d3d5d7]/60">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">International Flag Matrix & Country Badges:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {COUNTRIES.map((c) => (
                  <CountryBadge
                    key={c.code}
                    code={c.code}
                    name={c.name}
                    dial={c.dial}
                    size="m"
                    className="hover:border-[#00c2cb] transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Unified Table Avatar Component Suite */}
            <div className="border-t border-[#d3d5d7] pt-4 space-y-4">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#00c2cb]">Unified Responsive Table Avatar Suite (Standardized Across All Tables):</p>
                <p className="text-[12px] text-[#6f777f]">Pixel-perfect, responsive aspect-square avatars with fallback initials, country flags, status indicators, and dual participants.</p>
              </div>

              {/* Sizing scale */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#1f2327] uppercase tracking-wider">A. Sizing Scale (XS to XL):</span>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <TableAvatar size="xs" name="Ahmed Al Mansoori" countryCode="AE" />
                    <span className="text-[11px] font-mono text-[#6f777f]">XS (24px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TableAvatar size="sm" name="Sarah Connor" countryCode="US" />
                    <span className="text-[11px] font-mono text-[#6f777f]">SM (28px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TableAvatar size="md" name="Anwar Hosny" countryCode="EG" />
                    <span className="text-[11px] font-mono text-[#6f777f]">MD (32px - Table Standard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TableAvatar size="lg" name="Liam Johnson" countryCode="GB" />
                    <span className="text-[11px] font-mono text-[#6f777f]">LG (36-40px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TableAvatar size="xl" name="Marco Rossi" countryCode="IT" />
                    <span className="text-[11px] font-mono text-[#6f777f]">XL (44px)</span>
                  </div>
                </div>
              </div>

              {/* Real images with country flags & status dots */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#1f2327] uppercase tracking-wider">B. Real Image with Flag Overlay & Dual Participants:</span>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <TableAvatar
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
                      name="Ahmed Al Mansoori"
                      countryCode="AE"
                      size="md"
                    />
                    <span className="text-[13px] font-semibold text-[#1f2327]">Ahmed Al Mansoori</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TableAvatar
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      name="Sarah Connor"
                      countryCode="US"
                      size="md"
                    />
                    <span className="text-[13px] font-semibold text-[#1f2327]">Sarah Connor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TableAvatar
                      name="Khalid Al Qasimi"
                      countryCode="SA"
                      size="md"
                      variant="brand"
                    />
                    <span className="text-[13px] font-semibold text-[#1f2327]">Initials Fallback (K Q)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DualTableAvatar
                      primary={{
                        src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
                        name: 'Fatima Zahra',
                        countryCode: 'AE',
                      }}
                      secondary={{
                        src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
                        name: 'Elena Rostova',
                        countryCode: 'GB',
                      }}
                      size="md"
                    />
                    <span className="text-[13px] font-semibold text-[#1f2327]">Dual Participant (Chats/Deals)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: TDESIGN ICONS (https://tdesign.tencent.com/icons)
           ========================================================================= */}
        <section id="icons" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">8. Iconography Suite (TDesign - tdesign.tencent.com)</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">tdesign-icons-react</span>
          </div>

          <div className="space-y-4">
            {/* Outline Suite */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1f2327]">A. TDesign Standard Line Icons</h3>
                  <p className="text-[12px] text-[#6f777f]">Primary dashboard actions, navigation icons, and card details.</p>
                </div>
                <span className="font-mono text-[11px] text-[#00a4ac] bg-[#e5f6f7] px-2 py-0.5 rounded font-semibold">
                  import from &apos;tdesign-icons-react&apos;
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { icon: TdHome, label: 'HomeIcon' },
                  { icon: TdBuilding, label: 'BuildingIcon' },
                  { icon: TdKey, label: 'KeyIcon' },
                  { icon: TdLocation, label: 'LocationIcon' },
                  { icon: TdMoney, label: 'MoneyIcon' },
                  { icon: TdCreditcard, label: 'CreditcardIcon' },
                  { icon: TdSecured, label: 'SecuredIcon' },
                  { icon: TdLockOn, label: 'LockOnIcon' },
                  { icon: TdUsergroup, label: 'UsergroupIcon' },
                  { icon: TdUser, label: 'UserIcon' },
                  { icon: TdUserVip, label: 'UserVipIcon' },
                  { icon: TdDownload, label: 'DownloadIcon' },
                  { icon: TdFolder, label: 'FolderIcon' },
                  { icon: TdDelete, label: 'DeleteIcon' },
                  { icon: TdChat, label: 'ChatBubbleIcon' },
                  { icon: TdSend, label: 'SendIcon' },
                  { icon: TdNotification, label: 'NotificationIcon' },
                  { icon: TdTime, label: 'TimeIcon' },
                  { icon: TdChartBar, label: 'ChartBarIcon' },
                  { icon: TdStar, label: 'StarIcon' },
                  { icon: TdCheckCircle, label: 'CheckCircleIcon' },
                  { icon: TdSetting, label: 'SettingIcon' },
                  { icon: TdFilter, label: 'FilterIcon' },
                  { icon: TdSearch, label: 'SearchIcon' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      onClick={() => copyToClipboard(item.label, `TDesign ${item.label}`)}
                      className="group p-3 rounded-[10px] bg-[#f8f9fa] border border-[#d3d5d7] hover:border-[#00c2cb] hover:bg-white hover:shadow-xs transition-all cursor-pointer text-center flex flex-col items-center justify-between h-[90px]"
                    >
                      <Icon className="size-6 text-[#1f2327] group-hover:text-[#00c2cb] transition-colors" />
                      <span className="text-[11px] font-mono text-[#6f777f] group-hover:text-[#1f2327] truncate w-full block">
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filled Suite */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1f2327]">B. TDesign Filled / Solid Icons</h3>
                  <p className="text-[12px] text-[#6f777f]">Active tab states, primary badge accolades, and solid highlights.</p>
                </div>
                <span className="font-mono text-[11px] text-[#00a4ac] bg-[#e5f6f7] px-2 py-0.5 rounded font-semibold">
                  import from &apos;tdesign-icons-react&apos;
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { icon: TdHomeFilled, label: 'HomeFilledIcon' },
                  { icon: TdSecuredFilled, label: 'SecuredFilledIcon' },
                  { icon: TdStarFilled, label: 'StarFilledIcon' },
                  { icon: TdCheckCircleFilled, label: 'CheckCircleFilledIcon' },
                  { icon: TdChatFilled, label: 'ChatBubbleFilledIcon' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      onClick={() => copyToClipboard(item.label, `TDesign Filled ${item.label}`)}
                      className="group p-3 rounded-[10px] bg-[#f8f9fa] border border-[#d3d5d7] hover:border-[#00c2cb] hover:bg-white hover:shadow-xs transition-all cursor-pointer text-center flex flex-col items-center justify-between h-[90px]"
                    >
                      <Icon className="size-6 text-[#00c2cb] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-mono text-[#6f777f] group-hover:text-[#1f2327] truncate w-full block">
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: FORM CONTROLS & MICRO-CONTROLS
           ========================================================================= */}
        <section id="inputs" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">9. Form Controls & Interactive Toggles</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Search, Dropdowns, DatePickers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input & Dropdowns */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[15px] font-bold text-[#1f2327]">Search Input & Clear Triggers</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  type="text"
                  value={sampleQuery}
                  onChange={(e) => setSampleQuery(e.target.value)}
                  placeholder="Search by name, ID, or keywords..."
                  className="h-[40px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-9 text-[13px] text-[#1f2327] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb]"
                />
                {sampleQuery && (
                  <button
                    type="button"
                    onClick={() => setSampleQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Dropdown
                  options={[
                    { label: 'Villa', value: 'Villa' },
                    { label: 'Townhouse', value: 'Townhouse' },
                    { label: 'Penthouse', value: 'Penthouse' },
                    { label: 'Apartment', value: 'Apartment' },
                  ]}
                  onSelect={(val) => setSampleDropdown(val)}
                  trigger={
                    <button
                      type="button"
                      className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-sm text-[#1f2327] hover:bg-[#eff1f3]"
                    >
                      <span>{sampleDropdown || 'Property Type'}</span>
                      <ChevronDown className="size-4 text-[#6f777f]" />
                    </button>
                  }
                />
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f8f9fa] rounded-[8px] border border-[#d3d5d7]">
                  <TableCheckbox checked={checkboxState} onChange={setCheckboxState} />
                  <span className="text-[12px] text-[#6f777f]">Table Checkbox</span>
                </div>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="rounded-[14px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-[15px] font-bold text-[#1f2327]">Platform Interactive Toggles</h3>
              <div className="space-y-3">
                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#1f2327]">🔥 Boost Priority</p>
                    <p className="text-[11px] text-[#6f777f]">Prioritizes request on brokers feed</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBoosted(!isBoosted)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                      isBoosted ? 'bg-[#f79009]' : 'bg-[#d3d5d7]'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        isBoosted ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#1f2327]">🌐 Language Auto-Match</p>
                    <p className="text-[11px] text-[#6f777f]">Matches investor preferred language</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoMatch(!autoMatch)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                      autoMatch ? 'bg-[#00c2cb]' : 'bg-[#d3d5d7]'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        autoMatch ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: COMPOSITE UI PATTERNS
           ========================================================================= */}
        <section id="components" className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="size-5 text-[#00c2cb]" />
              <h2 className="text-[20px] font-bold text-[#1f2327]">10. Composite UI Patterns</h2>
            </div>
            <span className="text-[12px] text-[#6f777f]">Live Ready-To-Use Cards</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Card Pattern */}
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-[#1f2327]">A. Property Request Card Pattern:</p>
              {allPlatformRequests[0] && (
                <RequestCard
                  request={allPlatformRequests[0]}
                  onViewDetails={() => alert('View details clicked')}
                />
              )}
            </div>

            {/* Broker Pitch Card Pattern */}
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-[#1f2327]">B. Broker Proposal Pitch Card:</p>
              <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AvatarFlagOverlay code="AE">
                      <div className="size-11 rounded-full overflow-hidden border border-black/10 bg-[#eff1f3]">
                        <img
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
                          alt="Broker"
                          className="size-full object-cover"
                        />
                      </div>
                    </AvatarFlagOverlay>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[15px] font-bold text-[#1f2327]">Sarah Al Hashimi</h4>
                        <PlanBadge property1="Pro" size="sm" />
                      </div>
                      <p className="text-[12px] text-[#6f777f]">Luxury Homes Real Estate • RERA #81920</p>
                    </div>
                  </div>
                  <FigmaStatusBadge status="Matched" />
                </div>

                <div className="rounded-[10px] bg-[#f8f9fa] border border-[#d3d5d7] p-3 space-y-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#1f2327]">Maple 2, Dubai Hills Estate</span>
                    <span className="font-bold text-[#00a4ac]">AED 8,200,000</span>
                  </div>
                  <p className="text-[12px] text-[#6f777f]">
                    Single row, back to park, fully upgraded European kitchen with smart home automation and private landscaped pool.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[12px] font-mono text-[#6f777f]">OFF-91204 • 2h ago</span>
                  <div className="flex items-center gap-2">
                    <MainButton variant="Secondary" size="sm" iconLeft={<MessageSquare />}>
                      Chat
                    </MainButton>
                    <MainButton variant="Primary" size="sm" iconLeft={<DollarSign />}>
                      View Offer
                    </MainButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PlatformShell>
  )
}

export function DesignSystemPage() {
  return (
    <ToastProvider>
      <DesignSystemPageInner />
    </ToastProvider>
  )
}
