'use client'

import * as React from 'react'
import {
  PanelLeftClose,
  PanelLeft,
  Search,
  Calendar,
  Download,
  Bell,
  ChevronDown,
  X,
  Menu,
  User,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Dropdown } from './menu'
import { NotificationsPanel } from '@/components/notifications-panel'
import { MessagingPanel } from '@/components/messaging-panel'

export type DateRange = 'today' | 'week' | 'month' | 'year'

const rangeLabels: Record<DateRange, string> = {
  today: 'Today',
  week: 'This week',
  month: 'This month',
  year: 'This year',
}

interface TopbarProps {
  collapsed: boolean
  onToggleSidebar: () => void
  onOpenMobile: () => void
  range: DateRange
  onRangeChange: (r: DateRange) => void
  query: string
  onQueryChange: (q: string) => void
  onExport: () => void
  onNotifications?: () => void
}

export function Topbar({
  collapsed,
  onToggleSidebar,
  onOpenMobile,
  range,
  onRangeChange,
  query,
  onQueryChange,
  onExport,
}: TopbarProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E5E8] bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-[56px] sm:min-h-[60px] w-full items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 py-2">
        {/* Left: Mobile drawer & Desktop sidebar toggle & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          {/* Mobile: open drawer */}
          <button
            type="button"
            onClick={onOpenMobile}
            aria-label="Open navigation menu"
            className="flex size-9 items-center justify-center rounded-[8px] border border-[#E2E5E8] bg-white text-[#202428] transition-colors hover:bg-[#F8F9FA] lg:hidden cursor-pointer shrink-0"
          >
            <Menu className="size-5" />
          </button>

          {/* Desktop: collapse rail */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden size-[36px] items-center justify-center rounded-[8px] border border-[#E2E5E8] bg-white text-[#202428] transition-colors hover:bg-[#F8F9FA] cursor-pointer lg:flex shrink-0"
          >
            {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>

          <div className="hidden h-8 w-[1px] bg-[#E2E5E8] sm:block" />

          <div className="min-w-0 flex flex-col justify-center flex-1">
            <div className="hidden sm:flex items-center gap-1 text-[11px] sm:text-[12px] leading-[16px] text-[#68727D] font-medium font-sans truncate">
              <span className="cursor-pointer hover:text-[#202428] transition-colors shrink-0">Duseat</span>
              <ChevronDown className="size-3 -rotate-90 text-[#8A939D] shrink-0" />
              <span className="text-[#202428] font-semibold truncate">Dashboard</span>
            </div>
            <span className="text-[9.5px] font-bold text-[#00c2cb] uppercase tracking-wider block sm:hidden truncate leading-tight mb-0.5">
              Duseat Dashboard
            </span>
            <h1 className="truncate text-[16px] sm:text-[22px] font-bold leading-[20px] sm:leading-[28px] text-[#202428] font-sans tracking-tight">
              Executive Overview
            </h1>
          </div>
        </div>

        {/* Right: Search, Date range, Export, Panels, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Search */}
          <div className="relative hidden w-44 md:block xl:w-60">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
            <input
              id="dashboard-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search metrics, agents, requests…"
              aria-label="Search dashboard"
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-8 text-[14px] text-[#1f2327] outline-none transition-colors placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 font-sans"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onQueryChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#8A939D] hover:bg-[#F5F6F7]"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Date range (hidden on mobile) */}
          <div className="hidden sm:block">
            <Dropdown
              value={range}
              onSelect={(v) => onRangeChange(v as DateRange)}
              align="end"
              options={(Object.keys(rangeLabels) as DateRange[]).map((r) => ({
                label: rangeLabels[r],
                value: r,
                icon: <Calendar className="size-4 text-[#6f777f]" />,
              }))}
              trigger={
                <span className="inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] shadow-2xs transition-colors hover:bg-[#eff1f3] cursor-pointer">
                  <Calendar className="size-4 text-[#6f777f]" />
                  <span>{rangeLabels[range]}</span>
                  <ChevronDown className="size-3.5 text-[#9da4ae]" />
                </span>
              }
              ariaLabel="Select date range"
            />
          </div>

          {/* Export full report (hidden on mobile) */}
          <button
            type="button"
            onClick={onExport}
            title="Export CSV Summary"
            aria-label="Export report"
            className="hidden sm:flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#202428] px-3 text-[13px] sm:text-[14px] font-medium text-white shadow-xs hover:bg-[#2e3338] transition-colors cursor-pointer font-sans"
          >
            <Download className="size-4 text-white" />
            <span>Export</span>
          </button>

          {/* Messaging Panel (hidden on mobile to prevent overflow) */}
          <div className="hidden md:block">
            <MessagingPanel />
          </div>

          {/* Notifications Panel */}
          <NotificationsPanel />

          {/* User profile dropdown */}
          <Dropdown
            align="end"
            floating
            options={[
              { label: 'Admin Profile', value: 'profile', icon: <User className="size-4" /> },
              { label: 'Platform Settings', value: 'settings', icon: <Settings className="size-4" /> },
              { label: 'Sign Out', value: 'signout', destructive: true, icon: <LogOut className="size-4" /> },
            ]}
            onSelect={(val) => {
              if (val === 'profile') router.push('/admin')
              else if (val === 'settings') router.push('/settings')
              else if (val === 'signout') router.push('/sign-in')
            }}
            trigger={
              <span className="flex size-[36px] cursor-pointer items-center justify-center rounded-[8px] border border-[#E2E5E8] bg-[#06B6C9] text-xs font-bold text-white shadow-xs transition-transform hover:scale-105 font-sans">
                AK
              </span>
            }
            ariaLabel="User Profile Menu"
          />
        </div>
      </div>
    </header>
  )
}

export { rangeLabels }
