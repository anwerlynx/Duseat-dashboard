'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Filter, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { latestRequests, type RequestStatus, formatAed } from './data'
import { WidgetCard } from './widget-card'
import { StatusBadge } from './primitives'
import { Dropdown } from './menu'
import { TableAvatar } from '@/components/ui/table-avatar'
import { EditRequestModal } from '@/components/platform/edit-request-modal'
import type { PropertyRequest } from '@/lib/platform-users'

const statusFilters: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Matched', value: 'matched' },
  { label: 'Closed', value: 'closed' },
]

const PAGE_SIZE = 4

export function LatestRequests({ query, onViewAll }: { query: string; onViewAll: () => void }) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = React.useState<RequestStatus | 'all'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [page, setPage] = React.useState(0)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return latestRequests.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesQuery =
        !q || r.property.toLowerCase().includes(q) || r.investor.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const paged = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  return (
    <>
      <WidgetCard
        title="Latest requests"
        subtitle="Active buyer briefs submitted by verified investors"
        onViewAll={onViewAll}
        actions={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex h-[32px] items-center gap-1 rounded-[6px] bg-[#00c2cb] px-2.5 text-[12px] font-semibold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add</span>
            </button>
            <Dropdown
              value={statusFilter}
              onSelect={(v) => {
                setStatusFilter(v as RequestStatus | 'all')
                setPage(0)
              }}
              options={statusFilters}
              align="end"
              trigger={
                <span className="inline-flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-medium text-[#1f2327] transition-colors hover:bg-[#eff1f3] cursor-pointer">
                  <Filter className="size-3.5 text-[#6f777f]" />
                  <span>{statusFilters.find((s) => s.value === statusFilter)?.label}</span>
                </span>
              }
              ariaLabel="Filter by status"
            />
          </div>
        }
      >
        <div className="overflow-x-auto table-scrollbar flex-1">
          <table className="w-full border-collapse text-[13px] leading-[18px] whitespace-nowrap font-sans">
            <thead>
              <tr className="border-b border-[#d3d5d7] text-left text-[12px] font-semibold text-[#6f777f] whitespace-nowrap">
                <th className="py-2.5 px-2 font-semibold whitespace-nowrap">Request</th>
                <th className="py-2.5 px-2 font-semibold whitespace-nowrap">Budget</th>
                <th className="py-2.5 px-2 font-semibold whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-right font-semibold whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3d5d7]/50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center gap-1 py-8 text-center">
                      <Search className="size-5 text-[#9da4ae]" />
                      <p className="text-[13px] font-medium text-[#1f2327]">No requests match</p>
                      <p className="text-[11.5px] text-[#6f777f]">Adjust your search or filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((req, i) => (
                  <tr
                    key={req.id}
                    onClick={() => router.push('/requests')}
                    className="cursor-pointer transition-colors hover:bg-[#f8f9fa] whitespace-nowrap"
                  >
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-2.5 whitespace-nowrap">
                        <TableAvatar
                          src={req.investorAvatar}
                          name={req.investor}
                          size="md"
                          variant="subtle"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[13px] text-[#1f2327] hover:text-[#00c2cb] transition-colors whitespace-nowrap">{req.property}</p>
                          <p className="text-[11px] text-[#6f777f] whitespace-nowrap">
                            {req.id} · {req.investor}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[13px] tabular-nums text-[#1f2327] whitespace-nowrap">
                      {formatAed(req.budget)}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-2.5 px-2 text-right text-[11.5px] text-[#6f777f] whitespace-nowrap">
                      {req.submitted}
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

