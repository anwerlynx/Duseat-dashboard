'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Topbar, type DateRange } from './topbar'
import { Section } from './section'
import { KpiCard } from './kpi-card'
import { RevenueChart } from './revenue-chart'
import { DealStatus } from './deal-status'
import { RecentActivity } from './recent-activity'
import { TopAgents } from './top-agents'
import { LatestRequests } from './latest-requests'
import { ToastProvider, useToast } from './toast'
import { Skeleton } from './primitives'
import { platformOverview, marketplaceMetrics, operationalMetrics, type KpiCard as KpiCardType } from './data'
import { routeByNavId } from '@/lib/platform-modules'

function matchesQuery(card: KpiCardType, q: string) {
  if (!q) return true
  const hay = [card.title, ...card.supporting.map((s) => s.label)].join(' ').toLowerCase()
  return hay.includes(q.toLowerCase())
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1].map((s) => (
        <div key={s} className="rounded-2xl border border-border bg-card p-4">
          <Skeleton className="mb-4 h-5 w-40" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="mt-3 h-7 w-24" />
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
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

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
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
    setActive(id)
    const destination = routeByNavId[id]
    if (destination && destination !== '/') {
      toast({ variant: 'info', title: 'Opening module', description: label })
      router.push(destination)
    }
  }

  const openCard = (card: KpiCardType) => {
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
    const target = mapping[card.href]
    if (target) {
      toast({ variant: 'info', title: `Opening ${card.title}`, description: 'Navigating to platform module…' })
      router.push(target)
    } else {
      toast({ variant: 'info', title: `Opening ${card.title}`, description: 'Metrics details updated.' })
    }
  }

  const cardAction = (action: string, card: KpiCardType) => {
    if (action === 'pin') toast({ variant: 'success', title: 'Pinned', description: `${card.title} pinned to top.` })
    else if (action === 'export') {
      const rows = [
        ['Metric', 'Current Value', 'Growth', 'Trend'],
        [card.title, `"${card.value}"`, card.growth, card.trend],
        ...card.supporting.map((s) => [s.label, `"${s.value}"`, s.delta || '—', s.trend]),
      ]
      const csv = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
      const encodedUri = encodeURI(csv)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `${card.id}_kpi_export.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({ variant: 'success', title: 'Export started', description: `${card.title} CSV downloaded.` })
    } else openCard(card)
  }

  const handleExportFullReport = () => {
    const allCards = [...platformOverview, ...marketplaceMetrics, ...operationalMetrics]
    const headers = ['Category', 'Metric', 'Value', 'Growth', 'Trend', 'Supporting 1', 'Supporting 2']
    const rows = allCards.map((c) => [
      c.href.replace('#', '').toUpperCase(),
      `"${c.title}"`,
      `"${c.value}"`,
      c.growth,
      c.trend,
      c.supporting[0] ? `"${c.supporting[0].label}: ${c.supporting[0].value}"` : '',
      c.supporting[1] ? `"${c.supporting[1].label}: ${c.supporting[1].value}"` : '',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `duseat_full_platform_summary_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ variant: 'success', title: 'Report exported', description: 'Platform summary CSV downloaded.' })
  }

  const filteredPlatform = platformOverview.filter((c) => matchesQuery(c, query))
  const filteredMarket = marketplaceMetrics.filter((c) => matchesQuery(c, query))
  const filteredOps = operationalMetrics.filter((c) => matchesQuery(c, query))

  return (
    <div className="flex min-h-dvh bg-background">
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

        <main className="w-full min-w-0 flex-1 px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <Section title="Platform Overview" description="Top-level growth and active population" count={filteredPlatform.length} id="overview">
                <MetricGrid>
                  {filteredPlatform.map((card, i) => (
                    <KpiCard key={card.id} card={card} index={i} onOpen={openCard} onAction={cardAction} />
                  ))}
                  {filteredPlatform.length === 0 && <NoMatch />}
                </MetricGrid>
              </Section>

              <Section title="Marketplace Metrics" description="Requests pipeline, offers & closed deals" count={filteredMarket.length}>
                <MetricGrid>
                  {filteredMarket.map((card, i) => (
                    <KpiCard key={card.id} card={card} index={i} onOpen={openCard} onAction={cardAction} />
                  ))}
                  {filteredMarket.length === 0 && <NoMatch />}
                </MetricGrid>
              </Section>

              <Section title="Operational Health" description="Live platform activity, verifications & risk signals" count={filteredOps.length}>
                <MetricGrid>
                  {filteredOps.map((card, i) => (
                    <KpiCard key={card.id} card={card} index={i} compact onOpen={openCard} onAction={cardAction} />
                  ))}
                  {filteredOps.length === 0 && <NoMatch />}
                </MetricGrid>
              </Section>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RevenueChart range={range} />
                </div>
                <div>
                  <DealStatus />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <RecentActivity onViewAll={() => router.push('/activity')} />
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
    </div>
  )
}

function MetricGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
}

function NoMatch() {
  return (
    <div className="col-span-full py-6 text-center text-sm text-muted-foreground">
      No metrics match your search.
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
