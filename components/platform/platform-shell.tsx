'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  Calendar,
  X,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Download,
} from 'lucide-react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { NotificationsPanel } from '@/components/notifications-panel'
import { MessagingPanel } from '@/components/messaging-panel'
import { Dropdown } from '@/components/dashboard/menu'
import { ScheduleExportModal, type ScheduleExportData } from './schedule-export-modal'
import { AllToolsModal } from './all-tools-modal'
import { routeByNavId } from '@/lib/platform-modules'

interface PlatformShellProps {
  title: string
  eyebrow: string
  description?: string
  badgeText?: string
  accent?: string
  hideSearch?: boolean
  activeNav?: string
  children: React.ReactNode
  query?: string
  onQueryChange?: (value: string) => void
  actions?: React.ReactNode
}

export function PlatformShell({
  title,
  eyebrow,
  description,
  badgeText,
  accent,
  hideSearch = false,
  activeNav,
  children,
  query = '',
  onQueryChange,
  actions,
}: PlatformShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scheduleExportOpen, setScheduleExportOpen] = React.useState(false)
  const [allToolsOpen, setAllToolsOpen] = React.useState(false)
  const active = pathname === '/' ? 'dashboard' : pathname.split('/')[1]

  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        event.preventDefault()
        document.getElementById('platform-search')?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const navigate = (id: string) => {
    if (id === 'tools') {
      setAllToolsOpen(true)
      setMobileOpen(false)
      return
    }
    router.push(routeByNavId[id] ?? `/${id}`)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-dvh bg-background w-full overflow-x-clip">
      <Sidebar collapsed={collapsed} active={active} onNavigate={navigate} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col w-full overflow-x-clip">
        <header className="sticky top-0 z-30 border-b border-[#E2E5E8] bg-white/95 backdrop-blur-xl">
          <div className="flex min-h-[56px] sm:min-h-[60px] w-full items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 py-2">
            {/* Left: Collapse toggle, divider, breadcrumbs & title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                className="flex size-9 items-center justify-center rounded-[8px] border border-[#E2E5E8] bg-white text-[#202428] transition-colors hover:bg-[#F8F9FA] lg:hidden cursor-pointer shrink-0"
              >
                <Menu className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setCollapsed((value) => !value)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden size-[36px] items-center justify-center rounded-[8px] border border-[#E2E5E8] bg-white text-[#202428] transition-colors hover:bg-[#F8F9FA] cursor-pointer lg:flex shrink-0"
              >
                {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
              </button>
              <div className="hidden h-8 w-[1px] bg-[#E2E5E8] sm:block" />
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <div className="hidden sm:flex items-center gap-1 text-[11px] sm:text-[12px] leading-[16px] text-[#68727D] font-medium font-sans truncate">
                  <Link href="/" className="cursor-pointer hover:text-[#202428] transition-colors shrink-0">
                    Duseat
                  </Link>
                  {eyebrow && (
                    <>
                      <ChevronRight className="size-3 text-[#8A939D] shrink-0" />
                      <span className="capitalize truncate">{eyebrow}</span>
                    </>
                  )}
                  <ChevronRight className="size-3 text-[#8A939D] shrink-0" />
                  <span className="text-[#202428] font-semibold truncate">{title}</span>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  {eyebrow && (
                    <span className="text-[9.5px] font-bold text-[#00c2cb] uppercase tracking-wider block sm:hidden truncate leading-tight mb-0.5">
                      {eyebrow}
                    </span>
                  )}
                  <h1 className="truncate text-[16px] sm:text-[22px] font-bold leading-[20px] sm:leading-[28px] text-[#202428] font-sans tracking-tight">
                    {title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Right: Exactly 2 compact elements on mobile (Notifications + Avatar), full toolbar on sm/md+ */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {onQueryChange && (
                <div className="relative hidden w-44 md:block xl:w-60">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    id="platform-search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder={`Search…`}
                    aria-label={`Search`}
                    className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-8 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 font-sans transition-all"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => onQueryChange('')}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#8A939D] hover:bg-[#F5F6F7]"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Export Button - Hidden on mobile (< sm) */}
              <div className="hidden sm:block">
                <Dropdown
                  align="end"
                  floating
                  options={[
                    { label: 'Export as CSV', value: 'csv' },
                    { label: 'Export as PDF Audit', value: 'pdf' },
                    { label: 'Export Full JSON Record', value: 'json' },
                    { label: 'Schedule Export...', value: 'schedule' },
                  ]}
                  onSelect={(val) => {
                    if (val === 'schedule') {
                      setScheduleExportOpen(true)
                    } else {
                      alert(`Exported data as ${val.toUpperCase()}`)
                    }
                  }}
                  trigger={
                    <span className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#202428] px-3 text-[13px] sm:text-[14px] font-medium text-white shadow-xs hover:bg-[#2e3338] transition-colors cursor-pointer font-sans">
                      <svg className="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Export</span>
                      <ChevronRight className="size-3.5 rotate-90 opacity-70" />
                    </span>
                  }
                  ariaLabel="Export Options"
                />
              </div>

              {/* Refresh / Updated State - Hidden on mobile (< sm) */}
              <button
                type="button"
                onClick={() => router.refresh()}
                className="hidden sm:flex h-[36px] items-center gap-2 rounded-[8px] border border-[#E2E5E8] bg-white px-2.5 text-[13px] font-medium text-[#202428] hover:bg-[#F8F9FA] transition-colors cursor-pointer font-sans"
              >
                <svg className="size-3.5 text-[#68727D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span className="hidden md:inline text-[#68727D]">Updated just now</span>
              </button>

              {actions && <div className="hidden sm:flex items-center gap-2">{actions}</div>}

              {/* Messaging - Hidden on mobile (< md) */}
              <div className="hidden md:flex">
                <MessagingPanel />
              </div>

              {/* Element 1 on Mobile: Notifications */}
              <NotificationsPanel />

              {/* Element 2 on Mobile: Profile Menu */}
              <Dropdown
                align="end"
                floating
                options={[
                  { label: 'Admin Profile', value: 'profile', icon: <User className="size-4" /> },
                  { label: 'Export Data (CSV)', value: 'export-csv', icon: <Download className="size-4" /> },
                  { label: 'Platform Settings', value: 'settings', icon: <Settings className="size-4" /> },
                  { label: 'Sign Out', value: 'signout', destructive: true, icon: <LogOut className="size-4" /> },
                ]}
                onSelect={(val) => {
                  if (val === 'profile') router.push('/admin')
                  else if (val === 'settings') router.push('/settings')
                  else if (val === 'signout') router.push('/sign-in')
                  else if (val === 'export-csv') alert('Exporting platform data as CSV...')
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
        <main className="min-w-0 flex-1 w-full overflow-x-clip">{children}</main>
      </div>

      <ScheduleExportModal
        isOpen={scheduleExportOpen}
        onClose={() => setScheduleExportOpen(false)}
        onSchedule={(data) => {
          alert(`Scheduled ${data.frequency} export (${data.format.toUpperCase()}) to ${data.recipients.join(', ')}`)
        }}
        defaultName={`${title} - Weekly Export`}
      />

      <AllToolsModal isOpen={allToolsOpen} onClose={() => setAllToolsOpen(false)} sidebarCollapsed={collapsed} />
    </div>
  )
}
