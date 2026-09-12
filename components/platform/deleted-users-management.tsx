'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Download,
  Trash2,
  RotateCcw,
  Clock,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Lock,
  ArchiveRestore,
  Filter,
  ChevronDown,
  X,
  Users,
  UserX,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { Dropdown } from '@/components/dashboard/menu'
import {
  MetricCard,
  TableCheckbox,
  TableAvatar,
  Pagination,
} from '@/components/ui'
import { cn, exportToCsv } from '@/lib/utils'

interface DeletedUserRecord {
  id: string
  name: string
  email: string
  type: 'Investor' | 'Agent'
  country: string
  deletedDate: string
  deletedBy: string
  reason: string
  recoverable: boolean
  gracePeriodDaysLeft: number
  dataArchived: boolean
}

const INITIAL_DELETED_USERS: DeletedUserRecord[] = [
  {
    id: 'DEL-USR-101',
    name: 'Karim Abdel-Nasser',
    email: 'karim.nasser@gmail.com',
    type: 'Investor',
    country: 'Egypt',
    deletedDate: '02 Sep 2026',
    deletedBy: 'User Self-Requested (GDPR/Data Privacy)',
    reason: 'Personal portfolio liquidation and formal account erasure request',
    recoverable: true,
    gracePeriodDaysLeft: 21,
    dataArchived: true,
  },
  {
    id: 'DEL-USR-102',
    name: 'Apex Horizon Realty LLC',
    email: 'contact@apexhorizon.ae',
    type: 'Agent',
    country: 'United Arab Emirates',
    deletedDate: '28 Aug 2026',
    deletedBy: 'Tariq Al-Mansoor (Super Admin)',
    reason: 'Agency dissolved trade license and commercial bankruptcy closure',
    recoverable: false,
    gracePeriodDaysLeft: 0,
    dataArchived: true,
  },
  {
    id: 'DEL-USR-103',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@parisinvest.fr',
    type: 'Investor',
    country: 'France',
    deletedDate: '07 Sep 2026',
    deletedBy: 'System Cleanup (Dormant 18+ Months)',
    reason: 'Zero login activity and zero active briefs within statutory retention limit',
    recoverable: true,
    gracePeriodDaysLeft: 26,
    dataArchived: true,
  },
  {
    id: 'DEL-USR-104',
    name: 'Zayed Al-Nuaimi',
    email: 'zayed.nuaimi@rakproperties.ae',
    type: 'Agent',
    country: 'United Arab Emirates',
    deletedDate: '05 Sep 2026',
    deletedBy: 'Sarah Jenkins (Ops Manager)',
    reason: 'Broker moved overseas to non-licensed jurisdiction and surrendered RERA badge',
    recoverable: true,
    gracePeriodDaysLeft: 24,
    dataArchived: true,
  },
]

export function DeletedUsersManagement() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('type') as any) || (searchParams.get('tab') as any) || 'All'
  const [records, setRecords] = React.useState<DeletedUserRecord[]>(INITIAL_DELETED_USERS)
  const [search, setSearch] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'All' | 'Investor' | 'Agent' | 'In Grace Period'>(initialTab)
  const [recoverableFilter, setRecoverableFilter] = React.useState<string>('All records')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [activeModalItem, setActiveModalItem] = React.useState<DeletedUserRecord | null>(null)
  const [modalMode, setModalMode] = React.useState<'restore' | 'purge' | null>(null)

  const filtered = React.useMemo(() => {
    return records.filter((r) => {
      if (activeTab === 'Investor' && r.type !== 'Investor') return false
      if (activeTab === 'Agent' && r.type !== 'Agent') return false
      if (activeTab === 'In Grace Period' && !r.recoverable) return false

      if (recoverableFilter === 'Recoverable' && !r.recoverable) return false
      if (recoverableFilter === 'Permanent Closed' && r.recoverable) return false

      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [records, activeTab, recoverableFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map((r) => r.id) : [])
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleConfirmAction = () => {
    if (!activeModalItem || !modalMode) return

    if (modalMode === 'restore') {
      setRecords((prev) => prev.filter((r) => r.id !== activeModalItem.id))
      setSelectedIds((prev) => prev.filter((id) => id !== activeModalItem.id))
    } else if (modalMode === 'purge') {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === activeModalItem.id
            ? { ...r, recoverable: false, gracePeriodDaysLeft: 0, reason: 'Permanently Purged from DB' }
            : r
        )
      )
    }

    setActiveModalItem(null)
    setModalMode(null)
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_deleted_users_archive_${new Date().toISOString().split('T')[0]}`,
      ['ID', 'Name', 'Email', 'Type', 'Deleted Date', 'Deleted By', 'Reason', 'Recoverable'],
      filtered.map((r) => [r.id, r.name, r.email, r.type, r.deletedDate, r.deletedBy, r.reason, r.recoverable ? 'Yes' : 'No'])
    )
  }

  const inGraceCount = records.filter((r) => r.recoverable).length
  const selfRequestedCount = records.filter((r) => r.deletedBy.includes('Self')).length
  const permanentCount = records.filter((r) => !r.recoverable).length

  return (
    <PlatformShell
      title="Deleted Users Archive & Recovery"
      eyebrow="Compliance & Retention"
      query={search}
      onQueryChange={setSearch}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Deleted Accounts Archive & Recovery
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Statutory 30-day soft-delete retention period. Recoverable accounts can be restored with intact history.
              </p>
            </div>

            {/* Quick Actions Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/users/investors"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Users className="size-4 text-[#00c2cb]" />
                <span>Investors</span>
              </Link>
              <Link
                href="/users/agents"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <UserX className="size-4 text-[#6f777f]" />
                <span>Agents</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Total Soft-Deleted"
              value={records.length}
              tone="neutral"
              active={activeTab === 'All'}
              onClick={() => {
                setActiveTab('All')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="In Grace Period"
              value={inGraceCount}
              tone="success"
              active={activeTab === 'In Grace Period'}
              onClick={() => {
                setActiveTab('In Grace Period')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Self-Requested (GDPR)"
              value={selfRequestedCount}
              tone="info"
              active={false}
            />
            <MetricCard
              label="Permanently Closed"
              value={permanentCount}
              tone="destructive"
              active={recoverableFilter === 'Permanent Closed'}
              onClick={() => {
                setRecoverableFilter(recoverableFilter === 'Permanent Closed' ? 'All records' : 'Permanent Closed')
                setCurrentPage(1)
              }}
            />
          </div>
        </header>

        {/* Single Unified Section Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Pill Tabs & Action Buttons */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Role Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                {(['All', 'Investor', 'Agent', 'In Grace Period'] as const).map((t) => {
                  const count =
                    t === 'All'
                      ? records.length
                      : t === 'In Grace Period'
                      ? inGraceCount
                      : records.filter((r) => r.type === t).length
                  const isSelected = activeTab === t
                  return (
                    <a
                      key={t}
                      href={`/deleted-users?type=${encodeURIComponent(t)}`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          return
                        }
                        e.preventDefault()
                        setActiveTab(t)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap no-underline',
                        isSelected
                          ? t === 'In Grace Period'
                            ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                            : 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{t === 'All' ? 'All Archived Records' : t === 'In Grace Period' ? 'In Grace Period' : `${t}s`}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          isSelected ? 'bg-white/25 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                        )}
                      >
                        {count}
                      </span>
                    </a>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                >
                  <Download className="size-4 text-white" />
                  <span className="whitespace-nowrap">Export Archive CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search user, reason, ID…"
                  className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Recoverable Filter Dropdown */}
              <Dropdown
                align="start"
                value={recoverableFilter}
                onSelect={(val) => {
                  setRecoverableFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Recovery Status"
                options={[
                  { label: 'All records', value: 'All records' },
                  { label: 'Recoverable', value: 'Recoverable' },
                  { label: 'Permanent Closed', value: 'Permanent Closed' },
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <Filter className="size-4 text-[#6f777f]" />
                    <span>{recoverableFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reset Filters */}
              {(search || recoverableFilter !== 'All records' || activeTab !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setRecoverableFilter('All records')
                    setActiveTab('All')
                    setCurrentPage(1)
                  }}
                  className="flex h-[38px] items-center gap-1.5 px-2 text-[13px] font-medium text-[#00c2cb] hover:underline cursor-pointer shrink-0"
                >
                  <X className="size-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="hidden md:block overflow-x-auto table-scrollbar flex-1">
            <table className="w-full min-w-[1200px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                  <th className="w-12 px-4">
                    <TableCheckbox
                      checked={paginated.length > 0 && selectedIds.length === paginated.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Deleted User</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Role</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Deletion Date</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Deleted By</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Deletion Reason</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Recovery Window</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-right">Recovery Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#6f777f]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckCircle2 className="size-8 text-[#00a870]" />
                        <p className="text-[15px] font-semibold text-[#1f2327]">Archive is empty</p>
                        <p className="text-[13px] text-[#6f777f]">No soft-deleted records match the filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((rec) => {
                    const isChecked = selectedIds.includes(rec.id)
                    return (
                      <tr
                        key={rec.id}
                        className={cn(
                          'h-[64px] transition-colors whitespace-nowrap font-sans',
                          isChecked ? 'bg-[#e5f6f7]/40' : 'hover:bg-[#f8f9fa]'
                        )}
                      >
                        <td className="w-12 px-4">
                          <TableCheckbox
                            checked={isChecked}
                            onChange={() => handleSelectOne(rec.id)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar name={rec.name} size="md" />
                            <div className="min-w-0">
                              <p className="text-[14px] font-bold text-[#1f2327] truncate leading-tight">
                                {rec.name}
                              </p>
                              <p className="text-[12px] text-[#6f777f] truncate">{rec.email}</p>
                              <p className="text-[11px] text-[#98a2b3] font-mono">{rec.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span className="inline-flex items-center rounded-full bg-[#eff1f3] px-2.5 py-0.5 text-[11px] font-bold text-[#1f2327]">
                            {rec.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <p className="text-[13px] text-[#1f2327] font-medium leading-tight">
                            {rec.deletedDate}
                          </p>
                          <span className="text-[11px] text-[#00a870] font-semibold">Snapshot Saved</span>
                        </td>
                        <td className="px-4 max-w-[200px]">
                          <p className="text-[13px] text-[#1f2327] font-medium truncate" title={rec.deletedBy}>
                            {rec.deletedBy}
                          </p>
                        </td>
                        <td className="px-4 max-w-[280px]">
                          <p className="text-[13px] text-[#344054] line-clamp-2" title={rec.reason}>
                            {rec.reason}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          {rec.recoverable ? (
                            <span className="inline-flex items-center rounded-full bg-[#e6f9f3] px-2.5 py-0.5 text-[12px] font-bold text-[#00a870]">
                              {rec.gracePeriodDaysLeft} Days Left
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-[#feebee] px-2.5 py-0.5 text-[12px] font-bold text-[#dc2626]">
                              Expired / Purged
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rec.recoverable ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveModalItem(rec)
                                  setModalMode('restore')
                                }}
                                className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#e6f9f3] border border-[#00a870]/20 px-2.5 text-[12px] font-semibold text-[#00a870] hover:bg-[#d0f5e8] transition-colors cursor-pointer"
                              >
                                <RotateCcw className="size-3.5" />
                                <span>Restore</span>
                              </button>
                            ) : (
                              <span className="text-[12px] text-[#98a2b3] italic pr-2">Non-recoverable</span>
                            )}

                            {rec.recoverable && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveModalItem(rec)
                                  setModalMode('purge')
                                }}
                                className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2 text-[12px] font-medium text-[#dc2626] hover:bg-[#feebee] transition-colors cursor-pointer"
                                title="Permanently erase from database"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Purge</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Integrated Pagination Footer */}
          <div className="border-t border-[#d3d5d7] px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              rowsPerPage={rowsPerPage}
              rowsOptions={[10, 20, 30]}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => {
                setRowsPerPage(n)
                setCurrentPage(1)
              }}
              itemLabel="archived records"
            />
          </div>
        </section>

        {/* Modal */}
        {activeModalItem && modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    modalMode === 'restore'
                      ? 'bg-[#e6f9f3] text-[#00a870]'
                      : 'bg-[#feebee] text-[#dc2626]'
                  )}
                >
                  {modalMode === 'restore' ? <RotateCcw className="size-5" /> : <Trash2 className="size-5" />}
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#1f2327]">
                    {modalMode === 'restore' ? 'Restore User Account' : 'Permanently Purge Record'}
                  </h3>
                  <p className="text-[13px] text-[#6f777f]">Reference: {activeModalItem.id}</p>
                </div>
              </div>

              <p className="text-[14px] text-[#344054] leading-relaxed">
                {modalMode === 'restore'
                  ? `Are you sure you want to restore the account for ${activeModalItem.name}? All historical requests, offers, deals, and communication records will be reactivated.`
                  : `Caution: Purging will permanently delete all encrypted records for ${activeModalItem.name} across platform databases. This action cannot be undone.`}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#d3d5d7]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalItem(null)
                    setModalMode(null)
                  }}
                  className="h-[36px] px-4 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={cn(
                    'h-[36px] px-4 rounded-[8px] text-[14px] font-semibold text-white cursor-pointer transition-colors',
                    modalMode === 'restore'
                      ? 'bg-[#00a870] hover:bg-[#008455]'
                      : 'bg-[#dc2626] hover:bg-[#b91c1c]'
                  )}
                >
                  {modalMode === 'restore' ? 'Confirm Restore' : 'Permanently Purge'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
