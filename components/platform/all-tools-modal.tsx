'use client'

import * as React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  Trash2,
  Headphones,
  ShieldCheck,
  FileText,
  ScrollText,
  Handshake,
  MessageSquare,
  CreditCard,
  Banknote,
  BarChart3,
  LineChart,
  Bot,
  Bell,
  FileCode,
  Megaphone,
  Settings,
  HelpCircle,
  Clock,
  Gauge,
  Briefcase,
  TrendingUp,
  Tag as TagIcon,
  Flame,
  Shield,
  Layers,
  KeyRound,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToolItem {
  id: string
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description?: string
  category: 'Manage' | 'Advertise' | 'Platform & Settings'
}

export const ALL_TOOLS_REGISTRY: ToolItem[] = [
  // 1. Manage (Core Platform Operations)
  { id: 'dashboard', title: 'Account Overview', href: '/', icon: LayoutDashboard, category: 'Manage', description: 'Platform overview and key executive KPI metrics' },
  { id: 'investors', title: 'Investors Directory', href: '/investors', icon: Users, category: 'Manage', description: 'Investor profiles, KYC records and buyer briefs' },
  { id: 'agents', title: 'Agents & Brokers', href: '/agents', icon: UserCheck, category: 'Manage', description: 'Licensed RERA brokers and agency directories' },
  { id: 'suspended', title: 'Suspended Users', href: '/users/suspended', icon: UserX, category: 'Manage', description: 'Account enforcement penalties, bans, and suspension audits' },
  { id: 'deleted', title: 'Deleted Archive', href: '/users/deleted', icon: Trash2, category: 'Manage', description: 'Soft-deleted accounts retention and restoration desk' },
  { id: 'verification', title: 'Verification Center', href: '/verification', icon: ShieldCheck, category: 'Manage', badge: 'Active', description: 'Audit compliance, ID cards, and trade licenses' },
  { id: 'requests', title: 'Property Requests', href: '/requests', icon: FileText, category: 'Manage', description: 'Investor demand briefs and property criteria' },
  { id: 'offers', title: 'Offers & Pitches', href: '/offers', icon: ScrollText, category: 'Manage', description: 'Agent proposals and developer pitches' },
  { id: 'deals', title: 'Deals & Transactions', href: '/deals', icon: Handshake, category: 'Manage', description: 'Transaction pipeline and closing progress' },
  { id: 'chats', title: 'Conversations & Chats', href: '/chats', icon: MessageSquare, category: 'Manage', description: 'Investor-to-broker live negotiations' },
  { id: 'ai-moderation', title: 'AI Moderation & Trust', href: '/ai-moderation', icon: Bot, category: 'Manage', badge: 'AI', description: 'Automated spam detection and fraud prevention' },

  // 2. Advertise & Growth (Marketing & Analytics)
  { id: 'business-intelligence', title: 'Business Intelligence', href: '/business-intelligence', icon: TrendingUp, category: 'Advertise', badge: 'Executive', description: 'Marketplace conversion funnel, LTV/CAC and forecasting' },
  { id: 'marketing', title: 'Campaigns & Ads', href: '/marketing?tab=campaigns', icon: Megaphone, category: 'Advertise', description: 'Marketing campaigns, promotions and sponsored placements' },
  { id: 'referrals', title: 'Referral Program', href: '/marketing?tab=referrals', icon: Users, category: 'Advertise', description: 'Affiliate tracking, rewards and agent referrals' },
  { id: 'promo-codes', title: 'Promotional Codes', href: '/marketing?tab=promos', icon: TagIcon, category: 'Advertise', description: 'Discount codes, vouchers and seasonal discounts' },
  { id: 'featured-listings', title: 'Featured Listings', href: '/marketing?tab=featured', icon: Flame, category: 'Advertise', badge: 'Hot', description: 'Boosted property listings on the investor feed' },
  { id: 'analytics', title: 'Analytics Suite', href: '/analytics', icon: BarChart3, category: 'Advertise', description: 'Acquisition funnels, conversions and market trends' },
  { id: 'reports', title: 'Custom Reports', href: '/reports', icon: LineChart, category: 'Advertise', description: 'Custom scheduled reports and CSV data export engine' },
  { id: 'notifications', title: 'Notifications Hub', href: '/notifications', icon: Bell, category: 'Advertise', description: 'Push broadcasts, SMS and automated system alerts' },
  { id: 'cms', title: 'Content Management (CMS)', href: '/cms', icon: FileCode, category: 'Advertise', description: 'Landing pages, blog posts, FAQs and legal pages' },

  // 3. Platform & Settings (System Configuration)
  { id: 'support', title: 'Support Center', href: '/support', icon: Headphones, category: 'Platform & Settings', badge: 'Helpdesk', description: 'Triage user tickets, bug reports, and resolution logs' },
  { id: 'settings', title: 'Platform Settings', href: '/settings', icon: Settings, category: 'Platform & Settings', description: 'Centralized platform rules, feature flags and policies' },
  { id: 'subscriptions', title: 'Subscriptions & Plans', href: '/subscriptions', icon: CreditCard, category: 'Platform & Settings', badge: 'Pro/Elite', description: 'Agent monthly & annual plan management' },
  { id: 'finance', title: 'Finance & Ledger', href: '/finance', icon: Banknote, category: 'Platform & Settings', description: 'Revenue ledger, payouts, and escrow transfers' },
  { id: 'admin', title: 'Admin & Role Access', href: '/admin', icon: Briefcase, category: 'Platform & Settings', description: 'Staff permissions, roles and team access control' },
  { id: 'activity', title: 'Audit & Activity Log', href: '/activity', icon: Clock, category: 'Platform & Settings', description: 'Immutable system audit trail and compliance actions' },
  { id: 'monitoring', title: 'System Monitoring', href: '/monitoring', icon: Gauge, category: 'Platform & Settings', description: 'Real-time telemetry, pod health, redis queues and error logs' },
  { id: 'integrations', title: 'Integrations & Webhooks', href: '/settings?tab=integrations', icon: Layers, category: 'Platform & Settings', description: 'Google Maps, Stripe, Checkout and API keys' },
  { id: 'security', title: 'Security & 2FA', href: '/settings?tab=security', icon: Shield, category: 'Platform & Settings', description: 'Authentication policies and active session controls' },
]

export const FREQUENTLY_USED = [
  { label: 'Ads Manager', href: '/marketing?tab=campaigns', icon: Megaphone, subtitle: 'Marketing & Ads' },
  { label: 'Billing & payments', href: '/finance', icon: Banknote, subtitle: 'Finance & Ledger' },
  { label: 'Audiences & Users', href: '/investors', icon: Users, subtitle: 'Investor Directory' },
  { label: 'Business settings', href: '/settings', icon: Settings, subtitle: 'Platform Config' },
  { label: 'Events Manager', href: '/verification', icon: ShieldCheck, subtitle: 'Verification Center' },
  { label: 'Commerce Manager', href: '/requests', icon: FileText, subtitle: 'Property Requests' },
]

export function isToolItemActive(
  toolHref: string,
  pathname: string,
  currentTab: string | null
): boolean {
  const [toolPath, toolQuery] = toolHref.split('?')

  // Base path must match
  if (pathname !== toolPath) {
    if (toolPath !== '/' && pathname.startsWith(toolPath + '/')) {
      return true
    }
    return false
  }

  // If tool specifies a ?tab= parameter
  if (toolQuery) {
    const params = new URLSearchParams(toolQuery)
    const expectedTab = params.get('tab')
    if (expectedTab) {
      if (currentTab === expectedTab) return true
      // On /marketing, if no tab param is provided, default to campaigns
      if (!currentTab && expectedTab === 'campaigns' && toolPath === '/marketing') {
        return true
      }
      return false
    }
  }

  // If tool has NO query params (e.g. general /settings)
  if (currentTab) {
    if (toolPath === '/marketing') {
      return currentTab === 'overview' || currentTab === 'campaigns'
    }
    if (toolPath === '/settings') {
      return currentTab === 'general'
    }
  }

  return true
}

const CATEGORIES: ToolItem['category'][] = [
  'Manage',
  'Advertise',
  'Platform & Settings',
]

interface AllToolsModalProps {
  isOpen: boolean
  onClose: () => void
  sidebarCollapsed?: boolean
}

export function AllToolsModal(props: AllToolsModalProps) {
  if (!props.isOpen) return null

  return (
    <React.Suspense fallback={null}>
      <AllToolsModalInner {...props} />
    </React.Suspense>
  )
}

function AllToolsModalInner({ isOpen, onClose, sidebarCollapsed = false }: AllToolsModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams ? searchParams.get('tab') : null
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredTools = ALL_TOOLS_REGISTRY.filter((tool) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      (tool.description && tool.description.toLowerCase().includes(q))
    )
  })

  const handleSelectTool = (href: string) => {
    onClose()
    router.push(href)
  }

  return (
    <>
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity"
        aria-hidden="true"
      />

      {/* Flyout Drawer / Modal styled exactly like Meta Ads Manager All Tools */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col w-[94vw] sm:w-[620px] md:w-[680px] lg:w-[740px] border-r border-[#d3d5d7] bg-[#f7f8fa] shadow-2xl overflow-hidden font-sans',
          sidebarCollapsed ? 'lg:left-[68px]' : 'lg:left-[230px]',
          'left-0'
        )}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#e4e7eb] bg-white">
          <h2 className="text-[20px] font-bold text-[#14171a] tracking-tight">All tools</h2>
          
          <div className="flex items-center gap-3">
            <Link
              href="/all-tools"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#00848b] hover:text-[#00c2cb] transition-colors"
            >
              <span>Duseat Platform Suite</span>
              <ExternalLink className="size-3.5" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#14171a] transition-colors cursor-pointer"
              aria-label="Close All Tools"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="px-6 py-3.5 bg-white border-b border-[#e4e7eb]">
          <div className="flex items-center gap-2.5 h-[40px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 shadow-2xs focus-within:border-[#00c2cb] focus-within:ring-2 focus-within:ring-[#00c2cb]/20 transition-all">
            <Search className="size-4 text-[#8f969e] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all tools for keywords"
              className="w-full text-[14px] text-[#14171a] placeholder:text-[#8f969e] bg-transparent outline-none font-sans"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#8f969e] hover:text-[#14171a] text-xs font-semibold px-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-sans">
          {/* 1. Frequently Used Card */}
          {!query && (
            <div className="rounded-[12px] bg-white p-4 sm:p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] border border-[#d3d5d7]">
              <h3 className="text-[15px] font-bold text-[#14171a] mb-3.5">Frequently used</h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                {FREQUENTLY_USED.map((item) => {
                  const Icon = item.icon
                  const isActive = isToolItemActive(item.href, pathname, currentTab)

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSelectTool(item.href)}
                      className={cn(
                        'flex flex-col items-center justify-start gap-2 p-2 rounded-[8px] transition-all cursor-pointer group text-center select-none',
                        isActive
                          ? 'bg-[#e5f6f7] text-[#00848b] font-semibold'
                          : 'hover:bg-[#f4f5f6] text-[#14171a]'
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-11 items-center justify-center rounded-[10px] transition-colors shrink-0 shadow-2xs',
                          isActive
                            ? 'bg-[#00c2cb] text-white'
                            : 'bg-[#f0f2f5] text-[#565e67] group-hover:bg-[#e5f6f7] group-hover:text-[#00c2cb]'
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <span className={cn('text-[12px] leading-tight line-clamp-2', isActive ? 'text-[#00848b] font-bold' : 'text-[#14171a]')}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2. Categorized Section Cards (Manage & Advertise & Platform) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {CATEGORIES.map((category) => {
              const items = filteredTools.filter((t) => t.category === category)
              if (items.length === 0) return null

              return (
                <div
                  key={category}
                  className="rounded-[12px] bg-white p-4 sm:p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] border border-[#d3d5d7] flex flex-col"
                >
                  <h3 className="text-[16px] font-bold text-[#14171a] pb-2.5 border-b border-[#eff1f3] flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-[11px] font-semibold text-[#6f777f] bg-[#f4f5f6] px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </h3>

                  <div className="flex flex-col gap-1 pt-2.5">
                    {items.map((tool) => {
                      const Icon = tool.icon
                      const isActive = isToolItemActive(tool.href, pathname, currentTab)

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool.href)}
                          className={cn(
                            'flex items-center justify-between gap-2.5 px-3 py-2 rounded-[8px] text-left transition-all cursor-pointer group select-none',
                            isActive
                              ? 'bg-[#e5f6f7] text-[#00848b] font-semibold shadow-2xs'
                              : 'text-[#14171a] hover:bg-[#f4f5f6] hover:text-[#00c2cb]'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={cn(
                                'size-4 shrink-0 transition-colors',
                                isActive ? 'text-[#00c2cb]' : 'text-[#6f777f] group-hover:text-[#00c2cb]'
                              )}
                            />
                            <span className="text-[13.5px] font-medium leading-tight truncate">
                              {tool.title}
                            </span>
                          </div>

                          {tool.badge && (
                            <span
                              className={cn(
                                'text-[10.5px] font-bold px-2 py-0.5 rounded-[4px] shrink-0 leading-none',
                                isActive
                                  ? 'bg-[#00c2cb] text-white'
                                  : 'bg-[#eff1f3] text-[#6f777f]'
                              )}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="p-10 text-center bg-white rounded-[12px] border border-[#d3d5d7]">
              <Search className="size-8 mx-auto text-[#9da4ae] mb-2" />
              <p className="text-[15px] font-bold text-[#14171a]">No tools found</p>
              <p className="text-[13px] text-[#6f777f] mt-1">Try searching for keywords like "Verification", "Finance", or "Marketing"</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
