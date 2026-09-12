'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateRange {
  from?: string
  to?: string
  presetName?: string
}

interface DateRangePickerProps {
  value?: string
  onChange?: (val: string) => void
  align?: 'start' | 'end' | 'auto'
}

const PRESET_OPTIONS = [
  'All Time',
  'Today',
  'Yesterday',
  'Today and yesterday',
  'Last 7 days',
  'Last 14 days',
  'Last 28 days',
  'This week',
  'This month',
  'Last month',
  'Maximum',
]

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const YEARS = ['2023', '2024', '2025', '2026', '2027']

// Reference "Today" anchor for mockup consistency (July 14, 2026)
const ANCHOR_YEAR = 2026
const ANCHOR_MONTH_INDEX = 6 // July (0-indexed)
const ANCHOR_DAY = 14

export function DateRangePicker({ value = 'All Time', onChange, align = 'auto' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Current display month & year
  const [displayYear, setDisplayYear] = React.useState(ANCHOR_YEAR)
  const [displayMonthIndex, setDisplayMonthIndex] = React.useState(ANCHOR_MONTH_INDEX)

  // Selection state
  const [selectedPreset, setSelectedPreset] = React.useState<string>(value)
  const [rangeStart, setRangeStart] = React.useState<number | null>(null)
  const [rangeEnd, setRangeEnd] = React.useState<number | null>(null)
  const [hoverDay, setHoverDay] = React.useState<number | null>(null)

  // Dropdown controls inside calendar header
  const [monthDropdownOpen, setMonthDropdownOpen] = React.useState(false)
  const [yearDropdownOpen, setYearDropdownOpen] = React.useState(false)

  // Popover positioning
  const [popoverCoords, setPopoverCoords] = React.useState<{ top: number; left: number } | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Synchronize when value changes externally
  React.useEffect(() => {
    if (value) {
      applyPresetLogic(value, false)
    }
  }, [value])

  // Compute position relative to viewport
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()

    const popoverWidth = 500
    const popoverHeight = 390

    // Horizontal position
    let left = rect.left
    if (align === 'end' || rect.left + popoverWidth > window.innerWidth - 16) {
      left = Math.max(16, rect.right - popoverWidth)
    } else {
      left = Math.max(16, rect.left)
    }

    // Vertical position
    let top = rect.bottom + 6
    if (top + popoverHeight > window.innerHeight - 12 && rect.top - popoverHeight > 12) {
      top = rect.top - popoverHeight - 6
    }

    setPopoverCoords({ top, left })
  }, [align])

  React.useEffect(() => {
    if (!isOpen) {
      setPopoverCoords(null)
      return
    }

    updatePosition()
    const handleScrollOrResize = () => updatePosition()
    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)

    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isOpen, updatePosition])

  // Close on outside click or escape
  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!isOpen) return
      const target = e.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false)
        setMonthDropdownOpen(false)
        setYearDropdownOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setMonthDropdownOpen(false)
        setYearDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Apply preset logic
  const applyPresetLogic = (preset: string, notifyParent = true) => {
    setSelectedPreset(preset)

    if (preset === 'All Time' || preset === 'Maximum') {
      setRangeStart(null)
      setRangeEnd(null)
      if (notifyParent) onChange?.(preset)
      return
    }

    // Reference anchor: July 14, 2026
    setDisplayYear(ANCHOR_YEAR)
    setDisplayMonthIndex(ANCHOR_MONTH_INDEX)

    if (preset === 'Today') {
      setRangeStart(ANCHOR_DAY)
      setRangeEnd(ANCHOR_DAY)
    } else if (preset === 'Yesterday') {
      setRangeStart(ANCHOR_DAY - 1)
      setRangeEnd(ANCHOR_DAY - 1)
    } else if (preset === 'Today and yesterday') {
      setRangeStart(ANCHOR_DAY - 1)
      setRangeEnd(ANCHOR_DAY)
    } else if (preset === 'Last 7 days') {
      // 7 days ending at anchor: 8, 9, 10, 11, 12, 13, 14
      setRangeStart(8)
      setRangeEnd(14)
    } else if (preset === 'Last 14 days') {
      // 14 days ending at anchor: 1 to 14
      setRangeStart(1)
      setRangeEnd(14)
    } else if (preset === 'Last 28 days') {
      setRangeStart(1)
      setRangeEnd(28)
    } else if (preset === 'This week') {
      setRangeStart(12) // Sunday
      setRangeEnd(18) // Saturday
    } else if (preset === 'This month') {
      setRangeStart(1)
      setRangeEnd(31)
    } else if (preset === 'Last month') {
      setDisplayMonthIndex(5) // June
      setRangeStart(1)
      setRangeEnd(30)
    }

    if (notifyParent) {
      onChange?.(preset)
    }
  }

  // Handle clicking a day on the calendar
  const handleDayClick = (day: number) => {
    if (rangeStart === null || (rangeStart !== null && rangeEnd !== null)) {
      // Start a new range selection
      setRangeStart(day)
      setRangeEnd(null)
      setSelectedPreset('Custom')
    } else {
      // Complete range selection
      if (day >= rangeStart) {
        setRangeEnd(day)
        const label = `${MONTH_NAMES[displayMonthIndex]} ${rangeStart} – ${MONTH_NAMES[displayMonthIndex]} ${day}, ${displayYear}`
        setSelectedPreset(label)
        onChange?.(label)
      } else {
        setRangeEnd(rangeStart)
        setRangeStart(day)
        const label = `${MONTH_NAMES[displayMonthIndex]} ${day} – ${MONTH_NAMES[displayMonthIndex]} ${rangeStart}, ${displayYear}`
        setSelectedPreset(label)
        onChange?.(label)
      }
    }
  }

  // Days grid generation for display month
  const firstDayOfWeek = new Date(displayYear, displayMonthIndex, 1).getDay()
  const daysInMonth = new Date(displayYear, displayMonthIndex + 1, 0).getDate()

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d)
  }

  const handlePrevMonth = () => {
    if (displayMonthIndex === 0) {
      setDisplayMonthIndex(11)
      setDisplayYear((y) => y - 1)
    } else {
      setDisplayMonthIndex((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (displayMonthIndex === 11) {
      setDisplayMonthIndex(0)
      setDisplayYear((y) => y + 1)
    } else {
      setDisplayMonthIndex((m) => m + 1)
    }
  }

  const handleConfirm = () => {
    if (selectedPreset) {
      onChange?.(selectedPreset)
    } else if (rangeStart !== null) {
      const label = rangeEnd !== null && rangeEnd !== rangeStart
        ? `${MONTH_NAMES[displayMonthIndex]} ${rangeStart} – ${MONTH_NAMES[displayMonthIndex]} ${rangeEnd}, ${displayYear}`
        : `${MONTH_NAMES[displayMonthIndex]} ${rangeStart}, ${displayYear}`
      onChange?.(label)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block font-sans">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex h-[38px] items-center gap-2 rounded-[8px] border bg-white px-3 text-[14px] font-medium transition-all cursor-pointer shadow-2xs select-none',
          isOpen || (selectedPreset && selectedPreset !== 'All Time')
            ? 'border-[#00c2cb] text-[#1f2327] ring-2 ring-[#00c2cb]/15'
            : 'border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]'
        )}
      >
        <CalendarIcon className="size-4 text-[#6f777f]" />
        <span className="whitespace-nowrap">{selectedPreset || value}</span>
        <ChevronDown className={cn('size-3.5 text-[#9da4ae] transition-transform duration-200', isOpen && 'rotate-180 text-[#00c2cb]')} />
      </button>

      {/* Popover Portal */}
      {mounted && isOpen && popoverCoords && createPortal(
        <div
          ref={popoverRef}
          style={{ top: `${popoverCoords.top}px`, left: `${popoverCoords.left}px` }}
          className="fixed z-[9999] flex w-[500px] rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans"
        >
          {/* Left Column: Presets List */}
          <div className="w-[170px] border-r border-[#d3d5d7] bg-[#f8f9fa] p-2 flex flex-col justify-between shrink-0">
            <div className="space-y-0.5">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#6f777f]">
                Range Presets
              </div>
              {PRESET_OPTIONS.map((item) => {
                const isActive = selectedPreset === item
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => applyPresetLogic(item, true)}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors cursor-pointer flex items-center justify-between',
                      isActive
                        ? 'bg-[#e5f6f7] text-[#008b94] font-bold shadow-2xs'
                        : 'text-[#1f2327] hover:bg-[#eff1f3] font-medium'
                    )}
                  >
                    <span>{item}</span>
                    {isActive && <Check className="size-3.5 text-[#00c2cb] shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="pt-2 border-t border-[#d3d5d7] px-1">
              <button
                type="button"
                onClick={() => applyPresetLogic('All Time', true)}
                className="w-full text-center py-1 text-[12px] font-semibold text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3] rounded transition-colors"
              >
                Reset to All Time
              </button>
            </div>
          </div>

          {/* Right Column: Single Clean Month Calendar */}
          <div className="flex-1 p-4 flex flex-col justify-between bg-white">
            <div>
              {/* Header: Month / Year selection & Navigation */}
              <div className="flex items-center justify-between pb-3 border-b border-[#eff1f3]">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3] rounded-[6px] transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <div className="flex items-center gap-2">
                  {/* Month Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setMonthDropdownOpen(!monthDropdownOpen)
                        setYearDropdownOpen(false)
                      }}
                      className="flex items-center gap-1 text-[14px] font-bold text-[#1f2327] hover:text-[#00c2cb] px-2 py-1 rounded hover:bg-[#eff1f3] transition-colors"
                    >
                      <span>{MONTH_NAMES[displayMonthIndex]}</span>
                      <ChevronDown className="size-3 text-[#9da4ae]" />
                    </button>

                    {monthDropdownOpen && (
                      <div className="absolute left-0 top-[30px] z-50 w-[90px] max-h-[180px] overflow-y-auto rounded-[8px] border border-[#d3d5d7] bg-white p-1 shadow-lg space-y-0.5">
                        {MONTH_NAMES.map((m, idx) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setDisplayMonthIndex(idx)
                              setMonthDropdownOpen(false)
                            }}
                            className={cn(
                              'w-full text-left px-2 py-1 text-xs rounded transition-colors',
                              displayMonthIndex === idx ? 'bg-[#e5f6f7] text-[#00c2cb] font-bold' : 'hover:bg-[#eff1f3] text-[#1f2327]'
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Year Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setYearDropdownOpen(!yearDropdownOpen)
                        setMonthDropdownOpen(false)
                      }}
                      className="flex items-center gap-1 text-[14px] font-bold text-[#1f2327] hover:text-[#00c2cb] px-2 py-1 rounded hover:bg-[#eff1f3] transition-colors"
                    >
                      <span>{displayYear}</span>
                      <ChevronDown className="size-3 text-[#9da4ae]" />
                    </button>

                    {yearDropdownOpen && (
                      <div className="absolute left-0 top-[30px] z-50 w-[80px] max-h-[180px] overflow-y-auto rounded-[8px] border border-[#d3d5d7] bg-white p-1 shadow-lg space-y-0.5">
                        {YEARS.map((y) => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => {
                              setDisplayYear(Number(y))
                              setYearDropdownOpen(false)
                            }}
                            className={cn(
                              'w-full text-left px-2 py-1 text-xs rounded transition-colors',
                              displayYear === Number(y) ? 'bg-[#e5f6f7] text-[#00c2cb] font-bold' : 'hover:bg-[#eff1f3] text-[#1f2327]'
                            )}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3] rounded-[6px] transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#6f777f] uppercase py-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="py-0.5">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="h-8 w-full" />

                  // Determine selection state
                  const isStart = rangeStart !== null && day === rangeStart
                  const isEnd = rangeEnd !== null && day === rangeEnd
                  const isSingleDay = isStart && (rangeEnd === null || rangeStart === rangeEnd)

                  const effectiveEnd = rangeEnd !== null ? rangeEnd : hoverDay

                  const isInRange =
                    rangeStart !== null &&
                    effectiveEnd !== null &&
                    ((day >= rangeStart && day <= effectiveEnd) || (day <= rangeStart && day >= effectiveEnd))

                  return (
                    <div
                      key={`day-${day}`}
                      className={cn(
                        'h-8 flex items-center justify-center relative transition-colors',
                        isInRange && !isStart && 'bg-[#e5f6f7]',
                        isStart && isInRange && rangeStart !== effectiveEnd && 'bg-gradient-to-r from-transparent to-[#e5f6f7]',
                        isEnd && 'rounded-r-full',
                        isStart && 'rounded-l-full'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleDayClick(day)}
                        onMouseEnter={() => setHoverDay(day)}
                        onMouseLeave={() => setHoverDay(null)}
                        className={cn(
                          'size-8 flex items-center justify-center text-[13px] transition-all cursor-pointer select-none outline-none',
                          isStart
                            ? 'rounded-full bg-[#00c2cb] text-white font-bold shadow-xs z-10'
                            : isEnd
                            ? 'rounded-full bg-[#00c2cb] text-white font-bold shadow-xs z-10'
                            : isInRange
                            ? 'text-[#00757d] font-bold rounded-none hover:bg-[#d5f1f3]'
                            : 'rounded-full text-[#1f2327] hover:bg-[#eff1f3] font-medium'
                        )}
                      >
                        {day}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer Summary & Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eff1f3] mt-2">
              <div className="text-[12px] font-medium text-[#6f777f] truncate max-w-[170px]">
                {rangeStart !== null ? (
                  <span className="text-[#1f2327] font-semibold">
                    {MONTH_NAMES[displayMonthIndex]} {rangeStart}
                    {rangeEnd !== null && rangeEnd !== rangeStart ? ` – ${rangeEnd}` : ''}
                  </span>
                ) : (
                  <span>{selectedPreset || 'No date range'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-[32px] px-3 rounded-[6px] border border-[#d3d5d7] bg-white text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="h-[32px] px-4 rounded-[6px] bg-[#00c2cb] text-[13px] font-bold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer shadow-2xs"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
