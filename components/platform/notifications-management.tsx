'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Bell,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Plus,
  Copy,
  Check,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Share2,
  Smartphone,
  Mail,
  Layers,
  Tag,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw,
  Sparkles,
  Users,
  User,
  Globe,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Percent,
  Play,
  Pause,
  ArrowRight,
  ArrowUpDown,
  Monitor,
  CheckCheck,
  Inbox,
  LayoutTemplate,
  PieChart,
  BarChart3,
  History,
  Info,
  HelpCircle,
  List,
  LayoutGrid,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { Dropdown } from '@/components/dashboard/menu'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { ScheduleExportModal } from './schedule-export-modal'
import { DateRangePicker } from './date-range-picker'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { TableAvatar } from '@/components/ui/table-avatar'
import { FigmaStatusBadge, AgentPlanBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode, AvatarFlagOverlay } from '@/components/ui/flag'
import {
  FilterTabs,
  MetricCard,
  SearchInput,
  Pagination,
  EmptyState,
  NavigationTabs,
  StatusFilterTabs,
  FilterChip,
  FilterChipGroup,
  TableLayoutContainer,
  TableTopBar,
  FilterSection,
  FilterCheckbox,
  FilterRadioGroup,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  type NotificationItem,
  type NotificationStatus,
  type NotificationChannel,
  type NotificationCategory,
  type AudienceType,
  type NotificationTemplate,
  type NotificationTimelineEvent,
  type CustomAudienceRule,
  NOTIFICATION_VARIABLES,
  NOTIFICATION_CATEGORIES,
  initialNotifications,
  initialTemplates,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredTemplates,
  saveStoredTemplates,
} from '@/lib/notifications-data'

type MainViewTab = 'notifications' | 'templates' | 'history' | 'analytics'

export function NotificationsManagement() {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <NotificationsManagementInner />
      </React.Suspense>
    </ToastProvider>
  )
}

function NotificationsManagementInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Master State
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications)
  const [templates, setTemplates] = React.useState<NotificationTemplate[]>(initialTemplates)
  const [viewMode, setViewMode] = React.useState<MainViewTab>('notifications')
  const [statusFilter, setStatusFilter] = React.useState<NotificationStatus | 'All'>('All')
  const [channelFilter, setChannelFilter] = React.useState<string>('All Channels')
  const [audienceFilter, setAudienceFilter] = React.useState<string>('All Audiences')
  const [templateFilter, setTemplateFilter] = React.useState<string>('All Templates')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All')
  const [creatorFilter, setCreatorFilter] = React.useState<string>('All Creators')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [dateRange, setDateRange] = React.useState<string>('All Time')
  const [showFilters, setShowFilters] = React.useState<boolean>(true)
  const [sortBy, setSortBy] = React.useState<'date_desc' | 'date_asc' | 'delivery' | 'open_rate' | 'name'>('date_desc')

  // Table selection & pagination
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10)
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)

  // Drawer & Modal states
  const [selectedNotification, setSelectedNotification] = React.useState<NotificationItem | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState<boolean>(false)
  const [createInitialTemplate, setCreateInitialTemplate] = React.useState<NotificationTemplate | null>(null)
  const [isScheduleExportOpen, setIsScheduleExportOpen] = React.useState<boolean>(false)
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = React.useState<boolean>(false)
  const [editingTemplate, setEditingTemplate] = React.useState<NotificationTemplate | null>(null)

  // Load from local storage & searchParams on mount
  React.useEffect(() => {
    const stored = getStoredNotifications()
    setNotifications(stored)
    setTemplates(getStoredTemplates())

    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      const found = stored.find((n) => n.id.toLowerCase() === idFromUrl.toLowerCase())
      if (found) {
        setSelectedNotification(found)
      } else {
        setSearchQuery(idFromUrl)
      }
    }
  }, [searchParams])

  // Sync state to storage
  const updateNotifications = (newItems: NotificationItem[]) => {
    setNotifications(newItems)
    saveStoredNotifications(newItems)
  }

  const updateTemplates = (newTemplates: NotificationTemplate[]) => {
    setTemplates(newTemplates)
    saveStoredTemplates(newTemplates)
  }

  const notify = (title: string, description: string, variant: 'success' | 'error' | 'info' = 'success', actionLabel?: string, onAction?: () => void) => {
    toast({
      title,
      description,
      variant,
      actionLabel,
      actionRoute: actionLabel ? '#' : undefined,
    })
  }

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setNotifications(getStoredNotifications())
      setIsRefreshing(false)
      notify('Notifications Synchronized', 'Latest notification delivery telemetry updated from push gateway.')
    }, 600)
  }

  // Copy ID helper
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    notify('Copied to Clipboard', `Notification ID ${id} copied.`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Notification ID', 'Campaign Name', 'Category', 'Channels', 'Audience', 'Status', 'Scheduled/Sent', 'Delivered', 'Open Rate', 'Created By']
    const rows = filteredNotifications.map((n) => [
      n.id,
      `"${n.name.replace(/"/g, '""')}"`,
      n.category,
      n.channels.join(' + '),
      `"${n.audience.type}"`,
      n.status,
      n.sentAt || n.scheduledAt || n.createdAt,
      n.metrics ? `${n.metrics.deliveredCount} (${((n.metrics.deliveredCount / n.metrics.sentCount) * 100).toFixed(1)}%)` : '—',
      n.metrics ? `${((n.metrics.openedCount / n.metrics.deliveredCount) * 100).toFixed(1)}%` : '—',
      `"${n.createdBy.name}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `duseat_notifications_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Export Generated', `Exported ${filteredNotifications.length} notification campaign records.`)
  }

  // Action handlers
  const handleDuplicate = (item: NotificationItem) => {
    const duplicated: NotificationItem = {
      ...item,
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${item.name} (Copy)`,
      status: 'draft',
      createdAt: 'Just now',
      sentAt: undefined,
      scheduledAt: undefined,
      metrics: undefined,
      deviceStats: undefined,
      countryStats: undefined,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          event: `Duplicated from ${item.id}`,
          actor: 'Admin Operator',
          actorRole: 'Campaign Officer',
          timestamp: 'Just now',
          type: 'created',
        },
      ],
    }
    const next = [duplicated, ...notifications]
    updateNotifications(next)
    notify('Notification Duplicated', `Draft created as ${duplicated.id}.`, 'success', 'View Draft', () => setSelectedNotification(duplicated))
  }

  const handleDeleteNotification = (item: NotificationItem) => {
    setConfirmDialog({
      title: 'Delete Notification?',
      description: `Are you sure you want to permanently delete "${item.name}" (${item.id})? This action cannot be undone.`,
      confirmLabel: 'Delete Notification',
      tone: 'danger',
      onConfirm: () => {
        const next = notifications.filter((n) => n.id !== item.id)
        updateNotifications(next)
        setSelectedIds((prev) => prev.filter((id) => id !== item.id))
        if (selectedNotification?.id === item.id) setSelectedNotification(null)
        notify('Notification Deleted', `Notification ${item.id} has been removed.`, 'info')
      },
    })
  }

  const handleCancelSchedule = (item: NotificationItem) => {
    setConfirmDialog({
      title: 'Cancel Scheduled Notification?',
      description: `The notification "${item.name}" is scheduled for ${item.scheduledAt || 'future delivery'}. Do you want to cancel dispatch?`,
      confirmLabel: 'Cancel Schedule',
      tone: 'danger',
      onConfirm: () => {
        const next = notifications.map((n) =>
          n.id === item.id
            ? {
                ...n,
                status: 'cancelled' as NotificationStatus,
                timeline: [
                  {
                    id: `tl-${Date.now()}`,
                    event: 'Scheduled dispatch cancelled by admin',
                    actor: 'Admin Operator',
                    actorRole: 'Campaign Officer',
                    timestamp: 'Just now',
                    type: 'cancelled' as const,
                  },
                  ...n.timeline,
                ],
              }
            : n
        )
        updateNotifications(next)
        notify('Schedule Cancelled', `Notification ${item.id} marked as cancelled.`, 'info')
      },
    })
  }

  const handleRetrySending = (item: NotificationItem) => {
    const next = notifications.map((n) =>
      n.id === item.id
        ? {
            ...n,
            status: 'sending' as NotificationStatus,
            timeline: [
              {
                id: `tl-${Date.now()}`,
                event: 'Retrying message delivery queue dispatch',
                actor: 'Admin Operator',
                actorRole: 'Campaign Officer',
                timestamp: 'Just now',
                type: 'created' as const,
              },
              ...n.timeline,
            ],
          }
        : n
    )
    updateNotifications(next)
    notify('Delivery Retrying', `Retrying broadcast dispatch for ${item.id}...`)

    setTimeout(() => {
      const completed = notifications.map((n) =>
        n.id === item.id
          ? {
              ...n,
              status: 'sent' as NotificationStatus,
              sentAt: 'Just now',
              metrics: {
                sentCount: n.audience.estimatedReach || 1200,
                deliveredCount: Math.round((n.audience.estimatedReach || 1200) * 0.985),
                openedCount: Math.round((n.audience.estimatedReach || 1200) * 0.65),
                clickedCount: Math.round((n.audience.estimatedReach || 1200) * 0.22),
                failedCount: 18,
              },
              timeline: [
                {
                  id: `tl-${Date.now()}`,
                  event: 'Broadcast dispatched successfully after retry',
                  actor: 'Notification Gateway',
                  actorRole: 'System',
                  timestamp: 'Just now',
                  type: 'completed' as const,
                },
                ...n.timeline,
              ],
            }
          : n
      )
      updateNotifications(completed)
      notify('Broadcast Sent', `Notification ${item.id} sent successfully!`)
    }, 1500)
  }

  // Filtered Notifications
  const filteredNotifications = React.useMemo(() => {
    let list = notifications.filter((item) => {
      // Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) return false

      // Channel filter
      if (channelFilter !== 'All Channels') {
        const norm = channelFilter.toLowerCase().replace(' ', '-')
        if (!item.channels.some((c) => c.toLowerCase() === norm || c.toLowerCase() === channelFilter.toLowerCase())) {
          return false
        }
      }

      // Audience filter
      if (audienceFilter !== 'All Audiences' && item.audience.type !== audienceFilter) return false

      // Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false

      // Template filter
      if (templateFilter !== 'All Templates' && item.templateName !== templateFilter) return false

      // Creator filter
      if (creatorFilter !== 'All Creators' && item.createdBy.name !== creatorFilter) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(q)
        const matchId = item.id.toLowerCase().includes(q)
        const matchTemplate = item.templateName?.toLowerCase().includes(q) || false
        const matchTitle = item.pushSettings?.title.toLowerCase().includes(q) || item.inAppSettings?.title.toLowerCase().includes(q) || false
        const matchBody = item.pushSettings?.body.toLowerCase().includes(q) || item.inAppSettings?.message.toLowerCase().includes(q) || false
        if (!matchName && !matchId && !matchTemplate && !matchTitle && !matchBody) return false
      }

      return true
    })

    // Sort
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'delivery') {
      list.sort((a, b) => (b.metrics?.deliveredCount || 0) - (a.metrics?.deliveredCount || 0))
    } else if (sortBy === 'open_rate') {
      list.sort((a, b) => {
        const rateA = a.metrics && a.metrics.deliveredCount > 0 ? a.metrics.openedCount / a.metrics.deliveredCount : 0
        const rateB = b.metrics && b.metrics.deliveredCount > 0 ? b.metrics.openedCount / b.metrics.deliveredCount : 0
        return rateB - rateA
      })
    } else if (sortBy === 'date_asc') {
      list.reverse()
    }

    return list
  }, [notifications, statusFilter, channelFilter, audienceFilter, categoryFilter, templateFilter, creatorFilter, searchQuery, sortBy])

  // Counts for KPI & status tabs
  const statusCounts = React.useMemo(() => {
    return {
      All: notifications.length,
      draft: notifications.filter((n) => n.status === 'draft').length,
      scheduled: notifications.filter((n) => n.status === 'scheduled').length,
      sending: notifications.filter((n) => n.status === 'sending').length,
      sent: notifications.filter((n) => n.status === 'sent').length,
      failed: notifications.filter((n) => n.status === 'failed').length,
      cancelled: notifications.filter((n) => n.status === 'cancelled').length,
    }
  }, [notifications])

  const totalCount = notifications.length
  const sentCount = statusCounts.sent
  const scheduledCount = statusCounts.scheduled
  const draftsCount = statusCounts.draft
  const failedCount = statusCounts.failed

  const deliveredTotal = React.useMemo(() => {
    return notifications.reduce((sum, n) => sum + (n.metrics?.deliveredCount || 0), 0)
  }, [notifications])

  const avgDeliveryRate = React.useMemo(() => {
    const sentTotal = notifications.reduce((sum, n) => sum + (n.metrics?.sentCount || 0), 0)
    if (!sentTotal) return '98.4%'
    return `${((deliveredTotal / sentTotal) * 100).toFixed(1)}%`
  }, [notifications, deliveredTotal])

  const avgOpenRate = React.useMemo(() => {
    const openedTotal = notifications.reduce((sum, n) => sum + (n.metrics?.openedCount || 0), 0)
    if (!deliveredTotal) return '68.2%'
    return `${((openedTotal / deliveredTotal) * 100).toFixed(1)}%`
  }, [notifications, deliveredTotal])

  // Unique Filter Options
  const audienceOptions = React.useMemo(() => {
    const set = new Set(notifications.map((n) => n.audience.type))
    return ['All Audiences', ...Array.from(set)].map((a) => ({ label: a, value: a }))
  }, [notifications])

  const templateOptions = React.useMemo(() => {
    const set = new Set(notifications.map((n) => n.templateName).filter(Boolean) as string[])
    return ['All Templates', ...Array.from(set)].map((t) => ({ label: t, value: t }))
  }, [notifications])

  const creatorOptions = React.useMemo(() => {
    const set = new Set(notifications.map((n) => n.createdBy.name))
    return ['All Creators', ...Array.from(set)].map((c) => ({ label: c, value: c }))
  }, [notifications])

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'All' ||
    channelFilter !== 'All Channels' ||
    audienceFilter !== 'All Audiences' ||
    categoryFilter !== 'All' ||
    templateFilter !== 'All Templates' ||
    creatorFilter !== 'All Creators' ||
    dateRange !== 'All Time'

  const resetAllFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setChannelFilter('All Channels')
    setAudienceFilter('All Audiences')
    setCategoryFilter('All')
    setTemplateFilter('All Templates')
    setCreatorFilter('All Creators')
    setDateRange('All Time')
  }

  // Pagination Slice
  const paginatedNotifications = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredNotifications.slice(start, start + rowsPerPage)
  }, [filteredNotifications, currentPage, rowsPerPage])

  const totalPages = Math.ceil(filteredNotifications.length / rowsPerPage) || 1

  // Selection
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredNotifications.map((n) => n.id) : [])
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)))
  }

  return (
    <PlatformShell
      title="Notifications & Campaigns"
      eyebrow="communications"
      query={searchQuery}
      onQueryChange={setSearchQuery}
    >
      <div className="flex w-full min-w-0 flex-col gap-5 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* =========================================================================
            1. TOP HEADER CARD (Matches Duseat Global Header Standard)
           ========================================================================= */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327]">
                Notifications
              </h1>
              <p className="mt-0.5 text-[14px] leading-[20px] text-[#6f777f]">
                Create, schedule, manage and monitor notifications across Duseat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switchers */}
              <div className="flex items-center rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('notifications')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium transition-all cursor-pointer',
                    viewMode === 'notifications' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <List className="size-3.5" />
                  <span>Notifications</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('templates')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium transition-all cursor-pointer',
                    viewMode === 'templates' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <LayoutTemplate className="size-3.5" />
                  <span>Templates ({templates.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('analytics')}
                  className={cn(
                    'flex h-[30px] items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium transition-all cursor-pointer',
                    viewMode === 'analytics' ? 'bg-[#1f2327] text-white shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  <BarChart3 className="size-3.5" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer disabled:opacity-60"
                title="Synchronize notification queue"
              >
                <RotateCcw className={cn('size-4 text-[#6f777f]', isRefreshing && 'animate-spin text-[#00c2cb]')} />
                <span>Refresh</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                <Download className="size-4 text-[#6f777f]" />
                <span>Export</span>
              </button>

              {/* Primary: Create Notification */}
              <button
                type="button"
                onClick={() => {
                  setCreateInitialTemplate(null)
                  setIsCreateModalOpen(true)
                }}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
              >
                <Plus className="size-4" />
                <span>Create Notification</span>
              </button>
            </div>
          </div>

          {/* 8 Stat Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-3">
            <MetricCard
              label="Total Notifications"
              value={totalCount}
              tone="neutral"
              active={statusFilter === 'All' && viewMode === 'notifications'}
              onClick={() => {
                setViewMode('notifications')
                setStatusFilter('All')
              }}
            />
            <MetricCard
              label="Sent"
              value={sentCount}
              tone="success"
              active={statusFilter === 'sent' && viewMode === 'notifications'}
              onClick={() => {
                setViewMode('notifications')
                setStatusFilter('sent')
              }}
            />
            <MetricCard
              label="Scheduled"
              value={scheduledCount}
              tone="info"
              active={statusFilter === 'scheduled' && viewMode === 'notifications'}
              onClick={() => {
                setViewMode('notifications')
                setStatusFilter('scheduled')
              }}
            />
            <MetricCard
              label="Drafts"
              value={draftsCount}
              tone="warning"
              active={statusFilter === 'draft' && viewMode === 'notifications'}
              onClick={() => {
                setViewMode('notifications')
                setStatusFilter('draft')
              }}
            />
            <MetricCard
              label="Delivered"
              value={deliveredTotal > 999 ? `${(deliveredTotal / 1000).toFixed(1)}k` : deliveredTotal}
              tone="brand"
            />
            <MetricCard
              label="Failed"
              value={failedCount}
              tone="destructive"
              active={statusFilter === 'failed' && viewMode === 'notifications'}
              onClick={() => {
                setViewMode('notifications')
                setStatusFilter('failed')
              }}
            />
            <MetricCard
              label="Delivery Rate"
              value={avgDeliveryRate}
              tone="success"
            />
            <MetricCard
              label="Open Rate"
              value={avgOpenRate}
              tone="info"
            />
          </div>
        </header>

        {/* =========================================================================
            3. MAIN CONTENT CONTAINER (Table / Templates / Analytics Views)
           ========================================================================= */}
        {viewMode === 'notifications' && (
          <section className="overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
            {/* Top Status Tabs & Horizontal Filters Toolbar */}
            <div className="flex flex-col gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 py-0.5 max-w-full">
                  {(
                    [
                      { id: 'All', label: 'All notifications', count: totalCount },
                      { id: 'sent', label: 'Delivered', count: statusCounts.sent },
                      { id: 'scheduled', label: 'Scheduled', count: statusCounts.scheduled },
                      { id: 'sending', label: 'In Queue', count: statusCounts.sending },
                      { id: 'draft', label: 'Drafts', count: statusCounts.draft },
                      { id: 'failed', label: 'Failed', count: statusCounts.failed },
                      { id: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
                    ] as const
                  ).map((item) => {
                    const isActive = statusFilter === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStatusFilter(item.id as NotificationStatus | 'All')}
                        className={cn(
                          'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] leading-[20px] font-medium transition-colors cursor-pointer ant-wave-btn whitespace-nowrap shrink-0',
                          isActive
                            ? item.id === 'sent'
                              ? 'bg-[#17b26a] text-white shadow-2xs font-semibold'
                              : item.id === 'scheduled' || item.id === 'sending' || item.id === 'draft'
                              ? 'bg-[#f79009] text-white shadow-2xs font-semibold'
                              : item.id === 'failed' || item.id === 'cancelled'
                              ? 'bg-[#d92d20] text-white shadow-2xs font-semibold'
                              : 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                            : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                        )}
                      >
                        <span className="whitespace-nowrap">{item.label}</span>
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.2 text-[12px] leading-[16px] font-semibold',
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.id === 'failed' || item.id === 'cancelled'
                              ? 'bg-[#fef3f2] text-[#d92d20]'
                              : item.id === 'scheduled' || item.id === 'sending' || item.id === 'draft'
                              ? 'bg-[#fff5e5] text-[#f79009]'
                              : item.id === 'sent'
                              ? 'bg-[#edfcf2] text-[#17b26a]'
                              : 'bg-[#eff1f3] text-[#1f2327]'
                          )}
                        >
                          {item.count}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="size-4 text-[#6f777f]" />
                    <span>Export</span>
                  </button>

                  {/* Create Notification */}
                  <button
                    type="button"
                    onClick={() => {
                      setCreateInitialTemplate(null)
                      setIsCreateModalOpen(true)
                    }}
                    className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[14px] font-bold text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn whitespace-nowrap"
                  >
                    <Plus className="size-4" />
                    <span>New Campaign</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Filters Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications, templates, campaigns, IDs..."
                    className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-8 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 transition-all"
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

                {/* Channel Filter */}
                <Dropdown
                  align="start"
                  value={channelFilter}
                  onSelect={setChannelFilter}
                  ariaLabel="Filter by Channel"
                  options={[
                    { label: 'All Channels', value: 'All Channels' },
                    { label: 'Push', value: 'push' },
                    { label: 'In-App', value: 'in-app' },
                    { label: 'Email', value: 'email' },
                  ]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Smartphone className="size-4 text-[#6f777f]" />
                      <span>{channelFilter === 'All Channels' ? 'All Channels' : channelFilter.toUpperCase()}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Audience Filter */}
                <Dropdown
                  align="start"
                  value={audienceFilter}
                  onSelect={setAudienceFilter}
                  ariaLabel="Filter by Audience"
                  options={audienceOptions}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Users className="size-4 text-[#6f777f]" />
                      <span>{audienceOptions.find((a) => a.value === audienceFilter)?.label || audienceFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Category Filter */}
                <Dropdown
                  align="start"
                  value={categoryFilter}
                  onSelect={setCategoryFilter}
                  ariaLabel="Filter by Category"
                  options={[{ label: 'All Categories', value: 'All' }, ...NOTIFICATION_CATEGORIES.map((c) => ({ label: c, value: c }))]}
                  trigger={
                    <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer transition-colors shadow-2xs">
                      <Tag className="size-4 text-[#6f777f]" />
                      <span>{categoryFilter === 'All' ? 'All Categories' : categoryFilter}</span>
                      <ChevronDown className="size-3.5 text-[#9da4ae]" />
                    </span>
                  }
                />

                {/* Date Range Picker */}
                <DateRangePicker value={dateRange} onChange={setDateRange} />

                {/* Reset Filters Link */}
                {(searchQuery ||
                  statusFilter !== 'All' ||
                  channelFilter !== 'All Channels' ||
                  audienceFilter !== 'All Audiences' ||
                  categoryFilter !== 'All' ||
                  dateRange !== 'All Time') && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Actions Bar if items selected */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-6 py-2.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-semibold text-[14px] text-[#1f2327]">
                  <span>{selectedIds.length} notifications selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = notifications.filter((n) => !selectedIds.includes(n.id))
                      updateNotifications(next)
                      setSelectedIds([])
                      notify('Batch Deleted', `Deleted ${selectedIds.length} notification records.`, 'info')
                    }}
                    className="flex h-[32px] items-center gap-1.5 rounded-[8px] bg-[#d92d20] px-3.5 text-[13px] font-semibold text-white hover:bg-[#b42318] transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5 text-white" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="text-[13px] text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            )}

            {/* Main Data Table */}
            <div className="overflow-x-auto table-scrollbar flex-1">
              <table className="w-full min-w-[1300px] text-left text-[14px] border-collapse font-sans">
                <thead className="bg-[#fcfcfc] border-b border-[#d3d5d7]">
                  <tr className="h-12 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap">
                    <th className="w-12 px-4 text-center">
                      <TableCheckbox
                        checked={filteredNotifications.length > 0 && selectedIds.length === filteredNotifications.length}
                        onChange={() => handleSelectAll(selectedIds.length !== filteredNotifications.length)}
                        ariaLabel="Select all notifications"
                      />
                    </th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Notification</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Notification ID</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Channel</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Audience</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Template</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Status</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Scheduled / Sent</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Delivery</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Open Rate</th>
                    <th className="whitespace-nowrap px-4 text-[14px] font-semibold text-[#1f2327]">Created By</th>
                    <th className="whitespace-nowrap px-4 text-right text-[14px] font-semibold text-[#1f2327]">Actions</th>
                  </tr>
                </thead>

                      <tbody className="divide-y divide-[#d3d5d7]">
                        {paginatedNotifications.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="py-12 text-center text-[#6f777f]">
                              <EmptyState
                                title="No notifications match your filters"
                                description="Try adjusting your search query, status filters, or clear all applied filters."
                                actionLabel="Clear all filters"
                                onAction={resetAllFilters}
                              />
                            </td>
                          </tr>
                        ) : (
                          paginatedNotifications.map((item) => {
                            const isSelected = selectedIds.includes(item.id)
                            const previewText = item.pushSettings?.body || item.inAppSettings?.message || item.emailSettings?.previewText || 'No preview text'

                            // Delivery percentage
                            const delPercent = item.metrics && item.metrics.sentCount > 0
                              ? ((item.metrics.deliveredCount / item.metrics.sentCount) * 100).toFixed(1)
                              : null

                            // Open Rate percentage
                            const openPercent = item.metrics && item.metrics.deliveredCount > 0
                              ? ((item.metrics.openedCount / item.metrics.deliveredCount) * 100).toFixed(1)
                              : null

                            return (
                              <tr
                                key={item.id}
                                className={cn(
                                  'h-[64px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap',
                                  isSelected && 'bg-[#e5f6f7]/40'
                                )}
                              >
                                {/* Checkbox */}
                                <td className="w-12 px-4 text-center whitespace-nowrap">
                                  <TableCheckbox
                                    checked={isSelected}
                                    onChange={() => handleSelectRow(item.id, !isSelected)}
                                    ariaLabel={`Select notification ${item.id}`}
                                  />
                                </td>

                                {/* 1. Notification (Title + Preview) */}
                                <td className="px-4 whitespace-nowrap">
                                  <div className="min-w-0 max-w-[320px]">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedNotification(item)}
                                      className="font-semibold text-[#1f2327] text-[14px] hover:text-[#00c2cb] hover:underline transition-colors block truncate text-left cursor-pointer"
                                    >
                                      {item.name}
                                    </button>
                                    <span className="text-[12px] text-[#6f777f] block truncate">
                                      {previewText}
                                    </span>
                                  </div>
                                </td>

                                {/* 2. Notification ID */}
                                <td className="px-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedNotification(item)}
                                      className="font-mono text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
                                    >
                                      {item.id}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyId(item.id, e)}
                                      className="text-[#9da4ae] hover:text-[#1f2327] p-1 rounded cursor-pointer transition-colors"
                                      title="Copy ID"
                                    >
                                      {copiedId === item.id ? <Check className="size-3 text-[#17b26a]" /> : <Copy className="size-3" />}
                                    </button>
                                  </div>
                                </td>

                                {/* 3. Channels */}
                                <td className="px-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1">
                                    {item.channels.map((ch) => (
                                      <span
                                        key={ch}
                                        className={cn(
                                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-wider',
                                          ch === 'push' && 'bg-[#e0f2fe] text-[#0369a1]',
                                          ch === 'in-app' && 'bg-[#e5f6f7] text-[#00848b]',
                                          ch === 'email' && 'bg-[#fef3c7] text-[#b45309]'
                                        )}
                                      >
                                        {ch === 'push' && <Smartphone className="size-3" />}
                                        {ch === 'in-app' && <Bell className="size-3" />}
                                        {ch === 'email' && <Mail className="size-3" />}
                                        <span>{ch}</span>
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                {/* 4. Audience */}
                                <td className="px-4 whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#d3d5d7] bg-[#fcfcfc] px-2.5 py-1 text-[12px] font-medium text-[#1f2327]">
                                    <Users className="size-3.5 text-[#6f777f]" />
                                    <span>{item.audience.type}</span>
                                  </span>
                                </td>

                                {/* 5. Template */}
                                <td className="px-4 whitespace-nowrap">
                                  {item.templateName ? (
                                    <span className="text-[13px] text-[#1f2327] font-semibold">
                                      {item.templateName}
                                    </span>
                                  ) : (
                                    <span className="text-[12px] text-[#6f777f] italic">Custom / Scratch</span>
                                  )}
                                </td>

                                {/* 6. Status */}
                                <td className="px-4 whitespace-nowrap">
                                  <FigmaStatusBadge
                                    status={
                                      item.status === 'sent'
                                        ? 'Verified'
                                        : item.status === 'scheduled'
                                        ? 'Active'
                                        : item.status === 'sending'
                                        ? 'Pending'
                                        : item.status === 'draft'
                                        ? 'Pending'
                                        : item.status === 'failed'
                                        ? 'Rejected'
                                        : 'Suspended'
                                    }
                                  />
                                </td>

                                {/* 7. Scheduled / Sent Date */}
                                <td className="px-4 whitespace-nowrap">
                                  <div className="text-[13px] font-medium text-[#1f2327]">
                                    {item.sentAt || item.scheduledAt || item.createdAt}
                                  </div>
                                  <span className="text-[11px] text-[#6f777f] block">
                                    {item.status === 'sent' ? 'Delivered' : item.status === 'scheduled' ? 'Scheduled' : 'Created'}
                                  </span>
                                </td>

                                {/* 8. Delivery Metric */}
                                <td className="px-4 whitespace-nowrap">
                                  {delPercent ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-[12px]">
                                        <span className="font-semibold text-[#1f2327]">{delPercent}%</span>
                                        <span className="text-[11px] text-[#6f777f]">delivered</span>
                                      </div>
                                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#eff1f3]">
                                        <div
                                          className="h-full rounded-full bg-[#17b26a]"
                                          style={{ width: `${delPercent}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-[13px] text-[#9da4ae]">—</span>
                                  )}
                                </td>

                                {/* 9. Open Rate */}
                                <td className="px-4 whitespace-nowrap">
                                  {openPercent ? (
                                    <span className="text-[13px] font-semibold text-[#1f2327]">
                                      {openPercent}%
                                    </span>
                                  ) : (
                                    <span className="text-[13px] text-[#9da4ae]">—</span>
                                  )}
                                </td>

                                {/* 10. Created By */}
                                <td className="px-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2.5">
                                    <TableAvatar
                                      name={item.createdBy.name}
                                      size="md"
                                      variant="subtle"
                                    />
                                    <div className="min-w-0">
                                      <span className="font-semibold text-[#1f2327] text-[14px] block">
                                        {item.createdBy.name}
                                      </span>
                                      <span className="text-[12px] text-[#6f777f] block">
                                        {item.createdBy.role}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* 11. Actions */}
                                <td className="px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedNotification(item)}
                                      className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                                      title="View details"
                                    >
                                      <Eye className="size-4" />
                                    </button>

                                    <Dropdown
                                      align="end"
                                      floating
                                      ariaLabel={`Actions for notification ${item.id}`}
                                      options={[
                                        { label: 'View Details', value: 'view', icon: <Eye className="size-4 text-[#00c2cb]" /> },
                                        ...(item.status === 'draft' ? [{ label: 'Edit Draft', value: 'edit', icon: <Edit className="size-4 text-[#1f2327]" /> }] : []),
                                        ...(item.status === 'scheduled' ? [{ label: 'Cancel Schedule', value: 'cancel', icon: <Clock className="size-4 text-amber-600" /> }] : []),
                                        ...(item.status === 'failed' ? [{ label: 'Retry Sending', value: 'retry', icon: <RefreshCw className="size-4 text-[#17b26a]" /> }] : []),
                                        { label: 'Duplicate Campaign', value: 'duplicate', icon: <Copy className="size-4 text-[#6f777f]" /> },
                                        ...(item.status === 'sent' ? [{ label: 'Export Telemetry', value: 'export', icon: <Download className="size-4 text-[#6f777f]" /> }] : []),
                                        { label: 'Delete', value: 'delete', destructive: true, icon: <Trash2 className="size-4 text-rose-600" /> },
                                      ]}
                                      onSelect={(val) => {
                                        if (val === 'view') setSelectedNotification(item)
                                        else if (val === 'edit') {
                                          setCreateInitialTemplate(null)
                                          setIsCreateModalOpen(true)
                                        }
                                        else if (val === 'cancel') handleCancelSchedule(item)
                                        else if (val === 'retry') handleRetrySending(item)
                                        else if (val === 'duplicate') handleDuplicate(item)
                                        else if (val === 'export') handleExportCsv()
                                        else if (val === 'delete') handleDeleteNotification(item)
                                      }}
                                      trigger={
                                        <button
                                          type="button"
                                          className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                                          title="More actions"
                                        >
                                          <MoreHorizontal className="size-4" />
                                        </button>
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  <div className="mt-auto p-3 border-t border-[#d3d5d7] bg-[#fcfcfc]">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredNotifications.length}
                      rowsPerPage={rowsPerPage}
                      rowsOptions={[10, 20, 30]}
                      onPageChange={setCurrentPage}
                      onRowsPerPageChange={(val) => {
                        setRowsPerPage(val)
                        setCurrentPage(1)
                      }}
                    />
                  </div>
              </section>
            )}

        {/* =========================================================================
            VIEW 2: TEMPLATES LIBRARY
           ========================================================================= */}
        {viewMode === 'templates' && (
          <section className="rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] p-5 space-y-5">
            <TemplatesLibraryView
              templates={templates}
              onUseTemplate={(tpl) => {
                setCreateInitialTemplate(tpl)
                setIsCreateModalOpen(true)
              }}
              onCreateTemplate={() => {
                setEditingTemplate(null)
                setIsCreateTemplateModalOpen(true)
              }}
              onEditTemplate={(tpl) => {
                setEditingTemplate(tpl)
                setIsCreateTemplateModalOpen(true)
              }}
              onDeleteTemplate={(tpl) => {
                setConfirmDialog({
                  title: 'Delete Notification Template?',
                  description: `Are you sure you want to delete template "${tpl.name}"?`,
                  confirmLabel: 'Delete Template',
                  tone: 'danger',
                  onConfirm: () => {
                    const next = templates.filter((t) => t.id !== tpl.id)
                    updateTemplates(next)
                    notify('Template Deleted', `Template ${tpl.name} removed.`, 'info')
                  },
                })
              }}
            />
          </section>
        )}

        {/* =========================================================================
            VIEW 3: ANALYTICS & DEVICES
           ========================================================================= */}
        {viewMode === 'analytics' && (
          <section className="rounded-[12px] border border-[#d3d5d7] bg-white drop-shadow-[0px_1px_1.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)] p-5 space-y-5">
            <NotificationAnalyticsView notifications={notifications} />
          </section>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: 5-STEP CREATE NOTIFICATION WORKSPACE (WITH SIDE-BY-SIDE LIVE PREVIEW)
         ========================================================================= */}
      {isCreateModalOpen && (
        <CreateNotificationModal
          isOpen={isCreateModalOpen}
          initialTemplate={createInitialTemplate}
          templates={templates}
          onClose={() => setIsCreateModalOpen(false)}
          onSaveDraft={(item) => {
            const next = [item, ...notifications]
            updateNotifications(next)
            setIsCreateModalOpen(false)
            notify('Draft Saved', `Notification draft ${item.id} saved successfully.`, 'info', 'View Draft', () => setSelectedNotification(item))
          }}
          onScheduleNotification={(item) => {
            const next = [item, ...notifications]
            updateNotifications(next)
            setIsCreateModalOpen(false)
            notify('Notification Scheduled', `Broadcast scheduled for ${item.scheduledAt}.`, 'success', 'View Schedule', () => setSelectedNotification(item))
          }}
          onSendNow={(item) => {
            const next = [item, ...notifications]
            updateNotifications(next)
            setIsCreateModalOpen(false)
            notify('Notification Dispatched', `Broadcast sent to ${item.audience.estimatedReach.toLocaleString()} recipients.`, 'success', 'View Analytics', () => setSelectedNotification(item))
          }}
        />
      )}

      {/* =========================================================================
          DRAWER: NOTIFICATION DETAILS & TELEMETRY
         ========================================================================= */}
      {selectedNotification && (
        <NotificationDetailDrawer
          item={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onDuplicate={() => {
            handleDuplicate(selectedNotification)
            setSelectedNotification(null)
          }}
          onDelete={() => {
            handleDeleteNotification(selectedNotification)
          }}
          onCancelSchedule={() => {
            handleCancelSchedule(selectedNotification)
            setSelectedNotification(null)
          }}
        />
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT TEMPLATE MODAL
         ========================================================================= */}
      {isCreateTemplateModalOpen && (
        <CreateTemplateModal
          isOpen={isCreateTemplateModalOpen}
          template={editingTemplate}
          onClose={() => setIsCreateTemplateModalOpen(false)}
          onSave={(savedTemplate) => {
            if (editingTemplate) {
              const next = templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
              updateTemplates(next)
              notify('Template Updated', `Template ${savedTemplate.name} updated.`)
            } else {
              const next = [savedTemplate, ...templates]
              updateTemplates(next)
              notify('Template Created', `New template ${savedTemplate.name} ready for use.`)
            }
            setIsCreateTemplateModalOpen(false)
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog request={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </PlatformShell>
  )
}

// =========================================================================
// SUB-COMPONENT: TEMPLATES LIBRARY VIEW
// =========================================================================
function TemplatesLibraryView({
  templates,
  onUseTemplate,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
}: {
  templates: NotificationTemplate[]
  onUseTemplate: (tpl: NotificationTemplate) => void
  onCreateTemplate: () => void
  onEditTemplate: (tpl: NotificationTemplate) => void
  onDeleteTemplate: (tpl: NotificationTemplate) => void
}) {
  const [selectedCat, setSelectedCat] = React.useState<string>('All')
  const [query, setQuery] = React.useState<string>('')

  const filtered = templates.filter((t) => {
    const matchCat = selectedCat === 'All' || t.category === selectedCat
    const matchQ =
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.body.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d3d5d7] pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1f2327]">Standard Notification Templates</h2>
          <p className="mt-0.5 text-[13px] text-[#6f777f]">
            Pre-configured notification blueprints with dynamic token injection for instant campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCreateTemplate}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[13px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...NOTIFICATION_CATEGORIES].map((cat) => {
          const count = cat === 'All' ? templates.length : templates.filter((t) => t.category === cat).length
          const isSelected = selectedCat === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={cn(
                'flex h-[34px] items-center gap-2 rounded-[8px] px-3 text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0',
                isSelected
                  ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                  : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[11px] font-bold',
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#6f777f]'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs hover:border-[#00c2cb] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex rounded-[4px] bg-[#e5f6f7] px-2 py-0.5 text-[11px] font-bold text-[#00848b]">
                  {tpl.category}
                </span>
                <span className="font-mono text-[11px] text-[#6f777f]">{tpl.usageCount} uses</span>
              </div>

              <div>
                <h3 className="font-bold text-[15px] text-[#1f2327] leading-snug">{tpl.name}</h3>
                <p className="text-[13px] text-[#6f777f] line-clamp-2 mt-1">{tpl.body}</p>
              </div>

              {/* Supported Channels */}
              <div className="flex items-center gap-1.5 pt-1">
                {tpl.channels.map((ch) => (
                  <span
                    key={ch}
                    className="inline-flex items-center gap-1 rounded bg-[#eff1f3] px-2 py-0.5 text-[11px] font-bold text-[#1f2327] uppercase"
                  >
                    {ch === 'push' && <Smartphone className="size-3 text-[#3366ff]" />}
                    {ch === 'in-app' && <Bell className="size-3 text-[#00848b]" />}
                    {ch === 'email' && <Mail className="size-3 text-[#d97706]" />}
                    <span>{ch}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#d3d5d7] pt-3">
              <span className="text-[11px] text-[#6f777f]">Updated: {tpl.lastUpdated}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEditTemplate(tpl)}
                  className="rounded p-1.5 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                  title="Edit Template"
                >
                  <Edit className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTemplate(tpl)}
                  className="rounded p-1.5 text-[#6f777f] hover:bg-[#fee4e2] hover:text-[#d92d20] transition-colors cursor-pointer"
                  title="Delete Template"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onUseTemplate(tpl)}
                  className="rounded-[6px] bg-[#1f2327] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#2e3338] transition-colors cursor-pointer shadow-2xs"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =========================================================================
// SUB-COMPONENT: ANALYTICS & DEVICES VIEW
// =========================================================================
function NotificationAnalyticsView({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#d3d5d7] pb-4">
        <h2 className="text-[18px] font-bold text-[#1f2327]">Multi-Channel Delivery Analytics</h2>
        <p className="mt-0.5 text-[13px] text-[#6f777f]">
          Cross-platform delivery performance, OS breakdowns, and geographical reach statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Device Breakdown Card */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="size-5 text-[#00c2cb]" />
              <h3 className="font-bold text-[15px] text-[#1f2327]">Operating System & Gateway Breakdown</h3>
            </div>
            <span className="text-[12px] text-[#6f777f]">Past 30 Days</span>
          </div>

          <div className="space-y-4 pt-1">
            {[
              { device: 'iOS (Apple Push Notification Service)', share: '62.4%', delivered: '14,210', openRate: '72.1%', barColor: 'bg-[#00c2cb]' },
              { device: 'Android (Firebase Cloud Messaging)', share: '31.2%', delivered: '7,120', openRate: '58.4%', barColor: 'bg-[#3366ff]' },
              { device: 'Web Push & Desktop In-App', share: '6.4%', delivered: '1,490', openRate: '42.0%', barColor: 'bg-[#7f56d9]' },
            ].map((d) => (
              <div key={d.device} className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[#1f2327]">{d.device}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#6f777f] font-mono">{d.delivered} msgs</span>
                    <span className="font-bold text-[#1f2327]">{d.share}</span>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eff1f3]">
                  <div className={cn('h-full rounded-full', d.barColor)} style={{ width: d.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country Statistics Card */}
        <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-[#00c2cb]" />
              <h3 className="font-bold text-[15px] text-[#1f2327]">Top Country Geographies</h3>
            </div>
            <span className="text-[12px] text-[#6f777f]">Audience Reach</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { country: 'United Arab Emirates', code: 'AE', reach: '16,420', openRate: '74.2%', clickRate: '24.1%' },
              { country: 'Saudi Arabia', code: 'SA', reach: '4,890', openRate: '63.0%', clickRate: '18.5%' },
              { country: 'Egypt', code: 'EG', reach: '1,980', openRate: '56.4%', clickRate: '14.0%' },
              { country: 'United Kingdom', code: 'GB', reach: '1,530', openRate: '70.8%', clickRate: '21.3%' },
            ].map((c) => (
              <div key={c.country} className="flex items-center justify-between rounded-[8px] border border-[#d3d5d7] p-3 text-[13px]">
                <div className="flex items-center gap-2.5">
                  <Flag code={c.code} size="s" />
                  <span className="font-semibold text-[#1f2327]">{c.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#6f777f] font-mono">{c.reach} reach</span>
                  <span className="font-bold text-[#00c2cb]">{c.openRate} open</span>
                  <span className="font-bold text-[#17b26a]">{c.clickRate} click</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// DETAILS DRAWER (SLIDE-OVER INSPECTOR)
// =========================================================================
function NotificationDetailDrawer({
  item,
  onClose,
  onDuplicate,
  onDelete,
  onCancelSchedule,
}: {
  item: NotificationItem
  onClose: () => void
  onDuplicate: () => void
  onDelete: () => void
  onCancelSchedule: () => void
}) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'funnel' | 'devices' | 'timeline'>('overview')

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl border-l border-[#d3d5d7] ant-slide-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] p-4 sm:px-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#00c2cb]">{item.id}</span>
              <FigmaStatusBadge
                status={
                  item.status === 'sent'
                    ? 'Verified'
                    : item.status === 'scheduled'
                    ? 'Active'
                    : item.status === 'draft'
                    ? 'Pending'
                    : item.status === 'failed'
                    ? 'Rejected'
                    : 'Suspended'
                }
              />
            </div>
            <h2 className="text-[18px] font-bold text-[#1f2327] leading-snug">{item.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDuplicate}
              className="rounded-[6px] p-2 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
              title="Duplicate Notification"
            >
              <Copy className="size-4" />
            </button>
            {item.status === 'scheduled' && (
              <button
                type="button"
                onClick={onCancelSchedule}
                className="rounded-[6px] p-2 text-[#b54708] hover:bg-[#fffaf0] transition-colors cursor-pointer"
                title="Cancel Schedule"
              >
                <X className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onDelete}
              className="rounded-[6px] p-2 text-[#d92d20] hover:bg-[#fee4e2] transition-colors cursor-pointer"
              title="Delete Notification"
            >
              <Trash2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] p-2 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer ml-1"
              aria-label="Close Drawer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="flex items-center border-b border-[#d3d5d7] px-6">
          {[
            { id: 'overview', label: 'Overview & Content' },
            { id: 'funnel', label: 'Delivery Funnel' },
            { id: 'devices', label: 'Devices & Countries' },
            { id: 'timeline', label: 'Audit Timeline' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'border-b-2 py-3 px-3 text-[13px] font-semibold transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'border-[#00c2cb] text-[#00c2cb]'
                  : 'border-transparent text-[#6f777f] hover:text-[#1f2327]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3.5 rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 text-[13px]">
                <div>
                  <span className="text-[#6f777f] block">Category:</span>
                  <span className="font-semibold text-[#1f2327]">{item.category}</span>
                </div>
                <div>
                  <span className="text-[#6f777f] block">Target Audience:</span>
                  <span className="font-semibold text-[#1f2327]">
                    {item.audience.type} ({item.audience.estimatedReach.toLocaleString()} users)
                  </span>
                </div>
                <div>
                  <span className="text-[#6f777f] block">Channels:</span>
                  <span className="font-semibold text-[#1f2327] uppercase">{item.channels.join(' + ')}</span>
                </div>
                <div>
                  <span className="text-[#6f777f] block">Created By:</span>
                  <span className="font-semibold text-[#1f2327]">{item.createdBy.name} ({item.createdBy.role})</span>
                </div>
              </div>

              {/* Push Preview */}
              {item.pushSettings && (
                <div className="space-y-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#3366ff] flex items-center gap-1.5">
                    <Smartphone className="size-3.5" />
                    <span>Push Notification Content:</span>
                  </span>
                  <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6f777f]">
                      <span className="font-bold text-[#1f2327]">Duseat Marketplace</span>
                      <span>Now</span>
                    </div>
                    <p className="font-bold text-[14px] text-[#1f2327]">{item.pushSettings.title}</p>
                    <p className="text-[13px] text-[#475467]">{item.pushSettings.body}</p>
                    {item.pushSettings.deepLink && (
                      <span className="font-mono text-[11px] text-[#00c2cb] block pt-1">
                        Target URL: {item.pushSettings.deepLink}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* In-App Preview */}
              {item.inAppSettings && (
                <div className="space-y-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#00848b] flex items-center gap-1.5">
                    <Bell className="size-3.5" />
                    <span>In-App Notification Card:</span>
                  </span>
                  <div className="rounded-[10px] border border-[#00c2cb]/40 bg-[#e5f6f7]/30 p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13.5px] text-[#00848b]">{item.inAppSettings.title}</span>
                      <span className="text-[11px] font-semibold text-[#6f777f]">{item.inAppSettings.destination}</span>
                    </div>
                    <p className="text-[13px] text-[#1f2327]">{item.inAppSettings.message}</p>
                    {item.inAppSettings.ctaText && (
                      <button
                        type="button"
                        className="rounded-[6px] bg-[#00c2cb] px-3 py-1 text-[12px] font-bold text-white shadow-2xs"
                      >
                        {item.inAppSettings.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DELIVERY FUNNEL */}
          {activeTab === 'funnel' && (
            <div className="space-y-5">
              <div className="border-b border-[#d3d5d7] pb-2">
                <h3 className="font-bold text-[15px] text-[#1f2327]">Conversion & Engagement Funnel</h3>
                <p className="text-[12px] text-[#6f777f]">Detailed status breakdown from dispatch to user action.</p>
              </div>

              {item.metrics ? (
                <div className="space-y-3.5">
                  {[
                    { label: 'Sent', count: item.metrics.sentCount, percent: '100%', color: 'bg-[#1f2327]' },
                    {
                      label: 'Delivered',
                      count: item.metrics.deliveredCount,
                      percent: `${((item.metrics.deliveredCount / item.metrics.sentCount) * 100).toFixed(1)}%`,
                      color: 'bg-[#17b26a]',
                    },
                    {
                      label: 'Opened',
                      count: item.metrics.openedCount,
                      percent: `${((item.metrics.openedCount / item.metrics.deliveredCount) * 100).toFixed(1)}%`,
                      color: 'bg-[#00c2cb]',
                    },
                    {
                      label: 'Clicked / CTA',
                      count: item.metrics.clickedCount,
                      percent: `${((item.metrics.clickedCount / item.metrics.deliveredCount) * 100).toFixed(1)}%`,
                      color: 'bg-[#3366ff]',
                    },
                    {
                      label: 'Failed Deliveries',
                      count: item.metrics.failedCount ?? 0,
                      percent: `${(((item.metrics.failedCount ?? 0) / item.metrics.sentCount) * 100).toFixed(1)}%`,
                      color: 'bg-[#d92d20]',
                    },
                  ].map((m) => (
                    <div key={m.label} className="rounded-[8px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-semibold text-[#1f2327]">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#6f777f]">{(m.count ?? 0).toLocaleString()}</span>
                          <span className="font-bold text-[#1f2327]">({m.percent})</span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#eff1f3]">
                        <div className={cn('h-full rounded-full', m.color)} style={{ width: m.percent }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[#6f777f]">
                  <Clock className="size-8 mx-auto text-[#9da4ae] mb-2" />
                  <p className="font-semibold text-[14px] text-[#1f2327]">No delivery metrics yet</p>
                  <p className="text-[12px]">Telemetry will be recorded as soon as the notification is dispatched.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEVICES & GEOGRAPHY */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <h3 className="font-bold text-[15px] text-[#1f2327]">Device & Geographic Distribution</h3>
              <div className="space-y-3">
                {[
                  { device: 'iOS Apple Push', percent: '64.2%', count: '2,748' },
                  { device: 'Android Firebase', percent: '29.8%', count: '1,275' },
                  { device: 'Web Push', percent: '6.0%', count: '257' },
                ].map((d) => (
                  <div key={d.device} className="rounded-[8px] border border-[#d3d5d7] p-3 text-[13px] flex items-center justify-between">
                    <span className="font-semibold text-[#1f2327]">{d.device}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#6f777f] font-mono">{d.count}</span>
                      <span className="font-bold text-[#00c2cb]">{d.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="font-bold text-[15px] text-[#1f2327]">Lifecycle Audit Trail</h3>
              <div className="space-y-3 border-l-2 border-[#d3d5d7] pl-4 ml-2">
                {item.timeline.map((evt) => (
                  <div key={evt.id} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-[#00c2cb]" />
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-bold text-[#1f2327]">{evt.event}</span>
                      <span className="text-[#6f777f]">{evt.timestamp}</span>
                    </div>
                    <p className="text-[12px] text-[#6f777f]">
                      By {evt.actor} ({evt.actorRole})
                    </p>
                    {evt.note && (
                      <p className="text-[12px] font-mono text-[#d92d20] bg-[#fef3f2] p-2 rounded mt-1">
                        {evt.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// 5-STEP CREATE NOTIFICATION WORKSPACE MODAL
// =========================================================================
function CreateNotificationModal({
  isOpen,
  initialTemplate,
  templates,
  onClose,
  onSaveDraft,
  onScheduleNotification,
  onSendNow,
}: {
  isOpen: boolean
  initialTemplate: NotificationTemplate | null
  templates: NotificationTemplate[]
  onClose: () => void
  onSaveDraft: (item: NotificationItem) => void
  onScheduleNotification: (item: NotificationItem) => void
  onSendNow: (item: NotificationItem) => void
}) {
  const [step, setStep] = React.useState<number>(1)

  // Step 1: Content
  const [name, setName] = React.useState<string>(initialTemplate?.name || 'New Notification Campaign')
  const [category, setCategory] = React.useState<NotificationCategory>(initialTemplate?.category || 'General')
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>(initialTemplate?.id || 'custom')
  const [title, setTitle] = React.useState<string>(initialTemplate?.title || 'Your offer was updated')
  const [body, setBody] = React.useState<string>(
    initialTemplate?.body || 'Ahmed, your offer for Downtown Dubai has been updated with new broker pricing.'
  )

  // Step 2: Audience
  const [audienceType, setAudienceType] = React.useState<AudienceType>('Investors')
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(['United Arab Emirates'])
  const [customRules, setCustomRules] = React.useState<CustomAudienceRule[]>([
    { id: 'r1', field: 'verification', operator: 'equals', value: 'Verified' },
  ])
  const [customLogic, setCustomLogic] = React.useState<'AND' | 'OR'>('AND')
  const [individualUserId, setIndividualUserId] = React.useState<string>('IN-2048')

  // Step 3: Channels
  const [enablePush, setEnablePush] = React.useState<boolean>(true)
  const [enableInApp, setEnableInApp] = React.useState<boolean>(true)
  const [enableEmail, setEnableEmail] = React.useState<boolean>(false)
  const [pushDeepLink, setPushDeepLink] = React.useState<string>('duseat://requests')
  const [pushSound, setPushSound] = React.useState<string>('default.mp3')
  const [inAppCta, setInAppCta] = React.useState<string>('View Request')
  const [inAppDestination, setInAppDestination] = React.useState<'Request' | 'Offer' | 'Deal' | 'Profile' | 'Marketplace' | 'Custom URL'>('Request')
  const [emailSubject, setEmailSubject] = React.useState<string>('Important Update on your Duseat Request')

  // Step 4: Schedule
  const [scheduleMode, setScheduleMode] = React.useState<'now' | 'scheduled' | 'recurring'>('now')
  const [scheduledDate, setScheduledDate] = React.useState<string>('2026-09-08')
  const [scheduledTime, setScheduledTime] = React.useState<string>('10:30')
  const [timezone, setTimezone] = React.useState<string>('Dubai (GMT+4)')
  const [recurringFreq, setRecurringFreq] = React.useState<'daily' | 'weekly' | 'monthly'>('weekly')

  // Preview Mode
  const [previewChannel, setPreviewChannel] = React.useState<'push' | 'in-app' | 'email'>('push')
  const [showConfirmSend, setShowConfirmSend] = React.useState<boolean>(false)

  // Calculated Reach
  const estimatedReach = React.useMemo(() => {
    if (audienceType === 'All Users') return 24820
    if (audienceType === 'Investors') return 14200
    if (audienceType === 'Agents') return 6450
    if (audienceType === 'Premium Users') return 3120
    if (audienceType === 'Verified Users') return 9840
    if (audienceType === 'Individual User') return 1
    return 4280
  }, [audienceType])

  // Template switch handler
  const handleSelectTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId)
    if (tmplId === 'custom') return
    const found = templates.find((t) => t.id === tmplId)
    if (found) {
      setName(found.name)
      setCategory(found.category)
      setTitle(found.title)
      setBody(found.body)
      setEnablePush(found.channels.includes('push'))
      setEnableInApp(found.channels.includes('in-app'))
      setEnableEmail(found.channels.includes('email'))
    }
  }

  // Insert variable into active editor
  const handleInsertVariable = (varKey: string) => {
    setBody((prev) => `${prev} ${varKey}`)
  }

  // Build Payload
  const buildNotificationItem = (status: NotificationStatus): NotificationItem => {
    const channels: NotificationChannel[] = []
    if (enablePush) channels.push('push')
    if (enableInApp) channels.push('in-app')
    if (enableEmail) channels.push('email')

    return {
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      category,
      templateId: selectedTemplateId !== 'custom' ? selectedTemplateId : undefined,
      templateName: selectedTemplateId !== 'custom' ? templates.find((t) => t.id === selectedTemplateId)?.name : undefined,
      channels: channels.length ? channels : ['push'],
      status,
      audience: {
        type: audienceType,
        estimatedReach,
        countries: selectedCountries,
        customRules: audienceType === 'Custom Audience' ? customRules : undefined,
        customRuleLogic: customLogic,
      },
      createdAt: 'Just now',
      scheduledAt: status === 'scheduled' ? `${scheduledDate} · ${scheduledTime} ${timezone}` : undefined,
      sentAt: status === 'sent' ? 'Just now' : undefined,
      createdBy: {
        name: 'Admin Operator',
        role: 'Campaign Officer',
      },
      pushSettings: {
        title,
        body,
        deepLink: pushDeepLink,
        sound: pushSound,
        priority: 'high',
      },
      inAppSettings: {
        title,
        message: body,
        ctaText: inAppCta,
        destination: inAppDestination,
      },
      emailSettings: {
        subject: emailSubject || title,
        previewText: body.slice(0, 80),
        sender: 'Duseat Marketplace <notifications@duseat.com>',
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          event: status === 'sent' ? 'Notification Dispatched Immediately' : status === 'scheduled' ? `Scheduled for ${scheduledDate} · ${scheduledTime}` : 'Draft Saved',
          actor: 'Admin Operator',
          actorRole: 'Campaign Officer',
          timestamp: 'Just now',
          type: status === 'sent' ? 'completed' : status === 'scheduled' ? 'scheduled' : 'created',
        },
      ],
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[14px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Workspace Stepper Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d3d5d7] px-6 py-4 bg-[#fcfcfc] gap-3">
          <div className="space-y-0.5">
            <h2 className="text-[18px] font-bold text-[#1f2327]">Create Notification Campaign</h2>
            <p className="text-[13px] text-[#6f777f]">Target, customize, preview and dispatch multi-channel notifications.</p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { num: 1, label: 'Content' },
              { num: 2, label: 'Audience' },
              { num: 3, label: 'Channels' },
              { num: 4, label: 'Schedule' },
              { num: 5, label: 'Review' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer',
                    step === s.num
                      ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                      : step > s.num
                      ? 'bg-[#e5f6f7] text-[#00848b] font-semibold'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  <span className="size-4 rounded-full flex items-center justify-center text-[11px] font-bold bg-black/10">
                    {step > s.num ? <Check className="size-2.5 text-current" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {s.num < 5 && <ChevronRight className="size-3.5 text-[#9da4ae]" />}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] p-2 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Workspace Body: 2 Columns (Form Configuration vs Live Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Form Configuration (7 Cols) */}
          <div className="lg:col-span-7 overflow-y-auto p-6 border-b lg:border-b-0 lg:border-r border-[#d3d5d7] space-y-5">
            {/* STEP 1: CONTENT */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="border-b border-[#d3d5d7] pb-3">
                  <h3 className="font-bold text-[16px] text-[#1f2327]">Step 1: Message Content & Variables</h3>
                  <p className="mt-0.5 text-[13px] text-[#6f777f]">Compose message titles and dynamically personalized content.</p>
                </div>

                {/* Campaign Name */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#1f2327]">Internal Campaign Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q3 Investor Prime Offer Alert"
                    className="h-[40px] w-full rounded-[8px] border border-[#d3d5d7] px-3.5 text-[14px] outline-none focus:border-[#00c2cb]"
                  />
                </div>

                {/* Template Selection */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[#1f2327]">Base Template</label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => handleSelectTemplate(e.target.value)}
                      className="h-[40px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] outline-none focus:border-[#00c2cb]"
                    >
                      <option value="custom">Start From Scratch</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[#1f2327]">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                      className="h-[40px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] outline-none focus:border-[#00c2cb]"
                    >
                      {NOTIFICATION_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message Title */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#1f2327]">Notification Title / Header</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Your offer was updated"
                    className="h-[40px] w-full rounded-[8px] border border-[#d3d5d7] px-3.5 text-[14px] outline-none focus:border-[#00c2cb]"
                  />
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#1f2327]">Message Body / Content</label>
                  <textarea
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write notification text..."
                    className="w-full rounded-[8px] border border-[#d3d5d7] p-3 text-[14px] outline-none focus:border-[#00c2cb]"
                  />
                </div>

                {/* Dynamic Variables Chips */}
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">
                    Available Dynamic Variables (Click to Insert)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {NOTIFICATION_VARIABLES.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => handleInsertVariable(v.key)}
                        className="rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] px-2.5 py-1 text-[12px] font-mono font-medium text-[#1f2327] hover:border-[#00c2cb] hover:bg-[#e5f6f7] transition-colors cursor-pointer"
                        title={v.desc}
                      >
                        {v.key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: AUDIENCE */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="border-b border-[#d3d5d7] pb-3">
                  <h3 className="font-bold text-[16px] text-[#1f2327]">Step 2: Audience Targeting & Segmentation</h3>
                  <p className="mt-0.5 text-[13px] text-[#6f777f]">Select who will receive this campaign or build custom logic.</p>
                </div>

                <div className="rounded-[10px] border border-[#00c2cb]/40 bg-[#e5f6f7]/20 p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[12px] font-bold text-[#00848b] uppercase tracking-wider">Estimated Audience Reach</span>
                    <p className="text-[24px] font-bold text-[#1f2327] mt-0.5">{estimatedReach.toLocaleString()} users</p>
                  </div>
                  <span className="rounded-full bg-[#00c2cb] px-3 py-1 text-[12px] font-bold text-white shadow-2xs">
                    Target Verified
                  </span>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[13px] font-semibold text-[#1f2327]">Audience Segment</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { type: 'All Users', desc: 'Broadcast to entire user base' },
                      { type: 'Investors', desc: 'Registered property buyers' },
                      { type: 'Agents', desc: 'Licensed real estate brokers' },
                      { type: 'Premium Users', desc: 'Subscribed VIP members' },
                      { type: 'Verified Users', desc: 'KYC & ID verified users' },
                      { type: 'Custom Audience', desc: 'Advanced AND/OR rule builder' },
                      { type: 'Individual User', desc: 'Direct direct dispatch to one user' },
                    ].map((opt) => (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setAudienceType(opt.type as AudienceType)}
                        className={cn(
                          'rounded-[8px] border p-3 text-left transition-all cursor-pointer',
                          audienceType === opt.type
                            ? 'border-[#00c2cb] bg-[#e5f6f7]/30 ring-1 ring-[#00c2cb]'
                            : 'border-[#d3d5d7] bg-white hover:bg-[#eff1f3]'
                        )}
                      >
                        <span className="text-[13.5px] font-bold text-[#1f2327] block">{opt.type}</span>
                        <span className="text-[12px] text-[#6f777f] block mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* If Individual User */}
                {audienceType === 'Individual User' && (
                  <div className="space-y-3 rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4">
                    <label className="text-[13px] font-semibold text-[#1f2327]">Search Target User</label>
                    <input
                      type="text"
                      value={individualUserId}
                      onChange={(e) => setIndividualUserId(e.target.value)}
                      placeholder="Search by Name, Email or User ID (e.g. IN-2048)..."
                      className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] outline-none focus:border-[#00c2cb]"
                    />
                    <div className="flex items-center justify-between rounded-[8px] border border-[#d3d5d7] bg-white p-3">
                      <div className="flex items-center gap-3">
                        <TableAvatar name="Ahmed Al-Mansoor" countryCode="AE" size="md" variant="brand" />
                        <div>
                          <p className="text-[13.5px] font-bold text-[#1f2327]">Ahmed Al-Mansoor</p>
                          <span className="text-[12px] text-[#6f777f]">ahmed.mansoor@gmail.com · UAE</span>
                        </div>
                      </div>
                      <span className="rounded bg-[#e5f6f7] px-2 py-0.5 text-[11px] font-bold text-[#00848b]">
                        Verified Investor
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: CHANNELS */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="border-b border-[#d3d5d7] pb-3">
                  <h3 className="font-bold text-[16px] text-[#1f2327]">Step 3: Channel Configuration</h3>
                  <p className="mt-0.5 text-[13px] text-[#6f777f]">Enable delivery pathways and configure deep links & CTA buttons.</p>
                </div>

                {/* Channel 1: Mobile Push */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="size-5 text-[#3366ff]" />
                      <div>
                        <h4 className="font-bold text-[14px] text-[#1f2327]">Mobile Push Notification</h4>
                        <p className="text-[12px] text-[#6f777f]">Direct OS notification via APNs & FCM</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enablePush}
                      onChange={(e) => setEnablePush(e.target.checked)}
                      className="size-4 accent-[#00c2cb] cursor-pointer"
                    />
                  </div>

                  {enablePush && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#d3d5d7]/70 text-[13px]">
                      <div>
                        <label className="text-[12px] font-semibold text-[#1f2327]">Deep Link Route</label>
                        <input
                          type="text"
                          value={pushDeepLink}
                          onChange={(e) => setPushDeepLink(e.target.value)}
                          className="h-[36px] w-full rounded-[6px] border border-[#d3d5d7] px-2.5 text-[13px] outline-none mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-[#1f2327]">Alert Sound</label>
                        <select
                          value={pushSound}
                          onChange={(e) => setPushSound(e.target.value)}
                          className="h-[36px] w-full rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] outline-none mt-1"
                        >
                          <option value="default.mp3">Default Chime</option>
                          <option value="bell.mp3">Marketplace Bell</option>
                          <option value="urgent.mp3">Priority Alert</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Channel 2: In-App Card */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Bell className="size-5 text-[#00848b]" />
                      <div>
                        <h4 className="font-bold text-[14px] text-[#1f2327]">In-App Notification Center Card</h4>
                        <p className="text-[12px] text-[#6f777f]">Persistent notification inbox card with action button</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableInApp}
                      onChange={(e) => setEnableInApp(e.target.checked)}
                      className="size-4 accent-[#00c2cb] cursor-pointer"
                    />
                  </div>

                  {enableInApp && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#d3d5d7]/70 text-[13px]">
                      <div>
                        <label className="text-[12px] font-semibold text-[#1f2327]">Action Button CTA Text</label>
                        <input
                          type="text"
                          value={inAppCta}
                          onChange={(e) => setInAppCta(e.target.value)}
                          className="h-[36px] w-full rounded-[6px] border border-[#d3d5d7] px-2.5 text-[13px] outline-none mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-[#1f2327]">Destination</label>
                        <select
                          value={inAppDestination}
                          onChange={(e) => setInAppDestination(e.target.value as any)}
                          className="h-[36px] w-full rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] outline-none mt-1"
                        >
                          <option value="Request">Request Details</option>
                          <option value="Offer">Offer Negotiation</option>
                          <option value="Deal">Deal Conveyance</option>
                          <option value="Profile">User Profile</option>
                          <option value="Marketplace">Marketplace Feed</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Channel 3: Email Notification */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mail className="size-5 text-[#d97706]" />
                      <div>
                        <h4 className="font-bold text-[14px] text-[#1f2327]">Email Broadcast</h4>
                        <p className="text-[12px] text-[#6f777f]">Formatted email delivered via transactional mail server</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableEmail}
                      onChange={(e) => setEnableEmail(e.target.checked)}
                      className="size-4 accent-[#00c2cb] cursor-pointer"
                    />
                  </div>

                  {enableEmail && (
                    <div className="space-y-2 pt-2 border-t border-[#d3d5d7]/70 text-[13px]">
                      <label className="text-[12px] font-semibold text-[#1f2327]">Email Subject Line</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="h-[36px] w-full rounded-[6px] border border-[#d3d5d7] px-2.5 text-[13px] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULING */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="border-b border-[#d3d5d7] pb-3">
                  <h3 className="font-bold text-[16px] text-[#1f2327]">Step 4: Scheduling & Recurrence</h3>
                  <p className="mt-0.5 text-[13px] text-[#6f777f]">Set delivery timing or setup recurring campaign rules.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'now', label: 'Send Immediately', desc: 'Dispatch right after review' },
                    { id: 'scheduled', label: 'Schedule Date & Time', desc: 'Custom future timestamp' },
                    { id: 'recurring', label: 'Recurring Campaign', desc: 'Periodic broadcast' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setScheduleMode(s.id as any)}
                      className={cn(
                        'rounded-[8px] border p-3.5 text-left transition-all cursor-pointer',
                        scheduleMode === s.id
                          ? 'border-[#00c2cb] bg-[#e5f6f7]/30 ring-1 ring-[#00c2cb]'
                          : 'border-[#d3d5d7] bg-white hover:bg-[#eff1f3]'
                      )}
                    >
                      <span className="text-[13.5px] font-bold text-[#1f2327] block">{s.label}</span>
                      <span className="text-[12px] text-[#6f777f] block mt-0.5">{s.desc}</span>
                    </button>
                  ))}
                </div>

                {scheduleMode === 'scheduled' && (
                  <div className="space-y-3.5 rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 text-[13px]">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12.5px] font-semibold text-[#1f2327]">Dispatch Date</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="h-[38px] w-full rounded-[6px] border border-[#d3d5d7] bg-white px-3 mt-1 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[12.5px] font-semibold text-[#1f2327]">Dispatch Time</label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="h-[38px] w-full rounded-[6px] border border-[#d3d5d7] bg-white px-3 mt-1 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[12.5px] font-semibold text-[#1f2327]">Target Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="h-[38px] w-full rounded-[6px] border border-[#d3d5d7] bg-white px-3 mt-1 outline-none"
                      >
                        <option value="Dubai (GMT+4)">Dubai (GST, GMT+4)</option>
                        <option value="Riyadh (GMT+3)">Riyadh (AST, GMT+3)</option>
                        <option value="Cairo (GMT+3)">Cairo (EEST, GMT+3)</option>
                        <option value="London (GMT+1)">London (BST, GMT+1)</option>
                      </select>
                    </div>

                    <div className="rounded-[6px] bg-[#eff1f3] p-3 text-[12.5px] text-[#1f2327] font-medium">
                      Resolved send time: <strong>{scheduledDate} · {scheduledTime} ({timezone})</strong>
                    </div>
                  </div>
                )}

                {scheduleMode === 'recurring' && (
                  <div className="space-y-3 rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 text-[13px]">
                    <label className="text-[12.5px] font-semibold text-[#1f2327]">Recurrence Frequency</label>
                    <select
                      value={recurringFreq}
                      onChange={(e) => setRecurringFreq(e.target.value as any)}
                      className="h-[38px] w-full rounded-[6px] border border-[#d3d5d7] bg-white px-3 outline-none"
                    >
                      <option value="daily">Daily Broadcast</option>
                      <option value="weekly">Weekly on Mondays (10:00 AM)</option>
                      <option value="monthly">Monthly on 1st of month</option>
                    </select>
                    <p className="text-[12px] text-[#6f777f]">
                      Summary: "Every {recurringFreq === 'weekly' ? 'Monday at 10:00 AM' : recurringFreq} from {scheduledDate}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: REVIEW & SEND */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="border-b border-[#d3d5d7] pb-3">
                  <h3 className="font-bold text-[16px] text-[#1f2327]">Step 5: Final Review & Confirmation</h3>
                  <p className="mt-0.5 text-[13px] text-[#6f777f]">Review targeting, channels, and schedule before dispatching.</p>
                </div>

                <div className="rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] p-4.5 space-y-3.5 text-[13.5px]">
                  <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                    <span className="text-[#6f777f]">Campaign Name:</span>
                    <strong className="text-[#1f2327]">{name}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                    <span className="text-[#6f777f]">Target Audience:</span>
                    <strong className="text-[#00848b]">{audienceType} ({estimatedReach.toLocaleString()} recipients)</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2.5">
                    <span className="text-[#6f777f]">Active Channels:</span>
                    <strong className="text-[#1f2327] uppercase">
                      {[enablePush && 'Push', enableInApp && 'In-App', enableEmail && 'Email'].filter(Boolean).join(' + ')}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6f777f]">Delivery Timing:</span>
                    <strong className="text-[#1f2327]">
                      {scheduleMode === 'now' ? 'Immediate Dispatch' : `${scheduledDate} · ${scheduledTime} (${timezone})`}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Instant Live Preview Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-[#f5f6f8] p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5">
                  <Sparkles className="size-4 text-[#00c2cb]" />
                  <span>Real-time Live Preview</span>
                </span>
                <div className="flex items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewChannel('push')}
                    className={cn('px-2 py-1 rounded font-bold cursor-pointer', previewChannel === 'push' ? 'bg-[#1f2327] text-white' : 'text-[#6f777f]')}
                  >
                    Push
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewChannel('in-app')}
                    className={cn('px-2 py-1 rounded font-bold cursor-pointer', previewChannel === 'in-app' ? 'bg-[#1f2327] text-white' : 'text-[#6f777f]')}
                  >
                    In-App
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewChannel('email')}
                    className={cn('px-2 py-1 rounded font-bold cursor-pointer', previewChannel === 'email' ? 'bg-[#1f2327] text-white' : 'text-[#6f777f]')}
                  >
                    Email
                  </button>
                </div>
              </div>

              {/* Preview 1: Mobile Push Notification */}
              {previewChannel === 'push' && (
                <div className="mx-auto w-[280px] sm:w-[320px] rounded-[32px] border-4 border-[#1f2327] bg-[#0c1015] p-3 text-white shadow-2xl space-y-3">
                  <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#9da4ae]">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <div className="size-2 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-white/10 p-3.5 backdrop-blur-md border border-white/10 space-y-1.5 text-left ant-fade-in">
                    <div className="flex items-center justify-between text-[11px] text-[#d1d5db]">
                      <div className="flex items-center gap-1.5">
                        <div className="size-4 rounded-[4px] bg-[#00c2cb] flex items-center justify-center font-bold text-[9px] text-white">D</div>
                        <span className="font-bold text-white">DUSEAT</span>
                      </div>
                      <span>now</span>
                    </div>
                    <p className="font-bold text-[13.5px] text-white leading-tight">{title || 'Your offer was updated'}</p>
                    <p className="text-[12.5px] text-[#e5e7eb] leading-snug">{body || 'Message preview will appear here in real time...'}</p>
                  </div>
                </div>
              )}

              {/* Preview 2: In-App Notification Center Card */}
              {previewChannel === 'in-app' && (
                <div className="rounded-[12px] border border-[#00c2cb]/40 bg-white p-4 shadow-md space-y-2 text-left ant-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-[#00848b]">{title || 'Your offer was updated'}</span>
                    <span className="text-[11px] text-[#6f777f]">In-App Alert</span>
                  </div>
                  <p className="text-[13px] text-[#1f2327]">{body}</p>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="rounded-[6px] bg-[#00c2cb] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-2xs"
                    >
                      {inAppCta || 'View Request'}
                    </button>
                  </div>
                </div>
              )}

              {/* Preview 3: Desktop Email Preview */}
              {previewChannel === 'email' && (
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-md space-y-3 text-left ant-fade-in">
                  <div className="border-b border-[#d3d5d7] pb-2 text-[12px] text-[#6f777f]">
                    <p><strong>From:</strong> Duseat Notifications &lt;notifications@duseat.com&gt;</p>
                    <p><strong>Subject:</strong> {emailSubject || title}</p>
                  </div>
                  <h4 className="font-bold text-[15px] text-[#1f2327]">{title}</h4>
                  <p className="text-[13px] text-[#475467] leading-relaxed">{body}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] bg-[#fcfcfc] px-6 py-4">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1)
              else onClose()
            }}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onSaveDraft(buildNotificationItem('draft'))}
              className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13.5px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              Save as Draft
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="h-[36px] rounded-[8px] bg-[#1f2327] px-5 text-[13.5px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer"
              >
                Continue
              </button>
            ) : scheduleMode === 'now' ? (
              <button
                type="button"
                onClick={() => setShowConfirmSend(true)}
                className="h-[36px] rounded-[8px] bg-[#00c2cb] px-5 text-[13.5px] font-bold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer shadow-xs"
              >
                Send Now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onScheduleNotification(buildNotificationItem('scheduled'))}
                className="h-[36px] rounded-[8px] bg-[#1f2327] px-5 text-[13.5px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer"
              >
                Schedule Notification
              </button>
            )}
          </div>
        </div>

        {/* Immediate Send Confirmation Modal */}
        {showConfirmSend && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs ant-fade-in">
            <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#e5f6f7] flex items-center justify-center text-[#00c2cb]">
                  <Send className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-[#1f2327]">Send Notification Immediately?</h3>
                  <p className="text-[12.5px] text-[#6f777f]">This action will immediately dispatch to active users.</p>
                </div>
              </div>

              <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 text-[13px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#6f777f]">Audience:</span>
                  <strong className="text-[#1f2327]">{estimatedReach.toLocaleString()} users</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6f777f]">Channels:</span>
                  <strong className="text-[#1f2327]">Push + In-App</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSend(false)}
                  className="h-[34px] rounded-[6px] border border-[#d3d5d7] px-3 text-[13px] font-semibold text-[#1f2327]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmSend(false)
                    onSendNow(buildNotificationItem('sent'))
                  }}
                  className="h-[34px] rounded-[6px] bg-[#00c2cb] px-4 text-[13px] font-bold text-white hover:bg-[#00a8b0]"
                >
                  Confirm & Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// =========================================================================
// SUB-MODAL: CREATE / EDIT TEMPLATE MODAL
// =========================================================================
function CreateTemplateModal({
  isOpen,
  template,
  onClose,
  onSave,
}: {
  isOpen: boolean
  template: NotificationTemplate | null
  onClose: () => void
  onSave: (tpl: NotificationTemplate) => void
}) {
  const [name, setName] = React.useState<string>(template?.name || '')
  const [category, setCategory] = React.useState<NotificationCategory>(template?.category || 'Marketing')
  const [title, setTitle] = React.useState<string>(template?.title || '')
  const [body, setBody] = React.useState<string>(template?.body || '')
  const [channels, setChannels] = React.useState<NotificationChannel[]>(template?.channels || ['push', 'in-app'])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !title.trim() || !body.trim()) return

    onSave({
      id: template?.id || `TPL-${Math.floor(100 + Math.random() * 900)}`,
      name,
      category,
      channels: channels.length ? channels : ['push'],
      title,
      body,
      variables: template?.variables || [],
      lastUpdated: 'Just now',
      createdBy: 'Admin Moderator',
      usageCount: template?.usageCount || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in font-sans">
      <div className="w-full max-w-lg rounded-[14px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
          <h3 className="font-bold text-[17px] text-[#1f2327]">
            {template ? 'Edit Notification Template' : 'Create Notification Template'}
          </h3>
          <button type="button" onClick={onClose} className="text-[#6f777f] hover:text-[#1f2327]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-[13.5px]">
          <div className="space-y-1">
            <label className="font-semibold text-[#1f2327]">Template Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deal Escalation Alert"
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 outline-none focus:border-[#00c2cb]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1f2327]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 outline-none focus:border-[#00c2cb]"
            >
              {NOTIFICATION_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1f2327]">Default Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Your verification status"
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] px-3 outline-none focus:border-[#00c2cb]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1f2327]">Message Body Template</label>
            <textarea
              rows={3}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Include variables like {{first_name}}, {{request_id}}..."
              className="w-full rounded-[8px] border border-[#d3d5d7] p-3 outline-none focus:border-[#00c2cb]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#d3d5d7]">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] rounded-[8px] border border-[#d3d5d7] px-4 text-[13px] font-semibold text-[#1f2327]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[36px] rounded-[8px] bg-[#1f2327] px-4 text-[13px] font-bold text-white hover:bg-[#2e3338]"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
