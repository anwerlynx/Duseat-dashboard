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
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur-xl">
      <div className="flex h-[60px] sm:h-[64px] w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile: open drawer */}
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="flex size-9 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
        >
          <Menu className="size-[18px]" />
        </button>

        {/* Desktop: collapse rail */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden size-9 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:flex"
        >
          {collapsed ? <PanelLeft className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
        </button>

        <div className="hidden h-7 w-px bg-border sm:block" />

        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="mb-0.5 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <span>Home</span>
            <ChevronDown className="size-3 -rotate-90" />
            <span className="font-medium text-foreground">Overview</span>
          </nav>
          <h1 className="truncate text-lg font-bold leading-tight text-foreground sm:text-xl">Dashboard</h1>
        </div>

        {/* Search */}
        <div className="relative hidden w-56 md:block lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="dashboard-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search metrics, agents, requests…"
            aria-label="Search dashboard"
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-8 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Date range */}
        <Dropdown
          value={range}
          onSelect={(v) => onRangeChange(v as DateRange)}
          align="end"
          options={(Object.keys(rangeLabels) as DateRange[]).map((r) => ({
            label: rangeLabels[r],
            value: r,
            icon: <Calendar className="size-4 text-muted-foreground" />,
          }))}
          trigger={
            <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="hidden sm:inline">{rangeLabels[range]}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </span>
          }
          ariaLabel="Select date range"
        />

        {/* Export full report */}
        <button
          type="button"
          onClick={onExport}
          title="Export CSV Summary"
          aria-label="Export report"
          className="hidden size-9 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
        >
          <Download className="size-[18px]" />
        </button>

        {/* Messaging Panel */}
        <MessagingPanel />

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
            <span className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-border transition-transform hover:scale-105">
              AK
            </span>
          }
          ariaLabel="User Profile Menu"
        />
      </div>
    </header>
  )
}

export { rangeLabels }
