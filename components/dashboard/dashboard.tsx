'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Topbar, type DateRange } from './topbar'
import { Section } from './section'
import { KpiCard } from './kpi-card'
import { ChartsGallery } from './charts-gallery'
import { DealStatus } from './deal-status'
import { LiveActivityFeed } from './live-activity-feed'
import { TopAgents } from './top-agents'
import { LatestRequests } from './latest-requests'
import { FigmaMetricsTable } from './figma-metrics-table'
import { DashboardQuickActions } from './dashboard-quick-actions'
import { ToastProvider, useToast } from './toast'
import { Skeleton } from './primitives'
import { allKpiCards, type KpiCard as KpiCardType } from './data'
import { routeByNavId } from '@/lib/platform-modules'
import { AllToolsModal } from '@/components/platform/all-tools-modal'
import { cn, exportToCsv } from '@/lib/utils'

function matchesQuery(card: KpiCardType, q: string) {
  if (!q) return true
  const hay = [card.title, ...card.supporting.map((s) => s.label)].join(' ').toLowerCase()
  return hay.includes(q.toLowerCase())
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 font-sans">
      <div className="h-28 rounded-2xl border border-border bg-card p-4 animate-pulse" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="rounded-xl border border-border p-4 bg-card">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="mt-3 h-7 w-24" />
            <Skeleton className="mt-4 h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardInner() {
  const { toast } = useToast()
  const router = useRouter()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [active, setActive] = React.useState('dashboard')
  const [range, setRange] = React.useState<DateRange>('week')
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [allToolsOpen, setAllToolsOpen] = React.useState(false)
  const PRIMARY_KPI_IDS = React.useMemo(
    () =>
      new Set([
        'total-users',
        'open-requests',
        'active-deals',
        'revenue-this-month',
        'pending-verifications',
        'active-subscriptions',
      ]),
    []
  )
  const [kpiFilter, setKpiFilter] = React.useState<'primary' | 'all' | 'users' | 'marketplace' | 'finance'>('primary')

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  // Keyboard shortcuts: "/" focus search, "b" toggle sidebar
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (e.key === '/' && !typing) {
        e.preventDefault()
        document.getElementById('dashboard-search')?.focus()
      } else if ((e.key === 'b' || e.key === 'B') && !typing && !e.metaKey && !e.ctrlKey) {
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleNavigate = (id: string, label: string) => {
    if (id === 'tools') {
      setAllToolsOpen(true)
      return
    }
    setActive(id)
    const destination = routeByNavId[id]
    if (destination && destination !== '/') {
      toast({ variant: 'info', title: 'Opening module', description: label })
      router.push(destination)
    }
  }

  const openCard = (card: KpiCardType) => {
    if (card.href.startsWith('/')) {
      router.push(card.href)
      return
    }
    const mapping: Record<string, string> = {
      '#users': '/all-tools',
      '#investors': '/investors',
      '#agents': '/agents',
      '#revenue': '/finance',
      '#requests': '/requests',
      '#offers': '/offers',
      '#deals': '/deals',
      '#verification': '/verification',
      '#reports': '/reports',
      '#subscriptions': '/subscriptions',
    }
    const target = mapping[card.href] || '/all-tools'
    router.push(target)
  }

  const cardAction = (action: string, card: KpiCardType) => {
    if (action === 'pin') toast({ variant: 'success', title: 'Pinned', description: `${card.title} pinned to top.` })
    else if (action === 'export') {
      const headers = ['Metric', 'Current Value', 'Growth', 'Trend']
      const rows = [
        [card.title, card.value, card.growth, card.trend],
        ...card.supporting.map((s) => [s.label, s.value, s.delta || '—', s.trend || 'up']),
      ]
      exportToCsv(`${card.id}_kpi_export`, headers, rows)
      toast({ variant: 'success', title: 'Export started', description: `${card.title} CSV downloaded.` })
    } else openCard(card)
  }

  const handleExportFullReport = () => {
    const headers = ['Metric', 'Category', 'Value', 'Growth']
    const rows = allKpiCards.map((c) => [
      c.title,
      c.category.toUpperCase(),
      c.value,
      c.growth,
    ])
    exportToCsv(`duseat_complete_dashboard_kpis_${new Date().toISOString().slice(0, 10)}`, headers, rows)
    toast({ variant: 'success', title: 'Report exported', description: 'Platform summary CSV downloaded.' })
  }

  const filteredKpis = allKpiCards.filter((card) => {
    if (kpiFilter === 'primary') return PRIMARY_KPI_IDS.has(card.id) && matchesQuery(card, query)
    const matchCategory = kpiFilter === 'all' || card.category === kpiFilter
    return matchCategory && matchesQuery(card, query)
  })

  return (
    <div className="flex min-h-dvh bg-background font-sans">
      <Sidebar
        collapsed={collapsed}
        active={active}
        onNavigate={(id, label) => {
          handleNavigate(id, label)
          setMobileOpen(false)
        }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobile={() => setMobileOpen(true)}
          range={range}
          onRangeChange={(r) => {
            setRange(r)
            toast({ variant: 'info', title: 'Date range updated', description: `Showing metrics for: ${r}` })
          }}
          query={query}
          onQueryChange={setQuery}
          onExport={handleExportFullReport}
        />

        <main className="flex w-full min-w-0 flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* 1. Quick Actions Suite (Figma & User Spec) */}
              <DashboardQuickActions />

              {/* 2. Executive KPI Cards with 6 Primary Default per Section 13 */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div>
                    <h2 className="text-[18px] sm:text-[20px] font-bold text-[#202428]">
                      {kpiFilter === 'primary' ? 'Primary Operational KPIs (6)' : `Executive KPI Metrics (${filteredKpis.length})`}
                    </h2>
                    <p className="text-[13px] text-[#68727D]">
                      {kpiFilter === 'primary'
                        ? 'Core marketplace velocity, user acquisition, closing pipeline, and revenue'
                        : 'Granular telemetry breakdown across users, marketplace pipelines, and monetization'}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {(
                      [
                        { id: 'primary', label: 'Primary (6)' },
                        { id: 'all', label: 'All Metrics (19)' },
                        { id: 'users', label: 'Users (8)' },
                        { id: 'marketplace', label: 'Marketplace (5)' },
                        { id: 'finance', label: 'Finance & Ops (6)' },
                      ] as const
                    ).map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setKpiFilter(pill.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-[8px] font-semibold transition-all cursor-pointer',
                          kpiFilter === pill.id
                            ? 'bg-[#06B6C9] text-white shadow-xs'
                            : 'bg-white border border-[#E2E5E8] text-[#68727D] hover:text-[#202428] hover:bg-[#F8F9FA]'
                        )}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={cn(
                    'grid gap-3',
                    kpiFilter === 'primary'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  )}
                >
                  {filteredKpis.map((card, i) => (
                    <KpiCard key={card.id} card={card} index={i} onOpen={openCard} onAction={cardAction} />
                  ))}
                  {filteredKpis.length === 0 && <NoMatch />}
                </div>
              </div>

              {/* 3. 8 Interactive Multi-Charts Gallery + Deal Status */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ChartsGallery />
                </div>
                <div>
                  <DealStatus />
                </div>
              </div>

              {/* 4. Figma Standard Telemetry & Performance Matrix Table (Figma Node 234-12116) */}
              <FigmaMetricsTable />

              {/* 5. Live Activity Feed (9 Events) + Top Agents + Latest Requests */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <LiveActivityFeed onViewAll={() => router.push('/activity')} />
                <TopAgents query={query} onViewAll={() => router.push('/agents')} />
                <LatestRequests query={query} onViewAll={() => router.push('/requests')} />
              </div>

              <p className="pt-2 text-center text-xs text-muted-foreground">
                Tip: press <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-medium">/</kbd> to search ·{' '}
                <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-medium">B</kbd> to toggle sidebar
              </p>
            </>
          )}
        </main>
      </div>

      <AllToolsModal isOpen={allToolsOpen} onClose={() => setAllToolsOpen(false)} sidebarCollapsed={collapsed} />
    </div>
  )
}

function NoMatch() {
  return (
    <div className="col-span-full py-8 text-center bg-white rounded-[12px] border border-[#d3d5d7] text-sm text-muted-foreground">
      No KPI metrics match your search or filter criteria.
    </div>
  )
}

export function Dashboard() {
  return (
    <ToastProvider>
      <DashboardInner />
    </ToastProvider>
  )
}
