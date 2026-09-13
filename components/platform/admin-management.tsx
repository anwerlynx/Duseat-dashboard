'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Shield,
  Search,
  Filter,
  Download,
  Plus,
  UserCheck,
  UserX,
  Key,
  Lock,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  X,
  Eye,
  Check,
  Edit,
  Trash2,
  Copy,
  Users,
  ShieldAlert,
  ChevronDown,
  Activity,
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

export type AdminRole =
  | 'Super Admin'
  | 'Operations Manager'
  | 'Support Manager'
  | 'Finance Manager'
  | 'Marketing Manager'
  | 'Moderator'
  | 'Read Only'

export type AdminStatus = 'Active' | 'Suspended' | 'Invite Pending'

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: AdminRole
  department: string
  avatar?: string
  twoFactorEnabled: boolean
  lastLogin: string
  lastActiveIp: string
  status: AdminStatus
  createdAt: string
  permissions: {
    users: boolean
    verification: boolean
    requests: boolean
    deals: boolean
    finance: boolean
    moderation: boolean
    settings: boolean
    exportData: boolean
    manageAdmins: boolean
  }
}

const INITIAL_ADMINS: AdminAccount[] = [
  {
    id: 'ADM-1001',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.admin@duseat.ae',
    role: 'Super Admin',
    department: 'Executive Governance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    lastLogin: '2026-09-11 10:48:15',
    lastActiveIp: '194.170.82.14',
    status: 'Active',
    createdAt: '2025-01-10',
    permissions: {
      users: true,
      verification: true,
      requests: true,
      deals: true,
      finance: true,
      moderation: true,
      settings: true,
      exportData: true,
      manageAdmins: true,
    },
  },
  {
    id: 'ADM-1002',
    name: 'Sarah Jenkins',
    email: 'sarah.j@duseat.ae',
    role: 'Operations Manager',
    department: 'Marketplace Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    lastLogin: '2026-09-11 09:12:40',
    lastActiveIp: '94.200.112.18',
    status: 'Active',
    createdAt: '2025-02-14',
    permissions: {
      users: true,
      verification: true,
      requests: true,
      deals: true,
      finance: false,
      moderation: true,
      settings: false,
      exportData: true,
      manageAdmins: false,
    },
  },
  {
    id: 'ADM-1003',
    name: 'Fahad Al-Nuaimi',
    email: 'fahad.finance@duseat.ae',
    role: 'Finance Manager',
    department: 'Finance & Escrow',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    lastLogin: '2026-09-11 08:30:00',
    lastActiveIp: '86.97.142.99',
    status: 'Active',
    createdAt: '2025-03-01',
    permissions: {
      users: true,
      verification: false,
      requests: false,
      deals: true,
      finance: true,
      moderation: false,
      settings: false,
      exportData: true,
      manageAdmins: false,
    },
  },
  {
    id: 'ADM-1004',
    name: 'Nouf Al-Zaabi',
    email: 'nouf.support@duseat.ae',
    role: 'Moderator',
    department: 'Trust & Moderation',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    lastLogin: '2026-09-11 09:20:11',
    lastActiveIp: '194.170.82.19',
    status: 'Active',
    createdAt: '2025-04-12',
    permissions: {
      users: true,
      verification: true,
      requests: true,
      deals: false,
      finance: false,
      moderation: true,
      settings: false,
      exportData: false,
      manageAdmins: false,
    },
  },
  {
    id: 'ADM-1005',
    name: 'Karim Mansour',
    email: 'karim.dev@duseat.ae',
    role: 'Operations Manager',
    department: 'Core Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    lastLogin: '2026-09-11 07:15:00',
    lastActiveIp: '194.170.82.11',
    status: 'Active',
    createdAt: '2025-01-20',
    permissions: {
      users: true,
      verification: true,
      requests: true,
      deals: true,
      finance: true,
      moderation: true,
      settings: true,
      exportData: true,
      manageAdmins: false,
    },
  },
]

export function AdminManagement() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'All Staff'
  const [admins, setAdmins] = React.useState<AdminAccount[]>(INITIAL_ADMINS)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState<string>(initialTab)
  const [roleFilter, setRoleFilter] = React.useState<string>('All Roles')
  const [statusFilter, setStatusFilter] = React.useState<string>('All Statuses')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [inspectAdmin, setInspectAdmin] = React.useState<AdminAccount | null>(null)
  const [showInviteModal, setShowInviteModal] = React.useState(false)

  // Invite Form
  const [inviteName, setInviteName] = React.useState('')
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [inviteRole, setInviteRole] = React.useState<AdminRole>('Operations Manager')

  const tabs = [
    'All Staff',
    'Super Admins',
    'Operations & Support',
    'Finance & Growth',
    'Permission Matrix',
  ]

  const filteredAdmins = React.useMemo(() => {
    return admins.filter((adm) => {
      if (activeTab === 'Super Admins' && adm.role !== 'Super Admin') return false
      if (
        activeTab === 'Operations & Support' &&
        adm.role !== 'Operations Manager' &&
        adm.role !== 'Moderator' &&
        adm.role !== 'Support Manager'
      )
        return false
      if (
        activeTab === 'Finance & Growth' &&
        adm.role !== 'Finance Manager' &&
        adm.role !== 'Marketing Manager'
      )
        return false

      if (roleFilter !== 'All Roles' && adm.role !== roleFilter) return false
      if (statusFilter !== 'All Statuses' && adm.status !== statusFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          adm.name.toLowerCase().includes(q) ||
          adm.email.toLowerCase().includes(q) ||
          adm.id.toLowerCase().includes(q) ||
          adm.department.toLowerCase().includes(q)
        )
      }

      return true
    })
  }, [admins, activeTab, roleFilter, statusFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / pageSize))
  const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedAdmins.map((a) => a.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleToggleStatus = (adminId: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a
      )
    )
    if (inspectAdmin?.id === adminId) {
      setInspectAdmin((prev) =>
        prev ? { ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' } : null
      )
    }
  }

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName || !inviteEmail) return

    const newAdmin: AdminAccount = {
      id: `ADM-${1000 + admins.length + 1}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      department: 'Staff Operations',
      twoFactorEnabled: true,
      lastLogin: 'Never',
      lastActiveIp: 'Awaiting activation',
      status: 'Invite Pending',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: {
        users: true,
        verification: inviteRole === 'Super Admin' || inviteRole === 'Operations Manager',
        requests: true,
        deals: true,
        finance: inviteRole === 'Super Admin' || inviteRole === 'Finance Manager',
        moderation: true,
        settings: inviteRole === 'Super Admin',
        exportData: true,
        manageAdmins: inviteRole === 'Super Admin',
      },
    }

    setAdmins((prev) => [...prev, newAdmin])
    setShowInviteModal(false)
    setInviteName('')
    setInviteEmail('')
  }

  const handleExport = () => {
    exportToCsv(
      `duseat_staff_directory_${new Date().toISOString().split('T')[0]}`,
      ['ID', 'Name', 'Email', 'Role', 'Department', '2FA', 'Status', 'Last Login', 'Created At'],
      filteredAdmins.map((a) => [
        a.id,
        a.name,
        a.email,
        a.role,
        a.department,
        a.twoFactorEnabled ? 'ENFORCED' : 'DISABLED',
        a.status,
        a.lastLogin,
        a.createdAt,
      ])
    )
  }

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'Super Admin':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[12px] font-bold bg-[#1f2327] text-white">Super Admin</span>
      case 'Operations Manager':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[12px] font-semibold bg-[#e0f7f8] text-[#00848b]">Operations</span>
      case 'Finance Manager':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[12px] font-semibold bg-[#e6f9f3] text-[#00a870]">Finance</span>
      case 'Marketing Manager':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[12px] font-semibold bg-[#f5f3ff] text-[#7c3aed]">Marketing</span>
      case 'Moderator':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[12px] font-semibold bg-[#fff8e6] text-[#b27b00]">Moderator</span>
      case 'Read Only':
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[12px] font-semibold bg-[#eff1f3] text-[#5a6068]">Read Only</span>
    }
  }

  return (
    <PlatformShell
      title="Admin Management & RBAC"
      eyebrow="Security & Access Governance"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Top Header Card */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Admin Management & RBAC
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Manage administrative operators, enforce two-factor authentication, assign granular module permissions, and inspect staff security audit trails.
              </p>
            </div>

            {/* Quick Actions Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/activity"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Activity className="size-4 text-[#00c2cb]" />
                <span>Audit Logs</span>
              </Link>
              <Link
                href="/monitoring"
                className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
              >
                <Shield className="size-4 text-[#6f777f]" />
                <span>Security Engine</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            <MetricCard
              label="Total Staff Accounts"
              value={admins.length}
              tone="neutral"
              active={activeTab === 'All Staff'}
              onClick={() => setActiveTab('All Staff')}
            />
            <MetricCard
              label="Super Administrators"
              value={admins.filter((a) => a.role === 'Super Admin').length}
              tone="brand"
              active={activeTab === 'Super Admins'}
              onClick={() => setActiveTab('Super Admins')}
            />
            <MetricCard
              label="2FA Enforcement"
              value="100%"
              tone="success"
              active={false}
            />
            <MetricCard
              label="Active Online Sessions"
              value={admins.filter((a) => a.status === 'Active').length}
              tone="warning"
              active={false}
            />
          </div>
        </header>

        {/* Single Unified Section Container */}
        <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]">
          {/* Top Pill Tabs & Action Buttons */}
          <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 py-0.5 max-w-full">
                {tabs.map((t) => {
                  const count =
                    t === 'All Staff'
                      ? admins.length
                      : t === 'Super Admins'
                      ? admins.filter((a) => a.role === 'Super Admin').length
                      : t === 'Operations & Support'
                      ? admins.filter((a) => a.role === 'Operations Manager' || a.role === 'Moderator').length
                      : t === 'Finance & Growth'
                      ? admins.filter((a) => a.role === 'Finance Manager' || a.role === 'Marketing Manager').length
                      : undefined
                  const isActive = activeTab === t
                  return (
                    <a
                      key={t}
                      href={`/admins?tab=${encodeURIComponent(t)}`}
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
                        isActive
                          ? 'bg-[#00c2cb] text-white shadow-2xs font-semibold'
                          : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                      )}
                    >
                      <span className="whitespace-nowrap">{t}</span>
                      {count !== undefined && (
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                            isActive ? 'bg-white/25 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap shadow-2xs"
                >
                  <Download className="size-4 text-[#6f777f]" />
                  <span className="whitespace-nowrap">Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn font-sans shrink-0 whitespace-nowrap"
                >
                  <Plus className="size-4 text-white" />
                  <span className="whitespace-nowrap">Invite Administrator</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row (when viewing staff list) */}
            {activeTab !== 'Permission Matrix' && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="Search name, email, ID…"
                    className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327]"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Role Filter Dropdown */}
                <Dropdown
                  align="start"
                  value={roleFilter}
                  onSelect={(val) => {
                    setRoleFilter(val)
                    setCurrentPage(1)
                  }}
                  ariaLabel="Filter by Role"
                  options={[
                    { label: 'All Roles', value: 'All Roles' },
                    { label: 'Super Admin', value: 'Super Admin' },
                    { label: 'Operations Manager', value: 'Operations Manager' },
                    { label: 'Finance Manager', value: 'Finance Manager' },
                    { label: 'Marketing Manager', value: 'Marketing Manager' },
                    { label: 'Moderator', value: 'Moderator' },
                    { label: 'Read Only', value: 'Read Only' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer shrink-0 whitespace-nowrap">
                      <Shield className="size-4 text-[#6f777f]" />
                      <span>{roleFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Status Filter Dropdown */}
                <Dropdown
                  align="start"
                  value={statusFilter}
                  onSelect={(val) => {
                    setStatusFilter(val)
                    setCurrentPage(1)
                  }}
                  ariaLabel="Filter by Status"
                  options={[
                    { label: 'All Statuses', value: 'All Statuses' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Suspended', value: 'Suspended' },
                    { label: 'Invite Pending', value: 'Invite Pending' },
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
                {(searchQuery || roleFilter !== 'All Roles' || statusFilter !== 'All Statuses') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setRoleFilter('All Roles')
                      setStatusFilter('All Statuses')
                      setCurrentPage(1)
                    }}
                    className="flex h-[38px] items-center gap-1.5 px-2 text-[13px] font-medium text-[#00c2cb] hover:underline cursor-pointer shrink-0"
                  >
                    <X className="size-3.5" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* TAB: Permission Matrix */}
          {activeTab === 'Permission Matrix' ? (
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1000px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">System Role</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Users</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Verify</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Requests</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Deals</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Finance</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Moderation</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Settings</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Export</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-center">Manage Admins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {[
                    { role: 'Super Admin', u: true, v: true, r: true, d: true, f: true, m: true, s: true, e: true, ma: true },
                    { role: 'Operations Manager', u: true, v: true, r: true, d: true, f: false, m: true, s: false, e: true, ma: false },
                    { role: 'Finance Manager', u: true, v: false, r: false, d: true, f: true, m: false, s: false, e: true, ma: false },
                    { role: 'Marketing Manager', u: false, v: false, r: false, d: false, f: false, m: false, s: false, e: true, ma: false },
                    { role: 'Moderator', u: true, v: true, r: true, d: false, f: false, m: true, s: false, e: false, ma: false },
                    { role: 'Read Only', u: true, v: true, r: true, d: true, f: true, m: true, s: false, e: true, ma: false },
                  ].map((row) => (
                    <tr key={row.role} className="h-[64px] hover:bg-[#f8f9fa] transition-colors whitespace-nowrap font-sans">
                      <td className="whitespace-nowrap px-4 font-semibold text-[14px] text-[#1f2327]">{row.role}</td>
                      <td className="px-4 text-center">{row.u ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.v ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.r ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.d ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.f ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.m ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.s ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.e ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                      <td className="px-4 text-center">{row.ma ? <Check className="size-4 text-[#00a870] mx-auto" /> : <X className="size-4 text-[#d3d5d7] mx-auto" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Staff List Table */
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1100px] border-collapse text-left text-[14px] font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="w-12 px-4">
                      <TableCheckbox
                        checked={paginatedAdmins.length > 0 && selectedIds.length === paginatedAdmins.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Staff ID</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Administrator</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Role & Clearance</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Department</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">2FA Secure</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Last Active</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Status</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d3d5d7]">
                  {paginatedAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#6f777f]">
                        <p className="text-[15px] font-semibold text-[#1f2327]">No administrators found</p>
                        <p className="text-[13px] text-[#6f777f] mt-1">Try adjusting your filters or search query.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedAdmins.map((adm) => {
                      const isSelected = selectedIds.includes(adm.id)
                      return (
                        <tr
                          key={adm.id}
                          className={cn(
                            'h-[64px] transition-colors whitespace-nowrap font-sans',
                            isSelected ? 'bg-[#e5f6f7]/40' : 'hover:bg-[#f8f9fa]'
                          )}
                        >
                          <td className="w-12 px-4">
                            <TableCheckbox
                              checked={isSelected}
                              onChange={() => handleToggle(adm.id)}
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 font-mono text-[13px] font-semibold text-[#1f2327]">
                            {adm.id}
                          </td>
                          <td className="whitespace-nowrap px-4">
                            <div className="flex items-center gap-2.5">
                              <TableAvatar name={adm.name} src={adm.avatar} size="md" />
                              <div className="leading-tight">
                                <span className="font-semibold text-[14px] text-[#1f2327] block">{adm.name}</span>
                                <span className="text-[12px] text-[#6f777f]">{adm.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4">{getRoleBadge(adm.role)}</td>
                          <td className="whitespace-nowrap px-4 text-[13.5px] text-[#6f777f] font-medium">
                            {adm.department}
                          </td>
                          <td className="whitespace-nowrap px-4">
                            {adm.twoFactorEnabled ? (
                              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#00a870]">
                                <CheckCircle2 className="size-3.5" />
                                <span>Enforced</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#dc2626]">
                                <AlertTriangle className="size-3.5" />
                                <span>Disabled</span>
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4">
                            <div className="text-[12px] leading-tight text-[#6f777f]">
                              <span>{adm.lastLogin}</span>
                              <span className="block text-[#8f969e] text-[11px] font-mono">{adm.lastActiveIp}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4">
                            <span
                              className={cn(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold',
                                adm.status === 'Active' && 'bg-[#e6f9f3] text-[#00a870]',
                                adm.status === 'Suspended' && 'bg-[#feebee] text-[#dc2626]',
                                adm.status === 'Invite Pending' && 'bg-[#fff8e6] text-[#b27b00]'
                              )}
                            >
                              {adm.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setInspectAdmin(adm)}
                              className="h-[32px] px-2.5 rounded-[6px] border border-[#d3d5d7] bg-white hover:bg-[#eff1f3] text-[12px] font-semibold text-[#1f2327] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="size-3.5 text-[#5a6068]" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Integrated Pagination Footer */}
          {activeTab !== 'Permission Matrix' && (
            <div className="border-t border-[#d3d5d7] px-4 py-3 sm:px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAdmins.length}
                rowsPerPage={pageSize}
                rowsOptions={[10, 20, 30]}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(n) => {
                  setPageSize(n)
                  setCurrentPage(1)
                }}
                itemLabel="administrators"
              />
            </div>
          )}
        </section>

        {/* Slide-over Staff Profile & Permission Inspector */}
        {inspectAdmin && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 border-l border-[#d3d5d7]">
              <div className="p-5 border-b border-[#d3d5d7] flex items-center justify-between bg-[#f8f9fa]">
                <div className="flex items-center gap-3">
                  <TableAvatar name={inspectAdmin.name} src={inspectAdmin.avatar} className="size-11 text-[14px]" />
                  <div>
                    <h2 className="text-[16px] font-bold text-[#1f2327] leading-tight">{inspectAdmin.name}</h2>
                    <p className="text-[12px] text-[#6f777f]">{inspectAdmin.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectAdmin(null)}
                  className="size-8 rounded-[6px] hover:bg-[#e4e7eb] text-[#5a6068] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="p-4 rounded-[10px] bg-[#f8f9fa] border border-[#d3d5d7] space-y-3 text-[13px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8f969e]">Assigned Role</span>
                    {getRoleBadge(inspectAdmin.role)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f969e]">Department</span>
                    <span className="font-semibold text-[#1f2327]">{inspectAdmin.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f969e]">Account Created</span>
                    <span className="font-medium text-[#1f2327]">{inspectAdmin.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f969e]">Two-Factor Authentication</span>
                    <span className="font-semibold text-[#00a870]">Hardware / TOTP Active</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13.5px] font-bold text-[#1f2327] mb-2.5">Effective Permissions</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.entries(inspectAdmin.permissions).map(([perm, granted]) => (
                      <div
                        key={perm}
                        className={cn(
                          'p-3 rounded-[8px] border text-[12.5px] flex items-center justify-between font-medium',
                          granted ? 'bg-white border-[#d3d5d7] text-[#1f2327]' : 'bg-[#f8f9fa] border-[#e4e7eb] text-[#8f969e]'
                        )}
                      >
                        <span className="capitalize">{perm.replace(/([A-Z])/g, ' $1')}</span>
                        {granted ? <Check className="size-3.5 text-[#00a870]" /> : <X className="size-3.5 text-[#d3d5d7]" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13.5px] font-bold text-[#1f2327] mb-2">Recent Operator Audit Trail</h3>
                  <div className="p-3.5 rounded-[8px] bg-white border border-[#d3d5d7] space-y-2 text-[12.5px]">
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Approved verification AGT-9012</span>
                      <span className="font-mono text-[11.5px]">2 hours ago</span>
                    </div>
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Adjusted escrow threshold CFG-01</span>
                      <span className="font-mono text-[11.5px]">1 day ago</span>
                    </div>
                    <div className="flex justify-between text-[#6f777f]">
                      <span>Exported Investor CSV (64 records)</span>
                      <span className="font-mono text-[11.5px]">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#d3d5d7] bg-white flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(inspectAdmin.id)}
                  className={cn(
                    'h-[38px] px-3.5 rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer',
                    inspectAdmin.status === 'Active'
                      ? 'border border-[#dc2626] text-[#dc2626] hover:bg-[#feebee]'
                      : 'border border-[#00a870] text-[#00a870] hover:bg-[#e6f9f3]'
                  )}
                >
                  {inspectAdmin.status === 'Active' ? 'Suspend Operator' : 'Reactivate Operator'}
                </button>

                <button
                  type="button"
                  onClick={() => setInspectAdmin(null)}
                  className="h-[38px] px-4 rounded-[6px] bg-[#1f2327] text-white text-[13px] font-semibold hover:bg-[#33383f] transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Administrator Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-[12px] shadow-2xl border border-[#d3d5d7] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-[#d3d5d7] flex items-center justify-between bg-[#f8f9fa]">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-[6px] bg-[#1f2327] text-white flex items-center justify-center">
                    <Plus className="size-4" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Invite Administrator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="size-8 rounded-[6px] hover:bg-[#e4e7eb] text-[#5a6068] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="p-5 space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1f2327] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Rashid Al-Husseini"
                    className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13.5px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#1f2327] mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="rashid.ops@duseat.ae"
                    className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 text-[13.5px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#1f2327] mb-1">Clearance Role</label>
                  <Dropdown
                    align="start"
                    value={inviteRole}
                    onSelect={(val) => setInviteRole(val as AdminRole)}
                    options={[
                      { label: 'Operations Manager', value: 'Operations Manager' },
                      { label: 'Finance Manager', value: 'Finance Manager' },
                      { label: 'Marketing Manager', value: 'Marketing Manager' },
                      { label: 'Moderator', value: 'Moderator' },
                      { label: 'Read Only', value: 'Read Only' },
                      { label: 'Super Admin', value: 'Super Admin' },
                    ]}
                    trigger={
                      <span className="inline-flex h-[38px] w-full items-center justify-between rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13.5px] font-medium text-[#1f2327] cursor-pointer">
                        <span>{inviteRole}</span>
                        <ChevronDown className="size-3.5 text-[#9da4ae]" />
                      </span>
                    }
                  />
                </div>

                <div className="p-3 rounded-[8px] bg-[#eff1f3] text-[12px] text-[#6f777f]">
                  An activation email with time-limited cryptographic token (24h) and 2FA QR code will be dispatched to this corporate inbox.
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#d3d5d7]">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="h-[36px] px-3.5 rounded-[6px] border border-[#d3d5d7] text-[13px] font-medium text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-[36px] px-4 rounded-[6px] bg-[#1f2327] hover:bg-[#2e3338] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    Dispatch Staff Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
