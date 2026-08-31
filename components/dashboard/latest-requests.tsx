'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Filter, Search, Plus } from 'lucide-react'
import { latestRequests, type RequestStatus, formatAed } from './data'
import { WidgetCard } from './widget-card'
import { StatusBadge } from './primitives'
import { Dropdown } from './menu'
import { EditRequestModal } from '@/components/platform/edit-request-modal'
import type { PropertyRequest } from '@/lib/platform-users'

const statusFilters: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Matched', value: 'matched' },
  { label: 'Closed', value: 'closed' },
]

export function LatestRequests({ query, onViewAll }: { query: string; onViewAll: () => void }) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = React.useState<RequestStatus | 'all'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return latestRequests.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesQuery =
        !q || r.property.toLowerCase().includes(q) || r.investor.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter])

  return (
    <>
      <WidgetCard
        title="Latest requests"
        onViewAll={onViewAll}
        actions={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-[#00c2cb] px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="size-3" />
              <span>Add</span>
            </button>
            <Dropdown
              value={statusFilter}
              onSelect={(v) => setStatusFilter(v as RequestStatus | 'all')}
              options={statusFilters}
              align="end"
              trigger={
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                  <Filter className="size-3.5 text-muted-foreground" />
                  {statusFilters.find((s) => s.value === statusFilter)?.label}
                </span>
              }
              ariaLabel="Filter by status"
            />
          </div>
        }
      >
      <div className="max-h-[300px] overflow-auto">
        <table className="w-full border-collapse text-[14px] leading-[20px]">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border text-left text-[14px] leading-[20px] text-muted-foreground">
              <th className="py-2 font-medium">Request</th>
              <th className="py-2 font-medium">Budget</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 text-right font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center gap-1 py-8 text-center">
                    <Search className="size-5 text-muted-foreground" />
                    <p className="text-[14px] leading-[20px] font-medium text-foreground">No requests match</p>
                    <p className="text-[12px] leading-[16px] text-muted-foreground">Adjust your search or filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((req, i) => (
                <tr
                  key={req.id}
                  onClick={() => router.push('/requests')}
                  style={{ animationDelay: `${i * 35}ms` }}
                  className="animate-fade-up cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/60"
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      {req.investorAvatar ? (
                        <img src={req.investorAvatar} alt={req.investor} className="size-8 rounded-full object-cover shrink-0 ring-1 ring-border" />
                      ) : (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[12px] font-semibold text-primary">
                          {req.investor.split(' ').map((n) => n[0]).join('')}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[14px] leading-[20px] text-foreground hover:text-brand truncate">{req.property}</p>
                        <p className="text-[12px] leading-[16px] text-muted-foreground truncate">
                          {req.id} · {req.investor}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 font-semibold text-[14px] leading-[20px] tabular-nums text-foreground">{formatAed(req.budget)}</td>
                  <td className="py-2.5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-2.5 text-right text-[12px] leading-[16px] text-muted-foreground">{req.submitted}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </WidgetCard>

    {/* Create Request Flow Modal (Figma App Flow Adapted for Dashboard) */}
    {isAddModalOpen && (
      <EditRequestModal
        mode="create"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newReq) => {
          setIsAddModalOpen(false)
        }}
      />
    )}
  </>
  )
}

