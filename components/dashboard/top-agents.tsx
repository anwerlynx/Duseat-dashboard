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

import { AgentPlanBadge } from '@/components/ui/figma-badges'
import { TableAvatar } from '@/components/ui/table-avatar'

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
          sortDir === 'asc' ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />
        ) : (
          <ArrowUpDown className="size-4 opacity-50" />
        )}
      </button>
    </th>
  )

  const getAgentPlan = (idx: number): 'Pro' | 'Elite' | 'Power' => {
    if (idx === 0) return 'Power'
    if (idx === 1) return 'Elite'
    return 'Pro'
  }

  const getAgentFlag = (region: string): string => {
    if (region.includes('Dubai') || region.includes('Marina') || region.includes('Downtown')) return 'AE'
    if (region.includes('Riyadh') || region.includes('Saudi')) return 'SA'
    if (region.includes('Cairo') || region.includes('Egypt')) return 'EG'
    if (region.includes('London') || region.includes('UK')) return 'GB'
    return 'AE'
  }

  return (
    <WidgetCard
      title="Top performing agents"
      subtitle="Highest gross commission revenue in UAE"
      onViewAll={onViewAll}
    >
      <div className="overflow-x-auto table-scrollbar flex-1">
        <table className="w-full border-collapse text-[13px] leading-[18px] whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#d3d5d7] text-left text-[12px] font-semibold text-[#6f777f] whitespace-nowrap">
              <th className="py-2.5 px-2 font-semibold text-[#6f777f] whitespace-nowrap">Agent</th>
              <SortHeader label="Deals" k="deals" className="py-2.5 px-2 text-right font-semibold text-[#6f777f] whitespace-nowrap" />
              <SortHeader label="Revenue" k="revenue" className="py-2.5 px-2 text-right font-semibold text-[#6f777f] whitespace-nowrap" />
              <SortHeader label="Rating" k="rating" className="py-2.5 px-2 text-right font-semibold text-[#6f777f] whitespace-nowrap" />
              <th className="w-6 py-2.5 px-1 whitespace-nowrap" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d3d5d7]/50">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center gap-1 py-8 text-center">
                    <Search className="size-5 text-[#9da4ae]" />
                    <p className="text-[13px] font-medium text-[#1f2327]">No agents found</p>
                    <p className="text-[11.5px] text-[#6f777f]">Try a different search term.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((agent, idx) => (
                <tr
                  key={agent.id}
                  className="group transition-colors hover:bg-[#f8f9fa] whitespace-nowrap"
                >
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    <div
                      onClick={() => router.push('/agents/AG-1048')}
                      className="flex cursor-pointer items-center gap-2.5 whitespace-nowrap"
                    >
                      <TableAvatar
                        src={agent.avatar}
                        name={agent.name}
                        countryCode={getAgentFlag(agent.region)}
                        size="md"
                        variant="brand"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-semibold text-[#1f2327] hover:text-[#00c2cb] transition-colors whitespace-nowrap">{agent.name}</p>
                          <AgentPlanBadge plan={getAgentPlan(idx)} compact />
                        </div>
                        <p className="text-[11px] text-[#6f777f] whitespace-nowrap">{agent.region}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right whitespace-nowrap">
                    <span className="text-[13px] font-semibold tabular-nums text-[#1f2327]">{agent.deals}</span>
                    <ProgressBar value={agent.progress} className="mt-1 w-12 ml-auto" />
                  </td>
                  <td className="py-2.5 px-2 text-right text-[13px] font-bold tabular-nums text-[#1f2327] whitespace-nowrap">
                    {formatAed(agent.revenue)}
                  </td>
                  <td className="py-2.5 px-2 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold tabular-nums text-[#1f2327]">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {agent.rating}
                    </span>
                  </td>
                  <td className="py-2.5 px-1 text-right whitespace-nowrap">
                    <Dropdown
                      align="end"
                      value=""
                      onSelect={(v) => {
                        if (v === 'delete') setPendingDelete(agent)
                        else if (v === 'view') router.push('/agents')
                        else if (v === 'message') toast({ variant: 'success', title: 'Message drafted', description: `To ${agent.name}` })
                      }}
                      options={[
                        { label: 'View in Agents directory', value: 'view', icon: <Eye className="size-4 text-[#6f777f]" /> },
                        { label: 'Send message', value: 'message', icon: <Mail className="size-4 text-[#6f777f]" /> },
                        { label: 'Remove from leaderboard', value: 'delete', destructive: true, icon: <Trash2 className="size-4" /> },
                      ]}
                      trigger={
                        <span className="flex size-7 items-center justify-center rounded-[6px] text-[#6f777f] opacity-0 transition-all hover:bg-[#eff1f3] hover:text-[#1f2327] group-hover:opacity-100 cursor-pointer">
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
      <div className="mt-auto flex items-center justify-between border-t border-[#d3d5d7] pt-3 text-xs text-[#6f777f]">
        <span className="tabular-nums">
          {filtered.length === 0 ? '0' : `${current * PAGE_SIZE + 1}–${Math.min((current + 1) * PAGE_SIZE, filtered.length)}`} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={current === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
            className="flex size-7 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white transition-colors hover:bg-[#eff1f3] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="px-1.5 font-medium tabular-nums text-[#1f2327]">{current + 1}/{pageCount}</span>
          <button
            type="button"
            disabled={current >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            aria-label="Next page"
            className="flex size-7 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white transition-colors hover:bg-[#eff1f3] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
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
