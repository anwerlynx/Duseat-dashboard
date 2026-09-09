'use client'

import * as React from 'react'
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  RotateCcw,
  Check,
  Filter,
  Columns,
  ArrowUpDown,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// 1. Table Top Controls Bar (Top Toolbar above the table)
// ============================================================================

export interface TableTopBarProps {
  showFilters: boolean
  onToggleFilters: () => void
  searchQuery?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string
  totalResultsCount?: number
  activeFiltersCount?: number
  onResetFilters?: () => void
  // Sort / Rank by controls
  sortOptions?: { label: string; value: string }[]
  sortValue?: string
  onSortChange?: (val: string) => void
  // Segmented view options (e.g. Model / Labs or Ranking / Pareto or Table / Pipeline)
  segmentedOptions?: { label: string; value: string; icon?: React.ReactNode }[]
  segmentedValue?: string
  onSegmentedChange?: (val: string) => void
  // Right side extra actions (Export, Add, Customize Columns)
  actions?: React.ReactNode
  className?: string
}

export function TableTopBar({
  showFilters,
  onToggleFilters,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  totalResultsCount,
  activeFiltersCount = 0,
  onResetFilters,
  sortOptions,
  sortValue,
  onSortChange,
  segmentedOptions,
  segmentedValue,
  onSegmentedChange,
  actions,
  className,
}: TableTopBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 border-b border-[#e5e7eb] bg-white rounded-t-[12px]',
        className
      )}
    >
      {/* Left side: Toggle Filters button + Active Filter Badge */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleFilters}
          className={cn(
            'inline-flex h-[32px] items-center gap-1.5 rounded-[6px] border px-2.5 text-[12px] font-semibold transition-all cursor-pointer select-none',
            showFilters
              ? 'border-[#d3d5d7] bg-[#f4f5f6] text-[#1f2327] hover:bg-[#e9ebed]'
              : 'border-[#d3d5d7] bg-white text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327]'
          )}
        >
          <SlidersHorizontal className="size-3.5 text-[#565e67]" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#00c2cb] px-1 text-[10px] font-bold text-white leading-none">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex h-[28px] items-center gap-1 rounded-[4px] px-2 text-[11.5px] font-medium text-[#6f777f] hover:bg-[#f4f5f6] hover:text-[#d92d20] transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}

        {totalResultsCount !== undefined && (
          <span className="hidden sm:inline text-[12px] text-[#6f777f]">
            ({totalResultsCount.toLocaleString()} items)
          </span>
        )}
      </div>

      {/* Right side: Segmented Toggles, Sort, Search & Actions */}
      <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
        {/* Optional Segmented Control */}
        {segmentedOptions && segmentedOptions.length > 0 && onSegmentedChange && (
          <div className="hidden md:flex items-center rounded-[6px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
            {segmentedOptions.map((opt) => {
              const isSelected = segmentedValue === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSegmentedChange(opt.value)}
                  className={cn(
                    'inline-flex h-[26px] items-center gap-1 rounded-[4px] px-2.5 text-[11.5px] font-semibold transition-all cursor-pointer',
                    isSelected
                      ? 'bg-white text-[#1f2327] shadow-2xs'
                      : 'text-[#6f777f] hover:text-[#1f2327]'
                  )}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Sort / Rank by selector */}
        {sortOptions && sortOptions.length > 0 && onSortChange && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#6f777f]">
            <span className="hidden lg:inline text-[11.5px] font-medium">Rank by:</span>
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Rank or sort by"
              className="h-[32px] rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-medium text-[#1f2327] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Search */}
        {onSearchChange !== undefined && (
          <div className="relative min-w-[140px] max-w-[220px] flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#8f969e]" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-[32px] w-full rounded-[6px] border border-[#d3d5d7] bg-white pl-8 pr-7 text-[12px] text-[#1f2327] placeholder:text-[#8f969e] outline-none hover:border-[#a0a4a8] focus:border-[#00c2cb]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8f969e] hover:text-[#1f2327]"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        )}

        {/* Custom Actions Slot */}
        {actions}
      </div>
    </div>
  )
}

// ============================================================================
// 2. Collapsible Filter Accordion Section (Sidebar Group)
// ============================================================================

export interface FilterSectionProps {
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  badge?: string | number
  children: React.ReactNode
  className?: string
}

// ============================================================================
// 2. Collapsible Filter Card Section (Figma & Duseat Original Design)
// ============================================================================

export interface FilterSectionProps {
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  badge?: string | number
  children: React.ReactNode
  className?: string
}

export function FilterSection({
  title,
  icon,
  defaultOpen = true,
  badge,
  children,
  className,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div
      className={cn(
        'flex flex-col justify-start rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 shadow-2xs transition-all hover:border-[#b8bcbf]',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 text-left group cursor-pointer select-none pb-2 border-b border-[#eff1f3]"
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-[#6f777f] group-hover:text-[#1f2327] shrink-0">{icon}</span>}
          <span className="text-[13px] font-bold text-[#1f2327] truncate leading-tight">{title}</span>
          {badge !== undefined && (
            <span className="rounded-full bg-[#e5f6f7] text-[#00838f] px-1.5 py-0.2 text-[10px] font-bold">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'size-4 text-[#8f969e] transition-transform duration-200 group-hover:text-[#1f2327] shrink-0',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>
      {isOpen && <div className="pt-2.5 space-y-1.5 ant-fade-in">{children}</div>}
    </div>
  )
}

// ============================================================================
// 3. Filter Checkbox Item
// ============================================================================

export interface FilterCheckboxProps {
  id?: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  count?: number | string
  icon?: React.ReactNode
  colorDot?: string
  disabled?: boolean
}

export function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
  count,
  icon,
  colorDot,
  disabled = false,
}: FilterCheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-2 rounded-[8px] px-2.5 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer select-none',
        checked ? 'bg-[#f4f5f6] text-[#1f2327] font-semibold' : 'text-[#565e67] hover:bg-[#fafafa] hover:text-[#1f2327]',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 rounded-[4px] border-[#d3d5d7] text-[#00c2cb] accent-[#00c2cb] focus:ring-[#00c2cb] cursor-pointer"
        />
        {colorDot && <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: colorDot }} />}
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={cn(
            'text-[11.5px] font-medium shrink-0',
            checked ? 'text-[#1f2327]' : 'text-[#8f969e]'
          )}
        >
          {typeof count === 'number' ? count.toLocaleString() : count}
        </span>
      )}
    </label>
  )
}

// ============================================================================
// 4. Filter Radio / Single Select Pill (Workspace Selection)
// ============================================================================

export interface FilterRadioGroupProps {
  options: { label: string; value: string; count?: number; icon?: React.ReactNode }[]
  value: string
  onChange: (val: string) => void
  layout?: 'stack' | 'grid' | 'segmented'
}

export function FilterRadioGroup({ options, value, onChange, layout = 'stack' }: FilterRadioGroupProps) {
  if (layout === 'segmented') {
    return (
      <div className="flex flex-wrap items-center rounded-[8px] border border-[#d3d5d7] bg-[#f4f5f6] p-0.5">
        {options.map((opt) => {
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex-1 min-w-[60px] py-1 px-2.5 text-center text-[12px] font-semibold rounded-[6px] transition-all cursor-pointer',
                isSelected ? 'bg-white text-[#1f2327] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn(layout === 'grid' ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5')}>
      {options.map((opt) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex w-full items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-[12.5px] font-semibold transition-all text-left cursor-pointer select-none',
              isSelected
                ? 'bg-[#14171a] text-white shadow-2xs'
                : 'text-[#565e67] hover:bg-[#f4f5f6] hover:text-[#1f2327]'
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {opt.icon}
              <span className="truncate">{opt.label}</span>
            </div>
            {opt.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[11px] font-bold leading-none',
                  isSelected ? 'bg-white/20 text-white' : 'text-[#8f969e]'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// 5. Filter Range Slider / Min-Max Input
// ============================================================================

export interface FilterRangeProps {
  min: number
  max: number
  minValue: number
  maxValue: number
  step?: number
  unit?: string
  onChange: (min: number, max: number) => void
}

export function FilterRange({
  min,
  max,
  minValue,
  maxValue,
  step = 1,
  unit = '',
  onChange,
}: FilterRangeProps) {
  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center justify-between text-[11.5px] font-semibold text-[#6f777f]">
        <span>
          Min: <strong className="text-[#1f2327]">{minValue.toLocaleString()} {unit}</strong>
        </span>
        <span>
          Max: <strong className="text-[#1f2327]">{maxValue.toLocaleString()} {unit}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => onChange(minValue, Number(e.target.value))}
          className="w-full accent-[#00c2cb] h-1.5 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between text-[10.5px] text-[#8f969e]">
        <span>{min.toLocaleString()} {unit}</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  )
}

// ============================================================================
// 6. Complete Table Layout Container (Top Filter Tray + Full-Width Table)
// ============================================================================

export interface TableLayoutContainerProps {
  showFilters: boolean
  sidebarContent?: React.ReactNode
  filtersContent?: React.ReactNode
  tableContent: React.ReactNode
  sidebarWidth?: string
  className?: string
}

export function TableLayoutContainer({
  showFilters,
  sidebarContent,
  filtersContent,
  tableContent,
  className,
}: TableLayoutContainerProps) {
  const content = filtersContent || sidebarContent

  return (
    <div
      className={cn(
        'flex flex-col rounded-[16px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs min-h-[580px] w-full',
        className
      )}
    >
      {/* Top Filter Cards Tray (Collapsible horizontally above the table) */}
      {showFilters && content && (
        <div className="border-b border-[#e5e7eb] bg-[#fafbfc] p-4 sm:p-5 ant-fade-in">
          {content}
        </div>
      )}

      {/* Main Table Content Container - flex-col with justify-between to keep pagination pinned at the bottom */}
      <main className="flex-1 min-w-0 bg-white flex flex-col justify-between overflow-x-auto">
        {tableContent}
      </main>
    </div>
  )
}

