'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Download,
  ShieldAlert,
  UserX,
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Ban,
  ShieldCheck,
  Eye,
  ChevronDown,
  X,
  Users,
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

interface SuspendedUser {
  id: string
  name: string
  email: string
  phone: string
  type: 'Investor' | 'Agent'
  country: string
  agency?: string
  reason: string
  suspendedBy: string
  suspendedDate: string
  duration: string
  expiresAt: string
  status: 'Suspended' | 'Under Investigation' | 'Permanent Ban'
  violationsCount: number
}

const INITIAL_SUSPENDED_USERS: SuspendedUser[] = [
  {
    id: 'USR-SUS-01',
    name: 'Khaled Mansoor',
    email: 'khaled.mansoor@alreemcapital.ae',
    phone: '+971 50 491 2940',
    type: 'Agent',
    country: 'United Arab Emirates',
    agency: 'Al Reem Luxury Real Estate',
    reason: 'Repeatedly soliciting off-platform cash escrow payments outside Duseat',
    suspendedBy: 'Tariq Al-Mansoor (Super Admin)',
    suspendedDate: '04 Sep 2026',
    duration: '30 Days',
    expiresAt: '04 Oct 2026',
    status: 'Suspended',
    violationsCount: 3,
  },
  {
    id: 'USR-SUS-02',
    name: 'Dmitry Voronov',
    email: 'dmitry.investments@euroholdings.ru',
    phone: '+7 916 555 0192',
    type: 'Investor',
    country: 'Russia',
    reason: 'Multiple fraudulent proof-of-funds documents submitted during KYC check',
    suspendedBy: 'Sarah Jenkins (Compliance Lead)',
    suspendedDate: '01 Sep 2026',
    duration: 'Permanent',
    expiresAt: 'Indefinite',
    status: 'Permanent Ban',
    violationsCount: 2,
  },
  {
    id: 'USR-SUS-03',
    name: 'Faisal Al-Otaibi',
    email: 'faisal.otaibi@riyadhbrokers.sa',
    phone: '+966 54 810 4421',
    type: 'Agent',
    country: 'Saudi Arabia',
    agency: 'Najd Commercial Realty',
    reason: 'Submitting duplicate ghost property listings with expired RERA authorization',
    suspendedBy: 'Ahmed Al-Maktoum (Moderator)',
    suspendedDate: '08 Sep 2026',
    duration: '14 Days',
    expiresAt: '22 Sep 2026',
    status: 'Suspended',
    violationsCount: 1,
  },
  {
    id: 'USR-SUS-04',
    name: 'Marcus Vance',
    email: 'm.vance@mayfairgroup.co.uk',
    phone: '+44 7700 900481',
    type: 'Investor',
    country: 'United Kingdom',
    reason: 'Abusive and derogatory messaging towards licensed agents in live chat negotiations',
    suspendedBy: 'Elena Rostova (Trust & Safety)',
    suspendedDate: '06 Sep 2026',
    duration: '60 Days',
    expiresAt: '05 Nov 2026',
    status: 'Suspended',
    violationsCount: 4,
  },
  {
    id: 'USR-SUS-05',
    name: 'Layla Al-Khatib',
    email: 'layla@khatibproperties.com',
    phone: '+971 52 381 9022',
    type: 'Agent',
    country: 'United Arab Emirates',
    agency: 'Creek Horizon Realty',
    reason: 'Pending formal RERA investigation into unauthorized secondary sublease listings',
    suspendedBy: 'Tariq Al-Mansoor (Super Admin)',
    suspendedDate: '09 Sep 2026',
    duration: 'Pending Review',
    expiresAt: 'Awaiting Audit',
    status: 'Under Investigation',
    violationsCount: 1,
  },
]

export function SuspendedUsersManagement() {
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as any) || searchParams.get('tab') || 'All'
  const [users, setUsers] = React.useState<SuspendedUser[]>(INITIAL_SUSPENDED_USERS)
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Investor' | 'Agent'>(initialType)
  const [statusFilter, setStatusFilter] = React.useState<string>('All statuses')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  // Action modals
  const [activeModalUser, setActiveModalUser] = React.useState<SuspendedUser | null>(null)
  const [modalAction, setModalAction] = React.useState<'unsuspend' | 'extend' | 'ban' | null>(null)
  const [extensionDays, setExtensionDays] = React.useState('30')

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      if (typeFilter !== 'All' && u.type !== typeFilter) return false
      if (statusFilter !== 'All statuses' && u.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.reason.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [users, typeFilter, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map((u) => u.id) : [])
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleExecuteModalAction = () => {
    if (!activeModalUser || !modalAction) return

    if (modalAction === 'unsuspend') {
      setUsers((prev) => prev.filter((u) => u.id !== activeModalUser.id))
      setSelectedIds((prev) => prev.filter((id) => id !== activeModalUser.id))
    } else if (modalAction === 'ban') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === activeModalUser.id
            ? { ...u, status: 'Permanent Ban', duration: 'Permanent', expiresAt: 'Indefinite' }
            : u
        )
      )
    } else if (modalAction === 'extend') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === activeModalUser.id
            ? { ...u, duration: `Extended +${extensionDays} Days` }
            : u
        )
      )
    }

    setActiveModalUser(null)
    setModalAction(null)
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_suspended_users_${new Date().toISOString().split('T')[0]}`,
      ['ID', 'Name', 'Email', 'Type', 'Country', 'Reason', 'Suspended By', 'Date', 'Status'],
      filtered.map((u) => [u.id, u.name, u.email, u.type, u.country, u.reason, u.suspendedBy, u.suspendedDate, u.status])
    )
  }

  const suspendedCount = users.filter((u) => u.status === 'Suspended').length
  const bannedCount = users.filter((u) => u.status === 'Permanent Ban').length
  const agentCount = users.filter((u) => u.type === 'Agent').length
  const investorCount = users.filter((u) => u.type === 'Investor').length

  return (
    <PlatformShell
      title="Suspended Users & Enforcement"
      eyebrow="Trust & Safety Governance"
      query={search}
      onQueryChange={setSearch}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Suspended Accounts & Enforcement
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage enforcement records, review compliance violation histories, and process unsuspension appeals.
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
              label="Active Suspensions"
              value={suspendedCount}
              tone="destructive"
              active={statusFilter === 'Suspended'}
              onClick={() => {
                setStatusFilter(statusFilter === 'Suspended' ? 'All statuses' : 'Suspended')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Permanent Bans"
              value={bannedCount}
              tone="neutral"
              active={statusFilter === 'Permanent Ban'}
              onClick={() => {
                setStatusFilter(statusFilter === 'Permanent Ban' ? 'All statuses' : 'Permanent Ban')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Suspended Agents"
              value={agentCount}
              tone="warning"
              active={typeFilter === 'Agent'}
              onClick={() => {
                setTypeFilter(typeFilter === 'Agent' ? 'All' : 'Agent')
                setCurrentPage(1)
              }}
            />
            <MetricCard
              label="Suspended Investors"
              value={investorCount}
              tone="info"
              active={typeFilter === 'Investor'}
              onClick={() => {
                setTypeFilter(typeFilter === 'Investor' ? 'All' : 'Investor')
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
              {/* Type Tabs */}
              <div className="flex flex-wrap items-center gap-2 py-0.5 max-w-full">
                {(['All', 'Agent', 'Investor'] as const).map((t) => {
                  const count = t === 'All' ? users.length : users.filter((u) => u.type === t).length
                  const isSelected = typeFilter === t
                  return (
                    <a
                      key={t}
                      href={`/suspended-users?type=${encodeURIComponent(t)}`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey || e.button === 1) {
                          return
                        }
                        e.preventDefault()
                        setTypeFilter(t)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap no-underline',
                        isSelected
                          ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span>{t === 'All' ? 'All Restricted Users' : `${t}s`}</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
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
                  <span className="whitespace-nowrap">Export Audit CSV</span>
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
                  placeholder="Search name, reason, ID…"
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

              {/* Status Filter Dropdown */}
              <Dropdown
                align="start"
                value={statusFilter}
                onSelect={(val) => {
                  setStatusFilter(val)
                  setCurrentPage(1)
                }}
                ariaLabel="Filter by Enforcement Status"
                options={[
                  { label: 'All statuses', value: 'All statuses' },
                  { label: 'Suspended', value: 'Suspended' },
                  { label: 'Permanent Ban', value: 'Permanent Ban' },
                  { label: 'Under Investigation', value: 'Under Investigation' },
                ]}
                trigger={
                  <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                    <Filter className="size-4 text-[#6f777f]" />
                    <span>{statusFilter}</span>
                    <ChevronDown className="size-3.5 text-[#9da4ae]" />
                  </span>
                }
              />

              {/* Reset Filters */}
              {(search || statusFilter !== 'All statuses' || typeFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('All statuses')
                    setTypeFilter('All')
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
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Restricted User</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Type</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Violation Reason</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Suspended By</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Duration & Expiry</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Status</th>
                  <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-right">Enforcement Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3d5d7]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#6f777f]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShieldCheck className="size-8 text-[#00a870]" />
                        <p className="text-[15px] font-semibold text-[#1f2327]">No suspended accounts found</p>
                        <p className="text-[13px] text-[#6f777f]">All users meet platform compliance standards.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((user) => {
                    const isChecked = selectedIds.includes(user.id)
                    return (
                      <tr
                        key={user.id}
                        className={cn(
                          'h-[64px] transition-colors whitespace-nowrap font-sans',
                          isChecked ? 'bg-[#e5f6f7]/40' : 'hover:bg-[#f8f9fa]'
                        )}
                      >
                        <td className="w-12 px-4">
                          <TableCheckbox
                            checked={isChecked}
                            onChange={() => handleSelectOne(user.id)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <div className="flex items-center gap-2.5">
                            <TableAvatar name={user.name} size="md" />
                            <div className="min-w-0">
                              <p className="text-[14px] font-bold text-[#1f2327] truncate leading-tight">
                                {user.name}
                              </p>
                              <p className="text-[12px] text-[#6f777f] truncate">{user.email}</p>
                              {user.agency && (
                                <p className="text-[11px] text-[#00848b] font-medium truncate">
                                  {user.agency}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                              user.type === 'Agent'
                                ? 'bg-[#e0f7f8] text-[#00848b]'
                                : 'bg-[#eff1f3] text-[#1f2327]'
                            )}
                          >
                            {user.type}
                          </span>
                        </td>
                        <td className="px-4 max-w-[280px]">
                          <p className="text-[13px] text-[#1f2327] font-medium line-clamp-2" title={user.reason}>
                            {user.reason}
                          </p>
                          <span className="text-[11px] text-[#dc2626] font-semibold">
                            {user.violationsCount} prior violations
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <p className="text-[13px] text-[#1f2327] font-medium leading-tight">
                            {user.suspendedBy}
                          </p>
                          <p className="text-[12px] text-[#6f777f]">{user.suspendedDate}</p>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <p className="text-[13px] text-[#1f2327] font-bold leading-tight">
                            {user.duration}
                          </p>
                          <p className="text-[12px] text-[#6f777f]">Until: {user.expiresAt}</p>
                        </td>
                        <td className="whitespace-nowrap px-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold',
                              user.status === 'Permanent Ban'
                                ? 'bg-[#feebee] text-[#dc2626]'
                                : user.status === 'Under Investigation'
                                ? 'bg-[#fff8e6] text-[#b27b00]'
                                : 'bg-[#feebee] text-[#dc2626]'
                            )}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModalUser(user)
                                setModalAction('unsuspend')
                              }}
                              className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#e6f9f3] border border-[#00a870]/20 px-2.5 text-[12px] font-semibold text-[#00a870] hover:bg-[#d0f5e8] transition-colors cursor-pointer"
                            >
                              <RotateCcw className="size-3.5" />
                              <span>Unsuspend</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveModalUser(user)
                                setModalAction('extend')
                              }}
                              className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                            >
                              <Clock className="size-3.5 text-[#6f777f]" />
                              <span>Extend</span>
                            </button>

                            {user.status !== 'Permanent Ban' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveModalUser(user)
                                  setModalAction('ban')
                                }}
                                className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#dc2626]/30 bg-[#feebee]/40 px-2 text-[12px] font-medium text-[#dc2626] hover:bg-[#feebee] transition-colors cursor-pointer"
                              >
                                <Ban className="size-3.5" />
                                <span>Ban</span>
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
              itemLabel="restricted users"
            />
          </div>
        </section>

        {/* Action Confirmation Modal */}
        {activeModalUser && modalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    modalAction === 'unsuspend'
                      ? 'bg-[#e6f9f3] text-[#00a870]'
                      : 'bg-[#feebee] text-[#dc2626]'
                  )}
                >
                  {modalAction === 'unsuspend' ? <RotateCcw className="size-5" /> : <AlertTriangle className="size-5" />}
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#1f2327]">
                    {modalAction === 'unsuspend' && 'Confirm Account Unsuspension'}
                    {modalAction === 'ban' && 'Confirm Permanent Platform Ban'}
                    {modalAction === 'extend' && 'Extend Account Suspension'}
                  </h3>
                  <p className="text-[13px] text-[#6f777f]">Account ID: {activeModalUser.id}</p>
                </div>
              </div>

              <p className="text-[14px] text-[#344054] leading-relaxed">
                {modalAction === 'unsuspend' &&
                  `Are you sure you want to lift the suspension for ${activeModalUser.name}? Their marketplace access, profile listing, and messaging permissions will be fully restored immediately.`}
                {modalAction === 'ban' &&
                  `Warning: This will permanently ban ${activeModalUser.name}. They will be barred from creating requests, offers, or signing in across all Duseat services.`}
                {modalAction === 'extend' &&
                  `Select the additional duration to extend the restriction for ${activeModalUser.name}.`}
              </p>

              {modalAction === 'extend' && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-[13px] font-semibold text-[#1f2327]">Additional Duration</label>
                  <Dropdown
                    align="start"
                    value={`+${extensionDays} Days`}
                    onSelect={(val) => setExtensionDays(val.replace(/[^0-9]/g, ''))}
                    options={[
                      { label: '+7 Days (1 Week)', value: '+7 Days' },
                      { label: '+14 Days (2 Weeks)', value: '+14 Days' },
                      { label: '+30 Days (1 Month)', value: '+30 Days' },
                      { label: '+90 Days (Quarter)', value: '+90 Days' },
                    ]}
                    trigger={
                      <span className="inline-flex h-[38px] w-full items-center justify-between rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] text-[#1f2327] cursor-pointer">
                        <span>+{extensionDays} Days</span>
                        <ChevronDown className="size-3.5 text-[#9da4ae]" />
                      </span>
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#d3d5d7]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalUser(null)
                    setModalAction(null)
                  }}
                  className="h-[36px] px-4 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#6f777f] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleExecuteModalAction}
                  className={cn(
                    'h-[36px] px-4 rounded-[8px] text-[14px] font-semibold text-white transition-colors cursor-pointer',
                    modalAction === 'unsuspend'
                      ? 'bg-[#00a870] hover:bg-[#008455]'
                      : 'bg-[#dc2626] hover:bg-[#b91c1c]'
                  )}
                >
                  {modalAction === 'unsuspend' && 'Restore Access'}
                  {modalAction === 'ban' && 'Permanent Ban'}
                  {modalAction === 'extend' && 'Apply Extension'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
