'use client'

import * as React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Users,
  FileText,
  Handshake,
  ScrollText,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Megaphone,
  Settings,
  Banknote,
  Briefcase,
  Layers,
  Shield,
  Clock,
  Gauge,
  LineChart,
  BarChart3,
  Bell,
  FileCode,
  Tag as TagIcon,
  Flame,
  UserCheck,
  Bot,
  LayoutDashboard,
  MessageSquare,
  CreditCard,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import {
  ALL_TOOLS_REGISTRY,
  FREQUENTLY_USED,
  isToolItemActive,
  type ToolItem,
} from './all-tools-modal'
import { cn } from '@/lib/utils'

const CATEGORIES: ToolItem['category'][] = [
  'Manage',
  'Advertise',
  'Platform & Settings',
]

export function AllTools() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-[#6f777f]">Loading Platform Suite...</div>}>
      <AllToolsInner />
    </React.Suspense>
  )
}

function AllToolsInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams ? searchParams.get('tab') : null
  const [query, setQuery] = React.useState('')

  const filteredTools = ALL_TOOLS_REGISTRY.filter((tool) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      (tool.description && tool.description.toLowerCase().includes(q))
    )
  })

  return (
    <PlatformShell title="All Tools" eyebrow="Directory" query={query} onQueryChange={setQuery}>
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 sm:p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#00c2cb]">
                  Duseat Platform Suite
                </span>
                <span className="rounded-[4px] bg-[#e5f6f7] px-2 py-0.5 text-[11px] font-bold text-[#00848b]">
                  {ALL_TOOLS_REGISTRY.length} Tools
                </span>
              </div>
              <h1 className="mt-1 text-[24px] sm:text-[32px] font-bold leading-tight text-[#14171a]">
                All tools
              </h1>
              <p className="mt-0.5 max-w-2xl text-[14px] text-[#6f777f]">
                Central navigation center for all marketplace operations, advertising, monetization, and platform settings.
              </p>
            </div>

            {/* Quick Search */}
            <div className="flex items-center gap-2.5 h-[42px] min-w-[280px] max-w-md rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 shadow-2xs focus-within:border-[#00c2cb] focus-within:ring-2 focus-within:ring-[#00c2cb]/20 transition-all">
              <Search className="size-4 text-[#8f969e] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all tools for keywords..."
                className="w-full text-[14px] text-[#14171a] placeholder:text-[#8f969e] bg-transparent outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-[#8f969e] hover:text-[#14171a] font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Frequently Used (Meta Ads Manager Style) */}
        {!query && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
            <h3 className="text-[15px] font-bold text-[#14171a] mb-3.5">Frequently used</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {FREQUENTLY_USED.map((item) => {
                const Icon = item.icon
                const isActive = isToolItemActive(item.href, pathname, currentTab)

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className={cn(
                      'flex flex-col items-center justify-start gap-2 p-3 rounded-[10px] transition-all cursor-pointer group text-center border select-none',
                      isActive
                        ? 'bg-[#e5f6f7] border-[#00c2cb]/40 text-[#00848b] font-semibold shadow-2xs'
                        : 'bg-[#fafbfc] border-[#e4e7eb] hover:bg-[#f0f6fe] hover:border-[#00c2cb]/30 text-[#14171a]'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-12 items-center justify-center rounded-[10px] transition-colors shrink-0 shadow-2xs',
                        isActive
                          ? 'bg-[#00c2cb] text-white'
                          : 'bg-white border border-[#d3d5d7] text-[#565e67] group-hover:border-[#00c2cb] group-hover:text-[#00c2cb]'
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 w-full">
                      <p className={cn('text-[13px] leading-tight font-semibold truncate', isActive ? 'text-[#00848b]' : 'text-[#14171a]')}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-[#6f777f] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 3 Categorized Cards Grid (Manage, Advertise, Platform & Settings) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const items = filteredTools.filter((t) => t.category === category)
            if (items.length === 0) return null

            return (
              <div
                key={category}
                className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#eff1f3]">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#00c2cb]" />
                      <h3 className="text-[16px] font-bold text-[#14171a]">{category}</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6f777f] bg-[#f4f5f6] px-2 py-0.5 rounded-full">
                      {items.length} tools
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 pt-3">
                    {items.map((tool) => {
                      const Icon = tool.icon
                      const isActive = isToolItemActive(tool.href, pathname, currentTab)

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => router.push(tool.href)}
                          className={cn(
                            'flex items-center justify-between gap-3 px-3 py-2.5 rounded-[8px] text-left transition-all cursor-pointer group select-none',
                            isActive
                              ? 'bg-[#e5f6f7] text-[#00848b] font-semibold shadow-2xs'
                              : 'text-[#14171a] hover:bg-[#f4f5f6] hover:text-[#00c2cb]'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              className={cn(
                                'size-4.5 shrink-0 transition-colors',
                                isActive ? 'text-[#00c2cb]' : 'text-[#6f777f] group-hover:text-[#00c2cb]'
                              )}
                            />
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-medium leading-tight truncate">
                                {tool.title}
                              </p>
                              {tool.description && (
                                <p className="text-[11.5px] text-[#8f969e] truncate mt-0.5">
                                  {tool.description}
                                </p>
                              )}
                            </div>
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
              </div>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-12 text-center shadow-2xs">
            <Search className="size-10 mx-auto text-[#8f969e] mb-3" />
            <h3 className="text-[16px] font-bold text-[#14171a]">No tools found</h3>
            <p className="text-[13px] text-[#6f777f] mt-1 max-w-sm mx-auto">
              We couldn't find any tool matching "{query}". Try checking your spelling or searching for general keywords.
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 inline-flex h-[36px] items-center rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-semibold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
