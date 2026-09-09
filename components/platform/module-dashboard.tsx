'use client'

import * as React from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  FileDown,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Trash2,
  X,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ChatModerator } from './chat-moderator'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { Dropdown } from '@/components/dashboard/menu'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { FigmaTableFilterHeader, type FigmaTabItem, type FigmaFilterChipConfig } from '@/components/ui/figma-table-layout'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { TableAvatar } from '@/components/ui/table-avatar'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlatformModule, ModuleRecord } from '@/lib/platform-modules'


interface ModuleDashboardProps {
  module: PlatformModule
}

function ModuleDashboardInner({ module }: ModuleDashboardProps) {
  const { toast } = useToast()
  const storageKey = `duseat_module_records_${module.slug}`
  const [viewMode, setViewMode] = React.useState<'chat-room' | 'table'>('chat-room')

  // Records state with LocalStorage persistence & fallback to module.records
  const [records, setRecords] = React.useState<ModuleRecord[]>(module.records)
  const [query, setQuery] = React.useState('')
  const [tab, setTab] = React.useState(module.tabs[0])
  const [statusFilter, setStatusFilter] = React.useState('All')
  const [customFilterValues, setCustomFilterValues] = React.useState<Record<string, string>>({})
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<string[]>([])
  const [sortAsc, setSortAsc] = React.useState(true)
  const [sortField, setSortField] = React.useState<'id' | 'primary' | 'status' | 'date'>('id')

  // Modals and Drawers
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [detailRecord, setDetailRecord] = React.useState<ModuleRecord | null>(null)
  const [columnsModalOpen, setColumnsModalOpen] = React.useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([...module.columns])
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)

  // Load from LocalStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey])

  // Save to LocalStorage whenever records change
  const saveRecords = (newRecords: ModuleRecord[]) => {
    setRecords(newRecords)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecords))
    } catch (e) {
      // ignore
    }
  }

  // Filtered and sorted dataset
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const results = records.filter((record) => {
      const matchesSearch = !q || Object.values(record).join(' ').toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'All' || record.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesTab =
        tab.startsWith('All') ||
        ['Overview', 'Executive', 'Queue', 'Campaigns', 'Plans', 'Infrastructure', 'Detection', 'Admins'].includes(tab) ||
        record.status.toLowerCase().includes(tab.toLowerCase().replace('ed', ''))
      return matchesSearch && matchesStatus && matchesTab
    })

    return results.sort((a, b) => {
      let cmp = 0
      if (sortField === 'id') cmp = a.id.localeCompare(b.id)
      else if (sortField === 'primary') cmp = a.primary.localeCompare(b.primary)
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status)
      else if (sortField === 'date') cmp = a.date.localeCompare(b.date)
      return sortAsc ? cmp : -cmp
    })
  }, [records, query, statusFilter, tab, sortField, sortAsc])

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleSelectAll = () => {
    if (selected.length === visible.length && visible.length > 0) {
      setSelected([])
    } else {
      setSelected(visible.map((r) => r.id))
    }
  }

  // Add Record Handler
  const handleAddRecord = (newRec: Omit<ModuleRecord, 'id'>) => {
    const prefix = module.slug.slice(0, 3).toUpperCase()
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const record: ModuleRecord = {
      id: `${prefix}-${randomNum}`,
      ...newRec,
    }
    const updated = [record, ...records]
    saveRecords(updated)
    setCreateModalOpen(false)
    toast({
      variant: 'success',
      title: 'Record created',
      description: `${record.primary} (${record.id}) added to ${module.title}.`,
    })
  }

  // Update Status Handler
  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = records.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    saveRecords(updated)
    if (detailRecord && detailRecord.id === id) {
      setDetailRecord({ ...detailRecord, status: newStatus })
    }
    toast({ variant: 'success', title: 'Status updated', description: `Record status changed to ${newStatus}.` })
  }

  // Delete Record Handler
  const handleDeleteRecord = (id: string) => {
    setConfirmDialog({
      title: 'Delete record?',
      description: `This will permanently remove ${id} from ${module.title}. This action cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      icon: 'delete',
      onConfirm: () => {
        const updated = records.filter((r) => r.id !== id)
        saveRecords(updated)
        setSelected((prev) => prev.filter((item) => item !== id))
        if (detailRecord?.id === id) setDetailRecord(null)
        toast({ variant: 'error', title: 'Record deleted', description: `Record ${id} removed successfully.` })
      },
    })
  }

  // Bulk Status Update
  const handleBulkStatus = (status: string) => {
    const updated = records.map((r) => (selected.includes(r.id) ? { ...r, status } : r))
    saveRecords(updated)
    toast({
      variant: 'success',
      title: 'Bulk update complete',
      description: `${selected.length} records updated to "${status}".`,
    })
    setSelected([])
  }

  // Bulk Delete
  const handleBulkDelete = () => {
    setConfirmDialog({
      title: `Delete ${selected.length} records?`,
      description: `You are about to permanently remove ${selected.length} items from ${module.title}.`,
      confirmLabel: 'Delete All',
      tone: 'danger',
      icon: 'delete',
      onConfirm: () => {
        const updated = records.filter((r) => !selected.includes(r.id))
        saveRecords(updated)
        toast({
          variant: 'error',
          title: 'Records deleted',
          description: `${selected.length} records removed.`,
        })
        setSelected([])
      },
    })
  }

  // CSV Export
  const handleExportCsv = (itemsToExport = filtered) => {
    const headers = [module.columns[0], module.columns[1], module.columns[2], module.columns[3], module.columns[4], module.columns[5]]
    const rows = itemsToExport.map((r) => [r.id, `"${r.primary}"`, `"${r.secondary}"`, r.status, `"${r.value}"`, `"${r.date}"`])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${module.slug}_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      variant: 'success',
      title: 'Export complete',
      description: `Exported ${itemsToExport.length} records to CSV.`,
    })
  }

  // Reset to default data
  const handleResetData = () => {
    localStorage.removeItem(storageKey)
    setRecords(module.records)
    setSelected([])
    toast({
      variant: 'info',
      title: 'Data reset',
      description: `Restored default sample data for ${module.title}.`,
    })
  }

  return (
    <PlatformShell
      title={module.title}
      eyebrow={module.eyebrow}
      query={query}
      onQueryChange={(value) => {
        setQuery(value)
        setPage(1)
      }}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExportCsv(filtered)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm font-medium hover:bg-secondary sm:flex"
          >
            <Download className="size-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:flex"
          >
            <Plus className="size-4" />
            {module.primaryAction}
          </button>
        </div>
      }
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5">
        {/* Module Banner with dynamic animated visual bars */}
        <section className="overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          <div className="flex flex-col justify-between gap-4 p-4 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h2 className="text-balance text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] tracking-tight text-[#1f2327]">
                {module.title}
              </h2>
              <p className="mt-1.5 max-w-xl text-pretty text-[14px] leading-[20px] text-[#6f777f]">{module.description}</p>
            </div>
            {/* Visual trend bars */}
            <div className="flex items-end gap-1.5">
              {[35, 48, 42, 60, 68, 64, 78, 72, 85, 90, 84, 96].map((h, i) => (
                <div key={i} className="group relative flex flex-col items-center">
                  <span
                    className="w-2.5 rounded-t bg-[#00c2cb]/30 transition-all duration-300 group-hover:scale-y-110 group-hover:bg-[#00c2cb]"
                    style={{ height: `${h}px` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid border-t border-[#d3d5d7] sm:grid-cols-2 xl:grid-cols-4">
            {module.metrics.map((metric, index) => (
              <article
                key={metric.label}
                className={cn(
                  'p-3 sm:p-3.5 transition-colors hover:bg-[#f8f9fa]',
                  index > 0 && 'border-t border-[#d3d5d7] sm:border-l sm:border-t-0',
                  index === 2 && 'sm:border-l-0 xl:border-l'
                )}
              >
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-wider text-[#6f777f]">{metric.label}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-[24px] leading-[32px] font-bold tabular-nums text-[#1f2327]">{metric.value}</p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] leading-[16px] font-semibold',
                      metric.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {metric.positive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                    {metric.change}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* If Conversations Module: Offer View Mode Toggle */}
        {module.slug === 'conversations' && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d3d5d7] bg-white p-3 shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1f2327]">Chat Management View:</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-[8px] bg-[#eff1f3] p-1">
              <button
                type="button"
                onClick={() => setViewMode('chat-room')}
                className={cn(
                  'flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                  viewMode === 'chat-room'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
              >
                <MessageSquare className="size-3.5" />
                <span>Live Negotiation Room (Figma UI)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                  viewMode === 'table'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
              >
                <span>Directory Table</span>
              </button>
            </div>
          </div>
        )}

        {module.slug === 'conversations' && viewMode === 'chat-room' ? (
          <ChatModerator />
        ) : (
          /* Records Table Section with Standard Figma Filters & Header */
          <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
            <FigmaTableFilterHeader
              tabs={module.tabs.map((t) => ({ id: t, label: t }))}
              activeTab={tab}
              onTabChange={(item) => {
                setTab(item)
                setPage(1)
              }}
              onCustomizeColumns={() => setColumnsModalOpen(true)}
              onResetFilters={handleResetData}
              filterChips={[
                {
                  id: 'status',
                  label: 'Status',
                  selectedValue: statusFilter,
                  options: [
                    { label: 'All Statuses', value: 'All' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Verified', value: 'Verified' },
                    { label: 'Under review', value: 'Under review' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Flagged', value: 'Flagged' },
                    { label: 'Suspended', value: 'Suspended' },
                  ],
                },
                ...module.filters.slice(0, 3).map((f) => ({
                  id: f.toLowerCase().replace(/\s+/g, '_'),
                  label: f,
                  selectedValue: customFilterValues[f.toLowerCase().replace(/\s+/g, '_')] || 'all',
                  options: [
                    { label: `All ${f}`, value: 'all' },
                    { label: `Standard ${f}`, value: 'standard' },
                    { label: `Priority ${f}`, value: 'priority' },
                  ],
                })),
              ]}
              onFilterChange={(chipId, val) => {
                if (chipId === 'status') {
                  setStatusFilter(val)
                } else {
                  setCustomFilterValues((prev) => ({ ...prev, [chipId]: val }))
                }
                setPage(1)
              }}
              searchQuery={query}
              onSearchChange={(q) => {
                setQuery(q)
                setPage(1)
              }}
              searchPlaceholder={`Search ${module.title}...`}
              totalCount={filtered.length}
              countLabel="records found"
            />

            {/* Bulk Action Banner */}
            {selected.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-4 py-2.5 text-[13px] font-medium text-[#1f2327]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-[#1f2327]">
                    {selected.length} {selected.length === 1 ? 'record' : 'records'} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBulkStatus('Completed')}
                      className="h-[32px] rounded-[8px] bg-[#00c2cb] px-3 text-[12px] font-semibold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors"
                    >
                      Mark Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkStatus('Active')}
                      className="h-[32px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
                    >
                      Mark Active
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportCsv(records.filter((r) => selected.includes(r.id)))}
                      className="h-[32px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors"
                    >
                      Export Selected
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkDelete}
                      className="h-[32px] rounded-[8px] px-3 text-[12px] font-semibold text-[#f04438] hover:bg-[#fef3f2] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="text-[12px] font-medium text-[#6f777f] hover:text-[#1f2327] transition-colors"
                >
                  Clear selection
                </button>
              </div>
            )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-[14px] font-sans">
              <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                <tr className="h-12 whitespace-nowrap">
                  <th className="w-12 px-4 whitespace-nowrap">
                    <TableCheckbox
                      ariaLabel="Select all visible records"
                      checked={visible.length > 0 && selected.length === visible.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {module.columns.map((col, index) => {
                    if (!visibleColumns.includes(col)) return null
                    return (
                      <th key={col} className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">
                        <button
                          type="button"
                          onClick={() => {
                            if (index === 0) {
                              setSortField('id')
                              setSortAsc(!sortAsc)
                            } else if (index === 1) {
                              setSortField('primary')
                              setSortAsc(!sortAsc)
                            } else if (index === 3) {
                              setSortField('status')
                              setSortAsc(!sortAsc)
                            } else if (index === 5) {
                              setSortField('date')
                              setSortAsc(!sortAsc)
                            }
                          }}
                          className="inline-flex items-center gap-1.5 hover:text-foreground"
                        >
                          {col}
                          <ArrowUpDown className="size-3 opacity-60" />
                        </button>
                      </th>
                    )
                  })}
                  <th className="w-12 px-4 text-right text-[14px] font-semibold text-[#1f2327]">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#d3d5d7]">
                {visible.map((record) => (
                  <tr
                    key={record.id}
                    className={cn(
                      "h-[60px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap",
                      selected.includes(record.id) && "bg-[#e5f6f7]/40"
                    )}
                  >
                    <td className="px-4 whitespace-nowrap">
                      <TableCheckbox
                        ariaLabel={`Select ${record.id}`}
                        checked={selected.includes(record.id)}
                        onChange={() =>
                          setSelected((items) =>
                            items.includes(record.id) ? items.filter((id) => id !== record.id) : [...items, record.id]
                          )
                        }
                      />
                    </td>

                    {visibleColumns.includes(module.columns[0]) && (
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium text-foreground">
                        <button
                          type="button"
                          onClick={() => setDetailRecord(record)}
                          className="font-mono text-xs font-semibold text-brand hover:underline"
                        >
                          {record.id}
                        </button>
                      </td>
                    )}

                    {visibleColumns.includes(module.columns[1]) && (
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-foreground">{record.primary}</p>
                        <p className="text-xs text-muted-foreground">{record.secondary}</p>
                      </td>
                    )}

                    {visibleColumns.includes(module.columns[2]) && (
                      <td className="px-4 py-3.5 text-muted-foreground">{record.secondary}</td>
                    )}

                    {visibleColumns.includes(module.columns[3]) && (
                      <td className="px-4 py-3.5">
                        <FigmaStatusBadge status={record.status} />
                      </td>
                    )}

                    {visibleColumns.includes(module.columns[4]) && (
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold tabular-nums text-foreground">
                        {record.value}
                      </td>
                    )}

                    {visibleColumns.includes(module.columns[5]) && (
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted-foreground">{record.date}</td>
                    )}

                    <td className="px-4 py-3.5 text-right">
                      <Dropdown
                        align="end"
                        floating
                        ariaLabel={`Actions for ${record.id}`}
                        options={[
                          { label: 'View details', value: 'view', icon: <Eye className="size-4" /> },
                          { label: 'Mark active', value: 'status-active', icon: <Check className="size-4 text-success" /> },
                          { label: 'Mark completed', value: 'status-completed', icon: <Check className="size-4 text-brand" /> },
                          { label: 'Mark flagged', value: 'status-flagged', icon: <Filter className="size-4 text-destructive" /> },
                          { label: 'Export record', value: 'export', icon: <Download className="size-4" /> },
                          { label: 'Delete record', value: 'delete', destructive: true, icon: <Trash2 className="size-4" /> },
                        ]}
                        onSelect={(value) => {
                          if (value === 'view') setDetailRecord(record)
                          else if (value === 'status-active') handleUpdateStatus(record.id, 'Active')
                          else if (value === 'status-completed') handleUpdateStatus(record.id, 'Completed')
                          else if (value === 'status-flagged') handleUpdateStatus(record.id, 'Flagged')
                          else if (value === 'export') handleExportCsv([record])
                          else if (value === 'delete') handleDeleteRecord(record.id)
                        }}
                        trigger={
                          <span className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                            <MoreHorizontal className="size-4" />
                          </span>
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visible.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <p className="font-semibold text-foreground">No matching records found</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Try adjusting your search criteria, clearing filters, or adding a new record.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setStatusFilter('All')
                    setTab(module.tabs[0])
                  }}
                  className="mt-4 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {visible.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} records
            </p>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                    currentPage === number ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'
                  )}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </section>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      {detailRecord && (
        <RecordDetailDrawer
          record={detailRecord}
          module={module}
          onClose={() => setDetailRecord(null)}
          onUpdateStatus={(newStatus) => handleUpdateStatus(detailRecord.id, newStatus)}
          onDelete={() => handleDeleteRecord(detailRecord.id)}
          onExport={() => handleExportCsv([detailRecord])}
        />
      )}

      {/* Add New Record Modal */}
      {createModalOpen && (
        <CreateRecordModal
          module={module}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleAddRecord}
        />
      )}

      {/* Columns Customizer Modal */}
      {columnsModalOpen && (
        <ColumnsCustomizerModal
          allColumns={module.columns}
          visibleColumns={visibleColumns}
          onToggle={(col) =>
            setVisibleColumns((prev) =>
              prev.includes(col) ? (prev.length > 2 ? prev.filter((c) => c !== col) : prev) : [...prev, col]
            )
          }
          onClose={() => setColumnsModalOpen(false)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog request={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </PlatformShell>
  )
}

function StatusPill({ value }: { value: string }) {
  const positive = ['Active', 'Verified', 'Completed', 'Approved'].includes(value)
  const danger = ['Flagged', 'Suspended', 'Rejected', 'Failed', 'Cancelled'].includes(value)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        positive
          ? 'bg-success/10 text-success'
          : danger
          ? 'bg-destructive/10 text-destructive'
          : 'bg-amber-100 text-amber-700'
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  )
}

// Slide-Over Detail Drawer
function RecordDetailDrawer({
  record,
  module,
  onClose,
  onUpdateStatus,
  onDelete,
  onExport,
}: {
  record: ModuleRecord
  module: PlatformModule
  onClose: () => void
  onUpdateStatus: (status: string) => void
  onDelete: () => void
  onExport: () => void
}) {
  return (
    <div className="fixed inset-0 z-[75] flex justify-end bg-foreground/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
              {module.title}
            </div>
            <h3 className="mt-2 text-xl font-bold text-foreground">{record.id}</h3>
            <p className="text-sm font-medium text-muted-foreground">{record.primary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 flex-1">
          {/* Status & Quick Change */}
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</p>
            <div className="mt-2 flex items-center justify-between">
              <StatusPill value={record.status} />
              <div className="flex items-center gap-1">
                {['Active', 'Completed', 'Flagged'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdateStatus(s)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      record.status === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-input hover:bg-secondary'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Record Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-medium text-muted-foreground">{module.columns[1]}</p>
              <p className="mt-1 font-semibold text-foreground">{record.primary}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-medium text-muted-foreground">{module.columns[2]}</p>
              <p className="mt-1 font-semibold text-foreground">{record.secondary}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-medium text-muted-foreground">{module.columns[4]}</p>
              <p className="mt-1 font-semibold tabular-nums text-foreground">{record.value}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-medium text-muted-foreground">{module.columns[5]}</p>
              <p className="mt-1 font-semibold text-foreground">{record.date}</p>
            </div>
          </div>

          {/* Audit Timeline */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activity Timeline</h4>
            <div className="mt-3 space-y-3 border-l-2 border-border pl-4">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-brand" />
                <p className="text-xs font-semibold text-foreground">Record created</p>
                <p className="text-[11px] text-muted-foreground">{record.date} · System Automated</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-success" />
                <p className="text-xs font-semibold text-foreground">Verification check passed</p>
                <p className="text-[11px] text-muted-foreground">Platform Compliance Engine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            Delete Record
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="size-4" />
            Export Data
          </button>
        </div>
      </aside>
    </div>
  )
}

// Add New Record Modal
function CreateRecordModal({
  module,
  onClose,
  onCreate,
}: {
  module: PlatformModule
  onClose: () => void
  onCreate: (record: Omit<ModuleRecord, 'id'>) => void
}) {
  const [primary, setPrimary] = React.useState('')
  const [secondary, setSecondary] = React.useState('')
  const [status, setStatus] = React.useState('Active')
  const [value, setValue] = React.useState('AED 25,000')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!primary.trim()) return
    onCreate({
      primary,
      secondary: secondary || 'Ahmad Khaled',
      status,
      value: value || 'AED 15,000',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{module.primaryAction}</h3>
            <p className="text-xs text-muted-foreground">{module.title}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {module.columns[1]}
            </label>
            <input
              type="text"
              required
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              placeholder={`e.g. ${module.title} Item`}
              className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {module.columns[2]}
            </label>
            <input
              type="text"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              placeholder="e.g. Omar Nasser"
              className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Completed">Completed</option>
                <option value="Under review">Under review</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {module.columns[4]}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="AED 24,000"
                className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Columns Customizer Modal
function ColumnsCustomizerModal({
  allColumns,
  visibleColumns,
  onToggle,
  onClose,
}: {
  allColumns: [string, string, string, string, string, string]
  visibleColumns: string[]
  onToggle: (col: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-foreground">Customize Table Columns</h3>
            <p className="text-xs text-muted-foreground">Select columns to display in this table.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {allColumns.map((col) => {
            const isVisible = visibleColumns.includes(col)
            return (
              <button
                key={col}
                type="button"
                onClick={() => onToggle(col)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  isVisible ? 'border-brand/40 bg-accent text-accent-foreground' : 'border-border bg-card text-muted-foreground'
                )}
              >
                <span>{col}</span>
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded border',
                    isVisible ? 'border-brand bg-brand text-brand-foreground' : 'border-border'
                  )}
                >
                  {isVisible && <Check className="size-3" />}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground"
        >
          Apply Columns
        </button>
      </div>
    </div>
  )
}

export function ModuleDashboard({ module }: ModuleDashboardProps) {
  return (
    <ToastProvider>
      <ModuleDashboardInner module={module} />
    </ToastProvider>
  )
}
