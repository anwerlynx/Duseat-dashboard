'use client'

import * as React from 'react'
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Check,
  Filter,
  ArrowUpDown,
  Search,
  X,
  Plus,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FigmaTabItem {
  id: string
  label: string
  count?: number
}

export interface FigmaFilterOption {
  label: string
  value: string
  count?: number
}

export interface FigmaFilterChipConfig {
  id: string
  label: string
  options: FigmaFilterOption[]
  selectedValue?: string
  icon?: React.ReactNode
}

export interface FigmaTableFilterHeaderProps {
  // 1. Top Row: Segmented Pills
  tabs?: FigmaTabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void

  // 2. Top Row Actions
  onCustomizeColumns?: () => void
  onResetFilters?: () => void
  showReset?: boolean
  extraActions?: React.ReactNode

  // 3. Second Row: Filter Chips / Dropdowns
  filterChips?: FigmaFilterChipConfig[]
  onFilterChange?: (chipId: string, value: string) => void
  searchQuery?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string

  // 4. Record Counter
  totalCount?: number
  countLabel?: string

  className?: string
}

export function FigmaTableFilterHeader({
  tabs,
  activeTab,
  onTabChange,
  onCustomizeColumns,
  onResetFilters,
  showReset = true,
  extraActions,
  filterChips,
  onFilterChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  totalCount = 0,
  countLabel = 'records found',
  className,
}: FigmaTableFilterHeaderProps) {
  const [openChipId, setOpenChipId] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenChipId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('flex flex-col bg-white select-none', className)} ref={dropdownRef}>
      {/* ROW 1: Segmented Tabs on Left + Columns & Reset on Right */}
      {(tabs && tabs.length > 0) || onCustomizeColumns || onResetFilters || extraActions ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#d3d5d7]">
          {/* Left: Tab Pills */}
          {tabs && tabs.length > 0 && onTabChange ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f7] p-1 overflow-x-auto max-w-full">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'border border-[#00c2cb] bg-white font-bold text-[#0f172a] shadow-xs'
                        : 'text-[#565e67] hover:text-[#0f172a]'
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={cn('ml-1.5 text-[10px]', isActive ? 'text-[#00c2cb] font-bold' : 'text-[#8f969e]')}>
                        ({tab.count})
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div />
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {extraActions}

            {onCustomizeColumns && (
              <button
                type="button"
                onClick={onCustomizeColumns}
                className="inline-flex h-[34px] items-center gap-1.5 rounded-full border border-[#d3d5d7] bg-white px-3.5 text-xs font-medium text-[#344054] shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                <SlidersHorizontal className="size-3.5 text-[#667085]" />
                <span>Columns</span>
              </button>
            )}

            {showReset && onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex size-[34px] items-center justify-center rounded-full border border-[#d3d5d7] bg-white text-[#667085] shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* ROW 2: Filter Chips on Left + Records Count on Right */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-[#d3d5d7]">
        {/* Left Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {filterChips?.map((chip) => {
            const isOpen = openChipId === chip.id
            const selectedOption = chip.options.find((o) => o.value === chip.selectedValue)
            const isSelected = chip.selectedValue && chip.selectedValue !== 'all' && chip.selectedValue !== ''

            return (
              <div key={chip.id} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenChipId(isOpen ? null : chip.id)}
                  className={cn(
                    'inline-flex h-[32px] items-center gap-1.5 rounded-full border px-3 text-xs transition cursor-pointer select-none',
                    isSelected
                      ? 'border-[#00c2cb] bg-teal-50/60 font-bold text-teal-900 shadow-2xs'
                      : 'border-[#d3d5d7] bg-white font-medium text-[#344054] hover:bg-slate-50 hover:border-slate-400'
                  )}
                >
                  {chip.icon || <Filter className="size-3 text-[#667085]" />}
                  <span>
                    {chip.label}: {selectedOption ? selectedOption.label : 'All'}
                  </span>
                  <ChevronDown className={cn('size-3 text-[#667085] transition-transform', isOpen ? 'rotate-180' : '')} />
                </button>

                {/* Popover Dropdown Menu */}
                {isOpen && onFilterChange && (
                  <div className="absolute left-0 top-full mt-1.5 z-40 min-w-[180px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ant-fade-in">
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Filter by {chip.label}
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      {chip.options.map((opt) => {
                        const isOptActive = (chip.selectedValue || 'all') === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              onFilterChange(chip.id, opt.value)
                              setOpenChipId(null)
                            }}
                            className={cn(
                              'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition cursor-pointer',
                              isOptActive
                                ? 'bg-teal-50 font-bold text-teal-900'
                                : 'text-slate-700 hover:bg-slate-50'
                            )}
                          >
                            <span>{opt.label}</span>
                            {isOptActive && <Check className="size-3 text-teal-600" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Optional inline search */}
          {onSearchChange && (
            <div className="relative min-w-[140px] max-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#8f969e]" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-[32px] w-full rounded-full border border-[#d3d5d7] bg-white pl-8 pr-7 text-[12px] text-[#1f2327] placeholder:text-[#8f969e] outline-hidden hover:border-[#a0a4a8] focus:border-[#00c2cb]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f969e] hover:text-[#1f2327]"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Record Counter */}
        <div className="text-xs font-medium text-[#667085] whitespace-nowrap">
          {totalCount.toLocaleString()} {countLabel}
        </div>
      </div>
    </div>
  )
}
