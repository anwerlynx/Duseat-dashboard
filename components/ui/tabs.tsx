'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CountBadge } from './count-badge'

export interface TabItem {
  id: string
  label: string
  href?: string
  count?: number | string
  icon?: React.ComponentType<{ className?: string }>
  badgeVariant?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive' | 'active' | 'outline'
  countTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive' | 'active' | 'outline' | string
  disabled?: boolean
}

function resolveTabHref(id: string, customHref?: string, paramName: string = 'tab') {
  if (customHref) return customHref
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href)
      url.searchParams.set(paramName, id)
      return url.pathname + url.search
    } catch {
      return `?${paramName}=${encodeURIComponent(id)}`
    }
  }
  return `?${paramName}=${encodeURIComponent(id)}`
}

/* ========================================================================== */
/* VARIANT 1: FILTER TABS WITH COUNT BADGES (For datasets, tables, queues)     */
/* ========================================================================== */
export interface FilterTabsProps {
  tabs: TabItem[]
  activeTab?: string
  value?: string
  onChange: (tabId: string) => void
  size?: 'sm' | 'md'
  className?: string
  layout?: 'pills' | 'underline' | 'contained'
  paramName?: string
}

export function FilterTabs({
  tabs,
  activeTab,
  value,
  onChange,
  size = 'md',
  className,
  layout = 'pills',
  paramName = 'tab',
}: FilterTabsProps) {
  const currentTab = value !== undefined ? value : activeTab || ''

  if (layout === 'underline') {
    return (
      <div className={cn('flex items-center gap-6 border-b border-[#d3d5d7]', className)}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          const href = resolveTabHref(tab.id, tab.href, paramName)
          return (
            <a
              key={tab.id}
              href={tab.disabled ? undefined : href}
              onClick={(e) => {
                if (tab.disabled) {
                  e.preventDefault()
                  return
                }
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                  return
                }
                e.preventDefault()
                onChange(tab.id)
              }}
              className={cn(
                'relative flex items-center gap-2 pb-3 pt-1 text-[14px] font-medium transition-colors cursor-pointer select-none no-underline',
                tab.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                isActive
                  ? 'text-[#1f2327] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00c2cb]'
                  : 'text-[#6f777f] hover:text-[#1f2327]'
              )}
            >
              {Icon && <Icon className="size-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <CountBadge
                  count={tab.count}
                  variant={(isActive ? 'brand' : (tab.countTone as any) || tab.badgeVariant || 'neutral')}
                  size={size === 'sm' ? 'sm' : 'md'}
                />
              )}
            </a>
          )
        })}
      </div>
    )
  }

  if (layout === 'contained') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-[8px] bg-[#eff1f3] p-1 gap-1 border border-[#d3d5d7]/50',
          className
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          const href = resolveTabHref(tab.id, tab.href, paramName)
          return (
            <a
              key={tab.id}
              href={tab.disabled ? undefined : href}
              onClick={(e) => {
                if (tab.disabled) {
                  e.preventDefault()
                  return
                }
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                  return
                }
                e.preventDefault()
                onChange(tab.id)
              }}
              className={cn(
                'flex items-center gap-2 rounded-[6px] px-3 font-medium transition-all cursor-pointer select-none no-underline',
                tab.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                size === 'sm' ? 'h-[28px] text-[12px]' : 'h-[32px] text-[13px]',
                isActive
                  ? 'bg-white text-[#1f2327] font-bold shadow-xs'
                  : 'text-[#6f777f] hover:text-[#1f2327]'
              )}
            >
              {Icon && <Icon className="size-3.5" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <CountBadge
                  count={tab.count}
                  variant={isActive ? 'neutral' : (tab.countTone as any) || 'outline'}
                  size="sm"
                />
              )}
            </a>
          )
        })}
      </div>
    )
  }

  // Default: Pills layout
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = currentTab === tab.id
        const href = resolveTabHref(tab.id, tab.href, paramName)
        return (
          <a
            key={tab.id}
            href={tab.disabled ? undefined : href}
            onClick={(e) => {
              if (tab.disabled) {
                e.preventDefault()
                return
              }
              if (e.ctrlKey || e.metaKey || e.button === 1) {
                return
              }
              e.preventDefault()
              onChange(tab.id)
            }}
            className={cn(
              'flex items-center gap-2 rounded-[8px] px-3.5 font-medium transition-colors cursor-pointer select-none ant-wave-btn no-underline',
              tab.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
              size === 'sm' ? 'h-[32px] text-[13px]' : 'h-[36px] text-[14px]',
              isActive
                ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
            )}
          >
            {Icon && <Icon className="size-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <CountBadge
                count={tab.count}
                variant={isActive ? 'active' : (tab.countTone as any) || (tab.badgeVariant as any) || 'neutral'}
                size={size === 'sm' ? 'sm' : 'md'}
              />
            )}
          </a>
        )
      })}
    </div>
  )
}

/* ========================================================================== */
/* VARIANT 2: NAVIGATION TABS (For switching page views/sections)             */
/* ========================================================================== */
export interface NavigationTabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  paramName?: string
}

export function NavigationTabs({
  tabs,
  activeTab,
  onChange,
  size = 'md',
  className,
  paramName = 'tab',
}: NavigationTabsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        const href = resolveTabHref(tab.id, tab.href, paramName)
        return (
          <a
            key={tab.id}
            href={tab.disabled ? undefined : href}
            onClick={(e) => {
              if (tab.disabled) {
                e.preventDefault()
                return
              }
              if (e.ctrlKey || e.metaKey || e.button === 1) {
                return
              }
              e.preventDefault()
              onChange(tab.id)
            }}
            className={cn(
              'flex items-center gap-2 rounded-[8px] px-3.5 font-medium transition-colors cursor-pointer select-none ant-wave-btn no-underline',
              tab.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
              size === 'sm'
                ? 'h-[32px] text-[13px]'
                : size === 'lg'
                ? 'h-[40px] text-[15px]'
                : 'h-[36px] text-[14px]',
              isActive
                ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
            )}
          >
            {Icon && <Icon className="size-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <CountBadge
                count={tab.count}
                variant={isActive ? 'active' : 'neutral'}
                size="sm"
              />
            )}
          </a>
        )
      })}
    </div>
  )
}

/* ========================================================================== */
/* VARIANT 3: STATUS FILTER CHIPS BAR (Standardized across all modules)      */
/* ========================================================================== */
export interface StatusFilterTabsProps {
  options?: {
    id: string
    label: string
    href?: string
    count?: number | string
    countTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive' | 'active' | 'outline' | string
  }[]
  tabs?: { id: string; label: string; href?: string }[]
  counts?: Record<string, number | string>
  activeStatus?: string
  activeTab?: string
  onChange: (statusId: string) => void
  size?: 'sm' | 'md'
  variant?: 'default' | 'pills'
  className?: string
  paramName?: string
}

export function StatusFilterTabs({
  options,
  tabs,
  counts,
  activeStatus,
  activeTab,
  onChange,
  size = 'md',
  variant = 'default',
  className,
  paramName = 'status',
}: StatusFilterTabsProps) {
  const currentActive = activeStatus || activeTab || 'All'

  // Normalize list of tab items
  const items = React.useMemo(() => {
    if (options && Array.isArray(options)) return options
    if (tabs && Array.isArray(tabs)) {
      return tabs.map((t) => ({
        id: t.id,
        label: t.label,
        href: t.href,
        count: counts ? counts[t.id] : undefined,
      }))
    }
    return []
  }, [options, tabs, counts])

  const getSemanticTone = (id: string, optTone?: string) => {
    if (optTone) return optTone
    const norm = id.toLowerCase()
    if (norm.includes('verified') || norm.includes('approved') || norm.includes('accepted') || norm.includes('active')) return 'success'
    if (norm.includes('pending') || norm.includes('review') || norm.includes('open')) return 'warning'
    if (norm.includes('reject') || norm.includes('suspend') || norm.includes('ban') || norm.includes('flag') || norm.includes('expired') || norm.includes('archive') || norm.includes('failed') || norm.includes('cancelled')) return 'destructive'
    return 'neutral'
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((opt) => {
        const isActive = currentActive.toLowerCase() === opt.id.toLowerCase()
        const tone = getSemanticTone(opt.id, (opt as any).countTone)
        const href = resolveTabHref(opt.id, (opt as any).href, paramName)

        return (
          <a
            key={opt.id}
            href={href}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey || e.button === 1) {
                return
              }
              e.preventDefault()
              onChange(opt.id)
            }}
            className={cn(
              'flex items-center gap-2 rounded-[8px] px-3.5 font-medium transition-colors cursor-pointer select-none ant-wave-btn no-underline',
              size === 'sm' ? 'h-[32px] text-[13px]' : 'h-[36px] text-[14px]',
              isActive
                ? 'bg-[#1f2327] text-white shadow-2xs font-semibold'
                : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
            )}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <CountBadge
                count={opt.count}
                variant={isActive ? 'active' : (tone as any)}
                size={size === 'sm' ? 'sm' : 'md'}
              />
            )}
          </a>
        )
      })}
    </div>
  )
}
