'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpDown, ArrowUp, ArrowDown, Star, MoreHorizontal, Eye, Mail, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { topAgents, type AgentRow, formatAed } from './data'
import { WidgetCard } from './widget-card'
import { ProgressBar } from './primitives'
import { Dropdown } from './menu'
import { ConfirmDialog } from './confirm-dialog'
import { useToast } from './toast'

type SortKey = 'deals' | 'revenue' | 'rating'

const PAGE_SIZE = 4

export function TopAgents({ query, onViewAll }: { query: string; onViewAll: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [rows, setRows] = React.useState<AgentRow[]>(topAgents)
  const [sortKey, setSortKey] = React.useState<SortKey>('revenue')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')
  const [page, setPage] = React.useState(0)
  const [pendingDelete, setPendingDelete] = React.useState<AgentRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? rows.filter((r) => r.name.toLowerCase().includes(q) || r.region.toLowerCase().includes(q))
      : rows
    return [...base].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      return sortDir === 'asc' ? diff : -diff
    })
  }, [rows, query, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const paged = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(0)
  }

  const SortHeader = ({ label, k, className }: { label: string; k: SortKey; className?: string }) => (
    <th className={cn('py-2 font-medium', className)}>
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        {sortKey === k ? (
          sortDir === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3.5 opacity-50" />
        )}
      </button>
    </th>
  )

  return (
    <WidgetCard title="Top performing agents" onViewAll={onViewAll}>
      <div className="max-h-[300px] overflow-auto">
        <table className="w-full border-collapse text-[14px] leading-[20px]">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border text-left text-[14px] leading-[20px]">
              <th className="py-2 font-medium text-muted-foreground">Agent</th>
              <SortHeader label="Deals" k="deals" className="text-right font-medium" />
              <SortHeader label="Revenue" k="revenue" className="text-right font-medium" />
              <SortHeader label="Rating" k="rating" className="text-right font-medium" />
              <th className="w-8 py-2" />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center gap-1 py-8 text-center">
                    <Search className="size-5 text-muted-foreground" />
                    <p className="text-[14px] leading-[20px] font-medium text-foreground">No agents found</p>
                    <p className="text-[12px] leading-[16px] text-muted-foreground">Try a different search term.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((agent) => (
                <tr key={agent.id} className="group border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/60">
                  <td className="py-2.5">
                    <div
                      onClick={() => router.push('/agents')}
                      className="flex cursor-pointer items-center gap-2.5"
                    >
                      {agent.avatar ? (
                        <img src={agent.avatar} alt={agent.name} className="size-8 rounded-full object-cover shrink-0 ring-1 ring-border" />
                      ) : (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
                          {agent.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-[14px] leading-[20px] font-medium text-foreground hover:text-brand">{agent.name}</p>
                        <p className="truncate text-[12px] leading-[16px] text-muted-foreground">{agent.region}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="text-[14px] leading-[20px] font-medium tabular-nums text-foreground">{agent.deals}</span>
                    <ProgressBar value={agent.progress} className="mt-1 w-16 ml-auto" />
                  </td>
                  <td className="py-2.5 text-right text-[14px] leading-[20px] font-medium tabular-nums text-foreground">{formatAed(agent.revenue)}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[14px] leading-[20px] tabular-nums text-foreground">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {agent.rating}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <Dropdown
                      align="end"
                      value=""
                      onSelect={(v) => {
                        if (v === 'delete') setPendingDelete(agent)
                        else if (v === 'view') router.push('/agents')
                        else if (v === 'message') toast({ variant: 'success', title: 'Message drafted', description: `To ${agent.name}` })
                      }}
                      options={[
                        { label: 'View in Agents directory', value: 'view', icon: <Eye className="size-4 text-muted-foreground" /> },
                        { label: 'Send message', value: 'message', icon: <Mail className="size-4 text-muted-foreground" /> },
                        { label: 'Remove from leaderboard', value: 'delete', destructive: true, icon: <Trash2 className="size-4" /> },
                      ]}
                      trigger={
                        <span className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground group-hover:opacity-100">
                          <MoreHorizontal className="size-4" />
                        </span>
                      }
                      ariaLabel={`Actions for ${agent.name}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {filtered.length === 0 ? '0' : `${current * PAGE_SIZE + 1}–${Math.min((current + 1) * PAGE_SIZE, filtered.length)}`} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={current === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
            className="flex size-7 items-center justify-center rounded-md border border-input transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="px-1 tabular-nums text-foreground">{current + 1}/{pageCount}</span>
          <button
            type="button"
            disabled={current >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            aria-label="Next page"
            className="flex size-7 items-center justify-center rounded-md border border-input transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove agent?"
        description={`This will remove ${pendingDelete?.name} from the leaderboard. This action cannot be undone.`}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id))
            toast({ variant: 'success', title: 'Agent removed', description: `${pendingDelete.name} was removed.` })
          }
          setPendingDelete(null)
        }}
      />
    </WidgetCard>
  )
}
